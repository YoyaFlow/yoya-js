# yoya-theme

YoyaJS 状态机与主题系统使用技能。当用户需要实现组件状态管理、主题切换、多状态样式联动或复杂的组件交互逻辑时触发此技能。

## 触发条件

- 用户需要实现组件状态管理（如 disabled、active、loading 等）
- 用户需要了解状态机机制和 API
- 用户需要实现主题切换功能
- 用户需要状态变更拦截器或状态快照功能

## 核心概念

### 状态机（StateMachine）

状态机是 YoyaJS 的核心机制，用于管理组件的状态变化：

- **支持多种类型**：boolean、string、number
- **状态处理器**：状态变更时自动执行回调
- **拦截器机制**：可在状态变更前进行验证或修改
- **状态快照**：支持保存和恢复状态

### 主题系统（Theme）

主题系统基于状态机构建，提供：

- **状态样式注册**：为组件定义状态对应的样式
- **主题管理器**：管理多个主题并支持切换
- **组件级主题**：不同组件可有不同的主题配置

---

## 基础用法

### 注册状态属性

```javascript
import { Tag } from './yoya/index.js';

const button = new Tag('button');

// 注册布尔类型状态（默认）
button.registerStateAttrs('disabled', 'active', 'loading');

// 注册字符串类型状态
button.registerStateAttrs({ size: 'string', color: 'string' });

// 注册数值类型状态
button.registerStateAttrs({ count: 'number', level: 'number' });

// 混合注册
button.registerStateAttrs(
  'disabled',                    // boolean
  { size: 'string' },            // string
  { count: 'number' }            // number
);
```

### 设置和获取状态

```javascript
// 设置布尔状态
button.setState('disabled', true);
button.setState('disabled', false);

// 快捷方法
button.setState('disabled', true);  // 通用方法

// 获取状态值
const isDisabled = button.getBooleanState('disabled');
const size = button.getStringState('size');
const count = button.getNumberState('count');

// 获取所有状态
const allStates = button.getAllStates();
// { disabled: true, size: 'large', count: 5 }

// 检查状态（适用于 boolean）
if (button.hasState('disabled')) {
  console.log('按钮已禁用');
}
```

### 状态处理器

```javascript
const button = new Tag('button');

// 注册状态属性
button.registerStateAttrs('disabled', 'active', 'loading');

// 注册状态处理器
button.registerStateHandler('disabled', (enabled, host, oldValue) => {
  if (enabled) {
    host.styles({
      opacity: '0.5',
      cursor: 'not-allowed',
      pointerEvents: 'none',
    });
  } else {
    host.styles({
      opacity: '1',
      cursor: 'pointer',
    });
  }
});

button.registerStateHandler('active', (isActive, host) => {
  if (isActive) {
    host.style('background', '#007bff');
    host.style('color', '#ffffff');
  } else {
    host.style('background', '');
    host.style('color', '');
  }
});

// 设置状态时自动应用样式
button.setState('disabled', true);
button.setState('active', true);
```

### 状态拦截器

```javascript
const button = new Tag('button');
button.registerStateAttrs('disabled', 'loading');

// 注册拦截器 - 禁用状态下阻止其他状态变更
button.registerStateInterceptor((stateName, value) => {
  // 如果已禁用，且不是设置 disabled 状态，则拦截
  if (button.hasState('disabled') && stateName !== 'disabled') {
    console.warn('组件已禁用，无法更改其他状态');
    return null;  // 返回 null 表示取消操作
  }
  
  // 可以修改 stateName 或 value
  if (stateName === 'loading' && value === true) {
    console.log('即将进入加载状态...');
  }
  
  return { stateName, value };  // 返回新值允许变更
});

button.setState('disabled', true);
button.setState('active', true);  // 会被拦截器阻止
```

---

## 状态快照

### 保存和恢复

```javascript
const form = new Tag('form');
form.registerStateAttrs('editing', 'valid', 'submitting');

// 保存初始状态
form.saveStateSnapshot('initial');

// 编辑中...
form.setState('editing', true);
form.setState('valid', false);

// 保存当前状态为 "editing" 快照
form.saveStateSnapshot('editing');

// 恢复初始状态
form.restoreStateSnapshot('initial');

// 恢复到编辑状态
form.restoreStateSnapshot('editing');
```

### 初始化和重置

```javascript
const component = new Tag('div');
component.registerStateAttrs('expanded', 'selected', 'level');

// 初始化状态（设置默认值）
component.initializeStates({
  expanded: false,
  selected: false,
  level: 1,
});

// 重置所有状态到默认值
component.resetStates();

// 反初始化（恢复到初始化前的状态）
component.deinitializeStates();
```

---

## 主题系统

### 创建主题

```javascript
import { themeManager, createTheme } from './yoya/core/theme.js';

// 创建暗色主题
const darkTheme = createTheme('dark', {
  MenuItem: {
    disabled: { opacity: '0.5', cursor: 'not-allowed' },
    active: { background: '#007bff', color: '#ffffff' },
    danger: { color: '#ff4444' },
  },
  Card: {
    loading: { opacity: '0.7', pointerEvents: 'none' },
  },
});

// 注册主题
themeManager.registerTheme(darkTheme);

// 创建亮色主题
const lightTheme = createTheme('light', {
  MenuItem: {
    disabled: { opacity: '0.5' },
    active: { background: '#e3f2fd', color: '#1976d2' },
  },
});

themeManager.registerTheme(lightTheme);
```

### 应用主题

```javascript
import { themeManager } from './yoya/core/theme.js';
import { menuItem } from './yoya/components/menu.js';

// 设置当前主题
themeManager.setTheme('dark');

// 创建组件 - 主题自动应用
const item = menuItem('菜单项');

// 应用主题到现有组件
themeManager.applyTheme(component);

// 应用所有已注册主题
themeManager.applyAllThemes(component);
```

### 主题切换

```javascript
// 创建主题切换函数
function switchTheme(themeName) {
  themeManager.setTheme(themeName);
  
  // 重新渲染所有组件以应用新主题
  // 需要在组件注册状态变化时响应主题变更
}

// 使用示例
const themeToggle = button('切换主题');
themeToggle.on('click', () => {
  const current = themeManager.getCurrentTheme()?.name;
  switchTheme(current === 'dark' ? 'light' : 'dark');
});
```

---

## 完整示例

### MenuItem 组件状态管理

```javascript
import { Tag } from './yoya/index.js';

class MenuItem extends Tag {
  static _stateAttrs = ['disabled', 'active', 'danger', 'hoverable'];

  constructor(content = '', setup = null) {
    super('div', setup);
    
    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);
    
    // 2. 保存样式快照（用于恢复）
    this.saveStateSnapshot('base');
    
    // 3. 注册状态处理器
    this._registerStateHandlers();
    
    // 4. 注册拦截器
    this._registerInterceptors();
    
    // 5. 初始化默认状态
    this.initializeStates({
      disabled: false,
      active: false,
      danger: false,
      hoverable: true,
    });
  }

  _registerStateHandlers() {
    // disabled 状态处理器
    this.registerStateHandler('disabled', (enabled, host) => {
      if (enabled) {
        host.styles({
          opacity: '0.5',
          cursor: 'not-allowed',
          pointerEvents: 'none',
        });
      } else {
        host.styles({
          opacity: '1',
          cursor: 'pointer',
        });
      }
    });

    // active 状态处理器
    this.registerStateHandler('active', (isActive, host) => {
      if (isActive) {
        host.styles({
          background: '#007bff',
          color: '#ffffff',
        });
      } else {
        host.styles({
          background: '',
          color: '',
        });
      }
    });

    // danger 状态处理器
    this.registerStateHandler('danger', (isDanger, host) => {
      if (isDanger) {
        host.style('color', '#ff4444');
      } else {
        host.style('color', '');
      }
    });
  }

  _registerInterceptors() {
    // disabled 状态下阻止 active 变更
    this.registerStateInterceptor((stateName, value) => {
      if (this.hasState('disabled') && stateName === 'active') {
        return null;  // 阻止
      }
      return { stateName, value };
    });
  }

  // 链式 API
  disabled(value = true) {
    return this.setState('disabled', value);
  }

  active(value = true) {
    return this.setState('active', value);
  }

  danger(value = true) {
    return this.setState('danger', value);
  }
}

function menuItem(content = '', setup = null) {
  return new MenuItem(content, setup);
}
```

### 表单状态管理

```javascript
import { Tag, vInput, button, toast } from './yoya/index.js';

class FormField extends Tag {
  constructor(label, setup = null) {
    super('div', setup);
    
    this._label = label;
    this._value = '';
    
    // 注册状态
    this.registerStateAttrs(
      'editing',
      'valid',
      'invalid',
      'dirty',
      { touched: 'boolean' }
    );
    
    // 保存初始快照
    this.saveStateSnapshot('pristine');
    
    // 状态处理器
    this._registerHandlers();
    
    // 构建 UI
    this._buildUI();
  }

  _registerHandlers() {
    // editing 状态
    this.registerStateHandler('editing', (isEditing, host) => {
      if (isEditing) {
        host.style('borderColor', '#007bff');
      } else {
        host.style('borderColor', '');
      }
    });

    // valid 状态
    this.registerStateHandler('valid', (isValid, host) => {
      if (isValid) {
        host.style('borderColor', '#28a745');
      }
    });

    // invalid 状态
    this.registerStateHandler('invalid', (isInvalid, host) => {
      if (isInvalid) {
        host.style('borderColor', '#dc3545');
      }
    });
  }

  _buildUI() {
    this.styles({
      padding: '12px',
      marginBottom: '16px',
      border: '1px solid #ddd',
      borderRadius: '4px',
    });

    const labelEl = Tag.prototype.span.call(this, this._label);
    labelEl.styles({ display: 'block', marginBottom: '8px' });

    const inputEl = vInput(i => {
      i.type('text');
      i.on('input', (e) => {
        this._value = e.target.value;
        this.setState('dirty', true);
        this.validate();
      });
      i.on('blur', () => {
        this.setState('touched', true);
      });
    });

    this.child(inputEl);
  }

  validate() {
    if (this._value.trim()) {
      this.setState('valid', true);
      this.setState('invalid', false);
      return true;
    } else {
      this.setState('valid', false);
      this.setState('invalid', true);
      return false;
    }
  }

  reset() {
    this.restoreStateSnapshot('pristine');
    this._value = '';
  }

  getValue() {
    return this._value;
  }
}

// 使用示例
const form = div(f => {
  const nameField = new FormField('姓名');
  const emailField = new FormField('邮箱');
  
  f.child(nameField);
  f.child(emailField);
  
  f.button(btn => {
    btn.text('提交');
    btn.on('click', () => {
      if (nameField.validate() && emailField.validate()) {
        toast.success('表单验证通过');
      } else {
        toast.error('请修正表单错误');
      }
    });
  });
  
  f.button(resetBtn => {
    resetBtn.text('重置');
    resetBtn.on('click', () => {
      nameField.reset();
      emailField.reset();
    });
  });
});

form.bindTo('#app');
```

### 主题切换应用

```javascript
import { themeManager, createTheme, Tag } from './yoya/index.js';

// 创建主题
const lightTheme = createTheme('light', {
  Card: {
    header: { background: '#f5f5f5' },
    body: { background: '#ffffff' },
  },
  Button: {
    primary: { background: '#007bff', color: '#ffffff' },
    secondary: { background: '#6c757d', color: '#ffffff' },
  },
});

const darkTheme = createTheme('dark', {
  Card: {
    header: { background: '#2d2d2d', color: '#ffffff' },
    body: { background: '#1a1a1a', color: '#e0e0e0' },
  },
  Button: {
    primary: { background: '#1976d2', color: '#ffffff' },
    secondary: { background: '#424242', color: '#e0e0e0' },
  },
});

themeManager.registerTheme(lightTheme);
themeManager.registerTheme(darkTheme);
themeManager.setTheme('light');

// 主题切换按钮
const themeToggle = button(t => {
  t.text('🌙 暗色模式');
  t.styles({
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '10px 20px',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
  });
  
  t.on('click', () => {
    const current = themeManager.getCurrentTheme()?.name;
    const newTheme = current === 'light' ? 'dark' : 'light';
    themeManager.setTheme(newTheme);
    
    t.text(newTheme === 'light' ? '🌙 暗色模式' : '☀️ 亮色模式');
    
    // 重新渲染页面以应用新主题
    // 实际项目中可能需要触发全局重新渲染
  });
});

themeToggle.bindTo(document.body);
```

---

## API 速查

### StateMachine 状态机

```javascript
// 注册状态属性
registerStateAttrs(...attrs)           // attrs: string | { name: 'string'|'number'|'boolean' }

// 状态变更
setState(stateName, value)             // 设置状态值
setBooleanState(stateName, value)      // 设置布尔状态
setStringState(stateName, value)       // 设置字符串状态
setNumberState(stateName, value)       // 设置数值状态

// 获取状态
getState(stateName)                    // 获取状态值
getBooleanState(stateName)             // 获取布尔状态
getStringState(stateName)              // 获取字符串状态
getNumberState(stateName)              // 获取数值状态
getAllStates()                         // 获取所有状态
hasState(stateName)                    // 检查状态（boolean）

// 状态处理器
registerStateHandler(stateName, fn)    // 注册处理器
removeHandler(stateName, fn)           // 移除处理器

// 拦截器
registerStateInterceptor(fn)           // 注册拦截器
removeInterceptor(fn)                  // 移除拦截器

// 快照
saveStateSnapshot(name)                // 保存快照
restoreStateSnapshot(name)             // 恢复快照

// 生命周期
initialize(defaultStates)              // 初始化状态
deinitialize()                         // 反初始化
reset()                                // 重置所有状态
destroy()                              // 销毁状态机
```

### Theme 主题

```javascript
new Theme(name)

// 组件样式
setComponentStateStyles(component, state, styles)
setComponentStateHandler(component, state, handler)

// 注册
register()
applyToComponent(component)
```

### ThemeManager 主题管理器

```javascript
themeManager.registerTheme(theme)      // 注册主题
themeManager.getTheme(name)            // 获取主题
themeManager.setTheme(name)            // 设置当前主题
themeManager.getCurrentTheme()         // 获取当前主题
themeManager.applyTheme(component)     // 应用主题到组件
themeManager.applyAllThemes(component) // 应用所有主题
```

---

## 注意事项

1. **状态注册优先**：必须先 `registerStateAttrs()` 才能使用 `setState()`
2. **状态处理器时机**：处理器在状态变更后立即执行
3. **拦截器返回值**：返回 `null` 取消操作，返回 `{stateName, value}` 允许并可能修改
4. **状态快照**：快照保存的是状态值，不是样式
5. **类型安全**：建议使用类型定义避免状态值类型错误
6. **内存管理**：组件销毁时调用 `destroy()` 清理状态机

## 最佳实践

1. **状态命名清晰**：使用语义化的状态名如 `disabled`、`loading`、`expanded`
2. **集中管理状态**：在组件构造函数中统一注册所有状态
3. **状态处理器职责单一**：每个处理器只负责一个状态的样式变更
4. **拦截器用于验证**：拦截器用于状态变更验证，而非样式处理
5. **快照用于恢复**：在关键操作前保存快照便于回滚
