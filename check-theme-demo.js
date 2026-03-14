import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ 
    executablePath: '/usr/bin/chromium',
    headless: true 
  });
  const page = await browser.newPage();
  
  // 监听控制台消息
  page.on('console', msg => {
    console.log(`[${msg.type()}] ${msg.text().substring(0, 100)}`);
  });
  
  // 监听页面错误
  page.on('pageerror', err => {
    console.log(`[PAGE ERROR] ${err.message}`);
  });
  
  try {
    await page.goto('http://localhost:3002/v2/examples/index.html');
    await page.waitForTimeout(2000);
    
    // 获取页面标题
    const title = await page.title();
    console.log('\n页面标题:', title);
    
    // 获取页面内容长度
    const content = await page.content();
    console.log('页面内容长度:', content.length);
    
    // 检查 CSS 变量
    const yoyaVars = await page.evaluate(() => {
      const styles = getComputedStyle(document.documentElement);
      const vars = [];
      for (let i = 0; i < styles.length; i++) {
        if (styles[i].startsWith('--yoya-')) {
          vars.push(styles[i]);
        }
      }
      return vars;
    });
    console.log(`找到 ${yoyaVars.length} 个 --yoya-* CSS 变量`);
    if (yoyaVars.length > 0) {
      console.log('CSS 变量示例:', yoyaVars.slice(0, 10).join(', '));
    }
    
    // 获取 #app 内容
    const appHtml = await page.$eval('#app', el => el.innerHTML).catch(() => 'empty');
    console.log('\n#app HTML 长度:', appHtml.length);
    
    // 截图
    await page.screenshot({ path: 'test-results/theme-demo-check.png', fullPage: true });
    console.log('截图已保存');
    
  } catch (err) {
    console.log('错误:', err.message);
  }
  
  await browser.close();
})();
