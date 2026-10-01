import { fictionalContacts, genericContact, type FictionalContact } from '../data/contacts.ts';

export type ListedHoursStatus = 'open' | 'closed' | 'unknown';

function toMinutes(value: string): number | null {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

export function getListedHoursStatus(
  localTime: string,
  contact: FictionalContact,
): ListedHoursStatus {
  const entered = toMinutes(localTime);
  const opens = toMinutes(contact.opensAt);
  const closes = toMinutes(contact.closesAt);
  if (entered === null || opens === null || closes === null) return 'unknown';

  if (opens === closes) return 'unknown';
  const isOpen = opens < closes
    ? entered >= opens && entered < closes
    : entered >= opens || entered < closes;

  return isOpen ? 'open' : 'closed';
}

export function getContactForCounty(county: string): FictionalContact {
  const normalizedCounty = county.trim().toLowerCase();
  if (!normalizedCounty) return genericContact;
  return fictionalContacts.find((contact) =>
    contact.county.toLowerCase().startsWith(normalizedCounty),
  ) ?? genericContact;
}