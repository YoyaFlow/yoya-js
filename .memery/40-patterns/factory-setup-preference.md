# 工厂函数 Setup 使用优先级

## 原则

在使用本 JS 库时，工厂函数的初始化方式应遵循以下优先级：

## Setup 形式优先级

1. **setupString（字符串）** - 最简单，适用于纯文本内容
2. **setupObject（对象配置）** - 适用于属性/样式配置
3. **setup 函数（回调函数）** - 仅在需要复杂逻辑时使用

## 叶子节点优先使用 setupString

**叶子节点**（只包含文本内容的元素）应优先使用字符串 setup：

```javascript
// ✅ 推荐：叶子节点使用 setupString
vMenuItem('首页');
vButton('提交');
vCardHeader('标题');

// ❌ 不推荐：叶子节点使用 setup 函数
vMenuItem(item => {
  item.text('首页');
});

vButton(btn => {
  btn.text('提交');
});
```

## 使用场景对比

### setupString - 纯文本内容

```javascript
// 简单文本
div('Hello World');
vButton('点击我');
vCardHeader('卡片标题');
vMenuItem('菜单项');
```

### setupObject - 属性/样式配置

```javascript
// 对象配置
vButton({ text: '提交', type: 'primary' });
vInput({ placeholder: '请输入', disabled: true });
vCard({ class: 'custom-card', id: 'main' });
```

### setup 函数 - 复杂逻辑

```javascript
// 需要链式调用或复杂配置时才使用函数
vCard(c => {
  c.vCardHeader('标题');
  c.vCardBody('内容');
  c.vCardFooter(f => {
    f.child(vButton('取消'));
    f.child(vButton('确定'));
  });
});

// 需要条件逻辑时
vButton(btn => {
  btn.text(isSubmitting ? '提交中...' : '提交');
  btn.disabled(isSubmitting);
  btn.onclick(handleSubmit);
});
```

## 组合示例

```javascript
// ✅ 推荐：混合使用不同 setup 形式
vCard(c => {
  c.vCardHeader('卡片标题');           // setupString
  c.vCardBody({ class: 'content' });  // setupObject
  c.vCardFooter(f => {                // setup 函数（需要添加子元素）
    f.child(vButton('取消'));         // setupString
    f.child(vButton({                 // setupObject
      text: '确定',
      type: 'primary'
    }));
  });
});
```

## 代码对比

| 场景 | 推荐写法 | 不推荐写法 |
|------|----------|------------|
| 简单按钮 | `vButton('提交')` | `vButton(b => b.text('提交'))` |
| 菜单项 | `vMenuItem('首页')` | `vMenuItem(m => m.text('首页'))` |
| 卡片标题 | `vCardHeader('标题')` | `vCardHeader(h => h.text('标题'))` |
| 带属性按钮 | `vButton({ text: '提交', type: 'primary' })` | `vButton(b => { b.text('提交'); b.type('primary'); })` |
| 复杂卡片 | `vCard(c => {...})` | - |

## 好处

| 好处 | 说明 |
|------|------|
| 代码简洁 | 减少不必要的回调函数嵌套 |
| 可读性高 | 一眼看出元素内容 |
| 性能略优 | 避免创建额外的函数作用域 |
| 风格统一 | 团队代码风格一致 |

## 相关文件

- `src/yoya/core/basic.js` - Tag 基类和工厂函数
- `src/yoya/components/` - 各组件定义

## 演示页面规范

在 `/src/v1/examples` 演示界面中，**要对三种 setup 方式都要进行演示**：

```javascript
// 演示页面中应包含三种用法的示例
codeDemo('setupString',
  vButton('点击我'),
  `vButton('点击我')`
);

codeDemo('setupObject',
  vButton({ text: '提交', type: 'primary' }),
  `vButton({ text: '提交', type: 'primary' })`
);

codeDemo('setup 函数',
  vButton(btn => {
    btn.text('提交');
    btn.type('primary');
    btn.onclick(handleSubmit);
  }),
  `vButton(btn => {
  btn.text('提交')
  btn.type('primary')
})`
);
```

### 演示目的

| 目的 | 说明 |
|------|------|
| 教育用户 | 让用户了解三种初始化方式 |
| 对比展示 | 直观看到不同方式的代码差异 |
| 引导最佳实践 | 通过示例顺序引导用户使用推荐方式 |

### 示例顺序

演示页面应按照优先级顺序展示：
1. setupString（第一个展示，推荐）
2. setupObject（第二个展示）
3. setup 函数（最后展示，标注适用场景）

## 演示界面开发规范

在 `/src/v1/examples` 演示界面开发中，**尽可能使用基础库提供的链式调用快捷方法**：

### 优先使用 Tag 原型扩展方法

```javascript
// ✅ 推荐：使用 Tag 原型扩展的快捷方法
vCard(c => {
  c.div('内容区');
  c.span('文本');
  c.button('提交');
  c.h2('标题');
});

// ❌ 不推荐：每次都导入基础元素
vCard(c => {
  c.child(div('内容区'));
  c.child(span('文本'));
  c.child(button('提交'));
});
```

### 优先使用组件快捷方法

```javascript
// ✅ 推荐：使用组件提供的快捷方法
vMenu(m => {
  m.item('菜单项 1');
  m.item('菜单项 2');
  m.divider();
  m.group(g => {
    g.label('分组');
    g.item('项目 1');
  });
});

// ❌ 不推荐：手动创建子元素
vMenu(m => {
  m.child(vMenuItem('菜单项 1'));
  m.child(vMenuItem('菜单项 2'));
  m.child(vMenuDivider());
});
```

### 优先使用 vStack/hStack 等布局方法

```javascript
// ✅ 推荐：使用快捷布局方法
content.child(vstack(s => {
  s.gap('16px');
  s.div('上');
  s.div('下');
}));

// ❌ 不推荐：手动创建 Flex 布局
content.child(flex(f => {
  f.direction('column');
  f.gap('16px');
  f.div('上');
  f.div('下');
}));
```

### 导入语句精简

```javascript
// ✅ 推荐：只导入需要的组件和快捷方法
import {
  vCard, vCardHeader, vCardBody, vCardFooter,
  vMenu, vMenuItem, vMenuDivider, vMenuGroup,
  vstack, hstack, flex,
  vButton, toast,
} from '../../yoya/index.js';

// 无需导入 div, span, button 等基础方法
// 它们可以通过 Tag 原型方法调用
```

### 代码对比

| 场景 | 推荐写法 | 不推荐写法 |
|------|----------|------------|
| 添加子元素 | `c.div('内容')` | `c.child(div('内容'))` |
| 菜单项 | `m.item('文本')` | `m.child(vMenuItem('文本'))` |
| 垂直堆叠 | `vstack(s => {...})` | `flex(f => { f.column(); ... })` |
| 添加按钮 | `f.child(vButton('提交'))` | `f.child(button(b => b.text('提交')))` |

### 好处

| 好处 | 说明 |
|------|------|
| 代码简洁 | 减少嵌套和冗余调用 |
| 可读性高 | 链式调用更流畅 |
| 导入精简 | 减少 import 语句数量 |
| 风格统一 | 演示代码风格一致 |
| 示范作用 | 向用户展示最佳实践 |
