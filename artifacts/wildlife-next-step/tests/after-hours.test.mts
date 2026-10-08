import assert from 'node:assert/strict';
import test from 'node:test';
import { directorySource, rehabilitators } from '../src/data/contacts.ts';
import { demos, fieldOptions } from '../src/data/scenarios.ts';
import { getCountiesForAnimal, getRehabilitatorsForAnimal, getRehabilitatorsForCounty, getVerifiedAfterHoursOption, noConfirmedAfterHoursServiceMessage } from '../src/logic/contactDirectory.ts';
import { getMissingRequiredFields, isInjuredOrUrgentConcern, isUrgentConcern, MORE_INFORMATION_NEEDED_MESSAGE, requiredAnswerFields, routeEncounter } from '../src/logic/ruleEngine.ts';

test('the DNR directory lookup returns the published contacts for a selected county', () => {
  const monroeContacts = getRehabilitatorsForCounty('Monroe');
  assert.equal(monroeContacts.length, 8);
  assert.equal(new Set(monroeContacts.flatMap((contact) => contact.phoneNumbers)).size, 4);
  assert.equal(getRehabilitatorsForCounty('mONROE').length, 8);
  assert.ok(monroeContacts.every((contact) => contact.counties.includes('Monroe')));
  assert.equal(rehabilitators.length, 69);
  assert.equal(new Set(rehabilitators.flatMap((contact) => contact.counties)).size, 45);
  assert.equal(directorySource.updatedAt, 'September 29, 2026');
  assert.equal(rehabilitators.find((contact) => contact.name === 'Johnna Smith')?.phoneNumbers[0], '260-731-5953');
  assert.equal(rehabilitators.find((contact) => contact.name === 'Amy Clark')?.contactMethod, 'text preferred');
});

test('county contact choices distinguish provider listings from distinct phone numbers', () => {
  const brownContacts = getRehabilitatorsForCounty('Brown');
  assert.equal(brownContacts.length, 2);
  assert.equal(new Set(brownContacts.flatMap((contact) => contact.phoneNumbers)).size, 1);
});

test('animal filtering keeps only DNR listings whose published coverage fits the selected animal', () => {
  const bartholomewContacts = getRehabilitatorsForCounty('Bartholomew');
  assert.deepEqual(
    getRehabilitatorsForAnimal(bartholomewContacts, 'Raccoon').map((contact) => contact.name),
    ['Emily Barga'],
  );
  assert.deepEqual(
    getRehabilitatorsForAnimal(bartholomewContacts, 'Bird').map((contact) => contact.name),
    ['Kathy Hershey'],
  );
  assert.deepEqual(getRehabilitatorsForAnimal(bartholomewContacts, 'Other mammal'), []);
  assert.deepEqual(
    getRehabilitatorsForAnimal(getRehabilitatorsForCounty('Blackford'), 'Other mammal').map((contact) => contact.name),
    ['Judi Crouch'],
  );
  assert.deepEqual(getRehabilitatorsForAnimal(bartholomewContacts, 'Unknown'), []);
});

test('animal filters respect bird and injury restrictions in DNR coverage notes', () => {
  const madisonContacts = getRehabilitatorsForCounty('Madison');
  assert.deepEqual(getRehabilitatorsForAnimal(madisonContacts, 'Bird'), []);

  const notForInjuredAnimals = rehabilitators.find((contact) => /not injured animals/i.test(contact.animals));
  assert.ok(notForInjuredAnimals);
  assert.deepEqual(getRehabilitatorsForAnimal([notForInjuredAnimals], 'Rabbit / hare', true), []);
  assert.deepEqual(getRehabilitatorsForAnimal([notForInjuredAnimals], 'Rabbit / hare', false), [notForInjuredAnimals]);
});

test('alternate county suggestions use matching DNR coverage and the current injury concern', () => {
  const raccoonCounties = getCountiesForAnimal('Raccoon');
  assert.ok(raccoonCounties.includes('Bartholomew'));
  assert.ok(!raccoonCounties.includes('Allen'));
  assert.deepEqual(raccoonCounties, [...raccoonCounties].sort((first, second) => first.localeCompare(second)));
  assert.ok(getCountiesForAnimal('Rabbit / hare', false).includes('Wabash'));
  assert.ok(!getCountiesForAnimal('Rabbit / hare', true).includes('Wabash'));
  assert.deepEqual(getCountiesForAnimal('Unknown'), []);
});

test('no county-specific listing is invented when the DNR directory has no entry', () => {
  assert.deepEqual(getRehabilitatorsForCounty('Marion'), []);
  assert.deepEqual(getRehabilitatorsForCounty('Hamilton'), []);
});

test('provider hours and recorded after-hours guidance are shown only with their published sources', () => {
  const jennifer = rehabilitators.find((contact) => contact.name === 'Jennifer Hancock');
  const leah = rehabilitators.find((contact) => contact.name === 'Leah Perry');
  assert.ok(jennifer?.normalHours);
  assert.ok(leah?.normalHours);
  assert.equal(jennifer.normalHours.sourceUrl, 'https://www.rewildingindiana.org/contact');
  assert.match(jennifer.normalHours.text, /9 a\.m\.–8 p\.m\./);
  assert.match(jennifer.normalHours.text, /not guaranteed/);
  assert.equal(jennifer.afterHoursInstructions?.sourceUrl, 'https://www.rewildingindiana.org/rehabilitation-center');
  assert.match(jennifer.afterHoursInstructions?.text ?? '', /recorded guidance/);
  assert.equal(leah.contactMethod, 'phone calls only');
  assert.equal(getVerifiedAfterHoursOption(jennifer), null);
  assert.equal(getVerifiedAfterHoursOption(leah), null);
  assert.equal(noConfirmedAfterHoursServiceMessage, 'No verified after-hours wildlife service is listed in this prototype.');
});

test('a source-backed after-hours option needs a phone, source, and verification date', () => {
  const base = rehabilitators[0];
  const option = {
    name: 'Verified test listing',
    category: 'wildlife emergency' as const,
    availability: '24-hour' as const,
    phoneNumbers: ['verified-number'],
    sourceUrl: 'https://example.org/verified-hours',
    verifiedAt: 'October 7, 2026',
  };
  const contactWithOption = { ...base, afterHoursOption: option };
  assert.equal(getVerifiedAfterHoursOption(contactWithOption), option);
  assert.equal(getVerifiedAfterHoursOption({
    ...contactWithOption,
    afterHoursOption: { ...option, phoneNumbers: [], sourceUrl: '' },
  }), null);
});

test('high-risk concerns route urgently for every animal type', () => {
  const base = demos.find((demo) => demo.id === 'bleeding-squirrel')?.answers;
  assert.ok(base);
  const highRiskConcerns = [
    'Visible bleeding',
    'Serious injury',
    'Unable to move',
    'Suspected broken limb',
    'Trouble breathing',
    'Animal in traffic',
    'Other urgent concern',
  ];
  for (const animal of fieldOptions.animal.slice(0, -1)) {
    for (const injury of highRiskConcerns) {
      const encounter = { ...base, animal, injury };
      assert.equal(isUrgentConcern(encounter), true, `${injury} should be urgent for ${animal}`);
      assert.equal(isInjuredOrUrgentConcern(encounter), true);
      assert.equal(routeEncounter(encounter).outcome, 'professional');
    }
  }
});

test('other visible injuries route to a rehabilitator without using the red urgent status', () => {
  const base = demos.find((demo) => demo.id === 'bleeding-squirrel')?.answers;
  assert.ok(base);
  for (const animal of fieldOptions.animal.slice(0, -1)) {
    const encounter = { ...base, animal, injury: 'Other visible injury' };
    assert.equal(isInjuredOrUrgentConcern(encounter), true);
    assert.equal(isUrgentConcern(encounter), false);
    assert.equal(routeEncounter(encounter).outcome, 'professional');
  }
});

test('no visible injury and uncertainty are not mislabeled as urgent injury reports', () => {
  assert.equal(isUrgentConcern({ injury: 'No visible injury' }), false);
  assert.equal(isUrgentConcern({ injury: 'Not sure' }), false);
  assert.equal(isInjuredOrUrgentConcern({ injury: 'No visible injury' }), false);
  assert.equal(isInjuredOrUrgentConcern({ injury: 'Not sure' }), false);
});

test('an unknown time period does not cause professional contact or make claims about contact hours', () => {
  const scenario = demos.find((demo) => demo.id === 'healthy-squirrel');
  assert.ok(scenario);
  const unknownPeriod = { ...scenario.answers, timeOfDay: 'Not sure' };

  assert.equal(routeEncounter(unknownPeriod).outcome, 'observe');
});

test('quick examples omit the evening injury scenario without changing evening injury routing', () => {
  const scenario = demos.find((demo) => demo.id === 'bleeding-squirrel');
  assert.ok(scenario);
  assert.ok(!demos.some((demo) => demo.id === 'after-hours-bleeding'));
  const eveningScenario = { ...scenario.answers, timeOfDay: 'Dusk / evening (5–9 p.m.)' };

  assert.equal(routeEncounter(eveningScenario).outcome, 'professional');
  assert.ok(getRehabilitatorsForCounty(eveningScenario.county).length > 1);
});

test('unclear required answers show the exact more-information result instead of a contact recommendation', () => {
  const scenario = demos.find((demo) => demo.id === 'healthy-squirrel');
  assert.ok(scenario);
  assert.equal(routeEncounter(scenario.answers).outcome, 'observe');

  const uncertainCase = { ...scenario.answers, injury: 'Not sure' };
  const result = routeEncounter(uncertainCase);
  assert.equal(result.outcome, 'moreInfo');
  assert.equal(result.reason, MORE_INFORMATION_NEEDED_MESSAGE);
  assert.deepEqual(getMissingRequiredFields(uncertainCase), ['injury']);
});

test('reported movement problems, immediate danger, and weakness or distress route to professional help', () => {
  const scenario = demos.find((demo) => demo.id === 'healthy-squirrel');
  assert.ok(scenario);
  const reportedConcerns = [
    { movement: 'Unable to move normally' },
    { danger: 'Immediate danger: traffic or nearby pet' },
    { danger: 'Other immediate danger' },
    { condition: 'Weak, cold, or distressed' },
  ];
  for (const concern of reportedConcerns) {
    const encounter = { ...scenario.answers, ...concern };
    assert.equal(routeEncounter(encounter).outcome, 'professional');
    assert.equal(isInjuredOrUrgentConcern(encounter), true);
    assert.equal(isUrgentConcern(encounter), true);
  }
});

test('blank and unknown required answers are marked before any final route', () => {
  const scenario = demos.find((demo) => demo.id === 'healthy-squirrel');
  assert.ok(scenario);
  for (const field of requiredAnswerFields) {
    for (const value of ['', 'Not sure', 'Unknown']) {
      const encounter = { ...scenario.answers, [field]: value };
      const result = routeEncounter(encounter);
      assert.equal(result.outcome, 'moreInfo', `${field}=${value} must request more information`);
      assert.ok(getMissingRequiredFields(encounter).includes(field));
    }
  }
});

test('a reported high-risk concern waits for missing safety details, then routes to professional help', () => {
  const scenario = demos.find((demo) => demo.id === 'healthy-squirrel');
  assert.ok(scenario);
  const incompleteReport = { ...scenario.answers, injury: 'Visible bleeding', movement: 'Not sure' };
  const followUp = routeEncounter(incompleteReport);
  assert.equal(followUp.outcome, 'moreInfo');
  if (followUp.outcome === 'moreInfo') assert.deepEqual(followUp.fields, ['movement']);

  const clarifiedReport = { ...incompleteReport, movement: 'Moving normally' };
  assert.equal(routeEncounter(clarifiedReport).outcome, 'professional');
});

test('an unknown animal type pauses even a reported high-risk concern until a best guess is supplied', () => {
  const scenario = demos.find((demo) => demo.id === 'healthy-squirrel');
  assert.ok(scenario);
  const incompleteReport = { ...scenario.answers, animal: 'Unknown', injury: 'Visible bleeding' };
  const result = routeEncounter(incompleteReport);
  assert.equal(result.outcome, 'moreInfo');
  assert.deepEqual(getMissingRequiredFields(incompleteReport), ['animal']);

  assert.equal(routeEncounter({ ...incompleteReport, animal: 'Bird' }).outcome, 'professional');
});

test('uncertain non-required details and a parent not seen do not trigger contact', () => {
  const scenario = demos.find((demo) => demo.id === 'healthy-squirrel');
  assert.ok(scenario);
  const unrelatedDetails = {
    ...scenario.answers,
    animal: 'Other mammal',
    timeOfDay: 'Not sure',
    appearance: 'Unclear / not sure',
    parentSeen: 'No — not seen',
    actions: ['Moved the animal', 'Other / not sure'],
  };
  assert.equal(routeEncounter(unrelatedDetails).outcome, 'observe');

  const unknownAnimal = { ...unrelatedDetails, animal: 'Unknown' };
  assert.equal(routeEncounter(unknownAnimal).outcome, 'moreInfo');
  assert.deepEqual(getMissingRequiredFields(unknownAnimal), ['animal']);
});

test('healthy young wildlife is routed to observation with the required parent caveat', () => {
  const scenario = demos.find((demo) => demo.id === 'baby-at-dusk');
  assert.ok(scenario);
  const notSeen = { ...scenario.answers, parentSeen: 'No — not seen' };
  const result = routeEncounter(notSeen);
  assert.equal(result.outcome, 'observe');
  assert.match(result.reason, /Young wildlife may appear alone even when a parent is nearby\. This prototype cannot confirm that an animal is healthy or orphaned\./);
});

test('missing county alone does not cause a recommendation to contact a rehabilitator', () => {
  const scenario = demos.find((demo) => demo.id === 'healthy-squirrel');
  assert.ok(scenario);
  const withoutCounty = { ...scenario.answers, county: '' };

  assert.equal(routeEncounter(withoutCounty).outcome, 'observe');
});

test('directory snapshot contains no fictional 555 numbers', () => {
  assert.ok(rehabilitators.length > 1);
  assert.ok(rehabilitators.every((contact) => contact.phoneNumbers.length > 0));
  assert.ok(rehabilitators.every((contact) => contact.phoneNumbers.every((number) => !number.includes('555'))));
});