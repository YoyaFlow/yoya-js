import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ 
    executablePath: '/usr/bin/chromium',
    headless: true 
  });
  const page = await browser.newPage();
  
  // 监听控制台消息
  page.on('console', msg => {
    console.log(`[${msg.type()}] ${msg.text().substring(0, 200)}`);
  });
  
  // 监听页面错误
  page.on('pageerror', err => {
    console.log(`[PAGE ERROR] ${err.message.substring(0, 200)}`);
  });
  
  try {
    await page.goto('http://localhost:3002/v2/examples/index.html');
    await page.waitForTimeout(3000);
    
    // 检查是否调用了 initTheme
    const hasInitTheme = await page.evaluate(() => {
      return typeof window.initTheme !== 'undefined';
    });
    console.log('initTheme 函数存在:', hasInitTheme);
    
    // 检查主题状态
    const themeStatus = await page.evaluate(() => {
      return {
        hasYoyaVars: Array.from(document.documentElement.style)
          .filter(p => p.startsWith('--yoya-')).length > 0,
        appHasContent: document.getElementById('app')?.innerHTML?.length > 0
      };
    });
    console.log('主题状态:', themeStatus);
    
    // 获取一些 CSS 变量值
    const bg = await page.evaluate(() => 
      getComputedStyle(document.documentElement).getPropertyValue('--yoya-bg').trim()
    );
    const primary = await page.evaluate(() => 
      getComputedStyle(document.documentElement).getPropertyValue('--yoya-primary').trim()
    );
    console.log('\nCSS 变量值:');
    console.log('--yoya-bg:', bg || '(空)');
    console.log('--yoya-primary:', primary || '(空)');
    
    // 获取页面上的文本内容
    const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 1000));
    console.log('\n页面文本前 1000 字符:');
    console.log(bodyText);
    
  } catch (err) {
    console.log('错误:', err.message);
  }
  
  await browser.close();
})();
