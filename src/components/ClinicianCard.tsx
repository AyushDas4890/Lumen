import {Link} from 'react-router-dom';
import {Button} from '@astryxdesign/core/Button';
import {Badge} from '@astryxdesign/core/Badge';
import {Portrait} from './Portrait';
import {Icon} from './Icon';
import {nextOpenings} from '../bookings';
import {departmentOf, doctors, type Doctor} from '../data';
import {formatDateShort, formatTime} from '../dates';

/** Finder result: who they are, when they are free next, and a way to book. */
export function ClinicianCard({doctor, bookingsTick}: {doctor: Doctor; bookingsTick: number}) {
  // `bookingsTick` changes when a slot is taken so the openings refresh.
  void bookingsTick;
  const openings = nextOpenings(doctor.id, 3);
  const index = doctors.findIndex((d) => d.id === doctor.id);
  return (
    <article className="clin rv">
      <Link to={`/doctors/${doctor.id}`} className="clin__photo" aria-label={`${doctor.name}, view profile`}><Portrait doctor={doctor} index={index} /></Link>
      <div className="clin__main">
        <h3><Link to={`/doctors/${doctor.id}`}>{doctor.name}</Link></h3>
        <p className="clin__role">{doctor.title} · {departmentOf(doctor.departmentId).name}</p>
        <p className="clin__meta">
          <span><Icon name="star" size={14} /> {doctor.rating}</span>
          <span>{doctor.years} years</span>
          <span><Icon name="languages" size={14} /> {doctor.languages.join(', ')}</span>
        </p>
        <div className="clin__slots" role="group" aria-label={`Next openings with ${doctor.name}`}>
          {openings.length === 0 && <Badge variant="neutral" label="No openings in the next 30 days" />}
          {openings.map((o) => (
            <Link key={`${o.date}${o.time}`} className="chip-slot" to={`/book?doctor=${doctor.id}&date=${o.date}&time=${o.time}`}>
              <span>{formatDateShort(o.date)}</span><b>{formatTime(o.time)}</b>
            </Link>
          ))}
        </div>
      </div>
      <div className="clin__actions">
        <p className="clin__fee">${doctor.fee}<small>per visit</small></p>
        <Button label="Book" variant="primary" href={`/book?doctor=${doctor.id}`} />
        <Button label="View profile" variant="secondary" href={`/doctors/${doctor.id}`} />
      </div>
    </article>
  );
}
