import {Link} from 'react-router-dom';

/** Flat mark: the arch, the path and the guiding star. */
export function LogoMark({size = 32}: {size?: number}) {
  return (
    <svg width={size} height={Math.round(size * 1.1)} viewBox="0 0 60 66" aria-hidden="true" focusable="false">
      <path d="M4 62V30C4 14 16 3 30 3s26 11 26 27v32z" fill="currentColor" />
      <path d="M3 63c13-2 17-9 25-13s11-9 5-15-5-11 11-13 21 7 23 11" fill="none" stroke="var(--logo-cut, #fff)" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M30 9.5l2.4 6.1 6.1 2.4-6.1 2.4L30 26.5l-2.4-6.1-6.1-2.4 6.1-2.4z" fill="var(--logo-cut, #fff)" />
    </svg>
  );
}

export function Logo({to = '/'}: {to?: string}) {
  return (
    <Link to={to} className="logo" aria-label="LumenPath Health, home">
      <LogoMark size={30} />
      <span className="logo__word">LumenPath <span>Health</span></span>
    </Link>
  );
}
