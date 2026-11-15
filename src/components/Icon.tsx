import {createElement} from 'react';
import {iconNodes, type IconName} from './iconNodes';

/** One icon set at one stroke weight across the site. Decorative unless `label` is given. */
export function Icon({name, size = 20, label}: {name: IconName; size?: number; label?: string}) {
  const nodes = iconNodes[name];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {nodes.map(([tag, attrs], i) => createElement(tag, {key: i, ...attrs}))}
    </svg>
  );
}
