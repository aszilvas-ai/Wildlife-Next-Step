import { Leaf } from 'lucide-react';

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Wildlife Next Step home">
        <span className="brand-mark"><Leaf size={18} strokeWidth={2.1} /></span>
        <span>Wildlife Next Step</span>
      </a>
      <span className="header-note">A classroom decision practice</span>
    </header>
  );
}

export function PrototypeNotice() {
  return (
    <div className="notice" role="note" data-testid="notice-fictional-only">
      <span className="notice-mark" aria-hidden="true">!</span>
      <span><strong>Class/demo use only.</strong> Enter fictional details only. No real wildlife report, photos, or exact locations. This prototype does not send or save your answers.</span>
    </div>
  );
}

export function Progress({ step, total }: { step: number; total: number }) {
  const percent = Math.round((step / total) * 100);
  return (
    <div aria-label={`Step ${step} of ${total}`} data-testid="progress-encounter">
      <div className="progress-top"><span>Fictional encounter</span><span>Step {step} of {total}</span></div>
      <div className="progress-track" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={total}>
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}