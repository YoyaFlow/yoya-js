const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: true
  });

  const page = await browser.newPage();

  await page.goto('http://localhost:3001/v2/examples/index.html', {
    waitUntil: 'networkidle'
  });

  // 测试 routes.js 的 Interaction loader
  const result = await page.evaluate(async () => {
    const routes = await import('http://localhost:3001/v2/examples/config/routes.js');

    // 获取 Interaction loader
    const pageLoader = await routes.getPageComponent('interaction.html');
    console.log('pageLoader type:', typeof pageLoader);

    // 调用 loader
    const module = await pageLoader();
    console.log('module keys:', Object.keys(module));
    console.log('createInteractionPage:', typeof module.createInteractionPage);

    // 直接测试 routes.Interaction
    const directLoader = routes.routes['Interaction'];
    const directModule = await directLoader();
    console.log('direct module keys:', Object.keys(directModule));

    return {
      pageLoaderType: typeof pageLoader,
      moduleKeys: Object.keys(module),
      createInteractionPageType: typeof module.createInteractionPage,
      directModuleKeys: Object.keys(directModule)
    };
  });

  console.log(JSON.stringify(result, null, 2));

  await browser.close();
  console.log('=== 测试完成 ===');
})();
