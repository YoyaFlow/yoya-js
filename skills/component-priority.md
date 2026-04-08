# 组件优先使用原则

## 核心理念

**优先使用组件，组件实现不了的才使用基础元素去实现页面。**

在使用 YoyaJS 或类似 DSL 库开发页面时，应遵循以下优先级顺序：

```
UI 组件 > 布局组件 > SVG 组件 > 基础元素
```

## 优先级分类

### 1. UI 组件（最高优先级）

**定义**：具有特定语义和交互功能的封装组件。

**常见组件**：
- `vCard` - 卡片容器
- `vButton` - 按钮组件
- `vMenu` / `vMenuItem` - 菜单组件
- `vDetail` - 详情展示
- `vField` / `vInput` - 表单输入
- `vTimer` / `vTimer2` - 日期/时间选择器
- `vCheckboxes` - 复选框组
- `vEchart` - 图表组件
- `toast` - 消息提示

**使用场景**：当页面需要标准 UI 元素时，优先使用现有组件。

**示例**：
```javascript
// ✅ 正确：使用 UI 组件
vCard(c => {
  c.vCardHeader('用户信息');
  c.vCardBody(c => {
    c.vInput(i => {
      i.label('用户名');
      i.placeholder('请输入用户名');
    });
    c.vButton('提交').onclick(submit);
  });
});

// ❌ 错误：用基础元素拼装
div(d => {
  d.styles({
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px'
  });
  d.div('用户信息').styles({ fontWeight: 'bold', marginBottom: '12px' });
  d.input().placeholder('请输入用户名');
  d.button('提交').on('click', submit);
});
```

### 2. 布局组件

**定义**：用于组织页面结构和元素排列的容器组件。

**常见组件**：
- `flex` - 弹性布局
- `grid` / `responsiveGrid` - 网格布局
- `vstack` - 垂直堆叠
- `hstack` - 水平堆叠
- `center` - 居中布局
- `container` - 响应式容器
- `divider` - 分割线

**使用场景**：当需要组织多个元素的排列方式时。

**示例**：
```javascript
// ✅ 正确：使用布局组件
flex(f => {
  f.row().justifyCenter().alignCenter().gap('16px');
  f.vButton('按钮 1');
  f.vButton('按钮 2');
  f.vButton('按钮 3');
});

// ✅ 正确：使用 vstack
vstack(v => {
  v.gap('20px');
  v.vCard('卡片 1');
  v.vCard('卡片 2');
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

### 3. SVG 组件

**定义**：用于创建矢量图形的组件。

**常见组件**：
- `svg` - SVG 容器
- `circle` / `ellipse` - 圆形/椭圆
- `rect` - 矩形
- `line` / `polyline` / `polygon` - 线条
- `path` - 路径
- `g` - 编组
- `linearGradient` / `radialGradient` - 渐变
- `filter` - 滤镜

**使用场景**：当需要绘制图标、图表、自定义图形时。

**示例**：
```javascript
// ✅ 正确：使用 SVG 组件
svg(s => {
  s.viewBox(0, 0, 100, 100);
  s.circle(c => {
    c.cx(50).cy(50).r(40);
    c.style('fill', '#3498db');
  });
});

// ❌ 错误：使用基础元素拼装 SVG
svg({ viewBox: '0 0 100 100' }, s => {
  s.child(new Tag('circle'))
   .attr('cx', 50)
   .attr('cy', 50)
   .attr('r', 40)
   .style('fill', '#3498db');
});
```

### 4. 基础元素（最低优先级）

**定义**：原生 HTML 元素的工厂函数。

**常见元素**：
- 容器：`div`, `span`, `section`, `article`
- 文本：`p`, `h1`-`h6`, `a`, `strong`, `em`
- 表单：`input`, `textarea`, `select`, `form`
- 列表：`ul`, `ol`, `li`
- 表格：`table`, `tr`, `td`, `th`

**使用场景**：
- 现有组件无法满足需求时
- 需要高度自定义的语义化结构时
- 创建新的封装组件时

## 判断标准

### 何时使用基础元素

| 场景 | 说明 | 示例 |
|------|------|------|
| 组件不存在 | 现有组件库没有对应功能 | 创建全新的业务组件 |
| 语义化需求 | 需要特定 HTML 语义标签 | `<article>`, `<nav>`, `<aside>` |
| 特殊布局 | 组件无法满足的特殊排列 | CSS Grid 复杂布局 |
| 性能优化 | 避免组件开销的简单场景 | 纯文本展示 |

### 何时优先使用组件

| 场景 | 说明 | 推荐组件 |
|------|------|----------|
| 表单输入 | 需要输入验证、错误提示 | `vInput`, `vField` |
| 消息提示 | 全局通知反馈 | `toast`, `messageContainer` |
| 卡片内容 | 信息卡片展示 | `vCard` 系列 |
| 导航菜单 | 下拉菜单、右键菜单 | `vMenu`, `dropdownMenu` |
| 数据图表 | 可视化图表 | `vEchart` |
| 常见布局 | 弹性/网格/堆叠布局 | `flex`, `grid`, `vstack` |

## 封装新组件指南

当现有组件无法满足需求时，应封装新组件而非重复使用基础元素拼装。

### 封装原则

1. **单一职责**：一个组件只做一件事
2. **可复用性**：设计时考虑通用性
3. **链式 API**：方法返回 `this` 支持链式调用
4. **状态管理**：使用 `registerStateAttrs` 管理状态
5. **组合优于继承**：优先组合基础元素

### 封装示例

```javascript
// ✅ 正确：封装 Avatar 组件
class VAvatar extends Tag {
  constructor(setup = null) {
    super('div', null);

    this._src = '';
    this._alt = '';
    this._size = 'default';

    // 注册状态
    this.registerStateAttrs('rounded', 'bordered');
    this.initializeStates({ rounded: true, bordered: false });

    // 基础样式
    this.styles({
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: '#e0e0e0',
    });

    // 注册状态处理器
    this._registerStateHandlers();

    if (setup) this.setup(setup);
  }

  _registerStateHandlers() {
    this.registerStateHandler('rounded', (val, host) => {
      host.style('borderRadius', val ? '50%' : '4px');
    });

    this.registerStateHandler('bordered', (val, host) => {
      host.style('border', val ? '2px solid #fff' : 'none');
    });
  }

  src(s) {
    if (s === undefined) return this._src;
    this._src = s;
    this._updateImage();
    return this;
  }

  size(s) {
    if (s === undefined) return this._size;
    this._size = s;
    this._applySize();
    return this;
  }

  _applySize() {
    const sizes = {
      small: '32px',
      default: '40px',
      large: '56px'
    };
    const size = sizes[this._size] || sizes.default;
    this.styles({ width: size, height: size });
  }

  _updateImage() {
    // 更新图片逻辑
  }
}

function vAvatar(setup = null) {
  return new VAvatar(setup);
}

// 使用
vAvatar(a => {
  a.src('/avatar.jpg');
  a.size('large');
  a.rounded();
});
```

## 快速参考

### 优先级决策树

```
需要实现页面功能
    │
    ▼
是否有对应的 UI 组件？
    │
    ├── 是 → 使用 UI 组件
    │
    └── 否 → 是否需要布局？
            │
            ├── 是 → 是否有对应的布局组件？
            │       │
            │       ├── 是 → 使用布局组件
            │       │
            │       └── 否 → 使用基础元素（考虑封装新布局组件）
            │
            └── 否 → 是否需要绘制图形？
                    │
                    ├── 是 → 使用 SVG 组件
                    │
                    └── 否 → 使用基础元素（考虑封装新 UI 组件）
```

### 常用场景速查

| 需求 | 优先选择 |
|------|----------|
| 显示卡片内容 | `vCard` + `vCardHeader` + `vCardBody` |
| 显示成功/错误提示 | `toast.success()` / `toast.error()` |
| 按钮组水平排列 | `flex().row()` |
| 表单输入框 | `vInput` 或 `vField` |
| 选择日期 | `vTimer` |
| 多选选项 | `vCheckboxes` |
| 显示图表 | `vEchart` |
| 右键菜单 | `contextMenu` |
| 下拉菜单 | `dropdownMenu` |
| 垂直列表 | `vstack` |
| 居中内容 | `center` |
| 分割线 | `divider` |
| 绘制图标 | `svg` + 形状组件 |
| 自定义组件 | 继承 `Tag` 封装新组件 |

## 总结

**核心思想**：
- 组件是封装了样式、交互、状态的可复用单元
- 使用组件可以提高开发效率、保持 UI 一致性、减少重复代码
- 基础元素是构建组件的基石，但不应在页面层直接大量使用
- 当发现多次使用相同的基础元素组合时，应考虑封装为新组件

**记住**：
> 优先使用组件，组件实现不了的才使用基础元素去实现页面。
