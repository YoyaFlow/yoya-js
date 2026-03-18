/**
 * Modal 组件主题测试
 */

import { test, expect } from '@playwright/test';

test.describe('Modal 组件主题测试', () => {
  test('检查 Modal 深色模式主题变量', async ({ page }) => {
    // 访问 modal.html 页面
    await page.goto('http://localhost:3000/v2/examples/modal.html', { waitUntil: 'domcontentloaded' });

    // 等待页面加载
    await page.waitForTimeout(1500);

    // 切换到深色模式 - 通过设置 data-theme 属性
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'islands-dark');
    });
    await page.waitForTimeout(500);

    // 获取模态框主题变量
    const modalBg = await page.evaluate(() => {
      return getComputedStyle(document.documentElement)
        .getPropertyValue('--yoya-modal-bg')
        .trim();
    });

    const modalMaskBg = await page.evaluate(() => {
      return getComputedStyle(document.documentElement)
        .getPropertyValue('--yoya-modal-mask-bg')
        .trim();
    });

    const modalHeaderColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement)
        .getPropertyValue('--yoya-modal-header-color')
        .trim();
    });

    // 验证深色模式变量
    expect(modalBg).toBe('#2a2a2a');
    expect(modalMaskBg).toBe('rgba(0, 0, 0, 0.65)');
    expect(modalHeaderColor).toBe('#e0e0e0');
  });

  test('检查 Modal 弹出框深色模式渲染', async ({ page }) => {
    await page.goto('http://localhost:3000/v2/examples/modal.html', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    // 切换到深色模式 - 通过设置 data-theme 属性
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'islands-dark');
    });
    await page.waitForTimeout(500);

    // 点击打开基础弹出框按钮
    const openButton = page.locator('button:has-text("打开基础弹出框")');
    if (await openButton.count() > 0) {
      await openButton.click();
      await page.waitForTimeout(500);

      // 等待模态框显示
      const modal = page.locator('.yoya-modal');
      await expect(modal).toBeVisible();

      // 获取模态框背景色
      const modalBackground = await modal.evaluate((el) => {
        return window.getComputedStyle(el.querySelector('.yoya-modal__content')).backgroundColor;
      });

      // 验证深色模式背景色
      expect(modalBackground).toContain('42'); // rgb(42, 42, 42) = #2a2a2a

      // 截图验证
      await page.screenshot({
        path: 'tests/screenshots/modal-dark-theme.png',
        fullPage: false
      });
    }
  });
});
