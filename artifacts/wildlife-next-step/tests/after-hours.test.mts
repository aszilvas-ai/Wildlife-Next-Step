import assert from 'node:assert/strict';
import test from 'node:test';
import { directorySource, rehabilitators } from '../src/data/contacts.ts';
import { demos, fieldOptions } from '../src/data/scenarios.ts';
import { getCountiesForAnimal, getRehabilitatorsForAnimal, getRehabilitatorsForCounty, getVerifiedAfterHoursOption, noConfirmedAfterHoursServiceMessage } from '../src/logic/contactDirectory.ts';
import { isInjuredOrUrgentConcern, isUrgentConcern, routeEncounter } from '../src/logic/ruleEngine.ts';

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
  const base = demos.find((demo) => demo.id === 'after-hours-bleeding')?.answers;
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
  for (const animal of fieldOptions.animal) {
    for (const injury of highRiskConcerns) {
      const encounter = { ...base, animal, injury };
      assert.equal(isUrgentConcern(encounter), true, `${injury} should be urgent for ${animal}`);
      assert.equal(isInjuredOrUrgentConcern(encounter), true);
      assert.equal(routeEncounter(encounter).outcome, 'professional');
    }
  }
});

test('other visible injuries route to a rehabilitator without using the red urgent status', () => {
  const base = demos.find((demo) => demo.id === 'after-hours-bleeding')?.answers;
  assert.ok(base);
  for (const animal of fieldOptions.animal) {
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

test('an unknown time period routes conservatively without claiming contact hours ended', () => {
  const scenario = demos.find((demo) => demo.id === 'bleeding-squirrel');
  assert.ok(scenario);
  const unknownPeriod = { ...scenario.answers, timeOfDay: 'Not sure' };

  assert.equal(routeEncounter(unknownPeriod).outcome, 'professional');
});

test('the evening injury demo has several directory contacts without asserting any are open', () => {
  const scenario = demos.find((demo) => demo.id === 'after-hours-bleeding');
  assert.ok(scenario, 'after-hours demo scenario should exist');

  assert.equal(routeEncounter(scenario.answers).outcome, 'professional');
  assert.ok(getRehabilitatorsForCounty(scenario.answers.county).length > 1);
});

test('no visible injury is not described as an injury when another answer requires guidance', () => {
  const scenario = demos.find((demo) => demo.id === 'healthy-squirrel');
  assert.ok(scenario);
  assert.equal(routeEncounter(scenario.answers).outcome, 'observe');

  const uncertainCase = { ...scenario.answers, parentSeen: 'Not sure' };
  const result = routeEncounter(uncertainCase);
  assert.equal(result.outcome, 'professional');
  assert.match(result.reason, /Some details are uncertain/);
  assert.doesNotMatch(result.reason, /visible injury/i);
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