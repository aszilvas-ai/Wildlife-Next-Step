import { fictionalContacts, genericContact, type FictionalContact } from '../data/contacts.ts';

export type ListedHoursStatus = 'open' | 'closed' | 'unknown';

const timeOfDayRanges: Record<string, { start: number; end: number }> = {
  'Early morning (midnight–8 a.m.)': { start: 0, end: 8 * 60 },
  'Morning (8 a.m.–noon)': { start: 8 * 60, end: 12 * 60 },
  'Afternoon (noon–5 p.m.)': { start: 12 * 60, end: 17 * 60 },
  'Dusk / evening (5–9 p.m.)': { start: 17 * 60, end: 21 * 60 },
  'Night (9 p.m.–midnight)': { start: 21 * 60, end: 24 * 60 },
};

function toMinutes(value: string): number | null {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

export function getListedHoursStatus(
  timeOfDay: string,
  contact: FictionalContact,
): ListedHoursStatus {
  if (contact.availabilityType === '24-hour contact') return 'open';
  const range = timeOfDayRanges[timeOfDay];
  const opens = toMinutes(contact.opensAt);
  const closes = toMinutes(contact.closesAt);
  if (!range || opens === null || closes === null) return 'unknown';

  if (opens === closes) return 'unknown';
  let sawOpenMinute = false;
  let sawClosedMinute = false;
  for (let minute = range.start; minute < range.end; minute += 1) {
    const isOpen = opens < closes
      ? minute >= opens && minute < closes
      : minute >= opens || minute < closes;
    if (isOpen) sawOpenMinute = true;
    else sawClosedMinute = true;
    if (sawOpenMinute && sawClosedMinute) return 'unknown';
  }
  return sawOpenMinute ? 'open' : 'closed';
}

export function getContactForCounty(county: string): FictionalContact {
  const normalizedCounty = county.trim().toLowerCase();
  if (!normalizedCounty) return genericContact;
  return fictionalContacts.find((contact) =>
    contact.county.toLowerCase().startsWith(normalizedCounty),
  ) ?? genericContact;
}