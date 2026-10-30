A1 Strategy:
git add .
UI layer (automate): Core flows run on every build: login (TC01–TC04), sorting (TC07–TC10), cart (TC11–TC13), checkout and total check (TC15), missing-field errors (TC16–TC18), cancel (TC19), logout URL access (TC21), password masking (TC22), browser projects (TC25).

API or unit layer (if the client has one): Sort logic, tax and total calculation, field validation, and protected-page session checks. These are faster and less flaky than UI tests.

Manual: Usability (TC23), keyboard accessibility (TC24), long or special inputs (TC05, TC06, TC20), empty-cart checkout (TC14), and exploratory testing of problem_user.

Biggest remaining risk: Unconfirmed rules (empty-cart checkout, spaces-only fields) and the seeded problem accounts. Real customers may hit these paths, and the automation does not cover them.