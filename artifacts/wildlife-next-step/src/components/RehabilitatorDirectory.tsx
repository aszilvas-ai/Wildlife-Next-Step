import { useState } from 'react';
import { Check, Copy, ExternalLink, Moon, Phone, MessageSquare } from 'lucide-react';
import { counties } from '../data/scenarios';
import { directorySource, type RehabilitatorContact } from '../data/contacts';

function ProviderCard({ contact }: { contact: RehabilitatorContact }) {
  const [copyStatus, setCopyStatus] = useState('');
  const isTextOnly = contact.contactMethod === 'text only';
  const methodLabel = contact.contactMethod
    ? `DNR contact note: ${contact.contactMethod}.`
    : 'DNR phone listing.';
  const copyNumber = async (number: string) => {
    try {
      await navigator.clipboard.writeText(number);
      setCopyStatus(`${number} copied.`);
    } catch {
      setCopyStatus('Copy is unavailable here. Select the number and copy it manually.');
    }
  };

  return (
    <article className="after-hours-contact provider-card" data-testid="provider-card">
      <span className="provider-badge">Indiana DNR permitted listing</span>
      <h4>{contact.name}</h4>
      {contact.organization && <p className="provider-organization">{contact.organization}</p>}
      <p><strong>Listed animal coverage:</strong> {contact.animals}</p>
      <p className="provider-method">{methodLabel}</p>
      <div className="provider-numbers">
        {contact.phoneNumbers.map((number, index) => {
          const digits = number.replace(/[^\d+]/g, '');
          const action = isTextOnly ? 'Text' : 'Call';
          const Icon = isTextOnly ? MessageSquare : Phone;
          return (
            <div className="provider-number" key={number}>
              <p className="after-hours-phone"><strong>{contact.phoneNumbers.length > 1 ? `${action} ${index + 1}` : action}:</strong> <span>{number}</span></p>
              <div className="after-hours-actions">
                <a
                  className="btn btn-phone"
                  href={`${isTextOnly ? 'sms' : 'tel'}:${digits}`}
                  aria-label={`${action} ${contact.name} at ${number}`}
                >
                  <Icon size={16} /> {action}
                </a>
                <button className="btn btn-copy" type="button" onClick={() => copyNumber(number)}>
                  {copyStatus === `${number} copied.` ? <Check size={16} /> : <Copy size={16} />}
                  Copy number
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <p className="copy-status" role="status" aria-live="polite">{copyStatus}</p>
    </article>
  );
}

export function RehabilitatorDirectory({
  county,
  contacts,
  timeOfDay,
  onCountyChange,
}: {
  county: string;
  contacts: RehabilitatorContact[];
  timeOfDay: string;
  onCountyChange: (county: string) => void;
}) {
  const isDarkPeriod = /early morning|dusk|evening|night/i.test(timeOfDay);
  const HeaderIcon = isDarkPeriod ? Moon : Phone;

  return (
    <section className="after-hours-card" aria-labelledby="rehabilitator-directory-title" data-testid="rehabilitator-directory">
      <header className="after-hours-header">
        <div className="after-hours-moon" aria-hidden="true"><HeaderIcon size={20} /></div>
        <div>
          <span className="after-hours-eyebrow">INDIANA DNR DIRECTORY · UPDATED {directorySource.updatedAt.toUpperCase()}</span>
          <h2 id="rehabilitator-directory-title">
            {county ? `Permitted rehabilitators for ${county} County` : 'Find permitted rehabilitators'}
          </h2>
          <p>The DNR list does not publish operating hours or real-time availability. Being listed does not guarantee a provider can help with this animal or respond now.</p>
        </div>
      </header>

      <ol className="after-hours-timeline" aria-label="Contact steps">
        <li><span>Choose county</span></li>
        <li><span>Check listed animal coverage</span></li>
        <li><span>Call or text the listed contact</span></li>
        <li><span>Follow direct instructions</span></li>
      </ol>

      <section className="after-hours-section" aria-labelledby="county-lookup-title">
        <h3 id="county-lookup-title">Find contacts by county</h3>
        <label className="field-label" htmlFor="rehabilitator-county">Indiana county</label>
        <select
          id="rehabilitator-county"
          className="field-control county-lookup"
          value={county}
          onChange={(event) => onCountyChange(event.target.value)}
          data-testid="select-rehabilitator-county"
        >
          <option value="">Choose a county</option>
          {counties.map((item) => <option key={item} value={item}>{item} County</option>)}
        </select>
        <p className="after-hours-message-note">County only—do not enter a street address or exact location. The selected time period helps the practice scenario; it does not confirm whether a contact is available.</p>
        <p className="after-hours-no-service" role="note">No contact is confirmed available for the selected time. The DNR directory does not list operating hours or real-time availability.</p>
      </section>

      {county && (
        <section className="after-hours-section" aria-labelledby="provider-options-title">
          <h3 id="provider-options-title">{county} County listings</h3>
          {contacts.length ? (
            <div className="provider-grid">
              {contacts.map((contact) => <ProviderCard key={`${contact.name}-${contact.phoneNumbers.join('-')}`} contact={contact} />)}
            </div>
          ) : (
            <p className="after-hours-no-service">
              No provider serving {county} County appears in this dated directory snapshot. This does not confirm that no rehabilitator serves the area; check the current Indiana DNR directory for updates.
            </p>
          )}
          <p className="after-hours-message-note">
            Call or text before transport and confirm that the provider handles this animal and situation. If a call reaches voicemail, leave a brief message with the county, animal type, visible concern, and an adult’s callback number. A callback or acceptance is not guaranteed.
          </p>
        </section>
      )}

      <section className="after-hours-section" aria-labelledby="directory-caution-title">
        <h3 id="directory-caution-title">Before contacting anyone</h3>
        <ul className="after-hours-guidance">
          <li>Check the animal coverage listed for each contact. Some entries are limited to specific species or situations.</li>
          <li>Pickup and delivery terms differ by provider; check the full current DNR listing before transport.</li>
          <li>The DNR says permitted rehabilitators make the final decision about whether they can assist.</li>
          <li>Availability, intake, callbacks, and whether it is safe to wait are not confirmed by this app.</li>
          <li>Do not handle, feed, give water, medicate, or transport the animal unless a qualified professional directs you.</li>
        </ul>
      </section>

      <details className="after-hours-why">
        <summary>About this directory</summary>
        <p>Contact names, counties, animal coverage, and phone numbers are from the Indiana DNR permitted wildlife rehabilitator list, last updated {directorySource.updatedAt}. The DNR page may change; verify the current listing before relying on it. The directory does not provide contact hours.</p>
        <p><a href={directorySource.url} target="_blank" rel="noreferrer">Open the current Indiana DNR directory <ExternalLink size={13} aria-hidden="true" /></a></p>
      </details>
    </section>
  );
}
