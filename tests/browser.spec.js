/**
 * Yoya.Basic Playwright 浏览器测试
 * 在真实 Chromium 浏览器环境中测试
 */

import { test, expect } from '@playwright/test';

test.describe('Yoya.Basic 浏览器测试', () => {

  test.beforeEach(async ({ page }) => {
    // 设置页面内容
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <script type="module">
            import { div, button, input } from './src/yoya/index.js';
            window.YoyaTest = { div, button, input };
          </script>
        </head>
        <body>
          <div id="app"></div>
        </body>
      </html>
    `, { waitUntil: 'networkidle' });
  });

  test('创建 div 元素', async ({ page }) => {
    // 在浏览器中执行代码
    const result = await page.evaluate(() => {
      const { div } = window.YoyaTest;
      const el = div(box => {
        box.id('test-div');
        box.className('container');
        box.text('Hello World');
      });
      el.bindTo('#app');
      return {
        id: el._boundElement.id,
        className: el._boundElement.className,
        textContent: el._boundElement.textContent
      };
    });

    expect(result.id).toBe('test-div');
    expect(result.className).toBe('container');
    expect(result.textContent).toBe('Hello World');
  });

  test('按钮点击事件', async ({ page }) => {
    await page.evaluate(() => {
      const { button } = window.YoyaTest;
      window.clickCount = 0;
      const btn = button(box => {
        box.text('点击我');
        box.onClick(() => { window.clickCount++; });
      });
      btn.bindTo('#app');
    });

    // 点击按钮
    await page.click('button');
    await page.click('button');

    const clickCount = await page.evaluate(() => window.clickCount);
    expect(clickCount).toBe(2);
  });

  test('输入框值', async ({ page }) => {
    await page.evaluate(() => {
      const { input } = window.YoyaTest;
      const inp = input(box => {
        box.type('text');
        box.placeholder('请输入...');
      });
      inp.bindTo('#app');
    });

    // 填充输入框
    await page.fill('input', '测试内容');

    const inputValue = await page.inputValue('input');
    expect(inputValue).toBe('测试内容');
  });

  test('链式调用添加子元素', async ({ page }) => {
    await page.evaluate(() => {
      const { div } = window.YoyaTest;
      const parent = div();
      parent
        .div('子元素 1')
        .span('子元素 2')
        .p('子元素 3');
      parent.bindTo('#app');
    });

    const children = await page.locator('#app').locator('> *');
    await expect(children).toHaveCount(3);
  });

  test('样式应用', async ({ page }) => {
    await page.evaluate(() => {
      const { div } = window.YoyaTest;
      const el = div(box => {
        box.style('color', 'red');
        box.style('font-size', '20px');
        box.styles({ 'background': 'blue', 'padding': '10px' });
      });
      el.bindTo('#app');
    });

    const element = page.locator('#app div');
    const color = await element.evaluate(el =>
      window.getComputedStyle(el).color
    );
    expect(color).toBe('rgb(255, 0, 0)');

    const fontSize = await element.evaluate(el =>
      window.getComputedStyle(el).fontSize
    );
    expect(fontSize).toBe('20px');

    const background = await element.evaluate(el =>
      window.getComputedStyle(el).backgroundColor
    );
    expect(background).toBe('rgb(0, 0, 255)');
  });
});
