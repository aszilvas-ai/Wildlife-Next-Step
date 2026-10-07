import { useState } from 'react';
import { Check, Copy, ExternalLink, Moon, Phone, MessageSquare } from 'lucide-react';
import { counties } from '../data/scenarios';
import { directorySource, type RehabilitatorContact } from '../data/contacts';
import { dnrResources } from '../data/citations';
import { getVerifiedAfterHoursContacts } from '../logic/contactDirectory';

function ProviderCard({ contact }: { contact: RehabilitatorContact }) {
  const [copyStatus, setCopyStatus] = useState('');
  const actions = contact.contactMethod === 'text only'
    ? [{ label: 'Text', protocol: 'sms', Icon: MessageSquare }]
    : contact.contactMethod === 'phone calls only'
      ? [{ label: 'Call', protocol: 'tel', Icon: Phone }]
      : contact.contactMethod === 'text preferred'
        ? [
            { label: 'Text · preferred', protocol: 'sms', Icon: MessageSquare },
            { label: 'Call', protocol: 'tel', Icon: Phone },
          ]
        : contact.contactMethod === 'call or text for address'
          ? [
              { label: 'Call', protocol: 'tel', Icon: Phone },
              { label: 'Text', protocol: 'sms', Icon: MessageSquare },
            ]
          : [{ label: 'Call', protocol: 'tel', Icon: Phone }];
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
      {contact.verifiedAfterHoursAvailability && (
        <p className="provider-method" data-testid="verified-after-hours-status">
          Confirmed {contact.verifiedAfterHoursAvailability.status} availability · verified {contact.verifiedAfterHoursAvailability.verifiedAt}{' '}
          <a href={contact.verifiedAfterHoursAvailability.sourceUrl} target="_blank" rel="noreferrer">Source <ExternalLink size={12} aria-hidden="true" /></a>
        </p>
      )}
      <div className="provider-numbers">
        {contact.phoneNumbers.map((number, index) => {
          const digits = number.replace(/[^\d+]/g, '');
          return (
            <div className="provider-number" key={number}>
              <p className="after-hours-phone"><strong>Number{contact.phoneNumbers.length > 1 ? ` ${index + 1}` : ''}:</strong> <span>{number}</span></p>
              <div className="after-hours-actions">
                {actions.map(({ label, protocol, Icon }) => (
                  <a
                    className="btn btn-phone"
                    href={`${protocol}:${digits}`}
                    aria-label={`${label} ${contact.name} at ${number}`}
                    key={protocol}
                  >
                    <Icon size={16} /> {label}
                  </a>
                ))}
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
  urgentConcern,
  onCountyChange,
}: {
  county: string;
  contacts: RehabilitatorContact[];
  timeOfDay: string;
  urgentConcern: boolean;
  onCountyChange: (county: string) => void;
}) {
  const [noAfterHoursResponse, setNoAfterHoursResponse] = useState(false);
  const isDarkPeriod = /early morning|dusk|evening|night/i.test(timeOfDay);
  const HeaderIcon = isDarkPeriod ? Moon : Phone;
  const uniqueNumberCount = new Set(contacts.flatMap((contact) => contact.phoneNumbers)).size;
  const verifiedAfterHoursContacts = getVerifiedAfterHoursContacts(county);

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
          onChange={(event) => {
            setNoAfterHoursResponse(false);
            onCountyChange(event.target.value);
          }}
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
            <h3 id="provider-options-title">{county} County contact options</h3>
          {contacts.length ? (
              <>
                <p className="after-hours-message-note" data-testid="county-contact-count">
                  This snapshot has {contacts.length} DNR listing{contacts.length === 1 ? '' : 's'} and {uniqueNumberCount} distinct phone number{uniqueNumberCount === 1 ? '' : 's'}. Some listings share a number. Check each provider’s animal coverage and intake terms before choosing.
                </p>
                <div className="provider-grid">
                  {contacts.map((contact) => <ProviderCard key={`${contact.name}-${contact.phoneNumbers.join('-')}`} contact={contact} />)}
                </div>
                {uniqueNumberCount < 2 && (
                  <p className="after-hours-no-service" role="note">
                    This snapshot has only one distinct phone number for {county} County. Check the live DNR directory for changes or other suitable listings; a provider listed for another county may not serve this location.
                  </p>
                )}
              </>
          ) : (
              <p className="after-hours-no-service">
                No provider serving {county} County appears in this dated directory snapshot. This does not confirm that no rehabilitator serves the area; check the current Indiana DNR directory for updates.
              </p>
          )}
            <a className="directory-link" href={directorySource.url} target="_blank" rel="noreferrer">
              Search the current statewide DNR directory <ExternalLink size={14} aria-hidden="true" />
            </a>
          <p className="after-hours-message-note">
              Use only the call or text method shown on the provider’s listing. Confirm that they handle this animal and situation before transport. If you leave a message, include the county, animal type, visible concern, and an adult’s callback number. A callback or acceptance is not guaranteed.
          </p>
        </section>
      )}

      {urgentConcern && (
        <section className="after-hours-section urgent-after-hours-entry" aria-labelledby="urgent-after-hours-entry-title" data-testid="urgent-after-hours-entry">
          <h3 id="urgent-after-hours-entry-title">Urgent concern after hours?</h3>
          {county ? (
            <>
              <p className="after-hours-message-note">For visible bleeding, a serious injury, or another urgent concern, first review the county listings above. Mark this if it is after hours and you cannot reach a rehabilitator.</p>
              <button
                className="btn btn-primary"
                type="button"
                aria-expanded={noAfterHoursResponse}
                aria-controls="urgent-after-hours-plan"
                onClick={() => setNoAfterHoursResponse((shown) => !shown)}
                data-testid="button-urgent-after-hours-plan"
              >
                {noAfterHoursResponse ? 'Hide urgent after-hours plan' : 'I can’t reach a rehabilitator after hours'}
              </button>
            </>
          ) : (
            <p className="after-hours-message-note">Choose a county above to review local contact options. Then mark this if it is after hours and you cannot reach a rehabilitator.</p>
          )}
          {noAfterHoursResponse && county && (
            <section className="urgent-after-hours-plan" id="urgent-after-hours-plan" aria-labelledby="urgent-after-hours-plan-title" data-testid="urgent-after-hours-plan">
              <h3 id="urgent-after-hours-plan-title">Urgent After-Hours Plan</h3>
              {verifiedAfterHoursContacts.length > 0 ? (
                <>
                  <p className="after-hours-message-note">These county listings include source-verified after-hours availability. Check the listed animal coverage and contact method.</p>
                  <div className="provider-grid">
                    {verifiedAfterHoursContacts.map((contact) => (
                      <ProviderCard key={`urgent-${contact.name}-${contact.phoneNumbers.join('-')}`} contact={contact} />
                    ))}
                  </div>
                </>
              ) : (
                <p className="after-hours-no-service" role="note" data-testid="no-confirmed-after-hours-service">
                  No confirmed after-hours wildlife service is available in this prototype.
                </p>
              )}
              <p className="after-hours-message-note">
                Use a Call or Text control in the county listing above, following the contact method shown and choosing a rehabilitator whose listed animal coverage fits. If voicemail is available, leave a brief message with the county, animal type, concern seen from a safe distance, and an adult’s callback number. A response is not guaranteed.
              </p>
              <p className="urgent-after-hours-limit" role="note">
                This app cannot diagnose the animal, guarantee help is available, or determine whether waiting is safe.
              </p>
              <p className="after-hours-message-note">
                This plan gives no feeding, medication, medical, or improvised treatment instructions. Do not attempt to treat the animal.
              </p>
            </section>
          )}
        </section>
      )}

        <section className="after-hours-section after-hours-no-answer" aria-labelledby="no-answer-title" data-testid="no-answer-guide">
          <h3 id="no-answer-title">If it’s after hours or no one answers</h3>
          <p className="after-hours-message-note">
            The DNR directory does not publish rehabilitator hours. The selected time of day cannot tell whether anyone is available, and this guide cannot determine whether an animal can safely wait.
          </p>
          <ol className="after-hours-guidance">
            <li><strong>Try another suitable option.</strong> Check another listed number or provider whose DNR animal-coverage entry fits. If there is only one local number, search the current statewide directory and confirm directly that another provider serves the county before travel.</li>
            <li><strong>Use the contact method shown.</strong> If the listing permits voicemail or text, leave one brief message with the county, animal type if known, visible concern, and an adult’s callback number. A reply is not guaranteed; no reply does not mean the animal is safe to wait.</li>
            <li><strong>Keep your distance while seeking advice.</strong> Keep children and pets away, avoid crowding the animal, and do not approach to get a closer look.</li>
            <li><strong>Do not attempt care or transport.</strong> Do not capture, handle, move, feed, give water, medicate, or transport the animal unless a permitted rehabilitator directly instructs you. Do not disturb an animal that is already contained.</li>
            <li><strong>For a young animal without an obvious injury, don’t assume it is abandoned just because no adult is visible.</strong> Indiana DNR notes that adults may be out of sight and that people nearby can keep them from returning. Check the DNR guidance below.</li>
          </ol>
          <p className="after-hours-no-service" role="note">
            This is not a “wait until morning” decision guide. If people are in immediate danger, move away and contact local emergency services; do not approach the wildlife.
          </p>
          <div className="after-hours-resource-links" aria-label="Other official information">
            <a className="after-hours-resource" href={directorySource.url} target="_blank" rel="noreferrer">
              <strong>Current statewide rehabilitator directory</strong>
              <span>Check current listings, animal coverage, and pickup or delivery notes.</span>
            </a>
            <a className="after-hours-resource" href={dnrResources.animalGuidance} target="_blank" rel="noreferrer">
              <strong>Indiana DNR animal guidance</strong>
              <span>Review official FAQs before intervening.</span>
            </a>
            <div className="after-hours-resource">
              <strong>DNR customer service during posted hours</strong>
              <span>Weekdays, 8:30 a.m.–4 p.m. Call <a href="tel:+13172324200">317-232-4200</a> or <a href="tel:+18774636367">877-463-6367</a>. DNR says it does not provide wildlife rescue or rehabilitation services; this is not an after-hours response line.</span>
              <a href={dnrResources.contact} target="_blank" rel="noreferrer">Hours and contact details <ExternalLink size={13} aria-hidden="true" /></a>
            </div>
          </div>
        </section>

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
