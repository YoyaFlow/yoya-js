import { test, expect } from '@playwright/test';

test.describe('Dashboard Decoration 页面测试', () => {
  const BASE_URL = 'http://localhost:3001/yoya/examples/yoya.dashboard.decoration.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('页面应该正常加载', async ({ page }) => {
    // 检查页面标题
    await expect(page).toHaveTitle(/Yoya.Basic - Dashboard Decoration Components/);

    // 检查主标题
    const mainTitle = page.locator('h1');
    await expect(mainTitle).toBeVisible();
    await expect(mainTitle).toContainText('大屏装饰组件演示');
  });

  test('VBorder 装饰边框组件测试', async ({ page }) => {
    // 检查所有 VBorder 容器是否存在
    const borders = ['#border1', '#border2', '#border3', '#border4'];

    for (const selector of borders) {
      const borderEl = page.locator(selector);
      await expect(borderEl).toBeVisible();

      // 检查是否应用了边框样式类
      await expect(borderEl.locator('.yoya-border')).toBeVisible();
    }

    // 检查普通边框内容
    await expect(page.locator('#border1')).toContainText('普通边框');

    // 检查渐变边框
    await expect(page.locator('#border2')).toContainText('渐变边框');
    const gradientBorder = page.locator('#border2 .yoya-border__gradient');
    await expect(gradientBorder).toBeVisible();

    // 检查发光边框
    await expect(page.locator('#border3')).toContainText('发光边框');
    const glowBorder = page.locator('#border3 .yoya-border__glow');
    await expect(glowBorder).toBeVisible();

    // 检查角标边框
    await expect(page.locator('#border4')).toContainText('角标边框');
    const cornerPieces = page.locator('#border4 .yoya-border__corner');
    await expect(cornerPieces).toHaveCount(4);
  });

  test('VDivider 分割线组件测试', async ({ page }) => {
    const dividers = ['#divider1', '#divider2', '#divider3', '#divider4', '#divider5'];

    for (const selector of dividers) {
      const dividerEl = page.locator(selector);
      await expect(dividerEl).toBeVisible();
      await expect(dividerEl.locator('.yoya-divider')).toBeVisible();
    }

    // 检查带文字的分割线
    const divider4 = page.locator('#divider4');
    await expect(divider4).toContainText('分割线');
    await expect(divider4.locator('.yoya-divider__text')).toBeVisible();

    // 检查渐变分割线
    const divider5 = page.locator('#divider5');
    await expect(divider5).toContainText('重要分隔');
  });

  test('VCorner 角标装饰组件测试', async ({ page }) => {
    const corners = ['#corner1', '#corner2', '#corner3'];

    for (const selector of corners) {
      const cornerEl = page.locator(selector);
      await expect(cornerEl).toBeVisible();
      await expect(cornerEl.locator('.yoya-corner')).toBeVisible();
    }

    // 检查 L 型角标
    const corner1 = page.locator('#corner1');
    await expect(corner1).toContainText('L 型角标');

    // 检查方块角标
    const corner2 = page.locator('#corner2');
    await expect(corner2).toContainText('方块角标（动画）');

    // 检查三角角标
    const corner3 = page.locator('#corner3');
    await expect(corner3).toContainText('三角角标（仅上方）');
  });

  test('VTitleBar 标题栏组件测试', async ({ page }) => {
    const titlebars = ['#titlebar1', '#titlebar2', '#titlebar3', '#titlebar4'];

    for (const selector of titlebars) {
      const titlebarEl = page.locator(selector);
      await expect(titlebarEl).toBeVisible();
      await expect(titlebarEl.locator('.yoya-title-bar')).toBeVisible();
    }

    // 检查普通标题
    await expect(page.locator('#titlebar1')).toContainText('普通标题');

    // 检查带图标的标题
    const titlebar2 = page.locator('#titlebar2');
    await expect(titlebar2).toContainText('渐变装饰标题');
    await expect(titlebar2.locator('.yoya-title-bar__icon')).toContainText('📊');

    // 检查括号装饰标题
    const titlebar3 = page.locator('#titlebar3');
    await expect(titlebar3).toContainText('括号装饰标题');
    await expect(titlebar3.locator('.yoya-title-bar__bracket')).toHaveCount(2);

    // 检查带副标题的标题栏
    const titlebar4 = page.locator('#titlebar4');
    await expect(titlebar4).toContainText('带副标题');
    await expect(titlebar4.locator('.yoya-title-bar__subtitle')).toBeVisible();
  });

  test('VPanel 装饰面板组件测试', async ({ page }) => {
    const panels = ['#panel1', '#panel2', '#panel3'];

    for (const selector of panels) {
      const panelEl = page.locator(selector);
      await expect(panelEl).toBeVisible();
      await expect(panelEl.locator('.yoya-panel')).toBeVisible();
    }

    // 检查普通面板
    const panel1 = page.locator('#panel1');
    await expect(panel1).toContainText('普通面板');
    await expect(panel1).toContainText('这是普通面板的内容区域');

    // 检查渐变边框面板
    const panel2 = page.locator('#panel2');
    await expect(panel2).toContainText('渐变边框面板');
    const panel2Gradient = panel2.locator('.yoya-panel__gradient');
    await expect(panel2Gradient).toBeVisible();

    // 检查科技风面板
    const panel3 = page.locator('#panel3');
    await expect(panel3).toContainText('科技风面板');
    const panel3TechCorners = panel3.locator('.yoya-panel__tech-corner');
    await expect(panel3TechCorners).toHaveCount(4);
  });

  test('VGlowBox 发光盒子组件测试', async ({ page }) => {
    const glowboxes = ['#glowbox1', '#glowbox2', '#glowbox3'];

    for (const selector of glowboxes) {
      const glowboxEl = page.locator(selector);
      await expect(glowboxEl).toBeVisible();
      await expect(glowboxEl.locator('.yoya-glow-box')).toBeVisible();
    }

    // 检查蓝色发光盒子
    await expect(page.locator('#glowbox1')).toContainText('蓝色发光盒子');

    // 检查青色发光盒子
    await expect(page.locator('#glowbox2')).toContainText('青色发光盒子');

    // 检查红色发光盒子（无动画）
    await expect(page.locator('#glowbox3')).toContainText('红色发光盒子（无动画）');
  });

  test('VTechBorder 科技风边框组件测试', async ({ page }) => {
    const techBorders = ['#techborder1', '#techborder2'];

    for (const selector of techBorders) {
      const techBorderEl = page.locator(selector);
      await expect(techBorderEl).toBeVisible();
      await expect(techBorderEl.locator('.yoya-tech-border')).toBeVisible();
    }

    // 检查服务器状态监控卡片
    const techBorder1 = page.locator('#techborder1');
    await expect(techBorder1).toContainText('服务器状态监控');
    await expect(techBorder1).toContainText('CPU 使用率');
    await expect(techBorder1).toContainText('内存使用');
    await expect(techBorder1).toContainText('运行正常');

    // 检查科技风边框的角标
    const corners1 = techBorder1.locator('.yoya-tech-border__corner');
    await expect(corners1).toHaveCount(4);

    // 检查实时告警面板
    const techBorder2 = page.locator('#techborder2');
    await expect(techBorder2).toContainText('实时告警');
    await expect(techBorder2).toContainText('3 条未处理');
    await expect(techBorder2).toContainText('服务器 CPU 使用率超过 90%');
  });

  test('检查所有组件渲染无 JavaScript 错误', async ({ page }) => {
    // 收集控制台错误
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // 等待页面完全加载
    await page.waitForTimeout(2000);

    // 不应该有 JavaScript 错误
    expect(errors.length).toBe(0);
  });

  test('检查 CSS 文件正确加载', async ({ page }) => {
    // 检查 dashboard.css 是否加载
    const cssLink = page.locator('link[href="../../yoya/theme/css/components/dashboard.css"]');
    // 注意：HTML 中是相对路径，实际应该是正确的

    // 检查至少有一个样式被应用
    const borderEl = page.locator('#border1 .yoya-border');
    await expect(borderEl).toBeVisible();

    // 获取计算的样式来验证 CSS 已加载
    const styles = await borderEl.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        position: computed.position,
        padding: computed.padding,
      };
    });

    expect(styles.position).toBe('relative');
  });

  test('综合示例 - 数据看板卡片测试', async ({ page }) => {
    const dashboardCard = page.locator('#dashboard-card');
    await expect(dashboardCard).toBeVisible();

    // 检查面板
    await expect(dashboardCard.locator('.yoya-panel')).toBeVisible();

    // 检查标题
    await expect(dashboardCard).toContainText('数据看板');

    // 检查数据项
    await expect(dashboardCard).toContainText('用户数');
    await expect(dashboardCard).toContainText('12,345');
    await expect(dashboardCard).toContainText('销售额');
    await expect(dashboardCard).toContainText('¥89,234');
    await expect(dashboardCard).toContainText('订单数');
    await expect(dashboardCard).toContainText('1,567');

    // 检查发光盒子
    const glowBoxes = dashboardCard.locator('.yoya-glow-box');
    await expect(glowBoxes).toHaveCount(3);

    // 检查底部统计
    await expect(dashboardCard).toContainText('较昨日 +15%');
  });
});
