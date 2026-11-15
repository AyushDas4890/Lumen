import {useMemo} from 'react';
import {Link} from 'react-router-dom';
import {Button} from '@astryxdesign/core/Button';
import {Collapsible} from '@astryxdesign/core/Collapsible';
import {Badge} from '@astryxdesign/core/Badge';
import {HeroHills, ClinicMap} from '../components/Art';
import {FindCard} from '../components/FindCard';
import {OpeningsCard} from '../components/OpeningsCard';
import {PathSteps} from '../components/PathSteps';
import {Portrait} from '../components/Portrait';
import {Icon} from '../components/Icon';
import {deptIcon} from '../components/deptIcons';
import {nextOpenings, useBookings} from '../bookings';
import {departments, doctors, faqs} from '../data';
import {formatDateShort, formatTime} from '../dates';

const tiles = [
  {to: '/book', icon: 'calendar' as const, title: 'Book a visit', text: 'Choose a clinician and an open time'},
  {to: '/book?visit=video', icon: 'video' as const, title: 'Video visit', text: 'See a doctor from home'},
  {to: '/doctors', icon: 'user-search' as const, title: 'Find a doctor', text: 'Search by specialty or language'},
  {to: '/appointments', icon: 'calendar-check' as const, title: 'My appointments', text: 'View or cancel a booked visit'},
];

const facts = [
  [String(departments.length), 'specialties'],
  [String(doctors.length), 'clinicians'],
  ['Mon to Fri', '8:00 to 18:00'],
  ['In person', 'and video visits'],
];

const hours = [['Monday to Friday', '8:00 to 18:00'], ['Saturday', 'Closed'], ['Sunday', 'Closed']];

export default function Home() {
  const bookings = useBookings();
  const featured = ['d1', 'd3', 'd5', 'd8'].map((id) => doctors.find((d) => d.id === id)).filter((d) => d !== undefined);
  // Refresh next openings when a slot is taken.
  const nextFor = useMemo(() => new Map(featured.map((d) => [d.id, nextOpenings(d.id, 1)[0]])), [bookings]);

  return (
    <>
      <section className="hero">
        <HeroHills />
        <div className="container hero__grid">
          <div className="hero__copy">
            <Badge variant="teal" label="Now booking online" />
            <h1>A steadier path forward</h1>
            <p className="hero__lead">Primary care, specialists and recovery programmes in one clinic. Find a doctor, pick an open time and book in about a minute.</p>
            <FindCard />
          </div>
          <OpeningsCard />
        </div>
      </section>

      <section className="tiles container" aria-label="Quick actions">
        {tiles.map((t) => (
          <Link key={t.title} to={t.to} className="tile rv">
            <span className="tile__icon"><Icon name={t.icon} size={22} /></span>
            <span className="tile__text"><b>{t.title}</b><span>{t.text}</span></span>
            <Icon name="arrow-right" size={18} />
          </Link>
        ))}
      </section>

      <section className="facts container" aria-label="At a glance">
        {facts.map(([a, b]) => (
          <p key={a + b} className="rv"><b>{a}</b><span>{b}</span></p>
        ))}
      </section>

      <section className="section">
        <div className="container">
          <div className="section__head rv">
            <div><h2>Our specialties</h2><p>Eight clinics that share one patient record.</p></div>
            <Link className="textlink" to="/services">All services <Icon name="arrow-right" size={14} /></Link>
          </div>
          <ul className="specgrid">
            {departments.map((d) => (
              <li key={d.id} className="rv">
                <Link to={`/book?dept=${d.id}`} className="spec">
                  <span className="spec__icon"><Icon name={deptIcon[d.id]} size={24} /></span>
                  <b>{d.name}</b>
                  <span>{d.blurb}</span>
                  <span className="spec__go">Book <Icon name="arrow-right" size={14} /></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container feature">
          <div className="feature__art rv" aria-hidden="true">
            <svg viewBox="0 0 400 320" preserveAspectRatio="xMidYMid slice" focusable="false">
              <rect width="400" height="320" fill="#D9EDEB" />
              <circle cx="270" cy="110" r="54" fill="#FBE3D6" />
              <path d="M0 220 C 90 190, 170 214, 260 196 S 360 190, 400 198 V320 H0Z" fill="#B9DAD8" />
              <path d="M0 262 C 100 236, 190 262, 280 244 S 360 240, 400 246 V320 H0Z" fill="#0F5A6A" />
              <path d="M150 330 C 170 290, 120 276, 160 246 S 226 232, 214 192" fill="none" stroke="#fff" strokeWidth="14" strokeLinecap="round" />
              <path d="M198 192 v-18 a16 16 0 0 1 32 0 v18z" fill="#E0825A" />
              <path d="M214 130l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill="#0F5A6A" />
            </svg>
          </div>
          <div className="feature__text">
            <p className="eyebrow rv">Long-COVID recovery</p>
            <h2 className="rv">Recovery looks different here</h2>
            <p className="rv">Our programme brings pulmonology and rehabilitation together around one plan that respects your energy.</p>
            <ul className="ticks rv">
              <li><Icon name="check" size={18} /> Long first appointments, so your whole story is heard</li>
              <li><Icon name="check" size={18} /> One coordinated plan across your specialists</li>
              <li><Icon name="check" size={18} /> Pacing built around how you feel, not a fixed schedule</li>
            </ul>
            <div className="rv"><Button label="Book recovery care" variant="primary" size="lg" href="/book?dept=recovery" /></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section__head rv">
            <div><h2>Clinicians with openings</h2><p>Choose a time directly from a clinician’s next availability.</p></div>
            <Link className="textlink" to="/doctors">Find a doctor <Icon name="arrow-right" size={14} /></Link>
          </div>
          <ul className="minigrid">
            {featured.map((d, i) => {
              const next = nextFor.get(d.id);
              return (
                <li key={d.id} className="rv">
                  <Link to={`/doctors/${d.id}`} className="mini">
                    <span className="mini__photo"><Portrait doctor={d} index={doctors.indexOf(d)} /></span>
                    <b>{d.name}</b>
                    <span>{d.title}</span>
                    <span className="mini__next"><Icon name="clock" size={14} /> {next ? `${formatDateShort(next.date)}, ${formatTime(next.time)}` : 'No openings'}</span>
                    <span className="sr-only">Profile {i + 1}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <div className="section__head rv"><div><h2>How booking works</h2><p>Three steps, about a minute.</p></div></div>
          <div className="how rv">
            <PathSteps steps={['Choose', 'Pick a time', 'Confirm']} current={0} />
            <ol className="how__copy">
              <li><b>Choose a clinician</b><span>Pick a specialty and the doctor who fits, by experience, language or rating.</span></li>
              <li><b>Pick a time</b><span>See live availability and choose an in-person or video visit.</span></li>
              <li><b>Confirm</b><span>Add your details and get a confirmation code. Cancel any time under My appointments.</span></li>
            </ol>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container loc">
          <div className="loc__info rv">
            <h2>Visit the clinic</h2>
            <p className="loc__addr"><Icon name="building-2" size={18} /> 120 Lumen Way, Suite 4</p>
            <table className="hours">
              <caption className="sr-only">Opening hours</caption>
              <tbody>{hours.map(([d, h]) => <tr key={d}><th scope="row">{d}</th><td>{h}</td></tr>)}</tbody>
            </table>
            <p className="loc__phone"><Icon name="phone" size={18} /> (555) 010-0199</p>
            <Button label="Locations and contact" variant="secondary" href="/contact" />
          </div>
          <div className="loc__map rv"><ClinicMap /><span className="loc__cap">Illustrative map</span></div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container faqwrap">
          <div className="faqwrap__head rv">
            <h2>Common questions</h2>
            <p>Can’t find your answer? Our team replies within one business day.</p>
            <Button label="Contact us" variant="secondary" href="/contact" />
          </div>
          <div className="faq rv">
            {faqs.slice(0, 4).map((f) => (
              <Collapsible key={f.q} defaultIsOpen={false} trigger={<b>{f.q}</b>}>
                <p className="faq__a">{f.a}</p>
              </Collapsible>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container cta__in">
          <h2>Ready to book your visit?</h2>
          <div className="row"><Button label="Book a visit" variant="primary" size="lg" href="/book" /><Button label="Find a doctor" variant="secondary" size="lg" href="/doctors" /></div>
        </div>
      </section>
    </>
  );
}
