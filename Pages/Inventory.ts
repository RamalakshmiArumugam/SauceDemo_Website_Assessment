//import playwright module

import { Page } from '@playwright/test'

export class Inventory {
    readonly page: Page

    readonly inventory_items
    readonly inventory_item_name
    readonly item_price
    readonly Sort_dropdown
    readonly addToCartButton
    constructor(page: Page)                              // constructor accept a "page" as a parameter
    {
        this.page = page //page variable 
        this.Sort_dropdown = page.locator(".product_sort_container")
        this.inventory_items = page.locator(".inventory_item")
        this.inventory_item_name = page.locator(".inventory_item_name")
        this.item_price = page.locator(".inventory_item_price")
        this.addToCartButton = page.locator(".btn.btn_primary.btn_small.btn_inventory")
    }
    async SortByPriceLowToHigh() {
        await this.Sort_dropdown.selectOption("lohi")
    }
    async getItemsCount() {
        console.log(`Product count in the inventory is: ` + await this.inventory_items.count())
    }
    async getProductName() {
        const productnames = await this.inventory_item_name.allTextContents()

        return productnames
    }
    async getProductPrice() {
        const prices = await this.item_price.allTextContents()
        const numericPrices = prices.map(price => parseFloat(price.replace('$', '')));
        return numericPrices

    }
    async SortByPriceHighToLow() {
        await this.Sort_dropdown.selectOption("hilo")
    }
    async addProductToCart(productName: string[]) {
        for (const name of productName) {
            const productCard = this.inventory_items.filter({ hasText: name })
            await productCard.getByRole('button', { name: 'Add to cart' }).click()
        }
    }

    async SortByName_ZtoA() {
        await this.Sort_dropdown.selectOption("za")
    }
    async SortByName_AtoZ() {
        await this.Sort_dropdown.selectOption("az")
    }

}
