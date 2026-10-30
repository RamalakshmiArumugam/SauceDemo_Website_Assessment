import { test, expect } from '@playwright/test'
import { Cartpage } from '../Pages/Cartpage'
import testdata from '../test_data/login_credentials.json'
import { Loginpage } from '../Pages/Loginpage'
import productData from '../test_data/Product_data.json'
import { Inventory } from '../Pages/Inventory'
import { Checkout } from '../Pages/Checkout'
import checkoutData from '../test_data/checkout_userInformation.json'

let login: Loginpage
let cart
let inventory
let checkout
test.beforeEach(async ({ page }) => {
    login = new Loginpage(page)
    await login.NavigateToURL()
    const user = testdata[0].Valid_LoginData
    await login.validlogin(user.username, user.password)
    await expect(page).toHaveURL(user.inventory_url)
})

test('TC11_Add two products in the cart and verify cart badge @add2', async ({ page }) => {

    inventory = new Inventory(page)
    cart = new Cartpage(page)

    const product = productData[0].Product_details
    await inventory.addProductToCart([product.product_name1, product.product_name2])
    await cart.getCartBadgeCount()
})
test('Verify the product details in the cart page @verifyProductDetails', async ({ page }) => {
    cart = new Cartpage(page)
    inventory = new Inventory(page)

    const product = productData[0].Product_details
    await inventory.addProductToCart([product.product_name1, product.product_name2])
    await cart.clickOnCartLink()
    const title = await cart.getCartPageTitle()
    expect(title).toBe('Your Cart')
    const productNames = await cart.getProductNameInCartPage()
    expect(productNames[0]).toBe(product.product_name1)
    console.log(`Product name in the cart page is: ${productNames[0]}`)
    expect(productNames[1]).toBe(product.product_name2)
    console.log(`Product name in the cart page is: ${productNames[1]}`)
    const productPrices = await cart.getProductPriceInCartPage()
    expect(productPrices[0]).toBe(product.productname1_price)
    expect(productPrices[1]).toBe(product.productname2_price)
})

test('TC12_remove one item from cart page and verify the cart badge count @removeItem', async ({ page }) => {
    const product = productData[0].Product_details
    cart = new Cartpage(page)
    inventory = new Inventory(page)
    await inventory.addProductToCart([product.product_name1, product.product_name2])
    await cart.clickOnCartLink()
    await cart.removeItemFromCart(product.product_name1)
    const cartBadgeCount = await cart.getCartBadgeCount()
    console.log(`Cart badge count after removing one item is: ${cartBadgeCount}`)
})

test('TC15_complete checkout and verify totals and empty cart `$chekoutUserData.firstname` @checkout', async ({ page }) => {
    inventory = new Inventory(page)
    cart = new Cartpage(page)
    checkout = new Checkout(page)
    const product = productData[0].Product_details
    await inventory.addProductToCart([product.product_name1, product.product_name2])
    await cart.clickOnCartLink()
    await cart.clickOnCheckoutButton()
    for (const checkoutRecord of checkoutData) {
        const checkoutUserData = checkoutRecord.Checkout_UserInfo
        await checkout.checkoutInformation(
            checkoutUserData.firstname,
            checkoutUserData.lastname,
            String(checkoutUserData.postal_code))

        await cart.getProductNameInCartPage()
        await cart.getProductDescriptionInCartPage()
        const itemPrices = await cart.getProductPriceInCartPage()
        const itemTotalInCents = itemPrices.reduce(
            (sum, price) => sum + Math.round(Number(price.replace(/[^\d.]/g, '')) * 100),
            0
        )
        const readAmountInCents = async (selector: string) => {
            const text = await page.locator(selector).innerText()
            return Math.round(Number(text.replace(/[^\d.]/g, '')) * 100)
        }
        const subtotalInCents = await readAmountInCents('.summary_subtotal_label')
        const taxInCents = await readAmountInCents('.summary_tax_label')
        const totalInCents = await readAmountInCents('.summary_total_label')

        expect(subtotalInCents).toBe(itemTotalInCents)
        expect(totalInCents).toBe(subtotalInCents + taxInCents)

        await checkout.payment()
        await cart.clickOnCartLink()

        await expect(page.locator('.cart_item')).toHaveCount(0)
        await expect(page.locator('.shopping_cart_badge')).toHaveCount(0)
    }
    test('continue shopping returns to products and keeps cart items @continueShopping', async ({ page }) => {
        const product = productData[0].Product_details
        const cart = new Cartpage(page)
        const inventory = new Inventory(page)

        await inventory.addProductToCart([
            product.product_name1,
            product.product_name2
        ])
        await cart.clickOnCartLink()

        await cart.clickOnContinueShoppingButton()

        await inventory.addProductToCart([
            product.product_name1,
            product.product_name2
        ])

        await expect(page).toHaveURL(/inventory/)
        await expect(page.locator('.inventory_list')).toBeVisible()
        await cart.getCartBadgeCount()
    })
})
