import { ExternalLink } from 'lucide-react';
import { citations } from '../data/citations';

export function SourcesPanel({
  title = 'Background sources',
  officialOnly = false,
}: {
  title?: string;
  officialOnly?: boolean;
}) {
  const sources = officialOnly
    ? citations.filter((source) => source.label.startsWith('Indiana DNR'))
    : citations;

  return (
    <section className="result-panel" aria-labelledby="sources-title">
      <h3 id="sources-title">{title}</h3>
      <ul className="citation-list">
        {sources.map((source) => (
          <li key={source.url}>
            <a href={source.url} target="_blank" rel="noreferrer">{source.label} <ExternalLink size={12} aria-hidden="true" /></a>
            <p>{source.note}</p>
          </li>
        ))}
      </ul>
      <p className="citation-note">The directory listing comes from the linked Indiana DNR source. The app’s encounter routes are educational examples, not a diagnosis or provider decision.</p>
    </section>
  );
}