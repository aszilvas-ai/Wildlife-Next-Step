export type Encounter = {
  county: string;
  localTime: string;
  afterDusk: string;
  animal: string;
  appearance: string;
  injury: string;
  parentSeen: string;
  actions: string[];
};

export type OutcomeId = 'observe' | 'professional' | 'holding';

export type DemoScenario = {
  id: string;
  label: string;
  description: string;
  answers: Encounter;
};

export const emptyEncounter: Encounter = {
  county: '',
  localTime: '',
  afterDusk: '',
  animal: '',
  appearance: '',
  injury: '',
  parentSeen: '',
  actions: [],
};

export const counties = [
  'Adams', 'Allen', 'Bartholomew', 'Benton', 'Blackford', 'Boone', 'Brown',
  'Carroll', 'Cass', 'Clark', 'Clay', 'Clinton', 'Crawford', 'Daviess',
  'Dearborn', 'Decatur', 'DeKalb', 'Delaware', 'Dubois', 'Elkhart', 'Fayette',
  'Floyd', 'Fountain', 'Franklin', 'Fulton', 'Gibson', 'Grant', 'Greene',
  'Hamilton', 'Hancock', 'Harrison', 'Hendricks', 'Henry', 'Howard', 'Huntington',
  'Jackson', 'Jasper', 'Jay', 'Jefferson', 'Jennings', 'Johnson', 'Knox',
  'Kosciusko', 'LaGrange', 'Lake', 'LaPorte', 'Lawrence', 'Madison', 'Marion',
  'Marshall', 'Martin', 'Miami', 'Monroe', 'Montgomery', 'Morgan', 'Newton',
  'Noble', 'Ohio', 'Orange', 'Owen', 'Parke', 'Perry', 'Pike', 'Porter',
  'Posey', 'Pulaski', 'Putnam', 'Randolph', 'Ripley', 'Rush', 'St. Joseph',
  'Scott', 'Shelby', 'Spencer', 'Starke', 'Steuben', 'Sullivan', 'Switzerland',
  'Tippecanoe', 'Tipton', 'Union', 'Vanderburgh', 'Vermillion', 'Vigo',
  'Wabash', 'Warren', 'Warrick', 'Washington', 'Wayne', 'Wells', 'White', 'Whitley',
];

export const demos: DemoScenario[] = [
  {
    id: 'healthy-squirrel',
    label: 'Squirrel moving normally',
    description: 'Nearly full-sized, fluffy-tailed, active, with no visible injury.',
    answers: {
      county: 'Marion', localTime: '14:00', afterDusk: 'No', animal: 'Squirrel',
      appearance: 'Nearly full-sized; fluffy tail; can run, jump, and climb',
      injury: 'No visible injury', parentSeen: 'No',
      actions: ['Observed from a distance'],
    },
  },
  {
    id: 'bleeding-squirrel',
    label: 'Squirrel with visible bleeding',
    description: 'A fictional example where visible injury means ask a professional.',
    answers: {
      county: 'Monroe', localTime: '11:00', afterDusk: 'Not sure', animal: 'Squirrel',
      appearance: 'Small; brown fur; details uncertain',
      injury: 'Visible bleeding', parentSeen: 'Not sure',
      actions: ['Kept people and pets away'],
    },
  },
  {
    id: 'baby-at-dusk',
    label: 'Young squirrel at dusk',
    description: 'A young animal remains after dusk; professional advice comes first.',
    answers: {
      county: 'Hamilton', localTime: '19:30', afterDusk: 'Yes', animal: 'Squirrel',
      appearance: 'Young / baby; eyes open',
      injury: 'No visible injury', parentSeen: 'No',
      actions: ['Observed from a distance'],
    },
  },
  {
    id: 'after-hours-bleeding',
    label: 'After-hours scenario',
    description: 'A fictional bleeding squirrel report after the listed contact hours have ended.',
    answers: {
      county: 'Monroe', localTime: '19:30', afterDusk: 'Yes', animal: 'Squirrel',
      appearance: 'Small; brown fur; details uncertain',
      injury: 'Visible bleeding', parentSeen: 'Not sure',
      actions: ['Kept people and pets away'],
    },
  },
];

export const fieldOptions = {
  afterDusk: ['Yes', 'No', 'Not sure'],
  animal: ['Squirrel', 'Rabbit / hare', 'Bird', 'Raccoon', 'Other mammal', 'Unknown'],
  appearance: [
    'Nearly full-sized; fluffy tail; can run, jump, and climb',
    'Young / baby; eyes open',
    'Very young; eyes closed or little fur',
    'Adult-sized',
    'Small / juvenile',
    'Unclear / not sure',
  ],
  injury: ['No visible injury', 'Visible bleeding', 'Other visible injury', 'Not sure'],
  parentSeen: ['Yes', 'No', 'Not sure'],
  actions: [
    'No action yet',
    'Observed from a distance',
    'Kept people and pets away',
    'Moved the animal',
    'Already contained',
    'Touched or handled',
    'Other / not sure',
  ],
};

export const fieldTitles: Record<keyof Encounter, string> = {
  county: 'Indiana county',
  localTime: 'Local time',
  afterDusk: 'After dusk?',
  animal: 'Likely animal type',
  appearance: 'Size and appearance',
  injury: 'Visible injury',
  parentSeen: 'Was a parent seen?',
  actions: 'Actions already taken',
};

export const formatAnswer = (key: keyof Encounter, value: string | string[]) =>
  Array.isArray(value) ? (value.length ? value.join(', ') : 'None selected') : value || 'Not answered';