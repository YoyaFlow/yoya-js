# Yoya.Basic 主题系统问题分析

## 问题总结

### 1. 主题变量定义过于分散且重复

**问题位置**: `src/yoya/theme/variables.js`

**问题描述**:
- 主题变量以硬编码方式定义在 `variables.js` 中
- 暗色主题通过 `createDarkTheme()` 函数手动覆盖部分变量
- 变量没有按组件层级组织，导致查找困难
- 变量命名不统一，如 `--islands-bg` 和 `--islands-card-bg` 混用

**示例**:
```javascript
// 当前做法 - 硬编码
export const baseVariables = {
  '--islands-bg': 'white',
  '--islands-text': '#333',
};

export function createDarkTheme() {
  return {
    '--islands-bg': '#1a1a1a',
    '--islands-text': '#e0e0e0',
  };
}
```

**建议改进**:
```javascript
// 改进方案 - 使用主题工厂
const lightTheme = {
  colors: {
    background: { primary: 'white', secondary: '#f7f8fa' },
    text: { primary: '#333', secondary: '#666' },
    border: '#e0e0e0',
  },
  // ...
};

const darkTheme = {
  colors: {
    background: { primary: '#1a1a1a', secondary: '#2a2a2a' },
    text: { primary: '#e0e0e0', secondary: '#a0a0a0' },
    border: '#404040',
  },
  // ...
};
```

---

### 2. 组件与主题变量耦合过紧

**问题位置**: `src/yoya/components/menu.js` 等组件文件

**问题描述**:
- 组件在 `constructor` 中直接使用 CSS 变量作为内联样式
- 主题切换后，已创建的组件不会自动更新样式
- 组件样式与主题变量没有解耦

**示例**:
```javascript
// 当前做法 - 组件内直接使用变量
class VMenu extends Tag {
  constructor(setup = null) {
    super('div', null);
    this.styles({
      background: 'var(--islands-menu-bg, var(--islands-bg))',
      borderRadius: 'var(--islands-menu-radius, var(--islands-radius-md))',
    });
  }
}
```

**问题分析**:
- 虽然使用了 CSS 变量，但样式是在组件创建时设置的
- 主题切换时，已渲染的组件不会重新应用样式
- 没有利用主题系统的状态机机制

**建议改进**:
```javascript
// 改进方案 - 使用主题注册机制
class VMenu extends Tag {
  static _stateAttrs = ['variant', 'size'];

  constructor(setup = null) {
    super('div', null);

    // 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 应用主题基础样式（通过主题系统）
    this._applyThemeBaseStyles();

    // 注册状态处理器
    this._registerStateHandlers();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  _applyThemeBaseStyles() {
    // 从主题管理器获取 VMenu 组件的基础样式
    const theme = this._getTheme();
    if (theme?.componentThemes?.VMenu?.baseStyles) {
      this.styles(theme.componentThemes.VMenu.baseStyles);
    }
  }
}
```

---

### 3. 主题系统架构复杂且不一致

**问题位置**: `src/yoya/core/theme.js` 和 `src/yoya/theme/index.js`

**问题描述**:
- `core/theme.js` 提供状态机机制
- `theme/index.js` 提供主题管理系统
- 两个系统之间没有良好的集成
- `themeRegistry` 在两个文件中重复定义

**具体问题**:

#### 3.1 注册表重复
```javascript
// core/theme.js 第 20 行
const themeRegistry = new Map();

// theme/index.js 第 24 行
const themeRegistry = new Map();
```

#### 3.2 主题实例和 CSS 变量分离
- `core/theme.js` 的 `Theme` 类管理组件状态样式
- `theme/index.js` 管理 CSS 变量
- 两者没有统一的管理机制

#### 3.3 主题应用流程不清晰
```javascript
// 当前流程
initTheme() -> getThemeWithMode() -> applyTheme()
  -> applyThemeVariables() (设置 CSS 变量)
  -> applyComponentStyles() (查找组件类并应用)
    -> applyBaseStyles()
    -> applyStateStyles()
    -> applyVariantStyles()
```

问题：
- `applyComponentStyles` 依赖 `window[componentName]` 查找组件类，不可靠
- 组件包装 `setup` 方法和 `_registerStateHandlers` 方法，可能导致多次包装
- 没有考虑组件实例已存在的情况

---

### 4. 暗色主题覆盖不完整

**问题位置**: `src/yoya/theme/variables.js` 第 425-440 行

**问题描述**:
- `createDarkTheme()` 只覆盖了 12 个变量
- 大量组件变量没有暗色模式定义
- 消息组件的渐变背景在暗色模式下不适用

**未覆盖的变量**:
```javascript
// Card 变量 - 未覆盖
--islands-card-bg
--islands-card-radius
--islands-card-shadow
// ...

// Menu 变量 - 未覆盖
--islands-menu-bg
--islands-menu-radius
// ...

// Message 变量 - 未覆盖（渐变背景在暗色下效果差）
--islands-message-success-bg
// ...
```

**建议改进**:
```javascript
// 完整的暗色主题定义
export function createDarkTheme() {
  return {
    // 基础色
    '--islands-bg': '#1a1a1a',
    '--islands-bg-secondary': '#2a2a2a',
    '--islands-text': '#e0e0e0',
    '--islands-text-secondary': '#a0a0a0',
    '--islands-border': '#404040',

    // Card
    '--islands-card-bg': '#2a2a2a',
    '--islands-card-shadow': '0 2px 8px rgba(0,0,0,0.3)',

    // Menu
    '--islands-menu-bg': '#2a2a2a',

    // Message (暗色模式使用纯色背景)
    '--islands-message-success-bg': '#1e4620',
    '--islands-message-success-color': '#4ade80',
    '--islands-message-success-border': '#1e4620',
    // ...
  };
}
```

---

### 5. 缺少设计令牌 (Design Tokens) 规范

**问题描述**:
- 没有统一的设计令牌系统
- 颜色、间距、圆角等值直接硬编码
- 无法支持多主题扩展

**当前做法**:
```javascript
'--islands-primary': '#667eea',
'--islands-radius-md': '8px',
'--islands-padding-md': '16px',
```

**建议改进 - 使用设计令牌**:
```javascript
// design-tokens.js
export const designTokens = {
  colors: {
    primary: {
      50: '#eef2ff',
      100: '#e0e7ff',
      500: '#667eea',
      600: '#5a6fd6',
      700: '#4f46e5',
    },
    neutral: {
      0: 'white',
      50: '#f9fafb',
      100: '#f3f4f6',
      // ...
      900: '#111827',
    },
  },
  spacing: {
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '10px',
    xl: '12px',
  },
  radii: {
    sm: '4px',
    md: '6px',
    lg: '8px',
  },
};

// themes/light.js
import { designTokens } from './design-tokens.js';

export function createLightTheme() {
  return {
    variables: {
      '--islands-primary': designTokens.colors.primary[500],
      '--islands-primary-hover': designTokens.colors.primary[600],
      '--islands-bg': designTokens.colors.neutral[0],
      // ...
    },
  };
}
```

---

### 6. 主题切换时组件状态丢失

**问题描述**:
- 主题切换时，组件的当前状态（如 disabled、active）可能丢失
- 状态处理器只在组件初始化时注册
- 主题切换后没有重新应用状态样式

**场景**:
```javascript
// 用户操作
const btn = vButton('按钮');
btn.setState('disabled', true);  // 设置为禁用状态

// 用户切换主题
switchTheme('dark');

// 问题：按钮的禁用状态样式可能不会正确应用
```

**建议改进**:
```javascript
// 在主题切换时重新应用状态
export function switchTheme(themeId) {
  const theme = getThemeWithMode(themeId, currentMode);
  if (theme) {
    // 保存当前所有组件实例引用
    const components = getAllRegisteredComponents();

    // 应用新主题
    applyTheme(theme, true);

    // 重新应用每个组件的状态样式
    for (const component of components) {
      const states = component.getAllStates();
      for (const [stateName, value] of Object.entries(states)) {
        if (value) {
          // 重新触发状态处理器
          component.setState(stateName, value);
        }
      }
    }
  }
}
```

---

### 7. 组件变体 (Variant) 支持不完善

**问题位置**: `src/yoya/theme/index.js` 第 279-304 行

**问题描述**:
- 变体样式通过包装 `_registerStateHandlers` 方法添加
- `variant()` 方法没有类型检查
- 变体样式与状态样式混合，逻辑复杂

**当前实现**:
```javascript
// 变体方法动态添加
if (!proto.variant) {
  proto.variant = function(variantName) {
    const variantStyles = this._themeVariants?.[variantName];
    if (variantStyles) {
      this.styles(variantStyles);
    }
    return this;
  };
}
```

**问题**:
- 调用 `variant('invalid')` 不会有任何提示
- 变体样式直接覆盖，不支持组合
- 没有默认变体概念

**建议改进**:
```javascript
// 改进的变体系统
class VButton extends Tag {
  static variants = ['primary', 'secondary', 'danger', 'ghost'];
  static defaultVariant = 'primary';

  constructor(setup = null) {
    super('button', null);
    this.registerStateAttrs('variant', 'size', 'disabled');
    this._applyVariantStyles(this.constructor.defaultVariant);
  }

  variant(name) {
    if (!this.constructor.variants.includes(name)) {
      console.warn(`Invalid variant "${name}". Valid variants: ${this.constructor.variants.join(', ')}`);
      return this;
    }
    return this._applyVariantStyles(name);
  }

  _applyVariantStyles(variantName) {
    const theme = this._getTheme();
    const variantStyles = theme?.componentThemes?.VButton?.variants?.[variantName];
    if (variantStyles) {
      this.styles(variantStyles);
    }
    return this;
  }
}
```

---

## 修复建议优先级

| 优先级 | 问题 | 影响范围 | 修复难度 |
|--------|------|----------|----------|
| P0 | 暗色主题覆盖不完整 | 高 | 低 |
| P0 | 组件与主题变量耦合过紧 | 高 | 中 |
| P1 | 主题变量定义过于分散 | 中 | 中 |
| P1 | 主题系统架构复杂且不一致 | 高 | 高 |
| P2 | 缺少设计令牌规范 | 中 | 中 |
| P2 | 主题切换时组件状态丢失 | 低 | 中 |
| P3 | 组件变体支持不完善 | 低 | 低 |

---

## 建议的重构方向

### 短期修复 (P0)

1. **补充完整的暗色主题变量**
   - 为所有组件定义暗色模式变量
   - 调整消息组件的渐变背景为纯色背景

2. **解耦组件与主题变量**
   - 组件使用主题系统 API 获取样式
   - 主题切换时重新应用组件状态

### 中期重构 (P1-P2)

1. **统一主题系统架构**
   - 合并 `core/theme.js` 和 `theme/index.js` 的注册表
   - 简化主题应用流程

2. **引入设计令牌系统**
   - 定义统一的设计令牌
   - 主题基于设计令牌构建

### 长期优化 (P3)

1. **完善变体系统**
   - 添加变体验证
   - 支持变体组合

2. **添加 TypeScript 类型支持**
   - 为主题变量添加类型定义
   - 为变体系统添加类型约束
