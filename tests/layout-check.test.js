/**
 * 页面布局检查测试
 * 使用 Playwright 检查 home.html 页面的布局问题
 */

import { test, expect } from '@playwright/test';

test.describe('Home 页面布局检查', () => {
  test('检查页面整体布局结构', async ({ page }) => {
    // 访问页面
    await page.goto('http://localhost:3001/v2/examples/home.html#/home', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // 等待页面加载完成
    await page.waitForTimeout(2000);

    // 截图保存完整页面
    await page.screenshot({ 
      path: 'tests/screenshots/layout-full-page.png',
      fullPage: true 
    });

    // 获取页面标题
    const title = await page.title();
    console.log('页面标题:', title);

    // 检查 #app 容器是否存在
    const appContainer = page.locator('#app');
    await expect(appContainer).toBeVisible();

    // 获取 #app 容器的边界框
    const appBox = await appContainer.boundingBox();
    console.log('#app 容器尺寸:', appBox);

    // 检查 #app 容器是否占满视口
    const viewport = page.viewportSize();
    console.log('视口尺寸:', viewport);

    if (appBox) {
      const heightDiff = viewport.height - appBox.height;
      if (heightDiff > 10) {
        console.log(`⚠️  问题：#app 容器高度未占满视口，相差 ${heightDiff}px`);
      }
    }
  });

  test('检查顶部导航栏布局', async ({ page }) => {
    await page.goto('http://localhost:3001/v2/examples/home.html#/home', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    await page.waitForTimeout(2000);

    // 查找顶部导航栏
    const navbar = page.locator('.yoya-navbar');
    await expect(navbar).toBeVisible();

    // 获取导航栏尺寸
    const navbarBox = await navbar.boundingBox();
    console.log('顶部导航栏尺寸:', navbarBox);

    // 检查导航栏高度
    if (navbarBox) {
      console.log(`导航栏高度：${navbarBox.height}px`);
      if (navbarBox.height < 40 || navbarBox.height > 80) {
        console.log(`⚠️  问题：导航栏高度异常 (${navbarBox.height}px)`);
      }

      // 检查导航栏宽度是否占满
      const viewport = page.viewportSize();
      const widthDiff = viewport.width - navbarBox.width;
      if (widthDiff > 10) {
        console.log(`⚠️  问题：导航栏宽度未占满视口，相差 ${widthDiff}px`);
      }
    }

    // 检查导航栏内元素对齐
    const navbarLogo = page.locator('.yoya-navbar__logo');
    const navbarMenu = page.locator('.yoya-navbar__menu');
    const navbarRight = page.locator('.yoya-navbar__right');

    const logoVisible = await navbarLogo.isVisible();
    const menuVisible = await navbarMenu.isVisible();
    const rightVisible = await navbarRight.isVisible();

    console.log('导航栏元素可见性:', {
      logo: logoVisible,
      menu: menuVisible,
      right: rightVisible
    });

    // 截图导航栏区域
    await navbar.screenshot({ path: 'tests/screenshots/layout-navbar.png' });
  });

  test('检查左侧 Sidebar 布局', async ({ page }) => {
    await page.goto('http://localhost:3001/v2/examples/home.html#/home', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    await page.waitForTimeout(2000);

    // 查找 Sidebar
    const sidebar = page.locator('.yoya-sidebar');
    await expect(sidebar).toBeVisible();

    // 获取 Sidebar 尺寸
    const sidebarBox = await sidebar.boundingBox();
    console.log('Sidebar 尺寸:', sidebarBox);

    if (sidebarBox) {
      console.log(`Sidebar 宽度：${sidebarBox.width}px`);
      console.log(`Sidebar 高度：${sidebarBox.height}px`);

      // 检查宽度是否在合理范围
      if (sidebarBox.width < 150) {
        console.log(`⚠️  问题：Sidebar 过窄 (${sidebarBox.width}px)`);
      }
      if (sidebarBox.width > 300) {
        console.log(`⚠️  问题：Sidebar 过宽 (${sidebarBox.width}px)`);
      }
    }

    // 检查 Sidebar 是否占满高度
    const viewport = page.viewportSize();
    if (sidebarBox && viewport) {
      const heightDiff = viewport.height - sidebarBox.height;
      if (heightDiff > 20) {
        console.log(`⚠️  问题：Sidebar 高度未占满视口，相差 ${heightDiff}px`);
      }
    }

    // 检查菜单项
    const menuItems = page.locator('.yoya-sidebar .yoya-menu-item');
    const itemCount = await menuItems.count();
    console.log(`菜单项数量：${itemCount}`);

    // 检查是否有激活状态的菜单项
    const activeItem = page.locator('.yoya-sidebar .yoya-menu-item--active');
    const activeCount = await activeItem.count();
    console.log(`激活菜单项数量：${activeCount}`);

    // 截图 Sidebar 区域
    await sidebar.screenshot({ path: 'tests/screenshots/layout-sidebar.png' });
  });

  test('检查中间内容区域布局', async ({ page }) => {
    await page.goto('http://localhost:3001/v2/examples/home.html#/home', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    await page.waitForTimeout(2000);

    // 查找 VRouterViews 容器
    const routerViews = page.locator('.yoya-router-views');
    const routerViewsVisible = await routerViews.isVisible();
    console.log('VRouterViews 容器可见:', routerViewsVisible);

    if (routerViewsVisible) {
      const routerViewsBox = await routerViews.boundingBox();
      console.log('VRouterViews 尺寸:', routerViewsBox);

      // 截图 VRouterViews 区域
      await routerViews.screenshot({ path: 'tests/screenshots/layout-router-views.png' });
    }

    // 查找视图标签栏
    const tabBar = page.locator('.yoya-router-views__header');
    const tabBarVisible = await tabBar.isVisible();
    console.log('视图标签栏可见:', tabBarVisible);

    if (tabBarVisible) {
      const tabBarBox = await tabBar.boundingBox();
      console.log('视图标签栏尺寸:', tabBarBox);

      // 检查标签栏高度
      if (tabBarBox && tabBarBox.height > 60) {
        console.log(`⚠️  问题：标签栏高度过大 (${tabBarBox.height}px)`);
      }
    }

    // 查找内容区域
    const contentContainer = page.locator('.yoya-router-views__content-container');
    const contentVisible = await contentContainer.isVisible();
    console.log('内容容器可见:', contentVisible);

    if (contentVisible) {
      const contentBox = await contentContainer.boundingBox();
      console.log('内容容器尺寸:', contentBox);

      // 检查内容区域是否有滚动条
      const hasVerticalScroll = await page.evaluate(() => {
        const el = document.querySelector('.yoya-router-views__content-container');
        if (!el) return false;
        return el.scrollHeight > el.clientHeight;
      });
      console.log('内容区域有垂直滚动条:', hasVerticalScroll);
    }

    // 查找实际内容区域 (AppShell 的 contentWrapper)
    // 尝试查找 flex 容器内的内容
    const contentArea = page.locator('[style*="flex"]:has(.yoya-router-views)');
    
    // 截图内容区域
    await page.screenshot({ 
      path: 'tests/screenshots/layout-content-area.png',
      clip: { x: 220, y: 56, width: 800, height: 600 } // 大致内容区域
    });
  });

  test('检查右侧 TOC 布局', async ({ page }) => {
    await page.goto('http://localhost:3001/v2/examples/home.html#/home', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    await page.waitForTimeout(2000);

    // 查找 TOC 容器 (如果有)
    const toc = page.locator('.toc-container, .yoya-toc, aside');
    const tocCount = await toc.count();
    console.log('TOC 容器数量:', tocCount);

    if (tocCount > 0) {
      const tocVisible = await toc.first().isVisible();
      console.log('TOC 可见:', tocVisible);

      if (tocVisible) {
        const tocBox = await toc.first().boundingBox();
        console.log('TOC 尺寸:', tocBox);

        // 截图 TOC 区域
        await toc.first().screenshot({ path: 'tests/screenshots/layout-toc.png' });

        // 检查 TOC 内容是否溢出
        const hasOverflow = await page.evaluate(() => {
          const el = document.querySelector('.toc-container, .yoya-toc, aside');
          if (!el) return false;
          return el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight;
        });
        console.log('TOC 内容溢出:', hasOverflow);

        if (hasOverflow) {
          console.log('⚠️  问题：TOC 内容溢出容器');
        }
      }
    } else {
      console.log('未找到 TOC 容器');
    }
  });

  test('检查响应式布局 - 小屏幕', async ({ page }) => {
    // 设置小屏幕尺寸
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE

    await page.goto('http://localhost:3001/v2/examples/home.html#/home', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    await page.waitForTimeout(2000);

    // 截图小屏幕布局
    await page.screenshot({ 
      path: 'tests/screenshots/layout-mobile-375px.png',
      fullPage: true 
    });

    // 检查元素是否溢出
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    console.log('小屏幕有水平滚动条:', hasHorizontalScroll);

    if (hasHorizontalScroll) {
      console.log('⚠️  问题：小屏幕下出现水平滚动条（响应式布局问题）');
    }

    // 检查 Sidebar 在小屏幕下的行为
    const sidebar = page.locator('.yoya-sidebar');
    const sidebarVisible = await sidebar.isVisible();
    console.log('小屏幕下 Sidebar 可见:', sidebarVisible);
  });

  test('检查元素间距和对齐', async ({ page }) => {
    await page.goto('http://localhost:3001/v2/examples/home.html#/home', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    await page.waitForTimeout(2000);

    // 获取主要布局元素的计算样式
    const layoutStyles = await page.evaluate(() => {
      const styles = {};
      
      const selectors = [
        '#app',
        '.yoya-navbar',
        '.yoya-sidebar',
        '.yoya-router-views',
        '.yoya-router-views__content-container'
      ];

      selectors.forEach(selector => {
        const el = document.querySelector(selector);
        if (el) {
          const computed = window.getComputedStyle(el);
          styles[selector] = {
            display: computed.display,
            width: computed.width,
            height: computed.height,
            padding: computed.padding,
            margin: computed.margin,
            gap: computed.gap,
            overflow: computed.overflow,
            maxWidth: computed.maxWidth,
            justifyContent: computed.justifyContent,
            alignItems: computed.alignItems
          };
        } else {
          styles[selector] = null;
        }
      });

      return styles;
    });

    console.log('布局元素计算样式:');
    console.log(JSON.stringify(layoutStyles, null, 2));

    // 检查潜在问题
    const appStyle = layoutStyles['#app'];
    if (appStyle) {
      if (appStyle.display !== 'flex' && appStyle.display !== 'block') {
        console.log('⚠️  问题：#app 的 display 属性可能不当');
      }
    }

    const sidebarStyle = layoutStyles['.yoya-sidebar'];
    if (sidebarStyle) {
      if (sidebarStyle.overflow === 'visible') {
        console.log('⚠️  问题：Sidebar overflow 为 visible，可能导致内容溢出');
      }
    }

    const contentStyle = layoutStyles['.yoya-router-views__content-container'];
    if (contentStyle) {
      if (contentStyle.maxWidth && parseInt(contentStyle.maxWidth) < 800) {
        console.log(`⚠️  问题：内容区域 maxWidth 过小 (${contentStyle.maxWidth})`);
      }
    }
  });

  test('检查内容溢出问题', async ({ page }) => {
    await page.goto('http://localhost:3001/v2/examples/home.html#/home', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    await page.waitForTimeout(2000);

    // 检查整个页面是否有水平溢出
    const horizontalOverflow = await page.evaluate(() => {
      const html = document.documentElement;
      const body = document.body;
      return {
        htmlScrollWidth: html.scrollWidth,
        htmlClientWidth: html.clientWidth,
        bodyScrollWidth: body.scrollWidth,
        bodyClientWidth: body.clientWidth,
        hasOverflow: html.scrollWidth > html.clientWidth || body.scrollWidth > body.clientWidth
      };
    });

    console.log('页面水平溢出检查:', horizontalOverflow);

    if (horizontalOverflow.hasOverflow) {
      console.log('⚠️  问题：页面存在水平溢出');
    }

    // 检查各个滚动容器
    const scrollContainers = await page.evaluate(() => {
      const selectors = [
        '.yoya-sidebar__content',
        '.yoya-router-views__content-container',
        '.yoya-router-views__header'
      ];
      
      const results = [];
      selectors.forEach(selector => {
        const el = document.querySelector(selector);
        if (el) {
          results.push({
            selector,
            scrollWidth: el.scrollWidth,
            clientWidth: el.clientWidth,
            scrollHeight: el.scrollHeight,
            clientHeight: el.clientHeight,
            hasHorizontalScroll: el.scrollWidth > el.clientWidth,
            hasVerticalScroll: el.scrollHeight > el.clientHeight
          });
        }
      });
      return results;
    });

    console.log('滚动容器检查:', scrollContainers);

    scrollContainers.forEach(container => {
      if (container.hasHorizontalScroll) {
        console.log(`⚠️  问题：${container.selector} 存在水平滚动条`);
      }
    });
  });

  test('检查内容区域 maxWidth 限制问题', async ({ page }) => {
    await page.goto('http://localhost:3001/v2/examples/home.html#/home', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    await page.waitForTimeout(2000);

    // 检查内容区域的 maxWidth
    const maxWidthCheck = await page.evaluate(() => {
      const results = [];
      
      // 查找所有可能有限宽限制的容器
      const selectors = [
        '.yoya-router-views__content-container',
        '.yoya-router-views__content',
        '.yoya-router-views__content > *',
      ];

      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
          const computed = window.getComputedStyle(el);
          if (computed.maxWidth !== 'none' && computed.maxWidth !== '') {
            results.push({
              selector: `${selector}[${index}]`,
              maxWidth: computed.maxWidth,
              width: computed.width,
              paddingLeft: computed.paddingLeft,
              paddingRight: computed.paddingRight
            });
          }
        });
      });

      // 查找内联样式中有限宽的
      const allElements = document.querySelectorAll('*');
      allElements.forEach((el, index) => {
        const style = el.getAttribute('style');
        if (style && style.includes('max-width')) {
          const computed = window.getComputedStyle(el);
          results.push({
            selector: el.tagName.toLowerCase() + (el.className ? '.' + el.className.split(' ').join('.') : ''),
            maxWidth: computed.maxWidth,
            width: computed.width,
            inlineStyle: style.substring(0, 100)
          });
        }
      });

      return results;
    });

    console.log('MaxWidth 限制的容器:', maxWidthCheck);

    maxWidthCheck.forEach(item => {
      const maxWidthValue = parseInt(item.maxWidth);
      if (maxWidthValue && maxWidthValue < 1000) {
        console.log(`⚠️  问题：${item.selector} 的 maxWidth (${item.maxWidth}) 可能过小`);
      }
    });
  });

  test('检查菜单激活状态样式', async ({ page }) => {
    await page.goto('http://localhost:3001/v2/examples/home.html#/home', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    await page.waitForTimeout(2000);

    // 检查 Sidebar 中的菜单项样式
    const menuItemsStyle = await page.evaluate(() => {
      const items = document.querySelectorAll('.yoya-sidebar .yoya-menu-item');
      const results = [];

      items.forEach((item, index) => {
        const computed = window.getComputedStyle(item);
        const text = item.textContent?.trim().substring(0, 20);
        
        results.push({
          index,
          text,
          isActive: item.classList.contains('yoya-menu-item--active'),
          background: computed.background,
          color: computed.color,
          borderRight: computed.borderRight,
          fontWeight: computed.fontWeight
        });
      });

      return results;
    });

    console.log('菜单项样式:', menuItemsStyle);

    // 检查是否有多个激活项
    const activeItems = menuItemsStyle.filter(item => item.isActive);
    if (activeItems.length > 1) {
      console.log(`⚠️  问题：有多个激活菜单项 (${activeItems.length}个)`);
    }

    // 检查激活项的样式一致性
    activeItems.forEach(item => {
      if (!item.borderRight.includes('solid')) {
        console.log(`⚠️  问题：激活菜单项 "${item.text}" 缺少右边框样式`);
      }
    });
  });

  test('检查视图标签栏布局', async ({ page }) => {
    await page.goto('http://localhost:3001/v2/examples/home.html#/home', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    await page.waitForTimeout(2000);

    // 检查视图标签栏
    const tabBarLayout = await page.evaluate(() => {
      const tabBar = document.querySelector('.yoya-router-views__header');
      if (!tabBar) return null;

      const tabs = tabBar.querySelectorAll('.yoya-router-views__tab');
      const tabData = [];

      tabs.forEach((tab, index) => {
        const computed = window.getComputedStyle(tab);
        const rect = tab.getBoundingClientRect();
        tabData.push({
          index,
          text: tab.textContent?.trim(),
          isActive: tab.classList.contains('yoya-router-views__tab--active'),
          width: rect.width,
          height: rect.height,
          paddingTop: computed.paddingTop,
          paddingBottom: computed.paddingBottom,
          paddingLeft: computed.paddingLeft,
          paddingRight: computed.paddingRight,
          borderBottom: computed.borderBottom
        });
      });

      return {
        tabBarHeight: tabBar.getBoundingClientRect().height,
        tabs: tabData
      };
    });

    console.log('视图标签栏布局:', tabBarLayout);

    if (tabBarLayout) {
      // 检查标签高度一致性
      const heights = tabBarLayout.tabs.map(t => t.height);
      const maxHeight = Math.max(...heights);
      const minHeight = Math.min(...heights);
      
      if (maxHeight - minHeight > 5) {
        console.log(`⚠️  问题：标签高度不一致 (max: ${maxHeight}px, min: ${minHeight}px)`);
      }

      // 检查激活标签的下边框
      tabBarLayout.tabs.forEach(tab => {
        if (tab.isActive && !tab.borderBottom.includes('solid')) {
          console.log(`⚠️  问题：激活标签 "${tab.text}" 缺少下边框`);
        }
      });
    }

    // 截图标签栏
    await page.screenshot({
      path: 'tests/screenshots/layout-tab-bar-detail.png',
      clip: { x: 244, y: 88, width: 968, height: 50 }
    });
  });

  test('检查内容区域 padding 和 gap', async ({ page }) => {
    await page.goto('http://localhost:3001/v2/examples/home.html#/home', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    await page.waitForTimeout(2000);

    const spacingCheck = await page.evaluate(() => {
      const results = {};

      // 检查内容容器的间距
      const containers = [
        '.yoya-router-views__content-container',
        '.yoya-router-views__content',
      ];

      containers.forEach(selector => {
        const el = document.querySelector(selector);
        if (el) {
          const computed = window.getComputedStyle(el);
          results[selector] = {
            padding: computed.padding,
            paddingLeft: computed.paddingLeft,
            paddingRight: computed.paddingRight,
            paddingTop: computed.paddingTop,
            paddingBottom: computed.paddingBottom,
            gap: computed.gap
          };
        }
      });

      // 检查内容区域内的直接子元素
      const content = document.querySelector('.yoya-router-views__content--active');
      if (content) {
        const children = content.children;
        results['contentChildren'] = [];
        
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          const computed = window.getComputedStyle(child);
          results['contentChildren'].push({
            tag: child.tagName.toLowerCase(),
            className: child.className,
            width: computed.width,
            margin: computed.margin,
            padding: computed.padding
          });
        }
      }

      return results;
    });

    console.log('内容区域间距检查:', spacingCheck);
  });

  test('检查内容区挤占问题 - 标题和介绍', async ({ page }) => {
    await page.goto('http://localhost:3001/v2/examples/home.html#/home', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    await page.waitForTimeout(3000);

    // 检查内容区域内的元素布局
    const contentLayout = await page.evaluate(() => {
      const report = {
        issues: [],
        elements: [],
        allFlexContainers: []
      };

      // 查找所有内容相关的容器
      const selectors = [
        '.yoya-router-views__content--active',
        '.yoya-router-views__content-container',
        '.yoya-router-views',
        '#app'
      ];

      let foundContainer = null;
      
      for (const selector of selectors) {
        const el = document.querySelector(selector);
        if (el) {
          const style = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          
          report.elements.push({
            name: selector,
            found: true,
            width: rect.width,
            height: rect.height,
            display: style.display,
            overflow: style.overflow
          });

          if (!foundContainer && selector.includes('active')) {
            foundContainer = el;
          }
        } else {
          report.elements.push({
            name: selector,
            found: false
          });
        }
      }

      // 查找实际的页面内容容器 (由 home.js 动态创建)
      // 查找带有 inline style 的 flex 容器
      const allFlexElements = Array.from(document.querySelectorAll('*'))
        .filter(el => {
          const style = window.getComputedStyle(el);
          return style.display === 'flex';
        });

      console.log(`页面中 flex 容器数量：${allFlexElements.length}`);

      // 检查 VRouterViews 内容区域
      const routerViewsContent = document.querySelector('.yoya-router-views__content--active');
      
      if (routerViewsContent) {
        const children = Array.from(routerViewsContent.children);
        console.log(`激活内容容器的子元素数量：${children.length}`);

        children.forEach((child, index) => {
          const rect = child.getBoundingClientRect();
          const style = window.getComputedStyle(child);
          
          report.elements.push({
            name: `content-child[${index}]`,
            tag: child.tagName.toLowerCase(),
            class: child.className,
            width: rect.width,
            height: rect.height,
            x: rect.x,
            y: rect.y,
            display: style.display,
            flex: style.flex,
            flexShrink: style.flexShrink,
            minWidth: style.minWidth,
            maxWidth: style.maxWidth,
            overflow: style.overflow
          });

          // 如果是 flex 容器，继续检查其子元素
          if (style.display === 'flex') {
            const subChildren = Array.from(child.children);
            console.log(`  flex 容器 [${index}] 的子元素数量：${subChildren.length}`);

            subChildren.forEach((subChild, subIndex) => {
              const subRect = subChild.getBoundingClientRect();
              const subStyle = window.getComputedStyle(subChild);
              
              report.elements.push({
                name: `content-child[${index}]-sub[${subIndex}]`,
                tag: subChild.tagName.toLowerCase(),
                class: subChild.className,
                width: subRect.width,
                height: subRect.height,
                x: subRect.x,
                y: subRect.y,
                flex: subStyle.flex,
                flexShrink: subStyle.flexShrink,
                minWidth: subStyle.minWidth,
                maxWidth: subStyle.maxWidth
              });

              // 检查是否可能挤占
              if (subStyle.flexShrink === '0' || subStyle.flex === 'none') {
                const percentage = (subRect.width / rect.width) * 100;
                if (percentage > 30) {
                  report.issues.push({
                    type: 'flex 挤占风险',
                    element: `${subChild.tagName}.${subChild.className || ''}`,
                    description: `子元素宽度 (${subRect.width}px, ${percentage.toFixed(1)}%) 过大且 flexShrink=0`,
                    suggestion: '设置 flexShrink: 1 或使用 flex: 1'
                  });
                }
              }

              // 检查 minWidth
              if (subStyle.minWidth !== '0px' && subStyle.minWidth !== 'auto' && subStyle.minWidth !== '') {
                const minWidthValue = parseFloat(subStyle.minWidth);
                if (minWidthValue && minWidthValue > 200) {
                  report.issues.push({
                    type: 'minWidth 过大',
                    element: `${subChild.tagName}.${subChild.className || ''}`,
                    description: `子元素 minWidth (${subStyle.minWidth}) 过大`,
                    suggestion: '减小 minWidth 或设置为 0'
                  });
                }
              }
            });
          }
        });
      }

      // 查找标题和介绍元素
      const titleEl = document.querySelector('h1, h2, .title, .page-title');
      const introEl = document.querySelector('.intro, .description, p');

      if (titleEl) {
        const titleRect = titleEl.getBoundingClientRect();
        const titleStyle = window.getComputedStyle(titleEl);
        report.elements.push({
          name: 'title',
          tag: titleEl.tagName.toLowerCase(),
          text: titleEl.textContent?.trim().substring(0, 30),
          width: titleRect.width,
          height: titleRect.height,
          display: titleStyle.display,
          minWidth: titleStyle.minWidth,
          maxWidth: titleStyle.maxWidth
        });
      }

      if (introEl) {
        const introRect = introEl.getBoundingClientRect();
        const introStyle = window.getComputedStyle(introEl);
        report.elements.push({
          name: 'intro',
          tag: introEl.tagName.toLowerCase(),
          text: introEl.textContent?.trim().substring(0, 30),
          width: introRect.width,
          minWidth: introStyle.minWidth,
          maxWidth: introStyle.maxWidth
        });
      }

      return report;
    });

    console.log('\n========== 内容区布局详情 ==========');
    console.log('容器检查:');
    contentLayout.elements.filter(el => el.name && el.name.includes('yoya')).forEach(el => {
      console.log(`  ${el.name}: ${el.found ? `✓ (宽${el.width}px)` : '✗ 未找到'}`);
    });

    console.log('\n内容子元素:');
    contentLayout.elements.filter(el => el.name && el.name.includes('content-child')).forEach(el => {
      console.log(`  ${el.name}: <${el.tag || 'div'}> ${el.class || ''} - 宽:${el.width}px, flex:${el.flex || 'N/A'}, minWidth:${el.minWidth || 'N/A'}`);
    });

    console.log('\n发现的问题:');
    if (contentLayout.issues.length === 0) {
      console.log('  暂无发现明显挤占问题');
    } else {
      contentLayout.issues.forEach((issue, index) => {
        console.log(`  [${index + 1}] [${issue.type}] ${issue.element}`);
        console.log(`      ${issue.description}`);
        console.log(`      建议：${issue.suggestion}`);
      });
    }
    console.log('====================================\n');

    // 截图内容区域
    await page.screenshot({
      path: 'tests/screenshots/layout-content-detail.png',
      clip: { x: 244, y: 122, width: 960, height: 500 }
    });
  });

  test('检查 VRouterViews 内容区 flex 布局问题', async ({ page }) => {
    await page.goto('http://localhost:3001/v2/examples/home.html#/home', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    await page.waitForTimeout(2000);

    const flexLayoutReport = await page.evaluate(() => {
      const report = {
        containers: [],
        issues: []
      };

      // 检查 VRouterViews 内容容器的 flex 布局
      const selectors = [
        '.yoya-router-views',
        '.yoya-router-views__content-container',
        '.yoya-router-views__content--active',
      ];

      selectors.forEach(selector => {
        const el = document.querySelector(selector);
        if (!el) return;

        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();

        const containerInfo = {
          selector,
          width: rect.width,
          height: rect.height,
          display: style.display,
          flexDirection: style.flexDirection,
          flexWrap: style.flexWrap,
          justifyContent: style.justifyContent,
          alignItems: style.alignItems,
          gap: style.gap,
          overflow: style.overflow
        };

        report.containers.push(containerInfo);

        // 如果是 flex 容器，检查子元素
        if (style.display === 'flex') {
          const children = Array.from(el.children);
          
          children.forEach((child, index) => {
            const childStyle = window.getComputedStyle(child);
            const childRect = child.getBoundingClientRect();

            // 检查 flex 子元素是否可能导致挤占
            if (childStyle.flexShrink === '0' || childStyle.flex === 'none') {
              // 不收缩的元素可能挤占其他内容
              const percentage = (childRect.width / rect.width) * 100;
              
              if (percentage > 50 && style.flexDirection === 'row') {
                report.issues.push({
                  type: 'flex 挤占风险',
                  container: selector,
                  element: `${child.tagName.toLowerCase()}.${child.className || ''}`,
                  description: `子元素宽度 (${childRect.width}px, ${percentage.toFixed(1)}%) 过大且 flexShrink=0，可能挤占其他内容`,
                  suggestion: '设置 flexShrink: 1 或使用 flex: 1 让元素自适应'
                });
              }
            }

            // 检查是否有过大的 minWidth
            if (childStyle.minWidth !== '0px' && childStyle.minWidth !== 'auto' && childStyle.minWidth !== '') {
              const minWidthValue = parseFloat(childStyle.minWidth);
              if (minWidthValue && minWidthValue > rect.width * 0.3) {
                report.issues.push({
                  type: 'minWidth 过大',
                  container: selector,
                  element: `${child.tagName.toLowerCase()}.${child.className || ''}`,
                  description: `子元素 minWidth (${childStyle.minWidth}) 超过容器宽度的 30%`,
                  suggestion: '减小 minWidth 或设置为 0'
                });
              }
            }
          });
        }
      });

      return report;
    });

    console.log('\n========== VRouterViews Flex 布局报告 ==========');
    console.log('容器信息:');
    flexLayoutReport.containers.forEach(c => {
      console.log(`  ${c.selector}:`);
      console.log(`    display: ${c.display}, flexDirection: ${c.flexDirection}`);
      console.log(`    尺寸：${c.width} x ${c.height}`);
      console.log(`    overflow: ${c.overflow}`);
    });

    console.log('\n发现的问题:');
    flexLayoutReport.issues.forEach((issue, index) => {
      console.log(`  [${index + 1}] [${issue.type}] ${issue.container} > ${issue.element}`);
      console.log(`      ${issue.description}`);
      console.log(`      建议：${issue.suggestion}`);
    });
    console.log('================================================\n');
  });

  test('生成完整布局问题报告', async ({ page }) => {
    await page.goto('http://localhost:3001/v2/examples/home.html#/home', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    await page.waitForTimeout(2000);

    // 获取完整布局信息
    const layoutReport = await page.evaluate(() => {
      const report = {
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        issues: []
      };

      // 1. 检查 #app 容器
      const app = document.querySelector('#app');
      if (app) {
        const appRect = app.getBoundingClientRect();
        const appStyle = window.getComputedStyle(app);
        
        if (appRect.height < window.innerHeight - 10) {
          report.issues.push({
            type: '容器高度',
            severity: 'warning',
            element: '#app',
            description: `#app 容器高度 (${appRect.height}px) 未占满视口 (${window.innerHeight}px)`,
            suggestion: '检查 #app 的 height 样式设置'
          });
        }

        if (appStyle.overflow === 'visible') {
          report.issues.push({
            type: '溢出风险',
            severity: 'info',
            element: '#app',
            description: '#app 的 overflow 设置为 visible，可能导致内容溢出',
            suggestion: '考虑设置为 hidden 或 auto'
          });
        }
      }

      // 2. 检查导航栏
      const navbar = document.querySelector('.yoya-navbar');
      if (navbar) {
        const navbarStyle = window.getComputedStyle(navbar);
        if (navbarStyle.zIndex === 'auto' || parseInt(navbarStyle.zIndex) < 100) {
          report.issues.push({
            type: '层级风险',
            severity: 'info',
            element: '.yoya-navbar',
            description: '导航栏 z-index 可能过低',
            suggestion: '确保导航栏 z-index 高于内容区'
          });
        }
      }

      // 3. 检查 Sidebar
      const sidebar = document.querySelector('.yoya-sidebar');
      if (sidebar) {
        const sidebarRect = sidebar.getBoundingClientRect();
        const sidebarStyle = window.getComputedStyle(sidebar);
        
        // Sidebar 高度检查
        const expectedHeight = window.innerHeight - 56; // 减去导航栏高度
        if (Math.abs(sidebarRect.height - expectedHeight) > 10) {
          report.issues.push({
            type: '尺寸问题',
            severity: 'warning',
            element: '.yoya-sidebar',
            description: `Sidebar 高度 (${sidebarRect.height}px) 与预期 (${expectedHeight}px) 不符`,
            suggestion: '检查 Sidebar 的高度计算'
          });
        }
      }

      // 4. 检查 VRouterViews
      const routerViews = document.querySelector('.yoya-router-views');
      if (routerViews) {
        const rvStyle = window.getComputedStyle(routerViews);
        
        if (rvStyle.overflow === 'visible') {
          report.issues.push({
            type: '溢出风险',
            severity: 'warning',
            element: '.yoya-router-views',
            description: '.yoya-router-views 的 overflow 设置为 visible',
            suggestion: '考虑设置为 hidden 或 auto 防止内容溢出'
          });
        }
      }

      // 5. 检查内容容器
      const contentContainer = document.querySelector('.yoya-router-views__content-container');
      if (contentContainer) {
        const ccStyle = window.getComputedStyle(contentContainer);
        const ccRect = contentContainer.getBoundingClientRect();

        // 检查 maxWidth
        if (ccStyle.maxWidth !== 'none' && ccStyle.maxWidth !== '') {
          const maxWidthValue = parseInt(ccStyle.maxWidth);
          if (maxWidthValue && maxWidthValue < 1000) {
            report.issues.push({
              type: '宽度限制',
              severity: 'warning',
              element: '.yoya-router-views__content-container',
              description: `内容容器 maxWidth (${ccStyle.maxWidth}) 可能过小`,
              suggestion: '考虑增加 maxWidth 或移除限制'
            });
          }
        }

        // 检查内容是否溢出
        if (contentContainer.scrollWidth > ccRect.width + 5) {
          report.issues.push({
            type: '内容溢出',
            severity: 'error',
            element: '.yoya-router-views__content-container',
            description: `内容宽度 (${contentContainer.scrollWidth}px) 超出容器 (${ccRect.width}px)`,
            suggestion: '检查内容元素的宽度设置'
          });
        }
      }

      // 6. 检查是否有水平滚动条
      const hasHorizontalScroll = document.documentElement.scrollWidth > document.documentElement.clientWidth;
      if (hasHorizontalScroll) {
        report.issues.push({
          type: '响应式问题',
          severity: 'error',
          element: 'document',
          description: '页面出现水平滚动条',
          suggestion: '检查是否有固定宽度的元素导致溢出'
        });
      }

      // 7. 检查内容区域 padding
      const contentWrapper = document.querySelector('[style*="padding"]');
      if (contentWrapper) {
        const cwStyle = window.getComputedStyle(contentWrapper);
        const paddingLeft = parseInt(cwStyle.paddingLeft);
        const paddingRight = parseInt(cwStyle.paddingRight);
        
        if (paddingLeft > 40 || paddingRight > 40) {
          report.issues.push({
            type: '间距过大',
            severity: 'info',
            element: 'contentWrapper',
            description: `内容区域左右内边距过大 (left: ${paddingLeft}px, right: ${paddingRight}px)`,
            suggestion: '考虑减小 padding 值'
          });
        }
      }

      return report;
    });

    // 输出报告
    console.log('\n========== 布局问题报告 ==========');
    console.log(`视口尺寸：${layoutReport.viewport.width} x ${layoutReport.viewport.height}`);
    console.log(`发现问题数量：${layoutReport.issues.length}`);
    console.log('');

    layoutReport.issues.forEach((issue, index) => {
      console.log(`[${index + 1}] [${issue.severity.toUpperCase()}] ${issue.type}`);
      console.log(`    元素：${issue.element}`);
      console.log(`    描述：${issue.description}`);
      console.log(`    建议：${issue.suggestion}`);
      console.log('');
    });

    // 保存报告
    const fs = await import('fs');
    const path = await import('path');
    const reportPath = path.join(process.cwd(), 'tests/screenshots/layout-issues-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(layoutReport, null, 2));
    console.log(`报告已保存到：${reportPath}`);
    console.log('====================================\n');

    // 断言：不应有严重问题
    const errors = layoutReport.issues.filter(i => i.severity === 'error');
    expect(errors.length).toBe(0);
  });
});
