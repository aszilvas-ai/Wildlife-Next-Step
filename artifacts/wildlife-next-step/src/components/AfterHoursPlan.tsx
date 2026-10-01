import { useState } from 'react';
import { Check, Copy, Moon, Phone } from 'lucide-react';
import type { FictionalContact } from '../data/contacts';

export function AfterHoursPlan({
  contact,
  alternateContacts,
}: {
  contact: FictionalContact;
  alternateContacts: FictionalContact[];
}) {
  const [copyStatus, setCopyStatus] = useState('');
  const callHref = `tel:${contact.number.replace(/[^\d+]/g, '')}`;

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(contact.number);
      setCopyStatus('Number copied.');
    } catch {
      setCopyStatus('Copy is unavailable here. You can select the number and copy it manually.');
    }
  };

  return (
    <section className="after-hours-card" aria-labelledby="after-hours-title" data-testid="after-hours-plan">
      <header className="after-hours-header">
        <div className="after-hours-moon" aria-hidden="true"><Moon size={20} /></div>
        <div>
          <span className="after-hours-eyebrow">AFTER-HOURS PLAN · FICTIONAL DIRECTORY</span>
          <h2 id="after-hours-title">Listed hours have ended</h2>
          <p>This rehabilitator’s listed hours have ended. Calling or leaving a message may still be useful, but availability is not confirmed.</p>
        </div>
      </header>

      <ol className="after-hours-timeline" aria-label="After-hours steps">
        <li><span>Now</span></li>
        <li><span>Leave message / check verified options</span></li>
        <li><span>Follow cited safety guidance</span></li>
        <li><span>Contact professional when available</span></li>
      </ol>

      <section className="after-hours-section" aria-labelledby="try-now-title">
        <h3 id="try-now-title">Try now</h3>
        <article className="after-hours-contact">
          <span className="fiction-badge">Fictional example only — not a real service</span>
          <h4>{contact.name}</h4>
          <p><strong>County:</strong> {contact.county} · <strong>Specialty:</strong> {contact.specialty}</p>
          <p><strong>Listed hours:</strong> {contact.hours}</p>
          <p className="after-hours-phone"><strong>Phone:</strong> <span>{contact.number}</span></p>
          <div className="after-hours-actions">
            <a className="btn btn-phone" href={callHref} aria-label={`Call fictional example number ${contact.number}`}>
              <Phone size={16} /> Call
            </a>
            <button className="btn btn-copy" type="button" onClick={copyNumber}>
              {copyStatus === 'Number copied.' ? <Check size={16} /> : <Copy size={16} />}
              {copyStatus === 'Number copied.' ? 'Copied' : 'Copy number'}
            </button>
          </div>
          <p className="copy-status" role="status" aria-live="polite">{copyStatus}</p>
        </article>
        <p className="after-hours-message-note">
          Call before transport. If you reach voicemail, you may leave a short message with the animal type, county, visible concern, and a callback number. A callback or acceptance is not guaranteed.
        </p>
      </section>

      <section className="after-hours-section" aria-labelledby="another-option-title">
        <h3 id="another-option-title">Check another option</h3>
        {alternateContacts.length ? (
          <div className="after-hours-alternatives">
            {alternateContacts.map((option) => (
              <article className="after-hours-contact" key={option.name}>
                <span className="fiction-badge">{option.availabilityType} · fictional example only</span>
                <h4>{option.name}</h4>
                <p><strong>County:</strong> {option.county}</p>
                <p><strong>Number:</strong> {option.number}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="after-hours-no-service">This prototype has no confirmed open service. Its directory entries are fictional and should not be used for real help.</p>
        )}
      </section>

      <section className="after-hours-section" aria-labelledby="until-help-title">
        <h3 id="until-help-title">Until professional help is available</h3>
        <ul className="after-hours-guidance">
          <li>Do not feed, give water, medicate, diagnose, or improvise treatment.</li>
          <li>Avoid unnecessary handling, and keep pets and people away.</li>
          <li>Follow cited guidance only when it applies. Ask a licensed professional if you are unsure.</li>
          <li>This app cannot determine whether waiting overnight is safe. Availability and acceptance are not guaranteed.</li>
        </ul>
      </section>

      <details className="after-hours-why">
        <summary>Why am I seeing this?</summary>
        <p>The app detected that the listed hours have ended by comparing the fictional example’s entered local time with this directory entry’s sample hours.</p>
      </details>
    </section>
  );
}