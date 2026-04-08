/**
 * VTree 浏览器集成测试
 * 使用 Playwright 测试 VTree 组件在浏览器中的实际行为
 */

import { test, expect } from '@playwright/test';

test.describe('VTree 组件 - 简单测试', () => {
  test('应该可以在页面中渲染', async ({ page }) => {
    // 访问简单测试页面
    await page.goto('http://localhost:3001/examples/yoya.vtree.simple.test.html', {
      waitUntil: 'networkidle',
      timeout: 15000
    });

    // 等待页面加载
    await page.waitForTimeout(2000);

    // 检查是否有 yoya-tree 元素
    const treeEl = await page.$('.yoya-tree');
    expect(treeEl).toBeTruthy();
  });
});

test.describe('VTree 组件 - 演示页面', () => {
  test('应该可以加载演示页面并捕获错误', async ({ page }) => {
    // 收集控制台消息
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
      console.log(`[${msg.type()}] ${msg.text()}`);
    });

    await page.goto('http://localhost:3001/examples/yoya.vtree.example.html', {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });

    // 等待更长时间让脚本执行
    await page.waitForTimeout(5000);

    // 截图
    await page.screenshot({ path: 'test-results/vtree-demo-full.png' });

    // 检查页面标题
    const title = await page.title();
    expect(title).toContain('VTree');

    // 检查是否有 tree1 容器
    const tree1El = await page.$('#tree1');
    expect(tree1El).toBeTruthy();

    // 检查是否有 yoya-tree 元素
    await page.waitForTimeout(2000);
    const yoyaTree = await page.$('.yoya-tree');

    // 如果有错误，则打印
    if (errors.length > 0) {
      console.error('JavaScript 错误:', errors.join('\n'));
    }

    // 树应该存在
    expect(yoyaTree).toBeTruthy();
  });
});

test.describe('VTree 组件 - 诊断测试', () => {
  test('诊断页面应该显示成功', async ({ page }) => {
    await page.goto('http://localhost:3001/examples/yoya.vtree.diagnose.html', {
      waitUntil: 'networkidle',
      timeout: 15000
    });

    await page.waitForTimeout(3000);

    // 获取状态文本
    const statusText = await page.textContent('#status');
    console.log('诊断状态:', statusText);

    // 应该找到 .yoya-tree 元素
    expect(statusText).toContain('找到 .yoya-tree 元素');
  });
});
