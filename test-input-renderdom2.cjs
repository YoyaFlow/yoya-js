const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: false
  });
  const page = await browser.newPage();

  console.log('=== 测试 Input 元素创建和 renderDom ===\n');

  // 先访问一个简单页面
  await page.goto('http://localhost:3001/v2/examples/interaction.html', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  await new Promise(r => setTimeout(r, 2000));

  // 测试 input 元素的创建
  const result = await page.evaluate(() => {
    const logs = [];

    // 创建一个 input 元素
    const input = document.createElement('input');
    input.type = 'checkbox';

    logs.push(`Created input element: ${input.tagName}`);
    logs.push(`isConnected: ${input.isConnected}`);
    logs.push(`hasChildNodes: ${input.hasChildNodes()}`);

    // 检查 input 是否有 children
    logs.push(`children.length: ${input.children?.length || 0}`);

    return { logs };
  });

  console.log('结果:', JSON.stringify(result, null, 2));

  // 在页面中查找 Yoya 创建的 input
  const yoyaInput = await page.evaluate(() => {
    const checkbox = document.querySelectorAll('.yoya-tree input[type="checkbox"]')[1];
    if (!checkbox) return { error: 'Not found' };

    const parent = checkbox.parentElement;
    return {
      checkboxOuterHTML: checkbox.outerHTML,
      parentTagName: parent.tagName,
      parentHasChildNodes: parent.hasChildNodes(),
      parentChildrenCount: parent.children.length,
    };
  });

  console.log('\nYoya Input:', JSON.stringify(yoyaInput, null, 2));

  console.log('\n=== 测试完成 ===');
  await browser.close();
})();
