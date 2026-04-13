/**
 * 测试 Router 菜单项刷新浏览器后的状态恢复
 */

import { test, expect } from '@playwright/test';

test.describe('Router 刷新后状态恢复', () => {
  test('点击 Router 菜单项后刷新浏览器，应该保持在 Router 页面', async ({ page }) => {
    // 设置 console 消息监听器（在页面加载前）
    const consoleMessages = [];
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('VRouterViews') || text.includes('setActiveView') || text.includes('restore') || text.includes('恢复')) {
        consoleMessages.push(text);
      }
    });

    // 清除所有 localStorage 以避免状态恢复干扰
    await page.goto('http://localhost:3000/v2-examples/home.html', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    await page.evaluate(() => {
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

    // 获取初始 hash
    const initialHash = await page.evaluate(() => window.location.hash);
    console.log('初始 hash:', initialHash);
    expect(initialHash).toBe('#/home');

    // 查找 Router 菜单项
    const routerMenuItem = page.locator('.yoya-menu-item').filter({ hasText: 'Router' }).first();
    await expect(routerMenuItem).toBeVisible();

    // 点击 Router 菜单项
    await routerMenuItem.click();
    await page.waitForTimeout(1500);

    // 验证 hash 变为 #/router
    let currentHash = await page.evaluate(() => window.location.hash);
    console.log('点击 Router 后 hash:', currentHash);
    expect(currentHash).toBe('#/router');

    // 验证当前页面是 home.html
    const currentPageUrl = new URL(page.url());
    expect(currentPageUrl.pathname).toBe('/v2-examples/home.html');

    // 刷新浏览器
    console.log('刷新浏览器...');
    consoleMessages.length = 0; // 清空之前的消息

    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(3000); // 等待恢复逻辑执行

    // 打印控制台消息
    console.log('=== 浏览器控制台消息 ===');
    consoleMessages.forEach(msg => console.log(msg));
    console.log('========================');

    // 检查恢复后的状态
    const restoreState = await page.evaluate(() => {
      const state = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('yoya-router-views-state')) {
          state[key] = localStorage.getItem(key);
        }
      }
      return state;
    });
    console.log('恢复后的 localStorage 状态:', restoreState);

    // 验证刷新后 hash 仍然是 #/router
    const refreshedHash = await page.evaluate(() => window.location.hash);
    console.log('刷新后 hash:', refreshedHash);

    // 验证页面 pathname 没有改变
    const refreshedPageUrl = new URL(page.url());
    expect(refreshedPageUrl.pathname).toBe('/v2-examples/home.html');

    // 验证 hash 保持为 #/router
    expect(refreshedHash).toBe('#/router');
  });

  test('点击 Button 菜单项后刷新浏览器，应该保持在 Button 页面', async ({ page }) => {
    // 设置 console 消息监听器
    const consoleMessages = [];
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('VRouterViews') || text.includes('setActiveView') || text.includes('restore') || text.includes('恢复')) {
        consoleMessages.push(text);
      }
    });

    // 清除所有 localStorage
    await page.goto('http://localhost:3000/v2-examples/home.html', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    await page.evaluate(() => {
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

    // 验证 hash 变为 #/button
    const currentHash = await page.evaluate(() => window.location.hash);
    console.log('点击 Button 后 hash:', currentHash);
    expect(currentHash).toBe('#/button');

    // 刷新浏览器
    console.log('刷新浏览器...');
    consoleMessages.length = 0;

    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // 打印控制台消息
    console.log('=== 浏览器控制台消息 ===');
    consoleMessages.forEach(msg => console.log(msg));
    console.log('========================');

    // 验证刷新后 hash 仍然是 #/button
    const refreshedHash = await page.evaluate(() => window.location.hash);
    console.log('刷新后 hash:', refreshedHash);
    expect(refreshedHash).toBe('#/button');
  });
});
