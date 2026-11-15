import {useState} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {Dialog, DialogHeader} from '@astryxdesign/core/Dialog';
import {useToast} from '@astryxdesign/core/Toast';
import {PageHead} from '../components/PageHead';
import {Icon} from '../components/Icon';
import {cancelBooking, useBookings, type Booking} from '../bookings';
import {departmentOf, doctorOf, visitTypes} from '../data';
import {formatDate, formatTime} from '../dates';

export default function Appointments() {
  const bookings = useBookings();
  const [pending, setPending] = useState<Booking | null>(null);
  const toast = useToast();
  const sorted = [...bookings].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

  const confirmCancel = () => {
    if (!pending) return;
    cancelBooking(pending.code);
    toast({body: `Appointment ${pending.code} cancelled`});
    setPending(null);
  };

  return (
    <>
      <PageHead trail={[{label: 'My appointments'}]} title="My appointments">
        Visits booked on this device. Cancel here or book another.
      </PageHead>
      <div className="container lp-narrow-wide">
        {sorted.length === 0 ? (
          <div className="empty">
            <Icon name="calendar" size={28} />
            <h2 className="h3">No visits booked</h2>
            <p className="lp-muted">Booked visits appear here with their confirmation codes.</p>
            <Button label="Book a visit" variant="primary" href="/book" />
          </div>
        ) : (
          <ul className="lp-appts">
            {sorted.map((b) => {
              const doc = doctorOf(b.doctorId);
              return (
                <li key={b.code} className="lp-appt">
                  <span className="lp-appt-when">
                    <b>{formatDate(b.date)}</b>
                    <span>{formatTime(b.time)}</span>
                  </span>
                  <span className="lp-appt-main">
                    <b>{doc.name}</b>
                    <span>{departmentOf(doc.departmentId).name} · {visitTypes.find((v) => v.id === b.visitType)?.label}</span>
                  </span>
                  <span className="lp-appt-code">{b.code}</span>
                  <Button label="Cancel" variant="secondary" size="sm" onClick={() => setPending(b)} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <Dialog isOpen={pending !== null} onOpenChange={(open) => !open && setPending(null)} purpose="required" width={420}>
        <DialogHeader title="Cancel this visit?" onOpenChange={(open) => !open && setPending(null)} />
        <div className="lp-dialog-body">
          <p>{pending && `${doctorOf(pending.doctorId).name}, ${formatDate(pending.date)} at ${formatTime(pending.time)}. The time goes back to other patients.`}</p>
          <div className="row end">
            <Button label="Keep visit" variant="ghost" onClick={() => setPending(null)} />
            <Button label="Cancel visit" variant="destructive" onClick={confirmCancel} />
          </div>
        </div>
      </Dialog>
    </>
  );
}
