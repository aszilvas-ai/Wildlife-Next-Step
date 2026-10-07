import assert from 'node:assert/strict';
import test from 'node:test';
import { directorySource, rehabilitators } from '../src/data/contacts.ts';
import { demos, fieldOptions } from '../src/data/scenarios.ts';
import { getRehabilitatorsForCounty, getVerifiedAfterHoursContacts } from '../src/logic/contactDirectory.ts';
import { isUrgentConcern, routeEncounter } from '../src/logic/ruleEngine.ts';

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

test('no county-specific listing is invented when the DNR directory has no entry', () => {
  assert.deepEqual(getRehabilitatorsForCounty('Marion'), []);
  assert.deepEqual(getRehabilitatorsForCounty('Hamilton'), []);
});

test('the official directory has no source-verified after-hours or 24-hour contacts in this snapshot', () => {
  assert.deepEqual(getVerifiedAfterHoursContacts('Monroe'), []);
  assert.ok(rehabilitators.every((contact) => !contact.verifiedAfterHoursAvailability));
});

test('urgent concern routing is the same for every animal type', () => {
  const base = demos.find((demo) => demo.id === 'after-hours-bleeding')?.answers;
  assert.ok(base);
  for (const animal of fieldOptions.animal) {
    for (const injury of ['Visible bleeding', 'Serious injury', 'Other urgent concern']) {
      const encounter = { ...base, animal, injury };
      assert.equal(isUrgentConcern(encounter), true, `${injury} should be urgent for ${animal}`);
      assert.equal(routeEncounter(encounter).outcome, 'professional');
    }
  }
});

test('no visible injury and uncertainty are not mislabeled as urgent injury reports', () => {
  assert.equal(isUrgentConcern({ injury: 'No visible injury' }), false);
  assert.equal(isUrgentConcern({ injury: 'Not sure' }), false);
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