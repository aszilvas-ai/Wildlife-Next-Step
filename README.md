# <ins> Wildlife Next Step <ins>

- Wildlife Next Step is a prototype that helps someone who finds a wild animal understand the safest next step, including what to do when it is after normal rehabilitator hours.

- The first working slice allows a user to enter a fictional animal situation. The simulated AI extracts details and asks follow-up questions, then the user receives one of three paths: leave it alone and observe, contact a rehabilitator, or view an after-hours plan.
  
- Prototype link: https://wildlife-next-step.replit.app/
  
- AI behavior is currently simulated. The prototype uses preset follow-up questions and rule-based results rather than a live AI model.

- In a future version, AI would read a user’s description of a wildlife situation, extract important details, and ask follow-up questions in plain language. It would help organize the information before the app uses expert-reviewed rules to select a path.

- Users can currently enter a fictional wildlife situation, answer questions, and receive a visible result: leave it alone and observe, contact a rehabilitator, or view an after-hours plan. The app also simulates Indiana DNR rehabilitator information.

- The AI behavior is simulated with preset follow-up questions and rule-based recommendations. The app does not currently use a live AI model to understand the user’s own written description.

## Test Results
  
| Test | Input or Action | What Happened | Pass, Partial, or Fail |
| --- | --- | --- | --- |
| Typical Case | Entered a healthy-looking juvenile squirrel that was moving normally and showed no visible injury, unknown if the parent was nearby, and daytime. | The app asks any needed follow-up questions and gives the “Leave it alone and observe” path. It explains why and does not give animal-care instructions. | Pass because this is a situation that has not yet caused concern. |
| Challenge Case | Entered an animal with visible bleeding at night, after the listed rehabilitator’s normal hours. | The app recognized the report of visible bleeding after normal hours and showed an Urgent After-Hours Plan. It provided the simulated rehabilitator’s phone number and message option, directed the user to check verified alternate or 24-hour veterinary contacts, and explained that the app could not determine whether waiting was safe or provide treatment instructions. | Passed because it showed the after-hours process safely by highlighting the Indiana rehabilitation guidelines. |
| Invalid or Empty Case | I tried submitting the form without entering an animal type, injury information, or enough details to come to a conclusion. | I entered “unknown” for every question, but the app still recommended contacting a wildlife rehabilitator. It did not recognize that there was not enough information to provide a supported recommendation. | Failed because despite putting in unknown for every answer, the final recommendation was to contact a wildlife rehabilitator instead of coming up with an error message asking for more information. |

## Known Limitations

1. The AI behavior is still simulated. The prototype uses preset follow-up questions and rule-based recommendations instead of a live AI model that can understand a user’s written description. Eventually, I'd like to be rid of the simulated AI and actually utilize it.

2. The error handling needs improvement. During testing, entering “unknown” for every question still produced a recommendation to contact a wildlife rehabilitator instead of asking the user for more information. The next version should block unsupported recommendations and highlight missing answers.

3. The prototype does not save a user’s progress or past results. If a user refreshes the page or leaves the app, they must start the wildlife scenario again. A later version could save a practice session or let a teacher review completed scenarios.
</br>

# Project Prototype Revisions


## Response to Peer Feedback

| Feedback or observed issue | Decision | What changed, or why it was deferred |
| --- | --- | --- |
| Selecting “Not sure” led to a message asking for a better answer, and the peer could not continue. | Acted on | I added a clue for the question and a way to continue without guessing. Important unknown answers are identified in the result. |
| The question flow felt long toward the end. | Adapted | I grouped the nine questions into five screens. I kept the individual questions because they collect different details relevant to the result. This reduces the number of screens, although it does not reduce the number of questions. |
| The urgent after-hours guidance appeared below a long section of contact information in the bleeding-squirrel result. | Acted on | I moved the urgent after-hours guidance above the county and provider listings so it is easier to find. |
| The result explained why it recommended a route, and the examples and checklists were helpful. | Kept | I kept the explanations, examples, and checklists because they help students understand the reasoning behind a practice result. |

## Evaluation of the Revised Prototype

The cases below use fictional information. The tests review the Wildlife Next Step prototype and its programmed results. They do not establish the accuracy of a live AI model.

| Case | Input or action | Expected result or success criterion | Actual result | Result | Implication or next step |
| --- | --- | --- | --- | --- | --- |
| Typical 1 | Selected the built-in example of a squirrel moving normally. | The result should suggest leaving the animal alone and observing, with an explanation. | The example showed “Leave it alone and observe” and explained that no injury, movement problem, immediate danger, weakness, coldness, or distress was reported. | Pass | The example gives a clear result and explains why it was suggested. Test with students to see whether the explanation is easy to understand. |
| Typical 2 | Selected the built-in example of a squirrel with visible bleeding. | The result should suggest contacting a wildlife rehabilitator, with urgent after-hours guidance before the provider listings. | The example showed “Contact a wildlife rehabilitator.” The urgent after-hours steps appeared near the top, before the Monroe County provider listings. | Pass | Urgent guidance is easier to find. The prototype does not confirm provider availability. |
| Challenge | Changed the injury answer to “Not sure” in a fictional squirrel scenario and continued. | The user should be able to continue without guessing and receive useful guidance if the injury status remains unknown. | The review screen marked the answer as unsure. The result showed “More information needed” and an “If you still can’t tell” section. It advised staying at a safe distance, suggested asking a trusted adult or permitted wildlife rehabilitator for guidance, and displayed links to Indiana DNR resources. The user could also change the answer or leave it unknown. | Pass | The user has a way forward without being asked to approach the animal or guess. Another student could test whether the guidance is clear. |
| Invalid or empty | Left the injury question blank. | The prototype should distinguish a blank answer from “Not sure” and identify the question that needs an answer. | Replit reported that the review screen showed “Needs a meaningful answer” and the result provided an Answer button. | Pass | Repeat this test independently to confirm the blank-answer experience. |
| Risk | Started with the fictional squirrel moving normally, then edited the injury answer from “No visible injury” to “Visible bleeding.” | The other answers should stay the same, and the result should update to reflect the reported injury. | The other answers were preserved. The result changed from “Leave it alone and observe” to “Contact a wildlife rehabilitator” and showed urgent after-hours guidance. | Pass | Users can correct an important answer and receive an updated result. More combinations of answers should still be tested. |

### Before and After

Before the revision, a peer selected “Not sure” and received a message asking for a better answer. They could not continue with that choice, even though it was an available option.

After the revision, I selected “Not sure” for the injury question. The prototype allowed me to continue without guessing. The result showed “More information needed” and included an “If you still can’t tell” section. It explained that the user could leave the answer unknown, stay at a safe distance, and ask a trusted adult or permitted wildlife rehabilitator for guidance. It also displayed links to official Indiana wildlife resources. This is important because someone may not be able to tell whether an animal is injured and should not need to approach it or guess to continue. </br>
<p align="center"> <img width="589.5" height="327" alt="Screenshot 2026-11-17 at 9 10 36 PM" src="https://github.com/user-attachments/assets/0ce30ee6-a7d7-4624-b905-e3cc7ecf3408" /> </p>

### What the Evidence Tells Me

The revised prototype lets users try a built-in fictional wildlife scenario or enter details for one of their own. Users can review their answers and receive a result based on the information they provide. If someone selects “Not sure,” they can continue, but the final result explains that the website needs more information before it can suggest a specific next step. It also gives them guidance if they still cannot tell whether the animal is injured.

When the result suggests professional help, the prototype shows contact information for wildlife rehabilitators whose listed animal coverage matches the animal entered. The contacts come from the Indiana DNR directory, but the prototype does not confirm times they are available.

The tests suggest that the idea could help people who find an animal and want to help but do not know what to do. For now, the prototype is only for fictional practice, and I have not tested enough situations or users to know how reliable and clear it is in every case. To improve it, I would ask a real wildlife rehabilitator whether this process would be helpful to them and what changes they would recommend.

### Concrete Risk

One risk is that someone might rush through the questions or guess answers just to see who they can call. If the answers do not reflect the situation, the prototype could suggest contacting a wildlife rehabilitator when it may not be necessary. This could add to rehabilitators’ workloads. 

To address this risk, the prototype allows users to select “Not sure” rather than guess. If an important answer is unknown, it explains that it needs more information before suggesting a specific next step, but it also offers guidance. Users can review and edit their answers before seeing a result. If they still cannot tell whether an animal is injured, the prototype gives them guidance without asking them to approach the animal.

In my test, I selected “Not sure” for the injury question. The prototype allowed me to continue, explained why it could not suggest a specific path, and provided guidance for someone who still could not tell whether the animal was injured. This safeguard works through programmed rules in the prototype, not a live AI model.

The safeguard reduces pressure to guess, but it does not prevent someone from rushing or choosing inaccurate answers. It also does not confirm whether a rehabilitator is available. This risk relates to over-reliance on AI because users still need to think carefully about the information they provide. In the future, I would ask a wildlife rehabilitator whether the process and its recommendations would be helpful or could create unnecessary work.

### AI-Use Disclosure

- Tools used: I used ChatGPT and the Replit Agent while developing Wildlife Next Step.

- Development assistance: ChatGPT helped me craft prompts for Replit based on peer feedback, organize my test results into table form, fix a bug that was crashing my website, and revise my demo script.

- Representative prompts:
1. I asked Replit to improve the “Not sure” experience so a user could continue without guessing. It added a clue, allowed the user to continue with uncertainty, and showed “More information needed” when an important answer was unknown. I then asked for more guidance for someone who still could not tell whether the animal was injured.

2. I asked Replit to make the question flow feel shorter while keeping questions needed for a cautious result. It grouped the questions into five screens instead of nine while keeping the individual questions.

3. I asked Replit to make the urgent step guidance easier to find by moving it to the top of the page. It moved the guidance higher on the result page, above the provider listings.

- Human judgment: An earlier AI-produced version recommended showing “More information needed” when the injury status was unknown. I felt that this was incomplete because someone might not be able to tell whether the animal was injured without getting closer. I asked Replit to add guidance for someone who remains unsure, including staying at a safe distance and finding wildlife resources. I made this change so users would have a way forward without feeling they needed to guess or approach the animal.

- Verification: I used Indiana DNR resources to check the wildlife guidance and rehabilitator information used in the prototype. I also tested fictional scenarios to see whether the results matched the information entered. The prototype links to official resources so users can check the guidance themselves. I still need to confirm that the directory information is current and ask a permitted wildlife rehabilitator to review the questions, suggested next steps, and safety guidance. The prototype has not yet been validated for real wildlife encounters.

- AI inside the product: The intended role of AI is to interpret a user’s description of a wildlife situation, identify important details, and help determine what follow-up questions are needed. The input would be the user’s description and answers, and the output would help organize that information before the app suggests a next step. The current prototype does not use a live AI model. It uses preset questions, programmed rules, and prepared responses. 


