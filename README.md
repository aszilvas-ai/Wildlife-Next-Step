# Wildlife Next Step

- Wildlife Next Step is a prototype that helps someone who finds a wild animal understand the safest next step, including what to do when it is after normal rehabilitator hours.

- The first working slice allows a user to enter a fictional animal situation. The simulated AI extracts details and asks follow-up questions, then the user receives one of three paths: leave it alone and observe, contact a rehabilitator, or view an after-hours plan.
  
- Prototype link: https://wildlife-next-step.replit.app/
  
- AI behavior is currently simulated. The prototype uses preset follow-up questions and rule-based results rather than a live AI model.

- In a future version, AI would read a user’s description of a wildlife situation, extract important details, and ask follow-up questions in plain language. It would help organize the information before the app uses expert-reviewed rules to select a path.

- Users can currently enter a fictional wildlife situation, answer questions, and receive a visible result: leave it alone and observe, contact a rehabilitator, or view an after-hours plan. The app also simulates Indiana DNR rehabilitator information.

- The AI behavior is simulated with preset follow-up questions and rule-based recommendations. The app does not currently use a live AI model to understand the user’s own written description.

## Test results:
  
| Test | Input or Action | What Happened | Pass, Partial, or Fail |
| --- | --- | --- | --- |
| Typical Case | Entered a healthy-looking juvenile squirrel that was moving normally and showed no visible injury, unknown if the parent was nearby, and daytime. | The app asks any needed follow-up questions and gives the “Leave it alone and observe” path. It explains why and does not give animal-care instructions. | Pass because this is a situation that has not yet caused concern. |
| Challenge Case | Entered an animal with visible bleeding at night, after the listed rehabilitator’s normal hours. | The app recognized the report of visible bleeding after normal hours and showed an Urgent After-Hours Plan. It provided the simulated rehabilitator’s phone number and message option, directed the user to check verified alternate or 24-hour veterinary contacts, and explained that the app could not determine whether waiting was safe or provide treatment instructions. | Passed because it showed the after-hours process safely by highlighting the Indiana rehabilitation guidelines. |
| Invalid or Empty Case | I tried submitting the form without entering an animal type, injury information, or enough details to come to a conclusion. | I entered “unknown” for every question, but the app still recommended contacting a wildlife rehabilitator. It did not recognize that there was not enough information to provide a supported recommendation. | Failed because despite putting in unknown for every answer, the final recommendation was to contact a wildlife rehabilitator instead of coming up with an error message asking for more information. |

## Known limitations:

1. The AI behavior is still simulated. The prototype uses preset follow-up questions and rule-based recommendations instead of a live AI model that can understand a user’s written description. Eventually, I'd like to be rid of the simulated AI and actually utilize it.

2. The error handling needs improvement. During testing, entering “unknown” for every question still produced a recommendation to contact a wildlife rehabilitator instead of asking the user for more information. The next version should block unsupported recommendations and highlight missing answers.

3. The prototype does not save a user’s progress or past results. If a user refreshes the page or leaves the app, they must start the wildlife scenario again. A later version could save a practice session or let a teacher review completed scenarios.
</br>

# Project Prototype Revisions

## Evaluation of the Revised Prototype

The cases below use fictional information. The tests review the Wildlife Next Step prototype and its programmed results. They do not establish the accuracy of a live AI model.

| Case | Input or action | Expected result or success criterion | Actual result | Result | Implication or next step |
| --- | --- | --- | --- | --- | --- |
| Typical 1 | Selected the built-in example of a squirrel moving normally. | The result should suggest leaving the animal alone and observing, with an explanation. | The example showed “Leave it alone and observe” and explained that no injury, movement problem, immediate danger, weakness, coldness, or distress was reported. | Pass | The example gives a clear result and explains why it was suggested. Test with students to see whether the explanation is easy to understand. |
| Typical 2 | Selected the built-in example of a squirrel with visible bleeding. | The result should suggest contacting a wildlife rehabilitator, with urgent after-hours guidance before the provider listings. | The example showed “Contact a wildlife rehabilitator.” The urgent after-hours steps appeared near the top, before the Monroe County provider listings. | Pass | Urgent guidance is easier to find. The prototype does not confirm provider availability. |
| Challenge | Changed the injury answer to “Not sure” in a fictional squirrel scenario and continued. | The user should be able to continue without guessing and receive useful guidance if the injury status remains unknown. | The review screen marked the answer as unsure. The result showed “More information needed” and an “If you still can’t tell” section. It advised staying at a safe distance, suggested asking a trusted adult or permitted wildlife rehabilitator for guidance, and displayed links to Indiana DNR resources. The user could also change the answer or leave it unknown. | Pass | The user has a way forward without being asked to approach the animal or guess. Another student could test whether the guidance is clear. |
| Invalid or empty | Left the injury question blank. | The prototype should distinguish a blank answer from “Not sure” and identify the question that needs an answer. | Replit reported that the review screen showed “Needs a meaningful answer” and the result provided an Answer button. | Pass | Repeat this test independently to confirm the blank-answer experience. |
| Risk | Started with the fictional squirrel moving normally, then edited the injury answer from “No visible injury” to “Visible bleeding.” | The other answers should stay the same, and the result should update to reflect the reported injury. | The other answers were preserved. The result changed from “Leave it alone and observe” to “Contact a wildlife rehabilitator” and showed urgent after-hours guidance. | Pass | Users can correct an important answer and receive an updated result. More combinations of answers should still be tested. |

### Before and after

Before the revision, a peer selected “Not sure” and received a message asking for a better answer. They could not continue with that choice, even though it was an available option.

After the revision, I selected “Not sure” for the injury question. The prototype allowed me to continue without guessing. The result showed “More information needed” and included an “If you still can’t tell” section. It explained that the user could leave the answer unknown, stay at a safe distance, and ask a trusted adult or permitted wildlife rehabilitator for guidance. It also displayed links to official Indiana wildlife resources. This is important because someone may not be able to tell whether an animal is injured and should not need to approach it or guess to continue.

### What the evidence tells me

The built-in examples show different results for a normally moving squirrel and a squirrel with visible bleeding. The revised flow also gives the user guidance when the injury status remains unknown and updates the result when an injury answer is changed. These checks support the idea that the prototype can help students practice thinking through fictional wildlife situations, but they do not prove its guidance is reliable for real situations or that a future AI model would be accurate.

Next, I would independently repeat the blank-answer test, test more combinations of answers, and ask another student to try the five-screen flow. The prototype displays links to external resources, but their current availability and provider availability were not verified in this test.
