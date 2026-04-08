# YoyaJS

> 浏览器原生的 HTML DSL 库 —— 零依赖、无需构建、声明式 UI

## 简介

YoyaJS 提供声明式语法，让你用 JavaScript 直接编写 UI：

```javascript
import { div, button, vCard, toast } from './dist/yoya.esm.min.js';

vCard({
  header: '用户信息',
  body: '这是一个用户卡片',
  footer: button('保存').onClick(() => toast.success('已保存'))
}).bindTo('#app');
```

## 为什么选择 YoyaJS

| 痛点 | YoyaJS 方案 |
|------|------------|
| 😫 前端工程化太复杂，配置一大堆 | ✅ **无需构建** —— 引入即用，无配置负担 |
| 😫 Vue/React 学习曲线陡峭 | ✅ **直观简单** —— 直接映射 HTML/DOM，后端也能写 |
| 😫 私有部署环境限制多 | ✅ **零依赖** —— 离线可用，无需 npm、无需 CDN |
| 😫 担心框架淘汰，代码无法维护 | ✅ **长期可用** —— 基于稳定 Web 标准，10 年后依然有效 |
| 😫 AI 生成的代码需要构建环境 | ✅ **即时执行** —— AI 生成的代码浏览器直接运行 |
| 😫 微服务页面难以统一管理 | ✅ **微前端集成** —— 各服务维护自己的页面，统一门户加载 |

## 核心优势

### 🚀 开箱即用
- 无需 `npm install`，无需 `webpack/vite` 配置
- 浏览器直接运行，代码即写即预览
- 全栈开发者无需学前端工程化

### 🌿 零依赖
- 仅使用原生 DOM API，不依赖任何外部库
- 适合内网/私有云/离线环境部署
- 文件大小可控，无隐形依赖风险

### 🤖 AI 友好
- 声明式语法让 AI 轻松理解和生成代码
- 无需构建环境，AI 生成的代码立即执行
- 40+ 内置组件，AI 可用有限词汇生成复杂界面

### 🏢 微前端首选
- 各微服务独立维护自己的页面和组件
- 统一入口门户动态加载整合
- 无需协调构建流程，部署独立

### 🕰️ 长期主义
- 基于稳定的 Web 标准，不追逐框架潮流
- 代码 10 年 20 年后依然可用
- 适合需要长期维护的项目,特别是内网环境项目

## 特性

- **40+ 内置组件** —— Card、Form、Table、Menu、Modal、Tabs 等
- **声明式语法** —— HTML DSL 的简洁写法
- **TypeScript 支持** —— 完整的类型声明文件
- **主题系统** —— CSS 变量驱动，支持明/暗主题切换
- **ECharts 集成** —— 内置数据可视化组件

## 安装

引入构建后的文件：

```html
<script type="module">
  import { div, button, vCard } from './dist/yoya.esm.min.js';
</script>
```

或开发时直接引入源码：

```javascript
import { div, button, vCard } from './src/yoya/index.js';
```

## 快速开始

### 1. 创建元素

```javascript
import { div, h1, p, button } from './src/yoya/index.js';

div(app => {
  app.h1('Hello World');
  app.p('这是一个声明式 UI 示例');
  app.button('点击').onClick(() => alert('Hello'));
}).bindTo('#app');
```

### 2. 使用组件

```javascript
import { vCard, vForm, vTable, toast } from './src/yoya/index.js';

// 卡片组件
vCard({
  header: '标题',
  body: '内容区域',
  footer: button('操作')
}).bindTo('#app');

// 表单组件
vForm({
  items: [
    { type: 'input', label: '用户名', name: 'username' },
    { type: 'select', label: '角色', name: 'role', options: [...] }
  ],
  onSubmit: (data) => toast.success('提交成功')
}).bindTo('#app');
```

### 3. 布局示例

```javascript
import { flex, grid, vstack } from './src/yoya/index.js';

// Flex 布局
flex(f => {
  f.justifyCenter().alignCenter();
  f.div('居中内容');
}).style('height', '100vh').bindTo('#app');

// Grid 网格
grid(g => {
  g.columns(3).gap('16px');
  for (let i = 1; i <= 6; i++) {
    g.div(`项目 ${i}`);
  }
}).bindTo('#app');
```

## 组件分类

| 类别 | 组件 |
|------|------|
| **基础元素** | `div`, `span`, `button`, `input`, `table`, `form`... |
| **布局组件** | `flex`, `grid`, `vstack`, `hstack`, `center`, `container` |
| **表单组件** | `vForm`, `vInput`, `vSelect`, `vCheckboxes`, `vTimer` |
| **UI 组件** | `vCard`, `vMenu`, `vTable`, `vTabs`, `vPager`, `vModal`, `toast` |
| **数据展示** | `vDetail`, `vField`, `vStatistic`, `vCode` |
| **图表组件** | `vEchart` (基于 ECharts) |
| **SVG 组件** | `svg`, `circle`, `rect`, `path`, `g`... |

## 适用场景

| 场景 | 说明 |
|------|------|
| **全栈开发** | 后端开发者无需学前端工程化即可编写 UI |
| **私有化部署** | 零依赖、离线可用，适合内网环境 |
| **微前端架构** | 各微服务独立维护页面，统一门户集成 |
| **快速原型** | 无配置成本，代码即写即运行 |
| **数据看板** | 内置 ECharts 组件，支持丰富的数据可视化 |
| **SSR 局部增强** | 服务端渲染主体，局部用本库构建交互组件 |

## 与 HTMX 的关系

YoyaJS 与 HTMX **设计理念相同，实现路径不同**：

| | HTMX | YoyaJS |
|---|------|--------|
| **相同理念** | SSR 优先、简化前端、渐进增强 | SSR 优先、简化前端、渐进增强 |
| **实现方式** | HTML 属性 (`hx-get`, `hx-post`) | JavaScript DSL |
| **适用场景** | 传统 SSR 页面增强 | 动态交互、AI 生成 UI、微前端组件 |

两者可在同一项目中配合使用：HTMX 处理简单交互（点击加载、表单提交），YoyaJS 构建复杂组件（动态表单、数据可视化）。

---

## 💭 关于"大型项目"的思考

### 常见质疑

> "这个项目对大型 SPA 不友好，没有状态管理、没有虚拟 DOM、没有复杂路由"

### 我们的回应

**1. 大型项目真的需要那些"标准特性"吗？**

| "必需品" | 实际使用情况 |
|---------|-------------|
| **状态管理 (Redux/Vuex)** | 80% 项目只用到了 `globalThis.appState = {}` |
| **虚拟 DOM** | 大部分页面是表单/表格，更新频率远低于阈值 |
| **复杂路由** | 后台系统 90% 是列表 - 详情 - 表单，固定模式 |
| **构建工具链** | ESM 原生支持后，很多项目零构建也能跑 |
| **组件生命周期** | `onMounted` + `onUnmounted` 就够了，需要 12 个钩子吗？ |

**2. 大型项目的真实需求是什么？**

真正卡住大型项目的是：

- ✅ **代码组织** — 目录结构、模块拆分、命名规范
- ✅ **类型安全** — TypeScript 能解决大部分问题
- ✅ **测试覆盖** — 单元测试 + E2E
- ✅ **性能瓶颈** — 接口响应、大数据渲染、图片加载
- ✅ **团队协作** — Code Review、文档、接口约定

而不是：
- ❌ 有没有 Vuex
- ❌ 有没有虚拟 DOM
- ❌ 有没有 JSX

**3. Yoya 的实际能力**

| 真实需求 | Yoya 的方案 |
|---------|-----------|
| **代码可维护** | DSL 结构清晰，函数式组织 |
| **类型安全** | TypeScript 声明完整 (`.d.ts`) |
| **组件复用** | 工厂函数 + Class 继承 |
| **状态管理** | `StateMachine` 状态机 + 状态属性系统 + 拦截器 |
| **性能** | 直接 DOM 操作，无虚拟 DOM 开销 |
| **测试** | 纯函数易测试，已有 Playwright E2E |

**4. 被忽视的真相**

- **虚拟 DOM 不是为性能，是为框架** — React 需要它来支持 JSX 和不可变状态，直接 DOM 操作在很多场景更快
- **状态管理不是必须用第三方库** — Yoya 内置 `StateMachine`，支持状态注册、处理器、拦截器、状态快照
- **"大型项目"的定义被框架绑架了** — 10 万行代码的项目，用原生 JS 写的也不少，决定复杂度的是业务，不是技术栈

**5. Yoya 的状态管理能力**

```javascript
// 组件级状态管理
class VButton extends Tag {
  constructor(setup) {
    super('button');
    // 注册状态属性（支持 boolean/string/number 类型）
    this.registerStateAttrs('disabled', 'loading', { size: 'string' });
    // 注册状态处理器
    this.state.registerHandler('disabled', (val) => {
      this.attr('disabled', val);
      this.state('disabled', val ? 'disabled' : '');
    });
    this.state.registerHandler('loading', (val) => {
      val ? this.addClass('is-loading') : this.removeClass('is-loading');
    });
  }
  // 状态访问
  state(name, value) { /* ... */ }
}

// 状态拦截器
button.state.registerInterceptor((stateName, value) => {
  if (stateName === 'disabled' && value === true) {
    console.log('Button disabled');
  }
  return { stateName, value };
});

// 状态快照与恢复
button.state.saveSnapshot();  // 保存当前状态
button.state('disabled', true);
button.state.restoreSnapshot(); // 恢复到快照

// 全局状态共享
globalThis.appState = { user: null, token: null };
const store = reactive(globalThis.appState);
```

### 我们的立场

**Yoya 走的是另一条路：基于 Web 标准、零依赖、直接 DOM 操作。**

这条路被框架热潮掩盖了，但它是可行的。适合：

- ✅ 需要长期维护的内网/私有化项目
- ✅ 全栈开发者快速构建后台系统
- ✅ 微前端架构中的子应用
- ✅ AI 生成 UI 代码的直接执行环境
- ✅ SSR 页面的局部动态增强
- ✅ **数据可视化大屏** — 直接操作 DOM，无虚拟 DOM 开销，性能更高
- ✅ **复杂状态管理场景** — 内置 StateMachine，支持状态拦截器、快照、类型定义

唯一不适合：

- ❌ **必须依赖 React/Vue 生态的特定组件** — 如 Ant Design、Element UI 等

**选择 Yoya，不是因为它"功能少"，而是因为它选择了另一条技术路径。**

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 运行测试
npm test

# 构建
npm run build
```

## 目录结构

```
.
├── src/yoya/              # 库源码
│   ├── core/              # 核心实现
│   │   ├── basic.js       # 基础元素
│   │   ├── layout.js      # 布局组件
│   │   ├── svg.js         # SVG 组件
│   │   └── theme.js       # 主题系统
│   ├── components/        # UI 组件
│   │   ├── card.js        # 卡片
│   │   ├── form.js        # 表单
│   │   ├── table.js       # 表格
│   │   ├── menu.js        # 菜单
│   │   └── ...            # 40+ 组件
│   ├── index.js           # 主入口
│   └── index.d.ts         # TypeScript 声明
├── src/v2/examples/       # V2 示例
├── tests/                 # 单元测试
└── package.json
```

## 文档

| 文档 | 说明 |
|------|------|
| [DESIGN.md](./DESIGN.md) | 详细设计文档 |
| [示例目录](./src/v2/examples/) | 完整示例代码 |
| [主题指南](./THEME_CSS_GUIDE.md) | 主题 CSS 使用指南 |

## License

Apache-2.0
