import { useState } from 'react';
import { Check, Copy, ExternalLink, Moon, Phone, MessageSquare } from 'lucide-react';
import { counties } from '../data/scenarios';
import { directorySource, type RehabilitatorContact, type VerifiedAfterHoursOption, type VerifiedContactNote } from '../data/contacts';
import { dnrResources } from '../data/citations';
import { getVerifiedAfterHoursOption, noConfirmedAfterHoursServiceMessage } from '../logic/contactDirectory';

type ContactAction = { label: string; protocol: 'sms' | 'tel'; Icon: typeof Phone | typeof MessageSquare };

function getContactActions(contact: RehabilitatorContact): ContactAction[] {
  if (contact.contactMethod === 'text only') {
    return [{ label: 'Text now', protocol: 'sms', Icon: MessageSquare }];
  }
  if (contact.contactMethod === 'phone calls only') {
    return [{ label: 'Call now', protocol: 'tel', Icon: Phone }];
  }
  if (contact.contactMethod === 'text preferred') {
    return [
      { label: 'Text · preferred', protocol: 'sms', Icon: MessageSquare },
      { label: 'Call now', protocol: 'tel', Icon: Phone },
    ];
  }
  if (contact.contactMethod === 'call or text for address') {
    return [
      { label: 'Call now', protocol: 'tel', Icon: Phone },
      { label: 'Text', protocol: 'sms', Icon: MessageSquare },
    ];
  }
  return [{ label: 'Call now', protocol: 'tel', Icon: Phone }];
}

function VerifiedNote({ title, note }: { title: string; note: VerifiedContactNote }) {
  return (
    <p className="provider-verified-note">
      <strong>{title} · checked {note.verifiedAt}:</strong> {note.text}{' '}
      <a href={note.sourceUrl} target="_blank" rel="noreferrer">Source <ExternalLink size={12} aria-hidden="true" /></a>
    </p>
  );
}

function VerifiedAfterHoursOptionCard({ option }: { option: VerifiedAfterHoursOption }) {
  return (
    <article className="verified-after-hours-option" data-testid="verified-after-hours-option">
      <span className="provider-badge">Source-verified option · checked {option.verifiedAt}</span>
      <h4>{option.name}</h4>
      <p>Listed as a {option.availability} {option.category}. Confirm directly that it can help with this animal; availability is not guaranteed.</p>
      {option.phoneNumbers.map((number) => (
        <div className="provider-number" key={number}>
          <p className="after-hours-phone"><strong>Number:</strong> <span>{number}</span></p>
          <a className="btn btn-phone" href={`tel:${number.replace(/[^\d+]/g, '')}`} aria-label={`Call now ${option.name} at ${number}`}> <Phone size={16} /> Call now</a>
        </div>
      ))}
      <a className="directory-link" href={option.sourceUrl} target="_blank" rel="noreferrer">Source <ExternalLink size={13} aria-hidden="true" /></a>
    </article>
  );
}

function ProviderCard({
  contact,
  onAfterHoursSelect,
  afterHoursSelected = false,
}: {
  contact: RehabilitatorContact;
  onAfterHoursSelect?: () => void;
  afterHoursSelected?: boolean;
}) {
  const [copyStatus, setCopyStatus] = useState('');
  const actions = getContactActions(contact);
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
      {contact.normalHours && <VerifiedNote title="Published hours / call window" note={contact.normalHours} />}
      {contact.afterHoursInstructions && <VerifiedNote title="After-hours instructions" note={contact.afterHoursInstructions} />}
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
      {onAfterHoursSelect && (
        <button
          className="btn btn-quiet after-hours-select-button"
          type="button"
          aria-pressed={afterHoursSelected}
          aria-expanded={afterHoursSelected}
          aria-controls="urgent-after-hours-plan"
          onClick={onAfterHoursSelect}
        >
          {afterHoursSelected ? 'After-hours plan is open' : 'I confirmed this contact is closed or unanswered'}
        </button>
      )}
    </article>
  );
}

export function RehabilitatorDirectory({
  county,
  contacts,
  timeOfDay,
  animalType,
  injuryConcern,
  injuryOrUrgentConcern,
  urgentConcern,
  onCountyChange,
}: {
  county: string;
  contacts: RehabilitatorContact[];
  timeOfDay: string;
  animalType: string;
  injuryConcern: string;
  injuryOrUrgentConcern: boolean;
  urgentConcern: boolean;
  onCountyChange: (county: string) => void;
}) {
  const [afterHoursContact, setAfterHoursContact] = useState<RehabilitatorContact | null>(null);
  const [generalPlanOpen, setGeneralPlanOpen] = useState(false);
  const [planCopyStatus, setPlanCopyStatus] = useState('');
  const [templateCopyStatus, setTemplateCopyStatus] = useState('');
  const isDarkPeriod = /early morning|dusk|evening|night/i.test(timeOfDay);
  const HeaderIcon = isDarkPeriod ? Moon : Phone;
  const uniqueNumberCount = new Set(contacts.flatMap((contact) => contact.phoneNumbers)).size;
  const afterHoursOption = afterHoursContact ? getVerifiedAfterHoursOption(afterHoursContact) : null;
  const afterHoursPlanOpen = Boolean(afterHoursContact || generalPlanOpen);
  const messageTemplate = [
    `To: ${afterHoursContact?.organization || afterHoursContact?.name || '[selected rehabilitator]'}`,
    `Animal type: ${animalType || '[animal type]'}`,
    `Approximate location: ${county ? `${county} County, near [landmark; no exact address]` : '[county and nearby landmark; no exact address]'}`,
    `Concern already observed: ${injuryConcern || '[brief concern]'}`,
    'Adult callback number: [adult callback number]',
  ].join('\n');
  const copyPlanNumber = async (number: string) => {
    try {
      await navigator.clipboard.writeText(number);
      setPlanCopyStatus(`${number} copied.`);
    } catch {
      setPlanCopyStatus('Copy is unavailable here. Select the number and copy it manually.');
    }
  };
  const copyMessageTemplate = async () => {
    try {
      await navigator.clipboard.writeText(messageTemplate);
      setTemplateCopyStatus('Message template copied.');
    } catch {
      setTemplateCopyStatus('Copy is unavailable here. Select the template and copy it manually.');
    }
  };

  return (
    <section className="after-hours-card" aria-labelledby="rehabilitator-directory-title" data-testid="rehabilitator-directory">
      <header className="after-hours-header">
        <div className="after-hours-moon" aria-hidden="true"><HeaderIcon size={20} /></div>
        <div>
          <span className="after-hours-eyebrow">INDIANA DNR DIRECTORY · UPDATED {directorySource.updatedAt.toUpperCase()}</span>
          <h2 id="rehabilitator-directory-title">
            {county ? `Permitted rehabilitators for ${county} County` : 'Find permitted rehabilitators'}
          </h2>
          <p>The DNR list itself does not publish operating hours or real-time availability. Some providers publish separate contact notes below; being listed does not guarantee a provider can help with this animal or respond now.</p>
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
            setAfterHoursContact(null);
            setGeneralPlanOpen(false);
            setPlanCopyStatus('');
            setTemplateCopyStatus('');
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
                  {contacts.map((contact) => (
                    <ProviderCard
                      key={`${contact.name}-${contact.phoneNumbers.join('-')}`}
                      contact={contact}
                      onAfterHoursSelect={injuryOrUrgentConcern ? () => {
                        if (afterHoursContact === contact) {
                          setAfterHoursContact(null);
                        } else {
                          setAfterHoursContact(contact);
                          setGeneralPlanOpen(false);
                        }
                      } : undefined}
                      afterHoursSelected={afterHoursContact === contact}
                    />
                  ))}
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

      {injuryOrUrgentConcern && (
        <section className="after-hours-section urgent-after-hours-entry" aria-labelledby="urgent-after-hours-entry-title" data-testid="urgent-after-hours-entry">
          <h3 id="urgent-after-hours-entry-title">{urgentConcern ? 'Urgent concern after hours?' : 'If a provider is closed or does not answer'}</h3>
          <p className="after-hours-message-note">
            {contacts.length
              ? 'Review the county listings and choose a contact whose published animal coverage fits. Use the button on a listing only after you have confirmed it is closed or has not answered.'
              : 'Choose a county to review local listings. If this snapshot has no suitable contact, open the plan for general safety steps and the current statewide directory.'}
          </p>
          {(!county || contacts.length === 0) && (
            <button
              className="btn btn-primary"
              type="button"
              aria-expanded={generalPlanOpen}
              aria-controls="urgent-after-hours-plan"
              onClick={() => {
                setAfterHoursContact(null);
                setGeneralPlanOpen((shown) => !shown);
              }}
              data-testid="button-urgent-after-hours-plan"
            >
              {generalPlanOpen ? 'Hide after-hours plan' : 'Open after-hours plan'}
            </button>
          )}
          {afterHoursPlanOpen && (
            <section className="urgent-after-hours-plan" id="urgent-after-hours-plan" aria-labelledby="urgent-after-hours-plan-title" data-testid="urgent-after-hours-plan">
              <div className="after-hours-plan-heading">
                {urgentConcern && <span className="urgent-status-badge">URGENT</span>}
                <h3 id="urgent-after-hours-plan-title">{urgentConcern ? 'Urgent After-Hours Plan' : 'After-Hours Plan'}</h3>
              </div>
              <p className="after-hours-message-note">
                This plan helps you contact the listed professional. The selected time of day and this app cannot tell whether anyone is reachable now or whether it is safe to wait.
              </p>

              {afterHoursContact ? (
                <div className="urgent-provider-summary">
                  <h4>Selected DNR listing: {afterHoursContact.name}</h4>
                  {afterHoursContact.organization && <p><strong>Organization:</strong> {afterHoursContact.organization}</p>}
                  <p><strong>Listed animal coverage:</strong> {afterHoursContact.animals}</p>
                  {afterHoursContact.normalHours && <VerifiedNote title="Published hours / call window" note={afterHoursContact.normalHours} />}
                  {afterHoursContact.afterHoursInstructions && <VerifiedNote title="After-hours instructions" note={afterHoursContact.afterHoursInstructions} />}
                  <div className="provider-numbers">
                    {afterHoursContact.phoneNumbers.map((number) => {
                      const digits = number.replace(/[^\d+]/g, '');
                      return (
                        <div className="provider-number" key={number}>
                          <p className="after-hours-phone"><strong>Number:</strong> <span>{number}</span></p>
                          <div className="after-hours-actions">
                            {getContactActions(afterHoursContact).map(({ label, protocol, Icon }) => (
                              <a className="btn btn-phone" href={`${protocol}:${digits}`} aria-label={`${label} ${afterHoursContact.name} at ${number}`} key={`${number}-${protocol}`}>
                                <Icon size={16} /> {label}
                              </a>
                            ))}
                            <button className="btn btn-copy" type="button" onClick={() => copyPlanNumber(number)}>
                              {planCopyStatus === `${number} copied.` ? <Check size={16} /> : <Copy size={16} />}
                              Copy number
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="copy-status" role="status" aria-live="polite">{planCopyStatus}</p>
                </div>
              ) : (
                <p className="after-hours-no-service" role="note">
                  No county contact is selected. Review the current statewide DNR directory and confirm directly that a suitable provider serves this location before travel.
                </p>
              )}

              <ol className="after-hours-plan-timeline" aria-label="After-hours steps">
                <li><strong>Check immediate safety.</strong> If people, pets, or traffic are in immediate danger, move yourself to safety and contact local emergency services. Do not approach wildlife.</li>
                <li><strong>Contact a suitable listing anyway.</strong> Use its published Call now or Text control and contact method. A listed after-hours recording is instructions only, not confirmation of a live response.</li>
                <li><strong>Use a verified emergency option only if listed below.</strong> The prototype cannot infer availability from the time or provider listing.</li>
                <li><strong>Keep distance while waiting for professional directions.</strong> Do not treat the animal or decide that waiting is safe based on this app.</li>
              </ol>

              {afterHoursOption ? (
                <VerifiedAfterHoursOptionCard option={afterHoursOption} />
              ) : (
                <p className="after-hours-no-service" role="note" data-testid="no-confirmed-after-hours-service">
                  {noConfirmedAfterHoursServiceMessage}
                </p>
              )}
              <p className="after-hours-message-note">
                Provider-specific voicemail or recorded instructions appear on a DNR listing only when a source is available. A recording does not confirm a live responder.
              </p>

              <div className="after-hours-safety">
                <h4>Keep people and wildlife safe</h4>
                <ul className="after-hours-guidance">
                  <li>Keep children and pets away. Do not approach to get a closer look.</li>
                  <li>Do not try to capture or handle the animal. Containment is only appropriate if a qualified professional confirms that it is safe.</li>
                  <li>If it is already safely contained, keep it quiet, dark, secure, and ventilated without moving or disturbing it.</li>
                  <li>Do not feed, give water, medicate, or attempt treatment unless a qualified professional directly instructs you.</li>
                </ul>
              </div>

              <div className="after-hours-message-template">
                <h4>Copyable message template</h4>
                <p className="after-hours-message-note">Use only as a draft. This classroom prototype is not for sending real animal reports. Do not include an exact address.</p>
                <pre>{messageTemplate}</pre>
                <button className="btn btn-copy" type="button" onClick={copyMessageTemplate}>
                  {templateCopyStatus === 'Message template copied.' ? <Check size={16} /> : <Copy size={16} />}
                  Copy message
                </button>
                <p className="copy-status" role="status" aria-live="polite">{templateCopyStatus}</p>
              </div>

              <p className="urgent-after-hours-limit" role="note">
                This app cannot diagnose the animal, guarantee help is available, or determine whether waiting is safe.
              </p>
              <button
                className="btn btn-quiet after-hours-close-button"
                type="button"
                onClick={() => {
                  setAfterHoursContact(null);
                  setGeneralPlanOpen(false);
                }}
              >
                Close plan
              </button>
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
            <li><strong>Do not try to capture or handle it.</strong> Containment is only appropriate if a qualified professional confirms that it is safe. Do not transport the animal unless a qualified professional directs you.</li>
            <li><strong>If it is already safely contained, do not move or disturb it.</strong> Keep it quiet, dark, secure, and ventilated without changing its setup.</li>
            <li><strong>Do not attempt care.</strong> Do not feed, give water, medicate, or treat the animal unless a qualified professional directly instructs you.</li>
            <li><strong>For a young animal without an obvious injury, don’t assume it is abandoned just because no adult is visible.</strong> Indiana DNR notes that adults may be out of sight and that people nearby can keep them from returning. Check the DNR guidance below.</li>
          </ol>
          <p className="after-hours-no-service" role="note">
            This is not a “wait until morning” decision guide. If people, pets, or traffic are in immediate danger, move yourself to safety and contact local emergency services; do not approach the wildlife.
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
