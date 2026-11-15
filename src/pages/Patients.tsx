import {Card} from '@astryxdesign/core/Card';
import {Collapsible} from '@astryxdesign/core/Collapsible';
import {Button} from '@astryxdesign/core/Button';
import {PageHead} from '../components/PageHead';
import {Icon} from '../components/Icon';
import {faqs} from '../data';

const cards = [
  {icon: 'clipboard-list' as const, title: 'What to bring', text: 'A photo ID, your insurance card, a list of current medications and any recent test results.'},
  {icon: 'credit-card' as const, title: 'Insurance and billing', text: 'Add your insurance provider when you book. Our desk checks coverage before your visit and explains any costs up front.'},
  {icon: 'file-text' as const, title: 'Medical records', text: 'Your clinicians share one record, so you only tell your story once. Ask the front desk if you need a copy of your records.'},
  {icon: 'calendar-check' as const, title: 'Changing a visit', text: 'You can cancel under My appointments. Please give at least 24 hours’ notice so the time can go to another patient.'},
];

export default function Patients() {
  return (
    <>
      <PageHead trail={[{label: 'Patient info'}]} title="Patient info">
        What to expect before, during and after your visit.
      </PageHead>
      <div className="container">
        <div className="infogrid">
          {cards.map((c) => (
            <Card key={c.title} padding={5}>
              <div className="info rv">
                <span className="spec__icon"><Icon name={c.icon} size={24} /></span>
                <h2>{c.title}</h2>
                <p>{c.text}</p>
              </div>
            </Card>
          ))}
        </div>
        <section className="section faqwrap" id="faq" aria-labelledby="faq-title">
          <div className="faqwrap__head">
            <h2 id="faq-title">Frequently asked questions</h2>
            <p>Still have a question? Our team replies within one business day.</p>
            <Button label="Contact us" variant="secondary" href="/contact" />
          </div>
          <div className="faq">
            {faqs.map((f) => (
              <Collapsible key={f.q} defaultIsOpen={false} trigger={<b>{f.q}</b>}>
                <p className="faq__a">{f.a}</p>
              </Collapsible>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
