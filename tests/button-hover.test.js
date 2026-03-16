/**
 * VButton hover 效果测试
 */

import { test, expect } from '@playwright/test';

test.describe('VButton hover 效果', () => {

  test('hover 时背景色应该变化，hover 后应该恢复原色', async ({ page }) => {
    // 加载测试页面（已应用主题变量）
    await page.goto('/examples/yoya.button.hover.test.html');

    // 等待页面加载
    await page.waitForTimeout(200);

    // 找到 success 按钮
    const successBtn = page.locator('#btn-success button');

    // 检查按钮是否存在
    await expect(successBtn).toBeVisible();

    // 获取 CSS 变量值
    const successColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--yoya-success').trim();
    });

    console.log('--yoya-success 变量值:', successColor);

    // CSS 变量应该有值
    expect(successColor).toBeTruthy();
    expect(successColor).not.toBe('');

    // 获取 hover 前的背景色
    const beforeBg = await successBtn.evaluate((el) => {
      return window.getComputedStyle(el).background;
    });

    console.log('Success 按钮 hover 前背景色:', beforeBg);

    // hover 前背景色应该不是透明的
    expect(beforeBg).not.toBe('rgba(0, 0, 0, 0)');
    expect(beforeBg).toContain('rgb');

    // 触发 hover
    await successBtn.hover();

    // 等待 hover 效果
    await page.waitForTimeout(100);

    // 获取 hover 后的背景色
    const afterBg = await successBtn.evaluate((el) => {
      return window.getComputedStyle(el).background;
    });

    console.log('Success 按钮 hover 后背景色:', afterBg);

    // hover 后背景色应该发生变化
    expect(afterBg).not.toEqual(beforeBg);

    // 移开鼠标
    await page.mouse.move(0, 0);

    // 等待恢复
    await page.waitForTimeout(100);

    // 获取恢复后的背景色
    const recoveredBg = await successBtn.evaluate((el) => {
      return window.getComputedStyle(el).background;
    });

    console.log('Success 按钮恢复后背景色:', recoveredBg);

    // 恢复后应该与原始背景色相同或相似（允许 CSS 变量计算的小误差）
    // 注意：由于 CSS 变量解析，可能不是完全相同的字符串，但应该包含相同的颜色值
    expect(recoveredBg).toEqual(beforeBg);
  });

  test('warning 按钮 hover 后应该恢复正确的黄色', async ({ page }) => {
    await page.goto('/examples/yoya.button.hover.test.html');
    await page.waitForTimeout(200);

    const warningBtn = page.locator('#btn-warning button');
    await expect(warningBtn).toBeVisible();

    // 获取 CSS 变量值
    const warningColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--yoya-warning').trim();
    });

    console.log('--yoya-warning 变量值:', warningColor);

    // hover 前
    const beforeBg = await warningBtn.evaluate((el) => {
      return window.getComputedStyle(el).background;
    });
    console.log('Warning 按钮 hover 前背景色:', beforeBg);

    // hover
    await warningBtn.hover();
    await page.waitForTimeout(100);

    const afterBg = await warningBtn.evaluate((el) => {
      return window.getComputedStyle(el).background;
    });
    console.log('Warning 按钮 hover 后背景色:', afterBg);

    // 移开
    await page.mouse.move(0, 0);
    await page.waitForTimeout(100);

    // 恢复后
    const recoveredBg = await warningBtn.evaluate((el) => {
      return window.getComputedStyle(el).background;
    });
    console.log('Warning 按钮恢复后背景色:', recoveredBg);

    // 恢复后应该与原始背景色相同
    expect(recoveredBg).toEqual(beforeBg);
  });

  test('danger 按钮 hover 后应该恢复正确的红色', async ({ page }) => {
    await page.goto('/examples/yoya.button.hover.test.html');
    await page.waitForTimeout(200);

    const dangerBtn = page.locator('#btn-danger button');
    await expect(dangerBtn).toBeVisible();

    // hover 前
    const beforeBg = await dangerBtn.evaluate((el) => {
      return window.getComputedStyle(el).background;
    });
    console.log('Danger 按钮 hover 前背景色:', beforeBg);

    // hover
    await dangerBtn.hover();
    await page.waitForTimeout(100);

    const afterBg = await dangerBtn.evaluate((el) => {
      return window.getComputedStyle(el).background;
    });
    console.log('Danger 按钮 hover 后背景色:', afterBg);

    // 移开
    await page.mouse.move(0, 0);
    await page.waitForTimeout(100);

    // 恢复后
    const recoveredBg = await dangerBtn.evaluate((el) => {
      return window.getComputedStyle(el).background;
    });
    console.log('Danger 按钮恢复后背景色:', recoveredBg);

    // 恢复后应该与原始背景色相同
    expect(recoveredBg).toEqual(beforeBg);
  });

  test('ghost 按钮 hover 后应该恢复透明背景', async ({ page }) => {
    await page.goto('/examples/yoya.button.hover.test.html');
    await page.waitForTimeout(200);

    const ghostBtn = page.locator('#btn-ghost button');
    await expect(ghostBtn).toBeVisible();

    // hover 前
    const beforeBg = await ghostBtn.evaluate((el) => {
      return window.getComputedStyle(el).background;
    });
    console.log('Ghost 按钮 hover 前背景色:', beforeBg);

    // hover
    await ghostBtn.hover();
    await page.waitForTimeout(100);

    const afterBg = await ghostBtn.evaluate((el) => {
      return window.getComputedStyle(el).background;
    });
    console.log('Ghost 按钮 hover 后背景色:', afterBg);

    // 移开
    await page.mouse.move(0, 0);
    await page.waitForTimeout(100);

    // 恢复后
    const recoveredBg = await ghostBtn.evaluate((el) => {
      return window.getComputedStyle(el).background;
    });
    console.log('Ghost 按钮恢复后背景色:', recoveredBg);

    // 恢复后应该与原始背景色相同
    expect(recoveredBg).toEqual(beforeBg);
  });

});
