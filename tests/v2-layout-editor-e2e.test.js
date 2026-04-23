import { test, expect } from '@playwright/test';

test.describe('布局编辑器 E2E 测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3004/v2/examples/layout-editor.html');
    await page.waitForTimeout(500);
  });

  test('页面加载正确', async ({ page }) => {
    // 验证页面标题
    await expect(page).toHaveTitle('布局编辑器 - YoyaJS');

    // 验证工具栏
    await expect(page.locator('.toolbar')).toBeVisible();
    await expect(page.locator('h1')).toContainText('布局编辑器');

    // 验证组件面板
    await expect(page.locator('.components-panel')).toBeVisible();

    // 验证画布
    await expect(page.locator('#canvas')).toBeVisible();

    // 验证属性面板
    await expect(page.locator('.properties-panel')).toBeVisible();
  });

  test('组件列表渲染正确', async ({ page }) => {
    // 验证组件数量
    const components = page.locator('#components-list > *');
    await expect(components).toHaveCount(4);

    // 验证组件类型
    await expect(components.nth(0)).toContainText('按钮');
    await expect(components.nth(1)).toContainText('文本');
    await expect(components.nth(2)).toContainText('容器');
    await expect(components.nth(3)).toContainText('图片');
  });

  test('拖拽组件到画布', async ({ page }) => {
    // 重新加载页面确保画布干净
    await page.reload();
    await page.waitForTimeout(500);

    // 拖拽第一个组件（按钮）到画布
    const firstComponent = page.locator('#components-list > *').first();
    const canvas = page.locator('#canvas');

    await firstComponent.dragTo(canvas, {
      sourcePosition: { x: 80, y: 12 },
      targetPosition: { x: 100, y: 100 }
    });

    await page.waitForTimeout(300);

    // 验证组件被创建
    const canvasComponents = page.locator('.canvas-component');
    await expect(canvasComponents).toHaveCount(1);

    // 验证组件内容
    await expect(canvasComponents.first()).toContainText('按钮');

    // 验证属性面板更新
    await expect(page.locator('#prop-content')).toHaveValue('按钮');
  });

  test('调整组件大小', async ({ page }) => {
    // 拖拽组件到画布
    const firstComponent = page.locator('#components-list > *').first();
    const canvas = page.locator('#canvas');

    await firstComponent.dragTo(canvas, {
      sourcePosition: { x: 80, y: 12 },
      targetPosition: { x: 100, y: 100 }
    });

    await page.waitForTimeout(300);

    // 点击组件选中它
    const canvasComponent = page.locator('.canvas-component').first();
    await canvasComponent.click();
    await page.waitForTimeout(200);

    // 获取初始尺寸
    const initialBounds = await canvasComponent.boundingBox();

    // 获取右下角调整手柄
    const seHandle = page.locator('.resize-handle.se');
    const handleBox = await seHandle.boundingBox();

    if (handleBox) {
      // 拖拽手柄调整大小
      const centerX = handleBox.x + handleBox.width / 2;
      const centerY = handleBox.y + handleBox.height / 2;

      await page.mouse.move(centerX, centerY);
      await page.waitForTimeout(50);
      await page.mouse.down();
      await page.waitForTimeout(50);
      await page.mouse.move(centerX + 50, centerY + 30);
      await page.waitForTimeout(50);
      await page.mouse.up();
      await page.waitForTimeout(300);

      // 验证尺寸变化
      const newBounds = await canvasComponent.boundingBox();
      expect(newBounds.width).toBeGreaterThan(initialBounds.width);
      expect(newBounds.height).toBeGreaterThan(initialBounds.height);

      // 验证属性面板更新
      const widthValue = await page.locator('#prop-width').inputValue();
      const heightValue = await page.locator('#prop-height').inputValue();
      expect(parseInt(widthValue)).toBe(Math.round(newBounds.width));
      expect(parseInt(heightValue)).toBe(Math.round(newBounds.height));
    }
  });

  test('清空画布功能', async ({ page }) => {
    // 先添加一个组件
    const firstComponent = page.locator('#components-list > *').first();
    const canvas = page.locator('#canvas');

    await firstComponent.dragTo(canvas, {
      sourcePosition: { x: 80, y: 12 },
      targetPosition: { x: 100, y: 100 }
    });
    await page.waitForTimeout(300);

    // 验证组件存在
    await expect(page.locator('.canvas-component')).toHaveCount(1);

    // 点击清空画布按钮
    await page.locator('#clear-canvas').click();
    await page.waitForTimeout(200);

    // 验证画布被清空
    await expect(page.locator('.canvas-component')).toHaveCount(0);
  });

  test('属性面板编辑功能', async ({ page }) => {
    // 拖拽组件到画布
    const firstComponent = page.locator('#components-list > *').first();
    const canvas = page.locator('#canvas');

    await firstComponent.dragTo(canvas, {
      sourcePosition: { x: 80, y: 12 },
      targetPosition: { x: 100, y: 100 }
    });
    await page.waitForTimeout(300);

    // 点击组件选中它
    const canvasComponent = page.locator('.canvas-component').first();
    await canvasComponent.click();
    await page.waitForTimeout(200);

    // 修改内容属性
    const contentInput = page.locator('#prop-content');
    await contentInput.clear();
    await contentInput.fill('新的按钮文本');
    await contentInput.press('Enter');
    await page.waitForTimeout(200);

    // 验证组件内容更新
    await expect(canvasComponent).toContainText('新的按钮文本');
  });

  test('拖拽多个组件', async ({ page }) => {
    // 重新加载页面确保画布干净
    await page.reload();
    await page.waitForTimeout(500);

    // 拖拽所有组件到画布
    const components = page.locator('#components-list > *');
    const canvas = page.locator('#canvas');

    for (let i = 0; i < 4; i++) {
      await components.nth(i).dragTo(canvas, {
        sourcePosition: { x: 80, y: 12 },
        targetPosition: { x: 100 + i * 120, y: 100 + i * 50 }
      });
      await page.waitForTimeout(200);
    }

    // 验证所有组件都被创建
    await expect(page.locator('.canvas-component')).toHaveCount(4);
  });
});
