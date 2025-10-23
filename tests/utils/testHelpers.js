// @ts-check
const { expect } = require('@playwright/test');

/**
 * Sets up ad blocking for a page to prevent popups and ads from interfering with tests
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @returns {Promise<void>}
 */
async function setupAdBlocking(page) {
  // Block known ad and popup domains
  await page.route('**/*', route => {
    const url = route.request().url();
    const blockedDomains = [
      'googlesyndication.com',
      'googletagmanager.com',
      'google-analytics.com',
      'googleadservices.com',
      'doubleclick.net',
      'adsystem.com',
      'ads.yahoo.com',
      'facebook.com/tr',
      'connect.facebook.net',
      'outbrain.com',
      'taboola.com',
      'amazon-adsystem.com',
      'media.net',
      'criteo.com',
      'adsafeprotected.com',
      'scorecardresearch.com',
      'comscore.com',
      'quantserve.com',
      'rlcdn.com',
      'rubiconproject.com',
      'pubmatic.com',
      'openx.com',
      'contextweb.com',
      'advertising.com',
      'adsnx.com',
      'exponential.com',
      'smartadserver.com',
      'yieldmo.com',
      'sharethrough.com',
      'sonobi.com',
      'spotxchange.com',
      'springserve.com',
      'telaria.com',
      'undertone.com'
    ];
    
    const shouldBlock = blockedDomains.some(domain => url.includes(domain));
    
    if (shouldBlock) {
      route.abort();
    } else {
      route.continue();
    }
  });

  // Block requests by resource type that are commonly used for ads
  await page.route('**/*', route => {
    const request = route.request();
    const resourceType = request.resourceType();
    
    // Block certain resource types that are typically ads or tracking
    if (resourceType === 'image' && request.url().includes('ads')) {
      route.abort();
    } else if (resourceType === 'script' && 
               (request.url().includes('analytics') || 
                request.url().includes('tracking') ||
                request.url().includes('ads'))) {
      route.abort();
    } else {
      route.continue();
    }
  });
}

/**
 * Waits for the page to become stable (no network activity for specified time)
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @param {number} timeout - Maximum time to wait in milliseconds (default: 5000)
 * @param {number} idleTime - Time to wait for network idle in milliseconds (default: 1000)
 * @returns {Promise<void>}
 */
async function waitForStablePage(page, timeout = 5000, idleTime = 1000) {
  try {
    await page.waitForLoadState('networkidle', { timeout: timeout });
  } catch (error) {
    console.log(`Page didn't reach network idle state within ${timeout}ms, continuing...`);
  }
  
  // Additional wait to ensure page is truly stable
  await page.waitForTimeout(idleTime);
}

/**
 * Handles common popups and modals that might interfere with tests
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @returns {Promise<void>}
 */
async function handlePopups(page) {
  // Setup popup handlers
  page.on('dialog', async dialog => {
    console.log(`Automatically dismissing dialog: ${dialog.message()}`);
    await dialog.dismiss();
  });

  // Common popup selectors to close
  const popupSelectors = [
    '[data-testid="close-button"]',
    '[data-testid="modal-close"]',
    '.modal-close',
    '.popup-close',
    '.close-btn',
    '[aria-label="Close"]',
    '[aria-label="close"]',
    'button[title="Close"]',
    '.cookie-banner button',
    '#cookie-accept',
    '.gdpr-accept',
    '.newsletter-popup .close'
  ];

  // Try to close any visible popups
  for (const selector of popupSelectors) {
    try {
      const element = page.locator(selector);
      if (await element.isVisible({ timeout: 1000 })) {
        await element.click({ timeout: 2000 });
        console.log(`Closed popup with selector: ${selector}`);
        await page.waitForTimeout(500); // Brief wait after closing
      }
    } catch (error) {
      // Ignore errors - popup might not exist or already be closed
    }
  }
}

/**
 * Complete page setup with ad blocking, popup handling, and stability waiting
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @param {string} url - URL to navigate to
 * @param {Object} [options] - Configuration options
 * @param {number} [options.timeout] - Maximum time to wait for page load
 * @param {boolean} [options.handlePopups] - Whether to handle popups automatically
 * @returns {Promise<void>}
 */
async function setupPage(page, url, options = {}) {
  const { timeout = 10000, handlePopups: shouldHandlePopups = true } = options;

  // Setup ad blocking before navigation
  await setupAdBlocking(page);
  
  // Navigate to the page
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout });
  
  // Wait for page to stabilize
  await waitForStablePage(page);
  
  // Handle popups if requested
  if (shouldHandlePopups) {
    await handlePopups(page);
  }
  
  // Final stability wait
  await page.waitForTimeout(1000);
}

module.exports = {
  setupAdBlocking,
  waitForStablePage,
  handlePopups,
  setupPage
};