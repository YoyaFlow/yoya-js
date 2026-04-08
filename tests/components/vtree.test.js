/**
 * VTree 组件单元测试
 */

import { JSDOM } from 'jsdom';
import { vTree, vTreeSelect } from '../../src/yoya/index.js';

// 设置 JSDOM 环境
const dom = new JSDOM('<!DOCTYPE html><html><body><div id="app"></div></body></html>');
global.window = dom.window;
global.document = dom.window.document;

// 简单的断言函数
function assert(condition, message) {
  if (!condition) {
    throw new Error(`❌ ${message}`);
  }
  console.log(`✅ ${message}`);
}

console.log('🧪 VTree 组件测试开始...\n');

// 测试数据
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

try {
  // Test 1: 创建 VTree 实例
  console.log('Test 1: 创建 VTree 实例');
  const tree = vTree(t => {
    t.data(treeData);
    t.checkable(true);
  });
  assert(tree !== null, 'VTree 实例创建成功');

  // Test 2: data 方法
  console.log('\nTest 2: data 方法');
  const newData = [{ key: 'test', title: '测试' }];
  tree.data(newData);
  assert(tree.data().length === 1, 'data() 设置和获取正确');

  // Test 3: checkable 方法
  console.log('\nTest 3: checkable 方法');
  tree.checkable(false);
  assert(tree.checkable() === false, 'checkable() 设置和获取正确');

  // Test 4: expandedKeys 方法
  console.log('\nTest 4: expandedKeys 方法');
  tree.expandedKeys(['1', '2']);
  assert(tree.expandedKeys().length === 2, 'expandedKeys() 设置和获取正确');

  // Test 5: checkedKeys 方法
  console.log('\nTest 5: checkedKeys 方法');
  // 使用叶子节点测试（没有子节点），避免级联计算影响
  tree.data([{ key: 'leaf1', title: '叶子节点 1' }, { key: 'leaf2', title: '叶子节点 2' }]);
  tree.checkedKeys(['leaf1']);
  const checkedResult = tree.checkedKeys();
  assert(checkedResult.includes('leaf1'), 'checkedKeys() 设置和获取正确');

  // Test 6: selectedKeys 方法
  console.log('\nTest 6: selectedKeys 方法');
  tree.selectedKeys(['2']);
  assert(tree.selectedKeys().includes('2'), 'selectedKeys() 设置和获取正确');

  // Test 7: 事件绑定
  console.log('\nTest 7: 事件绑定');
  let onSelectCalled = false;
  let onCheckCalled = false;
  let onExpandCalled = false;

  vTree(t => {
    t.data(treeData);
    t.onSelect(() => { onSelectCalled = true; });
    t.onCheck(() => { onCheckCalled = true; });
    t.onExpand(() => { onExpandCalled = true; });
  });

  assert(onSelectCalled === false, 'onSelect 事件未触发（正确）');
  assert(onCheckCalled === false, 'onCheck 事件未触发（正确）');
  assert(onExpandCalled === false, 'onExpand 事件未触发（正确）');

  // Test 8: expandAll 和 collapseAll
  console.log('\nTest 8: expandAll 和 collapseAll');
  const tree2 = vTree(t => {
    t.data(treeData);
  });
  tree2.expandAll();
  // expandAll 应该返回 this
  assert(tree2.expandAll() === tree2, 'expandAll() 返回 this');
  assert(tree2.collapseAll() === tree2, 'collapseAll() 返回 this');

  // Test 9: VTreeSelect 创建
  console.log('\nTest 9: VTreeSelect 创建');
  const treeSelect = vTreeSelect(ts => {
    ts.data(treeData);
    ts.placeholder('请选择');
    ts.value('1');
  });
  assert(treeSelect !== null, 'VTreeSelect 实例创建成功');
  assert(treeSelect.value() === '1', 'VTreeSelect value 正确');
  assert(treeSelect.placeholder() === '请选择', 'VTreeSelect placeholder 正确');

  // Test 10: VTreeSelect onChange 事件
  console.log('\nTest 10: VTreeSelect onChange 事件');
  let onChangeCalled = false;
  vTreeSelect(ts => {
    ts.data(treeData);
    ts.onChange(() => { onChangeCalled = true; });
  });
  assert(onChangeCalled === false, 'onChange 事件未触发（正确）');

  console.log('\n✅ 所有测试通过！');

} catch (error) {
  console.error('\n❌ 测试失败:', error.message);
  process.exit(1);
}
