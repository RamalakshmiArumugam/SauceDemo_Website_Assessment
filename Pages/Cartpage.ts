import { Page } from '@playwright/test'

export class Cartpage {
    readonly page: Page
    readonly cart_link
    readonly cart_tite
    readonly continue_Shopping_button
    readonly checkout_button
    readonly inventory_item_name
    readonly item_price
    readonly item_description
    readonly remove_buttonInCartPage

    constructor(page: Page) {
        this.page = page

        this.cart_link = page.locator(".shopping_cart_link")
        this.cart_tite = page.getByText("Your Cart")
        this.continue_Shopping_button = page.getByRole('button', { name: 'Continue Shopping' })
        this.checkout_button = page.getByRole('button', { name: 'Checkout' })
        this.inventory_item_name = page.locator(".inventory_item_name")
        this.item_price = page.locator(".inventory_item_price")
        this.item_description = page.locator(".inventory_item_desc")
        this.remove_buttonInCartPage = page.getByRole('button', { name: 'Remove' })

    }

    async clickOnCartLink() {
        await this.cart_link.click()
    }
    async getCartPageTitle() {
        const title = await this.cart_tite.textContent()
        return title
    }
    async clickOnContinueShoppingButton() {
        await this.continue_Shopping_button.click()
    }
    async clickOnCheckoutButton() {
        await this.checkout_button.click()
    }
    async getProductNameInCartPage() {
        const productnames = await this.inventory_item_name.allTextContents()
        return productnames
    }
    async getProductPriceInCartPage() {
        const prices = await this.item_price.allTextContents()
        return prices
    }
    async getProductDescriptionInCartPage() {
        const description = await this.item_description.allTextContents()
        return description
    }
    async clickOnRemoveButtonInCartPage() {
        await this.remove_buttonInCartPage.click()
    }
    async getCartBadgeCount() {
        const cartBadge = this.page.locator('.shopping_cart_badge')
        return await cartBadge.textContent()
        // return count
        // console.log(`Cart badge count is: ${count}`)
    }
    async isCartBadgeVisible() {
        const cartBadge = this.page.locator('.shopping_cart_badge')
        return await cartBadge.isVisible()
    }
    async countItemsInCart() {
        const items = await this.inventory_item_name.count()
        return items
    }
    async removeItemFromCart(itemName: string) {
        const itemLocator = this.page.locator('.cart_item').filter({ hasText: itemName })
        const removeButton = itemLocator.getByRole('button', { name: 'Remove' })
        await removeButton.click()
    }

}