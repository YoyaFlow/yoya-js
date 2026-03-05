# 事件回调统一规范 - 实施总结

## 概述

已完成所有组件事件回调的统一规范化，将多参数回调格式改为统一的单对象参数格式。

## 核心变更

### 1. Tag 基类 (src/yoya/core/basic.js)

新增统一事件包装器和标准化事件方法：

```javascript
// 统一事件包装器
_wrapHandler(handler, buildContext) {
  return (e) => {
    const context = { event: e, target: this };
    if (buildContext) {
      Object.assign(context, buildContext(e, this));
    }
    handler(context);
  };
}

// 标准化事件方法
onClick(handler)      // {event, target}
onChangeValue(handler) // {event, value, oldValue, target}
onInputValue(handler)  // {event, value, target}
onToggle(handler)      // {event, value, oldValue, target}
onFocus(handler)       // {event, target}
onBlur(handler)        // {event, target}
onKey(handler)         // {event, key, code, target}
onMouseEnter(handler)  // {event, target}
onMouseLeave(handler)  // {event, target}
```

### 2. 表单组件 (src/yoya/components/form.js)

所有表单组件的 onChange/onInput 方法已更新为传递统一事件对象：

| 组件 | 事件 | 传递参数 |
|------|------|----------|
| VInput | onChange | `{event, value, oldValue, target}` |
| VInput | onInput | `{event, value, target}` |
| VSelect | onChange | `{event, value, oldValue, target}` |
| VTextarea | onChange | `{event, value, oldValue, target}` |
| VTextarea | onInput | `{event, value, target}` |
| VCheckbox | onChange | `{event, value, oldValue, target}` |
| VSwitch | onChange | `{event, value, oldValue, target}` |
| VCheckboxes | onChange | `{event, value, oldValue, target}` |
| VTimer | onChange | `{event, value, oldValue, target}` |
| VTimer2 | onChange | `{event, value, oldValue, target}` |

### 3. UI 组件

| 组件 | 事件 | 传递参数 |
|------|------|----------|
| VButton | onClick | `{event, target}` |
| VMenuItem | onClick | `{event, text, icon, target}` |
| VCode | onCopy | `{event, value, target}` |
| VForm | onSubmit | `{event, target}` |

## 使用方式

### 解构形式（推荐用于简单场景）

```javascript
vButton('提交').onClick(({event, target}) => {
  console.log('点击', target);
});

vInput().onChange(({event, value, oldValue}) => {
  console.log('值从', oldValue, '变为', value);
});
```

### 简化形式（推荐用于嵌套作用域）

```javascript
vCard(c => {
  c.child(vInput().onChange((e) => {
    console.log('输入 1:', e.value);
  }));
  c.child(vInput().onChange((e) => {
    console.log('输入 2:', e.value);
  }));
});
```

## 类型定义更新

### Tag 基类 (src/yoya/index.d.ts)

```typescript
declare class Tag {
  onClick(handler: (e: { event: MouseEvent; target: Tag }) => void): this;
  onChangeValue(handler: (e: { event: Event; value: any; oldValue?: any; target: Tag }) => void): this;
  onInputValue(handler: (e: { event: Event; value: any; target: Tag }) => void): this;
  onToggle(handler: (e: { event: Event; value: boolean; oldValue?: boolean; target: Tag }) => void): this;
  onFocus(handler: (e: { event: FocusEvent; target: Tag }) => void): this;
  onBlur(handler: (e: { event: FocusEvent; target: Tag }) => void): this;
  onKey(handler: (e: { event: KeyboardEvent; key: string; code: string; target: Tag }) => void): this;
  onMouseEnter(handler: (e: { event: MouseEvent; target: Tag }) => void): this;
  onMouseLeave(handler: (e: { event: MouseEvent; target: Tag }) => void): this;
}
```

### 组件类型 (src/yoya/components/index.d.ts)

所有组件类型定义已更新，遵循统一的事件回调格式。

## 迁移指南

### 旧代码格式

```javascript
// ❌ 旧格式：参数不统一
vButton().onclick((e, btn) => {...});
vInput().onchange((value, e) => {...});
vSwitch().onchange((checked) => {...});
```

### 新代码格式

```javascript
// ✅ 新格式：统一单对象参数
vButton().onClick(({event, target}) => {...});
vInput().onChange(({event, value, oldValue, target}) => {...});
vSwitch().onChange(({event, value, oldValue, target}) => {...});
```

## 好处

| 好处 | 说明 |
|------|------|
| 自描述性 | 属性名清晰表达含义 |
| 灵活性 | 只解构需要的属性 |
| 扩展性 | 可以轻松添加新属性 |
| 一致性 | 所有事件使用统一格式 |
| 避免混淆 | 不会搞混参数顺序 |
| 嵌套友好 | 使用 `e.value` 不会有命名冲突 |

## 相关文件

- `src/yoya/core/basic.js` - Tag 基类和统一事件包装器
- `src/yoya/index.d.ts` - Tag 基类类型定义
- `src/yoya/components/form.js` - 表单组件
- `src/yoya/components/button.js` - 按钮组件
- `src/yoya/components/menu.js` - 菜单组件
- `src/yoya/components/code.js` - 代码组件
- `src/yoya/components/index.d.ts` - 组件类型定义
- `.memery/40-patterns/event-handler-pattern.md` - 事件处理规范文档

## Git 提交

- `64a3c8a` fix: 更新 MenuItem 和 VCode 事件回调为统一格式
- `f08f3c2` fix: 更新 form 组件事件回调为统一格式
- `01eaa8f` feat: 更新事件回调类型定义
- `3aa31c0` feat: 统一事件回调为单对象参数格式
- `0b250ce` docs: 添加事件处理规范 - 统一事件对象传递规则
