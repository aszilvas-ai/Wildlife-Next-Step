export type FictionalContact = {
  name: string;
  county: string;
  specialty: string;
  number: string;
  hours: string;
  opensAt: string;
  closesAt: string;
  availabilityType?: 'after-hours line' | '24-hour contact';
};

export const fictionalContacts: FictionalContact[] = [
  {
    name: 'Marion Classroom Sample Contact',
    county: 'Marion County',
    specialty: 'Small mammals (fictional class directory)',
    number: '(317) 555-0142',
    hours: 'Fictional hours: daily, 9 a.m.–4 p.m.',
    opensAt: '09:00',
    closesAt: '16:00',
  },
  {
    name: 'Monroe Classroom Sample Contact',
    county: 'Monroe County',
    specialty: 'Wildlife intake practice listing (fictional)',
    number: '(812) 555-0176',
    hours: 'Fictional hours: daily, 10 a.m.–3 p.m.',
    opensAt: '10:00',
    closesAt: '15:00',
  },
  {
    name: 'Hamilton Classroom Sample Contact',
    county: 'Hamilton County',
    specialty: 'Young wildlife practice listing (fictional)',
    number: '(317) 555-0193',
    hours: 'Fictional hours: daily, 8 a.m.–5 p.m.',
    opensAt: '08:00',
    closesAt: '17:00',
  },
];

export const genericContact: FictionalContact = {
  name: 'Indiana Classroom Sample Contact',
  county: 'Example Indiana county listing',
  specialty: 'General wildlife rehabilitation (fictional class directory)',
  number: '(765) 555-0128',
  hours: 'Fictional hours: daily, 9 a.m.–4 p.m.',
  opensAt: '09:00',
  closesAt: '16:00',
};

export const afterHoursContacts = fictionalContacts.filter(
  (contact) => contact.availabilityType === 'after-hours line' || contact.availabilityType === '24-hour contact',
);