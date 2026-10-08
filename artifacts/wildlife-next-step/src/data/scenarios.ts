export type Encounter = {
  county: string;
  timeOfDay: string;
  animal: string;
  appearance: string;
  injury: string;
  movement: string;
  danger: string;
  condition: string;
  parentSeen: string;
  actions: string[];
};

export type OutcomeId = 'observe' | 'professional';

export type DemoScenario = {
  id: string;
  label: string;
  description: string;
  answers: Encounter;
};

export const emptyEncounter: Encounter = {
  county: '',
  timeOfDay: '',
  animal: '',
  appearance: '',
  injury: '',
  movement: '',
  danger: '',
  condition: '',
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
      county: 'Marion', timeOfDay: 'Afternoon (noon–5 p.m.)', animal: 'Squirrel',
      appearance: 'Nearly full-sized; fluffy tail; can run, jump, and climb',
      injury: 'No visible injury',
      movement: 'Moving normally',
      danger: 'No immediate danger reported',
      condition: 'No weakness, coldness, or distress reported',
      parentSeen: 'No — not seen',
      actions: ['Observed from a distance'],
    },
  },
  {
    id: 'bleeding-squirrel',
    label: 'Squirrel with visible bleeding',
    description: 'A fictional example where visible injury means ask a professional.',
    answers: {
      county: 'Monroe', timeOfDay: 'Morning (8 a.m.–noon)', animal: 'Squirrel',
      appearance: 'Small / juvenile',
      injury: 'Visible bleeding',
      movement: 'Moving normally',
      danger: 'No immediate danger reported',
      condition: 'No weakness, coldness, or distress reported',
      parentSeen: 'Yes — seen',
      actions: ['Kept people and pets away'],
    },
  },
  {
    id: 'baby-at-dusk',
    label: 'Young squirrel with a possible parent',
    description: 'A young animal has no reported injury or danger and may have a parent nearby.',
    answers: {
      county: 'Hamilton', timeOfDay: 'Dusk / evening (5–9 p.m.)', animal: 'Squirrel',
      appearance: 'Young / baby; eyes open',
      injury: 'No visible injury',
      movement: 'Moving normally',
      danger: 'No immediate danger reported',
      condition: 'No weakness, coldness, or distress reported',
      parentSeen: 'Yes — seen',
      actions: ['Observed from a distance'],
    },
  },
];

export const fieldOptions = {
  timeOfDay: [
    'Early morning (midnight–8 a.m.)',
    'Morning (8 a.m.–noon)',
    'Afternoon (noon–5 p.m.)',
    'Dusk / evening (5–9 p.m.)',
    'Night (9 p.m.–midnight)',
    'Not sure',
  ],
  animal: ['Squirrel', 'Rabbit / hare', 'Bird', 'Raccoon', 'Other mammal', 'Unknown'],
  appearance: [
    'Nearly full-sized; fluffy tail; can run, jump, and climb',
    'Young / baby; eyes open',
    'Very young; eyes closed or little fur',
    'Adult-sized',
    'Small / juvenile',
    'Unclear / not sure',
  ],
  injury: [
    'No visible injury',
    'Visible bleeding',
    'Serious injury',
    'Suspected broken limb',
    'Trouble breathing',
    'Other visible injury',
    'Other urgent concern',
    'Not sure',
  ],
  movement: ['Moving normally', 'Unable to move normally', 'Not sure'],
  danger: [
    'No immediate danger reported',
    'Immediate danger: traffic or nearby pet',
    'Other immediate danger',
    'Not sure',
  ],
  condition: [
    'No weakness, coldness, or distress reported',
    'Weak, cold, or distressed',
    'Not sure',
  ],
  parentSeen: ['Yes — seen', 'No — not seen', 'Not sure'],
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
  timeOfDay: 'Time of day',
  animal: 'Likely animal type',
  appearance: 'Size and appearance',
  injury: 'Bleeding or other obvious injury',
  movement: 'Movement',
  danger: 'Immediate danger',
  condition: 'Weakness, cold, or distress',
  parentSeen: 'Parent or adult animal seen nearby',
  actions: 'Actions already taken',
};

export const formatAnswer = (key: keyof Encounter, value: string | string[]) =>
  Array.isArray(value) ? (value.length ? value.join(', ') : 'None selected') : value || 'Not answered';