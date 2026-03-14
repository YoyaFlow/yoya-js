/**
 * VPager 组件单元测试
 */

import { JSDOM } from 'jsdom';

// 设置 jsdom 环境
const dom = new JSDOM('<!DOCTYPE html><html><body><div id="app"></div></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
  resources: 'usable'
});

global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;

// 创建测试容器的辅助函数
let testId = 0;
function createContainer() {
  const id = `test-pager-${testId++}`;
  const container = dom.window.document.createElement('div');
  container.id = id;
  dom.window.document.body.appendChild(container);
  return `#${id}`;
}

// 导入库
import { vPager } from '../src/yoya/index.js';

// 测试断言
function assert(condition, message) {
  if (!condition) {
    throw new Error(`❌ 测试失败：${message}`);
  }
}

function assertEquals(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`❌ 测试失败：${message}\n   期望：${expected}\n   实际：${actual}`);
  }
}

// 测试用例
const tests = {
  'VPager 应该能创建实例': () => {
    const pager = vPager();
    assert(pager, 'pager 应该存在');
  },

  'VPager 应该能设置总记录数': () => {
    const pager = vPager(p => {
      p.total(100);
    });
    assertEquals(pager.getTotal(), 100, '总记录数应该为 100');
    assertEquals(pager.getTotalPage(), 10, '总页数应该为 10');
  },

  'VPager 应该能设置每页数量': () => {
    const pager = vPager(p => {
      p.total(100);
      p.pageSize(20);
    });
    assertEquals(pager.getPageSize(), 20, '每页数量应该为 20');
    assertEquals(pager.getTotalPage(), 5, '总页数应该为 5');
  },

  'VPager 应该能设置当前页': () => {
    const pager = vPager(p => {
      p.total(100);
      p.current(5);
    });
    assertEquals(pager.getCurrent(), 5, '当前页应该为 5');
  },

  'VPager 应该正确计算总页数（非整除）': () => {
    const pager = vPager(p => {
      p.total(95);
      p.pageSize(10);
    });
    assertEquals(pager.getTotalPage(), 10, '总页数应该为 10');
  },

  'VPager 应该正确计算总页数（总数为 0）': () => {
    const pager = vPager(p => {
      p.total(0);
    });
    assertEquals(pager.getTotalPage(), 0, '总页数应该为 0');
  },

  'VPager 第一页时上一页按钮应该禁用': () => {
    const pager = vPager(p => {
      p.total(100);
      p.current(1);
    });
    assert(pager._isNavDisabled(true), '上一页应该禁用');
    assert(!pager._isNavDisabled(false), '下一页应该可用');
  },

  'VPager 最后一页时下一页按钮应该禁用': () => {
    const pager = vPager(p => {
      p.total(100);
      p.current(10);
    });
    assert(!pager._isNavDisabled(true), '上一页应该可用');
    assert(pager._isNavDisabled(false), '下一页应该禁用');
  },

  'VPager 只有一页时两个导航按钮都应该禁用': () => {
    const pager = vPager(p => {
      p.total(5);
      p.pageSize(10);
    });
    assert(pager._isNavDisabled(true), '上一页应该禁用');
    assert(pager._isNavDisabled(false), '下一页应该禁用');
  },

  'VPager 应该能注册 onChange 回调': () => {
    let called = false;
    let callbackPage = null;
    const pager = vPager(p => {
      p.total(100);
      p.onChange((page, info) => {
        called = true;
        callbackPage = page;
      });
    });

    // 模拟切换页
    pager.setState('current', 2);

    assert(called, 'onChange 回调应该被调用');
    assertEquals(callbackPage, 2, '回调参数应该是新页码');
  },

  'VPager 应该能设置简洁模式': () => {
    const pager = vPager(p => {
      p.total(100);
      p.simple(true);
    });
    assert(pager._simple, '应该是简洁模式');
  },

  'VPager 应该能设置显示总记录数': () => {
    const pager = vPager(p => {
      p.total(100);
      p.showTotal(true);
    });
    assert(pager._showTotal, '应该显示总记录数');
  },

  'VPager 应该能设置显示快速跳转': () => {
    const pager = vPager(p => {
      p.total(100);
      p.showQuickJumper(true);
    });
    assert(pager._showQuickJumper, '应该显示快速跳转');
  },

  'VPager 应该能设置禁用状态': () => {
    const pager = vPager(p => {
      p.total(100);
      p.disabled(true);
    });
    assert(pager.hasState('disabled'), '应该是禁用状态');
  },

  'VPager 禁用状态下导航按钮应该都禁用': () => {
    const pager = vPager(p => {
      p.total(100);
      p.current(5);
      p.disabled(true);
    });
    assert(pager._isNavDisabled(true), '上一页应该禁用');
    assert(pager._isNavDisabled(false), '下一页应该禁用');
  },

  'VPager 总页数少于 7 页时应该显示所有页码': () => {
    const pager = vPager(p => {
      p.total(50);
      p.pageSize(10);
    });
    const pages = pager._calculateVisiblePages();
    assertEquals(pages.length, 5, '应该显示 5 个页码');
  },

  'VPager 当前页靠近开始时的页码显示': () => {
    const pager = vPager(p => {
      p.total(100);
      p.current(2);
    });
    const pages = pager._calculateVisiblePages();
    assert(pages.includes('more'), '应该包含省略号');
    assert(pages.includes(1), '应该包含第 1 页');
    assert(pages.includes(5), '应该包含第 5 页');
  },

  'VPager 当前页靠近结束时的页码显示': () => {
    const pager = vPager(p => {
      p.total(100);
      p.current(9);
    });
    const pages = pager._calculateVisiblePages();
    assert(pages.includes('more'), '应该包含省略号');
    assert(pages.includes(10), '应该包含最后一页');
  },

  'VPager 当前页在中间时的页码显示': () => {
    const pager = vPager(p => {
      p.total(100);
      p.current(6);
    });
    const pages = pager._calculateVisiblePages();
    const moreCount = pages.filter(p => p === 'more').length;
    assertEquals(moreCount, 2, '应该有两个省略号');
  },

  'VPager 应该支持链式调用': () => {
    const pager = vPager()
      .total(100)
      .pageSize(20)
      .current(3)
      .showTotal(true)
      .showQuickJumper(true);

    assertEquals(pager.getTotal(), 100, '总记录数应该为 100');
    assertEquals(pager.getPageSize(), 20, '每页数量应该为 20');
    assertEquals(pager.getCurrent(), 3, '当前页应该为 3');
    assert(pager._showTotal, '应该显示总记录数');
    assert(pager._showQuickJumper, '应该显示快速跳转');
  },

  'VPager 当前页超过总页数时应该自动调整': () => {
    const pager = vPager(p => {
      p.total(50);
      p.current(10); // 超过最大页数 5
    });
    assertEquals(pager.getCurrent(), 5, '当前页应该调整为 5');
  },

  'VPager pageSize 变化时应该重新计算总页数': () => {
    const pager = vPager(p => {
      p.total(100);
      p.pageSize(10);
    });
    assertEquals(pager.getTotalPage(), 10, '初始总页数应该为 10');

    pager.setState('pageSize', 25);
    assertEquals(pager.getTotalPage(), 4, 'pageSize 变化后总页数应该为 4');
  },

  'VPager total 减少时当前页应该自动调整': () => {
    const pager = vPager(p => {
      p.total(100);
      p.current(10);
    });

    pager.setState('total', 50); // 现在只有 5 页
    assertEquals(pager.getCurrent(), 5, '当前页应该调整为 5');
  },

  'VPager 应该能绑定到 DOM': () => {
    const container = createContainer();
    const pager = vPager(p => {
      p.total(100);
      p.current(1);
    });
    pager.bindTo(container);

    const rendered = document.querySelector(container);
    assert(rendered, '应该渲染到容器中');
    assert(rendered.children.length > 0, '应该有子元素');
  },
};

// 运行测试
console.log('\n🧪 开始运行 VPager 组件测试...\n');

let passed = 0;
let failed = 0;

for (const [name, testFn] of Object.entries(tests)) {
  try {
    testFn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (e) {
    console.log(`❌ ${name}`);
    console.log(`   ${e.message}`);
    failed++;
  }
}

console.log('\n' + '─'.repeat(50));
console.log(`测试完成：${passed + failed} 个测试，${passed} 通过，${failed} 失败`);

if (failed > 0) {
  process.exit(1);
}
