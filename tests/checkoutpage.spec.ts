import { test, expect } from '@playwright/test'
import { Cartpage } from '../Pages/Cartpage'
import testdata from '../test_data/login_credentials.json'
import { Loginpage } from '../Pages/Loginpage'
import productData from '../test_data/Product_data.json'
import { Inventory } from '../Pages/Inventory'
import { Checkout } from '../Pages/Checkout'
import CheckOutMissingUserInfo from '../test_data/checkoutFieldError_Validation.json'
let login: Loginpage
test.beforeEach(async ({ page }) => {
    login = new Loginpage(page)
    await login.NavigateToURL()
    const user = testdata[0].Valid_LoginData
    await login.validlogin(user.username, user.password)
    await expect(page).toHaveURL(user.inventory_url)
})


for (const [caseName, testCase] of Object.entries(CheckOutMissingUserInfo)) {
    test(`TC16 & TC_17 & TC_18_checkout shows an error when ${testCase.name} is missing (${caseName}) @errorcase`, async ({ page }) => {
        await test.step('Submit checkout with a missing field', async () => {

            const product = productData[0].Product_details
            const inventory = new Inventory(page)
            const cart = new Cartpage(page)
            const checkout = new Checkout(page)

            await inventory.addProductToCart([product.product_name1])
            await cart.clickOnCartLink()
            await cart.clickOnCheckoutButton()
            await checkout.firstname.fill(testCase.firstname)
            await checkout.lastname.fill(testCase.lastname)
            await checkout.postal.fill(testCase.postal)
            await checkout.Continue.click()
            await expect(page.locator('[data-test="error"]')).toHaveText(testCase.error)
        })
    })
}

test('TC19_cancel checkout and return to cart @cancelCheckout', async ({ page }) => {
    const product = productData[0].Product_details
    const inventory = new Inventory(page)
    const cart = new Cartpage(page)

    await inventory.addProductToCart([product.product_name1])
    await cart.clickOnCartLink()
    await cart.clickOnCheckoutButton()

    await page.getByRole('button', { name: 'Cancel' }).click()

    await expect(page).toHaveURL(/cart/)
    await expect(page.locator('.cart_item')).toHaveCount(1)
})




