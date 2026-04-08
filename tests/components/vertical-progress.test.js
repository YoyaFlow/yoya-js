import { test, expect } from '@playwright/test';

test.describe('VVerticalProgress 纵向进度条组件测试', () => {
  const BASE_URL = 'http://localhost:3001/yoya/examples/yoya.vertical-progress.example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('页面应该正常加载', async ({ page }) => {
    await expect(page).toHaveTitle(/VVerticalProgress - 纵向进度条组件/);
    await expect(page.locator('.demo-title')).toBeVisible();
  });

  test('基础示例 - 正常状态', async ({ page }) => {
    const progress = page.locator('#example1 .yoya-vertical-progress');
    await expect(progress).toBeVisible();
    await expect(page.locator('#example1')).toContainText('正常状态');
  });

  test('基础示例 - 预警状态', async ({ page }) => {
    const progress = page.locator('#example2 .yoya-vertical-progress');
    await expect(progress).toBeVisible();
    await expect(page.locator('#example2')).toContainText('预警状态');
  });

  test('基础示例 - 报警状态', async ({ page }) => {
    const progress = page.locator('#example3 .yoya-vertical-progress');
    await expect(progress).toBeVisible();
    await expect(page.locator('#example3')).toContainText('报警状态');
  });

  test('绝对值显示 - 带单位', async ({ page }) => {
    // 重量显示
    const weightProgress = page.locator('#example-weight .yoya-vertical-progress');
    await expect(weightProgress).toBeVisible();
    await expect(page.locator('#example-weight')).toContainText('kg');

    // 料位高度
    const heightProgress = page.locator('#example-height .yoya-vertical-progress');
    await expect(heightProgress).toBeVisible();
    await expect(page.locator('#example-height')).toContainText('mm');

    // 压力显示
    const pressureProgress = page.locator('#example-pressure .yoya-vertical-progress');
    await expect(pressureProgress).toBeVisible();
    await expect(page.locator('#example-pressure')).toContainText('bar');
  });

  test('工业场景 - 石子煤排渣箱监控系统', async ({ page }) => {
    // 检查 4 个排渣箱
    for (let i = 1; i <= 4; i++) {
      const tank = page.locator(`#tank${i}`);
      await expect(tank).toBeVisible();
    }

    // 检查状态标签
    // tank1: 850 < 1400 (warning) → 正常
    // tank2: 1520 > 1400 (warning) → 预警
    // tank3: 1890 > 1800 (alarm) → 报警
    // tank4: 450 < 1400 (warning) → 正常
    await expect(page.locator('#status1')).toContainText('正常');
    await expect(page.locator('#status2')).toContainText('预警');
    await expect(page.locator('#status3')).toContainText('报警');
    await expect(page.locator('#status4')).toContainText('正常');
  });

  test('阈值配置对比', async ({ page }) => {
    const strictThreshold = page.locator('#threshold-strict');
    const normalThreshold = page.locator('#threshold-normal');
    const looseThreshold = page.locator('#threshold-loose');

    await expect(strictThreshold).toBeVisible();
    await expect(normalThreshold).toBeVisible();
    await expect(looseThreshold).toBeVisible();
  });

  test('动态数据模拟', async ({ page }) => {
    const dynamic1 = page.locator('#dynamic1');
    const dynamic2 = page.locator('#dynamic2');
    const dynamic3 = page.locator('#dynamic3');

    await expect(dynamic1).toBeVisible();
    await expect(dynamic2).toBeVisible();
    await expect(dynamic3).toBeVisible();

    // 点击模拟按钮
    const btnSimulate = page.locator('#btn-simulate');
    await expect(btnSimulate).toBeVisible();
    await btnSimulate.click();

    // 等待数据更新
    await page.waitForTimeout(500);

    // 检查进度条是否更新
    await expect(dynamic1).toBeVisible();
  });

  test('检查进度条填充高度', async ({ page }) => {
    // 正常状态 (45%)
    const normalFill = page.locator('#example1 .yoya-vertical-progress__fill');
    const normalHeight = await normalFill.getAttribute('style');
    expect(normalHeight).toContain('height');

    // 报警状态 (95%)
    const alarmFill = page.locator('#example3 .yoya-vertical-progress__fill');
    const alarmHeight = await alarmFill.getAttribute('style');
    expect(alarmHeight).toContain('height');
  });

  test('检查阈值线位置', async ({ page }) => {
    // 检查预警线
    const warningLine = page.locator('#example1 .yoya-vertical-progress__warning-line');
    await expect(warningLine).toBeVisible();

    // 检查报警线
    const alarmLine = page.locator('#example1 .yoya-vertical-progress__alarm-line');
    await expect(alarmLine).toBeVisible();
  });

  test('检查状态颜色变化', async ({ page }) => {
    // 正常状态 - 绿色
    const normalFill = page.locator('#example1 .yoya-vertical-progress__fill');
    const normalStyle = await normalFill.getAttribute('style');
    expect(normalStyle).toContain('rgb(82, 196, 26)'); // 绿色 rgb(82, 196, 26) = #52c41a

    // 预警状态 - 橙色
    const warningFill = page.locator('#example2 .yoya-vertical-progress__fill');
    const warningStyle = await warningFill.getAttribute('style');
    expect(warningStyle).toContain('rgb(250, 173, 20)'); // 橙色 rgb(250, 173, 20) = #faad14

    // 报警状态 - 红色
    const alarmFill = page.locator('#example3 .yoya-vertical-progress__fill');
    const alarmStyle = await alarmFill.getAttribute('style');
    expect(alarmStyle).toContain('rgb(255, 77, 79)'); // 红色 rgb(255, 77, 79) = #ff4d4f
  });

  test('无 JavaScript 错误', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.waitForTimeout(1000);
    expect(errors.length).toBe(0);
  });
});
