## Summary

<!-- What does this PR change, and why? -->

## Type of change

- [ ] New test scenarios
- [ ] Fix for a failing or flaky test
- [ ] Framework change (screens, steps, validations, API layer, test data)
- [ ] CI, tooling or documentation

## Scenarios

<!-- One line per scenario added or changed. Delete this section if there are none. -->

| Spec | Scenario | Backend check |
| ---- | -------- | ------------- |
|      |          |               |

## Test data

- [ ] Data is generated (Faker), not hard-coded
- [ ] Data is seeded through the API, not the UI
- [ ] Every created record is tracked and cleaned up after the test
- [ ] Records created in the app (not by `testData`) are tracked with `trackRoomCreatedInApp`

## How it was verified

- [ ] `npm run lint`, `npm run typecheck` and `npm run format:check` pass
- [ ] `npm run test:data` passes against a local server
- [ ] UI specs pass on an emulator (locally or in CI): link the run below
- [ ] New selectors use test ids, not visible text, unless they target system or alert buttons

**CI run:**

## Flakiness and risks

<!-- Waits added, retries, known unstable areas, anything the reviewer should look at closely. -->

## Screenshots or report

<!-- Allure report link, screenshots or the screen dump of a failure, when relevant. -->
