/**
 * Yoya.Basic 主题切换测试
 * 使用 /usr/bin/chromium 浏览器
 */
import { test, expect } from '@playwright/test';

test.describe('Yoya.Basic 主题系统', () => {
  test.beforeEach(async ({ page }) => {
    // 访问主题测试页面
    await page.goto('http://localhost:3000/examples/yoya.theme.simple.html');
    await page.waitForTimeout(1000);
  });

  test('页面加载成功', async ({ page }) => {
    // 检查页面标题
    const title = await page.title();
    console.log('页面标题:', title);

    // 截图
    await page.screenshot({ path: 'test-results/theme-test-01-initial.png' });

    // 检查是否有 Yoya.Basic 相关内容
    const content = await page.content();
    expect(content).toContain('Yoya');

    console.log('✓ 页面加载成功');
  });

  test('CSS 变量定义正确', async ({ page }) => {
    // 检查关键 CSS 变量是否存在
    const root = page.locator(':root');

    const variables = [
      '--yoya-primary',
      '--yoya-bg',
      '--yoya-text',
      '--yoya-border',
    ];

    for (const variable of variables) {
      const value = await root.evaluate((el, varName) =>
        getComputedStyle(el).getPropertyValue(varName).trim()
      , variable);
      console.log(`${variable}: ${value}`);
      expect(value).toBeTruthy();
    }

    console.log('✓ CSS 变量定义正确');
  });

  test('主题变量前缀为 --yoya-*', async ({ page }) => {
    // 获取所有 CSS 变量
    const allVariables = await page.evaluate(() => {
      const styles = getComputedStyle(document.documentElement);
      const yoyaVars = [];
      for (let i = 0; i < styles.length; i++) {
        const name = styles[i];
        if (name.startsWith('--yoya-')) {
          yoyaVars.push(name);
        }
      }
      return yoyaVars;
    });

    console.log(`找到 ${allVariables.length} 个 --yoya-* 前缀的变量:`);
    allVariables.slice(0, 20).forEach(v => console.log(`  - ${v}`));

    expect(allVariables.length).toBeGreaterThan(10);
    console.log('✓ 主题变量前缀正确');
  });
});

console.log('\n=== Yoya.Basic 主题系统测试 ===\n');
