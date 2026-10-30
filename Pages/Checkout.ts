import { Page } from '@playwright/test'
export class Checkout {
    readonly page: Page
    readonly firstname
    readonly lastname
    readonly postal
    readonly Continue
    readonly Cancel
    readonly Finish_button
    readonly backtohome

    constructor(page: Page) {
        this.page = page
        this.firstname = page.getByPlaceholder("First Name")
        this.lastname = page.getByPlaceholder("Last Name")
        this.postal = page.getByPlaceholder("Zip/Postal Code")
        this.Continue = page.getByRole("button", { name: "Continue" })
        this.Cancel = page.getByRole("button", { name: "Cancel" })
        this.Finish_button = page.getByRole("button", { name: "Finish" })
        this.backtohome = page.getByRole("button", { name: "Back Home" })
    }
    async checkoutInformation(firstname: string, lastname: string, postal: string) {
        await this.firstname.fill(firstname)
        await this.lastname.fill(lastname)
        await this.postal.fill(postal)
        await this.page.waitForLoadState('load');
        await this.Continue.click()
    }

    async cancelCheckout() {
        await this.Cancel.click()
    }

    async payment() {

        await this.Finish_button.click()
        await this.page.getByText('Thank you for your order!').isVisible()
        await this.backtohome.click()
        await this.page.waitForLoadState('load')
    }


}
