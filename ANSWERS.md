## B1. Review of AI-generated code

### Problems found

1. **Fixed sleep:** `waitForTimeout(3000)` waits 3 seconds every run, even if the page is ready. It slows the suite, and it can still fail if the page takes longer. Playwright waits automatically for actions and `expect`.
2. **Weak assertion:** `expect(total).toBeTruthy()` passes for any text, even a wrong total like "Total: $0.00". The test cannot fail for the thing it claims to check.
3. **Test name does not match the check:** The name says "cart total is correct", but the test never compares the total with the item total plus the tax.
4. **Ambiguous locator:** `text=Add to cart` matches 6 buttons. The test clicks the first one, and it is not clear which product is chosen. If the product order changes, the test changes.
5. **No check of the cart:** The test never checks the cart badge, the product in the cart or its price, so it does not know what it is totalling.
6. **No check on earlier steps:** If the login fails, the test continues and fails later at a confusing line.
7. **Hardcoded values:** The URL, username and password are written in the test. They should be in config or test data.
8. **No structure:** Locators and steps are inside the test (no Page Object), and the login steps would be copied into every test. Locators like `.shopping_cart_link` are tied to CSS classes.
9. **Old style API:** `page.click` and `page.fill` with string selectors are the less reliable style. Locators with roles or `data-test` attributes are more stable.
10. **Total is read as raw text:** `textContent()` returns the full text with the label and spaces, with no conversion to a number, so no maths is possible.
11. **Weak test data:** `A`, `B` and `1` are fine for this site, but the test does not say why they were chosen.

### Rewritten test

```ts
import { test, expect } from '@playwright/test'
import { config } from '../config'

const toNumber = (text: string) => parseFloat(text.replace(/[^\d.]/g, ''))

test('cart total equals item total plus tax', async ({ page }) => {
    // Login
    await page.goto('/')
    await page.getByPlaceholder('Username').fill(config.users.standard)
    await page.getByPlaceholder('Password').fill(config.password)
    await page.getByRole('button', { name: 'Login' }).click()
    await expect(page).toHaveURL(/inventory\.html/)

    // Add one known product and read its price
    const product = page.locator('.inventory_item', { hasText: 'Sauce Labs Backpack' })
    const price = toNumber(await product.locator('.inventory_item_price').innerText())
    await product.getByRole('button', { name: 'Add to cart' }).click()
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1')

    // Cart contains the chosen product
    await page.locator('.shopping_cart_link').click()
    await expect(page.locator('.cart_item')).toHaveCount(1)
    await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack')

    // Checkout information
    await page.getByRole('button', { name: 'Checkout' }).click()
    await page.getByPlaceholder('First Name').fill(config.checkout.firstName)
    await page.getByPlaceholder('Last Name').fill(config.checkout.lastName)
    await page.getByPlaceholder('Zip/Postal Code').fill(config.checkout.postalCode)
    await page.getByRole('button', { name: 'Continue' }).click()

    // Verify the totals
    const subtotal = toNumber(await page.locator('.summary_subtotal_label').innerText())
    const tax = toNumber(await page.locator('.summary_tax_label').innerText())
    const total = toNumber(await page.locator('.summary_total_label').innerText())

    expect(subtotal).toBeCloseTo(price, 2)
    expect(total).toBeCloseTo(subtotal + tax, 2)
})
 

**What changed:** 
No fixed wait. A named product is chosen. The cart is checked. The total is compared with item total plus tax. Config values are used. In the full suite, the locators and steps would move into Page Objects.

--------------------------------------------------------------------

 ## B2. Test an AI feature

**Scenario chosen:** Test case generator (user story to test cases in JSON, imported straight into the test management tool).


### Four checks for the evaluation set

| # | Check | How I build it into the evaluation set | Scoring |
|---|---|---|---|
| 1 | **JSON format is valid** | Run 50 user stories (short, long, vague, with special characters). Check that every output parses and matches the required schema: all fields present, correct types, allowed values such as priority P1 to P3. | **Automatic.** Schema validator, pass or fail. Target: 100% valid, because one broken file can fail the whole import. |
| 2 | **No invented requirements** | Use user stories with clear and limited rules. Compare each test case with the story and mark any case that tests a rule not in the story. | **Rubric** (0 = invented rule, 1 = traceable to the story), with a human checking a sample. A tool cannot judge this reliably. |
| 3 | **Coverage** | For each story, keep a checklist written by a tester: the positive, negative and boundary cases that must appear. Check how many the tool produced. | **Rubric.** Score = covered items divided by checklist items. Keyword matching can help, but a human confirms. |
| 4 | **No duplicate cases** | Check every output for cases with the same steps and expected result, or very similar titles. | **Automatic.** Exact-match check plus a similarity score. Cases above a set threshold go to **human review**. |

### Run rules

- Run each story 3 times to check that the output is consistent between runs.
- Keep the evaluation set in the repository and re-run it after every change to the prompt or model.
- Block the import if check 1 fails, so broken output never reaches the test management tool.

------------------------------------------------------------------
## B3. Defect report

**Title:** Products page: "Price (low to high)" sort shows $29.99 item before $15.99 item (regression in 4.2.0)

| Field | Details |
|---|---|
| **Type / Component** | Bug / Products page, sorting |
| **Environment** | Release 4.2.0, Chrome (version: add exact version), Windows, https://www.saucedemo.com (test environment) |
| **User** | standard_user |
| **Reproducibility** | 100%. Happens on every run since 4.2.0. |
| **Severity** | **Major (S2)** |
| **Priority suggested** | High, fix before release |

**Steps to reproduce**
1. Open the login page and log in as `standard_user` / `secret_sauce`.
2. On the products page, open the sort dropdown.
3. Select "Price (low to high)".
4. Read the prices from the top of the list down.

**Expected result:** All prices are in ascending order, from the lowest price to the highest.

**Actual result:** An item priced $29.99 is shown before an item priced $15.99. The list is not in ascending order.

**Severity reason:** Price sorting is a stated business rule and a core shopping feature, and every customer who uses it sees wrong results. It does not block checkout, no data is lost, and the customer can still find items by scrolling. So it is Major, not Critical.

**Notes:**
- It started in 4.2.0, so it is likely a regression. Please compare with the previous release.
- The automated test TC09 checks the whole list, which is how this was found. A test that checks only the first item would miss it.

**Evidence to attach**
- Screenshot of the products page after selecting "Price (low to high)", with the two prices marked.
- Short screen recording of steps 1 to 4.
- Automated test report and failure screenshot (TC09 and TC10).
- Browser console and network log (HAR file) from the sort action.
- Actual list of prices in the order shown (copied as text).

-----------------------------------------------------------

## B4. Message to the client

**Subject:** Friday release: two issues found in testing

Hi [Name],

Quick update on tomorrow's release. Two things from today's testing:

1. **Sorting is wrong.** "Price (low to high)" shows a $29.99 item before a $15.99 item. Customers will notice, and it is new in 4.2.0.
2. **Checkout failed in about 1 of 10 test runs**, then passed on re-run. I don't yet know whether this is a real problem or a test issue.

**My recommendation:** hold the release until the sorting fix is tested. If the team can fix it today, I can retest this evening, so Friday may still work.

If not, a practical option is to release Monday, or release Friday with the price sort option hidden and checkout watched closely.

 

Thanks,
Ramalakshmi.A
