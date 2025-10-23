// @ts-check
const { test, expect } = require('@playwright/test');
const { setupPage } = require('./utils/testHelpers');

test.describe('BMI Calculator - Basic Setup Verification', () => {
  
  test('should load BMI calculator page and verify basic elements', async ({ page }) => {
    // Setup page with ad blocking and popup handling
    await setupPage(page, '/bmi');
    
    // Verify page title
    await expect(page).toHaveTitle(/BMI Calculator/i);
    
    // Verify main heading is visible
    const heading = page.locator('h1, h2, h3').filter({ hasText: /BMI|Body Mass Index/i }).first();
    await expect(heading).toBeVisible();
    
    // Verify essential form elements exist
    const heightInput = page.locator('input[name*="height" i], input[id*="height" i], input[placeholder*="height" i]').first();
    const weightInput = page.locator('input[name*="weight" i], input[id*="weight" i], input[placeholder*="weight" i]').first();
    
    await expect(heightInput).toBeVisible();
    await expect(weightInput).toBeVisible();
    
    // Look for calculate button
    const calculateButton = page.locator('button, input[type="submit"]').filter({ 
      hasText: /calculate|compute|submit/i 
    }).first();
    await expect(calculateButton).toBeVisible();
    
    // Verify page is interactive
    await heightInput.click();
    await weightInput.click();
    
    console.log('✅ BMI Calculator page loaded successfully with all basic elements');
  });

  test('should handle page with ad blocking enabled', async ({ page }) => {
    // This test verifies that our ad blocking setup works
    let blockedRequests = 0;
    
    // Count blocked requests
    page.on('requestfailed', request => {
      if (request.failure()?.errorText === 'net::ERR_FAILED') {
        blockedRequests++;
      }
    });
    
    await setupPage(page, '/bmi', { handlePopups: true });
    
    // Wait a bit to let any ads/tracking attempt to load
    await page.waitForTimeout(2000);
    
    console.log(`🛡️  Blocked ${blockedRequests} potentially unwanted requests`);
    
    // Verify the page still loads properly despite blocking
    await expect(page.locator('body')).toBeVisible();
    
    // Take a screenshot for verification
    await page.screenshot({ 
      path: 'test-results/bmi-calculator-with-adblock.png',
      fullPage: true 
    });
  });

});