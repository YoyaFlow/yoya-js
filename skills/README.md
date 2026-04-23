# YoyaJS 技能索引

本目录包含 YoyaJS HTML DSL 库的使用技能文档。

## 可用技能

| 技能 | 用途 | 触发场景 |
|------|------|----------|
| [yoya-basic](./yoya-basic.md) | 库的核心用法 | 导入库、创建元素、绑定 DOM、基础用法 |
| [yoya-layout](./yoya-layout.md) | 布局组件 | Flex、Grid、Stack 等布局 |
| [yoya-form](./yoya-form.md) | 表单组件 | 输入框、选择器、复选框、日期选择器 |
| [yoya-components](./yoya-components.md) | UI 组件 | Card、Menu、Message、Code、Button 等 |
| [yoya-svg](./yoya-svg.md) | SVG 组件 | 绘制矢量图形、图表、图标 |
| [component-priority](./component-priority.md) | 组件优先使用原则 | 页面开发、组件选型、新组件封装 |

## 新增技能

| 技能 | 用途 | 触发场景 |
|------|------|----------|
| [yoya-echart](./yoya-echart.md) | ECharts 图表 | 数据可视化、图表配置 |
| [yoya-theme](./yoya-theme.md) | 主题系统 | 主题切换、状态机、CSS 变量 |
| [yoya-router](./yoya-router.md) | 路由系统 | SPA 路由、路由视图、导航守卫 |
| [yoya-i18n](./yoya-i18n.md) | 国际化 | 多语言切换、翻译函数 |

## 快速开始

### 1. 导入库

```javascript
import { div, button, flex, grid, toast, vCard, ... } from './yoya/index.js';
```

### 2. 创建元素

```javascript
// 基础元素
div('Hello World').bindTo('#app');

// 使用 setup 函数
div(box => {
  box.h1('标题');
  box.p('段落内容');
}).bindTo('#app');
```

### 3. 布局示例

```javascript
// Flex 居中
flex(f => {
  f.justifyCenter().alignCenter();
  f.div('居中内容');
}).style('height', '100vh').bindTo('#app');

// Grid 3 列
grid(g => {
  g.columns(3);
  g.gap('16px');
  for (let i = 1; i <= 6; i++) {
    g.div(`项目${i}`);
  }
}).bindTo('#app');
```

### 4. 组件示例

```javascript
// 卡片
vCard(c => {
  c.cardHeader('标题');
  c.cardBody('内容');
  c.cardFooter(b => {
    b.button('操作');
  });
}).bindTo('#app');

// 消息提示
toast.success('操作成功！');
```

## 技能使用说明

当你需要：

- **创建页面结构** → 参考 `yoya-basic` 和 `yoya-layout`
- **制作表单** → 参考 `yoya-form`
- **添加 UI 组件** → 参考 `yoya-components`
- **绘制图形** → 参考 `yoya-svg`
- **组件选型/封装新组件** → 参考 `component-priority`（组件优先使用原则）

## 组件优先使用原则

**核心理念**：优先使用组件，组件实现不了的才使用基础元素去实现页面。

**优先级顺序**：`UI 组件` > `布局组件` > `SVG 组件` > `基础元素`

详细指南请参考：[component-priority.md](./component-priority.md)

## 组件分类

### 基础元素
`div`, `span`, `p`, `h1`-`h6`, `a`, `button`, `input`, `table`, `ul`, `ol`...

### 布局组件
`flex`, `grid`, `responsiveGrid`, `vstack`, `hstack`, `center`, `container`, `spacer`, `divider`

### 表单组件
`vInput`, `vSelect`, `vTextarea`, `vCheckboxes`, `vSwitch`, `vTimer`, `vTimer2`, `vForm`

### UI 组件
`vCard`, `vMenu`, `vDropdownMenu`, `vContextMenu`, `toast`, `vButton`, `vCode`, `vDetail`, `vField`

### SVG 组件
`svg`, `circle`, `rect`, `ellipse`, `line`, `polyline`, `polygon`, `path`, `g`, `defs`, `linearGradient`, `filter`

## 核心概念

### 1. 工厂函数
所有元素通过小写工厂函数创建，而非直接实例化类：
```javascript
div()      // ✅ 正确
new Div()  // ❌ 不要这样做
```

### 2. Setup 函数
使用 setup 函数组织子元素：
```javascript
div(box => {
  box.h1('标题');
  box.p('内容');
});
```

### 3. 链式调用
设置方法返回 `this`，支持链式调用：
```javascript
div()
  .id('my-id')
  .className('my-class')
  .style('color', 'red');
```

### 4. 绑定到 DOM
元素必须绑定到 DOM 才能显示：
```javascript
div('Hello').bindTo('#app');
```

## 主题与状态

### 状态机
```javascript
const btn = button('按钮');
btn.setState('disabled', true);
```

### 主题切换
```javascript
import { switchTheme } from './yoya/index.js';
switchTheme('dark');
```

## i18n 国际化

```javascript
import { setLanguage, t } from './yoya/index.js';
setLanguage('zh-CN');
div(t('welcome', '欢迎'));
```
