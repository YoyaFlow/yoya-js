/**
 * 测试 Router 菜单项与其他菜单项行为一致
 */

import { test, expect } from '@playwright/test';

test.describe('Router 菜单项行为一致性', () => {
  test('验证 Router 菜单项在 VRouterViews 中打开', async ({ page }) => {
    // 捕获控制台消息
    const consoleMessages = [];
    page.on('console', msg => {
      consoleMessages.push(msg.text());
    });

    // 清除所有 localStorage 以避免状态恢复干扰
    await page.goto('http://localhost:3000/v2-examples/home.html', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    await page.evaluate(() => {
      // 清除所有可能的 localStorage 键
      localStorage.removeItem('yoya-router-views-state-v2-demo-main');
      localStorage.removeItem('yoya-router-views-state-v2-examples-home-html');
      localStorage.removeItem('yoya-router-views-state-root');
      // 清除所有以 yoya-router-views-state 开头的键
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('yoya-router-views-state')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    });

    // 重新加载页面
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // 获取初始状态
    const initialHash = await page.evaluate(() => window.location.hash);
    console.log('初始 hash:', initialHash);

    // 查找 Router 菜单项
    const routerMenuItem = page.locator('.yoya-menu-item').filter({ hasText: 'Router' }).first();
    await expect(routerMenuItem).toBeVisible();

    // 点击 Router 菜单项
    console.log('点击 Router 菜单项...');
    await routerMenuItem.click();

    // 等待视图切换完成
    await page.waitForTimeout(1000);

    // 检查 hash 是否改变
    let currentHash = await page.evaluate(() => window.location.hash);
    console.log('1 秒后 hash:', currentHash);

    // 打印控制台消息
    console.log('=== 浏览器控制台消息 ===');
    consoleMessages.forEach(msg => {
      if (msg.includes('VRouterViews') || msg.includes('hash') || msg.includes('router')) {
        console.log(msg);
      }
    });
    console.log('========================');

    await page.waitForTimeout(2000);

    currentHash = await page.evaluate(() => window.location.hash);
    console.log('3 秒后 hash:', currentHash);

    // 验证页面 pathname 没有改变
    const currentPageUrl = new URL(page.url());
    expect(currentPageUrl.pathname).toBe('/v2-examples/home.html');

    // 验证 hash 改变了（从 /home 变为 /router）
    expect(currentHash).toBe('#/router');
  });

  test('验证 Button 菜单项行为与 Router 一致', async ({ page }) => {
    // 清除所有 localStorage
    await page.goto('http://localhost:3000/v2-examples/home.html', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    await page.evaluate(() => {
      // 清除所有可能的 localStorage 键
      localStorage.removeItem('yoya-router-views-state-v2-demo-main');
      localStorage.removeItem('yoya-router-views-state-v2-examples-home-html');
      localStorage.removeItem('yoya-router-views-state-root');
      // 清除所有以 yoya-router-views-state 开头的键
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('yoya-router-views-state')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // 查找 Button 菜单项
    const buttonMenuItem = page.locator('.yoya-menu-item').filter({ hasText: 'Button' }).first();
    await expect(buttonMenuItem).toBeVisible();

    // 点击 Button 菜单项
    await buttonMenuItem.click();
    await page.waitForTimeout(1500);

    // 验证 hash 改变为 /button
    const currentPageUrl = new URL(page.url());
    expect(currentPageUrl.hash).toBe('#/button');
  });
});
