import { test, expect } from '@playwright/test';

test.describe('Dashboard 演示页面测试', () => {
  test('页面应该正常加载', async ({ page }) => {
    await page.goto('http://localhost:3001/v2/examples/dashboard.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 检查页面标题
    const title = await page.title();
    expect(title).toContain('Dashboard');
    
    // 检查是否有内容
    const app = await page.locator('#app');
    await expect(app).toBeVisible();
  });
});
