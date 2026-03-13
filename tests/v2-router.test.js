/**
 * V2 VRouter 路由组件演示页面测试
 */

import { test, expect } from '@playwright/test';

test.describe('V2 VRouter 演示页面', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/v2/examples/router.html');
    await page.waitForTimeout(1000); // 等待页面和路由初始化
  });

  test('页面加载成功', async ({ page }) => {
    // 等待页面完全加载
    await page.waitForTimeout(500);

    // 检查页面标题 - 使用更通用的选择器
    await expect(page.getByText('VRouter 路由').first()).toBeVisible();

    // 检查演示区域存在
    const demoCard = page.getByText('在线演示').first();
    await expect(demoCard).toBeVisible();
  });

  test('快速导航菜单存在', async ({ page }) => {
    // 检查导航按钮存在 - 使用链接的 role
    await expect(page.getByRole('link', { name: '🏠 首页' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: '👥 用户列表' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: '📦 产品列表' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: '⚙️ 设置' }).first()).toBeVisible();
  });

  test('首页默认加载', async ({ page }) => {
    // 等待路由渲染
    await page.waitForTimeout(500);

    // 检查首页内容 - 使用更精确的选择器
    await expect(page.getByText('欢迎使用 VRouter 路由系统').first()).toBeVisible();
  });

  test('导航到用户列表', async ({ page }) => {
    // 点击用户列表按钮 - 使用 role
    await page.getByRole('link', { name: '👥 用户列表' }).first().click();
    await page.waitForTimeout(500);

    // 检查用户列表页面
    await expect(page.getByText('👥 用户列表').first()).toBeVisible();
    await expect(page.getByText('张三').first()).toBeVisible();
  });

  test('动态参数 - 查看用户详情', async ({ page }) => {
    // 先导航到用户列表
    await page.getByRole('link', { name: '👥 用户列表' }).first().click();
    await page.waitForTimeout(500);

    // 点击用户 1 - 使用更精确的选择器
    await page.getByText('张三 (点击查看详情)').first().click();
    await page.waitForTimeout(1000);

    // 检查用户详情页面
    await expect(page.getByText('用户详情').first()).toBeVisible();

    // 检查 URL hash
    await expect(page).toHaveURL(/#\/router\/user\/1/);

    // 检查页面包含用户 1 的相关信息（使用更灵活的选择器）
    await expect(page.locator('text=用户 ID').first()).toBeVisible();
    await expect(page.locator('text=1').first()).toBeVisible();
    await expect(page.locator('text=张三').first()).toBeVisible();
  });

  test('导航到产品列表', async ({ page }) => {
    await page.getByRole('link', { name: '📦 产品列表' }).first().click();
    await page.waitForTimeout(500);

    await expect(page.getByText('📦 产品列表').first()).toBeVisible();
    await expect(page.getByText('笔记本电脑').first()).toBeVisible();
  });

  test('路由守卫 - 设置页面确认', async ({ page }) => {
    // 点击设置按钮，处理确认对话框
    page.once('dialog', dialog => {
      expect(dialog.type()).toBe('confirm');
      dialog.accept();
    });

    await page.getByRole('link', { name: '⚙️ 设置' }).first().click();
    await page.waitForTimeout(500);

    // 检查设置页面
    await expect(page.getByText('⚙️ 设置').first()).toBeVisible();
    await expect(page.getByText('此页面有路由守卫').first()).toBeVisible();
  });

  test('404 页面处理', async ({ page }) => {
    // 点击 404 测试按钮
    await page.getByRole('link', { name: '❌ 404 测试' }).first().click();
    await page.waitForTimeout(500);

    // 检查 404 页面
    await expect(page.getByText('404').first()).toBeVisible();
    await expect(page.getByText('页面未找到').first()).toBeVisible();
  });

  test('当前路由信息显示', async ({ page }) => {
    // 检查路由信息显示区域存在
    await expect(page.getByText('📍 当前路由').first()).toBeVisible();
    await expect(page.getByText('当前路径').first()).toBeVisible();
    await expect(page.getByText('路由参数').first()).toBeVisible();
  });

  test('导航到关于页面', async ({ page }) => {
    await page.getByRole('link', { name: '📖 关于' }).first().click();
    await page.waitForTimeout(500);

    await expect(page.getByText('📖 关于').first()).toBeVisible();
    await expect(page.getByText('Yoya.Basic VRouter 是一个轻量级的 Hash 路由实现').first()).toBeVisible();
  });

  test('浏览器后退/前进', async ({ page }) => {
    // 先导航到用户列表
    await page.getByRole('link', { name: '👥 用户列表' }).first().click();
    await page.waitForTimeout(500);
    await expect(page.getByText('👥 用户列表').first()).toBeVisible();

    // 导航到产品列表
    await page.getByRole('link', { name: '📦 产品列表' }).first().click();
    await page.waitForTimeout(500);
    await expect(page.getByText('📦 产品列表').first()).toBeVisible();

    // 浏览器后退
    await page.goBack();
    await page.waitForTimeout(500);
    await expect(page.getByText('👥 用户列表').first()).toBeVisible();

    // 浏览器前进
    await page.goForward();
    await page.waitForTimeout(500);
    await expect(page.getByText('📦 产品列表').first()).toBeVisible();
  });

  test('代码示例区域存在', async ({ page }) => {
    // 向下滚动查看代码示例
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(300);

    // 检查代码示例区域 - 使用更精确的选择器
    await expect(page.locator('#basic').getByText('基础用法').first()).toBeVisible();
    await expect(page.locator('#dynamic').getByText('动态路由参数').first()).toBeVisible();
  });

  test('API 参考表格存在', async ({ page }) => {
    // 滚动到 API 部分
    await page.evaluate(() => window.scrollTo(0, 2000));
    await page.waitForTimeout(300);

    await expect(page.getByText('API 参考').first()).toBeVisible();
    await expect(page.getByText('vRouter').first()).toBeVisible();
    await expect(page.getByText('vLink').first()).toBeVisible();
  });
});
