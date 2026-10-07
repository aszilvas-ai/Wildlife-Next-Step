import type { Encounter, OutcomeId } from '../data/scenarios';

export type RoutingResult = {
  outcome: OutcomeId;
  reason: string;
};

const injuryReportedAnswers = new Set([
  'visible bleeding',
  'serious injury',
  'other visible injury',
  'unable to move',
  'suspected broken limb',
  'trouble breathing',
  'animal in traffic',
  'other urgent concern',
]);

const urgentConcernAnswers = new Set([
  'visible bleeding',
  'serious injury',
  'unable to move',
  'suspected broken limb',
  'trouble breathing',
  'animal in traffic',
  'other urgent concern',
]);

export function isUrgentConcern(a: Pick<Encounter, 'injury'>): boolean {
  return urgentConcernAnswers.has(a.injury.trim().toLowerCase());
}

export function isInjuredOrUrgentConcern(a: Pick<Encounter, 'injury'>): boolean {
  return injuryReportedAnswers.has(a.injury.trim().toLowerCase());
}

/**
 * Conservative local rules only. This is not diagnosis, species identification,
 * veterinary guidance, or a substitute for a licensed rehabilitator.
 */
export function routeEncounter(a: Encounter): RoutingResult {
  const injury = a.injury.toLowerCase();
  const injuryReported = isInjuredOrUrgentConcern(a);
  const injuryUnclear = ![
    'no visible injury',
    'visible bleeding',
    'serious injury',
    'other visible injury',
    'unable to move',
    'suspected broken limb',
    'trouble breathing',
    'animal in traffic',
    'other urgent concern',
  ].includes(injury);
  const uncertain = [a.timeOfDay, a.animal, a.appearance, a.parentSeen].some((v) =>
    !v || /not sure|uncertain|unclear|unknown|other/.test(v.toLowerCase()),
  );
  const conflictingActions = a.actions.some((action) =>
    /moved|touched|handled|already contained|other|not sure/i.test(action),
  );

  if (injuryReported || injuryUnclear || uncertain || conflictingActions) {
    return {
      outcome: 'professional',
      reason: injuryReported
        ? isUrgentConcern(a)
          ? 'A reported urgent concern needs prompt professional guidance. Contact a permitted wildlife rehabilitator rather than trying to assess or treat it yourself.'
          : 'A reported visible injury is a reason to contact a permitted wildlife rehabilitator for directions rather than trying to assess or treat it yourself.'
        : 'Some details are uncertain or actions have already been taken. A permitted wildlife rehabilitator can give situation-specific directions.',
    };
  }

  const squirrelAdult = /squirrel/i.test(a.animal)
    && /nearly full-sized/i.test(a.appearance)
    && /run, jump, and climb/i.test(a.appearance)
    && a.parentSeen === 'No'
    && /early morning|morning|afternoon/i.test(a.timeOfDay);
  if (squirrelAdult) {
    return {
      outcome: 'observe',
      reason: 'This fictional example describes a nearly full-sized squirrel able to move normally, with no visible injury. The cautious next step is to give it space and observe from a distance.',
    };
  }

  const youngSquirrelAtDusk = /squirrel/i.test(a.animal)
    && /young \/ baby/i.test(a.appearance)
    && /dusk|evening|night/i.test(a.timeOfDay)
    && a.parentSeen === 'No'
    && a.injury === 'No visible injury';
  if (youngSquirrelAtDusk) {
    return {
      outcome: 'holding',
      reason: 'In this fictional example, a young squirrel remains at dusk and no parent has been seen. Contact a permitted rehabilitator immediately for directions; short-term safe holding is only a cautious fallback while arranging professional help.',
    };
  }

  return {
    outcome: 'professional',
    reason: 'This combination does not fit a low-risk example in the local rules. For uncertainty or situations outside these examples, contact a permitted wildlife rehabilitator for directions.',
  };
}