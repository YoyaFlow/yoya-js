const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: false
  });
  const page = await browser.newPage();

  console.log('正在访问 interaction.html...');
  await page.goto('http://localhost:3001/v2/examples/interaction.html', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  await new Promise(r => setTimeout(r, 3000));

  // 在浏览器中测试 VTree 容器的事件绑定
  const result = await page.evaluate(() => {
    const logs = [];

    // 检查 VTree 容器
    const trees = document.querySelectorAll('.yoya-tree');
    logs.push(`Found ${trees.length} VTree containers`);

    trees.forEach((tree, i) => {
      // 检查是否有 Yoya 绑定的事件
      logs.push(`Tree ${i}: _events? ${!!tree._events}, onchange? ${tree.onchange}`);

      // 手动添加事件监听器
      tree.addEventListener('change', (e) => {
        if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
          logs.push(`[Tree ${i}] change event, nodeKey: ${e.target.getAttribute('data-node-key')}, checked: ${e.target.checked}`);
        }
      }, true); // 捕获阶段
    });

    // 获取第一个复选框（索引 1，节点 1-1）
    const checkbox = document.querySelectorAll('.yoya-tree input[type="checkbox"]')[1];
    if (!checkbox) {
      return { logs: [...logs, 'Checkbox not found'], error: true };
    }

    logs.push(`Initial checked: ${checkbox.checked}`);

    // 手动触发 click 事件
    checkbox.click();
    logs.push(`After click checked: ${checkbox.checked}`);

    return { logs, error: false };
  });

  console.log('结果:', JSON.stringify(result, null, 2));

  console.log('\n=== 测试完成 ===');
  await browser.close();
})();
