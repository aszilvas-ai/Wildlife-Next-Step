import type { Encounter, OutcomeId } from '../data/scenarios';

export type SafetyField = 'injury' | 'movement' | 'danger' | 'condition' | 'parentSeen';

export type RoutingResult =
  | {
      outcome: OutcomeId;
      reason: string;
    }
  | {
      outcome: 'clarify';
      reason: string;
      fields: SafetyField[];
    };

const urgentInjuryAnswers = new Set([
  'visible bleeding',
  'serious injury',
  'unable to move',
  'suspected broken limb',
  'trouble breathing',
  'animal in traffic',
  'other urgent concern',
]);

const visibleInjuryAnswers = new Set([
  ...urgentInjuryAnswers,
  'other visible injury',
]);

const urgentMovementAnswers = new Set([
  'unable to move normally',
  'trouble moving',
  'having trouble moving',
]);

const urgentDangerAnswers = new Set([
  'immediate danger: traffic or nearby pet',
  'other immediate danger',
  'animal in traffic',
]);

const urgentConditionAnswers = new Set([
  'weak, cold, or distressed',
  'weak',
  'cold',
  'distressed',
]);

const clearAnswers: Record<Exclude<SafetyField, 'parentSeen'>, Set<string>> = {
  injury: new Set(['no visible injury', ...visibleInjuryAnswers]),
  movement: new Set(['moving normally', ...urgentMovementAnswers]),
  danger: new Set(['no immediate danger reported', ...urgentDangerAnswers]),
  condition: new Set([
    'no weakness, coldness, or distress reported',
    ...urgentConditionAnswers,
  ]),
};

const unsureAnswer = (value: string) =>
  !value.trim() || /not sure|uncertain|unclear|unknown/i.test(value);

const answerIs = (value: string, answers: Set<string>) =>
  answers.has(value.trim().toLowerCase());

export function isYoungAnimal(encounter: Pick<Encounter, 'appearance'>): boolean {
  return /young|baby|juvenile|little fur|eyes closed/i.test(encounter.appearance);
}

export function getClarificationFields(encounter: Encounter): SafetyField[] {
  const fields: SafetyField[] = (Object.keys(clearAnswers) as Array<keyof typeof clearAnswers>)
    .filter((field) => unsureAnswer(encounter[field]) || !clearAnswers[field].has(encounter[field].trim().toLowerCase()));

  if (
    isYoungAnimal(encounter)
    && (
      unsureAnswer(encounter.parentSeen)
      || encounter.parentSeen === 'Not a young animal'
    )
  ) {
    fields.push('parentSeen');
  }
  return fields;
}

export function isUrgentConcern(
  a: Partial<Pick<Encounter, 'injury' | 'movement' | 'danger' | 'condition'>>,
): boolean {
  return answerIs(a.injury ?? '', urgentInjuryAnswers)
    || answerIs(a.movement ?? '', urgentMovementAnswers)
    || answerIs(a.danger ?? '', urgentDangerAnswers)
    || answerIs(a.condition ?? '', urgentConditionAnswers);
}

export function isInjuredOrUrgentConcern(
  a: Partial<Pick<Encounter, 'injury' | 'movement' | 'danger' | 'condition'>>,
): boolean {
  return answerIs(a.injury ?? '', visibleInjuryAnswers)
    || answerIs(a.movement ?? '', urgentMovementAnswers)
    || answerIs(a.danger ?? '', urgentDangerAnswers)
    || answerIs(a.condition ?? '', urgentConditionAnswers);
}

/**
 * Conservative local rules only. This is not diagnosis, species identification,
 * veterinary guidance, or a substitute for a licensed rehabilitator.
 */
export function routeEncounter(a: Encounter): RoutingResult {
  const unclearFields = getClarificationFields(a);
  if (unclearFields.length > 0) {
    return {
      outcome: 'clarify',
      reason: 'One or more safety details are missing or unclear. Clarify them from what is already known before choosing a next step; do not approach the animal to check.',
      fields: unclearFields,
    };
  }

  if (isInjuredOrUrgentConcern(a)) {
    return {
      outcome: 'professional',
      reason: 'A reported injury, movement problem, immediate danger, or sign of weakness, coldness, or distress needs professional guidance. Contact a permitted wildlife rehabilitator rather than trying to assess or treat it yourself.',
    };
  }

  const youngWildlifeNote = isYoungAnimal(a)
    ? ' Young wildlife may appear alone even when a parent is nearby. This prototype cannot confirm that an animal is healthy or orphaned.'
    : '';
  return {
    outcome: 'observe',
    reason: `No injury, movement problem, immediate danger, weakness, coldness, or distress was reported. Leave the animal where it is and observe from a safe distance.${youngWildlifeNote}`,
  };
}