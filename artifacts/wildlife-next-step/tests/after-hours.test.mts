import assert from 'node:assert/strict';
import test from 'node:test';
import { directorySource, rehabilitators } from '../src/data/contacts.ts';
import { demos } from '../src/data/scenarios.ts';
import { getRehabilitatorsForCounty } from '../src/logic/contactDirectory.ts';
import { routeEncounter } from '../src/logic/ruleEngine.ts';

test('the DNR directory lookup returns the published contacts for a selected county', () => {
  const monroeContacts = getRehabilitatorsForCounty('Monroe');
  assert.equal(monroeContacts.length, 8);
  assert.equal(getRehabilitatorsForCounty('mONROE').length, 8);
  assert.ok(monroeContacts.every((contact) => contact.counties.includes('Monroe')));
  assert.equal(rehabilitators.length, 69);
  assert.equal(new Set(rehabilitators.flatMap((contact) => contact.counties)).size, 45);
  assert.equal(directorySource.updatedAt, 'September 29, 2026');
});

test('no county-specific listing is invented when the DNR directory has no entry', () => {
  assert.deepEqual(getRehabilitatorsForCounty('Marion'), []);
  assert.deepEqual(getRehabilitatorsForCounty('Hamilton'), []);
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