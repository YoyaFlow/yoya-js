/**
 * Dashboard 装饰组件演示页面测试
 */

import { test, expect } from '@playwright/test';

test.describe('Dashboard 装饰组件演示页面', () => {
  test('页面应该正常加载并渲染所有组件', async ({ page }) => {
    // 收集控制台错误
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // 访问页面
    await page.goto('http://localhost:3001/yoya/examples/yoya.dashboard.decoration.html', {
      waitUntil: 'networkidle',
      timeout: 15000
    });

    // 等待页面加载
    await page.waitForTimeout(2000);

    // 检查页面标题
    const title = await page.title();
    expect(title).toContain('Dashboard');

    // 检查主标题
    const mainHeading = await page.textContent('h1');
    expect(mainHeading).toContain('大屏装饰组件演示');

    // 检查各个组件区域是否存在
    const sections = [
      'border1', 'border2', 'border3', 'border4',
      'divider1', 'divider2', 'divider3', 'divider4', 'divider5',
      'corner1', 'corner2', 'corner3',
      'titlebar1', 'titlebar2', 'titlebar3', 'titlebar4',
      'panel1', 'panel2', 'panel3',
      'glowbox1', 'glowbox2', 'glowbox3',
      'techborder1', 'techborder2',
      'dashboard-card'
    ];

    for (const sectionId of sections) {
      const el = await page.$(`#${sectionId}`);
      expect(el).toBeTruthy();
      
      // 检查元素是否有子元素（组件应该已渲染）
      const childCount = await el.$$eval('*', els => els.length);
      console.log(`${sectionId}: ${childCount} 子元素`);
    }

    // 检查是否有 JavaScript 错误
    if (errors.length > 0) {
      console.error('JavaScript 错误:', errors.join('\n'));
    }
    
    // 不应该有关键错误
    const criticalErrors = errors.filter(e => 
      e.includes('Uncaught') || 
      e.includes('TypeError') || 
      e.includes('ReferenceError') ||
      e.includes('is not defined') ||
      e.includes('cannot read')
    );
    
    expect(criticalErrors).toHaveLength(0);

    // 截图
    await page.screenshot({ path: 'test-results/dashboard-decoration.png' });
  });

  test('VBorder 组件应该正确渲染', async ({ page }) => {
    await page.goto('http://localhost:3001/yoya/examples/yoya.dashboard.decoration.html', {
      waitUntil: 'networkidle',
      timeout: 15000
    });

    await page.waitForTimeout(1000);

    // 检查边框组件是否有正确的类名
    const border1 = await page.$('#border1 .yoya-border');
    expect(border1).toBeTruthy();

    // 检查渐变边框
    const border2 = await page.$('#border2 .yoya-border__gradient');
    expect(border2).toBeTruthy();

    // 检查发光边框
    const border3 = await page.$('#border3 .yoya-border__glow');
    expect(border3).toBeTruthy();

    // 检查角标边框
    const border4 = await page.$('#border4 .yoya-border__corner');
    expect(border4).toBeTruthy();
  });

  test('VDivider 组件应该正确渲染', async ({ page }) => {
    await page.goto('http://localhost:3001/yoya/examples/yoya.dashboard.decoration.html', {
      waitUntil: 'networkidle',
      timeout: 15000
    });

    await page.waitForTimeout(1000);

    // 检查分割线组件
    const divider1 = await page.$('#divider1 .yoya-divider');
    expect(divider1).toBeTruthy();

    // 检查带文字的分割线
    const divider4 = await page.$('#divider4 .yoya-divider__text');
    expect(divider4).toBeTruthy();
    const textContent = await divider4.textContent();
    expect(textContent).toBe('分割线');
  });

  test('VPanel 组件应该正确渲染', async ({ page }) => {
    await page.goto('http://localhost:3001/yoya/examples/yoya.dashboard.decoration.html', {
      waitUntil: 'networkidle',
      timeout: 15000
    });

    await page.waitForTimeout(1000);

    // 检查面板组件
    const panel1 = await page.$('#panel1 .yoya-panel');
    expect(panel1).toBeTruthy();

    // 检查面板内容
    const panelContent = await page.$('#panel1 .yoya-panel__content');
    expect(panelContent).toBeTruthy();

    // 检查科技风面板的角标
    const panel3Corners = await page.$$('#panel3 .yoya-panel__tech-corner');
    expect(panel3Corners.length).toBeGreaterThan(0);
  });

  test('VTechBorder 科技风边框应该正确渲染', async ({ page }) => {
    await page.goto('http://localhost:3001/yoya/examples/yoya.dashboard.decoration.html', {
      waitUntil: 'networkidle',
      timeout: 15000
    });

    await page.waitForTimeout(2000);

    // 检查服务器状态监控卡片
    const serverCard = await page.$('#techborder1 .yoya-tech-border');
    expect(serverCard).toBeTruthy();
    
    // 检查是否包含"服务器状态监控"文本
    const cardText = await page.textContent('#techborder1');
    expect(cardText).toContain('服务器状态监控');
    expect(cardText).toContain('CPU 使用率');
    
    // 检查实时告警面板
    const alertPanel = await page.$('#techborder2 .yoya-tech-border');
    expect(alertPanel).toBeTruthy();
    
    // 检查是否包含"实时告警"文本
    const alertText = await page.textContent('#techborder2');
    expect(alertText).toContain('实时告警');
    expect(alertText).toContain('严重');
  });
});
