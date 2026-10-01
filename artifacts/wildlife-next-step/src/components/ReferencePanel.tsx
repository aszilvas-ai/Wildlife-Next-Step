import { ExternalLink } from 'lucide-react';
import { citations } from '../data/citations';
import type { FictionalContact } from '../data/contacts';
import type { ListedHoursStatus } from '../logic/contactHours';

export function ContactsPanel({
  contact,
  hoursStatus,
}: {
  contact: FictionalContact;
  hoursStatus: ListedHoursStatus;
}) {
  return (
    <section className="result-panel" aria-labelledby="contacts-title">
      <h3 id="contacts-title">Fictional contact examples</h3>
      <p>These are invented class-directory entries, not real providers. The phone numbers and hours are fictional and must not be used for real help.</p>
      <div className="contact-grid">
        <article className="contact-card" data-testid={`contact-card-${contact.county.toLowerCase().replaceAll(' ', '-')}`}>
          <span className="fiction-badge">Fictional example only</span>
          <h4>{contact.name}</h4>
          <p><strong>County:</strong> {contact.county}</p>
          <p><strong>Specialty:</strong> {contact.specialty}</p>
          <p><strong>Number:</strong> {contact.number}</p>
          <p><strong>Hours:</strong> {contact.hours}</p>
          {hoursStatus === 'unknown' && <p className="call-note">This time period overlaps the listed hours or could not be compared. Availability is not confirmed.</p>}
        </article>
      </div>
      <p className="call-note">Call before transport. A listed contact does not guarantee availability.</p>
    </section>
  );
}

export function SourcesPanel() {
  return (
    <section className="result-panel" aria-labelledby="sources-title">
      <h3 id="sources-title">Background sources</h3>
      <ul className="citation-list">
        {citations.map((source) => (
          <li key={source.url}>
            <a href={source.url} target="_blank" rel="noreferrer">{source.label} <ExternalLink size={12} aria-hidden="true" /></a>
            <p>{source.note}</p>
          </li>
        ))}
      </ul>
      <p className="citation-note">These references are background reading only; they are not proof of, or the basis for, this prototype’s routing decision.</p>
    </section>
  );
}