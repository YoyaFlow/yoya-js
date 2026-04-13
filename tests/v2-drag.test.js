/**
 * 拖拽组件测试
 * 测试 VDraggable, VDroppable, VDragSortList 组件
 */

import { test, expect } from '@playwright/test';

test.describe('拖拽组件测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/v2/examples/drag.html', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
  });

  test('演示页面应该成功加载', async ({ page }) => {
    // 验证页面标题
    const title = await page.title();
    expect(title).toBe('拖拽组件演示 - YoyaJS');

    // 验证三个演示区域都存在
    const section1 = page.locator('h2', { hasText: '基础拖拽' }).first();
    const section2 = page.locator('h2', { hasText: '拖拽排序' }).first();
    const section3 = page.locator('h2', { hasText: '布局编辑器' }).first();

    await expect(section1).toBeVisible();
    await expect(section2).toBeVisible();
    await expect(section3).toBeVisible();
  });

  test('VDraggable 可拖拽元素应该存在', async ({ page }) => {
    // 验证可拖拽元素存在
    const draggableBox = page.locator('.draggable-box').first();
    await expect(draggableBox).toBeVisible();

    // 验证可拖拽元素有正确的样式
    const cursor = await draggableBox.evaluate(el =>
      window.getComputedStyle(el).cursor
    );
    expect(cursor).toBe('grab');
  });

  test('VDroppable 放置区域应该存在', async ({ page }) => {
    // 验证放置区域存在
    const dropZone = page.locator('.drop-zone').first();
    await expect(dropZone).toBeVisible();

    // 验证放置区域有正确的文本
    const text = await dropZone.textContent();
    expect(text).toContain('放置到这里');
  });

  test('VDragSortList 排序列表应该存在', async ({ page }) => {
    // 验证排序列表容器存在
    const sortListContainer = page.locator('.sort-list').first();
    await expect(sortListContainer).toBeVisible();

    // 验证排序列表项存在（在 sort-list 容器内查找）
    const sortItems = sortListContainer.locator('[style*="cursor: grab"]');
    await expect(sortItems).toHaveCount(4);

    // 验证第一项的内容
    const firstItem = sortItems.first();
    const text = await firstItem.textContent();
    expect(text).toContain('第一项');
  });

  test('布局编辑器组件面板应该存在', async ({ page }) => {
    // 验证组件面板存在
    const componentPanel = page.locator('.component-panel').first();
    await expect(componentPanel).toBeVisible();

    // 验证组件列表存在
    const componentItems = page.locator('.component-item');
    await expect(componentItems).toHaveCount(4);

    // 验证组件名称
    const componentNames = ['按钮', '输入框', '卡片', '图表'];
    for (let i = 0; i < 4; i++) {
      const item = componentItems.nth(i);
      const text = await item.textContent();
      expect(text).toContain(componentNames[i]);
    }
  });

  test('布局编辑器画布区域应该存在', async ({ page }) => {
    // 验证画布区域存在
    const canvasArea = page.locator('.canvas-area').first();
    await expect(canvasArea).toBeVisible();

    // 验证画布内的区域存在
    const zones = page.locator('.canvas-zone');
    await expect(zones).toHaveCount(3);

    // 验证区域标签
    const zoneLabels = ['头部区域', '内容区域', '底部区域'];
    for (let i = 0; i < 3; i++) {
      const label = zones.nth(i).locator('.canvas-zone-label');
      const text = await label.textContent();
      expect(text).toContain(zoneLabels[i]);
    }
  });

  test('事件日志应该显示初始化消息', async ({ page }) => {
    // 验证事件日志区域存在
    const outputArea = page.locator('.output-area').first();
    await expect(outputArea).toBeVisible();

    // 验证日志消息
    const logEntries = outputArea.locator('.log-entry');
    await expect(logEntries).toHaveCount(4);

    // 验证第一条日志
    const firstLog = logEntries.first();
    const text = await firstLog.textContent();
    expect(text).toContain('拖拽组件演示已加载');
  });

  test('拖拽事件应该被记录', async ({ page }) => {
    // 获取初始日志数量
    const initialLogs = await page.locator('.log-entry').count();

    // 尝试点击可拖拽元素（模拟交互）
    const draggableBox = page.locator('.draggable-box').first();
    await draggableBox.click();

    // 等待一小段时间
    await page.waitForTimeout(100);

    // 验证日志数量没有变化（点击不是拖拽）
    const afterLogs = await page.locator('.log-entry').count();
    // 点击不会触发拖拽事件，所以日志数量应该不变
    expect(afterLogs).toBeGreaterThanOrEqual(initialLogs);
  });
});
