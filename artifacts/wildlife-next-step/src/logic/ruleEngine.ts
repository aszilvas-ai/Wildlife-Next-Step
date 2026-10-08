import type { Encounter, OutcomeId } from '../data/scenarios';

export const requiredAnswerFields = [
  'animal',
  'injury',
  'movement',
  'danger',
  'condition',
  'parentSeen',
] as const;

export type RequiredAnswerField = (typeof requiredAnswerFields)[number];

export type RoutingResult =
  | { outcome: OutcomeId; reason: string }
  | { outcome: 'moreInfo'; reason: string; fields: RequiredAnswerField[] };

export const MORE_INFORMATION_NEEDED_MESSAGE =
  'Wildlife Next Step does not have enough information to suggest a supported path. Please answer the questions marked below or restart with more details.';

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

const validRequiredAnswers: Record<RequiredAnswerField, Set<string>> = {
  animal: new Set(['squirrel', 'rabbit / hare', 'bird', 'raccoon', 'other mammal']),
  injury: new Set(['no visible injury', ...visibleInjuryAnswers]),
  movement: new Set(['moving normally', ...urgentMovementAnswers]),
  danger: new Set(['no immediate danger reported', ...urgentDangerAnswers]),
  condition: new Set([
    'no weakness, coldness, or distress reported',
    ...urgentConditionAnswers,
  ]),
  parentSeen: new Set(['yes — seen', 'no — not seen']),
};

const answerIs = (value: string, answers: Set<string>) =>
  answers.has(value.trim().toLowerCase());

export function isYoungAnimal(encounter: Pick<Encounter, 'appearance'>): boolean {
  return /young|baby|juvenile|little fur|eyes closed/i.test(encounter.appearance);
}

export function getMissingRequiredFields(encounter: Encounter): RequiredAnswerField[] {
  return requiredAnswerFields.filter((field) =>
    !validRequiredAnswers[field].has(encounter[field].trim().toLowerCase()),
  );
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
  const missingFields = getMissingRequiredFields(a);
  if (missingFields.length > 0) {
    return {
      outcome: 'moreInfo',
      reason: MORE_INFORMATION_NEEDED_MESSAGE,
      fields: missingFields,
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