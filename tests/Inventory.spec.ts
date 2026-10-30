import { test, expect } from '@playwright/test'
import { Inventory } from '../Pages/Inventory'
import testdata from '../test_data/login_credentials.json'
import { Loginpage } from '../Pages/Loginpage'
import { Cartpage } from '../Pages/Cartpage'

let login: Loginpage
let inventory, cart
test.beforeEach(async ({ page }) => {
    login = new Loginpage(page)
    await login.NavigateToURL()
    const user = testdata[0].Valid_LoginData
    await login.validlogin(user.username, user.password)
    await expect(page).toHaveURL(user.inventory_url)
}
)
test(`TC09_Sort by Price Low to High and Check the list `, async ({ page }) => {
    await test.step("Verifying Product list is sorted by Price High to Low", async () => {

        inventory = new Inventory(page)
        await inventory.SortByPriceLowToHigh()
        await inventory.getItemsCount()
        const names = await inventory.getProductName()

        const prices = await inventory.getProductPrice()
        expect(prices).toEqual([...prices].sort((a, b) => a - b))
        for (let index = 0; index < names.length; index++) {
            console.log(names[index], `$${prices[index]}`)
        }
    })
})

test(`TC10_Sort by Price High to Low and Check the list `, async ({ page }) => {
    await test.step("Verifying Product list is sorted by Price High to Low", async () => {
        inventory = new Inventory(page)
        await inventory.SortByPriceHighToLow()
        await inventory.getItemsCount()
        const names = await inventory.getProductName()

        const prices = await inventory.getProductPrice()
        expect(prices).toEqual([...prices].sort((a, b) => b - a))
        for (let index = 0; index < names.length; index++) {
            console.log(names[index], `$${prices[index]}`)
        }
    })
})
test('TC07_Sort by Product Name A to Z and Check the list @sortByName_A_To_Z', async ({ page }) => {
    await test.step("Verifying Product list is sorted by Name A to Z", async () => {
        inventory = new Inventory(page)
        await inventory.SortByName_ZtoA()
        const names = await inventory.getProductName()
        expect(names).toEqual([...names].sort())

    })
})
test('TC08_Sort by Product Name Z to A and Check the list @sortByName_Z_To_A', async ({ page }) => {
    await test.step("Verifying Product list is sorted by Name Z to A", async () => {
        inventory = new Inventory(page)
        await inventory.SortByName_ZtoA()
        const names = await inventory.getProductName()
        expect(names).toEqual([...names].sort().reverse())
    })

})
test('add all products to the cart from product page @allproductAddToCart', async ({ page }) => {
    inventory = new Inventory(page)
    cart = new Cartpage(page)
    const productNames = await inventory.getProductName()
    await inventory.addProductToCart(productNames)
    await cart.getCartBadgeCount()
    await expect(page.locator('.shopping_cart_badge'))
        .toHaveText(String(productNames.length))
})

