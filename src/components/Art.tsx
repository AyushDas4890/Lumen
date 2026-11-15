/** Soft hills with a winding path and a lit doorway, drawn in the brand's artwork language. Sits behind the hero. */
export function HeroHills() {
  return (
    <svg className="hills" viewBox="0 0 1440 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <circle cx="700" cy="150" r="64" fill="#FBE3D6" />
      <path d="M0 210 C 180 170, 360 205, 560 184 S 900 150, 1100 176 S 1340 188, 1440 172 V300 H0Z" fill="#E4F0EF" />
      <path d="M0 244 C 220 208, 420 240, 640 222 S 980 196, 1180 220 S 1360 226, 1440 214 V300 H0Z" fill="#CFE5E5" />
      <path className="hills__path" pathLength={1} d="M-20 292 C 200 292, 420 272, 560 252 S 690 208, 700 168" fill="none" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" />
      <path d="M684 172 v-14 a16 16 0 0 1 32 0 v14z" fill="#E0825A" />
      <path className="hills__star" d="M700 100l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#0F5A6A" />
      <path d="M0 276 C 300 252, 620 280, 900 262 S 1300 262, 1440 270 V300 H0Z" fill="#0F5A6A" opacity=".9" />
    </svg>
  );
}

/** Illustrative street map for the clinic card. Not a real map. */
export function ClinicMap() {
  return (
    <svg className="clinicmap" viewBox="0 0 480 280" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustrative map showing the clinic on Lumen Way">
      <rect width="480" height="280" fill="#EAF2F1" />
      {[[16, 20, 120, 60], [152, 20, 90, 60], [260, 20, 100, 60], [376, 20, 90, 60], [16, 168, 100, 90], [132, 168, 120, 90], [270, 168, 90, 90], [376, 168, 90, 90], [16, 96, 70, 56], [200, 96, 40, 56], [376, 96, 90, 56]].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx="6" fill="#DCEAE8" />
      ))}
      <rect x="258" y="96" width="106" height="56" rx="8" fill="#CFE5E5" />
      <path d="M0 90 H480 M0 160 H480 M146 0 V280 M250 0 V280 M368 0 V280" stroke="#FFFFFF" strokeWidth="9" />
      <path d="M0 160 C 120 160, 160 90, 250 90 S 380 90, 480 76" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeDasharray="2 9" strokeLinecap="round" />
      <path d="M311 78 c-12 0-21 9-21 21 0 16 21 32 21 32s21-16 21-32c0-12-9-21-21-21z" fill="#0F5A6A" />
      <circle cx="311" cy="99" r="8" fill="#FFFFFF" />
      <text x="338" y="84" fontFamily="Figtree, sans-serif" fontSize="13" fontWeight="600" fill="#0B2A31">LumenPath Health</text>
      <text x="156" y="154" fontFamily="Figtree, sans-serif" fontSize="11" fill="#5E767B">Lumen Way</text>
    </svg>
  );
}
