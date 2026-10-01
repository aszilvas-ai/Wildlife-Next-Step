import assert from 'node:assert/strict';
import test from 'node:test';
import { afterHoursContacts } from '../src/data/contacts.ts';
import { demos } from '../src/data/scenarios.ts';
import { getContactForCounty, getListedHoursStatus } from '../src/logic/contactHours.ts';
import { routeEncounter } from '../src/logic/ruleEngine.ts';

test('time-of-day ranges are compared conservatively with listed hours', () => {
  const monroeContact = getContactForCounty('Monroe');
  const hamiltonContact = getContactForCounty('Hamilton');

  assert.equal(getListedHoursStatus('Early morning (midnight–8 a.m.)', monroeContact), 'closed');
  assert.equal(getListedHoursStatus('Morning (8 a.m.–noon)', monroeContact), 'unknown');
  assert.equal(getListedHoursStatus('Afternoon (noon–5 p.m.)', monroeContact), 'unknown');
  assert.equal(getListedHoursStatus('Dusk / evening (5–9 p.m.)', monroeContact), 'closed');
  assert.equal(getListedHoursStatus('Night (9 p.m.–midnight)', monroeContact), 'closed');
  assert.equal(getListedHoursStatus('Morning (8 a.m.–noon)', hamiltonContact), 'open');
  assert.equal(getListedHoursStatus('Afternoon (noon–5 p.m.)', hamiltonContact), 'open');
});

test('unknown or unrecognized time periods never imply the contact is open', () => {
  const contact = getContactForCounty('Marion');

  assert.equal(getListedHoursStatus('', contact), 'unknown');
  assert.equal(getListedHoursStatus('Not sure', contact), 'unknown');
});

test('an unknown time period routes conservatively and does not claim hours ended', () => {
  const scenario = demos.find((demo) => demo.id === 'bleeding-squirrel');
  assert.ok(scenario);
  const unknownPeriod = { ...scenario.answers, timeOfDay: 'Not sure' };
  const contact = getContactForCounty(unknownPeriod.county);

  assert.equal(getListedHoursStatus(unknownPeriod.timeOfDay, contact), 'unknown');
  assert.equal(routeEncounter(unknownPeriod).outcome, 'professional');
});

test('the after-hours demo routes an injury to professional guidance after close', () => {
  const scenario = demos.find((demo) => demo.id === 'after-hours-bleeding');
  assert.ok(scenario, 'after-hours demo scenario should exist');
  const contact = getContactForCounty(scenario.answers.county);

  assert.equal(getListedHoursStatus(scenario.answers.timeOfDay, contact), 'closed');
  assert.equal(routeEncounter(scenario.answers).outcome, 'professional');
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

test('the current directory exposes no fictional after-hours service as confirmed', () => {
  assert.deepEqual(afterHoursContacts, []);
});