import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ 
    executablePath: '/usr/bin/chromium',
    headless: true 
  });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3002/v2/examples/index.html');
  await page.waitForTimeout(2000);
  
  // 获取当前 mode
  const currentMode = await page.evaluate(() => {
    return window.getThemeMode ? window.getThemeMode() : 'unknown';
  });
  console.log('当前 mode:', currentMode);
  
  // 尝试切换深色
  await page.evaluate(() => {
    if (window.setThemeMode && window.switchTheme) {
      window.setThemeMode('dark');
      window.switchTheme('islands');
    }
  });
  await page.waitForTimeout(500);
  
  // 获取切换后的背景色
  const darkBg = await page.evaluate(() => 
    getComputedStyle(document.documentElement).getPropertyValue('--yoya-bg').trim()
  );
  console.log('切换深色后背景色:', darkBg);
  
  // 尝试切换浅色
  await page.evaluate(() => {
    if (window.setThemeMode && window.switchTheme) {
      window.setThemeMode('light');
      window.switchTheme('islands');
    }
  });
  await page.waitForTimeout(500);
  
  const lightBg = await page.evaluate(() => 
    getComputedStyle(document.documentElement).getPropertyValue('--yoya-bg').trim()
  );
  console.log('切换浅色后背景色:', lightBg);
  
  // 检查全局函数
  const globalFns = await page.evaluate(() => {
    return {
      hasInitTheme: typeof window.initTheme !== 'undefined',
      hasSwitchTheme: typeof window.switchTheme !== 'undefined',
      hasSetThemeMode: typeof window.setThemeMode !== 'undefined',
      hasGetThemeMode: typeof window.getThemeMode !== 'undefined',
    };
  });
  console.log('\n全局函数:', globalFns);
  
  await browser.close();
})();
