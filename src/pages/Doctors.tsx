import {useMemo, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {Selector} from '@astryxdesign/core/Selector';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Switch} from '@astryxdesign/core/Switch';
import {CheckboxList, CheckboxListItem} from '@astryxdesign/core/CheckboxList';
import {Button} from '@astryxdesign/core/Button';
import {PageHead} from '../components/PageHead';
import {ClinicianCard} from '../components/ClinicianCard';
import {Icon} from '../components/Icon';
import {nextOpenings, useBookings} from '../bookings';
import {departments, doctors} from '../data';

const languages = Array.from(new Set(doctors.flatMap((d) => d.languages))).sort();
type Sort = 'next' | 'rating' | 'years' | 'name';

export default function Doctors() {
  const [params, setParams] = useSearchParams();
  const selected = (params.get('dept') ?? '').split(',').filter(Boolean);
  const query = params.get('q') ?? '';
  const [language, setLanguage] = useState('any');
  const [thisWeek, setThisWeek] = useState(false);
  const [sort, setSort] = useState<Sort>('next');
  const bookings = useBookings();

  const update = (next: {dept?: string[]; q?: string}) => {
    const p = new URLSearchParams(params);
    const d = next.dept ?? selected;
    const q = next.q ?? query;
    if (d.length) p.set('dept', d.join(',')); else p.delete('dept');
    if (q) p.set('q', q); else p.delete('q');
    setParams(p, {replace: true});
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const withNext = doctors
      .filter((d) => (selected.length === 0 || selected.includes(d.departmentId))
        && (language === 'any' || d.languages.includes(language))
        && (q === '' || `${d.name} ${d.title} ${d.languages.join(' ')} ${departments.find((x) => x.id === d.departmentId)?.name ?? ''}`.toLowerCase().includes(q)))
      .map((d) => ({d, next: nextOpenings(d.id, 1)[0]}));
    const weekEnd = new Date(); weekEnd.setDate(weekEnd.getDate() + 7);
    const limit = `${weekEnd.getFullYear()}-${String(weekEnd.getMonth() + 1).padStart(2, '0')}-${String(weekEnd.getDate()).padStart(2, '0')}`;
    return withNext
      .filter((r) => !thisWeek || (r.next && r.next.date <= limit))
      .sort((a, b) => {
        if (sort === 'rating') return b.d.rating - a.d.rating;
        if (sort === 'years') return b.d.years - a.d.years;
        if (sort === 'name') return a.d.name.localeCompare(b.d.name);
        return `${a.next?.date ?? '9999'}${a.next?.time ?? ''}`.localeCompare(`${b.next?.date ?? '9999'}${b.next?.time ?? ''}`);
      })
      .map((r) => r.d);
    // `bookings` is a dependency so taken slots reorder the list.
  }, [selected.join(','), query, language, thisWeek, sort, bookings]);

  const clear = () => { setLanguage('any'); setThisWeek(false); setParams({}, {replace: true}); };
  const active = selected.length > 0 || query !== '' || language !== 'any' || thisWeek;

  return (
    <>
      <PageHead trail={[{label: 'Find a doctor'}]} title="Find a doctor">
        Filter by specialty and language, then book straight from a clinician’s next openings.
      </PageHead>
      <div className="container finder">
        <aside className="finder__filters" aria-label="Filters">
          <div className="finder__filters-head"><h2>Filters</h2>{active && <button className="textlink" onClick={clear}>Clear all</button>}</div>
          <TextInput label="Search" value={query} onChange={(v) => update({q: v})} startIcon={<Icon name="search" size={16} />} placeholder="Name or language" hasClear />
          <CheckboxList label="Specialty" value={selected} onChange={(v) => update({dept: v})} density="compact">
            {departments.map((d) => (
              <CheckboxListItem key={d.id} value={d.id} label={d.name} endContent={<span className="count">{doctors.filter((x) => x.departmentId === d.id).length}</span>} />
            ))}
          </CheckboxList>
          <Selector label="Language" value={language} options={[{value: 'any', label: 'Any language'}, ...languages.map((l) => ({value: l, label: l}))]} onChange={setLanguage} />
          <Switch label="Opening in the next 7 days" value={thisWeek} onChange={setThisWeek} />
        </aside>
        <section className="finder__results" aria-label="Results">
          <div className="finder__bar">
            <p aria-live="polite"><b>{results.length}</b> {results.length === 1 ? 'doctor' : 'doctors'}</p>
            <Selector label="Sort by" isLabelHidden value={sort} options={[{value: 'next', label: 'Next available'}, {value: 'rating', label: 'Highest rated'}, {value: 'years', label: 'Most experience'}, {value: 'name', label: 'Name A to Z'}]} onChange={(v) => setSort(v as Sort)} width={200} />
          </div>
          <div className="finder__list">
            {results.map((d) => <ClinicianCard key={d.id} doctor={d} bookingsTick={bookings.length} />)}
          </div>
          {results.length === 0 && (
            <div className="empty">
              <h3>No doctors match these filters</h3>
              <p>Try removing a filter or searching a different name.</p>
              <Button label="Clear filters" variant="secondary" onClick={clear} />
            </div>
          )}
        </section>
      </div>
    </>
  );
}
