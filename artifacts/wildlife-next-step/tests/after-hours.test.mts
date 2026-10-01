import assert from 'node:assert/strict';
import test from 'node:test';
import { afterHoursContacts } from '../src/data/contacts.ts';
import { demos } from '../src/data/scenarios.ts';
import { getContactForCounty, getListedHoursStatus } from '../src/logic/contactHours.ts';
import { routeEncounter } from '../src/logic/ruleEngine.ts';

test('listed hours open at the start and close at the end', () => {
  const monroeContact = getContactForCounty('Monroe');

  assert.equal(getListedHoursStatus('09:59', monroeContact), 'closed');
  assert.equal(getListedHoursStatus('10:00', monroeContact), 'open');
  assert.equal(getListedHoursStatus('14:59', monroeContact), 'open');
  assert.equal(getListedHoursStatus('15:00', monroeContact), 'closed');
});

test('invalid or missing clock time never implies the contact is open', () => {
  const contact = getContactForCounty('Marion');

  assert.equal(getListedHoursStatus('', contact), 'unknown');
  assert.equal(getListedHoursStatus('25:00', contact), 'unknown');
});

test('an unknown encounter time routes conservatively and does not claim hours ended', () => {
  const scenario = demos.find((demo) => demo.id === 'bleeding-squirrel');
  assert.ok(scenario);
  const unknownTime = { ...scenario.answers, localTime: 'Not sure' };
  const contact = getContactForCounty(unknownTime.county);

  assert.equal(getListedHoursStatus(unknownTime.localTime, contact), 'unknown');
  assert.equal(routeEncounter(unknownTime).outcome, 'professional');
});

test('the after-hours demo routes an injury to professional guidance after close', () => {
  const scenario = demos.find((demo) => demo.id === 'after-hours-bleeding');
  assert.ok(scenario, 'after-hours demo scenario should exist');
  const contact = getContactForCounty(scenario.answers.county);

  assert.equal(getListedHoursStatus(scenario.answers.localTime, contact), 'closed');
  assert.equal(routeEncounter(scenario.answers).outcome, 'professional');
});

test('the current directory exposes no fictional after-hours service as confirmed', () => {
  assert.deepEqual(afterHoursContacts, []);
});