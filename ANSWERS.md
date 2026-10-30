import { test, expect } from '@playwright/test'

 const toNumber = (text: string) => parseFloat(text.replace(/[^\d.]/g, ''))


test('checkout total equals subtotal plus tax', async ({ page }) => {
    // Login
    await page.goto('/')
    await page.getByPlaceholder('Username').fill('standard_user')
    await page.getByPlaceholder('Password').fill('secret_sauce')
    await page.getByRole('button', { name: 'Login' }).click()

    // Add first product
    const item = page.locator('.inventory_item').first()
    const price = await item.locator('.inventory_item_price').innerText()
    await item.getByRole('button', { name: 'Add to cart' }).click()

    // Checkout
    await page.locator('.shopping_cart_link').click()
    await page.getByRole('button', { name: 'Checkout' }).click()
    await page.getByPlaceholder('First Name').fill('Test')
    await page.getByPlaceholder('Last Name').fill('User')
    await page.getByPlaceholder('Zip/Postal Code').fill('12345')
    await page.getByRole('button', { name: 'Continue' }).click()

    // Verify
    const subtotal = toCents(await page.locator('.summary_subtotal_label').innerText())
    const tax = toCents(await page.locator('.summary_tax_label').innerText())
    const total = toCents(await page.locator('.summary_total_label').innerText())

    expect(subtotal).toBe(toCents(price))
    expect(total).toBe(subtotal + tax)
})