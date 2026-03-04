# 状态处理器模式

## 模式结构

```javascript
class MyComponent extends Tag {
  static _stateAttrs = ['disabled', 'active'];

  constructor(setup = null) {
    super('div', null);

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({ disabled: false, active: false });

    // 3. 注册状态处理器
    this._registerStateHandlers();

    // 4. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }
  }

  _registerStateHandlers() {
    this.registerStateHandler('disabled', (enabled, host) => {
      if (enabled) {
        host.styles({ opacity: '0.5', cursor: 'not-allowed' });
      } else {
        host.style('opacity', '');
        host.style('cursor', 'pointer');
      }
    });
  }

  // 链式方法
  disabled(value = true) {
    return this.setState('disabled', value);
  }
}
```

## 状态处理器签名

```javascript
registerStateHandler(stateName, (value, host) => {
  // value - 新状态值
  // host - 组件实例 (this)
});
```

## 状态拦截器

```javascript
registerStateInterceptor((stateName, value) => {
  // 返回 null 取消操作
  // 返回 { stateName, value } 继续执行
  if (this.hasState('locked') && stateName !== 'locked') {
    return null;  // 取消
  }
  return { stateName, value };  // 继续
});
```

## 状态快照

```javascript
// 保存快照
this.saveStateSnapshot('before-submit');

// 恢复快照
this.restoreStateSnapshot('before-submit');
```

## 状态变更流程

```
setState('disabled', true)
        ↓
执行拦截器链
  → 返回 null 则取消
  → 返回 { stateName, value } 继续
        ↓
更新 _currentState[stateName]
        ↓
执行状态处理器 (_executeHandlers)
        ↓
应用样式变更
```

## 最佳实践

| 实践 | 说明 |
|------|------|
| 使用静态 `_stateAttrs` | 子类可继承和扩展 |
| 状态处理器集中注册 | 在 `_registerStateHandlers` 中 |
| 链式方法调用 setState | `disabled() { return this.setState('disabled', value); }` |
| 处理器中修改样式 | 使用 `host.style()` 和 `host.styles()` |
| 考虑状态恢复 | 明确设置样式为空来恢复 |

## 相关文件

- `src/yoya/core/theme.js` - 状态机核心
- `src/yoya/components/menu.js` - MenuItem 完整示例
