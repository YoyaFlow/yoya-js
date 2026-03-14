/**
 * Yoya.Basic 主题展示页面测试
 */
import { test, expect } from '@playwright/test';

test.describe('Yoya.Basic 主题展示', () => {
  test('页面加载成功', async ({ page }) => {
    await page.goto('http://localhost:3000/examples/yoya.theme.showcase.html');

    // 等待页面加载
    await page.waitForTimeout(1500);

    // 检查页面标题
    const title = await page.title();
    expect(title).toBe('Yoya.Basic 主题展示');

    // 检查导航栏（使用 emoji + 文本，排除代码区域）
    const navbar = page.getByText('🏝️ Yoya.Basic').first();
    await expect(navbar).toBeVisible();

    // 检查主题按钮（使用 emoji + 文本，排除代码区域）
    const lightBtn = page.getByText('☀️ 浅色').first();
    const darkBtn = page.getByText('🌙 深色').first();
    const autoBtn = page.getByText('🔄 自动').first();

    await expect(lightBtn).toBeVisible();
    await expect(darkBtn).toBeVisible();
    await expect(autoBtn).toBeVisible();

    console.log('✓ 页面加载成功');
  });

  test('切换到深色主题', async ({ page }) => {
    await page.goto('http://localhost:3000/examples/yoya.theme.showcase.html');
    await page.waitForTimeout(1500);

    // 获取当前背景色（浅色）
    const body = page.locator('body');
    const lightBg = await body.evaluate(el =>
      getComputedStyle(el).getPropertyValue('--yoya-bg').trim()
    );
    console.log('浅色主题背景:', lightBg);

    // 点击深色主题按钮
    const darkBtn = page.getByText('🌙 深色').first();
    await darkBtn.click();
    await page.waitForTimeout(500);

    // 获取切换后的背景色（深色）
    const darkBg = await body.evaluate(el =>
      getComputedStyle(el).getPropertyValue('--yoya-bg').trim()
    );
    console.log('深色主题背景:', darkBg);

    // 验证背景色已改变
    expect(lightBg).not.toBe(darkBg);
    expect(darkBg.toLowerCase()).toMatch(/#[1-9a-fA-F]/); // 深色应该不是纯白

    // 检查是否显示成功消息
    const toastMessage = page.locator('text=已切换到深色主题');
    await expect(toastMessage).toBeVisible({ timeout: 3000 });

    console.log('✓ 深色主题切换成功');
  });

  test('切换到浅色主题', async ({ page }) => {
    await page.goto('http://localhost:3000/examples/yoya.theme.showcase.html');
    await page.waitForTimeout(1500);

    // 先切换到深色
    const darkBtn = page.getByText('🌙 深色').first();
    await darkBtn.click();
    await page.waitForTimeout(500);

    // 再切换到浅色
    const lightBtn = page.getByText('☀️ 浅色').first();
    await lightBtn.click();
    await page.waitForTimeout(500);

    // 获取背景色
    const body = page.locator('body');
    const lightBg = await body.evaluate(el =>
      getComputedStyle(el).getPropertyValue('--yoya-bg').trim()
    );
    console.log('浅色主题背景:', lightBg);

    // 验证背景色是白色或接近白色
    expect(lightBg.toLowerCase()).toMatch(/^(white|#fff|#ffffff|rgb\(255, 255, 255\))$/i);

    console.log('✓ 浅色主题切换成功');
  });

  test('按钮点击显示消息', async ({ page }) => {
    await page.goto('http://localhost:3000/examples/yoya.theme.showcase.html');
    await page.waitForTimeout(1500);

    // 点击成功按钮
    const successBtn = page.locator('text=成功');
    await successBtn.click();
    await page.waitForTimeout(500);

    // 检查成功消息
    const successMsg = page.locator('text=操作成功完成');
    await expect(successMsg).toBeVisible({ timeout: 3000 });

    // 点击错误按钮
    const errorBtn = page.locator('text=错误');
    await errorBtn.click();
    await page.waitForTimeout(500);

    // 检查错误消息
    const errorMsg = page.locator('text=发生错误');
    await expect(errorMsg).toBeVisible({ timeout: 3000 });

    console.log('✓ 消息提示功能正常');
  });

  test('下拉菜单功能', async ({ page }) => {
    await page.goto('http://localhost:3000/examples/yoya.theme.showcase.html');
    await page.waitForTimeout(1500);

    // 点击下拉菜单触发器
    const dropdownTrigger = page.locator('text=点击打开菜单');
    await dropdownTrigger.click();
    await page.waitForTimeout(500);

    // 检查菜单项是否显示
    const menuItem = page.locator('text=新建文件');
    await expect(menuItem).toBeVisible({ timeout: 3000 });

    console.log('✓ 下拉菜单功能正常');
  });

  test('CSS 变量定义正确', async ({ page }) => {
    await page.goto('http://localhost:3000/examples/yoya.theme.showcase.html');
    await page.waitForTimeout(1500);

    // 检查关键 CSS 变量是否存在
    const root = page.locator(':root');

    const variables = [
      '--yoya-primary',
      '--yoya-bg',
      '--yoya-text',
      '--yoya-border',
      '--yoya-menu-bg',
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

console.log('\n=== Yoya.Basic 主题展示测试完成 ===\n');
