---
name: v2-vrouterviews-toc-system
description: V2 VRouterViews 多视图模式下的 TOC（目录）系统实现
type: project
---

## VRouterViews TOC 系统

**实现时间**: 2026-04-07

### 架构设计

TOC 系统采用**单例容器 + 动态渲染**模式，确保视图切换时不会出现多个 TOC 重叠。

**核心文件**:
- `src/v2/examples/framework/AppShell.js` - TOC 容器和渲染逻辑
- `src/v2/examples/home.js` - TOC 配置映射 (`pageTocConfigs`)

### 实现细节

**AppShell.js 关键代码**:
```javascript
// 全局 TOC 容器引用（单例）
let globalTocContainer = null;
let globalTocItems = [];

function renderToc(items) {
  if (!globalTocContainer || !globalTocContainer._el) return;
  // 清空容器
  while (globalTocContainer._el.firstChild) {
    globalTocContainer._el.removeChild(globalTocContainer._el.firstChild);
  }
  // 重新渲染
  if (items && items.length > 0) {
    globalTocContainer.child(TableOfContents({ items }));
  }
}

// 固定 TOC 容器（只创建一次）
if (!globalTocContainer) {
  globalTocContainer = div(tocContainer => {
    tocContainer.styles({
      position: 'fixed',
      top: '80px',
      right: '24px',
      width: '180px',
      zIndex: 10,
    });
  });
  contentArea.child(globalTocContainer);
}

// 导出 updateToc 函数供 VRouterViews 模式使用
export function updateToc(tocItems) {
  globalTocItems = tocItems;
  renderToc(tocItems);
}
```

**home.js 配置**:
```javascript
const pageTocConfigs = {
  home: [...],
  button: [...],
  buttons: [...],
  // 所有其他页面的 TOC 配置
};

// VRouterViews onChange 回调
views.onChange((viewName) => {
  const tocItems = pageTocConfigs[viewName.toLowerCase()] || [];
  if (tocItems.length > 0) {
    updateToc(tocItems);
  }
});
```

### 已配置 TOC 的页面

| 页面 | TOC 项数 |
|------|---------|
| home | 3 |
| button | 5 |
| buttons | 8 |
| card | 4 |
| form | 7 |
| menu | 9 |
| table | 6 |
| detail | 4 |
| field | 5 |
| statistic | 6 |
| code | 4 |
| tabs | 5 |
| pager | 8 |
| message | 5 |
| modal | 7 |
| i18n | 3 |
| theme | 3 |
| echart | 4 |
| dashboard | 10 |
| vtree | 5 |
| body | 3 |
| ui-components | 7 |
| interaction | 7 |
| vtimer | 6 |

### 布局结构

```
┌─────────────────────────────────────────────────┐
│                TopNavbar                        │
├─────────────┬───────────────────────────────────┤
│             │                                   │
│  Sidebar    │      内容区                        │
│  (220px)    │    (右侧留 220px 给 TOC)            │
│             │                                   │
└─────────────┴───────────────────────────────────┘
                       │
                 ┌─────▼─────┐
                 │ 固定 TOC   │ (position: fixed)
                 │ top: 80px │
                 │ right: 24px│
                 └───────────┘
```

### 关键设计决策

1. **单例容器**: TOC 容器只创建一次，避免多次切换视图时累积多个容器
2. **清空重渲染**: 每次切换视图时清空容器内容并重新渲染 TOC
3. **固定定位**: 使用 `position: fixed` 确保 TOC 不随页面滚动
4. **预留空间**: 内容区右侧 padding 220px，防止内容被 TOC 遮挡
5. **统一接口**: 独立页面模式和 VRouterViews 模式使用相同的 `renderToc()` 函数

### 使用方式

**独立页面模式**:
```javascript
return AppShell({
  currentPage: 'button.html',
  tocItems: [
    { text: 'setup 三种方式', href: '#setup', level: 1 },
    { text: '基础用法', href: '#basic', level: 1 },
  ],
  content: (content) => { ... }
});
```

**VRouterViews 模式**:
```javascript
// home.js 中配置 pageTocConfigs
const pageTocConfigs = {
  button: [
    { text: 'setup 三种方式', href: '#setup', level: 1 },
    { text: '基础用法', href: '#basic', level: 1 },
  ],
};

// VRouterViews onChange 自动调用 updateToc
views.onChange((viewName) => {
  const tocItems = pageTocConfigs[viewName] || [];
  updateToc(tocItems);
});
```
