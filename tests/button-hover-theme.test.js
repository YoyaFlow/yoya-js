/**
 * VButton hover 效果测试 - 应用主题变量后
 */

import { test, expect } from '@playwright/test';

test.describe('VButton hover 效果 - 带主题变量', () => {

  test('应用主题变量后 hover 应该显示正确颜色', async ({ page }) => {
    // 加载组件示例页面
    await page.goto('/examples/yoya.components.example.html');

    // 应用主题变量
    await page.evaluate(() => {
      const { applyGlobalVariables, baseVariables } = window.yoya;
      if (applyGlobalVariables && baseVariables) {
        applyGlobalVariables(baseVariables);
      }
    });

    // 等待页面重新渲染
    await page.waitForTimeout(100);

    // 找到 success 按钮
    const successBtn = page.locator('button:has-text("Success")').first();

    // 检查按钮是否存在
    await expect(successBtn).toBeVisible();

    // 获取 hover 前的背景色
    const beforeBg = await successBtn.evaluate((el) => {
      return window.getComputedStyle(el).background;
    });

    console.log('Success 按钮 hover 前背景色:', beforeBg);

    // 触发 hover
    await successBtn.hover();

    // 等待 hover 效果
    await page.waitForTimeout(50);

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
    await page.waitForTimeout(50);

    // 获取恢复后的背景色
    const recoveredBg = await successBtn.evaluate((el) => {
      return window.getComputedStyle(el).background;
    });

    console.log('Success 按钮恢复后背景色:', recoveredBg);

    // 恢复后应该与原始背景色相同
    expect(recoveredBg).toEqual(beforeBg);
  });

  test('应用 Islands 主题后 hover 应该显示正确颜色', async ({ page }) => {
    // 加载组件示例页面
    await page.goto('/examples/yoya.components.example.html');

    // 应用 Islands 主题
    await page.evaluate(() => {
      const { initTheme } = window.yoya;
      if (initTheme) {
        initTheme({ defaultTheme: 'islands', defaultMode: 'light' });
      }
    });

    // 等待主题加载
    await page.waitForTimeout(200);

    // 找到 success 按钮
    const successBtn = page.locator('button:has-text("Success")').first();

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

    console.log('Success 按钮 hover 前背景色 (Islands):', beforeBg);

    // 触发 hover
    await successBtn.hover();

    // 等待 hover 效果
    await page.waitForTimeout(50);

    // 获取 hover 后的背景色
    const afterBg = await successBtn.evaluate((el) => {
      return window.getComputedStyle(el).background;
    });

    console.log('Success 按钮 hover 后背景色 (Islands):', afterBg);

    // hover 后背景色应该发生变化
    expect(afterBg).not.toEqual(beforeBg);
  });
});
