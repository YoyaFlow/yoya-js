import { test, expect } from '@playwright/test';

test.describe('Dashboard Decoration 实际应用场景测试', () => {
  const BASE_URL = 'http://localhost:3001/yoya/examples/yoya.dashboard.decoration.usage.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('页面应该正常加载', async ({ page }) => {
    await expect(page).toHaveTitle(/Yoya.Basic - Dashboard Decoration 实际应用场景/);

    const mainTitle = page.locator('h1');
    await expect(mainTitle).toBeVisible();
    await expect(mainTitle).toContainText('Dashboard Decoration 实际应用场景');
  });

  test('场景 1: 数据概览卡片 - VGlowBox', async ({ page }) => {
    const statsContainer = page.locator('#scene1-stats');
    await expect(statsContainer).toBeVisible();

    // 检查 4 个统计卡片
    const glowBoxes = statsContainer.locator('.yoya-glow-box');
    await expect(glowBoxes).toHaveCount(4);

    // 检查每个卡片的内容
    await expect(page.locator('#scene1-stats')).toContainText('总用户数');
    await expect(page.locator('#scene1-stats')).toContainText('本月收入');
    await expect(page.locator('#scene1-stats')).toContainText('订单数量');
    await expect(page.locator('#scene1-stats')).toContainText('转化率');

    // 检查数值显示
    await expect(page.locator('#scene1-stats')).toContainText('128,456');
    await expect(page.locator('#scene1-stats')).toContainText('¥892,340');
  });

  test('场景 2: 服务器监控面板 - VTechBorder', async ({ page }) => {
    const monitorPanel = page.locator('#scene2-monitor');
    await expect(monitorPanel).toBeVisible();

    // 检查科技风边框
    await expect(monitorPanel.locator('.yoya-tech-border')).toBeVisible();

    // 检查面板标题
    await expect(monitorPanel).toContainText('服务器监控');
    await expect(monitorPanel).toContainText('运行正常');

    // 检查监控指标
    await expect(monitorPanel).toContainText('CPU 使用率');
    await expect(monitorPanel).toContainText('内存使用');
    await expect(monitorPanel).toContainText('磁盘空间');
    await expect(monitorPanel).toContainText('网络流量');
  });

  test('场景 3: 销售数据报告 - VPanel + VTitleBar + VDivider', async ({ page }) => {
    const reportPanel = page.locator('#scene3-report');
    await expect(reportPanel).toBeVisible();

    // 检查面板
    await expect(reportPanel.locator('.yoya-panel')).toBeVisible();

    // 检查标题栏
    await expect(reportPanel).toContainText('月度销售报告');
    await expect(reportPanel).toContainText('2024 年 3 月');

    // 检查分割线
    const dividers = reportPanel.locator('.yoya-divider');
    await expect(dividers).toHaveCount(4);

    // 检查数据行
    await expect(reportPanel).toContainText('销售总额');
    await expect(reportPanel).toContainText('线上销售');
    await expect(reportPanel).toContainText('线下销售');
  });

  test('场景 4: 实时告警列表 - VCorner + VBorder', async ({ page }) => {
    const alertsPanel = page.locator('#scene4-alerts');
    await expect(alertsPanel).toBeVisible();

    // 检查角标装饰
    await expect(alertsPanel.locator('.yoya-corner')).toBeVisible();

    // 检查标题
    await expect(alertsPanel).toContainText('实时告警');
    await expect(alertsPanel.locator('.yoya-corner')).toContainText('3');

    // 检查告警项
    await expect(alertsPanel).toContainText('服务器 CPU 使用率超过 90%');
    await expect(alertsPanel).toContainText('数据库连接池使用率超过 80%');
    await expect(alertsPanel).toContainText('系统自动备份完成');
  });

  test('场景 5: 完整数据大屏 - 综合应用', async ({ page }) => {
    const dashboard = page.locator('#scene5-dashboard');
    await expect(dashboard).toBeVisible();

    // 检查左侧主面板
    const mainPanel = dashboard.locator('.yoya-panel').first();
    await expect(mainPanel).toBeVisible();
    await expect(mainPanel).toContainText('数据中心');

    // 检查右侧侧边栏
    const sidebar = dashboard.locator('.yoya-glow-box').first();
    await expect(sidebar).toBeVisible();
    await expect(sidebar).toContainText('今日目标');

    // 检查角标装饰的快捷操作
    const cornerBox = dashboard.locator('.yoya-corner').last();
    await expect(cornerBox).toContainText('快捷操作');
    await expect(cornerBox).toContainText('查看报表');
  });

  test('所有场景无 JavaScript 错误', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
  });

  test('检查响应式布局', async ({ page }) => {
    // 测试桌面视口
    await page.setViewportSize({ width: 1920, height: 1080 });
    const statsContainer = page.locator('#scene1-stats');
    await expect(statsContainer).toBeVisible();

    // 测试平板视口
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(statsContainer).toBeVisible();

    // 测试手机视口
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(statsContainer).toBeVisible();
  });
});
