# Mobile automation

Native Android and iOS automation using WebdriverIO, Appium, Mocha and BrowserStack real devices.

The layout follows the supplied POB project: a framework folder contains application-specific tests, pages and locators, plus shared fixtures, support and utilities. The framework folder is named mobile because this project runs native Appium tests.

```text
mobile/
  e2e/
    wikipedia/
      tests/android/wikipedia.spec.js
      pages/android/WikipediaPage.js
      locators/android/WikipediaLocators.js
    sampleApp/
      tests/ios/sampleApp.spec.js
      pages/ios/SampleAppPage.js
      locators/ios/SampleAppLocators.js
  fixtures/
    wikipedia/searches.json
    sampleApp/text.json
  support/
    command.js
    customTest.js
  utils/
    logger.js
    reporting.js
    selectDevice.js
    uploadApp.js
    validateConfig.js
    check.js
config/
  environment.js
  environment.test.js
  browserstack.js
  platforms.js
apps/
  android/wikipedia.apk
  ios/BStackSampleApp.ipa
wdio.conf.js
```

Specs contain business steps and import page instances and data through mobile/support/customTest.js. This shared entry point registers Mocha hooks, prepares Wikipedia before each Android test, and adds test IDs to Allure. Pages implement actions and assertions using mobile/support/command.js; locators contain native selectors. Fixtures contain application data. Utilities handle logging, screenshots, reporting, app uploads and device selection. Root config files own environment validation and cloud capabilities.

The POB archive uses Playwright fixtures and browser actions. Their mobile equivalents use Mocha hooks and WebdriverIO native actions. Banking page objects and browser selectors from the archive are reference material; the implemented mobile flows use the supplied APK and IPA. AIO integration, AIO result files and pipeline execution are excluded.

## Setup

Use Node.js 22.19 or later. Run commands from the project root:

```sh
npm install
npm run check
npm run test:unit
```

Create .env.android and .env.ios from .env.example. Existing platform files are preserved. Set BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY to your BrowserStack automation credentials. Platform environment files are ignored by Git. Process environment values take priority over file values.

Set APP_PATH to the APK or IPA path relative to the root. Android requires APP_ID=org.wikipedia.alpha. The iOS sample can detect its bundle ID automatically. DEVICE_NAME and OS_VERSION must be a supported pair; BROWSERSTACK_APP_ID must be the bs:// reference returned by upload. WAIT_TIMEOUT and MAX_INSTANCES accept positive integers. PROJECT_NAME and BUILD_NAME group sessions.

```sh
npm run setup:android
npm run setup:ios
npm run config:android
npm run config:ios
npm run test:android
npm run test:ios
```

Each setup command selects a supported device and uploads its local app, saving device settings and the app reference in the corresponding platform environment file. Device selection and upload can also run separately with npm run device:android, npm run device:ios, npm run upload:android and npm run upload:ios. Setup and tests contact BrowserStack; tests run on real cloud devices and use account capacity. Local Appium drivers, Android SDK and Xcode are unnecessary for cloud execution.

npm run test:both executes Android followed by iOS and stops if Android fails. The default npm test runs Android. WDIO discovers tests under mobile/e2e/*/tests/<platform>.

## Implemented flows

- Android Wikipedia: launch, dismiss optional onboarding and compatibility dialog, verify home, search Appium and JavaScript, and assert exact article titles. Searches require Wikipedia network access.
- iOS BrowserStack sample: open Text Button, enter fixture text, submit, and verify Text Output.

## Reports

Failure screenshots are saved under reports/screenshots and attached to Allure. Allure results go to reports/allure-results, JUnit XML to reports/junit, and worker logs to logs. The final hook sets BrowserStack session status. Existing reports remain available; they describe earlier runs and are not validation of the reorganized project.

```sh
npm run allure:generate
npm run allure:open
```

Allure HTML generation requires Java on PATH. Results accumulate between runs. Archive older results before collecting an isolated report.

## Adding an application

Create matching mobile/e2e/<application>/tests/<platform>, pages/<platform> and locators/<platform> folders. Put data in mobile/fixtures/<application>, register page instances and setup hooks in mobile/support/customTest.js, and import the shared entry point from specs. Update environment and capabilities when targeting a different application. Keep credentials out of fixtures and source files.

## POB review

POB.zip groups tests, pages and locators under playwright/e2e/pob, with fixtures, support and utils under playwright. This project mirrors those relationships under mobile and preserves Android/iOS separation. Root WDIO configuration replaces Playwright configuration. POB's aioCycleManager.js, cycle/result fixtures, GitLab configuration, banking data and generated browser reports are not imported. The original ZIP is preserved.
