# VTree 组件重构设计

**日期**: 2026-03-23
**状态**: 已批准
**作者**: Claude Code

---

## 概述

重构 VTree 组件，将混乱的 `interaction.js` 中的 VTree 和 VTreeSelect 拆分到独立的 `tree.js` 文件中，简化代码结构，保留核心功能。

---

## 问题分析

### 当前实现的问题

| 问题 | 描述 | 影响 |
|------|------|------|
| 文件结构混乱 | VTree/VTreeSelect 在 interaction.js 中，与 Tooltip/Popover 等混在一起 | 代码难以维护和查找 |
| 代码冗余 | 1301 行的大文件，职责不清晰 | 增加理解和修改难度 |
| 事件系统不统一 | 未完全适配新的按需绑定事件系统 | 事件绑定可能有问题 |

### 核心设计原则

1. **单一职责** - `tree.js` 只包含 VTree 和 VTreeSelect
2. **组件拆分** - VTree（基础树）和 VTreeSelect（树形选择器）独立组件
3. **简化 API** - 只保留核心功能，移除复杂配置
4. **统一事件** - 使用新的按需绑定事件系统

---

## 设计方案

### 文件结构

```
src/yoya/components/
├── tree.js          # 新增：VTree 和 VTreeSelect 组件
├── interaction.js   # 修改：删除 VTree 和 VTreeSelect
└── index.js         # 修改：添加 tree.js 导出

src/yoya/components/
└── index.d.ts       # 修改：更新类型定义
```

### 组件 API

#### VTree - 基础树组件

```javascript
import { vTree } from '../yoya/index.js';

// 基础用法
vTree(t => {
  t.data(treeData);
  t.checkable(true);

  t.onSelect(({event, node, selectedKeys, target}) => {
    console.log('选中节点:', node);
  });

  t.onCheck(({event, checkedKeys, target}) => {
    console.log('勾选节点:', checkedKeys);
  });

  t.onExpand(({event, expandedKeys, target}) => {
    console.log('展开节点:', expandedKeys);
  });
});
```

#### VTreeSelect - 树形选择器

```javascript
import { vTreeSelect } from '../yoya/index.js';

vTreeSelect(ts => {
  ts.data(treeData);
  ts.placeholder('请选择');
  ts.value('some-key');
  ts.onChange(({value, node}) => {
    console.log('选择变化:', value, node);
  });
});
```

### 数据结构

```typescript
interface VTreeNode {
  key: string;                    // 必需，唯一标识
  title: string|Tag;              // 必需，节点标题（支持字符串或 Tag 实例）
  children?: VTreeNode[];         // 子节点数组
  disabled?: boolean;             // 禁用节点
  selectable?: boolean;           // 是否可选中（覆盖全局）
  checkable?: boolean;            // 是否可勾选（覆盖全局）
  icon?: string|Tag;              // 节点图标
  isLeaf?: boolean;               // 是否叶子节点（用于异步加载场景）
  data?: Record<string, any>;     // 自定义数据
}
```

### 核心方法

#### VTree 方法

| 方法 | 参数 | 说明 | 返回值 |
|------|------|------|--------|
| `data(value)` | `VTreeNode[]` | 设置树形数据 | `this` |
| `checkable(value)` | `boolean` | 是否显示复选框 | `this` / `boolean` |
| `expandAll()` | - | 展开所有节点 | `this` |
| `collapseAll()` | - | 收起所有节点 | `this` |
| `expandedKeys(value)` | `string[]` | 设置/获取展开的节点 keys | `this` / `string[]` |
| `checkedKeys(value)` | `string[]` | 设置/获取勾选的节点 keys | `this` / `string[]` |
| `selectedKeys(value)` | `string[]` | 设置/获取选中的节点 keys | `this` / `string[]` |
| `onSelect(handler)` | `(e) => void` | 节点选中事件 | `this` |
| `onCheck(handler)` | `(e) => void` | 节点勾选事件 | `this` |
| `onExpand(handler)` | `(e) => void` | 节点展开事件 | `this` |

**注意**：`checkable`, `expandedKeys`, `checkedKeys`, `selectedKeys` 支持 getter/setter 双重模式：
- 无参数调用时返回当前值
- 传入参数时设置值并返回 `this`

#### VTreeSelect 方法

| 方法 | 参数 | 说明 | 返回值 |
|------|------|------|--------|
| `data(value)` | `VTreeNode[]` | 设置树形数据 | `this` |
| `placeholder(value)` | `string` | 占位符文本 | `this` |
| `value(val)` | `string` | 设置/获取选中值 | `this` / `string` |
| `onChange(handler)` | `(e) => void` | 选择变化事件 | `this` |

### 复选框行为

1. **级联勾选**
   - 勾选父节点 → 自动勾选所有子节点
   - 取消勾选父节点 → 自动取消所有子节点
   - 勾选子节点 → 自动更新父节点状态（全选/半选/未选）

2. **半选状态 (indeterminate)**
   - 子节点部分勾选时，父节点显示 `-` 状态（indeterminate）
   - 点击半选状态的父节点 → 勾选所有子节点

3. **始终多选**
   - 移除单选模式，复选框始终支持多选

### 事件对象格式

统一使用新事件系统的单对象参数格式：

```javascript
// onSelect
{
  event: MouseEvent,
  node: VTreeNode,
  selectedKeys: string[],
  target: VTree
}

// onCheck
{
  event: Event,
  node: VTreeNode,        // 触发事件的节点
  checkedKeys: string[],
  target: VTree
}

// onExpand
{
  event: Event,
  expandedKeys: string[],
  target: VTree
}

// VTreeSelect onChange
{
  event: Event,
  value: string,
  node: VTreeNode,
  target: VTreeSelect
}
```

---

## 删除的内容

### 从 interaction.js 删除
- `class VTree` (第 759-1048 行)
- `class VTreeSelect` (第 1049-1301 行)
- 相关的工厂函数和原型扩展

### 从 components/index.d.ts 删除
- `VTreeNode` 接口（重新在 tree.js 中定义）
- `VTree` 类类型定义
- `vTree` 函数类型定义
- `VTreeSelect` 类类型定义
- `vTreeSelect` 函数类型定义

---

## 迁移指南

### 从旧 VTree 迁移

```javascript
// 旧代码
import { vTree } from '../yoya/components/interaction.js';

vTree(t => {
  t.data(treeData);
  t.checkable(true);
  t.onSelect((node) => {...});  // 旧事件格式
  t.onCheck((keys) => {...});   // 旧事件格式
});

// 新代码
import { vTree } from '../yoya/index.js';

vTree(t => {
  t.data(treeData);
  t.checkable(true);
  t.onSelect(({event, node, selectedKeys, target}) => {...});  // 新事件格式
  t.onCheck(({event, checkedKeys, target}) => {...});          // 新事件格式
});
```

---

## 验收标准

1. **功能性**
   - [ ] VTree 支持树形数据展示
   - [ ] VTree 支持展开/收起节点
   - [ ] VTree 支持节点选中
   - [ ] VTree 支持复选框（级联勾选 + 半选状态）
   - [ ] VTreeSelect 支持下拉选择
   - [ ] 事件系统使用统一格式

2. **代码质量**
   - [ ] tree.js 文件结构清晰
   - [ ] 代码有充分注释
   - [ ] 类型定义完整

3. **测试**
   - [ ] 基础功能测试通过
   - [ ] 复选框级联测试通过
   - [ ] 事件系统测试通过

---

## 相关文件

| 文件 | 操作 | 内容 |
|------|------|------|
| `src/yoya/components/tree.js` | 新建 | VTree 和 VTreeSelect 组件实现 |
| `src/yoya/components/interaction.js` | 修改 | 删除 VTree 和 VTreeSelect |
| `src/yoya/components/index.js` | 修改 | 添加 tree.js 导出 |
| `src/yoya/components/index.d.ts` | 修改 | 更新类型定义 |

---

## 后续步骤

1. 写入设计文档（本文档）
2. Spec Review Loop
3. User Review
4. 创建实施计划（writing-plans）
5. 执行实施（subagent-driven-development）
