---
name: VRouterViews 演示页面
description: VRouterViews 组件在 v2/examples/router.html 中的集成和使用示例
type: project
---

**日期:** 2026-04-01

在 `src/v2/examples/pages/Router/index.js` 中添加了 VRouterViews 多视图容器的演示。

## 实现内容

### 1. 演示用页面组件

添加了 4 个 VRouterViews 演示用的页面组件：

- `RVWelcomePage()` - 欢迎页面
- `RVUserManagePage()` - 用户管理页面（带表格）
- `RVSettingsPage()` - 系统设置页面（带表单）
- `RVAnalyticsPage()` - 数据分析页面（带统计卡片）

### 2. 路由配置

在主 router 中添加了 VRouterViews 演示路由：

```javascript
router.route('/rv/home', { component: () => RVWelcomePage() });
router.route('/rv/users', { component: () => RVUserManagePage() });
router.route('/rv/settings', { component: () => RVSettingsPage() });
router.route('/rv/analytics', { component: () => RVAnalyticsPage() });
```

### 3. VRouterViews 演示区域

在 DocSection 中添加了 `rvbasic` 章节，包含：

- 在线演示区域（4 个可切换视图）
- 基础用法代码示例
- 视图配置选项代码示例

### 4. API 文档

在 API 参考表格中添加了 `vRouterViews` 条目，并在"VRouterViews 方法"表格中列出了所有主要方法：

- `addView(name, options)` - 添加视图
- `setActiveView(name)` - 设置激活视图
- `getActiveViewName()` - 获取激活视图名称
- `getViews()` - 获取所有视图
- `removeView(name)` - 移除视图
- `updateViewTitle(name, title)` - 更新视图标题
- `onChange(fn)` - 设置视图变化回调

## 使用方式

访问 http://localhost:3002/v2/examples/router.html#rvbasic 查看 VRouterViews 演示。

## 注意事项

VRouterViews 需要和 vRouter 配合使用，且路由配置必须在同一个 router 实例上定义：

```javascript
vRouter(router => {
  router.default('/rv/home');

  // 必须先定义路由
  router.route('/rv/home', { component: ... });

  router.div(content => {
    content.vRouterViews(router, views => {
      // VRouterViews 使用同一个 router
      views.addView('home', { defaultRoute: '/rv/home' });
    });
  });
});
```
