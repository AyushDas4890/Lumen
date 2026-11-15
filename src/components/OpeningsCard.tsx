import {useMemo} from 'react';
import {Link} from 'react-router-dom';
import {Avatar} from '@astryxdesign/core/Avatar';
import {Icon} from './Icon';
import {nextOpenings, useBookings} from '../bookings';
import {departmentOf, doctors} from '../data';
import {formatDateShort, formatTime} from '../dates';

const PICKS = ['d1', 'd3', 'd8', 'd5'];

/** Live list of the next openings across a few clinicians. */
export function OpeningsCard() {
  const bookings = useBookings();
  // `bookings` is a dependency so a slot that was just taken leaves the list.
  const rows = useMemo(() => PICKS.map((id) => {
    const d = doctors.find((x) => x.id === id);
    return d ? {doctor: d, next: nextOpenings(d.id, 1)[0]} : null;
  }).filter((r) => r !== null), [bookings]);

  return (
    <section className="openings" aria-labelledby="openings-title">
      <div className="openings__head">
        <h2 id="openings-title">Next available appointments</h2>
        <Link to="/doctors" className="textlink">All doctors <Icon name="arrow-right" size={14} /></Link>
      </div>
      <ul>
        {rows.map(({doctor, next}) => (
          <li key={doctor.id}>
            <Link to={next ? `/book?doctor=${doctor.id}&date=${next.date}&time=${next.time}` : `/book?doctor=${doctor.id}`} className="openings__row">
              <Avatar name={doctor.name.replace('Dr. ', '')} size={40} />
              <span className="openings__who">
                <b>{doctor.name}</b>
                <span>{departmentOf(doctor.departmentId).name}</span>
              </span>
              <span className="openings__when">
                <Icon name="clock" size={14} />
                {next ? `${formatDateShort(next.date)}, ${formatTime(next.time)}` : 'No openings'}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
