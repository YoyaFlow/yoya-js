const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: true
  });
  const page = await browser.newPage();

  console.log('正在访问 interaction.html...');
  await page.goto('http://localhost:3001/v2/examples/interaction.html', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  await new Promise(r => setTimeout(r, 3000));

  // 检查 change 事件是否被绑定
  console.log('\n=== 检查复选框事件绑定 ===');
  const checkboxInfo = await page.$$eval('.yoya-tree input[type="checkbox"]', els =>
    els.map((el, i) => ({
      index: i,
      checked: el.checked,
      label: el.parentElement.querySelector('.yoya-tree__label')?.textContent?.trim(),
      hasOnchange: typeof el.onchange === 'function'
    }))
  );
  console.log('复选框信息:', JSON.stringify(checkboxInfo, null, 2));

  // 使用 JavaScript 直接触发 change 事件
  console.log('\n=== 触发 change 事件 ===');
  await page.$$eval('.yoya-tree input[type="checkbox"]', (els, index) => {
    const checkbox = els[index];
    console.log('点击前 checked:', checkbox.checked);
    checkbox.checked = !checkbox.checked;
    const event = new Event('change', { bubbles: true });
    checkbox.dispatchEvent(event);
    console.log('触发 change 后 checked:', checkbox.checked);
  }, 1);  // 节点 1-1

  await new Promise(r => setTimeout(r, 1000));

  const afterChange = await page.$$eval('.yoya-tree input[type="checkbox"]', els =>
    els.map((el, i) => ({
      index: i,
      checked: el.checked,
      label: el.parentElement.querySelector('.yoya-tree__label')?.textContent?.trim()
    }))
  );
  console.log('触发 change 后状态:', JSON.stringify(afterChange, null, 2));

  await browser.close();
  console.log('=== 测试完成 ===');
})();

