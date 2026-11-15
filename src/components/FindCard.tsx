import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button} from '@astryxdesign/core/Button';
import {Selector} from '@astryxdesign/core/Selector';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Icon} from './Icon';
import {departments} from '../data';

/** Hero search: sends the visitor to the doctor finder with their filters applied. */
export function FindCard() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [dept, setDept] = useState('all');

  const search = () => {
    const params = new URLSearchParams();
    if (dept !== 'all') params.set('dept', dept);
    if (query.trim()) params.set('q', query.trim());
    const qs = params.toString();
    navigate(`/doctors${qs ? `?${qs}` : ''}`);
  };

  return (
    <form className="findcard" role="search" onSubmit={(e) => { e.preventDefault(); search(); }}>
      <h2 className="findcard__title">Find a doctor</h2>
      <div className="findcard__fields">
        <TextInput label="Name, specialty or language" value={query} onChange={setQuery} startIcon={<Icon name="search" size={16} />} placeholder="For example, cardiology or Spanish" />
        <Selector
          label="Specialty"
          value={dept}
          options={[{value: 'all', label: 'All specialties'}, ...departments.map((d) => ({value: d.id, label: d.name}))]}
          onChange={setDept}
        />
        <Button label="Search" variant="primary" size="lg" type="submit" icon={<Icon name="search" size={16} />} />
      </div>
    </form>
  );
}
