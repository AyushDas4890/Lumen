import {useState} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {TextInput} from '@astryxdesign/core/TextInput';
import {TextArea} from '@astryxdesign/core/TextArea';
import {useToast} from '@astryxdesign/core/Toast';
import {Card} from '@astryxdesign/core/Card';
import {PageHead} from '../components/PageHead';
import {ClinicMap} from '../components/Art';
import {Icon} from '../components/Icon';
import {img} from '../assets';

const hours = [['Monday to Friday', '8:00 to 18:00'], ['Saturday', 'Closed'], ['Sunday', 'Closed']];

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const toast = useToast();

  const send = () => {
    if (name.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.trim().length < 5) {
      setError('Add your name, a valid email and a short message');
      return;
    }
    setError('');
    toast({body: `Thanks ${name.trim().split(' ')[0]}. We reply within one business day.`});
    setName(''); setEmail(''); setMessage('');
  };

  return (
    <>
      <PageHead trail={[{label: 'Locations & contact'}]} title="Locations & contact">
        Find the clinic, check opening hours or send us a message.
      </PageHead>
      <div className="container contact">
        <div className="contact__left">
          <div className="loc__map"><ClinicMap /><span className="loc__cap">Illustrative map</span></div>
          <figure className="signfig"><img src={img('sign')} alt="LumenPath Health wayfinding sign pointing to the clinic" loading="lazy" /><figcaption>Follow the LumenPath signs once you’re inside the building.</figcaption></figure>
          <Card padding={5}>
            <div className="stack">
              <h2 className="h3">LumenPath Health clinic</h2>
              <p className="loc__addr"><Icon name="building-2" size={18} /> 120 Lumen Way, Suite 4</p>
              <p className="loc__addr"><Icon name="phone" size={18} /> (555) 010-0199</p>
              <table className="hours">
                <caption className="sr-only">Opening hours</caption>
                <tbody>{hours.map(([d, h]) => <tr key={d}><th scope="row">{d}</th><td>{h}</td></tr>)}</tbody>
              </table>
            </div>
          </Card>
        </div>
        <Card padding={6}>
          <div className="stack">
            <h2 className="h3">Send a message</h2>
            <TextInput label="Name" value={name} onChange={setName} autoComplete="name" />
            <TextInput label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
            <TextArea label="Message" value={message} onChange={setMessage} />
            {error && <p role="alert" className="lp-error">{error}</p>}
            <div><Button label="Send message" variant="primary" onClick={send} /></div>
            <p className="lp-muted small">Demonstration form. Messages are not sent anywhere.</p>
          </div>
        </Card>
      </div>
    </>
  );
}
