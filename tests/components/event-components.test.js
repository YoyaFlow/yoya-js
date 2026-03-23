/**
 * 事件系统组件集成测试
 * 测试 VCard, VTree 等组件的事件系统适配
 */

import { JSDOM } from 'jsdom';

// 设置 JSDOM 环境
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
  resources: 'usable'
});

global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;
global.Element = dom.window.Element;
global.MouseEvent = dom.window.MouseEvent;
global.Event = dom.window.Event;
global.FocusEvent = dom.window.FocusEvent;
global.KeyboardEvent = dom.window.KeyboardEvent;
global.ClipboardEvent = dom.window.ClipboardEvent;

// 导入库（需要在设置全局变量之后）
import { vCard, vTree, Tag } from '../../src/yoya/index.js';

// ============================================
// 测试工具函数
// ============================================

let testId = 0;
function createContainer() {
  const id = `test-${testId++}`;
  const container = dom.window.document.createElement('div');
  container.id = id;
  dom.window.document.body.appendChild(container);
  return `#${id}`;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`❌ ${message}`);
  }
}

// ============================================
// 开始测试
// ============================================

console.log('\n🧪 开始运行组件事件集成测试...\n');

let passCount = 0;
let failCount = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passCount++;
  } catch (e) {
    console.log(`❌ ${name}`);
    console.log(`   ${e.message}`);
    failCount++;
  }
}

// ============================================
// VCard 组件事件测试
// ============================================

test('VCard 应该支持 onClick 事件（对象配置）', () => {
  let clickCount = 0;
  let receivedEvent = null;

  const card = vCard({
    onClick: (e) => {
      clickCount++;
      receivedEvent = e;
    }
  });

  card.bindTo(document.body);
  card._el.click();

  assert(clickCount === 1, `期望点击次数为 1，实际为 ${clickCount}`);
  assert(receivedEvent !== null, '期望接收到事件对象');
  assert(receivedEvent.target === card, '期望 event.target 为 card 实例');
  assert(receivedEvent.event !== undefined, '期望 event.event 存在');
});

test('VCard 应该支持 onClick 事件（函数 setup）', () => {
  let clickCount = 0;

  const card = vCard(c => {
    c.onClick(() => clickCount++);
  });

  card.bindTo(document.body);
  card._el.click();

  assert(clickCount === 1, `期望点击次数为 1，实际为 ${clickCount}`);
});

test('VCard 应该支持多个 onClick 处理器', () => {
  let count1 = 0;
  let count2 = 0;

  const card = vCard(c => {
    c.onClick(() => count1++);
    c.onClick(() => count2++);
  });

  card.bindTo(document.body);
  card._el.click();

  assert(count1 === 1, `期望 count1 为 1，实际为 ${count1}`);
  assert(count2 === 1, `期望 count2 为 1，实际为 ${count2}`);
});

test('VCard 应该支持动态添加 onClick 处理器', () => {
  let count = 0;

  const card = vCard();
  card.bindTo(document.body);

  // 先绑定一个处理器
  card.onClick(() => count++);

  // 触发点击
  card._el.click();
  assert(count === 1, `期望第一次点击后 count 为 1，实际为 ${count}`);

  // 动态添加第二个处理器
  card.onClick(() => count++);

  // 再次触发点击
  card._el.click();
  assert(count === 3, `期望第二次点击后 count 为 3，实际为 ${count}`);
});

// ============================================
// VTree 组件事件测试
// ============================================

const treeData = [
  {
    key: '1',
    title: '节点 1',
    children: [
      { key: '1-1', title: '节点 1-1' },
      { key: '1-2', title: '节点 1-2' }
    ]
  },
  {
    key: '2',
    title: '节点 2',
    children: [
      { key: '2-1', title: '节点 2-1' }
    ]
  }
];

test('VTree 应该支持 onSelect 事件', () => {
  let selectedNode = null;
  let selectedKeys = null;
  let receivedEvent = null;

  const tree = vTree(t => {
    t.data(treeData);
    t.onSelect((e) => {
      receivedEvent = e;
      selectedNode = e.node;
      selectedKeys = e.selectedKeys;
    });
  });

  tree.bindTo(document.body);

  // 模拟点击第一个节点
  const firstNodeEl = tree._el.querySelector('.yoya-tree__node');
  if (firstNodeEl) {
    firstNodeEl.click();
  }

  assert(selectedNode !== null, '期望选中节点');
  assert(selectedNode.key === '1', `期望选中节点 key 为 1，实际为 ${selectedNode.key}`);
  assert(selectedKeys.length === 1, `期望选中 keys 长度为 1，实际为 ${selectedKeys.length}`);
  assert(receivedEvent.target === tree, '期望 event.target 为 tree 实例');
});

test('VTree 应该支持 onCheck 事件（复选框）', () => {
  let checkedKeys = null;
  let receivedEvent = null;

  const tree = vTree(t => {
    t.data(treeData);
    t.checkable(true);
    t.onCheck((e) => {
      receivedEvent = e;
      checkedKeys = e.checkedKeys;
    });
  });

  tree.bindTo(document.body);

  // 模拟点击第一个复选框 - 使用 change 事件而不是 click
  const firstCheckbox = tree._el.querySelector('input[type="checkbox"]');
  if (firstCheckbox) {
    firstCheckbox.checked = true; // 先改变状态
    const changeEvent = new dom.window.Event('change', { bubbles: true });
    firstCheckbox.dispatchEvent(changeEvent);
  }

  assert(checkedKeys !== null, '期望有勾选的 keys');
  assert(checkedKeys.includes('1'), '期望勾选了节点 1');
  assert(receivedEvent.target === tree, '期望 event.target 为 tree 实例');
});

test('VTree 应该支持 onExpand 事件', () => {
  let expandedKeys = null;
  let receivedEvent = null;

  const tree = vTree(t => {
    t.data(treeData);
    t.onExpand((e) => {
      receivedEvent = e;
      expandedKeys = e.expandedKeys;
    });
  });

  tree.bindTo(document.body);

  // 模拟点击展开图标（第一个有子节点的节点）
  const expandIcon = tree._el.querySelector('.yoya-tree__node span');
  if (expandIcon) {
    expandIcon.click();
  }

  assert(expandedKeys !== null, '期望有展开的 keys');
  assert(receivedEvent.target === tree, '期望 event.target 为 tree 实例');
});

test('VTree 应该支持链式调用事件方法', () => {
  const tree = vTree(t => {
    t.data(treeData);
    t.checkable(true);
    t.onSelect(() => {})
     .onCheck(() => {})
     .onExpand(() => {});
  });

  tree.bindTo(document.body);

  assert(tree._onSelect !== null, '期望 _onSelect 被设置');
  assert(tree._onCheck !== null, '期望 _onCheck 被设置');
  assert(tree._onExpand !== null, '期望 _onExpand 被设置');
});

// ============================================
// 事件传播控制测试
// ============================================

test('VTree 节点点击应该阻止事件冒泡', () => {
  let parentClicked = false;

  const parent = vCard(c => {
    c.onClick(() => { parentClicked = true; });
    const treeEl = vTree(t => {
      t.data([{ key: '1', title: '节点' }]);
      t.onSelect(() => {});
    });
    c.child(treeEl); // 使用 child 方法添加子元素
  });

  parent.bindTo(document.body);

  // 点击树节点
  const nodeEl = parent._el.querySelector('.yoya-tree__node');
  if (nodeEl) {
    nodeEl.click();
  }

  // 父元素的点击事件不应该被触发
  assert(parentClicked === false, '期望父元素点击事件未被触发');
});

// ============================================
// 事件对象格式一致性测试
// ============================================

test('VCard onClick 应该传递统一事件对象', () => {
  let eventObj = null;

  const card = vCard(c => {
    c.onClick((e) => { eventObj = e; });
  });

  card.bindTo(document.body);
  card._el.click();

  assert(eventObj.hasOwnProperty('event'), '期望 event 对象有 event 属性');
  assert(eventObj.hasOwnProperty('target'), '期望 event 对象有 target 属性');
});

test('VTree onSelect 应该传递统一事件对象', () => {
  let eventObj = null;

  const tree = vTree(t => {
    t.data([{ key: '1', title: '节点' }]);
    t.onSelect((e) => { eventObj = e; });
  });

  tree.bindTo(document.body);

  const nodeEl = tree._el.querySelector('.yoya-tree__node');
  if (nodeEl) {
    nodeEl.click();
  }

  assert(eventObj.hasOwnProperty('event'), '期望 event 对象有 event 属性');
  assert(eventObj.hasOwnProperty('target'), '期望 event 对象有 target 属性');
  assert(eventObj.hasOwnProperty('node'), '期望 event 对象有 node 属性');
  assert(eventObj.hasOwnProperty('selectedKeys'), '期望 event 对象有 selectedKeys 属性');
});

test('VTree onCheck 应该传递统一事件对象', () => {
  let eventObj = null;

  const tree = vTree(t => {
    t.data([{ key: '1', title: '节点' }]);
    t.checkable(true);
    t.onCheck((e) => { eventObj = e; });
  });

  tree.bindTo(document.body);

  const checkbox = tree._el.querySelector('input[type="checkbox"]');
  if (checkbox) {
    checkbox.checked = true;
    const changeEvent = new dom.window.Event('change', { bubbles: true });
    checkbox.dispatchEvent(changeEvent);
  }

  assert(eventObj !== null, '期望接收到事件对象');
  assert(eventObj.hasOwnProperty('event'), '期望 event 对象有 event 属性');
  assert(eventObj.hasOwnProperty('target'), '期望 event 对象有 target 属性');
  assert(eventObj.hasOwnProperty('checkedKeys'), '期望 event 对象有 checkedKeys 属性');
});

// ============================================
// 输出测试结果
// ============================================

console.log('\n──────────────────────────────────────────────────');
console.log(`测试完成：${passCount + failCount} 个测试，${passCount} 通过，${failCount} 失败`);
console.log('──────────────────────────────────────────────────\n');

if (failCount > 0) {
  process.exit(1);
}
