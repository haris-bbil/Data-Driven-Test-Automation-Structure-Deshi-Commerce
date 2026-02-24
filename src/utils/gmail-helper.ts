import { Page, expect } from "@playwright/test";

export class GmailHelper {
  static async getLatestOtp(page: Page, email?: string, password?: string): Promise<string> {
    await page.goto("https://mail.google.com");

    if (email && password) {
        const isSignInPage = await page.getByRole('heading', { name: 'Sign in' }).isVisible().catch(() => false) || 
                             await page.getByRole('button', { name: 'Next' }).isVisible().catch(() => false);

        if (isSignInPage) {
            console.log("Logging into Gmail...");
            await page.getByRole('textbox', { name: 'Email or phone' }).fill(email);
            await page.getByRole('button', { name: 'Next' }).click();
            
            await page.waitForTimeout(2000);
            
            await page.getByRole('textbox', { name: 'Enter your password' }).fill(password);
            await page.getByRole('button', { name: 'Next' }).click();
            
            
            await page.waitForTimeout(5000);
        }
    }

    try {
        console.log("Waiting for inbox...");
        await page.waitForSelector('div[role="main"]', { timeout: 60000 });

       
        const primaryTab = page.getByRole('tab', { name: 'Primary' });
        if (await primaryTab.isVisible()) {
            console.log("Switching to Primary tab...");
            await primaryTab.click();
            await page.waitForTimeout(2000);
        }
        
        let retries = 0;
        const maxRetries = 20;
        
        while (retries < maxRetries) {
            console.log(`Checking for email (Attempt ${retries + 1}/${maxRetries})...`);
            
            
            const unreadRows = page.locator('tbody > tr.zE');
            const count = await unreadRows.count();
            
            if (count > 0) {
                const firstRow = unreadRows.first();
                const rowText = await firstRow.innerText();
                
                
                const matchesRelative = rowText.match(/(\d+)\s+minutes?\s+ago/i); 
                const matchesJustNow = rowText.toLowerCase().includes('just now'); 
                const matchesTime = rowText.match(/(\d{1,2}):(\d{2})\s?([AP]M)/i); 

                let isFresh = false;

                if (matchesRelative) {
                    const mins = parseInt(matchesRelative[1]);
                    console.log(`Email is from ${mins} minutes ago.`);
                    if (mins <= 2) isFresh = true;
                } else if (matchesJustNow) {
                     console.log("Email is from just now.");
                     isFresh = true;
                } else if (matchesTime) {
                    const emailTimeStr = matchesTime[0];
                    console.log(`Top email timestamp: ${emailTimeStr}`);
                    
                    const now = new Date();
                    const currentHours = now.getHours(); 
                    const currentMinutes = now.getMinutes();
                    
                    const [timePart, period] = emailTimeStr.split(/\s+/);
                    let [hours, minutes] = timePart.split(':').map(Number);
                    
                    if (period && period.toLowerCase() === 'pm' && hours < 12) hours += 12;
                    if (period && period.toLowerCase() === 'am' && hours === 12) hours = 0;
                    
                    const emailTotalMinutes = hours * 60 + minutes;
                    const currentTotalMinutes = currentHours * 60 + currentMinutes;
                    
                    const diff = currentTotalMinutes - emailTotalMinutes;
                    console.log(`Time diff: ${diff} minutes`);
                    
                    if (diff >= -1 && diff <= 3) {
                         isFresh = true;
                    }
                }

                if (isFresh) {
                     console.log("Email is verified as fresh. Opening...");
                     await firstRow.click();
                     
                     await page.waitForTimeout(2000);
                     const bodyLocator = page.locator('div[role="main"]');
                     const text = await bodyLocator.innerText();
                     
                     const otpMatch = text.match(/\b\d{6}\b/);
                     if (otpMatch) {
                         console.log(`Found OTP: ${otpMatch[0]}`);
                         return otpMatch[0];
                     } else {
                         console.log("OTP pattern not found in fresh email body.");
                         // Go back to keep checking
                         await page.goBack();
                         await page.waitForTimeout(2000);
                     }
                } else {
                    console.log("Top email is not fresh (too old). Waiting for new one...");
                }
            } else {
                console.log("No unread emails found.");
            }
            
            console.log("Refreshing inbox...");
            await page.getByRole('button', { name: /Inbox/ }).click(); 
            await page.waitForTimeout(1000);
            
             
             const primaryTab = page.getByRole('tab', { name: 'Primary' });
            if (await primaryTab.isVisible()) {
                await primaryTab.click();
            }
            
            await page.waitForTimeout(4000);
            retries++;
        }
        
        throw new Error("OTP email not found after retries");

    } catch (e) {
        console.error("Failed to retrieve OTP from Gmail", e);
        await page.screenshot({ path: 'gmail-failure.png' });
        throw e;
    }
  }
}
