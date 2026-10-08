import { rehabilitators, type RehabilitatorContact, type VerifiedAfterHoursOption } from '../data/contacts.ts';

export const noConfirmedAfterHoursServiceMessage =
  'No verified after-hours wildlife service is listed in this prototype.';

export function getRehabilitatorsForCounty(county: string): RehabilitatorContact[] {
  const normalizedCounty = county.trim().toLowerCase();
  if (!normalizedCounty) return [];
  return rehabilitators.filter((contact) =>
    contact.counties.some((listedCounty) => listedCounty.toLowerCase() === normalizedCounty),
  );
}

const mammalCoverage = /\bmammals?\b/i;
const mammalLimits = /\b(?:bats?|beavers?|bobcats?|chipmunks?|coyotes?|deer|fawns?|foxes?|groundhogs?|hares?|minks?|muskrats?|opossums?|otters?|rabbits?|raccoons?|skunks?|squirrels?|weasels?|bab(?:y|ies)|orphaned)\b/i;
const birdLimits = /\b(?:birds?|birds?\s+of\s+prey|geese?|cranes?|raptors?|songbirds?|shorebirds?|waterfowl|woodpeckers?|hummingbirds?|ducklings?|goslings?)\b/i;

function getExclusions(coverage: string): string {
  return Array.from(
    coverage.matchAll(/\b(?:no|not|except(?:\s+for)?|excluding)\s+([^);.]+)/gi),
    (match) => match[1],
  ).join(' ');
}

function includesAnimalCoverage(contact: RehabilitatorContact, animalType: string, injuryOrUrgentConcern: boolean): boolean {
  const coverage = contact.animals.toLowerCase();
  const exclusions = getExclusions(coverage);
  if (injuryOrUrgentConcern && /\bnot\s+injured\b/i.test(coverage)) return false;

  if (animalType === 'Squirrel') {
    return !/\bsquirrels?\b/i.test(exclusions)
      && (/\bsquirrels?\b/i.test(coverage) || mammalCoverage.test(coverage));
  }
  if (animalType === 'Rabbit / hare') {
    return !/\b(?:rabbits?|hares?)\b/i.test(exclusions)
      && (/\b(?:rabbits?|hares?)\b/i.test(coverage) || mammalCoverage.test(coverage));
  }
  if (animalType === 'Raccoon') {
    return !/\braccoons?\b/i.test(exclusions)
      && (/\braccoons?\b/i.test(coverage) || mammalCoverage.test(coverage));
  }
  if (animalType === 'Bird') {
    const broadBirdCoverage = coverage.replace(/\bbirds?\s+of\s+prey\b/gi, '');
    return /\bbirds?\b/i.test(broadBirdCoverage) && !birdLimits.test(exclusions);
  }
  if (animalType === 'Other mammal') {
    return mammalCoverage.test(coverage) && !mammalLimits.test(exclusions);
  }
  return false;
}

export function getRehabilitatorsForAnimal(
  contacts: RehabilitatorContact[],
  animalType: string,
  injuryOrUrgentConcern = false,
): RehabilitatorContact[] {
  if (!animalType || animalType === 'Unknown') return [];
  return contacts.filter((contact) => includesAnimalCoverage(contact, animalType, injuryOrUrgentConcern));
}

export function getVerifiedAfterHoursOption(contact: RehabilitatorContact): VerifiedAfterHoursOption | null {
  const option = contact.afterHoursOption;
  if (
    !option?.name.trim()
    || !option.phoneNumbers.some((number) => number.trim())
    || !option.sourceUrl.trim()
    || !option.verifiedAt.trim()
  ) return null;
  return option;
}
