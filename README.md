# BMI Calculator – Automation Assignment

This repository contains the specification and user stories for a demo BMI Calculator web app used in QA automation interviews.

## Objective
Implement automated tests verifying that the application behaves according to the stories in [`user-stories.md`](./user-stories.md).

Target app: [https://practice.expandtesting.com/bmi](https://practice.expandtesting.com/bmi)

Use any test framework you want.

Focus on correctness, code structure, and clarity.

### Deliverables
1. Test code and helper modules.
2. `README.md` in your fork explaining setup and how to run tests.
3. HTML test report and at least one failure screenshot.

---

## Playwright + JavaScript Setup

This branch provides a ready-to-use Playwright setup with JavaScript for testing the BMI Calculator application.

### Features
- ✅ **Multi-browser testing**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- ✅ **Ad blocking utilities**: Prevents popups and ads from interfering with tests
- ✅ **Comprehensive reporting**: HTML reports, JUnit XML, and screenshots on failure
- ✅ **JavaScript with JSDoc**: Full IntelliSense support without TypeScript complexity
- ✅ **CI/CD ready**: Configured for continuous integration environments
- ✅ **Best practices**: Page stability detection, popup handling, parallel execution

### Prerequisites
- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/zuzupd/test-assignment.git
   cd test-assignment
   git checkout playwrigth+js
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install browsers**
   ```bash
   npm run install:browsers
   ```

4. **Run tests**
   ```bash
   # Run all tests
   npm test
   
   # Run tests with browser UI visible
   npm run test:headed
   
   # Debug tests interactively
   npm run test:debug
   
   # Open test UI for interactive test development
   npm run test:ui
   ```

5. **View test report**
   ```bash
   npm run test:report
   ```

### Project Structure

```
├── tests/
│   ├── utils/
│   │   └── testHelpers.js      # Ad blocking and page stability utilities
│   └── example.spec.js         # Example test demonstrating setup
├── playwright.config.js        # Playwright configuration
├── package.json                # Dependencies and scripts
└── .gitignore                  # Excludes node_modules and generated files
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests in headless mode |
| `npm run test:headed` | Run tests with browser UI visible |
| `npm run test:debug` | Run tests in debug mode with Playwright Inspector |
| `npm run test:ui` | Open Playwright UI for interactive test development |
| `npm run test:report` | Open HTML test report |
| `npm run install:browsers` | Install Playwright browsers |

### Test Configuration

The setup includes:
- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Reporters**: HTML, JUnit XML, and console output
- **Screenshots**: Captured on test failures
- **Videos**: Recorded for failed tests
- **Traces**: Collected on retry for debugging
- **Ad Blocking**: Automatic blocking of ads and tracking scripts
- **Popup Handling**: Automatic dismissal of common popups and modals

### Writing Tests

Tests are written in JavaScript with JSDoc comments for full IntelliSense support:

```javascript
// @ts-check
const { test, expect } = require('@playwright/test');
const { setupPage } = require('./utils/testHelpers');

test('should calculate BMI correctly', async ({ page }) => {
  // Setup page with ad blocking and popup handling
  await setupPage(page, '/bmi');
  
  // Your test code here
  await expect(page).toHaveTitle(/BMI Calculator/i);
});
```

### Utilities

The `testHelpers.js` module provides:
- `setupPage(page, url, options)` - Complete page setup with ad blocking
- `setupAdBlocking(page)` - Block ads and tracking scripts
- `handlePopups(page)` - Dismiss common popups and modals
- `waitForStablePage(page)` - Wait for network idle and page stability

### Continuous Integration

The configuration is optimized for CI environments:
- Automatic retries on CI
- Parallel execution control
- JUnit XML reports for integration with CI systems
- Video and screenshot artifacts for debugging failures

### Getting Help

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [JavaScript Test Examples](https://playwright.dev/docs/writing-tests)
- [Configuration Reference](https://playwright.dev/docs/test-configuration)
