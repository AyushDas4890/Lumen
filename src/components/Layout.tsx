import {useEffect, useState, type ReactNode} from 'react';
import {Link, NavLink, useLocation} from 'react-router-dom';
import {Button} from '@astryxdesign/core/Button';
import {Drawer} from '@astryxdesign/core/Drawer';
import {Logo} from './Logo';
import {Icon} from './Icon';

const links = [
  {to: '/services', label: 'Services'},
  {to: '/doctors', label: 'Find a doctor'},
  {to: '/patients', label: 'Patient info'},
  {to: '/contact', label: 'Locations & contact'},
];

export function Layout({children}: {children: ReactNode}) {
  const {pathname} = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { window.scrollTo({top: 0}); }, [pathname]);

  /* Soft fade-up for blocks as they enter the viewport. */
  useEffect(() => {
    const items = () => Array.from(document.querySelectorAll<HTMLElement>('.rv:not(.is-in)'));
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items().forEach((n) => n.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, {threshold: 0.12, rootMargin: '0px 0px -5% 0px'});
    let frame = 0;
    const seen = new WeakSet<Element>(); // per effect run, so StrictMode's second run observes everything again
    const scan = () => { frame = 0; items().forEach((n) => { if (!seen.has(n)) { seen.add(n); io.observe(n); } }); };
    const mo = new MutationObserver(() => { if (!frame) frame = requestAnimationFrame(scan); });
    mo.observe(document.body, {childList: true, subtree: true});
    scan();
    return () => { io.disconnect(); mo.disconnect(); if (frame) cancelAnimationFrame(frame); };
  }, []);

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <div className="utility">
        <div className="container utility__in">
          <p>In an emergency, call your local emergency number.</p>
          <div className="utility__links">
            <a href="tel:5550100199"><Icon name="phone" size={14} /> (555) 010-0199</a>
            <Link to="/appointments"><Icon name="calendar-check" size={14} /> My appointments</Link>
          </div>
        </div>
      </div>
      <header className="header" data-scrolled={scrolled}>
        <div className="container header__in">
          <Logo />
          <nav className="header__nav" aria-label="Primary">
            {links.map((l) => <NavLink key={l.to} to={l.to}>{l.label}</NavLink>)}
          </nav>
          <div className="header__actions">
            <span className="header__cta"><Button label="Book a visit" variant="primary" href="/book" /></span>
            <span className="header__burger"><Button label="Open menu" icon={<Icon name="menu" size={20} />} isIconOnly variant="ghost" onClick={() => setOpen(true)} /></span>
          </div>
        </div>
        <Drawer label="Site menu" isOpen={open} onOpenChange={setOpen} width={320}>
          <nav className="drawer" aria-label="Mobile" onClick={() => setOpen(false)}>
            {links.map((l) => <NavLink key={l.to} to={l.to}>{l.label}</NavLink>)}
            <NavLink to="/appointments">My appointments</NavLink>
            <Button label="Book a visit" variant="primary" size="lg" href="/book" width="100%" />
          </nav>
        </Drawer>
      </header>
      <main id="main">{children}</main>
      <footer className="footer">
        <div className="container">
          <div className="footer__grid">
            <div className="footer__brand">
              <Logo />
              <p>Primary care and specialist clinics under one roof, with online booking.</p>
              <p className="footer__phone"><Icon name="phone" size={16} /> (555) 010-0199</p>
            </div>
            <div>
              <h2>Care</h2>
              <ul>
                <li><Link to="/services">Services</Link></li>
                <li><Link to="/doctors">Find a doctor</Link></li>
                <li><Link to="/book">Book a visit</Link></li>
              </ul>
            </div>
            <div>
              <h2>Patients</h2>
              <ul>
                <li><Link to="/appointments">My appointments</Link></li>
                <li><Link to="/patients">Patient info</Link></li>
                <li><Link to="/patients#faq">Questions</Link></li>
              </ul>
            </div>
            <div>
              <h2>Visit</h2>
              <ul>
                <li>120 Lumen Way, Suite 4</li>
                <li>Monday to Friday, 8:00 to 18:00</li>
                <li><Link to="/contact">Locations & contact</Link></li>
              </ul>
            </div>
          </div>
          <p className="footer__note">
            © {new Date().getFullYear()} LumenPath Health. Demonstration site: clinicians and contact details are fictional and this is not medical advice. In an emergency, call your local emergency number.
          </p>
        </div>
      </footer>
    </>
  );
}
