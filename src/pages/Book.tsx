import {useMemo, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {Button} from '@astryxdesign/core/Button';
import {Avatar} from '@astryxdesign/core/Avatar';
import {Calendar} from '@astryxdesign/core/Calendar';
import {SegmentedControl, SegmentedControlItem} from '@astryxdesign/core/SegmentedControl';
import {TextInput} from '@astryxdesign/core/TextInput';
import {TextArea} from '@astryxdesign/core/TextArea';
import {Selector} from '@astryxdesign/core/Selector';
import {useToast} from '@astryxdesign/core/Toast';
import {PageHead} from '../components/PageHead';
import {PathSteps} from '../components/PathSteps';
import {Icon} from '../components/Icon';
import {addBooking, slotsFor, type Booking} from '../bookings';
import {departmentOf, departments, doctorOf, doctors, visitTypes} from '../data';
import {formatDate, formatTime, isISODate, toISO, type ISODateString} from '../dates';

const STEPS = ['Clinician', 'Date and time', 'Your details', 'Confirm'];

type Details = {name: string; email: string; phone: string; reason: string};
type Errors = Partial<Record<keyof Details, string>>;

function validate(d: Details): Errors {
  const errors: Errors = {};
  if (d.name.trim().length < 2) errors.name = 'Enter your full name';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) errors.email = 'Enter a valid email address';
  if (d.phone.replace(/\D/g, '').length < 7) errors.phone = 'Enter a phone number with at least 7 digits';
  return errors;
}

export default function Book() {
  const [params] = useSearchParams();
  const presetDoctor = params.get('doctor');
  const presetDept = params.get('dept');
  const presetDate = params.get('date');
  const presetTime = params.get('time');
  const presetVisit = params.get('visit');

  const initialDoctor = presetDoctor && doctors.some((d) => d.id === presetDoctor) ? presetDoctor : '';
  const presetSlotValid =
    initialDoctor !== '' && isISODate(presetDate) && presetTime !== null &&
    slotsFor(initialDoctor, presetDate).some((s) => s.time === presetTime && s.available);

  const [deptId, setDeptId] = useState<string>(
    initialDoctor ? doctorOf(initialDoctor).departmentId : presetDept && departments.some((d) => d.id === presetDept) ? presetDept : departments[0].id,
  );
  const [doctorId, setDoctorId] = useState(initialDoctor);
  const [visitType, setVisitType] = useState(visitTypes.some((v) => v.id === presetVisit) && presetVisit ? presetVisit : visitTypes[0].id);
  const [date, setDate] = useState<ISODateString | ''>(presetSlotValid && isISODate(presetDate) ? presetDate : '');
  const [time, setTime] = useState(presetSlotValid && presetTime ? presetTime : '');
  const [details, setDetails] = useState<Details>({name: '', email: '', phone: '', reason: ''});
  const [errors, setErrors] = useState<Errors>({});
  const [step, setStep] = useState(presetSlotValid ? 2 : initialDoctor ? 1 : 0);
  const [confirmed, setConfirmed] = useState<Booking | null>(null);
  const [submitError, setSubmitError] = useState('');
  const toast = useToast();

  const today = useMemo(() => new Date(), []);
  const minDate = toISO(today);
  const maxDate = toISO(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 60));

  const deptDoctors = doctors.filter((d) => d.departmentId === deptId);
  const doctor = doctorId ? doctorOf(doctorId) : null;
  const slots = doctor && date ? slotsFor(doctor.id, date) : [];
  const canContinue = [Boolean(doctor), Boolean(date && time), true, true][step];

  const next = () => {
    if (step === 2) {
      const found = validate(details);
      setErrors(found);
      if (Object.keys(found).length > 0) return;
    }
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const confirm = () => {
    if (!doctor) return;
    setSubmitError('');
    try {
      const booking = addBooking({
        doctorId: doctor.id, date, time, visitType,
        name: details.name.trim(), email: details.email.trim(), phone: details.phone.trim(), reason: details.reason.trim(),
      });
      setConfirmed(booking);
      toast({body: `Booked with ${doctor.name}. Code ${booking.code}`});
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong. Try again.');
      setTime('');
      setStep(1);
    }
  };

  if (confirmed) return <Success booking={confirmed} />;

  return (
    <>
      <PageHead trail={[{label: 'Book a visit'}]} title="Book a visit">
        Choose a clinician, pick a time and confirm. It takes about a minute.
      </PageHead>
      <div className="container lp-book">
        <div className="lp-panel">
          <PathSteps steps={STEPS} current={step} />

          {step === 0 && (
            <div className="lp-pane lp-stack" key="s0">
              <Selector
                label="Specialty"
                value={deptId}
                options={departments.map((d) => ({value: d.id, label: d.name}))}
                onChange={(v) => { setDeptId(v); setDoctorId(''); setDate(''); setTime(''); }}
                width="100%"
              />
              <div className="lp-picks" role="group" aria-label="Clinicians">
                {deptDoctors.map((d) => (
                  <button key={d.id} className="lp-pick" aria-pressed={doctorId === d.id} onClick={() => { setDoctorId(d.id); setTime(''); }}>
                    <Avatar name={d.name.replace('Dr. ', '')} size={48} />
                    <span className="lp-pick-main">
                      <b>{d.name}</b>
                      <span>{d.title} · {d.years} years · {d.languages.join(', ')}</span>
                    </span>
                    <span className="lp-pick-fee">${d.fee}</span>
                  </button>
                ))}
              </div>
              <div className="lp-field">
                <span className="lp-field-label">Visit type</span>
                <SegmentedControl label="Visit type" value={visitType} onChange={setVisitType}>
                  {visitTypes.map((v) => <SegmentedControlItem key={v.id} value={v.id} label={v.label} />)}
                </SegmentedControl>
              </div>
            </div>
          )}

          {step === 1 && doctor && (
            <div className="lp-pane" key="s1">
              {submitError && <p role="alert" className="lp-error">{submitError}</p>}
              <div className="lp-datetime">
                <div>
                  <span className="lp-field-label">Date, weekdays only</span>
                  <Calendar
                    value={date || null}
                    min={minDate}
                    max={maxDate}
                    dateConstraints={[(d) => d.getDay() !== 0 && d.getDay() !== 6]}
                    onChange={(iso) => { setDate(iso); setTime(''); }}
                  />
                </div>
                <div className="lp-times">
                  <span className="lp-field-label">{date ? `Times on ${formatDate(date)}` : 'Choose a date to see times'}</span>
                  {date && (
                    <div className="lp-slots" role="group" aria-label="Available times">
                      {slots.map((s) => (
                        <button key={s.time} className="slot-btn" disabled={!s.available} aria-pressed={time === s.time} onClick={() => setTime(s.time)}>
                          {formatTime(s.time)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="lp-pane lp-form-grid" key="s2">
              <TextInput label="Full name" value={details.name} onChange={(v) => setDetails({...details, name: v})} isRequired autoComplete="name" status={errors.name ? {type: 'error', message: errors.name} : undefined} />
              <TextInput label="Email" type="email" value={details.email} onChange={(v) => setDetails({...details, email: v})} isRequired autoComplete="email" status={errors.email ? {type: 'error', message: errors.email} : undefined} />
              <div className="lp-span">
                <TextInput label="Phone" type="tel" value={details.phone} onChange={(v) => setDetails({...details, phone: v})} isRequired autoComplete="tel" status={errors.phone ? {type: 'error', message: errors.phone} : undefined} />
              </div>
              <div className="lp-span">
                <TextArea label="Reason for visit" value={details.reason} onChange={(v) => setDetails({...details, reason: v})} isOptional description="Anything the clinician should know ahead of time" />
              </div>
            </div>
          )}

          {step === 3 && doctor && (
            <div className="lp-pane lp-stack" key="s3">
              <h2 className="h3">Review your visit</h2>
              <p className="lp-muted">Check the summary, then confirm. You can go back to change anything.</p>
              {submitError && <p role="alert" className="lp-error">{submitError}</p>}
            </div>
          )}

          <div className="lp-actions">
            <Button label="Back" variant="ghost" isDisabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))} />
            {step < STEPS.length - 1 ? (
              <Button label="Continue" variant="primary" isDisabled={!canContinue} onClick={next} />
            ) : (
              <Button label="Confirm visit" variant="primary" size="lg" onClick={confirm} />
            )}
          </div>
        </div>

        <aside className="lp-summary" aria-label="Visit summary">
          <h2 className="h3">Your visit</h2>
          <dl>
            <div><dt>Clinician</dt><dd className={doctor ? '' : 'lp-muted'}>{doctor ? `${doctor.name}, ${departmentOf(doctor.departmentId).name}` : 'Not chosen'}</dd></div>
            <div><dt>Visit type</dt><dd>{visitTypes.find((v) => v.id === visitType)?.label}</dd></div>
            <div><dt>When</dt><dd className={date && time ? '' : 'lp-muted'}>{date && time ? `${formatDate(date)}, ${formatTime(time)}` : 'Not chosen'}</dd></div>
            {step >= 2 && <div><dt>Patient</dt><dd className={details.name ? '' : 'lp-muted'}>{details.name || 'Not entered'}</dd></div>}
            {doctor && <div><dt>Consultation fee</dt><dd>${doctor.fee}</dd></div>}
          </dl>
        </aside>
      </div>
    </>
  );
}

function buildICS(b: Booking): string {
  const doc = doctorOf(b.doctorId);
  const day = b.date.replace(/-/g, '');
  const [h, m] = b.time.split(':').map(Number);
  const endMinutes = h * 60 + m + 30;
  const end = `${day}T${String(Math.floor(endMinutes / 60)).padStart(2, '0')}${String(endMinutes % 60).padStart(2, '0')}00`;
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//LumenPath Health//EN', 'BEGIN:VEVENT',
    `UID:${b.code}@lumenpath.health`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART:${day}T${b.time.replace(':', '')}00`, `DTEND:${end}`, `SUMMARY:LumenPath Health, ${doc.name}`,
    `DESCRIPTION:Confirmation code ${b.code}`, 'LOCATION:120 Lumen Way\\, Suite 4', 'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
}

function Success({booking}: {booking: Booking}) {
  const doc = doctorOf(booking.doctorId);
  const download = () => {
    const url = URL.createObjectURL(new Blob([buildICS(booking)], {type: 'text/calendar'}));
    const a = document.createElement('a');
    a.href = url;
    a.download = `lumenpath-${booking.code}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <>
      <PageHead trail={[{label: 'Book a visit', href: '/book'}, {label: 'Confirmed'}]} title="Your visit is booked" />
      <div className="container lp-narrow">
        <div className="lp-panel lp-success">
          <span className="lp-success-mark"><Icon name="check" size={26} /></span>
          <p>
            {doc.name} will see you on <b>{formatDate(booking.date)}</b> at <b>{formatTime(booking.time)}</b>. A confirmation for {booking.email} is saved on this device.
          </p>
          <div className="lp-code-block">
            <small>Confirmation code</small>
            <span className="lp-code">{booking.code}</span>
          </div>
          <div className="row">
            <Button label="Add to calendar" variant="secondary" icon={<Icon name="calendar" size={16} />} onClick={download} />
            <Button label="My appointments" variant="primary" href="/appointments" />
          </div>
        </div>
      </div>
    </>
  );
}
