import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronRight, CircleAlert, RotateCcw, ShieldCheck } from 'lucide-react';
import { SiteHeader, PrototypeNotice, Progress } from './components/SiteHeader';
import { RehabilitatorDirectory } from './components/RehabilitatorDirectory';
import { SourcesPanel } from './components/ReferencePanel';
import { demos, emptyEncounter, fieldOptions, fieldTitles, formatAnswer, type Encounter, type OutcomeId } from './data/scenarios';
import { getRehabilitatorsForCounty } from './logic/contactDirectory';
import { routeEncounter } from './logic/ruleEngine';

type Screen = 'home' | 'form' | 'review' | 'result';

type FormField = Exclude<keyof Encounter, 'county'>;

const fields: FormField[] = ['timeOfDay', 'animal', 'appearance', 'injury', 'parentSeen', 'actions'];
const fieldHelp: Record<FormField, string> = {
  timeOfDay: 'Choose the closest time period. It helps the practice route but does not confirm provider availability.',
  animal: 'This is a rough category for a fictional scenario, not a species identification.',
  appearance: 'Only select what the scenario tells you. Do not approach to check.',
  injury: 'Do not get closer to assess. “Not sure” is a valid answer.',
  parentSeen: 'A parent may be nearby even if you have not seen one.',
  actions: 'Choose all that apply. Select “No action yet” if nothing has been done.',
};
const fieldStepTitles: Record<FormField, string> = {
  timeOfDay: 'What part of the day is it?',
  animal: 'What type of animal might it be?',
  appearance: 'What does the fictional scenario describe?',
  injury: 'Is a visible injury described?',
  parentSeen: 'Was a parent animal seen?',
  actions: 'What has already happened?',
};

const outcomeContent: Record<OutcomeId, { title: string; subtitle: string; checklist: string[]; safety: string[] }> = {
  observe: {
    title: 'Leave it alone and observe',
    subtitle: 'Give the animal space. Watch only from a safe distance, and keep people and pets away.',
    checklist: [
      'Leave the animal where it is; do not pick it up or try to move it.',
      'Observe from a distance without crowding, calling to, or following it.',
      'Keep children and pets well away.',
      'If details change or you become unsure, contact a permitted wildlife rehabilitator for directions.',
    ],
    safety: [
      'This is a cautious practice suggestion, not a health assessment or species confirmation.',
      'Do not touch, feed, give water, or attempt to treat wildlife.',
      'If there is a visible injury or any uncertainty, choose professional contact instead.',
    ],
  },
  professional: {
    title: 'Contact a wildlife rehabilitator',
    subtitle: 'Ask a permitted wildlife rehabilitator what to do next. Do not attempt care or transport without directions.',
    checklist: [
      'Ask a trusted adult to help contact a permitted wildlife rehabilitator for an actual situation.',
      'Describe only what you can see from a safe distance; do not approach to gather more details.',
      'Follow the professional’s directions. Do not transport unless they advise it.',
      'If the animal is already contained, do not disturb it while asking a permitted rehabilitator for directions.',
    ],
    safety: [
      'Do not handle, feed, give water, medicate, or try to treat the animal.',
      'Keep people and pets away and do not attempt to capture it.',
      'Call or text the listed contact before transport. Directory entries do not guarantee availability or acceptance.',
    ],
  },
  holding: {
    title: 'Short-term safe holding while arranging professional help',
    subtitle: 'Prioritize contacting a permitted wildlife rehabilitator immediately. This limited fallback is only about reducing disturbance while you arrange professional help.',
    checklist: [
      'Ask a trusted adult to contact a permitted wildlife rehabilitator immediately for directions.',
      'If professional advice cannot be reached right away, focus only on minimizing disturbance and keeping people and pets away.',
      'If the animal is already contained, do not disturb it while asking a permitted rehabilitator for directions.',
      'Follow professional directions as soon as you receive them; do not transport unless advised.',
    ],
    safety: [
      'This is not treatment or care guidance. Do not handle, feed, give water, use medicine, or take other treatment steps.',
      'Keep the setting quiet and minimize disturbance; keep people and pets away.',
      'Call or text the listed contact before transport. Directory entries do not guarantee availability or acceptance.',
    ],
  },
};

function Home({ onStart, onDemo }: { onStart: () => void; onDemo: (answers: Encounter) => void }) {
  return (
    <>
      <main>
        <div className="shell">
          <section className="hero">
            <div>
              <span className="eyebrow">A thoughtful practice tool for Indiana classrooms</span>
              <h1 className="serif">Found wildlife? Start with the safest next step.</h1>
              <p className="hero-copy">Practice a calm, cautious choice for a fictional wildlife encounter. This guide is here to help students think through what to do next—not to provide animal care.</p>
              <div className="hero-cta">
                <button className="btn btn-primary" onClick={onStart} data-testid="button-start">
                  Start a fictional example <ArrowRight size={17} />
                </button>
              </div>
              <div style={{ marginTop: 20 }}><PrototypeNotice /></div>
            </div>
            <div className="illustration" role="img" aria-label="Quiet illustration of a bird perched among soft green hills">
              <span className="sun-disc" /><span className="bird" />
              <span className="leaf-stem" /><span className="leaf one" /><span className="leaf two" /><span className="leaf three" />
              <span className="hill" /><span className="hill second" />
            </div>
          </section>
          <section className="content-section" aria-labelledby="demo-title">
            <div className="section-heading">
              <div><span className="eyebrow">Try a made-up scenario</span><h2 id="demo-title">Start with a quick example</h2></div>
              <p>Each button opens one complete fictional case. No real animal or report is involved.</p>
            </div>
            <div className="demo-grid">
              {demos.map((demo, index) => (
                <article className="demo-card" key={demo.id}>
                  <span className="number">{String(index + 1).padStart(2, '0')}</span>
                  <h3>{demo.label}</h3>
                  <p>{demo.description}</p>
                  <button className="text-action" onClick={() => onDemo(demo.answers)} data-testid={`button-demo-${demo.id}`}>
                    Try this scenario <ChevronRight size={16} />
                  </button>
                </article>
              ))}
            </div>
          </section>
          <section className="content-section" aria-labelledby="how-title">
            <div className="how-grid">
              <div>
                <span className="eyebrow">Simple by design</span>
                <h2 id="how-title" className="serif" style={{ fontSize: 'clamp(2rem,3.5vw,2.8rem)', lineHeight: 1.12, margin: '9px 0 18px' }}>How this prototype works</h2>
                <div className="disclaimer">For a class prototype only. This does not diagnose animals or replace advice from a permitted wildlife rehabilitator.</div>
              </div>
              <div className="how-list">
                 <div className="how-item"><b>1</b><div><h3>Use fictional details</h3><p>Answer a few simple prompts. County is requested only if the next step recommends professional contact; never enter an exact location.</p></div></div>
                <div className="how-item"><b>2</b><div><h3>Check your answers</h3><p>Review everything and edit any response before seeing a suggested practice route.</p></div></div>
                <div className="how-item"><b>3</b><div><h3>Learn a cautious next step</h3><p>Local example rules favor professional advice when details are unclear or risk is higher. Nothing is saved or sent.</p></div></div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

function Footer() {
  return <footer className="shell footer"><span>Wildlife Next Step · classroom prototype</span><span>Fictional practice only. Not a real wildlife reporting or care service.</span></footer>;
}

function OptionGroup({
  options, value, onChange, multiple = false, testPrefix,
}: {
  options: string[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  testPrefix: string;
}) {
  const selected = (option: string) => multiple ? (value as string[]).includes(option) : value === option;
  const choose = (option: string) => {
    if (!multiple) { onChange(option); return; }
    const current = value as string[];
    if (option === 'No action yet') { onChange(current.includes(option) ? [] : [option]); return; }
    const next = current.filter((item) => item !== 'No action yet');
    onChange(next.includes(option) ? next.filter((item) => item !== option) : [...next, option]);
  };
  return (
    <div className="option-grid" role={multiple ? 'group' : 'radiogroup'}>
      {options.map((option) => (
        <button
          className={`option-card${selected(option) ? ' selected' : ''}`}
          type="button"
          role={multiple ? 'checkbox' : 'radio'}
          aria-checked={selected(option)}
          key={option}
          onClick={() => choose(option)}
          data-testid={`${testPrefix}-${option.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}
        >
          <span className="option-title">{option}</span>
        </button>
      ))}
    </div>
  );
}

function FormFlow({
  encounter, setEncounter, onCancel, onReview,
  startStep,
}: {
  encounter: Encounter;
  setEncounter: (value: Encounter) => void;
  onCancel: () => void;
  onReview: () => void;
  startStep: number;
}) {
  const [step, setStep] = useState(startStep);
  const [error, setError] = useState('');
  const key = fields[step];
  const goNext = () => {
    const value = encounter[key];
    const isValid = key === 'actions' ? (value as string[]).length > 0 : Boolean(value);
    if (!isValid) { setError(key === 'actions' ? 'Choose one or more actions, including “No action yet” if appropriate.' : 'Choose an answer to continue.'); return; }
    setError('');
    if (step === fields.length - 1) onReview();
    else setStep(step + 1);
  };
  const update = (value: string | string[]) => {
    setError('');
    setEncounter({ ...encounter, [key]: value });
  };
  const back = () => {
    if (step === 0) onCancel();
    else setStep(step - 1);
  };
  return (
    <main className="shell flow-wrap">
      <Progress step={step + 1} total={fields.length} />
      <section className="form-card" aria-labelledby="step-title">
        <div className="step-kicker"><span>STEP {step + 1}</span><span aria-hidden="true">·</span><span>{fieldTitles[key]}</span></div>
        <h1 className="step-title" id="step-title">{fieldStepTitles[key]}</h1>
        <p className="step-help">{fieldHelp[key]}</p>
        <OptionGroup
          options={fieldOptions[key] as string[]}
          value={encounter[key]}
          onChange={update}
          multiple={key === 'actions'}
          testPrefix={`option-${key}`}
        />
        {error && <p className="field-error" role="alert" data-testid="text-form-error">{error}</p>}
        <div className="form-nav">
          <button className="btn btn-quiet" type="button" onClick={back} data-testid="button-back"><ArrowLeft size={16} />{step === 0 ? 'Cancel' : 'Back'}</button>
          <button className="btn btn-primary" type="button" onClick={goNext} data-testid="button-continue">{step === fields.length - 1 ? 'Review answers' : 'Continue'}<ArrowRight size={16} /></button>
        </div>
      </section>
      <p style={{ color: '#6b7569', fontSize: '.8rem', textAlign: 'center', marginTop: 18 }}>Fictional classroom practice only · answers stay in this active screen</p>
    </main>
  );
}

function Review({
  encounter, onEdit, onBack, onShowResult,
}: {
  encounter: Encounter;
  onEdit: (step: number) => void;
  onBack: () => void;
  onShowResult: () => void;
}) {
  return (
    <main className="shell flow-wrap">
      <div className="progress-top"><span>CHECK BEFORE ROUTING</span><span>Review</span></div>
      <section className="form-card">
        <div className="step-kicker"><ShieldCheck size={16} /> YOUR FICTIONAL ANSWERS</div>
        <h1 className="step-title">Take a moment to review.</h1>
        <p className="step-help">You can change any answer. The routing rules use only these in-memory responses.</p>
        <div className="review-list">
          {fields.map((field, index) => (
            <div className="review-row" key={field} data-testid={`review-row-${field}`}>
              <div><span>{fieldTitles[field]}</span><strong>{formatAnswer(field, encounter[field])}</strong></div>
              <button className="review-edit" onClick={() => onEdit(index)} data-testid={`button-edit-${field}`}>Edit</button>
            </div>
          ))}
        </div>
        <div className="form-nav">
          <button className="btn btn-quiet" onClick={onBack} data-testid="button-review-back"><ArrowLeft size={16} /> Back to form</button>
          <button className="btn btn-primary" onClick={onShowResult} data-testid="button-see-next-step">Show next step <ArrowRight size={16} /></button>
        </div>
      </section>
    </main>
  );
}

function Result({
  encounter, onRestart, onReview, onCountyChange,
}: {
  encounter: Encounter;
  onRestart: () => void;
  onReview: () => void;
  onCountyChange: (county: string) => void;
}) {
  const route = routeEncounter(encounter);
  const result = outcomeContent[route.outcome];
  const contacts = encounter.county ? getRehabilitatorsForCounty(encounter.county) : [];
  const alreadyContained = encounter.actions.includes('Already contained');
  return (
    <main className="shell flow-wrap">
      <section className="form-card" aria-labelledby="result-title">
        <div className="step-kicker"><Check size={16} /> YOUR PRACTICE NEXT STEP</div>
        <div className="result-head">
          <div className="result-icon" aria-hidden="true">{route.outcome === 'professional' ? <CircleAlert size={24} /> : <Check size={24} />}</div>
          <div>
            <h1 className="result-title" id="result-title" data-testid="result-title">{result.title}</h1>
            <p className="result-sub">{result.subtitle}</p>
          </div>
        </div>
        <div className="result-panel" data-testid="result-reason">
          <h3>Why this route?</h3>
          <p>{route.reason}</p>
        </div>
        {route.outcome === 'professional' && (
          <p className="professional-guidance-message" role="note" data-testid="professional-guidance">
            This situation needs professional guidance. The app cannot safely provide treatment instructions.
          </p>
        )}
        <div className="result-layout">
          <section className="result-panel" aria-labelledby="checklist-title">
            <h3 id="checklist-title">Next-step checklist</h3>
            <ul className="checklist">{result.checklist.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
          <section className="result-panel" aria-labelledby="safety-title">
            <h3 id="safety-title">Safety notes</h3>
            <ul className="checklist">{result.safety.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
        </div>
        {alreadyContained && (
          <div className="safety-box" role="note">
            <h3>Already contained</h3>
            <p>Do not disturb it while asking a permitted rehabilitator for directions. This prototype does not provide care instructions.</p>
          </div>
        )}
        {route.outcome === 'holding' && (
          <div className="safety-box" role="note">
            <h3>Keep this limited and temporary</h3>
            <p>Prioritize contacting a licensed professional immediately. Guidance here is non-treatment: minimize disturbance and keep people and pets away. Do not handle, feed, give water, use medicine, or take other treatment steps.</p>
          </div>
        )}
        {route.outcome !== 'observe' && (
          <div style={{ marginTop: 14 }}>
            <RehabilitatorDirectory
              county={encounter.county}
              contacts={contacts}
              timeOfDay={encounter.timeOfDay}
              onCountyChange={onCountyChange}
            />
          </div>
        )}
        <div style={{ marginTop: 14 }}><SourcesPanel /></div>
        <div className="result-actions">
          <button className="btn btn-primary" onClick={onRestart} data-testid="button-restart"><RotateCcw size={16} /> Start over</button>
          <button className="btn btn-quiet" onClick={onReview} data-testid="button-edit-review"><ArrowLeft size={16} /> Review answers</button>
        </div>
        <p style={{ color: '#68756a', fontSize: '.82rem', margin: '19px 0 0' }}>For a class prototype only. This does not diagnose animals or replace advice from a permitted wildlife rehabilitator.</p>
      </section>
    </main>
  );
}

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [encounter, setEncounter] = useState<Encounter>({ ...emptyEncounter, actions: [] });
  const [formStartStep, setFormStartStep] = useState(0);

  const start = () => {
    setEncounter({ ...emptyEncounter, actions: [] });
    setFormStartStep(0);
    setScreen('form');
  };
  const startDemo = (answers: Encounter) => {
    setEncounter({ ...answers, actions: [...answers.actions] });
    setScreen('result');
  };
  const editAnswer = (index: number) => {
    setFormStartStep(index);
    setScreen('form');
  };

  return (
    <div className="min-h-[100dvh]">
      <div className="shell"><SiteHeader /></div>
      {screen === 'home' && <Home onStart={start} onDemo={startDemo} />}
      {screen === 'form' && (
        <FormFlow
          key={formStartStep}
          encounter={encounter}
          setEncounter={setEncounter}
          onCancel={() => setScreen('home')}
          onReview={() => setScreen('review')}
          startStep={formStartStep}
        />
      )}
      {screen === 'review' && <Review encounter={encounter} onEdit={editAnswer} onBack={() => setScreen('form')} onShowResult={() => setScreen('result')} />}
      {screen === 'result' && (
        <Result
          encounter={encounter}
          onRestart={start}
          onReview={() => setScreen('review')}
          onCountyChange={(county) => setEncounter((current) => ({ ...current, county }))}
        />
      )}
      <div className="shell"><Footer /></div>
    </div>
  );
}

export default App;