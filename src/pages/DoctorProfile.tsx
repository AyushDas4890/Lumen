import {useMemo} from 'react';
import {Link, useParams} from 'react-router-dom';
import {Button} from '@astryxdesign/core/Button';
import {PageHead} from '../components/PageHead';
import {Portrait} from '../components/Portrait';
import {Icon} from '../components/Icon';
import {nextOpenings, useBookings} from '../bookings';
import {departmentOf, doctors, visitTypes} from '../data';
import {formatDateShort, formatTime} from '../dates';

export default function DoctorProfile() {
  const {id} = useParams();
  const doctor = doctors.find((d) => d.id === id);
  const bookings = useBookings();
  const openings = useMemo(() => (doctor ? nextOpenings(doctor.id, 9) : []), [doctor, bookings]);

  if (!doctor) {
    return (
      <PageHead trail={[{label: 'Find a doctor', href: '/doctors'}, {label: 'Not found'}]} title="Doctor not found">
        That profile doesn’t exist. <Link to="/doctors" className="textlink">Back to all doctors</Link>
      </PageHead>
    );
  }
  const index = doctors.indexOf(doctor);
  const dept = departmentOf(doctor.departmentId);
  const related = doctors.filter((d) => d.departmentId === doctor.departmentId && d.id !== doctor.id);
  const byDay = openings.reduce<Record<string, typeof openings>>((acc, o) => { (acc[o.date] ??= []).push(o); return acc; }, {});

  return (
    <>
      <PageHead trail={[{label: 'Find a doctor', href: '/doctors'}, {label: doctor.name}]} title={doctor.name}>
        {doctor.title} · {dept.name}
      </PageHead>
      <div className="container profile">
        <div className="profile__main">
          <div className="profile__top rv">
            <div className="profile__photo"><Portrait doctor={doctor} index={index} /></div>
            <dl className="profile__facts">
              <div><dt>Experience</dt><dd>{doctor.years} years</dd></div>
              <div><dt>Patient rating</dt><dd><Icon name="star" size={16} /> {doctor.rating}</dd></div>
              <div><dt>Visit fee</dt><dd>${doctor.fee}</dd></div>
              <div><dt>Languages</dt><dd>{doctor.languages.join(', ')}</dd></div>
            </dl>
          </div>
          <section className="rv" aria-labelledby="about">
            <h2 id="about">About {doctor.name.split(' ')[1]}</h2>
            <p>{doctor.bio}</p>
          </section>
          <section className="rv" aria-labelledby="visits">
            <h2 id="visits">Visit types</h2>
            <ul className="visits">
              {visitTypes.map((v) => (
                <li key={v.id}><Icon name={v.id === 'video' ? 'video' : v.id === 'in-person' ? 'building-2' : 'clipboard-list'} size={20} /><span><b>{v.label}</b><small>{v.hint}</small></span></li>
              ))}
            </ul>
          </section>
          {related.length > 0 && (
            <section className="rv" aria-labelledby="also">
              <h2 id="also">Also in {dept.name}</h2>
              <ul className="alsolist">
                {related.map((r) => <li key={r.id}><Link to={`/doctors/${r.id}`}>{r.name}<small>{r.title}</small></Link></li>)}
              </ul>
            </section>
          )}
        </div>
        <aside className="profile__book" aria-label="Book with this doctor">
          <h2>Book with {doctor.name.split(' ')[1]}</h2>
          {Object.keys(byDay).length === 0 && <p className="lp-muted">No openings in the next 30 days.</p>}
          {Object.entries(byDay).map(([date, slots]) => (
            <div key={date} className="day">
              <p className="day__label">{formatDateShort(date)}</p>
              <div className="day__slots">
                {slots.map((s) => <Link key={s.time} className="chip-slot chip-slot--time" to={`/book?doctor=${doctor.id}&date=${date}&time=${s.time}`}><b>{formatTime(s.time)}</b></Link>)}
              </div>
            </div>
          ))}
          <Button label="See all dates" variant="primary" width="100%" href={`/book?doctor=${doctor.id}`} />
        </aside>
      </div>
    </>
  );
}
