# Rocket.Chat Mobile E2E

[![Mobile E2E](https://github.com/LaraAlexLopes/rocketchat-mobile-e2e/actions/workflows/e2e.yml/badge.svg)](https://github.com/LaraAlexLopes/rocketchat-mobile-e2e/actions/workflows/e2e.yml)
[![Allure Report](https://img.shields.io/badge/report-Allure-orange)](https://laraalexlopes.github.io/rocketchat-mobile-e2e)

End-to-end test automation for the [Rocket.Chat](https://github.com/RocketChat/Rocket.Chat.ReactNative) Android app, a real-world React Native client, running against a disposable Rocket.Chat server in Docker.

The suite checks the server as well as the screen. A message that shows up in the UI may never have reached the server, and a message shown as sent offline must not exist there yet. Each test checks the UI and then confirms the result through the REST API.

## Stack

WebdriverIO 10 · Appium 3 (UiAutomator2) · Mocha · TypeScript · Faker · Allure · Docker · GitHub Actions

## What is covered

| Area      | Scenario                                                          | Backend check                |
| --------- | ----------------------------------------------------------------- | ---------------------------- |
| Auth      | Login with valid credentials `@smoke`                             | —                            |
| Auth      | Invalid password is rejected and the user stays on login          | —                            |
| Channels  | Search shows public channels and hides private groups of others   | —                            |
| Messages  | Sent message is displayed `@smoke`                                | Stored with the right author |
| Messages  | Message from another user appears in real time                    | Seeded through the API       |
| Messages  | Deleted message disappears                                        | Removed from the server      |
| Offline   | Message sent in airplane mode is flagged as not delivered         | Not stored on the server     |
| Test data | Seeding, cleanup, idempotent cleanup, sweeping (no device needed) | All of it                    |

**Out of scope (for now):** iOS, push notifications, file uploads, end-to-end encryption, video calls.

## Architecture

```
src/
├── api/        REST client + services (users, rooms, messages), bound to a user session
├── data/       factories (Faker), naming/prefix, DataTracker, sweeper, testData facade
├── screens/    screen objects: selectors + screen-level actions
├── flows/      business flows composed from screens (login, open room)
├── config/     environment and timeouts
└── utils/      selectors, device control (adb), polling helper, logger
test/
├── specs/      UI specs by feature (auth, channels, messages, offline)
└── data/       tests for the data layer itself
docker/         Rocket.Chat + MongoDB (replica set)
```

- **Specs** describe behaviour. **Flows** chain steps. **Screens** know selectors. Only screens touch selectors.
- **Selectors** use React Native `testID`s, which Android exposes as `resource-id`. Text is only used for system or alert buttons.

## Test data strategy

1. **Generated, never fixed.** Faker builds users, rooms and messages, so reruns never collide.
2. **Seeded through the API, not the UI.** Tests only use the UI for the behaviour under test. Setup is fast and stable.
3. **Tagged.** Every record is named `qa_<runId>_…`. The run id is created once by the launcher and shared by all workers.
4. **Tracked and cleaned after each test.** `DataTracker` records what each test creates. The `afterTest` hook deletes it, rooms before users. Cleanup is idempotent, so a record that is already gone is not an error.
5. **Swept at the end.** `onComplete` deletes anything left with the run prefix, for example after a crashed worker. `npm run data:sweep` cleans every run.

## Running locally

**Requirements:** Node 24 (`nvm use`), Docker, Android SDK with an emulator (API 34 recommended), Java 17+ (for the Allure report).

```bash
nvm use
npm install
cp .env.example .env

npm run server:up        # Rocket.Chat + MongoDB on http://localhost:3000
npm run test:data        # data layer tests, no device needed
npm run app:download     # pinned Rocket.Chat APK -> apps/rocketchat.apk
npm run appium:setup     # UiAutomator2 driver

# start an emulator, then:
npm test                 # full suite
npm run test:smoke       # @smoke only

npm run report:generate && npm run report:open
npm run server:down
```

> The server uses MongoDB 9.0 because 8.0 and 8.3 refuse to start on Linux kernel 6.19 or newer ([SERVER-121912](https://jira.mongodb.org/browse/SERVER-121912)), which current CI runners use.

> On Google APIs emulators, disable autofill so it does not cover the login form:
> `adb shell settings put secure autofill_service null`

## CI

`.github/workflows/e2e.yml` runs on every push and pull request:

1. **Quality:** lint, typecheck, format.
2. **E2E:** starts the server, runs the data layer tests, boots an Android 14 emulator and runs the suite.
3. **Report:** the Allure report is uploaded as an artifact and, on `main`, published to GitHub Pages.

## Conventions

- Code, test names, commits and docs are in English.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org) (`feat:`, `test:`, `fix:`, `ci:`, `docs:`, `chore:`), enforced by commitlint.
- The pre-commit hook runs lint, typecheck and format check.

## Author

**Lara Lopes**, QA Engineer · [LinkedIn](https://linkedin.com/in/laraalexandralopes) · [GitHub](https://github.com/LaraAlexLopes)
