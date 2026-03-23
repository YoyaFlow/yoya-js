/**
 * 测试 VTree 子节点选中功能 - 详细版
 */

const { chromium } = require('playwright');

(async () => {
  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      executablePath: '/usr/bin/chromium',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();

    console.log('正在加载页面...');
    await page.goto('http://localhost:3001/v2/examples/interaction.html', {
      waitUntil: 'networkidle',
      timeout: 10000
    });

    await new Promise(r => setTimeout(r, 2000));

    console.log('\n=== VTree 子节点选中功能测试 ===\n');

    // 1. 检查页面上的所有 VTree
    const trees = await page.$$('.yoya-tree');
    console.log('VTree 数量:', trees.length);

    for (let t = 0; t < trees.length; t++) {
      console.log(`\n--- 检查第 ${t + 1} 棵树 ---`);

      const treeInfo = await page.evaluate((index) => {
        const tree = document.querySelectorAll('.yoya-tree')[index];
        if (!tree) return null;

        const nodes = tree.querySelectorAll('.yoya-tree__node');
        const checkboxes = tree.querySelectorAll('input[type="checkbox"]');

        const nodesInfo = [];
        nodes.forEach((node, i) => {
          const title = node.querySelector(':scope > .yoya-tree__title');
          const checkbox = node.querySelector(':scope > input[type="checkbox"]');
          const indent = node.querySelector(':scope > .yoya-tree__indent');
          const bg = window.getComputedStyle(node).backgroundColor;

          nodesInfo.push({
            index: i,
            title: title ? title.textContent.trim() : 'N/A',
            hasCheckbox: checkbox !== null,
            indentWidth: indent ? window.getComputedStyle(indent).width : 'N/A',
            backgroundColor: bg,
            nodeHeight: node.offsetHeight,
            pointerEvents: window.getComputedStyle(node).pointerEvents,
            cursor: window.getComputedStyle(node).cursor
          });
        });

        return { nodesInfo, checkboxCount: checkboxes.length };
      }, t);

      console.log('复选框数量:', treeInfo.checkboxCount);
      console.log('节点信息:');
      treeInfo.nodesInfo.forEach(n => {
        console.log(`  ${n.index}: "${n.title}" - checkbox:${n.hasCheckbox}, indent:${n.indentWidth}, bg:${n.backgroundColor}`);
      });
    }

    // 2. 尝试点击带复选框的树
    console.log('\n=== 测试带复选框的树 ===');

    // 滚动到带复选框的树
    await page.evaluate(() => {
      const headings = document.querySelectorAll('h3, .doc-section-title');
      for (const h of headings) {
        if (h.textContent.includes('复选框')) {
          h.scrollIntoView({ block: 'center' });
          return;
        }
      }
    });

    await new Promise(r => setTimeout(r, 1000));

    // 查找带复选框的树
    const checkboxTreeInfo = await page.evaluate(() => {
      const trees = document.querySelectorAll('.yoya-tree');
      for (let i = 0; i < trees.length; i++) {
        const checkboxes = trees[i].querySelectorAll('input[type="checkbox"]');
        if (checkboxes.length > 0) {
          return { index: i, checkboxCount: checkboxes.length };
        }
      }
      return null;
    });

    if (checkboxTreeInfo) {
      console.log('找到带复选框的树，索引:', checkboxTreeInfo.index, '复选框数量:', checkboxTreeInfo.checkboxCount);

      // 尝试点击第一个复选框
      const firstCheckbox = await page.evaluate((treeIndex) => {
        const tree = document.querySelectorAll('.yoya-tree')[treeIndex];
        const checkbox = tree.querySelector('input[type="checkbox"]');
        if (!checkbox) return null;

        const rect = checkbox.getBoundingClientRect();
        return {
          top: rect.top,
          left: rect.left,
          checked: checkbox.checked,
          disabled: checkbox.disabled
        };
      }, checkboxTreeInfo.index);

      console.log('第一个复选框:', firstCheckbox);

      if (firstCheckbox) {
        // 点击复选框 - 使用 dispatchEvent 而不是 click()
        console.log('点击第一个复选框...');

        const result = await page.evaluate((treeIndex) => {
          const tree = document.querySelectorAll('.yoya-tree')[treeIndex];
          const checkbox = tree.querySelector('input[type="checkbox"]');
          if (!checkbox) return { error: 'not found' };

          console.log('dispatch 前 checked:', checkbox.checked);

          // 使用 dispatchEvent 而不是 click()
          const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
          });

          checkbox.dispatchEvent(clickEvent);

          console.log('dispatch 后 checked:', checkbox.checked);

          return {
            checked: checkbox.checked,
            indeterminate: checkbox.indeterminate
          };
        }, checkboxTreeInfo.index);

        console.log('点击后状态:', result);
      }
    } else {
      console.log('未找到带复选框的树');
    }

    await browser.close();
    console.log('\n✅ 测试完成!');
  } catch (err) {
    console.error('测试失败:', err.message);
    if (browser) await browser.close();
    process.exit(1);
  }
})();
