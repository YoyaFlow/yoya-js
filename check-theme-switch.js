import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ 
    executablePath: '/usr/bin/chromium',
    headless: true 
  });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3002/v2/examples/index.html');
  await page.waitForTimeout(2000);
  
  // 获取初始背景色
  const lightBg = await page.evaluate(() => 
    getComputedStyle(document.documentElement).getPropertyValue('--yoya-bg').trim()
  );
  console.log('初始背景色:', lightBg);
  
  // 查找主题切换按钮
  const themeBtns = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, [role="button"]'));
    return btns.map(b => b.innerText.trim()).filter(t => t.includes('浅色') || t.includes('深色') || t.includes('主题'));
  });
  console.log('找到的主题按钮:', themeBtns);
  
  // 尝试点击深色主题按钮（如果有）
  const darkBtn = page.getByText('深色').first();
  const isDarkBtnVisible = await darkBtn.isVisible().catch(() => false);
  console.log('深色按钮可见:', isDarkBtnVisible);
  
  if (isDarkBtnVisible) {
    await darkBtn.click();
    await page.waitForTimeout(500);
    
    const darkBg = await page.evaluate(() => 
      getComputedStyle(document.documentElement).getPropertyValue('--yoya-bg').trim()
    );
    console.log('切换后背景色:', darkBg);
  }
  
  // 截图
  await page.screenshot({ path: 'test-results/v2-theme-demo.png', fullPage: true });
  console.log('截图已保存到 test-results/v2-theme-demo.png');
  
  await browser.close();
})();
