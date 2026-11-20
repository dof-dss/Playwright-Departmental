# Playwright-Departmental

Playwright automation script for Departmental code base.

## Installation

### DDev
Copy the contents of usersecrets.env.sample to .ddev/.env and complete the 'valid user options' and 'valid test urls' sections.

### Non-DDev
Duplicate usersecrets.env.sample to usersecrets.env and complete the 'valid user options' and 'valid test urls' sections.

## Running tests

To run the entire test suite use:
(Note For Mac users do not use ' ' in command)

`npx playwright test --grep '@regression'` - Windows
`npx playwright test --grep @regression` - Mac

`npx playwright test --grep '@regression' --project chromium` - Windows
`npx playwright test --grep @regression --project chromium` - Mac 

`npx playwright test --workers 4 --grep '@regression' --project chromium` - Windows
`npx playwright test --workers 4 --grep @regression --project chromium` - Mac 


To run individual tests or a directory of tests use:
(Note For Mac users do not use ' ' in command)

`npx playwright test --grep 'ART-Super-TC02' tests/Content/ArticleTests.spec.ts --project chromium` - Windows
`npx playwright test --grep ART-Super-TC02 tests/Content/ArticleTests.spec.ts --project chromium` - Mac


`npx playwright test tests/Content/ApplicationTests.spec.ts`

For more examples look at the [Playwright running-tests page](https://playwright.dev/docs/running-tests).
