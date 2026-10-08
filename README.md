# Wildlife Next Step

- Product name and a one-sentence description: Wildlife Next Step is a prototype that helps someone who finds a wild animal understand the safest next step, including what to do when it is after normal rehabilitator hours.

- The first working slice allows a user to enter a fictional animal situation. The simulated AI extracts details and asks follow-up questions, then the user receives one of three paths: leave it alone and observe, contact a rehabilitator, or view an after-hours plan.
  
- Prototype link: https://wildlife-next-step.replit.app/
  
- AI behavior is currently simulated. The prototype uses preset follow-up questions and rule-based results rather than a live AI model.

- What the future AI system is intended to do: In a future version, AI would read a user’s description of a wildlife situation, extract important details, and ask follow-up questions in plain language. It would help organize the information before the app uses expert-reviewed rules to select a path.

- What currently works: Users can enter a fictional wildlife situation, answer questions, and receive a visible result: leave it alone and observe, contact a rehabilitator, or view an after-hours plan. The app also simulates Indiana DNR rehabilitator information.

- What is simulated: The AI behavior is simulated with preset follow-up questions and rule-based recommendations. The app does not currently use a live AI model to understand the user’s own written description.

- Test results:
  
| Test | Input or Action | What Happened | Pass, Partial, or Fail |
| --- | --- | --- | --- |
| Typical Case | Entered a healthy-looking juvenile squirrel that was moving normally and showed no visible injury, unknown if the parent was nearby, and daytime. | The app asks any needed follow-up questions and gives the “Leave it alone and observe” path. It explains why and does not give animal-care instructions. | Pass because this is a situation that has not yet caused concern. |
| Challenge Case | Entered an animal with visible bleeding at night, after the listed rehabilitator’s normal hours. | The app recognized the report of visible bleeding after normal hours and showed an Urgent After-Hours Plan. It provided the simulated rehabilitator’s phone number and message option, directed the user to check verified alternate or 24-hour veterinary contacts, and explained that the app could not determine whether waiting was safe or provide treatment instructions. | Passed because it showed the after-hours process safely by highlighting the Indiana rehabilitation guidelines. |
| Invalid or Empty Case | I tried submitting the form without entering an animal type, injury information, or enough details to come to a conclusion. | I entered “unknown” for every question, but the app still recommended contacting a wildlife rehabilitator. It did not recognize that there was not enough information to provide a supported recommendation. | Failed because despite putting in unknown for every answer, the final recommendation was to contact a wildlife rehabilitator instead of coming up with an error message asking for more information. |

- Known limitations:

1. The AI behavior is still simulated. The prototype uses preset follow-up questions and rule-based recommendations instead of a live AI model that can understand a user’s written description. Eventually, I'd like to be rid of the simulated AI and actually utilize it.

2. The error handling needs improvement. During testing, entering “unknown” for every question still produced a recommendation to contact a wildlife rehabilitator instead of asking the user for more information. The next version should block unsupported recommendations and highlight missing answers.

3. The prototype does not save a user’s progress or past results. If a user refreshes the page or leaves the app, they must start the wildlife scenario again. A later version could save a practice session or let a teacher review completed scenarios.


