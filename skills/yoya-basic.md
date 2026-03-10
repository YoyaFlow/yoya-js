# yoya-basic

Yoya.Basic HTML DSL 库的使用技能。当用户询问如何使用 Yoya.Basic 库、创建页面、使用组件或编写 DSL 代码时触发此技能。

## 触发条件

- 用户询问如何使用 Yoya.Basic 库
- 用户需要创建 HTML 页面或组件
- 用户需要了解某个组件的用法
- 用户需要示例代码

## 库概述

Yoya.Basic 是一个浏览器原生的 HTML DSL 库，提供类似 Kotlin HTML DSL 的声明式语法。特点：
- 纯 ES 模块，无需构建工具
- 浏览器原生运行
- 声明式语法，链式调用
- 支持 TypeScript 类型声明

## 核心用法

### 1. 导入库

```javascript
// 从本地路径导入
import { div, button, flex, grid, toast, ... } from './yoya/index.js';

// 或从远程导入
import { div, button } from 'https://your-domain.com/yoya/index.js';
```

### 2. 创建元素

```javascript
// 基础元素
div('Hello World');
button('点击我');
h1('标题');

// 使用 setup 函数
div(box => {
  box.h1('标题');
  box.p('段落内容');
  box.button('按钮');
});

// 链式调用
div()
  .id('container')
  .className('main')
  .text('内容');
```

### 3. 绑定到 DOM

```javascript
// 绑定到选择器
div('Hello').bindTo('#app');

// 先创建后绑定
const el = div('Hello');
el.bindTo(document.getElementById('app'));
```

## 组件分类

### 基础容器元素
`div`, `span`, `p`, `h1`-`h6`, `section`, `article`, `header`, `footer`, `nav`, `aside`, `main`

### 文本格式化
`a`, `strong`, `em`, `code`, `pre`, `blockquote`

### 表单元素
`button`, `input`, `textarea`, `select`, `option`, `label`, `form`, `vCheckboxes`, `vSwitch`, `vTimer`, `vTimer2`

### 列表
`ul`, `ol`, `li`, `dl`, `dt`, `dd`

### 表格
`table`, `tr`, `td`, `th`, `thead`, `tbody`, `tfoot`

### 布局组件
`flex`, `grid`, `responsiveGrid`, `vstack`, `hstack`, `center`, `container`, `spacer`, `divider`

### UI 组件
- **卡片**: `vCard`, `vCardHeader`, `vCardBody`, `vCardFooter`
- **菜单**: `vMenu`, `vMenuItem`, `vMenuDivider`, `vDropdownMenu`, `vContextMenu`
- **消息**: `toast`, `vMessage`, `messageContainer`
- **按钮**: `vButton`
- **代码**: `vCode`, `codeBlock`
- **详情**: `vDetail`, `vDetailItem`
- **字段**: `vField`, `vInput`, `vSelect`, `vTextarea`
- **图表**: `vEchart`

### SVG 组件
`svg`, `circle`, `rect`, `ellipse`, `line`, `polyline`, `polygon`, `path`, `g`, `defs`, `linearGradient`, `filter`

## 常用示例

### Flex 布局
```javascript
flex(f => {
  f.justifyCenter().alignCenter();
  f.div('项目 1');
  f.div('项目 2');
  f.div('项目 3');
}).bindTo('#app');
```

### Grid 布局
```javascript
grid(g => {
  g.columns(3);
  g.gap('16px');
  for (let i = 1; i <= 9; i++) {
    g.div(`项目${i}`);
  }
}).bindTo('#app');
```

### 表单
```javascript
vForm(form => {
  form.input(i => {
    i.type('text');
    i.placeholder('用户名');
  });
  form.input(i => {
    i.type('password');
    i.placeholder('密码');
  });
  form.button('登录').onclick(() => {
    toast.success('登录成功');
  });
}).bindTo('#app');
```

### 消息提示
```javascript
// 成功消息
toast.success('操作成功！');

// 错误消息
toast.error('操作失败！');

// 警告消息
toast.warning('请注意！');

// 信息消息
toast.info('这是信息');
```

### 卡片
```javascript
vCard(c => {
  c.cardHeader('卡片标题');
  c.cardBody('卡片内容');
  c.cardFooter(btn => {
    btn.button('确定').onclick(() => toast.info('确定'));
  });
}).bindTo('#app');
```

### SVG 图形
```javascript
svg(s => {
  s.viewBox(0, 0, 100, 100);
  s.circle(c => {
    c.cx(50).cy(50).r(40);
    c.style('fill', 'red');
  });
  s.rect(r => {
    r.x(20).y(20).width(60).height(60);
    r.style('fill', 'blue');
  });
}).bindTo('#app');
```

## 状态机使用

组件支持状态机机制：

```javascript
const btn = vButton('按钮');

// 设置状态
btn.setState('disabled', true);
btn.setState('active', false);

// 获取状态
btn.getBooleanState('disabled');

// 链式设置
btn.disabled(true).active(false);
```

## 主题系统

```javascript
import { themeManager, switchTheme } from './yoya/index.js';

// 切换主题
switchTheme('dark');

// 获取当前主题
const current = themeManager.getCurrentTheme();
```

## i18n 国际化

```javascript
import { setLanguage, t } from './yoya/index.js';

// 设置语言
setLanguage('zh-CN');

// 使用翻译
div(t('welcome', '欢迎'));
```

## 注意事项

1. **所有元素必须先创建后绑定**，或链式调用 `bindTo()`
2. **setup 函数中不要直接操作 DOM**，使用库提供的方法
3. **事件绑定使用 `.on()` 或 `.onclick()` 等方法**
4. **样式使用 `.style()` 或 `.styles()` 设置**
5. **复杂组件使用组合方式构建**，不要拼装 HTML 字符串

## 输出格式

根据用户需求提供：
- 完整的示例代码
- 组件 API 说明
- 使用注意事项
- 相关组件推荐
