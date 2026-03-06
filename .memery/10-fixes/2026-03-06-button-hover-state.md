# Button 组件 hover 状态修复

## 问题
按钮在点击后，hover 样式没有正确恢复。初始化和 hover 后离开时样式不一致。

## 原因分析
1. 原来的实现在 `mouseenter` 和 `mouseleave` 事件中直接操作样式，没有通过状态机管理
2. 初始化时缺少调用 `_applyTypeStyles()`，导致默认类型样式没有应用

## 解决方案

### 1. 添加 `hovered` 状态属性
```javascript
static _stateAttrs = ['disabled', 'loading', 'block', 'ghost', 'hovered'];
```

### 2. 初始化状态
```javascript
this.initializeStates({
  disabled: false,
  loading: false,
  block: false,
  ghost: false,
  hovered: false,
  type: 'default'
});
```

### 3. 应用默认类型样式（关键修复）
在构造函数中，保存基础样式快照后，立即应用默认类型样式：
```javascript
// 4. 保存基础样式快照
this.saveBaseStylesSnapshot();

// 4.5. 应用默认类型样式
this._applyTypeStyles();  // <-- 关键：初始化默认样式
```

### 4. 使用状态机管理 hover 事件
```javascript
// 在 _setupBaseStyles() 中
this.on('mouseenter', () => {
  this.setState('hovered', true);
});

this.on('mouseleave', () => {
  this.setState('hovered', false);
});
```

### 5. 添加状态处理器
```javascript
this.registerStateHandler('hovered', (isHovered, host) => {
  if (isHovered && !host.hasState('disabled') && !host.hasState('loading')) {
    host.styles(host._getHoverStyles());
  } else {
    host._applyTypeStyles();  // hover 离开时恢复默认类型样式
  }
});
```

## 优势
1. **状态一致性**：所有状态变更都通过状态机，确保样式始终一致
2. **自动恢复**：状态变更时自动调用处理器，无需手动恢复样式
3. **状态互斥**：可以方便地在状态处理器中检查其他状态（如 disabled、loading）
4. **代码清晰**：hover 逻辑集中在状态处理器中，易于维护

## 相关文件
- `src/yoya/components/button.js`
