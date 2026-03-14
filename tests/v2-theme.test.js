/**
 * V2 主题系统测试
 */
import { test, expect } from '@playwright/test';

test.describe('V2 主题系统', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001/v2/examples/theme.html');
    await page.waitForTimeout(2000);
  });

  test('页面加载成功', async ({ page }) => {
    const title = await page.title();
    console.log('页面标题:', title);
    expect(title).toBe('Yoya.Basic V2 - 主题系统');
    console.log('✓ 页面加载成功');
  });

  test('主题切换按钮存在', async ({ page }) => {
    const lightBtn = page.getByText('☀️ 浅色').first();
    const darkBtn = page.getByText('🌙 深色').first();
    const autoBtn = page.getByText('🔄 自动').first();

    await expect(lightBtn).toBeVisible();
    await expect(darkBtn).toBeVisible();
    await expect(autoBtn).toBeVisible();

    console.log('✓ 主题切换按钮存在');
  });

  test('切换到深色主题', async ({ page }) => {
    const body = page.locator('body');
    const lightBg = await body.evaluate(el =>
      getComputedStyle(el).getPropertyValue('--yoya-bg').trim()
    );
    console.log('浅色模式背景:', lightBg);

    const darkBtn = page.getByText('🌙 深色').first();
    await darkBtn.click();
    await page.waitForTimeout(500);

    const darkBg = await body.evaluate(el =>
      getComputedStyle(el).getPropertyValue('--yoya-bg').trim()
    );
    console.log('深色模式背景:', darkBg);

    expect(lightBg).not.toBe(darkBg);
    console.log('✓ 深色主题切换成功');
  });

  test('切换到浅色主题', async ({ page }) => {
    const darkBtn = page.getByText('🌙 深色').first();
    await darkBtn.click();
    await page.waitForTimeout(500);

    const lightBtn = page.getByText('☀️ 浅色').first();
    await lightBtn.click();
    await page.waitForTimeout(500);

    const body = page.locator('body');
    const lightBg = await body.evaluate(el =>
      getComputedStyle(el).getPropertyValue('--yoya-bg').trim()
    );
    console.log('浅色模式背景:', lightBg);

    expect(lightBg.toLowerCase()).toMatch(/^(white|#fff|#ffffff|rgb\(255, 255, 255\))$/i);
    console.log('✓ 浅色主题切换成功');
  });

  test('CSS 变量定义正确', async ({ page }) => {
    const root = page.locator(':root');

    const variables = [
      '--yoya-primary',
      '--yoya-bg',
      '--yoya-text',
      '--yoya-border',
      '--yoya-success',
      '--yoya-warning',
      '--yoya-error',
    ];

    for (const variable of variables) {
      const value = await root.evaluate((el, varName) =>
        getComputedStyle(el).getPropertyValue(varName).trim()
      , variable);
      expect(value).toBeTruthy();
      console.log(`✓ ${variable}: ${value}`);
    }
  });
});

console.log('\n=== V2 主题系统测试 ===\n');
