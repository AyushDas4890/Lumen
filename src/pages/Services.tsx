import {Link} from 'react-router-dom';
import {Button} from '@astryxdesign/core/Button';
import {Avatar} from '@astryxdesign/core/Avatar';
import {PageHead} from '../components/PageHead';
import {Icon} from '../components/Icon';
import {deptIcon} from '../components/deptIcons';
import {departments, doctors} from '../data';

export default function Services() {
  return (
    <>
      <PageHead trail={[{label: 'Services'}]} title="Services">
        Eight specialties under one roof, sharing one patient record. Choose a service to see its clinicians and book.
      </PageHead>
      <div className="container svc">
        <nav className="svc__index" aria-label="Specialties">
          <p>On this page</p>
          <ul>
            {departments.map((d) => <li key={d.id}><a href={`#${d.id}`}>{d.name}</a></li>)}
          </ul>
        </nav>
        <div className="svc__list">
          {departments.map((d) => {
            const team = doctors.filter((x) => x.departmentId === d.id);
            return (
              <section key={d.id} id={d.id} className="svc__item rv" aria-labelledby={`h-${d.id}`}>
                <div className="svc__head">
                  <span className="spec__icon"><Icon name={deptIcon[d.id]} size={26} /></span>
                  <div>
                    <h2 id={`h-${d.id}`}>{d.name}</h2>
                    <p>{d.blurb}</p>
                  </div>
                </div>
                <ul className="svc__team">
                  {team.map((t) => (
                    <li key={t.id}>
                      <Link to={`/doctors/${t.id}`}>
                        <Avatar name={t.name.replace('Dr. ', '')} size={40} />
                        <span><b>{t.name}</b><small>{t.title} · {t.years} years</small></span>
                        <Icon name="arrow-right" size={16} />
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="row">
                  <Button label={`Book ${d.name}`} variant="primary" href={`/book?dept=${d.id}`} />
                  <Button label="View clinicians" variant="secondary" href={`/doctors?dept=${d.id}`} />
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
