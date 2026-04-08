# Yoya.Basic 组件开发计划

## 概述

本文档规划了 Yoya.Basic 组件库的后续开发计划，包括缺失组件的分类、API 设计、实现优先级。

## 文件组织原则

**同一类型的组件合并到同一个文件中**，参考现有组件系统：

- `form.js` - 包含 9 个表单组件（VInput, VSelect, VTextarea, VCheckbox, VCheckboxes, VSwitch, VForm, VTimer, VTimer2）
- `menu.js` - 包含 9 个菜单组件（VMenu, VMenuItem, VMenuDivider, VMenuGroup, VSubMenu, VDropdownMenu, VContextMenu, VSidebar, VTopNavbar）
- `modal.js` - 包含 3 个组件（VModal, VConfirm, vConfirm）

## 开发计划

### 第一阶段：栅格系统（优先级：高）✅ 已完成

**文件**: `src/yoya/components/grid.js`

**组件列表**:
| 组件名 | 工厂函数 | 说明 | 状态 |
|--------|----------|------|------|
| VRow | vRow | 栅格行容器，支持 gutter 响应式 | ✅ 已完成 |
| VCol | vCol | 栅格列，支持 span/offset/响应式断点 | ✅ 已完成 |

**完成情况**:
- ✅ 组件实现（grid.js）
- ✅ CSS 样式（theme/css/components/grid.css）
- ✅ 导出配置（components/index.js, index.js）
- ⏳ 测试用例（待编写）
- ⏳ 使用示例（待编写）

**24 栅格系统特性**:
- 24 等分栅格布局
- 支持 span（1-24 占位）
- 支持 offset（偏移量）
- 支持 gutter（列间距，支持响应式）
- 支持 6 个响应式断点：xs (<576px), sm (≥576px), md (≥768px), lg (≥992px), xl (≥1200px), xxl (≥1600px)

**API 设计**:

```javascript
// 基础用法 - 均分列
vRow(r => {
  r.col(c => c.span(12)).text('左');
  r.col(c => c.span(12)).text('右');
});

// 带间距
vRow(r => {
  r.gutter(16);  // 16px 间距
  r.col(c => c.span(8)).text('左');
  r.col(c => c.span(16)).text('右');
});

// 偏移
vRow(r => {
  r.col(c => c.span(8).offset(8)).text('偏移 8 列');
});

// 响应式
vRow(r => {
  r.col(c => {
    c.span(24).xsSpan(12).mdSpan(8).lgSpan(6);
  }).text('响应式列');
});

// 垂直对齐
vRow(r => {
  r.align('top');     // top | middle | bottom | stretch
  r.justify('start'); // start | center | end | between | around
  r.col(c => c.span(12)).text('左');
  r.col(c => c.span(12)).text('右');
});
```

**VRow API**:
| 方法 | 参数 | 说明 | 返回值 |
|------|------|------|--------|
| `gutter(value)` | number\|string\|object | 列间距（支持响应式对象） | this |
| `align(type)` | string | 垂直对齐：top/middle/bottom/stretch | this |
| `justify(type)` | string | 水平对齐：start/center/end/between/around | this |
| `wrap(bool)` | boolean | 是否换行 | this |
| `col(setup)` | function | 添加子列 | this |

**VCol API**:
| 方法 | 参数 | 说明 | 返回值 |
|------|------|------|--------|
| `span(n)` | number (1-24) | 占位格数 | this |
| `offset(n)` | number (0-24) | 偏移格数 | this |
| `xsSpan(n)` | number | <576px 断点占位 | this |
| `smSpan(n)` | number | ≥576px 断点占位 | this |
| `mdSpan(n)` | number | ≥768px 断点占位 | this |
| `lgSpan(n)` | number | ≥992px 断点占位 | this |
| `xlSpan(n)` | number | ≥1200px 断点占位 | this |
| `xxlSpan(n)` | number | ≥1600px 断点占位 | this |
| `xsOffset(n)` | number | <576px 断点偏移 | this |
| `smOffset(n)` | number | ≥576px 断点偏移 | this |
| `mdOffset(n)` | number | ≥768px 断点偏移 | this |
| `lgOffset(n)` | number | ≥992px 断点偏移 | this |
| `xlOffset(n)` | number | ≥1200px 断点偏移 | this |
| `xxlOffset(n)` | number | ≥1600px 断点偏移 | this |
| `order(n)` | number | 布局顺序 | this |

**与现有 Grid 组件的区别**:
| 特性 | Grid (现有) | VGrid (新增) |
|------|-----------|-------------|
| 底层技术 | CSS Grid Layout | Flexbox + 百分比宽度 |
| 布局方式 | 显式/隐式轨道 | 24 等分栅格 |
| 响应式 | 手动媒体查询 | 内置断点系统 |
| 使用场景 | 通用网格布局 | 标准化页面布局 |
| 类比 | CSS Grid 原生封装 | Ant Design Row/Col |

---

### 第二阶段：基础 UI 组件（优先级：中）

**文件**: `src/yoya/components/ui.js`

**组件列表**:
| 组件名 | 工厂函数 | 说明 |
|--------|----------|------|
| VAvatar | vAvatar | 头像组件，支持图片/图标/文字 |
| VBadge | vBadge | 徽标组件，支持数字/圆点/独立模式 |
| VProgress | vProgress | 进度条组件，支持百分比/状态/动画 |
| VSkeleton | vSkeleton | 骨架屏组件，支持段落/头像/卡片等预设 |
| VTag | vTag | 标签组件，支持多种颜色/尺寸/可关闭 |
| VAlert | vAlert | 警告提示组件，支持四种状态/可关闭 |
| VBreadcrumb | vBreadcrumb | 面包屑导航组件 |

#### VAvatar API
```javascript
vAvatar(a => {
  a.src('avatar.jpg');         // 图片
  a.alt('用户头像');
  a.size(40);                   // 尺寸：large|default|small|数字
  a.shape('circle');            // circle | square
  a.onClick(() => {});
});

// 头像组
vAvatar.group(g => {
  g.max(3);                     // 最多显示 3 个
  a.child(vAvatar(...));
  a.child(vAvatar(...));
});
```

#### VBadge API
```javascript
// 基础用法
vBadge(b => {
  b.count(5);                   // 数字徽章
  b.target(button('按钮'));     // 包裹目标
});

// 状态徽章
vBadge(b => {
  b.dot();                      // 红点模式
  b.status('success');          // success | error | warning | processing
});

// 独立徽章
vBadge(b => {
  b.standalone();
  b.color('green');
});
```

#### VProgress API
```javascript
vProgress(p => {
  p.percent(75);                // 百分比 0-100
  p.type('line');               // line | circle | dashboard
  p.strokeWidth(10);            // 线条宽度
  p.showInfo(true);             // 显示进度文本
  p.status('active');           // normal | active | exception | success
  p.strokeColor('#1890ff');     // 进度条颜色
});
```

#### VSkeleton API
```javascript
// 段落骨架屏
vSkeleton(s => {
  s.type('paragraph');          // paragraph | avatar | button | image | input | table
  s.rows(3);                    // 段落行数
  s.active(true);               // 动画效果
});

// 组合骨架屏
vSkeleton(s => {
  s.avatar();                   // 头像占位
  s.title();                    // 标题占位
  s.paragraph(3);               // 3 行段落
});
```

#### VTag API
```javascript
vTag(t => {
  t.text('标签');
  t.color('blue');              // 预设颜色或自定义色值
  t.size('default');            // large | default | small
  t.bordered(true);             // 边框
  t.closable(true);             // 可关闭
  t.onClose(() => {});          // 关闭回调
  t.onClick(() => {});          // 点击回调
});
```

#### VAlert API
```javascript
vAlert(a => {
  a.message('这是一条警告信息');
  a.description('详细描述文本');
  a.type('warning');            // success | info | warning | error
  a.showIcon(true);             // 显示图标
  a.closable(true);             // 可关闭
  a.onClose(() => {});
  a.action(button('操作'));     // 自定义操作
});
```

#### VBreadcrumb API
```javascript
vBreadcrumb(b => {
  b.item('首页').onClick(() => {});
  b.item('列表').onClick(() => {});
  b.item('详情');               // 当前页面无需 onClick
  b.separator('/');             // 自定义分隔符
  b.maxCount(4);                // 最多显示项数
});
```

---

### 第三阶段：交互组件（优先级：中）

**文件**: `src/yoya/components/interaction.js`

**组件列表**:
| 组件名 | 工厂函数 | 说明 |
|--------|----------|------|
| VTooltip | vTooltip | 文字提示气泡，支持多方向 |
| VPopover | vPopover | 弹出气泡卡片，支持触发方式 |
| VDropdown | vDropdown | 下拉菜单，支持多选/搜索 |
| VCollapse | vCollapse | 折叠面板，支持手风琴模式 |
| VTree | vTree | 树形控件，支持复选/拖拽/搜索 |
| VTreeSelect | vTreeSelect | 树形选择器 |

#### VTooltip API
```javascript
vTooltip(t => {
  t.title('提示内容');
  t.target(button('悬停提示'));
  t.placement('top');           // top|topLeft|topRight|bottom|...
  t.trigger('hover');           // hover | click | focus
  t.color('#fff');              // 背景色
  t.visible(true);              // 控制显示/隐藏
  t.onVisibleChange((v) => {}); // 显示变化回调
});
```

#### VPopover API
```javascript
vPopover(p => {
  p.title('标题');
  p.content(div('内容'));       // 支持任意内容
  p.target(button('点击弹出'));
  p.trigger('click');           // click | hover | focus | contextMenu
  p.placement('top');
  p.width(300);                 // 弹出宽度
  p.overlayClassName('custom'); // 自定义类名
  p.onVisibleChange((v) => {});
});
```

#### VDropdown API
```javascript
vDropdown(d => {
  d.trigger(button('下拉菜单'));
  d.menu(m => {
    m.item('选项 1').onClick(() => {});
    m.item('选项 2').onClick(() => {});
    m.divider();
    m.item('选项 3').onClick(() => {});
  });
  d.placement('bottomLeft');
  d.trigger('click');           // click | hover
  d.multiple(true);             // 多选模式
  d.searchable(true);           // 可搜索
  d.onSelect((value) => {});
});
```

#### VCollapse API
```javascript
vCollapse(c => {
  c.panel(p => {
    p.header('面板 1');
    p.key('panel1');
    p.content(div('面板 1 内容'));
    p.disabled(false);
  });
  c.panel(p => {
    p.header('面板 2');
    p.key('panel2');
    p.content(div('面板 2 内容'));
  });
  c.accordion(true);            // 手风琴模式
  c.activeKey(['panel1']);      // 激活的面板
  c.onChange((keys) => {});     // 切换回调
});
```

#### VTree API
```javascript
vTree(t => {
  t.data([
    { key: '1', title: '节点 1', children: [...] },
    { key: '2', title: '节点 2', children: [...] }
  ]);
  t.checkable(true);            // 显示复选框
  t.selectable(true);           // 可选中节点
  t.expandable(true);           // 可展开
  t.defaultExpandAll(false);    // 默认展开所有
  t.defaultExpandedKeys(['1']); // 默认展开的 key
  t.checkedKeys(['1', '2']);    // 选中的 key
  t.autoExpandParent(true);     // 自动展开父节点
  t.showLine(true);             // 展示树状连接线
  t.draggable(true);            // 可拖拽
  t.onExpand((keys) => {});     // 展开回调
  t.onSelect((keys, info) => {}); // 选择回调
  t.onCheck((keys, info) => {});  // 复选回调
  t.onDrop((info) => {});         // 拖拽回调
});
```

#### VTreeSelect API
```javascript
vTreeSelect(ts => {
  ts.data([...]);               // 树形数据
  ts.placeholder('请选择');
  ts.value('1');                // 选中值
  ts.multiple(false);           // 多选
  ts.searchable(true);          // 可搜索
  ts.showSearch(true);          // 显示搜索框
  ts.allowClear(true);          // 显示清除按钮
  ts.dropdownStyle({ height: 300 });
  ts.onChange((value, node) => {});
});
```

---

### 第四阶段：数据展示组件（优先级：低）

**文件**: `src/yoya/components/data-display.js`

**组件列表**:
| 组件名 | 工厂函数 | 说明 |
|--------|----------|------|
| VTimeline | vTimeline | 时间轴组件，支持自定义节点 |
| VCalendar | vCalendar | 日历组件，支持事件标记 |
| VCarousel | vCarousel | 走马灯轮播组件 |
| VStatistic | vStatistic | 统计数值组件，支持动画 |
| VDescriptions | vDescriptions | 描述列表组件 |

---

### 第五阶段：导航组件（优先级：低）

**文件**: `src/yoya/components/navigation.js`

**组件列表**:
| 组件名 | 工厂函数 | 说明 |
|--------|----------|------|
| VPagination | vPagination | 分页组件（简化版，完整功能在 pager.js） |
| VSteps | vSteps | 步骤条组件 |
| VAnchor | vAnchor | 锚点组件 |
| VAffix | vAffix | 固钉组件 |
| VBackTop | vBackTop | 回到顶部组件 |

---

## 实现规范

### 代码结构

每个组件遵循以下结构：

```javascript
/**
 * Yoya.Components - {组件类别}
 * {说明}
 */

import { Tag, div, span, ... } from '../core/basic.js';

// ============================================
// {组件名}
// ============================================

class {组件名} extends Tag {
  static _stateAttrs = ['状态 1', '状态 2'];

  constructor(setup = null) {
    super('div', null);

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({...});

    // 3. 设置基础样式
    this._setupBaseStyles();

    // 4. 保存基础样式快照
    this.saveBaseStylesSnapshot();

    // 5. 注册状态处理器
    this._registerStateHandlers();

    // 6. 创建内部元素
    this._createInternalElements();

    // 7. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }
  }

  // _setupString 处理字符串 setup
  _setupString(setup) {
    // 处理字符串参数
  }

  _setupBaseStyles() {
    this.addClass('yoya-{组件名}');
    // 基础样式
  }

  _createInternalElements() {
    // 创建内部 DOM 结构
  }

  _registerStateHandlers() {
    // 状态变更处理器
  }

  // 公开 API 方法
  someMethod(value) {
    this._someValue = value;
    // 更新 UI
    return this;  // 链式调用
  }

  // Getter
  getSomeValue() {
    return this._someValue;
  }
}

// 工厂函数
function {组件名}(setup = null) {
  return new {组件名}(setup);
}

// 导出
export { {组件名}, {工厂函数名} };
```

### CSS 命名规范

- 组件根节点：`yoya-{组件名}`
- 子元素：`yoya-{组件名}__{子元素}`
- 状态修饰：`yoya-{组件名}--{状态}`
- 示例：
  ```css
  .yoya-button { }
  .yoya-button__icon { }
  .yoya-button--large { }
  .yoya-button--disabled { }
  ```

### 测试用例

每个组件创建对应的测试文件 `tests/{组件名}.test.js`：

```javascript
import { describe, it, expect } from './test-utils.js';
import { {工厂函数名} } from '../src/yoya/index.js';

describe('{组件名}', () => {
  it('基础渲染', () => {
    const comp = {工厂函数名}();
    expect(comp).toBeDefined();
  });

  it('支持 setup 函数', () => {
    const comp = {工厂函数名}(c => {
      c.someMethod('value');
    });
    // 断言...
  });

  it('状态切换', () => {
    const comp = {工厂函数名}();
    comp.setState('disabled', true);
    // 断言样式变化...
  });
});
```

---

## 优先级排序

| 优先级 | 文件 | 组件数 | 预估工作量 |
|--------|------|--------|------------|
| P0 | components/grid.js | 2 | 2 天 |
| P1 | components/ui.js | 7 | 5 天 |
| P1 | components/interaction.js | 6 | 5 天 |
| P2 | components/data-display.js | 5 | 4 天 |
| P2 | components/navigation.js | 5 | 3 天 |

**总计**: 5 个文件，25 个组件，约 19 个工作日

---

## 与现有组件的关系

### 不重复造轮子

| 新组件 | 现有类似组件 | 差异说明 |
|--------|-------------|----------|
| VGrid | Grid | Grid 是 CSS Grid 封装，VGrid 是 24 栅格系统（不同技术路线） |
| VPager | Pager | Pager 是完整分页器，VPagination 是简化版用于表格等场景 |
| VAlert | toast | toast 是全局消息，VAlert 是页面内嵌警告 |
| VCollapse | VTabs | VTabs 是标签页切换，VCollapse 是垂直折叠面板 |

### 互补关系

- **布局层**: Flex, Grid (CSS Grid) → 新增 VGrid (24 栅格)
- **反馈层**: toast (全局) → 新增 VAlert (内嵌)
- **导航层**: VTabs, VPager → 新增 VBreadcrumb, VSteps, VAnchor
- **展示层**: VDetail, VCode, VTable → 新增 VTimeline, VStatistic, VDescriptions

---

## 下一步

1. 实现 VGrid 组件（grid.js）
2. 编写对应测试用例
3. 添加 CSS 样式（theme/css/components/grid.css）
4. 更新 components/index.js 导出
5. 编写使用示例
