import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ 
    executablePath: '/usr/bin/chromium',
    headless: true 
  });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3002/v2/examples/index.html');
  await page.waitForTimeout(2000);
  
  // 查找所有包含"主题"或"Theme"的按钮
  const themeButtons = await page.evaluate(() => {
    const allElements = Array.from(document.querySelectorAll('*'));
    return allElements
      .filter(el => el.innerText.includes('浅色') || el.innerText.includes('深色') || el.innerText.includes('自动'))
      .map(el => ({
        tag: el.tagName,
        text: el.innerText.trim().substring(0, 50),
        class: el.className,
        id: el.id
      }));
  });
  
  console.log('找到相关按钮:');
  themeButtons.forEach(btn => console.log(' -', btn));
  
  // 检查导航栏区域
  const navText = await page.evaluate(() => {
    const nav = document.querySelector('nav') || document.querySelector('[role="navigation"]');
    return nav ? nav.innerText.substring(0, 500) : 'no nav found';
  });
  console.log('\n导航栏文本:', navText);
  
  await browser.close();
})();
