# Yoya.Basic 状态机与主题系统架构

## 概述

本架构实现了基于状态机的元素状态管理系统和可插拔的主题系统，提供了：

- **状态机机制**：通过 `_stateAttrs` 定义关注的状态属性
- **拦截器机制**：每个组件可以注册状态变更拦截器
- **初始化/恢复**：支持状态的初始化和恢复初始化
- **主题系统**：独立的主题注册和管理机制
- **多类型支持**：支持 boolean、string、number 多种状态值类型

## 状态值类型

| 类型 | 说明 | 示例 | 默认值 |
|-----|------|------|--------|
| `boolean` | 开关型状态 | disabled, active, selected | false |
| `string` | 枚举型状态 | size, variant, status | '' |
| `number` | 数值型状态 | count, progress, level | 0 |

## 核心组件

### 1. StateMachine 状态机

```
src/yoya/core/theme.js
```

**状态机生命周期**：
```
创建 → 注册状态属性 → 注册处理器 → 初始化 → 状态变更 → 销毁
```

**核心 API**：

| 方法 | 说明 |
|-----|------|
| `registerStateAttrs(...attrs)` | 注册关注的状态属性（支持类型定义） |
| `registerHandler(stateName, handler)` | 注册状态处理器 |
| `registerInterceptor(interceptor)` | 注册状态变更拦截器 |
| `setState(stateName, value)` | 设置状态（boolean/string/number） |
| `getState(stateName)` | 获取状态值 |
| `getBooleanState(stateName)` | 获取布尔状态值 |
| `getStringState(stateName)` | 获取字符串状态值 |
| `getNumberState(stateName)` | 获取数值状态值 |
| `getAllStates()` | 获取所有状态 |
| `hasState(stateName)` | 检查状态（适用于 boolean） |
| `saveSnapshot(name)` | 保存状态快照 |
| `restoreSnapshot(name)` | 恢复状态快照 |
| `initialize(defaultStates)` | 初始化状态 |
| `deinitialize()` | 恢复到初始化前 |
| `reset()` | 重置所有状态（根据类型使用默认值） |

**注册状态属性 - 支持类型定义**：

```javascript
// 方式 1：默认 boolean 类型
this.registerStateAttrs('disabled', 'active');

// 方式 2：指定类型
this.registerStateAttrs(
  { size: 'string' },
  { count: 'number' }
);

// 方式 3：混合使用
this.registerStateAttrs(
  'disabled',              // boolean
  { size: 'string' },      // string
  { count: 'number' }      // number
);
```

### 2. Theme 主题类

**主题结构**：
```javascript
{
  name: 'dark',
  stateStyles: { /* 状态样式 */ },
  stateHandlers: { /* 状态处理器 */ },
  componentThemes: {
    MenuItem: {
      stateStyles: { disabled: {...}, active: {...} },
      handlers: { loading: (enabled, host) => {...} }
    }
  }
}
```

### 3. ThemeManager 主题管理器

**全局单例**：`themeManager`

**主题切换流程**：
```
创建主题 → 注册主题 → setTheme(name) → applyTheme(component)
```

## 组件集成模式

### MenuItem 示例

```javascript
class MenuItem extends Tag {
  // 1. 定义状态属性列表
  static _stateAttrs = ['disabled', 'active', 'danger', 'hoverable'];

  constructor(content = '', setup = null) {
    super('div', null);

    // 2. 初始化状态机
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 3. 注册状态处理器
    this._registerStateHandlers();

    // 4. 保存基础样式快照
    this.saveStateSnapshot('base');

    // 5. 注册拦截器
    this._registerHoverInterceptor();

    // 6. 设置交互处理器
    this._setupInteractions();

    // 7. 执行 setup 和初始化
    if (setup !== null) this.setup(setup);
    this.initializeStates({ disabled: false, active: false });

    if (content) this.text(content);
  }

  _registerStateHandlers() {
    // disabled 状态处理器
    this.registerStateHandler('disabled', (enabled, host) => {
      if (enabled) {
        host.styles({ opacity: '0.5', cursor: 'not-allowed' });
      } else {
        host.style('opacity', '');
        host.style('cursor', 'pointer');
      }
    });

    // active 状态处理器
    this.registerStateHandler('active', (enabled, host) => {
      if (enabled) {
        host.styles({ background: 'rgba(102, 126, 234, 0.1)' });
      } else {
        host.style('background', '');
      }
    });
  }

  _registerHoverInterceptor() {
    this.registerStateInterceptor((stateName, enabled) => {
      // 禁用状态下拦截所有状态变更
      if (this.hasState('disabled') && stateName !== 'disabled') {
        return null;  // 取消操作
      }
      return { stateName, enabled };
    });
  }

  // 快捷方法
  disabled() { return this.setState('disabled', true); }
  enabled() { return this.setState('disabled', false); }
  active() { return this.setState('active', true); }
  toggleState(stateName) { return this.setState(stateName, !this.hasState(stateName)); }
}
```

## 状态变更流程

```
用户调用 setState('disabled', true)
        ↓
执行拦截器链 → 返回 null 则取消
        ↓
更新 _currentState[stateName]
        ↓
执行状态处理器 (_executeHandlers)
        ↓
应用样式变更
```

## 主题使用示例

### 创建主题

### String 状态使用示例

```javascript
import { createTheme, themeManager } from '../yoya/index.js';

// 深色主题
const darkTheme = createTheme('dark', {
  MenuItem: {
    disabled: { opacity: '0.3', cursor: 'not-allowed' },
    active: { background: 'rgba(102, 126, 234, 0.3)', color: '#fff' },
    danger: { color: '#ff6b6b' }
  }
});

// 注册主题
darkTheme.register();
themeManager.registerTheme(darkTheme);

// 切换主题
themeManager.setTheme('dark');
```

### 自定义状态处理器

```javascript
import { Theme } from '../yoya/index.js';

const theme = new Theme('custom');

// 为 MenuItem 添加 loading 状态处理器
theme.setComponentStateHandler('MenuItem', 'loading', (enabled, host) => {
  if (enabled) {
    host.style('background', 'url(loading-spinner.gif) no-repeat center');
    host.style('pointerEvents', 'none');
  } else {
    host.style('background', '');
    host.style('pointerEvents', '');
  }
});

theme.register();
```

## 状态快照使用场景

### 表单提交

```javascript
// 保存状态
menuItem.saveStateSnapshot('before-submit');

// 设置 loading 状态
menuItem.setState('loading', true);

// 提交失败后恢复
menuItem.restoreStateSnapshot('before-submit');
```

### 撤销/重做

```javascript
// 保存多个快照
menuItem.saveStateSnapshot('step-1');
menuItem.setState('active', true);

menuItem.saveStateSnapshot('step-2');
menuItem.setState('disabled', true);

// 撤销到 step-1
menuItem.restoreStateSnapshot('step-1');
```

## 拦截器使用场景

### 状态验证

```javascript
this.registerStateInterceptor((stateName, enabled) => {
  // 禁用状态下不能激活
  if (stateName === 'active' && enabled && this.hasState('disabled')) {
    console.warn('Cannot activate disabled item');
    return null;
  }
  return { stateName, enabled };
});
```

### 状态转换

```javascript
this.registerStateInterceptor((stateName, enabled) => {
  // 支持字符串状态值
  if (stateName === 'selected' && enabled === 'yes') {
    return { stateName: 'selected', enabled: true };
  }
  return { stateName, enabled };
});
```

### 日志记录

```javascript
this.registerStateInterceptor((stateName, enabled) => {
  console.log(`State change: ${stateName} → ${enabled}`);
  return { stateName, enabled };
});
```

## 文件结构

```
src/yoya/
├── core/
│   ├── basic.js          # Tag 基类（包含状态管理原型方法）
│   ├── basic.d.ts        # Tag 类型定义
│   └── theme.js          # 状态机和主题系统核心
│   └── theme.d.ts        # 主题系统类型定义
├── components/
│   ├── menu.js           # MenuItem 使用状态机示例
│   └── index.d.ts        # 组件类型定义
└── examples/
    └── yoya.theme.example.js  # 完整演示示例
```

## Tag 原型扩展方法

所有 Tag 子类自动继承以下状态管理方法：

| 方法 | 说明 |
|-----|------|
| `registerStateAttrs(...attrs)` | 注册状态属性 |
| `registerStateHandler(stateName, handler)` | 注册状态处理器 |
| `setState(stateName, enabled)` | 设置状态 |
| `getState(stateName)` | 获取状态 |
| `hasState(stateName)` | 检查状态 |
| `getAllStates()` | 获取所有状态 |
| `resetStates()` | 重置状态 |
| `saveStateSnapshot(name)` | 保存快照 |
| `restoreStateSnapshot(name)` | 恢复快照 |
| `initializeStates(states)` | 初始化状态 |
| `deinitializeStates()` | 反初始化 |
| `registerStateInterceptor(fn)` | 注册拦截器 |

## 最佳实践

### 1. 状态属性定义

```javascript
// ✅ 推荐：使用静态属性定义
class MenuItem extends Tag {
  static _stateAttrs = ['disabled', 'active', 'danger'];

  constructor() {
    super('div');
    this.registerStateAttrs(...this.constructor._stateAttrs);
  }
}

// ❌ 不推荐：硬编码字符串
this.registerStateAttrs('disabled', 'active', 'danger');
```

### 2. 状态处理器

```javascript
// ✅ 推荐：处理器中恢复默认样式
this.registerStateHandler('disabled', (enabled, host) => {
  if (enabled) {
    host.styles({ opacity: '0.5', cursor: 'not-allowed' });
  } else {
    host.style('opacity', '');    // 恢复默认
    host.style('cursor', 'pointer');
  }
});

// ❌ 不推荐：只设置不恢复
this.registerStateHandler('disabled', (enabled, host) => {
  if (enabled) {
    host.styles({ opacity: '0.5' });
  }
  // 禁用解除后样式未恢复
});
```

### 3. 状态快照

```javascript
// ✅ 推荐：有意义的快照命名
this.saveStateSnapshot('before-submit');
this.saveStateSnapshot('user-preferences');

// ❌ 不推荐：无意义命名
this.saveStateSnapshot('snapshot1');
this.saveStateSnapshot('snapshot2');
```

### 4. 拦截器

```javascript
// ✅ 推荐：返回正确格式
this.registerStateInterceptor((stateName, enabled) => {
  if (this.hasState('disabled') && stateName !== 'disabled') {
    return null;  // 取消操作
  }
  return { stateName, enabled };  // 允许并可能修改
});

// ❌ 不推荐：忘记返回值
this.registerStateInterceptor((stateName, enabled) => {
  if (this.hasState('disabled')) {
    // 没有返回值，状态变更将继续
  }
});
```

## 扩展方向

### 自定义状态机组件

```javascript
class LoadingButton extends Tag {
  static _stateAttrs = ['disabled', 'loading', 'success', 'error'];

  constructor() {
    super('button');
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // loading 状态
    this.registerStateHandler('loading', (enabled, host) => {
      if (enabled) {
        host.attr('disabled', 'true');
        host.text('加载中...');
      } else {
        host.attr('disabled', null);
        host.text(this._originalText);
      }
    });
  }
}
```

### 主题继承

```javascript
// 基于默认主题创建变体
const extendedTheme = createTheme('extended', {
  MenuItem: {
    ...defaultTheme.componentThemes.MenuItem?.stateStyles,
    // 覆盖或添加新样式
    focused: { outline: '2px solid #667eea' }
  }
});
```

## 总结

这套状态机和主题系统提供了：

1. **统一的状态管理接口**：所有组件使用相同的 API
2. **灵活的拦截器机制**：可以在状态变更前进行验证和修改
3. **可恢复的状态快照**：支持撤销、表单提交等场景
4. **可插拔的主题系统**：支持多主题切换和自定义处理器
5. **声明式的状态定义**：通过 `_stateAttrs` 静态属性清晰定义
