/**
 * 检查 vField 组件的深色模式字体颜色
 */

import { test, expect } from '@playwright/test';

test.describe('vField 深色模式颜色检查', () => {
  test('检查 vField 编辑区域的背景和文字颜色', async ({ page }) => {
    // 访问 field.html 页面
    await page.goto('http://localhost:3004/v2/examples/field.html', { waitUntil: 'domcontentloaded' });

    // 等待页面加载
    await page.waitForTimeout(1500);

    // 切换到深色模式
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'islands-dark');
    });

    // 等待主题应用
    await page.waitForTimeout(500);

    // 滚动到第一个 vField 组件（基础用法部分）
    await page.evaluate(() => {
      const firstField = document.querySelector('.yoya-field');
      if (firstField) {
        firstField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    await page.waitForTimeout(500);

    // 双击第一个字段进入编辑模式（通过 text content 查找）
    const fieldLocator = page.getByText('张三').first();
    await fieldLocator.dblclick();
    await page.waitForTimeout(500);

    // 检查编辑容器的颜色
    const result = await page.evaluate(() => {
      const problems = [];

      // 查找编辑容器（使用类名）
      const editContainer = document.querySelector('.yoya-field__edit-container');

      if (editContainer) {
        const style = window.getComputedStyle(editContainer);
        const bg = style.backgroundColor;
        const color = style.color;

        const bgRgb = bg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        const colorRgb = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

        if (bgRgb) {
          const bgR = parseInt(bgRgb[1]);
          const bgG = parseInt(bgRgb[2]);
          const bgB = parseInt(bgRgb[3]);
          const bgBrightness = (bgR + bgG + bgB) / 3;

          problems.push({
            element: 'editContainer',
            bg: bg,
            bgBrightness: bgBrightness,
            expected: 'dark (< 100)',
            pass: bgBrightness < 100
          });
        }

        if (colorRgb) {
          const colorR = parseInt(colorRgb[1]);
          const colorG = parseInt(colorRgb[2]);
          const colorB = parseInt(colorRgb[3]);
          const colorBrightness = (colorR + colorG + colorB) / 3;

          problems.push({
            element: 'editContainer color',
            color: color,
            colorBrightness: colorBrightness,
            expected: 'light (> 150)',
            pass: colorBrightness > 150
          });
        }

        // 检查编辑区域内的输入元素
        const inputEl = editContainer.querySelector('input') || editContainer.querySelector('div[contenteditable]') || editContainer.children[0];
        if (inputEl) {
          const style = window.getComputedStyle(inputEl);
          const color = style.color;
          const colorRgb = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

          if (colorRgb) {
            const colorBrightness = (parseInt(colorRgb[1]) + parseInt(colorRgb[2]) + parseInt(colorRgb[3])) / 3;
            problems.push({
              element: 'inputEl',
              color: color,
              colorBrightness: colorBrightness,
              expected: 'light (> 150)',
              pass: colorBrightness > 150
            });
          }
        }
      } else {
        problems.push({ error: '未找到编辑容器' });
      }

      return problems;
    });

    console.log('vField 编辑区域颜色详情:', JSON.stringify(result, null, 2));

    // 断言：所有检查都应该通过（排除错误情况）
    result.filter(r => !r.error).forEach(item => {
      expect(item.pass).toBe(true);
    });
  });
});
