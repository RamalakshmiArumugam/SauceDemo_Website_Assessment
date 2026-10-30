import { Page } from "@playwright/test"

export class Loginpage {
    readonly page: Page
    readonly usernameTxt
    readonly passwordTxt
    readonly loginbutton
    readonly error_message
    readonly menuicon
    readonly logout_btn


    constructor(page: Page) {
        this.page = page
        //Locators
        this.usernameTxt = page.getByPlaceholder("Username")
        this.passwordTxt = page.getByPlaceholder("Password")
        this.loginbutton = page.getByRole('button', { name: "Login" })
        this.error_message = page.locator(".error-message-container.error")
        this.menuicon = page.getByRole("button", { name: "Open Menu" })
        this.logout_btn = page.getByRole("button", { name: "Logout" })
    }

    async NavigateToURL() {
        await this.page.goto('/')
    }
    async validlogin(username: string, password: string) {
        await this.usernameTxt.fill(username)
        await this.passwordTxt.fill(password)
        await this.loginbutton.click();
    }

    async Invalidlogin(username: string, password: string) {
        await this.usernameTxt.fill(username)
        await this.passwordTxt.fill(password)
        await this.loginbutton.click();
        await this.error_message.textContent()
    }
    async getErrorMessage() {
        const errorMessage = await this.error_message.textContent()
        console.log(`Error message displayed is: ${errorMessage}`)
        return errorMessage
    }
    async logout() {
        await this.menuicon.click()
        await this.logout_btn.click()
    }
}
