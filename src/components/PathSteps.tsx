/** Booking progress drawn as a path: finished stops are solid, the current stop is the guiding star. */
export function PathSteps({steps, current}: {steps: string[]; current: number}) {
  return (
    <ol className="lp-path" aria-label="Booking progress">
      {steps.map((label, i) => {
        const state = i < current ? 'done' : i === current ? 'current' : 'todo';
        return (
          <li key={label} className="lp-path-step" data-state={state} aria-current={state === 'current' ? 'step' : undefined}>
            <span className="lp-path-node" aria-hidden="true">
              {state === 'current' ? (
                <svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 1.5l2.8 7.7 7.7 2.8-7.7 2.8L12 22.5l-2.8-7.7L1.5 12l7.7-2.8z" fill="currentColor" /></svg>
              ) : null}
            </span>
            <span className="lp-path-label">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}
