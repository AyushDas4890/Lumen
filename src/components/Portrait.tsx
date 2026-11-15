import type {Doctor} from '../data';

const PALETTES: [string, string, string][] = [
  ['#CFE5E5', '#0F5A6A', '#FFFFFF'],
  ['#FBE3D6', '#E0825A', '#0B2A31'],
  ['#E6F1F1', '#1A7B89', '#FFFFFF'],
  ['#F3EBDD', '#0B3F4B', '#F2C7AD'],
  ['#D9EDEB', '#0B4D5B', '#FFFFFF'],
];

export function initials(doctor: Doctor): string {
  return doctor.name.replace('Dr. ', '').split(' ').map((w) => w[0]).join('');
}

/** Placeholder portrait in the brand's arch language, until real clinician photos exist. */
export function Portrait({doctor, index}: {doctor: Doctor; index: number}) {
  const [bg, arch, ink] = PALETTES[index % PALETTES.length];
  return (
    <svg className="portrait" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`${doctor.name}, ${doctor.title}`}>
      <rect width="200" height="200" fill={bg} />
      <path d="M44 200V104a56 56 0 0 1 112 0v96z" fill={arch} />
      <path d="M100 205c8-18-16-28 0-44s22-22 8-38" fill="none" stroke={bg} strokeWidth="7" strokeLinecap="round" />
      <path d="M100 58l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill={ink} />
    </svg>
  );
}
