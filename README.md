# Yoya.Basic

> **一句话介绍**：Yoya.Basic 是一个浏览器原生的 JS 库 —— 零依赖、无需构建，适合微服务&微前端、全栈开发、私有化部署长期维护项目、服务端渲染但需要局部 js 交互增强。

> **免责声明**：本项目的实现过程 99% 由 AI (Claude Code + Qwen3.5-plus) 完成，当前为实验版本，生产环境请谨慎评估。有什么想法可以在 issues 中交流。

## 📖 这个库是什么

Yoya.Basic 提供声明式语法，让你用 JavaScript 直接编写 UI：

```javascript
import { div, button, vCard, toast } from './yoya.esm.js';

vCard({
  header: '用户信息',
  body: '这是一个用户卡片',
  footer: button('保存').onClick(() => toast.success('已保存'))
}).bindTo('#app');
```

**核心理念**：
- 🌿 **回归原生** —— 厌倦了 Vue/React 的构建复杂度，从浏览器基础 API 重新思考 UI 开发
- 🔧 **零依赖** —— 仅使用稳定的 DOM API，无需 npm、无需 webpack/vite
- ⚡ **即时执行** —— 纯 ES Module，浏览器直接运行，AI 生成的代码立即可用
- 🕰️ **长期主义** —— 只要 Web 标准不变，这套代码 10 年 20 年后依然可用
- 🏢 **全栈优先** —— 为全栈开发和私有部署设计，微服务各自维护页面，统一门户集成

---

## 🎯 适用场景

### 🏆 最推荐：微前端架构

每个微服务维护自己的页面和组件，由统一入口项目整合：

```
微服务 A (用户管理)    微服务 B (订单管理)    微服务 C (数据报表)
      │                      │                      │
      │  导出 UserPage       │  导出 OrderPage      │  导出 ReportPage
      ▼                      ▼                      ▼
                    统一入口门户
                    动态加载各微服务页面
```

**为什么适合微前端**：
- ✅ **全栈友好** —— 后端开发者用 JavaScript 直接写页面，无需学前端工程化
- ✅ **独立部署** —— 各服务维护自己的 UI，无需协调构建流程
- ✅ **私有部署** —— 零依赖、离线可用，适合企业内网/私有云环境
- ✅ **长期维护** —— 基于稳定 Web 标准，10-20 年后代码依然可用

### ⭐⭐⭐⭐⭐ 高度适配场景

| 场景 | 为什么适合 | 典型用例 |
|------|-----------|---------|
| 🧑‍💻 **全栈个人项目** | 后端开发者无需学前端工程化，开箱即用 | 管理后台、数据看板、内部工具 |
| 🏢 **私有环境部署** | 零依赖、离线可用，无需公网 CDN | 企业内网系统、私有云管理后台 |
| 🤖 **AI 生成式 UI** | 声明式语法 LLM 易理解，无需构建，生成的代码立即执行 | 对话中生成表单、动态修改界面 |
| 📐 **动态 UI 生成** | 组件可通过 JSON 配置创建，易于序列化 | 低代码表单生成器、报表配置工具 |
| 📦 **嵌入式/WebView** | 零依赖、轻量、可完全离线运行 | Electron/Tauri 应用、IoT 设备控制台 |
| 🚀 **原型快速开发** | 无配置成本，代码即写即运行 | 活动页面、演示 Demo、MVP 验证 |
| 🔄 **SSR 局部增强** | 大页面中局部使用本库构建交互组件 | 管理后台、数据仪表盘 |

### ⭐⭐⭐ 中度适配场景

| 场景 | 说明 |
|------|------|
| 📊 **Dashboard/数据看板** | 内置 ECharts 组件，直接 DOM 操作性能好 |
| 📚 **内容展示站** | 支持 SSR (`toHTML()`)，但 SEO 需自行优化 |
| 🎓 **教育/学习用途** | 代码透明，易于理解 DOM 操作原理 |

### ⚠️ 不推荐场景

| 场景 | 原因 |
|------|------|
| 🏢 **复杂 C 端应用** | 缺少路由、状态管理等生态支持 |
| 🔍 **SEO 敏感网站** | SSR hydration 需自行实现 |
| 👥 **大型企业项目** | 缺少企业级工具链和 UI 组件库 |

---

## ❓ 能解决什么问题

| 痛点 | Yoya.Basic 的解决方案 |
|------|---------------------|
| 😫 微服务页面难以统一管理 | ✅ **微前端集成** —— 各服务维护自己的页面，统一门户动态加载整合 |
| 😫 前端工程化太复杂，配置一大堆 | ✅ **无需构建** —— 引入即用，无配置负担 |
| 😫 Vue/React 学习曲线陡峭 | ✅ **直观简单** —— 直接映射 HTML/DOM，后端也能写 |
| 😫 私有部署环境限制多 | ✅ **零依赖** —— 离线可用，无需公网 CDN，适合内网部署 |
| 😫 担心框架淘汰，代码无法维护 | ✅ **长期可用** —— 基于稳定 Web 标准，10-20 年后依然有效 |
| 😫 大页面局部交互难维护 | ✅ **SSR 配合** —— 服务端渲染主体，局部用本库构建交互组件 |
| 😫 AI 生成的代码需要构建环境 | ✅ **即时执行** —— AI 生成的代码浏览器直接运行 |

---

## 🆚 与 HTMX 对比

> **HTMX 向左，Yoya.Basic 向右** —— 两者目标一致（简化前端、配合 SSR），但选择的语言不同：

| 特性 | HTMX | Yoya.Basic |
|------|------|-----------|
| 语言选择 | HTML 属性 (`hx-get`, `hx-post`) | JavaScript DSL |
| 服务端配合 | 服务端返回 HTML 片段 | 服务端返回 HTML 或 JS 模块 |
| 局部渲染 | `hx-target` 指定目标 | `bindTo()` 绑定到局部容器 |
| 完整能力 | 受限于 HTML 属性 | JavaScript 完整表达能力 |
| 扩展性 | 有限 | 支持路由/状态机等（规划中）|

**相同理念**：都反对现代前端工程的复杂度，都追求服务端渲染优先，都适合渐进式增强。

**不同选择**：
- HTMX：坚持纯 HTML，适合传统 SSR 增强
- Yoya.Basic：使用 JavaScript，适合需要动态交互的场景（AI 生成 UI、微前端组件嵌入）

**典型配合方式**：同一页面中可以同时使用两者 —— HTMX 处理简单交互（点击加载更多、表单提交），Yoya.Basic 构建复杂组件（动态表单、数据可视化、AI 生成界面）。

---

## 🔄 SSR 配合与微前端嵌入

### 服务端渲染 + 局部交互

```html
<div id="app">
  <!-- 服务端渲染的静态内容 -->
  <header>...</header>
  <main>...</main>

  <!-- 局部使用 Yoya.Basic 构建交互组件 -->
  <div id="dashboard-widget"></div>
</div>

<script type="module">
  import { vEchart } from './yoya.echart.esm.js';
  vEchart({ /* 配置 */ }).bindTo('#dashboard-widget');
</script>
```

### 组件层级嵌入

```javascript
// 微服务 A 导出组件
export function UserTable() {
  return table(t => {
    t.thead(...);
    t.tbody(...);
  });
}

// 主应用导入并嵌入
import { UserTable } from './micro-app-a.js';

div(app => {
  app.h1('用户管理');
  app.child(UserTable());  // 嵌入微服务组件
}).bindTo('#app');
```

---

## ✨ 特性速览

### 核心特性

- **声明式语法** - 使用工厂函数和 setup 函数构建 UI
- **链式调用** - 流式 API，代码更简洁
- **无需构建** - 纯 ES 模块，直接在浏览器中运行
- **TypeScript 支持** - 提供完整的类型声明
- **状态机** - 内置状态管理机制
- **主题 CSS 系统** - 支持明/暗主题切换，CSS 变量驱动，支持自定义主题
- **i18n** - 国际化支持

### AI 友好设计

| 特性 | 说明 |
|------|------|
| 🤖 生成式 UI | 声明式语法让 AI 轻松理解和生成代码 |
| ⚡ 即时渲染 | 无需编译构建，AI 生成的 UI 立即显示 |
| 🔧 多种写法 | 支持字符串/函数/对象配置，容错性强 |
| 🧩 丰富组件 | 40+ 内置组件，AI 可用有限词汇生成复杂界面 |
| 🔄 状态驱动 | 状态机支持，AI 可动态修改 UI 状态和交互 |

```javascript
// AI 可以直接生成这样的代码 - 简洁、直观、可执行
vCard({
  header: '用户信息',
  body: '这是一个用户卡片',
  footer: button('保存').onClick(() => save()),
}).bindTo('#app');
```

---

## 🚀 快速开始

### 1. 导入库

```javascript
import { div, button, flex, toast, vCard } from './yoya.esm.js';
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

---

## 🛠️ 开发

```bash
# 安装依赖
npm install

# 启动开发服务器（带热重载）
npm run dev

# 运行测试
npm test

# TypeScript 类型检查
npm run check

# 构建主题 CSS
npm run build:theme

# 构建 JS 库 + 主题 CSS
npm run build
```

---

## 📁 目录结构

```
.
├── CLAUDE.md                 # Claude Code 项目指导
├── DESIGN.md                 # 详细设计文档
├── README.md                 # 本文件
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

---

## 🧩 组件分类

### 基础元素
`div`, `span`, `p`, `h1`-`h6`, `a`, `button`, `input`, `table`, `ul`, `ol`...

### 布局组件
`flex`, `grid`, `responsiveGrid`, `vstack`, `hstack`, `center`, `container`, `spacer`, `divider`

### 表单组件
`vInput`, `vSelect`, `vTextarea`, `vCheckboxes`, `vSwitch`, `vTimer`, `vTimer2`, `vForm`

### UI 组件
`vCard`, `vMenu`, `vDropdownMenu`, `vContextMenu`, `toast`, `vButton`, `vCode`, `vDetail`, `vField`

### SVG 组件
`svg`, `circle`, `rect`, `ellipse`, `line`, `polyline`, `polygon`, `path`, `g`, `linearGradient`, `filter`

---

## 📖 核心概念

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
  .className('my-class')
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

---

## 🎨 推荐模式：使用函数构建业务组件

**对于复杂业务场景，推荐使用函数封装业务组件**，而非直接使用类组件。这样可以更好地组织代码、复用逻辑和管理状态。

### 基础示例

```javascript
// ✅ 推荐：函数构建业务组件
function UserSelectTable({ props, onSelect }) {
  return div(container => {
    container.h2('用户列表');
    container.table(tbl => {
      tbl.thead(h => {
        h.tr(row => {
          row.th('姓名');
          row.th('邮箱');
          row.th('操作');
        });
      });
      tbl.tbody(body => {
        props.users.forEach(user => {
          body.tr(row => {
            row.td(user.name);
            row.td(user.email);
            row.td(button('选择').onclick(() => onSelect(user)));
          });
        });
      });
    });
  });
}

// 使用
UserSelectTable({
  props: {
    users: [
      { name: 'Alice', email: 'alice@example.com' },
      { name: 'Bob', email: 'bob@example.com' }
    ]
  },
  onSelect: (user) => {
    toast.success(`选择了用户：${user.name}`);
  }
}).bindTo('#app');
```

### 函数组件 vs 类组件

| 特性 | 函数组件 | 类组件 |
|------|---------|--------|
| 代码简洁性 | ⭐⭐⭐⭐⭐ 简洁直观 | ⭐⭐⭐ 需要 class 语法 |
| 状态管理 | ⭐⭐⭐⭐ 闭包/外部状态 | ⭐⭐⭐⭐⭐ 内置状态机 |
| 逻辑复用 | ⭐⭐⭐⭐⭐ 组合函数 | ⭐⭐⭐ 继承/混入 |
| 适合场景 | 业务组件、复杂交互 | 基础 UI 组件、可复用组件 |

**推荐模式**：
- 📦 **基础库**：使用类组件（如 `vCard`, `vMenu`, `vForm`）
- 💼 **业务组件**：使用函数封装（如 `UserTable`, `OrderForm`, `DashboardPanel`）

---

## 📚 文档索引

### 技能教程

本项目在 `skills/` 目录下提供了详细的使用技能文档：

| 文档 | 用途 |
|------|------|
| [yoya-basic](./skills/yoya-basic.md) | 核心用法、导入、创建元素 |
| [yoya-layout](./skills/yoya-layout.md) | Flex、Grid、Stack 等布局 |
| [yoya-form](./skills/yoya-form.md) | 表单组件使用 |
| [yoya-components](./skills/yoya-components.md) | Card、Menu、Message 等 UI 组件 |
| [yoya-svg](./skills/yoya-svg.md) | SVG 图形绘制 |

### 示例代码

| 文档 | 用途 |
|------|------|
| [示例索引](./src/examples/README.md) | 所有示例代码的索引和说明 |
| [入口导航](./src/examples/yoya.example.html) | 在线运行所有示例 |

### API 参考

| 文档 | 用途 |
|------|------|
| [JSDoc 文档](./docs/index.html) | 完整的 API 参考文档 |
| [架构分析](./docs/architecture-analysis.md) | 架构设计分析 |
| [虚拟 DOM](./docs/component-virtual-dom-architecture.md) | 虚拟 DOM 架构详解 |
| [状态机](./docs/state-machine-architecture.md) | 状态机系统说明 |
| [元素生命周期](./docs/element-lifecycle-analysis.md) | 元素生命周期分析 |

### 设计文档

| 文档 | 用途 |
|------|------|
| [DESIGN.md](./DESIGN.md) | 详细设计文档 |
| [CLAUDE.md](./CLAUDE.md) | 开发和架构说明 |
| [THEME_CSS_GUIDE.md](./THEME_CSS_GUIDE.md) | 主题 CSS 使用指南 |

---

## 📄 License

Apache-2.0
