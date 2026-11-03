# Playwright-Departmental

Playwright automation script for Departmental code base.

## Installation

### DDev
Copy the contents of usersecrets.env.sample to .ddev/.env and complete the 'valid user options' and 'valid test urls' sections.

### Non-DDev
Duplicate usersecrets.env.sample to usersecrets.env and complete the 'valid user options' and 'valid test urls' sections.

## Running tests

To run the entire test suite use:

`npx playwright test`

To run individual tests or a directory of tests use:

`npx playwright test homepage.spec.ts`

`npx playwright test tests/content/ tests/ckeditor/`

For more examples look at the [Playwright running-tests page](https://playwright.dev/docs/running-tests).
