# Playwright-Departmental

Playwright automation script for Departmental code base.

## Installation

### DDev
Copy the contents of usersecrets.env.sample to .ddev/.env and complete the 'valid user options' and 'valid test urls' sections.

### Non-DDev
Duplicate usersecrets.env.sample to usersecrets.env and complete the 'valid user options' and 'valid test urls' sections.

## Running tests

To run the entire test suite use:

`npx playwright test --grep '@regression'`

`npx playwright test --grep '@regression' --project chromium`

To run individual tests or a directory of tests use:

`npx playwright test --grep 'ART-Super-TC02' tests/Content/ArticleTests.spec.ts --project chromium`

`npx playwright test tests/Content/ApplicationTests.spec.ts`

For more examples look at the [Playwright running-tests page](https://playwright.dev/docs/running-tests).
