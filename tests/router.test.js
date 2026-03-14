/**
 * VRouter 路由组件测试
 */

import { test, expect } from '@playwright/test';

test.describe('VRouter 路由组件', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/yoya.router.example.html');
    await page.waitForTimeout(500); // 等待路由初始化
  });

  test('首页加载', async ({ page }) => {
    // 检查首页标题
    await expect(page.locator('h1')).toContainText('🏠 首页');

    // 检查 URL hash
    await expect(page).toHaveURL(/#\/home/);
  });

  test('导航到关于页面', async ({ page }) => {
    // 点击关于链接
    await page.click('[data-path="/about"]');
    await page.waitForTimeout(300);

    // 检查页面内容
    await expect(page.locator('h1')).toContainText('📖 关于 VRouter');
    await expect(page).toHaveURL(/#\/about/);
  });

  test('导航到用户详情（动态参数）', async ({ page }) => {
    // 点击用户链接
    await page.click('[data-path="/user/1001"]');
    await page.waitForTimeout(300);

    // 检查用户详情页面
    await expect(page.locator('h1')).toContainText('👤 用户详情');
    await expect(page.locator('h3')).toContainText('用户 ID: 1001');
    await expect(page).toHaveURL(/#\/user\/1001/);
  });

  test('导航到设置页面', async ({ page }) => {
    await page.click('[data-path="/settings"]');
    await page.waitForTimeout(300);

    await expect(page.locator('h1')).toContainText('⚙️ 设置');
    await expect(page).toHaveURL(/#\/settings/);
  });

  test('导航到仪表盘', async ({ page }) => {
    await page.click('[data-path="/dashboard"]');
    await page.waitForTimeout(300);

    await expect(page.locator('h1')).toContainText('📊 仪表盘');
    await expect(page).toHaveURL(/#\/dashboard/);
  });

  test('浏览器后退/前进', async ({ page }) => {
    // 先导航到关于页面
    await page.click('[data-path="/about"]');
    await page.waitForTimeout(300);
    await expect(page).toHaveURL(/#\/about/);

    // 再导航到设置页面
    await page.click('[data-path="/settings"]');
    await page.waitForTimeout(300);
    await expect(page).toHaveURL(/#\/settings/);

    // 浏览器后退
    await page.goBack();
    await page.waitForTimeout(300);
    await expect(page).toHaveURL(/#\/about/);

    // 浏览器前进
    await page.goForward();
    await page.waitForTimeout(300);
    await expect(page).toHaveURL(/#\/settings/);
  });

  test('导航激活状态', async ({ page }) => {
    // 首页应该是激活状态
    const homeLink = page.locator('[data-path="/home"]');
    await expect(homeLink).toHaveClass(/active/);

    // 点击关于后，关于应该激活
    await page.click('[data-path="/about"]');
    await page.waitForTimeout(300);
    await expect(homeLink).not.toHaveClass(/active/);
    await expect(page.locator('[data-path="/about"]')).toHaveClass(/active/);
  });

  test('内联链接导航', async ({ page }) => {
    // 在首页点击内联的关于链接
    await page.click('.inline-links a:has-text("📖 关于")');
    await page.waitForTimeout(300);

    await expect(page.locator('h1')).toContainText('📖 关于 VRouter');
  });

  test('侧边栏导航样式', async ({ page }) => {
    // 检查侧边栏存在
    const sidebar = page.locator('.sidebar');
    await expect(sidebar).toBeVisible();

    // 检查导航项样式
    const navItems = page.locator('.nav-item');
    await expect(navItems.first()).toBeVisible();
  });
});
