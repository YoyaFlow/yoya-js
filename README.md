# Yoya.Basic

Yoya.Basic 是一个浏览器原生的 HTML DSL 库，提供类似 Kotlin HTML DSL 的声明式语法。它运行在纯浏览器环境中，不依赖构建工具，使用 ESM 模块和可选的 TypeScript 类型声明。

> **AI 生成式 UI 框架** - Yoya.Basic 专为 AI 交互场景设计，支持在与 AI 沟通中随时生成和修改交互式界面。

## 特性

### 核心特性

- **声明式语法** - 使用工厂函数和 setup 函数构建 UI
- **链式调用** - 流式 API，代码更简洁
- **无需构建** - 纯 ES 模块，直接在浏览器中运行
- **TypeScript 支持** - 提供完整的类型声明
- **状态机** - 内置状态管理机制
- **主题系统** - 支持明/暗主题切换
- **i18n** - 国际化支持

### AI 友好设计

- **🤖 生成式 UI** - 声明式语法让 AI 轻松理解和生成代码
- **⚡ 即时渲染** - 无需编译构建，AI 生成的 UI 立即显示
- **🔧 多种写法** - 支持字符串/函数/对象配置，容错性强
- **🧩 丰富组件** - 40+ 内置组件，AI 可用有限词汇生成复杂界面
- **🔄 状态驱动** - 状态机支持，AI 可动态修改 UI 状态和交互
- **📋 对象配置** - 简化语法，降低 AI 生成错误率

```javascript
// AI 可以直接生成这样的代码 - 简洁、直观、可执行
vCard({
  header: '用户信息',
  body: '这是一个用户卡片',
  footer: button('保存').onclick(() => save()),
}).bindTo('#app');
```

## 快速开始

### 1. 导入库

```javascript
import { div, button, flex, toast, vCard } from './yoya/index.js';
```

### 2. 创建元素

```javascript
// 基础用法
div('Hello World').bindTo('#app');

// 使用 setup 函数
div(box => {
  box.h1('标题');
  box.p('段落内容');
  box.button('点击').onclick(() => {
    toast.success('按钮被点击了');
  });
}).bindTo('#app');
```

### 3. 布局示例

```javascript
// Flex 居中布局
flex(f => {
  f.justifyCenter().alignCenter();
  f.div('居中内容');
}).style('height', '100vh').bindTo('#app');

// Grid 网格布局
grid(g => {
  g.columns(3);
  g.gap('16px');
  for (let i = 1; i <= 6; i++) {
    g.div(`项目${i}`);
  }
}).bindTo('#app');
```

### 4. 卡片组件

```javascript
vCard(c => {
  c.cardHeader('卡片标题');
  c.cardBody('卡片内容区域');
  c.cardFooter(btn => {
    btn.button('操作').onclick(() => toast.info('操作按钮'));
  });
}).bindTo('#app');
```

## AI 生成式 UI 场景

Yoya.Basic 专为 AI 交互场景优化，适合以下使用方式：

### 对话中生成界面

```javascript
// AI 根据用户需求即时生成表单
vForm({
  title: '用户注册',
  fields: [
    { name: 'username', type: 'text', label: '用户名' },
    { name: 'email', type: 'email', label: '邮箱' },
    { name: 'password', type: 'password', label: '密码' }
  ],
  submit: (data) => toast.success('注册成功')
}).bindTo('#app');
```

### 动态修改界面

```javascript
// AI 根据上下文更新 UI 状态
const form = vForm(...);
form.bindTo('#app');

// 提交时更新状态
form.setState('loading', true);  // 显示加载状态
// ...
form.setState('loading', false); // 恢复
```

### 组件化生成

```javascript
// AI 可以用组件快速搭建界面
vCard({
  header: h => h.h3('数据面板'),
  body: b => {
    b.flex(f => {
      f.columns(3);
      f.div('指标 1');
      f.div('指标 2');
      f.div('指标 3');
    });
  }
}).bindTo('#app');
```

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器（带热重载）
npm run dev

# 运行测试
npm test

# TypeScript 类型检查
npm run check
```

## 目录结构

```
.
├── CLAUDE.md                 # Claude Code 项目指导
├── DESIGN.md                 # 详细设计文档
├── package.json              # npm 配置
├── skills/                   # 技能文档目录
│   ├── README.md
│   ├── yoya-basic.md
│   ├── yoya-layout.md
│   ├── yoya-form.md
│   ├── yoya-components.md
│   └── yoya-svg.md
├── src/
│   ├── yoya/                 # 库源码
│   │   ├── index.js          # 主入口
│   │   ├── index.d.ts        # TypeScript 类型声明
│   │   ├── core/             # 核心实现
│   │   ├── components/       # UI 组件
│   │   ├── layout.js         # 布局组件
│   │   ├── svg.js            # SVG 组件
│   │   ├── theme.js          # 状态机和主题
│   │   └── i18n.js           # 国际化
│   └── examples/             # 示例代码
└── tests/                    # 单元测试
```

## 组件分类

### 基础元素
`div`, `span`, `p`, `h1`-`h6`, `a`, `button`, `input`, `table`, `ul`, `ol`...

### 布局组件
`flex`, `grid`, `responsiveGrid`, `vstack`, `hstack`, `center`, `container`, `spacer`, `divider`

### 表单组件
`vInput`, `vSelect`, `vTextarea`, `vCheckboxes`, `vSwitch`, `vTimer`, `vTimer2`, `vForm`

**AI 生成示例**：
```javascript
vForm({
  title: '用户信息',
  fields: [
    { name: 'username', label: '用户名', type: 'text' },
    { name: 'email', label: '邮箱', type: 'email' }
  ],
  submit: (data) => save(data)
});
```

### UI 组件
`vCard`, `vMenu`, `vDropdownMenu`, `vContextMenu`, `toast`, `vButton`, `vCode`, `vDetail`, `vField`

### SVG 组件
`svg`, `circle`, `rect`, `ellipse`, `line`, `polyline`, `polygon`, `path`, `g`, `linearGradient`, `filter`

## 核心概念

### 工厂函数
所有元素通过小写工厂函数创建：
```javascript
div()      // ✅ 正确
new Div()  // ❌ 不要这样做
```

### Setup 函数
使用 setup 函数组织子元素：
```javascript
div(box => {
  box.h1('标题');
  box.p('内容');
});
```

### 链式调用
设置方法返回 `this`，支持链式调用：
```javascript
div()
  .id('my-id')
  .class('my-class')
  .style('color', 'red');
```

### 绑定到 DOM
元素必须绑定到 DOM 才能显示：
```javascript
div('Hello').bindTo('#app');
```

### 对象配置（AI 推荐）
AI 生成时推荐使用对象配置，语法更简洁：
```javascript
vCard({
  header: '标题',
  body: '内容',
  footer: button('操作')
}).bindTo('#app');
```

## 示例

更多示例请参考 `src/examples/` 目录：
- `yoya.example.html` - 入口导航页面
- `yoya.basic.example.html` - 完整演示页面
- `yoya.svg.example.html` - SVG 演示页面

## 技能文档

本项目在 `skills/` 目录下提供了详细的使用技能文档：

| 文档 | 用途 |
|------|------|
| [yoya-basic](./skills/yoya-basic.md) | 核心用法、导入、创建元素 |
| [yoya-layout](./skills/yoya-layout.md) | Flex、Grid、Stack 等布局 |
| [yoya-form](./skills/yoya-form.md) | 表单组件使用 |
| [yoya-components](./skills/yoya-components.md) | Card、Menu、Message 等 UI 组件 |
| [yoya-svg](./skills/yoya-svg.md) | SVG 图形绘制 |

## License

MIT

---

## 为什么选择 Yoya.Basic 作为 AI UI 框架

| 特性 | 说明 | AI 友好度 |
|------|------|----------|
| 声明式语法 | 类似自然语言的结构 | ⭐⭐⭐⭐⭐ |
| 无需构建 | 生成的代码立即执行 | ⭐⭐⭐⭐⭐ |
| 多种写法 | 字符串/函数/对象配置等价 | ⭐⭐⭐⭐⭐ |
| 丰富组件 | 40+ 内置组件 | ⭐⭐⭐⭐⭐ |
| 状态机 | 支持动态修改 UI | ⭐⭐⭐⭐ |
| 链式调用 | 代码简洁，减少 token | ⭐⭐⭐⭐ |

**适用场景**：对话式 UI 生成、表单自动生成、数据展示界面、仪表盘配置、交互式原型
