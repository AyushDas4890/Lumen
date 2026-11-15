import type {ISODateString} from '@astryxdesign/core/Calendar';

export type {ISODateString};

export function toISO(date: Date): ISODateString {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}` as ISODateString;
}

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function isISODate(value: string | null): value is ISODateString {
  return value !== null && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(parseISO(value).getTime());
}

export function formatDate(iso: string): string {
  return parseISO(iso).toLocaleDateString(undefined, {weekday: 'long', month: 'long', day: 'numeric'});
}

export function formatDateShort(iso: string): string {
  return parseISO(iso).toLocaleDateString(undefined, {weekday: 'short', month: 'short', day: 'numeric'});
}

export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${suffix}`;
}
