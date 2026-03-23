const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: false
  });
  const page = await browser.newPage();

  console.log('=== 测试 Input 事件绑定流程 ===\n');

  // 先访问页面
  await page.goto('http://localhost:3001/v2/examples/interaction.html', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  await new Promise(r => setTimeout(r, 2000));

  // 在页面中检查 input 元素的事件绑定状态
  const result = await page.evaluate(() => {
    const logs = [];

    // 获取第一个复选框
    const checkbox = document.querySelectorAll('.yoya-tree input[type="checkbox"]')[1];
    if (!checkbox) {
      logs.push('Checkbox not found');
      return { logs };
    }

    logs.push(`Found checkbox with data-node-key: ${checkbox.getAttribute('data-node-key') || 'none'}`);
    logs.push(`Initial checked: ${checkbox.checked}`);

    // 检查是否有 _events 或类似属性（Yoya 的虚拟元素）
    // 由于 checkbox 是原生 DOM 元素，我们需要找到它的 Yoya 实例
    logs.push(`Checkbox className: ${checkbox.className}`);
    logs.push(`Checkbox parent: ${checkbox.parentElement?.className || 'none'}`);

    // 直接添加事件监听器测试
    let changeFired = false;
    checkbox.addEventListener('change', () => {
      changeFired = true;
      logs.push('[Native] change event fired!');
    });

    // 触发 click
    checkbox.click();
    logs.push(`After click: checked=${checkbox.checked}, changeFired=${changeFired}`);

    // 手动触发 change 事件
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    logs.push(`After dispatch change: changeFired=${changeFired}`);

    return { logs };
  });

  console.log('结果:', JSON.stringify(result, null, 2));

  console.log('\n=== 测试完成 ===');
  await browser.close();
})();
