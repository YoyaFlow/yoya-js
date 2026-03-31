import { test, expect } from '@playwright/test';

test.describe('VVerticalProgress Debug', () => {
  test('check console errors', async ({ page }) => {
    const errors = [];
    const logs = [];

    page.on('console', msg => {
      logs.push(`${msg.type()}: ${msg.text()}`);
    });

    page.on('pageerror', err => {
      errors.push(`${err.message}\n${err.stack}`);
    });

    await page.goto('http://localhost:3001/yoya/examples/yoya.vertical-progress.example.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    console.log('Logs:', logs);
    console.log('Errors:', errors);

    // 检查是否有内容
    const example1 = await page.locator('#example1').innerHTML();
    console.log('example1 content:', example1.substring(0, 500));

    // 检查错误
    if (errors.length > 0) {
      console.error('Found errors:', errors);
    }

    expect(errors.length).toBe(0);
  });
});
