/**
 * Yoya.Basic 事件系统单元测试
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
import { div, input, Tag } from '../src/yoya/index.js';

// 测试断言
function assert(condition, message) {
  if (!condition) {
    throw new Error(`❌ 测试失败：${message}`);
  }
}

function assertEquals(actual, expected, message) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`❌ 测试失败：${message}\n   期望：${JSON.stringify(expected)}\n   实际：${JSON.stringify(actual)}`);
  }
}

// 模拟 fn() 函数
function createMockFn() {
  const mockFn = function(...args) {
    mockFn.calls.push(args);
  };
  mockFn.calls = [];
  mockFn.timesCalled = function() {
    return this.calls.length;
  };
  return mockFn;
}

// 测试用例
const tests = {
  '应该支持多次绑定同一事件类型': () => {
    const clickHandler1 = createMockFn();
    const clickHandler2 = createMockFn();

    const el = div('点击我');
    el.on('click', clickHandler1);
    el.on('click', clickHandler2);

    const container = createContainer();
    el.bindTo(container);

    el._el.click();

    assertEquals(clickHandler1.timesCalled(), 1, 'handler1 应该被调用 1 次');
    assertEquals(clickHandler2.timesCalled(), 1, 'handler2 应该被调用 1 次');
  },

  '应该支持动态添加事件处理器': () => {
    const clickHandler1 = createMockFn();
    const clickHandler2 = createMockFn();

    const el = div('点击我');
    el.on('click', clickHandler1);

    const container = createContainer();
    el.bindTo(container);

    // 先触发一次
    el._el.click();
    assertEquals(clickHandler1.timesCalled(), 1, 'handler1 应该被调用 1 次');

    // 动态添加第二个处理器
    el.on('click', clickHandler2);

    // 再次触发，两个处理器都应该被调用
    el._el.click();
    assertEquals(clickHandler1.timesCalled(), 2, 'handler1 应该被调用 2 次');
    assertEquals(clickHandler2.timesCalled(), 1, 'handler2 应该被调用 1 次');
  },

  '应该按需绑定 DOM 事件监听器': () => {
    const el = div('测试');
    el.bindTo(createContainer());

    // 初始时没有绑定任何事件
    assertEquals(el._boundEvents, {}, '初始时 _boundEvents 应该为空对象');

    // 绑定 click 事件
    el.on('click', createMockFn());
    assertEquals(el._boundEvents, { click: true }, '绑定 click 后应该包含 click: true');

    // 再次绑定 click 事件，_boundEvents 不变
    el.on('click', createMockFn());
    assertEquals(el._boundEvents, { click: true }, '再次绑定 click 应该保持不变');

    // 绑定 mouseenter 事件
    el.on('mouseenter', createMockFn());
    assertEquals(el._boundEvents, { click: true, mouseenter: true }, '绑定 mouseenter 后应该包含两个事件');
  },

  'onClick 应该传递统一事件对象': () => {
    let capturedContext = null;
    const handler = createMockFn();

    const wrapper = function(context) {
      handler(context);
      capturedContext = context;
    };

    const el = div('点击我');
    el.onClick(wrapper);
    el.bindTo(createContainer());

    el._el.click();

    assertEquals(handler.timesCalled(), 1, 'handler 应该被调用 1 次');
    assert(capturedContext !== null, 'context 不应该为空');
    assert(Object.prototype.hasOwnProperty.call(capturedContext, 'event'), 'context 应该有 event 属性');
    assert(Object.prototype.hasOwnProperty.call(capturedContext, 'target'), 'context 应该有 target 属性');
    assertEquals(capturedContext.target, el, 'target 应该是虚拟元素 el');
  },

  'onChangeValue 应该传递 value 和 oldValue': () => {
    let capturedContext = null;
    const handler = createMockFn();

    const wrapper = function(context) {
      handler(context);
      capturedContext = context;
    };

    // 使用 input 工厂函数创建 Input 元素
    const el = input({
      value: 'initial'
    });
    el.onChangeValue(wrapper);

    const container = createContainer();
    el.bindTo(container);

    // 修改值并触发 change 事件
    el._el.value = 'changed';
    el._el.dispatchEvent(new dom.window.Event('change'));

    assertEquals(handler.timesCalled(), 1, 'handler 应该被调用 1 次');
    assert(capturedContext !== null, 'context 不应该为空');
    assertEquals(capturedContext.value, 'changed', 'value 应该是 changed');
    assertEquals(capturedContext.oldValue, 'initial', 'oldValue 应该是 initial');
  }
};

// 运行测试
function runTests() {
  console.log('\n🧪 开始运行事件系统测试...\n');

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
