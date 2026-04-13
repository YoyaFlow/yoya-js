/**
 * 测试 VRouterViews 状态持久化功能
 */

import { test, expect } from '@playwright/test';

test.describe('VRouterViews 状态持久化', () => {
  test('验证刷新后视图状态恢复', async ({ page }) => {
    // 清除缓存
    await page.setExtraHTTPHeaders({
      'cache-control': 'no-cache'
    });

    // 清除 localStorage，确保测试从干净状态开始
    await page.goto('http://localhost:3000/v2-examples/home.html', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    await page.evaluate(() => {
      // 清除所有 yoya-router-views-state 相关的 key
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
    await page.waitForTimeout(3000);

    // 初始状态检查
    let initialState = await page.evaluate(() => {
      const tabs = document.querySelectorAll('.yoya-router-views__tab');
      return {
        tabCount: tabs.length,
        activeTab: document.querySelector('.yoya-router-views__tab--active')?.textContent?.trim(),
      };
    });

    // 点击侧边栏的 Button 菜单项，打开新视图
    const buttonMenuItem = page.locator('.yoya-menu-item').filter({ hasText: 'Button' }).first();
    await buttonMenuItem.click();
    await page.waitForTimeout(2000);

    // 检查是否添加了新视图
    let afterClickState = await page.evaluate(() => {
      const tabs = document.querySelectorAll('.yoya-router-views__tab');
      return {
        tabCount: tabs.length,
        tabs: Array.from(tabs).map(t => t.textContent?.trim()),
        activeTab: document.querySelector('.yoya-router-views__tab--active')?.textContent?.trim(),
      };
    });

    // 验证添加了新视图
    expect(afterClickState.tabCount).toBeGreaterThan(initialState.tabCount);

    // 检查 localStorage 中的状态
    let savedState = await page.evaluate(() => {
      // 查找 yoya-router-views-state 相关的 key
      let targetKey = null;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('yoya-router-views-state')) {
          targetKey = key;
          break;
        }
      }
      return targetKey ? JSON.parse(localStorage.getItem(targetKey)) : null;
    });

    // 验证状态已保存
    expect(savedState).not.toBeNull();
    expect(savedState?.views?.length).toBeGreaterThan(1);

    // 刷新页面
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(4000);

    // 检查 localStorage 中的状态
    let localStorageAfter = await page.evaluate(() => {
      const data = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('yoya-router-views-state')) {
          data[key] = localStorage.getItem(key);
        }
      }
      return data;
    });

    // 检查状态是否恢复
    let restoredState = await page.evaluate(() => {
      const tabs = document.querySelectorAll('.yoya-router-views__tab');
      return {
        tabCount: tabs.length,
        tabs: Array.from(tabs).map(t => t.textContent?.trim()),
        activeTab: document.querySelector('.yoya-router-views__tab--active')?.textContent?.trim(),
      };
    });

    // 验证刷新后视图数量保持一致（恢复之前的状态）
    expect(restoredState.tabCount).toBe(afterClickState.tabCount);
  });
});
