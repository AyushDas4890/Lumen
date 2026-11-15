import {useSyncExternalStore} from 'react';

export type Booking = {
  code: string;
  doctorId: string;
  date: string; // ISO yyyy-mm-dd
  time: string; // HH:mm
  visitType: string;
  name: string;
  email: string;
  phone: string;
  reason: string;
  createdAt: string;
};

const KEY = 'lumenpath.bookings.v1';
const listeners = new Set<() => void>();
let cache: Booking[] | null = null;

function read(): Booking[] {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as Booking[]) : [];
  } catch (error) {
    console.error('Could not read saved bookings; starting empty.', error);
    cache = [];
  }
  return cache;
}

function write(next: Booking[]): void {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch (error) {
    console.error('Could not persist bookings; they will last for this tab only.', error);
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useBookings(): Booking[] {
  return useSyncExternalStore(subscribe, read, read);
}

function makeCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = 'LP-';
  for (let i = 0; i < 6; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

export function isSlotTaken(doctorId: string, date: string, time: string): boolean {
  return read().some((b) => b.doctorId === doctorId && b.date === date && b.time === time);
}

export function addBooking(input: Omit<Booking, 'code' | 'createdAt'>): Booking {
  if (isSlotTaken(input.doctorId, input.date, input.time)) {
    throw new Error('That time was just taken. Please choose another slot.');
  }
  const booking: Booking = {...input, code: makeCode(), createdAt: new Date().toISOString()};
  write([...read(), booking]);
  return booking;
}

export function cancelBooking(code: string): void {
  write(read().filter((b) => b.code !== code));
}

/** Deterministic pseudo-random so each doctor/day shows a stable mix of open and taken slots. */
function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const SLOT_TIMES = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
];

export function slotsFor(doctorId: string, date: string): {time: string; available: boolean}[] {
  return SLOT_TIMES.map((time) => {
    const busyByClinic = hash(`${doctorId}|${date}|${time}`) % 100 < 55;
    return {time, available: !busyByClinic && !isSlotTaken(doctorId, date, time)};
  });
}

export type Opening = {date: string; time: string};

/** The next open slots for a doctor, starting today, weekdays only, skipping times already past. */
export function nextOpenings(doctorId: string, count: number, from: Date = new Date()): Opening[] {
  const found: Opening[] = [];
  const cursor = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  for (let day = 0; day < 30 && found.length < count; day++) {
    const weekday = cursor.getDay();
    if (weekday !== 0 && weekday !== 6) {
      const y = cursor.getFullYear();
      const m = String(cursor.getMonth() + 1).padStart(2, '0');
      const d = String(cursor.getDate()).padStart(2, '0');
      const date = `${y}-${m}-${d}`;
      for (const slot of slotsFor(doctorId, date)) {
        if (!slot.available) continue;
        const [h, min] = slot.time.split(':').map(Number);
        const isPast = day === 0 && (h * 60 + min <= from.getHours() * 60 + from.getMinutes());
        if (!isPast && found.length < count) found.push({date, time: slot.time});
      }
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return found;
}
