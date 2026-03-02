/**
 * Yoya.Basic 单元测试
 * 在 Node.js 环境中使用 jsdom 测试核心功能
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
  const id = `test-${testId++}`;
  const container = dom.window.document.createElement('div');
  container.id = id;
  dom.window.document.body.appendChild(container);
  return `#${id}`;
}

// 导入库
import {
  div, span, p, h1, button, input, form, label,
  ul, ol, li, table, tr, td, th
} from '../src/yoya/index.js';

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
  'div 工厂函数创建元素': () => {
    const el = div();
    assert(el instanceof Object, '应该创建元素对象');
    assert(typeof el.bindTo === 'function', '应该有 bindTo 方法');
    assert(typeof el.renderDom === 'function', '应该有 renderDom 方法');
  },

  'div 工厂函数接受 setup 函数': () => {
    const el = div(box => {
      box.class('test-class');
    });
    assert(el._classes.has('test-class'), '应该设置 class');
  },

  'div 工厂函数接受字符串': () => {
    const el = div('Hello World');
    assert(el._children.length === 1, '应该有一个子元素');
    assert(el._children[0] instanceof Object, '子元素应该是 Text 对象');
    assertEquals(el._children[0]._content, 'Hello World', '应该设置文本内容');
  },

  'div 工厂函数接受对象配置': () => {
    const el = div({
      class: 'container',
      style: { color: 'red' },
      id: 'test'
    });
    assert(el._classes.has('container'), '应该设置 class');
    assertEquals(el._styles.color, 'red', '应该设置 style');
    assertEquals(el._attrs.id, 'test', '应该设置 id');
  },

  '链式调用返回 this': () => {
    const el = div(box => {
      const result = box.class('a').style('color', 'red');
      assert(result === box, '链式调用应该返回元素本身');
    });
  },

  '事件绑定': () => {
    let clicked = false;
    const el = div(box => {
      box.on('click', () => { clicked = true; });
    });
    const container = createContainer();
    el.bindTo(container);
    el._boundElement.dispatchEvent(new dom.window.MouseEvent('click'));
    assert(clicked, '事件应该被触发');
  },

  '子元素添加': () => {
    const child = span('child');
    const parent = div(box => {
      box.child(child);
    });
    assertEquals(parent._children.length, 1, '应该有一个子元素');
  },

  'renderDom 创建真实 DOM': () => {
    const container = createContainer();
    const el = div({ id: 'test', class: 'container' });
    el.bindTo(container);
    const domEl = el._boundElement;
    assert(domEl !== null, '应该创建真实 DOM 元素');
    assert(domEl.classList.contains('container'), '应该应用 class');
  },

  'setup 对象配置的事件处理': () => {
    let called = false;
    const el = div({
      onclick: () => { called = true; }
    });
    const container = createContainer();
    el.bindTo(container);
    el._boundElement.dispatchEvent(new dom.window.MouseEvent('click'));
    assert(called, 'onclick 事件应该被触发');
  },

  '表格扩展方法': () => {
    const tbl = table(t => {
      t.tr(row => {
        row.td('cell1');
        row.td('cell2');
      });
    });
    assert(tbl._children.length === 1, '应该有一个 tr 子元素');
    assert(tbl._children[0]._children.length === 2, 'tr 应该有两个 td 子元素');
  },

  '列表扩展方法': () => {
    const list = ul(l => {
      l.li('item1');
      l.li('item2');
      l.li('item3');
    });
    assertEquals(list._children.length, 3, '应该有三个 li 子元素');
  },

  '表单元素属性': () => {
    const inp = input(i => {
      i.type('text');
      i.placeholder('请输入');
      i.value('test');
    });
    assertEquals(inp._attrs.type, 'text', '应该设置 type');
    assertEquals(inp._attrs.placeholder, '请输入', '应该设置 placeholder');
    assertEquals(inp._attrs.value, 'test', '应该设置 value');
  },

  'toHTML 方法': () => {
    const el = div({ id: 'test', class: 'box' });
    const html = el.toHTML();
    assert(html.includes('<div'), '应该包含 div 开始标签');
    assert(html.includes('id="test"'), '应该包含 id 属性');
    assert(html.includes('class="box"'), '应该包含 class 属性');
    assert(html.includes('</div>'), '应该包含 div 结束标签');
  },

  'deleted 标记': () => {
    const child = span('to delete');
    child._deleted = true;
    const parent = div(box => {
      box.child(child);
    });
    const container = createContainer();
    parent.bindTo(container);
    const domChildren = parent._boundElement.children;
    assertEquals(domChildren.length, 0, 'deleted 元素不应该渲染到 DOM');
  },

  'Tag 原型扩展方法 - header': () => {
    const parent = div();
    parent.header(h => h.text('标题'));
    assertEquals(parent._children.length, 1, '应该有一个子元素');
    assert(parent._children[0] instanceof Object, '子元素应该是 header 元素');
  },

  'Tag 原型扩展方法 - 链式调用': () => {
    const parent = div();
    const result = parent.header('标题 1').h2('标题 2').p('段落');
    assert(result === parent, '应该返回父元素本身');
    assertEquals(parent._children.length, 3, '应该有三个子元素');
  },

  'Tag 原型扩展方法 - 任意元素使用': () => {
    const btn = button();
    btn.span('按钮文本');
    btn.strong(' 强调 ');
    assertEquals(btn._children.length, 2, 'button 内可以添加 span 和 strong');
  }
};

// 运行测试
function runTests() {
  console.log('\n🧪 开始运行测试...\n');

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

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`测试完成：${passed + failed} 个测试，${passed} 通过，${failed} 失败`);
  console.log(`${'─'.repeat(50)}\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
