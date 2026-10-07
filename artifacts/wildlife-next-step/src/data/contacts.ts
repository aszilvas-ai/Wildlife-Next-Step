export type VerifiedContactNote = {
  text: string;
  sourceUrl: string;
  verifiedAt: string;
};

export type VerifiedAfterHoursOption = {
  name: string;
  category: 'wildlife emergency' | 'veterinary emergency';
  availability: 'after-hours' | '24-hour';
  phoneNumbers: string[];
  sourceUrl: string;
  verifiedAt: string;
};

export type RehabilitatorContact = {
  counties: string[];
  name: string;
  animals: string;
  phoneNumbers: string[];
  contactMethod?: 'text only' | 'phone calls only' | 'text preferred' | 'call or text for address';
  organization?: string;
  normalHours?: VerifiedContactNote;
  afterHoursInstructions?: VerifiedContactNote;
  afterHoursOption?: VerifiedAfterHoursOption;
};

export const directorySource = {
  url: 'https://www.in.gov/dnr/fish-and-wildlife/wildlife-resources/orphaned-and-injured-animals/wildlife-rehabilitators',
  updatedAt: 'September 29, 2026',
};

// Snapshot of Indiana DNR's public permitted-rehabilitator directory.
// County coverage, animal scope, names, and numbers are transcribed from that
// source; check the linked directory for changes before relying on an entry.
export const rehabilitators: RehabilitatorContact[] = [
  {
    counties: ['Adams', 'Allen'],
    name: 'Kristen Werling',
    animals: 'Rabbits, squirrels, skunks, opossums, groundhogs, beavers, muskrats, turtles, and raptors',
    phoneNumbers: ['260-223-0852'],
    contactMethod: 'text only',
    organization: 'Werling Wildlife Rehabilitation',
  },
  {
    counties: ['Allen'],
    name: 'Emily Bryan',
    animals: 'Songbirds, squirrels, fawns, and foxes',
    phoneNumbers: ['260-668-9791'],
  },
  {
    counties: ['Allen'],
    name: 'Kim Westfall',
    animals: 'Raptors (hawks, owls, falcons, eagles, and vultures)',
    phoneNumbers: ['260-241-0134'],
    organization: 'Soarin Hawk Raptor Rehab',
  },
  {
    counties: ['Allen'],
    name: 'Bob Walton',
    animals: 'Bats only',
    phoneNumbers: ['260-637-3018'],
    organization: 'Going Bats',
  },
  {
    counties: ['Bartholomew'],
    name: 'Kathy Hershey',
    animals: 'Mammals except deer, raccoons, and coyotes; turtles and birds',
    phoneNumbers: ['812-546-6318'],
    organization: 'Utopia Wildlife Rehabilitators',
  },
  {
    counties: ['Bartholomew'],
    name: 'Emily Barga',
    animals: 'Rabbits, squirrels, opossums, raccoons, bats, turtles, snakes, toads, salamanders, and frogs',
    phoneNumbers: ['317-910-4343'],
  },
  {
    counties: ['Blackford'],
    name: 'Judi Crouch',
    animals: 'Mammals, reptiles, and amphibians',
    phoneNumbers: ['765-209-0848', '765-717-5941', '765-730-8686'],
  },
  {
    counties: ['Brown'],
    name: 'Laura Edmunds',
    animals: 'Raptors (hawks, owls, falcons, eagles, and vultures) and woodpeckers',
    phoneNumbers: ['812-988-8990'],
    organization: 'Indiana Raptor Center',
  },
  {
    counties: ['Brown'],
    name: 'Patti Reynolds',
    animals: 'Raptors (hawks, owls, falcons, eagles, and vultures) and woodpeckers',
    phoneNumbers: ['812-988-8990'],
    organization: 'Indiana Raptor Center',
  },
  {
    counties: ['Carroll'],
    name: 'Haley Morgan',
    animals: 'Mammals, turtles, snakes, lizards, frogs, and salamanders',
    phoneNumbers: ['765-543-0167'],
  },
  {
    counties: ['Carroll', 'Tippecanoe'],
    name: 'Carol Blacketer',
    animals: 'Mammals, birds, reptiles, and amphibians',
    phoneNumbers: ['765-491-2351'],
    organization: 'Wildcat Wildlife Center',
  },
  {
    counties: ['Clark'],
    name: 'Shannon Corum',
    animals: 'Squirrels, rabbits, raccoons, opossums, skunks, groundhogs, chipmunks, beavers, and otters',
    phoneNumbers: ['812-989-5732'],
  },
  {
    counties: ['Clinton'],
    name: 'Deborah Reames',
    animals: 'Skunks only',
    phoneNumbers: ['765-670-7137'],
  },
  {
    counties: ['Daviess'],
    name: 'Shanell Dixon',
    animals: 'Rabbits, squirrels, skunks, opossums, raccoons, coyotes, beavers, muskrats, foxes, mink, weasels, groundhogs, deer, and bobcats',
    phoneNumbers: ['812-709-2349'],
    organization: "Porky's Wildlife Rescue",
  },
  {
    counties: ['Dearborn'],
    name: 'Samantha Opp',
    animals: 'Raptors, otters, beavers, mink, weasels, rabbits, raccoons, opossums, foxes, bobcats, coyotes, bats, and reptiles',
    phoneNumbers: ['859-202-0461'],
    organization: 'Enchanted Forest Wildlife Rescue of Indiana',
  },
  {
    counties: ['Elkhart'],
    name: 'Dennis Badke',
    animals: 'Raptors (hawks, owls, falcons, and vultures) and foxes',
    phoneNumbers: ['574-849-0187'],
    organization: 'Foxwood Wildlife',
  },
  {
    counties: ['Elkhart'],
    name: 'Stephanie Gratton',
    animals: 'Bats, flying squirrels, songbirds, hummingbirds, ducklings, and goslings (no adult geese)',
    phoneNumbers: ['574-214-5563'],
    contactMethod: 'text only',
  },
  {
    counties: ['Floyd'],
    name: 'Rose Hensel',
    animals: 'Waterfowl, songbirds, and shorebirds (no raptors or cranes)',
    phoneNumbers: ['812-949-8618'],
  },
  {
    counties: ['Hancock'],
    name: 'Jennifer Hancock',
    animals: 'Mammals, birds, turtles, lizards, snakes, and amphibians',
    phoneNumbers: ['317-245-8893'],
    organization: 'ReWilding Indiana',
    normalHours: {
      text: 'Published call window: 9 a.m.–8 p.m. The organization says messages may be returned as soon as possible; a response is not guaranteed.',
      sourceUrl: 'https://www.rewildingindiana.org/contact',
      verifiedAt: 'October 7, 2026',
    },
    afterHoursInstructions: {
      text: 'The organization says recorded guidance is available after hours. This does not confirm a live response.',
      sourceUrl: 'https://www.rewildingindiana.org/rehabilitation-center',
      verifiedAt: 'October 7, 2026',
    },
  },
  {
    counties: ['Hancock'],
    name: 'Leah Perry',
    animals: 'Bats only',
    phoneNumbers: ['317-245-8893'],
    contactMethod: 'phone calls only',
    organization: 'ReWilding Indiana',
    normalHours: {
      text: 'Published call window: 9 a.m.–8 p.m. The organization says messages may be returned as soon as possible; a response is not guaranteed.',
      sourceUrl: 'https://www.rewildingindiana.org/contact',
      verifiedAt: 'October 7, 2026',
    },
    afterHoursInstructions: {
      text: 'The organization says recorded guidance is available after hours. This does not confirm a live response.',
      sourceUrl: 'https://www.rewildingindiana.org/rehabilitation-center',
      verifiedAt: 'October 7, 2026',
    },
  },
  {
    counties: ['Hendricks'],
    name: 'Julie McLaughlin',
    animals: 'Skunks of all ages',
    phoneNumbers: ['317-273-9288'],
    organization: 'Indiana Skunk Rescue',
  },
  {
    counties: ['Henry'],
    name: 'Halli Hunt',
    animals: 'Rabbits, squirrels, beavers, foxes, muskrats, deer, groundhogs, bats, turtles, snakes, lizards, frogs, and salamanders (no raccoons or opossums)',
    phoneNumbers: ['812-229-2851'],
    organization: 'Wild Mother Nature Animal Rescue',
  },
  {
    counties: ['Jay'],
    name: 'Johnna Smith',
    animals: 'Mammals (no raccoons), turtles, and lizards',
    phoneNumbers: ['260-731-5953'],
  },
  {
    counties: ['Jefferson'],
    name: 'Dana Hawkins',
    animals: 'Bats, opossums, skunks, raccoons, squirrels, mink, groundhogs, weasels, and raptors',
    phoneNumbers: ['812-701-5610'],
    organization: "Nature's Nest",
  },
  {
    counties: ['Jennings'],
    name: 'Kassandra Allen',
    animals: 'Mammals (no bats or beavers)',
    phoneNumbers: ['812-592-4351'],
    organization: 'Lakota Haven Wildlife Rehab',
  },
  {
    counties: ['Knox'],
    name: 'Robert Lange',
    animals: 'Coyotes, foxes, deer, bobcats, bats, and raptors',
    phoneNumbers: ['812-881-9685'],
  },
  {
    counties: ['Kosciusko'],
    name: 'Michael Wilson',
    animals: 'Foxes, coyotes, skunks, raccoons, opossums, squirrels, deer, and groundhogs',
    phoneNumbers: ['574-527-2099'],
    organization: '4-Life Fox Farm',
  },
  {
    counties: ['Kosciusko'],
    name: 'Andrea Muir',
    animals: 'Raccoons and foxes only',
    phoneNumbers: ['574-366-0106'],
    contactMethod: 'call or text for address',
  },
  {
    counties: ['LaPorte'],
    name: 'James Fox',
    animals: 'Mammals including squirrels, rabbits, groundhogs, opossums, and mink (no raccoons, deer, or babies); turtles, snakes, lizards, and birds (transport only; no geese)',
    phoneNumbers: ['219-201-6088'],
  },
  {
    counties: ['Lawrence'],
    name: 'Lola Nicholson',
    animals: 'Raptors (hawks, owls, vultures, falcons, and eagles) only',
    phoneNumbers: ['812-276-5222'],
    organization: 'Raptors Rise Rehabilitation Center',
  },
  {
    counties: ['Lawrence'],
    name: 'Amy Clark',
    animals: 'Squirrels, groundhogs, beavers, muskrats, rabbits, opossums, coyotes, bats, turtles, frogs, lizards, and salamanders (no raccoons)',
    phoneNumbers: ['812-322-2003'],
    contactMethod: 'text preferred',
    organization: 'The Pipsqueakery',
  },
  {
    counties: ['Madison'],
    name: 'Rebecca Hamon',
    animals: 'Mammals, reptiles, amphibians, and birds (no raptors)',
    phoneNumbers: ['317-420-4793'],
    contactMethod: 'text only',
    organization: 'Hoosier Wildlife Rescue and Rehabilitation',
  },
  {
    counties: ['Monroe'],
    name: 'Dianna Daniel',
    animals: 'Songbirds, shorebirds, and waterfowl (no geese)',
    phoneNumbers: ['812-323-1313'],
    organization: 'WildCare Inc.',
  },
  {
    counties: ['Monroe'],
    name: 'Jacqueline Payne',
    animals: 'Rabbits and skunks only',
    phoneNumbers: ['812-323-1313'],
    organization: 'WildCare Inc.',
  },
  {
    counties: ['Monroe'],
    name: 'Jan Turner',
    animals: 'Squirrels, foxes, groundhogs, mink, muskrats, and weasels (no raccoons or deer)',
    phoneNumbers: ['812-339-8588'],
  },
  {
    counties: ['Monroe'],
    name: 'Sarah Maddox',
    animals: 'Mammals (no raccoons or deer), songbirds, shorebirds, waterfowl (no geese), turtles, frogs, snakes, lizards, and amphibians',
    phoneNumbers: ['812-323-1313'],
    organization: 'WildCare Inc.',
  },
  {
    counties: ['Monroe'],
    name: 'Grace Rodriguez',
    animals: 'Bats only',
    phoneNumbers: ['812-322-5363'],
  },
  {
    counties: ['Monroe'],
    name: 'Matt Utterback',
    animals: 'Squirrels, groundhogs, beavers, rabbits, opossums, coyotes, deer, bats, turtles, frogs, lizards, and salamanders (no raccoons)',
    phoneNumbers: ['812-955-0067'],
    organization: 'The Pipsqueakery',
  },
  {
    counties: ['Monroe'],
    name: 'Jason Minsterketter',
    animals: 'Rabbits, squirrels, beavers, muskrats, skunks, and groundhogs (no raccoons)',
    phoneNumbers: ['812-955-0067'],
    organization: 'The Pipsqueakery',
  },
  {
    counties: ['Monroe'],
    name: 'Breanna Smoot',
    animals: 'Bats, rabbits, opossums, shorebirds, songbirds, waterfowl, turtles, snakes, salamanders, lizards, and frogs',
    phoneNumbers: ['812-323-1313'],
    organization: 'WildCare Inc.',
  },
  {
    counties: ['Montgomery'],
    name: 'Mindy Poole',
    animals: 'Deer fawns, foxes, mink, squirrels, and bobcats',
    phoneNumbers: ['765-866-7112', '765-918-4571'],
  },
  {
    counties: ['Montgomery'],
    name: 'Noel Richardson',
    animals: 'Mammals (no foxes or coyotes)',
    phoneNumbers: ['765-365-4631'],
  },
  {
    counties: ['Morgan'],
    name: 'Terry Allen',
    animals: 'Deer and squirrels only',
    phoneNumbers: ['317-797-1011'],
  },
  {
    counties: ['Noble'],
    name: 'Meghann Waddle',
    animals: 'Mammals (no raccoons)',
    phoneNumbers: ['574-529-2444'],
  },
  {
    counties: ['Ohio'],
    name: 'Paul Strasser',
    animals: 'Mammals (no deer, raccoons, or bats), raptors, turtles, snakes, and lizards',
    phoneNumbers: ['812-438-2306'],
    organization: 'Red Wolf Sanctuary',
  },
  {
    counties: ['Owen'],
    name: 'Judith Beckner',
    animals: 'Mammals (no deer)',
    phoneNumbers: ['812-323-1313'],
    organization: 'WildCare Inc.',
  },
  {
    counties: ['Parke'],
    name: 'Samantha Brucken',
    animals: 'Squirrels, opossums, and rabbits only',
    phoneNumbers: ['317-373-6863'],
  },
  {
    counties: ['Pike'],
    name: 'Jill Keepes',
    animals: 'Raptors (hawks, owls, falcons, eagles, and vultures) only',
    phoneNumbers: ['812-582-0884', '812-319-6875'],
    organization: 'The Talon Trust',
  },
  {
    counties: ['Porter'],
    name: 'Nicole Harmon',
    animals: 'Mammals (no raccoons or deer), birds including raptors, reptiles, and amphibians (no geese)',
    phoneNumbers: ['219-299-8027'],
    organization: 'Humane Indiana Wildlife — Moraine Ridge Wildlife Rehab Center',
  },
  {
    counties: ['Porter'],
    name: 'Rachael Jones, DVM',
    animals: 'Mammals (no raccoons), reptiles, amphibians, and birds',
    phoneNumbers: ['219-462-4114'],
    organization: 'Southlane Veterinary Hospital',
  },
  {
    counties: ['Porter'],
    name: 'Dr. Larry Reed, DVM',
    animals: 'Mammals (no raccoons at this time), birds, and reptiles and amphibians',
    phoneNumbers: ['219-926-1194'],
    organization: 'Westchester Animal Clinic',
  },
  {
    counties: ['Pulaski'],
    name: 'Kim Hoover',
    animals: 'Birds of prey (hawks, owls, falcons, and vultures) only',
    phoneNumbers: ['574-265-8456'],
  },
  {
    counties: ['Randolph'],
    name: 'Craig and Danielle Downey',
    animals: 'Mammals only',
    phoneNumbers: ['937-423-7505'],
  },
  {
    counties: ['Ripley'],
    name: 'Brandi Brunner',
    animals: 'Rabbits, squirrels, opossums, foxes, coyotes, mink, muskrats, groundhogs, bobcats, beavers, and weasels',
    phoneNumbers: ['812-621-2397'],
  },
  {
    counties: ['Scott'],
    name: 'Jordan Jones',
    animals: 'Turtles, snakes, lizards, frogs, and salamanders only',
    phoneNumbers: ['812-414-1782'],
    organization: 'The Kentuckiana Scaletuary',
  },
  {
    counties: ['St. Joseph'],
    name: 'Heather Downey',
    animals: 'Turtles only',
    phoneNumbers: ['574-233-4601'],
    organization: 'Gilmer Park Animal Clinic',
  },
  {
    counties: ['St. Joseph'],
    name: 'Rachelle Marshman',
    animals: 'Mammals, reptiles, amphibians, and birds',
    phoneNumbers: ['574-286-6998'],
    organization: 'Rescue Release Repeat',
  },
  {
    counties: ['Steuben'],
    name: 'Caryn Williamson',
    animals: 'Raccoons and opossums only',
    phoneNumbers: ['260-499-0679'],
    organization: 'Raccoon Ranch',
  },
  {
    counties: ['Steuben'],
    name: 'Jody Hill',
    animals: 'Mammals (no coyotes or opossums), reptiles, and amphibians',
    phoneNumbers: ['260-316-7669'],
    organization: 'Rescue Rangers',
  },
  {
    counties: ['Tippecanoe'],
    name: 'Denise Hays',
    animals: 'Mammals, birds, reptiles, and amphibians',
    phoneNumbers: ['765-491-2351'],
    organization: 'Wildcat Wildlife Center',
  },
  {
    counties: ['Tipton'],
    name: 'Kelsey Antrim',
    animals: 'Mammals, reptiles, amphibians, and birds (no raptors)',
    phoneNumbers: ['317-420-4793'],
    organization: 'Hoosier Wildlife Rescue and Rehabilitation',
  },
  {
    counties: ['Vanderburgh'],
    name: 'Kristie Bondy',
    animals: 'Mammals',
    phoneNumbers: ['812-760-7398'],
  },
  {
    counties: ['Vanderburgh'],
    name: 'Christine Bush',
    animals: 'Mammals including fawns, and turtles',
    phoneNumbers: ['812-306-6500'],
  },
  {
    counties: ['Vanderburgh'],
    name: 'Jennifer Lindsey',
    animals: 'Raptors (hawks, owls, falcons, eagles, and vultures)',
    phoneNumbers: ['812-319-6875'],
    organization: 'The Talon Trust',
  },
  {
    counties: ['Vigo'],
    name: 'Karen White',
    animals: 'Mammals, reptiles, amphibians, and birds',
    phoneNumbers: ['812-243-0622'],
  },
  {
    counties: ['Wabash'],
    name: 'Sharon Adcock',
    animals: 'Rabbits only; orphaned animals only, not injured animals',
    phoneNumbers: ['260-568-4593'],
  },
  {
    counties: ['Wayne'],
    name: 'Joyce Luckett',
    animals: 'Mammals, raptors (hawks and owls), and songbirds',
    phoneNumbers: ['765-488-2444', '765-977-6736'],
    organization: 'Animal Care Alliance',
  },
  {
    counties: ['Whitley'],
    name: 'Rachel Kovar',
    animals: 'Skunks, raccoons, squirrels, deer, beavers, muskrats, mink, coyotes, foxes, bobcats, groundhogs, and opossums (no rabbits)',
    phoneNumbers: ['260-467-0252'],
  },
  {
    counties: ['Whitley'],
    name: 'Angela Abbott',
    animals: 'Skunks and flying squirrels only',
    phoneNumbers: ['260-503-9029'],
  },
];