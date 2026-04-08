# V2 TOC 组件架构

## 概述

PageTOC 是一个独立的目录组件，用于在 VRouterViews 多视图容器中提供页面内导航功能。当用户在多个视图之间切换时，TOC 会自动更新以反映当前视图的目录结构。

## 组件位置

- **TOC 组件**: `src/v2/examples/framework/TOC.js`
- **AppShell 集成**: `src/v2/examples/framework/AppShell.js`
- **视图切换更新**: `src/v2/examples/home.js`

## 核心 API

### `pageTOC(options)`

创建 TOC 组件的工厂函数。

```javascript
export function pageTOC({
  items = [],         // TOC 目录项数组 [{ text, href, level }]
  title = '本页目录',  // 标题
  contentContainer = null  // 内容容器（用于监听滚动）
})
```

**内部状态**：
- `_items` - TOC 项目数组
- `_activeItem` - 当前激活的项目
- `_observer` - IntersectionObserver 实例
- `_contentContainer` - 滚动容器
- `_linksContainer` - 链接容器引用（缓存）

### `updateTOCItems(tocInstance, items, contentContainer)`

更新 TOC 项目，在视图切换时调用。

**流程**：
1. 清理旧的 IntersectionObserver
2. 清空 `_items` 数组
3. 清空链接容器 DOM
4. 重新添加新的 TOC 项目
5. 重新设置滚动监听

### `cleanupTOC(tocInstance)`

清理 TOC 资源，在视图关闭时调用。

## AppShell 集成

AppShell 组件中维护一个全局 TOC 实例：

```javascript
let globalTocInstance = null;
let globalTocItems = [];

// 首次创建 pageTOC 组件
if (!globalTocInstance) {
  globalTocInstance = pageTOC({
    items: [],
    title: '本页目录',
    contentContainer: null,
  });
  // 设置固定定位样式
  globalTocInstance.styles({
    position: 'fixed',
    top: '80px',
    right: '24px',
    width: '180px',
    zIndex: 10,
  });
  contentArea.child(globalTocInstance);
}

// 更新 TOC 内容
renderToc(tocItems);
```

## VRouterViews 视图切换流程

1. 用户点击左侧菜单
2. `Sidebar.onClick` 调用 `onNavigate(routePath)`
3. `addViewByRoutePath` 添加或激活视图
4. `VRouterViews.onChange` 回调触发
5. 调用 `updateToc(tocItems)` 更新 TOC
6. `updateTOCItems` 清空并重新填充 TOC 项目
7. `setupScrollObserver` 重新设置 IntersectionObserver

## IntersectionObserver 配置

```javascript
new IntersectionObserver((entries) => {
  let visibleSection = null;
  let maxRatio = 0;

  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const ratio = entry.intersectionRatio;
      if (ratio > maxRatio) {
        maxRatio = ratio;
        visibleSection = entry.target.id;
      }
    }
  });

  if (visibleSection) {
    updateActiveState(tocInstance, '#' + visibleSection);
  }
}, {
  root: contentEl,  // VRouterViews 的内容容器
  threshold: [0.1, 0.3, 0.5, 0.7]
});
```

## 激活状态样式

```javascript
// 激活状态
const activeStyles = {
  color: 'var(--yoya-primary, #2563EB)',
  fontWeight: '500',
  background: 'var(--yoya-primary-alpha, rgba(37, 99, 235, 0.1))',
  borderRight: '2px solid var(--yoya-primary, #2563EB)',
};

// 非激活状态
const inactiveStyles = {
  fontSize: level === 1 ? '14px' : '13px',
  padding: '6px 12px',
  color: 'var(--yoya-text-secondary, #666)',
  marginLeft: level === 1 ? '0' : '12px',
  cursor: 'pointer',
  borderRight: '2px solid transparent',
};
```

## 关键点

1. **TOC 实例只创建一次**：`globalTocInstance` 在 AppShell 初始化时创建，后续只更新内容
2. **_linksContainer 缓存**：在 `pageTOC` 初始化时缓存链接容器引用，避免每次都用 `querySelector` 查找
3. **视图切换时完整重置**：`updateTOCItems` 会清空所有项目并重新添加，确保 TOC 与当前视图同步
4. **IntersectionObserver 复用**：每次更新时先断开旧的 observer，再创建新的

## 相关文件

- `src/v2/examples/framework/TOC.js` - TOC 组件实现
- `src/v2/examples/framework/AppShell.js` - AppShell 主布局
- `src/v2/examples/home.js` - VRouterViews 入口和视图管理
- `src/yoya/components/router.js` - VRouterViews 组件
