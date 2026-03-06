/**
 * V2 Examples 页面测试
 * 使用 Playwright 测试 v2/examples 页面是否能正常加载和渲染
 */
import { test, expect } from '@playwright/test';

test.describe('Yoya.Basic V2 Examples', () => {
  const BASE_URL = 'http://localhost:3001/v2/examples';

  test('首页应该能正常加载', async ({ page }) => {
    await page.goto(`${BASE_URL}/index.html`, {
      waitUntil: 'networkidle',
      timeout: 10000
    });

    // 等待页面渲染
    await page.waitForTimeout(2000);

    // 检查页面标题
    const title = await page.title();
    expect(title).toContain('Yoya.Basic V2');

    // 检查是否有 Yoya.Basic 内容
    const appContent = await page.textContent('#app');
    expect(appContent).toBeTruthy();
    expect(appContent.length).toBeGreaterThan(10);
  });

  test('Button 页面应该能正常加载', async ({ page }) => {
    await page.goto(`${BASE_URL}/button.html`, {
      waitUntil: 'networkidle',
      timeout: 10000
    });

    await page.waitForTimeout(2000);

    const appContent = await page.textContent('#app');
    expect(appContent).toContain('Button');
  });

  test('Form 页面应该能正常加载', async ({ page }) => {
    await page.goto(`${BASE_URL}/form.html`, {
      waitUntil: 'networkidle',
      timeout: 10000
    });

    await page.waitForTimeout(2000);

    const appContent = await page.textContent('#app');
    expect(appContent).toContain('Form');
  });

  test('Menu 页面应该能正常加载', async ({ page }) => {
    await page.goto(`${BASE_URL}/menu.html`, {
      waitUntil: 'networkidle',
      timeout: 10000
    });

    await page.waitForTimeout(2000);

    const appContent = await page.textContent('#app');
    expect(appContent).toContain('Menu');
  });

  test('Card 页面应该能正常加载', async ({ page }) => {
    await page.goto(`${BASE_URL}/card.html`, {
      waitUntil: 'networkidle',
      timeout: 10000
    });

    await page.waitForTimeout(2000);

    const appContent = await page.textContent('#app');
    expect(appContent).toContain('Card');
  });

  test('Message 页面应该能正常加载', async ({ page }) => {
    await page.goto(`${BASE_URL}/message.html`, {
      waitUntil: 'networkidle',
      timeout: 10000
    });

    await page.waitForTimeout(2000);

    const appContent = await page.textContent('#app');
    expect(appContent).toContain('Message');
  });

  test('Code 页面应该能正常加载', async ({ page }) => {
    await page.goto(`${BASE_URL}/code.html`, {
      waitUntil: 'networkidle',
      timeout: 10000
    });

    await page.waitForTimeout(2000);

    const appContent = await page.textContent('#app');
    expect(appContent).toContain('Code');
  });

  test('Detail 页面应该能正常加载', async ({ page }) => {
    await page.goto(`${BASE_URL}/detail.html`, {
      waitUntil: 'networkidle',
      timeout: 10000
    });

    await page.waitForTimeout(2000);

    const appContent = await page.textContent('#app');
    expect(appContent).toContain('Detail');
  });

  test('Field 页面应该能正常加载', async ({ page }) => {
    await page.goto(`${BASE_URL}/field.html`, {
      waitUntil: 'networkidle',
      timeout: 10000
    });

    await page.waitForTimeout(2000);

    const appContent = await page.textContent('#app');
    expect(appContent).toContain('Field');
  });

  test('Body 页面应该能正常加载', async ({ page }) => {
    await page.goto(`${BASE_URL}/body.html`, {
      waitUntil: 'networkidle',
      timeout: 10000
    });

    await page.waitForTimeout(2000);

    const appContent = await page.textContent('#app');
    expect(appContent).toContain('Body');
  });

  test('DynamicLoader 页面应该能正常加载', async ({ page }) => {
    await page.goto(`${BASE_URL}/dynamic-loader.html`, {
      waitUntil: 'networkidle',
      timeout: 10000
    });

    await page.waitForTimeout(2000);

    const appContent = await page.textContent('#app');
    expect(appContent).toContain('DynamicLoader');
  });
});
