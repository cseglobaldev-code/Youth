import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('http://localhost:5174/projects', { waitUntil: 'networkidle' });
await page.screenshot({ path: '/tmp/projects_page.png', fullPage: true });
await browser.close();
console.log('done');
