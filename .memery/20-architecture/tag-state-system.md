# 状态机系统架构

## 位置
`src/yoya/core/theme.js`

## 核心功能

| 功能 | 说明 |
|------|------|
| 状态属性注册 | `registerStateAttrs(...attrs)` |
| 状态设置/获取 | `setState(name, value)`, `getState(name)` |
| 状态拦截器 | `registerStateInterceptor(fn)` |
| 状态快照 | `saveStateSnapshot(name)`, `restoreStateSnapshot(name)` |
| 状态处理器 | `registerStateHandler(name, fn)` |

## 避免循环依赖

```
theme.js (不导入 Tag)
    ↓ 导出 initTagExtensions
index.js (导入 Tag 和 initTagExtensions)
    ↓ 调用 initTagExtensions(Tag)
Tag.prototype 被扩展
```

## 状态类型

```javascript
tag.registerStateAttrs(
  'disabled',              // boolean (默认)
  { size: 'string' },      // string
  { count: 'number' }      // number
);
```

## 状态变更流程

```
setState('disabled', true)
    ↓
执行拦截器链 → 返回 null 则取消
    ↓
更新 _currentState[stateName]
    ↓
执行状态处理器 (_executeHandlers)
    ↓
应用样式变更
```

## MenuItem 使用示例

```javascript
class MenuItem extends Tag {
  static _stateAttrs = ['disabled', 'active', 'danger', 'hoverable'];

  constructor() {
    super('div', null);
    this.registerStateAttrs(...this.constructor._stateAttrs);
    this._registerStateHandlers();
    this.saveStateSnapshot('base');
  }

  _registerStateHandlers() {
    this.registerStateHandler('disabled', (enabled, host) => {
      if (enabled) {
        host.styles({ opacity: '0.5', cursor: 'not-allowed' });
      } else {
        host.styles({ opacity: '1', cursor: 'pointer' });
      }
    });
  }
}
```

## 相关文件

- `src/yoya/core/theme.js` - 状态机核心实现
- `src/yoya/components/menu.js` - MenuItem 使用示例
