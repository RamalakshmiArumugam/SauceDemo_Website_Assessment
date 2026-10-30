# SauceDemo Test Suite

Manual and automated tests for the "Shop and check out" use case on https://www.saucedemo.com.
Tools: Playwright with TypeScript.

## Setup

1. Install Node.js (version 18 or newer).
2. Clone the repository and open the folder.
3. Install packages and browsers:

```bash
npm install
npx playwright install
```

4. ## Configuration URL
 The base URL can be changed without editing code:

export default defineConfig({
  use: {
    baseURL: 'https://www.saucedemo.com'
   },
})

## Test data
test data are kept outside the tests.
- The `testdata/` folder holds the test data as JSON files:

1.  login_credentials.json
 Users and password (standard, locked-out) 
 Login tests (TC01 to TC04) and the login step in other tests 

2. `checkout_userInformation.json` 
First name, last name, postal code for a valid checkout 
 Checkout tests (TC15, TC19) 

3.  `checkoutFieldError_Validation.json`
  Inputs with one field missing and the expected error message 
 Parameterized missing-field test (TC16 to TC18) 

4. `Product_data.json` 
 Product names and prices 
  Cart and sorting tests (TC07 to TC13) 


## Run the tests

```bash
npx playwright test                 # run all tests
npx playwright test --project=chromium   # run in Chrome only
npx playwright show-report          # open the HTML report
```

Failed tests save a screenshot in `test-results/`. The HTML report is in `playwright-report/`.

## Manual case to automated test mapping

The manual cases are in `manual-tests/A1_Manual_Test_Cases.docx`.

| Manual case | Automated test | File |
|---|---|---|
| TC01 | TC01 standard user logs in | tests/LoginPage.spec.ts |
| TC02 | TC02 locked-out user is rejected | tests/LoginPage.spec.ts |
  TC07 | TC07 sorts by name A to Z | tests/Inventory.spec.ts |
| TC08 | TC08 sorts by name Z to A | tests/Inventory.spec.ts |
| TC09 | TC09 sorts by price low to high | tests/Inventory.spec.ts |
| TC10 | TC10 sorts by price high to low | tests/Inventory.spec.ts |
| TC11 | TC11 add two items, badge and cart contents | tests/CartPage.spec.ts |
| TC12 | TC12 remove one item from cart | tests/CartPage.spec.ts |
 | TC14 | manual only | – |
| TC15 | TC15 full checkout, total equals item total plus tax | tests/CartPage.spec.ts |
| TC16 | TC16 missing first name | tests/checkoutpage.spec.ts |
| TC17 | TC17 missing last name | tests/checkoutpage.spec.ts |
| TC18 | TC18 missing postal code | tests/checkoutpage.spec.ts |
| TC19 | TC19 cancel does not place order | tests/checkoutpage.spec.ts |
| TC20 | manual only | – |
| TC21 | TC21 products page by URL after logout | tests/LoginPage.spec.ts |
| TC22 | Manual only
| TC23 | manual only | – |
| TC24 | manual only | – |
| TC25 | TC25 core flow on browsers (Playwright projects) | tests/LoginPage.spec.ts |

## How the suite would grow to 200 tests

To grow to 200 tests, I would keep the Page Object structure so a UI change is fixed in one place, not in every test. Login would move to an API call or a saved login state, so tests do not repeat the login steps. Tests would be tagged (@smoke, @regression) so the smoke set runs on every commit and the full set runs nightly. Playwright would run in parallel with sharding across CI machines to keep the run time short. Test data would sit in separate data files, and checks such as sorting and tax would move to the API or unit layer where the client has one. Flaky tests would be tracked and fixed or quarantined quickly, and the report would be published from CI on every run.