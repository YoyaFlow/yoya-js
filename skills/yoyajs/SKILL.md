# yoyajs

在其他项目中使用 Yoya.Basic 库。当用户需要在项目中集成、导入或使用 Yoya.Basic HTML DSL 库时触发此技能。

## 触发条件

当用户要求：
- 在新项目中使用 Yoya.Basic 库
- 导入 Yoya.Basic 组件或元素
- 查询 Yoya.Basic API 用法
- 创建基于 Yoya.Basic 的页面或组件
- 将 Yoya.Basic 集成到现有项目

## 核心原则：组件优先

**重要：开发页面时，优先使用项目提供的组件和布局，组件没有的功能才使用基础元素构建。**

**优先级顺序**：
```
页面组件 (VBody) > UI 组件 > 布局组件 > SVG 组件 > 基础元素
```

| 优先级 | 组件类型 | 示例 |
|--------|----------|------|
| 1 | 页面组件 | `vBody` - 页面背景容器 |
| 2 | UI 组件 | `vCard`, `vButton`, `vMenu`, `vInput`, `toast` |
| 3 | 布局组件 | `flex`, `grid`, `vstack`, `hstack`, `center` |
| 4 | SVG 组件 | `svg`, `circle`, `rect`, `path` |
| 5 | 基础元素 | `div`, `span`, `p`, `button` (仅在无组件可用时使用) |

**示例对比**：

```javascript
// ✅ 正确：使用 vBody 作为页面容器
import { vBody, vCard, toast } from 'yoya-basic';

vBody(b => {
  b.center(); // 内容居中
  b.child(vCard(c => {
    c.cardHeader('标题');
    c.cardBody('内容');
  }));
}).bindTo('#app');

// ❌ 错误：使用 div 作为页面容器
div(d => {
  d.styles({
    display: 'flex',
    justifyContent: 'center',
    minHeight: '100vh'
  });
  d.child(vCard(...));
});
```

```javascript
// ✅ 正确：使用布局组件
flex(f => {
  f.row().justifyCenter().alignCenter().gap('16px');
  f.vButton('按钮 1');
  f.vButton('按钮 2');
});

// ❌ 错误：手动设置 flex 样式
div(d => {
  d.styles({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px'
  });
  d.button('按钮 1');
  d.button('按钮 2');
});
```

## Yoya.Basic 库概述

Yoya.Basic 是一个**浏览器原生**的 HTML DSL 库，提供类似 Kotlin HTML DSL 的声明式语法。

**核心特点：**
- 🌿 **零依赖** —— 无需 npm、无需构建工具，纯 ES 模块
- ⚡ **即时执行** —— 浏览器直接运行，AI 生成的代码立即可用
- 🔧 **声明式语法** —— 使用工厂函数和 setup 函数构建 UI
- 🕰️ **长期主义** —— 基于稳定 Web 标准，10-20 年后代码依然可用
- 🏢 **微前端友好** —— 各服务独立维护 UI，统一门户动态加载

**适用场景：**
- 微前端架构（各服务导出组件，统一门户整合）
- 全栈个人项目（后端开发者无需学前端工程化）
- 私有环境部署（零依赖、离线可用）
- AI 生成式 UI（声明式语法，LLM 易理解）
- SSR 局部增强（大页面中局部交互组件）
- 原型快速开发（无配置成本，代码即写即运行）

## 页面组件

### VBody 页面背景容器

`vBody` 是页面的整体背景容器，提供统一的视觉风格和布局基础。

```javascript
import { vBody, vCard, toast, flex } from 'yoya-basic';

// 基础用法
vBody(b => {
  b.center(); // 内容居中
  b.child(vCard(c => {
    c.cardHeader('标题');
    c.cardBody('内容');
    c.cardFooter(f => {
      f.button('保存').onclick(() => toast.success('已保存'));
    });
  }));
}).bindTo('#app');

// 常用方法
vBody(b => {
  b.background('#f5f5f5');     // 设置背景色
  b.minHeight('100vh');         // 设置最小高度
  b.padding('20px');            // 设置内边距
  b.fullscreen(true);           // 启用全屏模式
  b.align('center');            // 设置对齐方式
  b.content('页面内容');        // 添加内容
}).bindTo('#app');
```

**VBody API 方法：**

| 方法 | 说明 | 返回值 |
|------|------|--------|
| `background(color)` | 设置背景色 | this |
| `minHeight(height)` | 设置最小高度 | this |
| `fullscreen(enabled)` | 设置全屏模式 | this |
| `align(align)` | 设置内容对齐方式 | this |
| `center()` | 设置内容居中对齐 | this |
| `padding(padding)` | 设置内边距 | this |
| `content(child)` | 添加子元素 | this |

## 布局组件

**布局组件用于组织页面结构，优先使用而非手动设置 CSS。**

```javascript
import { flex, grid, responsiveGrid, vstack, hstack, center, container, spacer, divider } from 'yoya-basic';
```

### Flex 弹性布局

```javascript
// Flex 布局 - 水平排列
flex(f => {
  f.row().justifyCenter().alignCenter().gap('16px');
  f.div('项目 1');
  f.div('项目 2');
  f.div('项目 3');
});

// 常用方法链
flex(f => {
  f.justifyStart();      // 起点对齐
  f.justifyEnd();        // 终点对齐
  f.justifyCenter();     // 居中
  f.justifyBetween();    // 两端对齐
  f.justifyAround();     // 环绕对齐
  f.alignStart();        // 交叉轴起点
  f.alignEnd();          // 交叉轴终点
  f.alignCenter();       // 交叉轴居中
  f.alignStretch();      // 交叉轴拉伸
  f.wrap();              // 换行
  f.noWrap();            // 不换行
  f.gap('20px');         // 间距
});
```

### Grid 网格布局

```javascript
// Grid 布局 - 3 列等宽
grid(g => {
  g.columns(3);
  g.gap('20px');
  g.div('项目 1');
  g.div('项目 2');
});

// 响应式网格 - 自适应列数
responsiveGrid(g => {
  g.minSize('250px');  // 每列最小 250px，自动调整列数
  g.div('项目 1');
  g.div('项目 2');
});
```

### Stack 堆叠布局

```javascript
// 垂直堆叠（默认）
vstack(s => {
  s.gap('16px');
  s.div('上方');
  s.div('下方');
});

// 水平堆叠
hstack(s => {
  s.gap('16px');
  s.div('左侧');
  s.div('右侧');
});
```

### Center 居中布局

```javascript
center(c => {
  c.div('居中内容');
});
```

### Container 响应式容器

```javascript
container(c => {
  c.maxWidth('1200px');  // 最大宽度
  c.padding('0 16px');   // 内边距
  c.div('内容区域');
});
```

### Divider 分割线

```javascript
divider();  // 水平分割线

divider(d => {
  d.vertical();   // 垂直分割线
  d.color('#ccc'); // 设置颜色
  d.margin('20px'); // 设置外边距
});
```

### Spacer 弹性占位

```javascript
hstack(h => {
  h.div('左侧');
  h.spacer();  // 弹性占位，将两侧内容推到两端
  h.div('右侧');
});
```

## 安装与导入

### 方式 1：本地文件导入（推荐用于微前端）

```javascript
// 从本地路径导入（相对路径或绝对路径）
import { div, button, flex, toast, vCard } from './path/to/yoya/index.js';

// 或从 dist 目录导入（生产环境）
import { div, button } from './path/to/dist/yoya.esm.js';
```

### 方式 2：CDN 引入

```html
<script type="module">
  import { div, button } from 'https://cdn.jsdelivr.net/npm/yoya-basic/dist/yoya.esm.js';
</script>
```

### 方式 3：npm 安装

```bash
npm install yoya-basic
```

```javascript
import { div, button } from 'yoya-basic';
```

### 方式 4：微前端模块共享

```javascript
// 微服务 A 导出组件
// micro-app-a.js
export { UserTable } from './components/UserTable.js';

// 主应用导入
import { UserTable } from './micro-app-a.js';
```

## 核心 API

### 基础元素创建

所有元素通过**小写工厂函数**创建：

```javascript
// 简单字符串（文本内容）
div('Hello World');
button('点击我');
h1('页面标题');

// 对象配置（AI 推荐）
button({
  onClick: () => alert('clicked'),
  text: '点击我'
});

// 函数回调（复杂结构）
div(box => {
  box.h1('标题');
  box.p('段落内容');
  box.button('按钮');
});

// 链式调用
div()
  .id('container')
  .className('main')
  .styles({ padding: '20px' })
  .child(h1('标题'));
```

### 绑定到 DOM

元素必须绑定到 DOM 才能显示：

```javascript
// 绑定到 CSS 选择器
div('Hello').bindTo('#app');

// 绑定到 DOM 元素
const el = div('Hello');
el.bindTo(document.getElementById('app'));

// 作为子元素
div(parent => {
  parent.child(div('子元素'));
});
```

### 三种 Setup 方式

```javascript
// 1. 字符串 - 简单文本
div('Hello World');

// 2. 对象 - 简单配置
button({
  onClick: () => toast.success('点击了'),
  text: '按钮'
});

// 3. 函数 - 复杂结构
div(box => {
  box.h1('标题');
  box.p('内容');
  box.styles({ padding: '20px' });
});
```

## 组件库

### UI 组件（优先使用）

**UI 组件是具有特定语义和交互功能的封装组件，开发时应优先使用。**

#### Card 卡片

```javascript
import { vCard, vCardHeader, vCardBody, vCardFooter, button, toast } from 'yoya-basic';

vCard(c => {
  c.cardHeader('卡片标题');
  c.cardBody('卡片内容区域');
  c.cardFooter(f => {
    f.button('保存').onclick(() => toast.success('已保存'));
  });
}).bindTo('#app');
```

#### Menu 菜单

```javascript
import { vMenu, vMenuItem, vMenuDivider, vDropdownMenu, toast } from 'yoya-basic';

// 基础菜单
vMenu(m => {
  m.item(it => {
    it.text('📋 新建')
      .onclick(() => toast.info('新建'));
  });
  m.item(it => {
    it.text('📂 打开')
      .onclick(() => toast.info('打开'));
  });
  m.divider();
  m.item(it => {
    it.text('⚙️ 设置')
      .onclick(() => toast.info('设置'));
  });
});

// 下拉菜单
vDropdownMenu(d => {
  d.trigger('点击我');
  d.menuContent(vMenu(m => {
    m.item(it => {
      it.text('📋 选项 1')
        .onclick(() => toast.info('选项 1'));
    });
  }));
  d.closeOnClickOutside();
});
```

#### Message 消息提示

```javascript
import { toast } from 'yoya-basic';

// 成功消息
toast.success('操作成功！');

// 错误消息
toast.error('操作失败！');

// 警告消息
toast.warning('请注意！');

// 信息消息
toast.info('提示信息');
```

#### Button 按钮

```javascript
import { vButton, toast } from 'yoya-basic';

vButton('点击我')
  .type('primary')
  .size('large')
  .onClick(() => toast.success('按钮被点击'));
```

#### Code 代码展示

```javascript
import { vCode, toast } from 'yoya-basic';

vCode(c => {
  c.content(`
const hello = (name) => {
  console.log('Hello, ' + name);
};
  `);
  c.title('💻 JavaScript 示例');
  c.onCopy(() => toast.success('代码已复制'));
});
```

#### Detail 详情展示

```javascript
import { vDetail, vDetailItem } from 'yoya-basic';

vDetail(d => {
  d.title('用户信息');
  d.item(it => {
    it.label('用户名');
    it.value('zhangsan');
  });
  d.item(it => {
    it.label('邮箱');
    it.value('zhangsan@example.com');
  });
});
```

#### Field 表单字段

```javascript
import { vField } from 'yoya-basic';

vField(f => {
  f.label('用户名');
  f.input(i => {
    i.placeholder('请输入用户名');
  });
  f.error('用户名不能为空'); // 错误提示
});
```

### 表单组件

#### Input 输入框

```javascript
import { vInput } from 'yoya-basic';

vInput(i => {
  i.type('text');
  i.placeholder('请输入...');
  i.value('默认值');
  i.onChange((val) => console.log(val));
});
```

#### VCheckboxes 复选框组

```javascript
import { vCheckboxes } from 'yoya-basic';

// 多选模式
vCheckboxes(cb => {
  cb.options([
    { value: 'apple', label: '苹果' },
    { value: 'banana', label: '香蕉' },
    { value: 'orange', label: '橙子' },
  ]);
  cb.multiple(true);
  cb.value(['apple', 'banana']);
  cb.onChange((values) => console.log('选中：', values));
});

// 单选模式
vCheckboxes(cb => {
  cb.options([
    { value: 'red', label: '红色' },
    { value: 'green', label: '绿色' },
  ]);
  cb.multiple(false);
  cb.value('red');
});
```

#### VTimer 日期选择器

```javascript
import { vTimer, vTimer2 } from 'yoya-basic';

// 单个日期
vTimer(t => {
  t.type('date');
  t.value('2024-03-15');
  t.onChange((val) => console.log(val));
});

// 日期范围
vTimer2(t => {
  t.value({
    start: '2024-03-01',
    end: '2024-03-31'
  });
  t.onChange((range) => console.log(range));
});
```

### SVG 组件

```javascript
import { svg, circle, rect, path, g } from 'yoya-basic';

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

  // 路径
  s.path(p => {
    p.moveTo(10, 10)
     .lineTo(50, 50)
     .lineTo(90, 10)
     .closePath();
    p.style('fill', 'green');
  });
}).bindTo('#app');
```

### 基础元素（仅在无组件可用时使用）

**当现有组件无法满足需求时，才使用基础元素。**

```javascript
import {
  // 容器
  div, span, p, h1, h2, h3, h4, h5, h6,
  section, article, header, footer, nav, aside, main,

  // 文本
  a, strong, em, code, pre, blockquote,

  // 表单
  button, input, textarea, select, option, label, form,

  // 列表
  ul, ol, li, dl, dt, dd,

  // 表格
  table, tr, td, th, thead, tbody, tfoot,

  // 媒体
  img, video, audio, source,

  // 其他
  br, hr, iframe, canvas
} from 'yoya-basic';
```

## 组件选型决策树

**开发时按以下顺序选择组件：**

```
1. 是否需要在页面容器中？
   ├─ 是 → 使用 vBody
   └─ 否 → 继续下一步

2. 是否有对应的 UI 组件？
   ├─ 是 → 使用 UI 组件 (vCard, vButton, vMenu, vInput 等)
   └─ 否 → 继续下一步

3. 是否需要布局？
   ├─ 是 → 使用布局组件 (flex, grid, vstack, hstack, center 等)
   └─ 否 → 继续下一步

4. 是否需要绘制图形？
   ├─ 是 → 使用 SVG 组件 (svg, circle, rect, path 等)
   └─ 否 → 使用基础元素 (div, span, button 等)
```

### 常用场景速查

| 需求 | 优先选择 |
|------|----------|
| 页面容器 | `vBody` |
| 显示卡片内容 | `vCard` + `vCardHeader` + `vCardBody` |
| 显示成功/错误提示 | `toast.success()` / `toast.error()` |
| 按钮组水平排列 | `flex().row()` |
| 表单输入框 | `vInput` 或 `vField` |
| 选择日期 | `vTimer` |
| 多选选项 | `vCheckboxes` |
| 显示图表 | `vEchart` |
| 右键菜单 | `vContextMenu` |
| 下拉菜单 | `vDropdownMenu` |
| 垂直列表 | `vstack` |
| 居中内容 | `center` |
| 分割线 | `divider` |
| 绘制图标 | `svg` + 形状组件 |
| 自定义组件 | 继承 `Tag` 封装新组件 |

### Router 路由组件

```javascript
import { vRouter, vLink, vRouterView } from 'yoya-basic';

// 创建路由器
const router = vRouter(r => {
  r.default('/home');

  r.route('/home', {
    component: () => div('首页')
  });

  r.route('/user/:id', h => {
    h.component((params) => div(`用户：${params.id}`));
  });

  r.beforeEach((to, from) => {
    console.log('导航守卫', to.path);
    return true;
  });
});

// 导航链接
vLink('/home', '首页');
vLink('/user/123', '用户详情');

// 路由视图
vRouterView(router).bindTo('#app');
```

## 完整示例

### 简单登录页面（使用 vBody）

```javascript
import { vBody, vCard, vInput, vButton, toast } from 'yoya-basic';

vBody(b => {
  b.center(); // 内容居中
  b.child(vCard(c => {
    c.cardHeader('用户登录');
    c.cardBody(box => {
      box.vInput(i => {
        i.type('text');
        i.placeholder('用户名');
        i.id('username');
      });
      box.vInput(i => {
        i.type('password');
        i.placeholder('密码');
        i.id('password');
      });
    });
    c.cardFooter(btn => {
      btn.vButton('登录')
        .type('primary')
        .style('width', '100%')
        .onClick(() => {
          const username = document.getElementById('username').value;
          const password = document.getElementById('password').value;
          if (username && password) {
            toast.success('登录成功');
          } else {
            toast.error('请输入用户名和密码');
          }
        });
    });
  }).style('width', '400px'));
}).bindTo('#app');
```

### 数据卡片列表（使用 vBody + responsiveGrid）

```javascript
import { vBody, responsiveGrid, vCard, toast } from 'yoya-basic';

const items = [
  { title: '卡片 1', content: '这是第一个卡片的内容', color: '#e3f2fd' },
  { title: '卡片 2', content: '这是第二个卡片的内容', color: '#f3e5f5' },
  { title: '卡片 3', content: '这是第三个卡片的内容', color: '#e8f5e9' },
  { title: '卡片 4', content: '这是第四个卡片的内容', color: '#fff3e0' },
];

vBody(b => {
  b.padding('20px');
  b.child(responsiveGrid(g => {
    g.minSize('250px');
    g.gap('16px');

    items.forEach(item => {
      g.child(vCard(c => {
        c.cardHeader(item.title);
        c.cardBody(item.content);
        c.style('background', item.color);
        c.cardFooter(f => {
          f.button('查看详情')
            .onclick(() => toast.info(item.title));
        });
      }));
    });
  }));
}).bindTo('#app');
```

### 管理后台页面（综合示例）

```javascript
import {
  vBody, flex, grid, vstack, hstack, center,
  vCard, vMenu, vButton, toast
} from 'yoya-basic';

vBody(b => {
  b.background('#f5f5f5');
  b.padding('0');

  // 顶部导航栏
  b.child(hstack(header => {
    header.style('background', '#fff');
    header.style('padding', '16px 24px');
    header.style('boxShadow', '0 2px 8px rgba(0,0,0,0.1)');
    header.child(vMenu(m => {
      m.item(it => {
        it.text('🏠 首页')
          .onclick(() => toast.info('首页'));
      });
      m.item(it => {
        it.text('👤 个人中心')
          .onclick(() => toast.info('个人中心'));
      });
    }));
    header.spacer(); // 弹性占位
    header.child(vButton('退出').onClick(() => toast.info('退出')));
  }));

  // 主内容区域
  b.child(grid(main => {
    main.columns(3);
    main.gap('16px');
    main.style('padding', '20px');

    // 数据卡片
    main.child(vCard(c => {
      c.cardHeader('访问量');
      c.cardBody('12,345');
    }));
    main.child(vCard(c => {
      c.cardHeader('订单量');
      c.cardBody('567');
    }));
    main.child(vCard(c => {
      c.cardHeader('销售额');
      c.cardBody('¥89,012');
    }));
  }));
}).bindTo('#app');
```

### 微前端组件导出

```javascript
// micro-app-a.js - 微服务 A 导出的组件
import { table, button, toast } from 'yoya-basic';

export function UserTable({ users, onSelect }) {
  return table(t => {
    t.thead(h => {
      h.tr(row => {
        row.th('姓名');
        row.th('邮箱');
        row.th('操作');
      });
    });
    t.tbody(body => {
      users.forEach(user => {
        body.tr(row => {
          row.td(user.name);
          row.td(user.email);
          row.td(button('选择').onclick(() => {
            onSelect?.(user);
            toast.success(`选择了 ${user.name}`);
          }));
        });
      });
    });
  });
}

// main-app.js - 主应用导入使用
import { UserTable } from './micro-app-a.js';

UserTable({
  users: [
    { name: 'Alice', email: 'alice@example.com' },
    { name: 'Bob', email: 'bob@example.com' }
  ],
  onSelect: (user) => console.log('选中用户:', user)
}).bindTo('#user-container');
```

### 主题系统

```javascript
import { themeManager, switchTheme, initTheme } from 'yoya-basic';

// 初始化主题
initTheme({
  defaultTheme: 'islands',
  defaultMode: 'auto'
});

// 切换主题
switchTheme('dark');

// 获取当前主题
const current = themeManager.getCurrentTheme();
```

### i18n 国际化

```javascript
import { setLanguage, t, initI18n } from 'yoya-basic';

// 初始化多语言
initI18n({
  defaultLanguage: 'zh-CN',
  languages: {
    'zh-CN': {
      welcome: '欢迎',
      login: '登录'
    },
    'en-US': {
      welcome: 'Welcome',
      login: 'Login'
    }
  }
});

// 设置语言
setLanguage('zh-CN');

// 使用翻译
div(t('welcome', '默认文本'));
```

### 状态机

组件支持状态管理机制：

```javascript
import { vButton } from 'yoya-basic';

const btn = vButton('按钮');

// 设置状态
btn.setState('disabled', true);
btn.setState('active', false);

// 获取状态
const isDisabled = btn.getBooleanState('disabled');

// 链式设置
btn.disabled(true).active(false);
```

## 开发建议

### 组件优先使用原则

**核心原则**：优先使用项目提供的组件和布局，组件没有的功能才使用基础元素构建应用。

**优先级顺序**：
```
页面组件 (vBody) > UI 组件 > 布局组件 > SVG 组件 > 基础元素
```

**为什么优先使用组件？**
1. **样式一致性** - 组件使用主题变量，自动适配明/暗主题
2. **开箱即用** - 组件已封装好常用功能和交互
3. **代码复用** - 避免重复编写相同的样式和逻辑
4. **易于维护** - 组件更新时，所有使用处自动受益
5. **状态管理** - 组件内置状态机，支持状态驱动

```javascript
// ✅ 推荐：使用 vBody 和 vCard 组件
vBody(b => {
  b.center();
  b.child(vCard(c => {
    c.cardHeader('标题');
    c.cardBody('内容');
  }));
});

// ❌ 不推荐：使用 div 手动设置样式
div(d => {
  d.styles({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'white'
  });
  d.child(div(inner => {
    inner.styles({
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px'
    });
    inner.h2('标题');
    inner.p('内容');
  }));
});
```

### 布局组件优先

```javascript
// ✅ 推荐：使用 flex 布局组件
flex(f => {
  f.row().justifyCenter().alignCenter().gap('16px');
  f.vButton('按钮 1');
  f.vButton('按钮 2');
});

// ❌ 不推荐：手动设置 flex 样式
div(d => {
  d.styles({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px'
  });
  d.button('按钮 1');
  d.button('按钮 2');
});
```

### 函数式业务组件

对于复杂业务场景，推荐使用函数封装业务组件，而非直接使用基础元素拼装：

```javascript
// ✅ 推荐：函数组件
function UserSelectTable({ users, onSelect }) {
  return table(t => {
    t.thead(h => {
      h.tr(row => {
        row.th('姓名');
        row.th('邮箱');
        row.th('操作');
      });
    });
    t.tbody(body => {
      users.forEach(user => {
        body.tr(row => {
          row.td(user.name);
          row.td(user.email);
          row.td(button('选择').onclick(() => onSelect?.(user)));
        });
      });
    });
  });
}

// 使用
vBody(b => {
  b.child(UserSelectTable({
    users: [...],
    onSelect: (user) => console.log(user)
  }));
}).bindTo('#app');
```

### 性能优化

```javascript
// ✅ 使用对象配置（AI 推荐）
vCard({
  header: '标题',
  body: '内容'
});

// ✅ 复用组件引用
const card = vCard();
// 多次更新内容
card.cardHeader('新标题');
card.cardBody('新内容');

// ❌ 避免频繁创建新对象
```

## 常见问题

### Q: 如何调试？

```javascript
// 在 HTML 中引入
<script type="module">
  import { div } from './yoya/index.js';

  try {
    div('Hello').bindTo('#app');
  } catch (e) {
    console.error('渲染错误:', e);
  }
</script>
```

### Q: 如何在 SSR 中使用？

```javascript
// 服务端渲染静态内容
// 客户端局部增强
<div id="widget-container"></div>

<script type="module">
  import { vEchart } from './yoya.echart.esm.js';
  vEchart({ /* 配置 */ }).bindTo('#widget-container');
</script>
```

### Q: 微前端如何集成？

```javascript
// 微服务 A: 导出组件
export function MicroPage() {
  return div(page => {
    page.h1('微服务 A 页面');
  });
}

// 主应用：动态加载
const { MicroPage } = await import('./micro-app-a.js');
MicroPage().bindTo('#micro-container');
```

## 输出格式

根据用户需求提供：
- 清晰的导入语句
- 可运行的代码示例
- 关键 API 和参数说明
- 相关组件推荐

## 注意事项

1. **组件优先原则** —— 优先使用 vBody、UI 组件、布局组件，最后才考虑基础元素
2. Yoya.Basic 运行在浏览器环境，不需要 Node.js 构建
3. 使用 ES 模块语法（import/export）
4. 所有组件都支持链式调用
5. setup 支持三种方式：字符串、对象、函数
6. 元素必须调用 `bindTo()` 绑定到 DOM 才能显示
7. **不要在 setup 中直接操作 DOM** —— 使用库提供的方法
8. **使用主题变量** —— 组件样式使用 `var(--islands-xxx)` 变量，适配明/暗主题
