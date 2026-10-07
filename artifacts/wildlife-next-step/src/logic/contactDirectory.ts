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
