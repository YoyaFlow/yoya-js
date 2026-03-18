/**
 * 检查所有 V2 组件页面的深色模式
 */

import { test, expect } from '@playwright/test';

// 要测试的页面列表
const pages = [
  'button.html',
  'form.html',
  'card.html',
  'menu.html',
  'router.html',
  'tabs.html',
  'pager.html',
  'message.html',
  'code.html',
  'detail.html',
  'field.html',
  'table.html',
  'echart.html',
  'body.html',
  'vtimer.html',
];

test.describe('V2 组件页面深色模式检查', () => {
  for (const page of pages) {
    test(`检查 ${page} 的硬编码颜色`, async ({ page: browserPage }) => {
      // 访问页面
      await browserPage.goto(`http://localhost:3004/v2/examples/${page}`, { waitUntil: 'domcontentloaded' });

      // 等待页面加载
      await browserPage.waitForTimeout(1000);

      // 切换到深色模式
      await browserPage.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'islands-dark');
      });

      // 等待主题应用
      await browserPage.waitForTimeout(500);

      // 检查是否有硬编码的浅色背景
      const problems = await browserPage.evaluate(() => {
        const problems = [];

        // 检查所有元素
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
          // 跳过不可见元素和元数据元素
          const tagName = el.tagName.toLowerCase();
          if (['html', 'head', 'script', 'meta', 'link', 'style', 'title', 'noscript'].includes(tagName)) {
            return;
          }

          const style = window.getComputedStyle(el);
          const bg = style.backgroundColor;
          const color = style.color;

          // 跳过透明度为 0 的元素
          if (style.opacity === '0' || style.display === 'none' || style.visibility === 'hidden') {
            return;
          }

          // 跳过 body 和没有类名的 div（可能是框架布局元素）
          if (tagName === 'body') {
            return;
          }
          if (tagName === 'div' && !el.className) {
            return;
          }

          const bgRgb = bg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
          const colorRgb = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

          if (bgRgb) {
            const bgR = parseInt(bgRgb[1]);
            const bgG = parseInt(bgRgb[2]);
            const bgB = parseInt(bgRgb[3]);
            const bgBrightness = (bgR + bgG + bgB) / 3;

            // 深色模式下背景太亮（> 200）可能是问题
            if (bgBrightness > 200) {
              const className = el.className || '';
              const text = el.textContent?.trim().substring(0, 30) || '';

              // 跳过白色背景的特殊元素（如代码块、卡片等可能有特殊设计）
              if (!className.includes('code') && !className.includes('toast')) {
                problems.push({
                  tag: tagName,
                  class: className,
                  text: text,
                  bgBrightness: bgBrightness,
                  bg: bg
                });
              }
            }
          }

          if (colorRgb) {
            const colorR = parseInt(colorRgb[1]);
            const colorG = parseInt(colorRgb[2]);
            const colorB = parseInt(colorRgb[3]);
            const colorBrightness = (colorR + colorG + colorB) / 3;

            // 深色模式下文字太暗（< 100）可能是问题
            if (colorBrightness < 100) {
              const className = el.className || '';
              const text = el.textContent?.trim().substring(0, 30) || '';

              // 跳过 native input 元素（checkbox/radio 的 color 属性不影响显示）
              if (tagName === 'input') {
                return;
              }

              problems.push({
                tag: tagName,
                class: className,
                text: text,
                colorBrightness: colorBrightness,
                color: color
              });
            }
          }
        });

        return problems.slice(0, 20); // 只返回前 20 个问题
      });

      // 输出结果
      console.log(`${page} 问题数:`, problems.length);
      if (problems.length > 0) {
        console.log('前几个问题:', JSON.stringify(problems.slice(0, 5), null, 2));
      }

      // 断言：不应该有太多问题（允许最多 5 个问题）
      expect(problems.length).toBeLessThanOrEqual(5);
    });
  }
});
