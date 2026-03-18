/**
 * 检查 ApiTable 和其他组件的深色模式字体颜色
 */

import { test, expect } from '@playwright/test';

test.describe('深色模式字体颜色检查', () => {
  test('检查 ApiTable 表格头部颜色', async ({ page }) => {
    // 访问 dynamic-loader 页面
    await page.goto('http://localhost:3004/v2/examples/dynamic-loader.html', { waitUntil: 'domcontentloaded' });

    // 等待页面加载
    await page.waitForTimeout(1000);

    // 切换到深色模式
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'islands-dark');
    });

    // 等待主题应用
    await page.waitForTimeout(500);

    // 检查所有 th 元素的颜色
    const thProblems = await page.evaluate(() => {
      const problems = [];
      const thElements = document.querySelectorAll('th');
      thElements.forEach(th => {
        const style = window.getComputedStyle(th);
        const color = style.color;
        const bg = style.backgroundColor;

        // 在深色模式下，文字颜色应该是浅色（rgb 值较高），背景应该是深色
        const rgb = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        const bgRgb = bg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

        if (rgb && bgRgb) {
          const r = parseInt(rgb[1]);
          const g = parseInt(rgb[2]);
          const b = parseInt(rgb[3]);
          const bgR = parseInt(bgRgb[1]);
          const bgG = parseInt(bgRgb[2]);
          const bgB = parseInt(bgRgb[3]);

          // 深色模式下文字应该是浅色（平均值 > 150），背景应该是深色（平均值 < 100）
          const textBrightness = (r + g + b) / 3;
          const bgBrightness = (bgR + bgG + bgB) / 3;

          // 如果文字太暗（< 150）或背景太亮（> 100），记录问题
          if (textBrightness < 150 || bgBrightness > 100) {
            problems.push({
              text: th.textContent.trim(),
              color: color,
              backgroundColor: bg,
              textBrightness,
              bgBrightness
            });
          }
        }
      });
      return problems;
    });

    // 检查 sidebar 菜单项颜色（只输出信息，不作为断言）
    const sidebarInfo = await page.evaluate(() => {
      const sidebarItems = document.querySelectorAll('.yoya-menu-item');
      const results = [];
      for (const item of sidebarItems) {
        const style = window.getComputedStyle(item);
        const color = style.color;
        const rgb = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (rgb) {
          const brightness = (parseInt(rgb[1]) + parseInt(rgb[2]) + parseInt(rgb[3])) / 3;
          results.push({
            text: item.textContent.trim().substring(0, 20),
            color: color,
            brightness: brightness
          });
        }
      }
      return results;
    });

    // 输出结果
    console.log('表格头部问题:', thProblems);
    console.log('Sidebar 菜单项颜色:', sidebarInfo);

    // 断言：表格头部不应该有问题
    expect(thProblems.length).toBe(0);
  });
});
