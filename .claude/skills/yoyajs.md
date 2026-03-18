# yoyajs

在其他项目中使用 Yoya.Basic 库的 API。

## 触发条件

当用户要求：
- 在新项目中使用 Yoya.Basic 库
- 导入 Yoya.Basic 组件
- 创建基于 Yoya.Basic 的页面或组件
- 查询 Yoya.Basic API 用法

时触发此技能。

## Yoya.Basic 库概述

Yoya.Basic 是一个浏览器原生的 HTML DSL 库，提供类似 Kotlin HTML DSL 的声明式语法。

**特点：**
- 纯 ES 模块，无需构建工具
- 声明式组件语法
- 支持 TypeScript 类型声明
- 内置主题系统和状态机

## 核心 API

### 基础元素

```javascript
import { div, span, p, h1, h2, button, input } from 'yoya';

// 字符串方式（简单文本）
div('Hello World');

// 对象配置方式（简单配置）
button({
  onClick: () => alert('clicked'),
  text: '点击我'
});

// 函数回调方式（复杂内容）
div(box => {
  box.h1('标题');
  box.p('内容');
});

// 链式调用
div()
  .className('container')
  .styles({ padding: '20px' })
  .child(h1('标题'));
```

### 布局组件

```javascript
import { flex, grid, vstack, hstack, center } from 'yoya';

// Flex 布局
flex(f => {
  f.row().justifyCenter().alignCenter();
  f.div('项目 1');
  f.div('项目 2');
});

// 垂直堆叠
vstack(s => {
  s.gap('16px');
  s.div('上');
  s.div('下');
});

// 水平堆叠
hstack(s => {
  s.gap('16px');
  s.div('左');
  s.div('右');
});

// 网格布局
grid(g => {
  g.columns(3);
  g.gap('20px');
});
```

### UI 组件

```javascript
import { vCard, vButton, vMenu, vInput, toast } from 'yoya';

// 卡片组件
vCard(c => {
  c.vCardHeader('标题');
  c.vCardBody('内容');
  c.vCardFooter(f => {
    f.child(vButton('操作'));
  });
});

// 按钮
vButton('点击')
  .type('primary')
  .size('large')
  .onClick(() => toast.success('成功'));

// 消息提示
toast.success('操作成功');
toast.error('操作失败');
toast.warning('警告信息');
toast.info('提示信息');
```

### 表单组件

```javascript
import { vInput, vCheckboxes, vTimer } from 'yoya';

// 输入框
vInput(i => {
  i.type('text');
  i.placeholder('请输入...');
  i.value('默认值');
  i.onChange((val) => console.log(val));
});

// 复选框组
vCheckboxes(cb => {
  cb.options([
    { value: 'a', label: '选项 A' },
    { value: 'b', label: '选项 B' }
  ]);
  cb.multiple(true);
  cb.onChange((values) => console.log(values));
});

// 日期选择器
vTimer(t => {
  t.type('date');
  t.value('2024-03-15');
  t.onChange((val) => console.log(val));
});
```

### 路由组件

```javascript
import { vRouter, vLink, vRouterView } from 'yoya';

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
vRouterView(router);
```

### Modal 弹出框

```javascript
import { vModal, vConfirm, toast } from 'yoya';

// 基础弹出框
const modal = vModal(m => {
  m.content(c => {
    c.p('弹出框内容');
  });
  m.footer(f => {
    f.button('取消', b => b.onClick(() => modal.hide()));
    f.button('确定', b => {
      b.type('primary');
      b.onClick(() => {
        toast.success('已确认');
        modal.hide();
      });
    });
  });
});
modal.show();

// 带标题的弹出框
const titleModal = vModal(m => {
  m.title('📢 系统通知');
  m.content(c => {
    c.p('您有一条新的系统消息');
  });
  m.footer(f => {
    f.button('我知道了', b => {
      b.type('primary');
      b.onClick(() => modal.hide());
    });
  });
  m.width('450px');
});

// 确认框
vConfirm('⚠️ 删除确认', '确定要删除吗？', setup => {
  setup
    .confirmText('删除')
    .cancelText('取消')
    .onConfirm(() => toast.error('已删除'))
    .onCancel(() => toast.info('已取消'))
    .show();
});

// 快捷确认方法
confirm('确定要执行此操作吗？',
  () => toast.success('已确认'),
  () => toast.info('已取消')
);

// API: title(), content(), footer(), width(), closable(), maskClosable(),
//      show(), hide(), toggle(), afterClose()
```

### Tabs 标签页

```javascript
import { vTabs, vTab, vTabPanel } from 'yoya';

// 基础标签页
const tabs = vTabs(t => {
  t.tab('tab1', '标签 1');
  t.tab('tab2', '标签 2');
  t.tab('tab3', '标签 3');
  t.defaultTab('tab1');

  t.panel('tab1', panel => {
    panel.p('标签页 1 的内容');
  });
  t.panel('tab2', panel => {
    panel.p('标签页 2 的内容');
  });
  t.panel('tab3', panel => {
    panel.p('标签页 3 的内容');
  });

  t.onChange((tabId) => {
    console.log('切换到:', tabId);
  });
});
```

### Pager 分页组件

```javascript
import { vPager } from 'yoya';

// 基础分页
const pager = vPager(p => {
  p.total(100);        // 总条目数
  p.pageSize(10);      // 每页显示数
  p.current(1);        // 当前页

  p.onChange((page) => {
    console.log('当前页:', page);
    // 加载数据...
  });
});

// 自定义显示
vPager(p => {
  p.total(200);
  p.pageSize(20);
  p.showTotal(true);   // 显示总数
  p.showQuickJumper(true);  // 显示快速跳转
  p.onChange(loadData);
});
```

### Echart 图表组件

```javascript
import { vEchart } from 'yoya';

// 柱状图
vEchart(e => {
  e.width('600px').height('400px');
  e.option({
    title: { text: '销售统计' },
    xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五'] },
    yAxis: { type: 'value' },
    series: [{
      type: 'bar',
      data: [120, 200, 150, 80, 70],
      itemStyle: { color: '#1E40AF' }
    }]
  });
});

// 折线图
vEchart(e => {
  e.option({
    title: { text: '趋势分析' },
    xAxis: { type: 'category', data: ['1 月', '2 月', '3 月', '4 月'] },
    yAxis: { type: 'value' },
    series: [{
      type: 'line',
      data: [820, 932, 901, 1234],
      smooth: true
    }]
  });
});

// 饼图
vEchart(e => {
  e.option({
    title: { text: '占比分析' },
    series: [{
      type: 'pie',
      radius: '50%',
      data: [
        { value: 1048, name: '搜索引擎' },
        { value: 735, name: '直接访问' },
        { value: 580, name: '邮件营销' }
      ]
    }]
  });
});
```

### Table 表格组件

```javascript
import { vTable } from 'yoya';

// 基础表格
vTable(t => {
  t.columns([
    { key: 'name', title: '姓名' },
    { key: 'age', title: '年龄' },
    { key: 'email', title: '邮箱' }
  ]);
  t.data([
    { name: '张三', age: 25, email: 'zhangsan@example.com' },
    { name: '李四', age: 30, email: 'lisi@example.com' }
  ]);
  t.striped(true);     // 斑马纹
  t.hoverable(true);   // 悬停高亮
});

// 带操作的表格
vTable(t => {
  t.columns([
    { key: 'name', title: '姓名' },
    {
      key: 'action',
      title: '操作',
      render: (row) => `
        <button onclick="edit(${row.id})">编辑</button>
        <button onclick="del(${row.id})">删除</button>
      `
    }
  ]);
  t.data(userData);
});
```

### Code 代码展示组件

```javascript
import { vCode, toast } from 'yoya';

// 基础代码展示
vCode(c => {
  c.content(`
const hello = (name) => {
  console.log('Hello, ' + name);
};
hello('World');
  `);
  c.language('javascript');
  c.title('💻 JavaScript 示例');
  c.onCopy(() => {
    toast.success('代码已复制');
  });
});

// 不带标题栏
vCode(c => {
  c.content('console.log("Hello");');
  c.showCopyButton(false);
  c.showLineNumbers(false);
});

// 快速创建
codeBlock('示例代码', `const x = 1;`);
```

### Detail 详情组件

```javascript
import { vDetail } from 'yoya';

// 基础详情
vDetail(d => {
  d.title('用户信息');
  d.item('姓名', '张三');
  d.item('年龄', '25 岁');
  d.item('邮箱', 'zhangsan@example.com');
  d.item('地址', '北京市朝阳区');
});

// 自定义内容
vDetail(d => {
  d.title('订单详情');
  d.item('订单号', '20240318001');
  d.item('状态', '已完成');
  d.item('商品', c => {
    c.ul(list => {
      list.li('商品 A x 2');
      list.li('商品 B x 1');
    });
  });
  d.item('总价', '¥299.00');
});
```

### Field 字段组件

```javascript
import { vField } from 'yoya';

// 基础字段
vField(f => {
  f.label('用户名');
  f.required(true);
  f.child(vInput(i => {
    i.placeholder('请输入用户名');
  }));
  f.help('用户名长度为 3-20 个字符');
});

// 字段组
vField(f => {
  f.label('联系方式');
  f.child(vInput(i => {
    i.type('tel');
    i.placeholder('手机号');
  }));
  f.child(vInput(i => {
    i.type('email');
    i.placeholder('邮箱');
  }));
});
```

### Switchers 切换器组件

```javascript
import { vSwitch, vRadio, vRadioGroup } from 'yoya';

// 开关
vSwitch(s => {
  s.checked(true);
  s.onChange((checked) => {
    console.log('开关状态:', checked);
  });
});

// 单选组
vRadioGroup(g => {
  g.option('1', '选项 A');
  g.option('2', '选项 B');
  g.option('3', '选项 C');
  g.value('1');
  g.onChange((value) => {
    console.log('选中:', value);
  });
});

// 单选按钮
vRadio(r => {
  r.label('同意协议');
  r.checked(true);
});
```

### Card 卡片组件

```javascript
import { vCard, cardHeader, cardBody, cardFooter } from 'yoya';

// 基础卡片
vCard(c => {
  c.cardHeader('卡片标题');
  c.cardBody('卡片内容区域');
  c.cardFooter(f => {
    f.child(vButton('操作'));
  });
});

// 多内容卡片
vCard(c => {
  c.cardHeader(h => {
    h.h3('用户信息');
    h.button('编辑', b => b.onClick(openEdit));
  });
  c.cardBody(body => {
    body.p('姓名：张三');
    body.p('年龄：25 岁');
    body.p('邮箱：zhangsan@example.com');
  });
});
```

### Menu 菜单组件

```javascript
import { vMenu, menuItem, dropdownMenu, contextMenu, toast } from 'yoya';

// 基础菜单
vMenu(m => {
  m.item(it => {
    it.text('📋 菜单项 1')
      .onclick(() => toast.info('菜单项 1'));
  });
  m.item(it => {
    it.text('📁 菜单项 2')
      .onclick(() => toast.info('菜单项 2'));
  });
  m.divider();
  m.item(it => {
    it.text('⚙️ 设置')
      .onclick(() => toast.info('设置'));
  });
});

// 带分组菜单
vMenu(m => {
  m.group(g => {
    g.label('文件操作');
    g.item(it => {
      it.text('📄 新建').onclick(() => toast.info('新建'));
    });
    g.item(it => {
      it.text('📂 打开').onclick(() => toast.info('打开'));
    });
  });
});

// 下拉菜单
dropdownMenu(d => {
  d.trigger('点击我');
  d.menuContent(vMenu(m => {
    m.item(it => {
      it.text('📋 选项 1').onclick(() => toast.info('选项 1'));
    });
  }));
  d.closeOnClickOutside();
});

// 右键菜单
const ctxMenu = contextMenu(ctx => {
  ctx.menuContent(vMenu(m => {
    m.item(it => {
      it.text('✏️ 编辑').onclick(() => {
        toast.info('编辑');
        ctxMenu.hide();
      });
    });
    m.item(it => {
      it.text('🗑️ 删除').danger().onclick(() => {
        toast.error('删除');
        ctxMenu.hide();
      });
    });
  }));
});
ctxMenu.target(document.getElementById('target'));
```

### SVG 组件

```javascript
import { svg, circle, rect, path } from 'yoya';

svg(s => {
  s.viewBox(0, 0, 100, 100);
  s.circle(c => {
    c.cx(50).cy(50).r(40);
    c.style('fill', 'red');
  });
  s.rect(r => {
    r.x(10).y(10).width(80).height(80);
    r.style('fill', 'blue');
  });
});
```

## 完整示例

### 创建简单页面

```javascript
import { div, h1, p, vButton, toast } from 'yoya';

div(page => {
  page.styles({ padding: '20px', maxWidth: '800px', margin: '0 auto' });

  page.h1('欢迎使用 Yoya.Basic');
  page.p('这是一个基于 HTML DSL 的库');

  page.child(vButton('点击我')
    .type('primary')
    .onClick(() => toast.success('你好！')));

  page.bindTo('#app');
});
```

### 创建卡片列表

```javascript
import { grid, vCard, responsiveGrid } from 'yoya';

responsiveGrid(g => {
  g.minSize('250px');
  g.gap('16px');

  const items = [
    { title: '卡片 1', content: '内容 1' },
    { title: '卡片 2', content: '内容 2' },
    { title: '卡片 3', content: '内容 3' }
  ];

  items.forEach(item => {
    g.child(vCard(c => {
      c.vCardHeader(item.title);
      c.vCardBody(item.content);
    }));
  });

  g.bindTo('#app');
});
```

## 安装方式

### npm 安装

```bash
npm install yoya-basic
```

### CDN 引入

```html
<script type="module">
  import { div, button } from 'https://cdn.jsdelivr.net/npm/yoya-basic/dist/yoya.esm.js';
</script>
```

### 本地引入

```html
<script type="module" src="./src/yoya/index.js"></script>
```

## 主题系统

```javascript
import { initTheme, createLightTheme, createDarkTheme } from 'yoya/theme';

initTheme({
  defaultTheme: 'islands',
  defaultMode: 'auto',
  themes: new Map([
    ['islands', {
      factory: createLightTheme,
      darkFactory: createDarkTheme
    }]
  ])
});
```

## 使用步骤

1. **确认项目需求** - 了解用户要创建什么类型的页面/组件
2. **选择合适组件** - 根据需求推荐 Yoya.Basic 组件
3. **生成示例代码** - 提供可直接使用的代码片段
4. **解释 API 用法** - 说明关键 API 和参数
5. **提供完整示例** - 给出可运行的完整代码

## 输出格式

- 提供清晰的导入语句
- 给出可运行的代码示例
- 解释关键 API 和参数
- 提供相关组件文档链接

## 注意事项

1. Yoya.Basic 运行在浏览器环境，不需要 Node.js 构建
2. 使用 ES 模块语法（import/export）
3. 所有组件都支持链式调用
4. setup 支持三种方式：字符串、对象、函数
5. 组件优先原则：优先使用 UI 组件，其次布局组件，最后基础元素
