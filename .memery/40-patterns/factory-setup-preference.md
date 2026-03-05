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
