/**
 * V2 Examples 访问测试
 * 测试 dist/v2-examples 目录的页面可访问性
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8080';

test.describe('V2 Examples 访问测试', () => {
  test('首页可以加载', async ({ page }) => {
    const response = await page.goto(BASE_URL + '/index.html');
    expect(response.status()).toBe(200);

    // 等待页面加载
    await page.waitForLoadState('networkidle');

    // 检查标题
    const title = await page.title();
    expect(title).toContain('Yoya.Basic V2');
  });

  test('核心资源文件可访问', async ({ page }) => {
    // 测试 yoya.esm.min.js
    const jsResponse = await page.goto(BASE_URL + '/yoya.esm.min.js');
    expect(jsResponse.status()).toBe(200);
    const jsContent = await jsResponse.text();
    expect(jsContent).toContain('export');

    // 测试 yoya.theme.css
    const cssResponse = await page.goto(BASE_URL + '/yoya.theme.css');
    expect(cssResponse.status()).toBe(200);
    const cssContent = await cssResponse.text();
    expect(cssContent.length).toBeGreaterThan(1000);

    // 测试 yoya.echart.esm.min.js
    const echartResponse = await page.goto(BASE_URL + '/yoya.echart.esm.min.js');
    expect(echartResponse.status()).toBe(200);
  });

  test('HTML 页面正确引用资源', async ({ page }) => {
    await page.goto(BASE_URL + '/index.html');

    // 检查是否加载了 yoya.theme.css
    const cssLink = page.locator('link[href="yoya.theme.css"]');
    await expect(cssLink).toHaveCount(1);

    // 检查是否加载了 index.js
    const scriptTag = page.locator('script[src="index.js"]');
    await expect(scriptTag).toHaveCount(1);
  });

  test('子页面可以访问', async ({ page }) => {
    const pages = [
      '/home.html',
      '/button.html',
      '/card.html',
      '/form.html',
      '/menu.html',
      '/echart.html',
    ];

    for (const pagePath of pages) {
      const response = await page.goto(BASE_URL + pagePath);
      expect(response.status()).toBe(200);
      console.log(`✓ ${pagePath}: ${response.status()}`);
    }
  });

  test('JS 文件正确引用库', async ({ page }) => {
    const response = await page.goto(BASE_URL + '/index.js');
    expect(response.status()).toBe(200);

    const content = await response.text();
    // 检查是否使用了正确的库引用
    expect(content).toContain('yoya.esm.min.js');
  });

  test('子目录文件可以访问', async ({ page }) => {
    const files = [
      '/framework/AppShell.js',
      '/components/PageHeader.js',
      '/config/routes.js',
      '/pages/Home/index.js',
    ];

    for (const filePath of files) {
      const response = await page.goto(BASE_URL + filePath);
      expect(response.status()).toBe(200);
      console.log(`✓ ${filePath}: ${response.status()}`);
    }
  });
});
