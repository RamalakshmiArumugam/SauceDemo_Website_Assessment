import { test, expect } from '@playwright/test'
import { Loginpage } from '../Pages/Loginpage'
import testdata from '../test_data/login_credentials.json'
test.describe('Login usecases', async () => {
    test('submit empty credentials @emptyLogin', async ({ page }) => {
        await login.loginbutton.click()
        const errorMessage = await login.getErrorMessage()
        console.log(`Error message displayed is: ${errorMessage}`)
    })
    let login: Loginpage
    let invaliduser = testdata[0].Invalid_LoginData
    let validuser = testdata[0].Valid_LoginData

    test.beforeEach(async ({ page }) => {
        login = new Loginpage(page)
        await login.NavigateToURL()
    })
    test(`TC01_Standard user logs in with valid credentials: ${validuser.title}`, async ({ page }) => {
        await login.validlogin(validuser.username, validuser.password)
        await expect(page).toHaveURL(/inventory/)
        await expect(page.locator('.inventory_list')).toBeVisible()
    })

    test(`TC02_Locked-out user is rejected ${invaliduser.title}`, async ({ page }) => {
        await login.Invalidlogin(invaliduser.username, invaliduser.password)
        const errorMessage = await login.getErrorMessage()
        console.log(`Error message displayed is: ${errorMessage}`)
    })

    test('TC21_redirects to login when opening the products URL after logout @logout', async ({ page }) => {
        const loginPage = new Loginpage(page)
        await login.validlogin(validuser.username, validuser.password)
        await expect(page).toHaveURL(/inventory/)
        await login.logout()
        await page.goto(validuser.inventory_url)
        await expect(page).toHaveURL('/')
        await expect(loginPage.usernameTxt).toBeVisible()
        await login.getErrorMessage()
        await expect(page).not.toHaveURL(validuser.inventory_url)
    })
    test('TC25_login via mobile screen view @loginMobileView', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 })

        await login.validlogin(validuser.username, validuser.password)

        await expect(page).toHaveURL(/inventory/)
        await expect(page.locator('.inventory_list')).toBeVisible()
    })



})
