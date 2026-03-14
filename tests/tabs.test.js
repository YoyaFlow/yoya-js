/**
 * VTabs 组件单元测试
 */

import { JSDOM } from 'jsdom';

// 设置 jsdom 环境
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
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
  const id = `test-${testId++}`;
  const container = dom.window.document.createElement('div');
  container.id = id;
  dom.window.document.body.appendChild(container);
  return `#${id}`;
}

// 导入库
import { vTabs } from '../src/yoya/index.js';

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
  '应该创建 VTabs 实例': () => {
    const tabs = vTabs((t) => {
      t.addTab('tab1', 'Tab 1', (c) => {
        c.text('Content 1');
      });
    });

    assert(tabs !== null, '应该创建 tabs 对象');
    assert(typeof tabs.addTab === 'function', '应该有 addTab 方法');
    assert(typeof tabs.setActiveTab === 'function', '应该有 setActiveTab 方法');
  },

  '应该添加多个标签页': () => {
    const tabs = vTabs((t) => {
      t.addTab('tab1', 'Tab 1', (c) => c.text('Content 1'));
      t.addTab('tab2', 'Tab 2', (c) => c.text('Content 2'));
      t.addTab('tab3', 'Tab 3', (c) => c.text('Content 3'));
    });

    const tabList = tabs.getTabs();
    assertEquals(tabList.length, 3, '应该有三个标签页');
  },

  '应该设置激活的标签页': () => {
    const tabs = vTabs((t) => {
      t.addTab('tab1', 'Tab 1', (c) => c.text('Content 1'));
      t.addTab('tab2', 'Tab 2', (c) => c.text('Content 2'));
    });

    // 默认激活第一个
    assertEquals(tabs.getActiveTabId(), 'tab1', '默认应该激活第一个标签页');

    // 设置激活第二个
    tabs.setActiveTab('tab2');
    assertEquals(tabs.getActiveTabId(), 'tab2', '应该激活第二个标签页');
  },

  '应该移除标签页': () => {
    const tabs = vTabs((t) => {
      t.addTab('tab1', 'Tab 1', (c) => c.text('Content 1'));
      t.addTab('tab2', 'Tab 2', (c) => c.text('Content 2'));
      t.addTab('tab3', 'Tab 3', (c) => c.text('Content 3'));
    });

    assertEquals(tabs.getTabs().length, 3, '移除前应该有三个标签页');

    // 移除中间的标签页
    tabs.removeTab('tab2');
    const tabList = tabs.getTabs();
    assertEquals(tabList.length, 2, '移除后应该有两个标签页');
    assertEquals(tabList[0].id, 'tab1', '第一个标签页应该是 tab1');
    assertEquals(tabList[1].id, 'tab3', '第二个标签页应该是 tab3');
  },

  '移除激活的标签页应该激活相邻的标签页': () => {
    const tabs = vTabs((t) => {
      t.addTab('tab1', 'Tab 1', (c) => c.text('Content 1'));
      t.addTab('tab2', 'Tab 2', (c) => c.text('Content 2'));
      t.addTab('tab3', 'Tab 3', (c) => c.text('Content 3'));
    });

    tabs.setActiveTab('tab2');
    assertEquals(tabs.getActiveTabId(), 'tab2', '应该激活 tab2');

    // 移除激活的标签页，应该激活下一个
    tabs.removeTab('tab2');
    assertEquals(tabs.getActiveTabId(), 'tab3', '移除后应该激活 tab3');
  },

  '应该更新标签页标题': () => {
    const tabs = vTabs((t) => {
      t.addTab('tab1', 'Tab 1', (c) => c.text('Content 1'));
    });

    tabs.updateTabTitle('tab1', 'New Title');
    const tab = tabs.getTabs().find((t) => t.id === 'tab1');
    assertEquals(tab.title, 'New Title', '标题应该被更新');
  },

  '应该触发 onChange 回调': () => {
    let triggered = false;
    let triggeredId = null;

    const tabs = vTabs((t) => {
      t.addTab('tab1', 'Tab 1', (c) => c.text('Content 1'));
      t.addTab('tab2', 'Tab 2', (c) => c.text('Content 2'));
      t.onChange((id, data) => {
        triggered = true;
        triggeredId = id;
      });
    });

    tabs.setActiveTab('tab2');
    assert(triggered, 'onChange 回调应该被触发');
    assertEquals(triggeredId, 'tab2', '应该传递正确的标签页 ID');
  },

  '重复添加相同 ID 的标签页应该激活已存在的标签页': () => {
    const tabs = vTabs((t) => {
      t.addTab('tab1', 'Tab 1', (c) => c.text('Content 1'));
    });

    assertEquals(tabs.getTabs().length, 1, '应该只有一个标签页');

    // 再次添加相同 ID
    tabs.addTab('tab1', 'Tab 1 Updated', (c) => c.text('New Content'));
    assertEquals(tabs.getTabs().length, 1, '仍然只有一个标签页');
    assertEquals(tabs.getActiveTabId(), 'tab1', '应该激活已存在的标签页');
  },

  '应该支持带图标的标签页': () => {
    const tabs = vTabs((t) => {
      t.addTab('tab1', 'Tab 1', (c) => c.text('Content 1'), { icon: '📄' });
    });

    const tab = tabs.getTabs().find((t) => t.id === 'tab1');
    assertEquals(tab.icon, '📄', '应该设置图标');
  },

  '应该支持带自定义数据的标签页': () => {
    const tabs = vTabs((t) => {
      t.addTab('tab1', 'Tab 1', (c) => c.text('Content 1'), {
        data: { filePath: '/path/to/file', language: 'javascript' },
      });
    });

    const tab = tabs.getTabs().find((t) => t.id === 'tab1');
    assert(tab.data.filePath === '/path/to/file', '应该设置 filePath');
    assert(tab.data.language === 'javascript', '应该设置 language');
  },

  '应该支持获取激活的标签页数据': () => {
    const tabs = vTabs((t) => {
      t.addTab('tab1', 'Tab 1', (c) => c.text('Content 1'));
      t.addTab('tab2', 'Tab 2', (c) => c.text('Content 2'));
    });

    tabs.setActiveTab('tab2');
    const activeTab = tabs.getActiveTab();
    assert(activeTab !== null, '应该返回激活的标签页');
    assertEquals(activeTab.id, 'tab2', '应该返回正确的标签页 ID');
    assertEquals(activeTab.title, 'Tab 2', '应该返回正确的标签页标题');
  },

  '应该渲染到 DOM': () => {
    const tabs = vTabs((t) => {
      t.addTab('tab1', 'Tab 1', (c) => c.text('Content 1'));
      t.addTab('tab2', 'Tab 2', (c) => c.text('Content 2'));
    });

    // 渲染到容器
    const container = createContainer();
    tabs.bindTo(container);

    const el = tabs._boundElement;
    assert(el !== null, '应该创建 DOM 元素');
    assertEquals(el.tagName.toLowerCase(), 'div', '应该是 div 元素');

    // 检查是否有标签页头部和内容容器
    assert(el.children.length >= 2, '应该至少有两个子元素（tab header 和 content container）');
  },

  '标签页应该有关闭按钮': () => {
    const tabs = vTabs((t) => {
      t.addTab('tab1', 'Tab 1', (c) => c.text('Content 1'), { closable: true });
    });

    const tab = tabs.getTabs()[0];
    // 检查是否有 _closeBtn 属性
    assert(tab._closeBtn !== undefined, '标签页应该有关闭按钮引用');
  },

  'closable 状态应该控制关闭按钮显示': () => {
    const tabs = vTabs((t) => {
      t.addTab('tab1', 'Tab 1', (c) => c.text('Content 1'));
    });

    // 默认 closable 为 true
    assert(tabs.hasState('closable'), '默认应该是 closable');

    // 设置为不可关闭
    tabs.setState('closable', false);
    assert(!tabs.hasState('closable'), '设置后应该不是 closable');
  },
};

// 运行测试
function runTests() {
  console.log('\n🧪 开始运行 VTabs 测试...\n');

  let passed = 0;
  let failed = 0;

  for (const [name, testFn] of Object.entries(tests)) {
    try {
      testFn();
      console.log(`✅ ${name}`);
      passed++;
    } catch (error) {
      console.log(`❌ ${name}`);
      console.log(`   ${error.message}`);
      failed++;
    }
  }

  console.log(`${'─'.repeat(50)}`);
  console.log(`测试完成：${passed + failed} 个测试，${passed} 通过，${failed} 失败`);
  console.log(`${'─'.repeat(50)}\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
