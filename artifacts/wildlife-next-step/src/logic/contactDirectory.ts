import { rehabilitators, type RehabilitatorContact } from '../data/contacts.ts';

export function getRehabilitatorsForCounty(county: string): RehabilitatorContact[] {
  const normalizedCounty = county.trim().toLowerCase();
  if (!normalizedCounty) return [];
  return rehabilitators.filter((contact) =>
    contact.counties.some((listedCounty) => listedCounty.toLowerCase() === normalizedCounty),
  );
}

export function getVerifiedAfterHoursContacts(county: string): RehabilitatorContact[] {
  return getRehabilitatorsForCounty(county).filter((contact) =>
    contact.verifiedAfterHoursAvailability?.sourceUrl
    && contact.verifiedAfterHoursAvailability.verifiedAt,
  );
}
