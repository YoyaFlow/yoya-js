const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: false
  });
  const page = await browser.newPage();

  console.log('=== 测试原生 checkbox 行为 ===\n');

  // 创建一个简单的测试页面
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body>
      <input type="checkbox" id="test1" checked>
      <input type="checkbox" id="test2" checked class="yoya-tree">
      <script>
        window.nativeLogs = [];
        document.getElementById('test1').addEventListener('change', (e) => {
          window.nativeLogs.push('[test1] change: ' + e.target.checked);
        });
        document.getElementById('test2').addEventListener('change', (e) => {
          window.nativeLogs.push('[test2] change: ' + e.target.checked);
        });
      </script>
    </body>
    </html>
  `);

  await new Promise(r => setTimeout(r, 500));

  // 测试原生 checkbox
  const result1 = await page.evaluate(() => {
    const logs = [];
    const checkbox = document.getElementById('test1');
    logs.push(`test1 initial: ${checkbox.checked}`);
    checkbox.click();
    logs.push(`test1 after click: ${checkbox.checked}`);
    return { logs, nativeLogs: [...window.nativeLogs] };
  });

  console.log('原生 checkbox 测试结果:', JSON.stringify(result1, null, 2));

  // 重置日志
  await page.evaluate(() => { window.nativeLogs = []; });

  // 测试类名为 yoya-tree 的 checkbox
  const result2 = await page.evaluate(() => {
    const logs = [];
    const checkbox = document.getElementById('test2');
    logs.push(`test2 initial: ${checkbox.checked}`);
    checkbox.click();
    logs.push(`test2 after click: ${checkbox.checked}`);
    return { logs, nativeLogs: [...window.nativeLogs] };
  });

  console.log('\nyoya-tree checkbox 测试结果:', JSON.stringify(result2, null, 2));

  console.log('\n=== 测试完成 ===');
  await browser.close();
})();
