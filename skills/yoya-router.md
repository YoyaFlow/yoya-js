# yoya-router

YoyaJS 路由系统使用技能。当用户需要实现 SPA 路由、多视图切换、路由导航或基于路由的动态页面时触发此技能。

## 触发条件

- 用户需要实现单页应用 (SPA) 路由
- 用户需要实现多视图 tabs 界面
- 用户需要了解路由参数、导航守卫
- 用户需要视图状态持久化功能

## 路由组件概览

| 组件 | 用途 | 导入 |
|------|------|------|
| `VRouter` | 路由核心类 | 路由管理、导航、参数解析 |
| `VRouterView` | 单视图容器 | 渲染当前路由匹配的视图 |
| `VRouterViews` | 多视图容器 | tabs 式多视图界面 |
| `VLink` | 导航链接 | 声明式导航组件 |

---

## 基础用法

### 创建路由器

```javascript
import { VRouter } from './yoya/components/router.js';

// 创建路由器实例
const router = new VRouter({
  mode: 'hash',  // hash 模式（默认）
  routes: [
    { path: '/', component: HomePage },
    { path: '/user', component: UserPage },
    { path: '/user/:id', component: UserDetailPage },
    { path: '/settings', component: SettingsPage },
  ],
});

// 初始化路由（必须在绑定时机之前调用）
router.init();

// 绑定到页面
const app = div(app => {
  app.h1('我的应用');
  app.child(router.view());  // 使用 router.view() 获取视图容器
}).bindTo('#app');
```

### 路由导航

```javascript
// 编程式导航
router.navigate('/user');
router.navigate('/user/123');
router.navigate('/settings', { replace: true });  // 替换 history 而非 push

// 使用 VLink 组件
import { VLink } from './yoya/components/router.js';

const nav = div(nav => {
  nav.child(VLink({ to: '/', text: '首页' }));
  nav.child(VLink({ to: '/user', text: '用户' }));
  nav.child(VLink({ to: '/settings', text: '设置' }));
});
```

---

## VRouterView 单视图容器

VRouterView 用于渲染当前路由匹配的单个视图组件。

```javascript
import { VRouter, VRouterView } from './yoya/components/router.js';

const router = new VRouter({
  routes: [
    { path: '/', component: HomePage },
    { path: '/about', component: AboutPage },
  ],
});

router.init();

// 使用 VRouterView
const app = div(app => {
  app.nav(n => {
    n.child(VLink({ to: '/', text: '首页' }));
    n.child(VLink({ to: '/about', text: '关于' }));
  });
  
  // 视图容器 - 显示当前路由匹配的组件
  app.child(router.view());
}).bindTo('#app');
```

### 路由组件示例

```javascript
// 定义路由组件
function HomePage() {
  return div(h => {
    h.h1('首页');
    h.p('欢迎回家！');
  });
}

function AboutPage() {
  return div(a => {
    a.h1('关于');
    a.p('这是一个关于页面');
  });
}
```

---

## VRouterViews 多视图容器

VRouterViews 支持 tabs 式多视图界面，可以同时显示多个路由视图。

### 基础用法

```javascript
import { VRouter, VRouterViews } from './yoya/components/router.js';

const router = new VRouter({
  routes: [
    { path: '/dashboard', component: DashboardPage, meta: { title: '仪表盘', icon: '📊' } },
    { path: '/users', component: UsersPage, meta: { title: '用户', icon: '👥' } },
    { path: '/settings', component: SettingsPage, meta: { title: '设置', icon: '⚙️' } },
  ],
});

router.init();

// 创建多视图容器
const viewsContainer = VRouterViews(router, views => {
  views.autoAddFromRoutes();  // 自动从 routes 添加视图
});

// 或者手动添加视图
const viewsContainer2 = VRouterViews(router, views => {
  views.addView({
    viewId: 'dashboard',
    route: '/dashboard',
    title: '仪表盘',
    icon: '📊',
  });
  views.addView({
    viewId: 'users',
    route: '/users',
    title: '用户',
    icon: '👥',
  });
});

const app = div(app => {
  app.child(viewsContainer);
}).bindTo('#app');
```

### 视图操作

```javascript
// 获取多视图容器实例
const views = VRouterViews(router, v => {
  v.autoAddFromRoutes();
});

// 添加视图
views.addView({
  viewId: 'new-view',
  route: '/new-page',
  title: '新页面',
  icon: '📄',
  closable: true,  // 是否可关闭
});

// 移除视图
views.removeView('new-view');

// 激活视图
views.setActiveView('dashboard');

// 获取当前激活的视图 ID
const activeViewId = views.getActiveViewId();

// 获取所有视图
const allViews = views.getViews();
```

### 视图状态持久化

```javascript
const views = VRouterViews(router, v => {
  v.autoAddFromRoutes();
  v.enableStatePersistence();  // 启用 localStorage 持久化
});

// 刷新页面后，会恢复之前的视图状态
// 包括：打开的视图列表、激活的视图、视图顺序
```

---

## VLink 导航链接

VLink 组件提供声明式导航链接。

```javascript
import { VLink } from './yoya/components/router.js';

// 基础链接
VLink({ to: '/user', text: '用户中心' });

// 带替换模式（不产生 history 记录）
VLink({ to: '/home', text: '首页', replace: true });

// 自定义样式
VLink({
  to: '/settings',
  text: '设置',
  className: 'nav-link',
  activeClass: 'active',  // 当前路由匹配时的样式类
});

// 使用 setup 函数
VLink({ to: '/profile' }, link => {
  link.className('profile-link');
  link.text('个人主页');
});
```

---

## 路由参数

### 动态路由参数

```javascript
const router = new VRouter({
  routes: [
    { path: '/user/:id', component: UserDetailPage },
    { path: '/post/:postId/comment/:commentId', component: CommentPage },
  ],
});

// 在组件中访问参数
function UserDetailPage() {
  return div(u => {
    // 通过 VRouter 实例访问当前参数
    const params = router.getParams();
    u.h1(`用户详情 - ID: ${params.id}`);
  });
}

// 导航到带参数的路由
router.navigate('/user/123');
router.navigate('/post/456/comment/789');
```

### 查询参数

```javascript
// 获取查询参数
const queryParams = router.getQueryParams();
// URL: #/search?q=hello&page=2
// queryParams: { q: 'hello', page: 2 }

// 导航带查询参数
router.navigate('/search?q=hello&page=2');
```

---

## 导航守卫

### 全局前置守卫

```javascript
const router = new VRouter({
  routes: [...],
});

// 注册全局前置守卫
router.beforeEach((to, from) => {
  // to: 目标路由信息
  // from: 源路由信息
  
  // 检查权限
  if (to.path.startsWith('/admin') && !isAdmin()) {
    toast.error('无权限访问');
    return false;  // 阻止导航
  }
  
  // 检查登录
  if (to.path.startsWith('/dashboard') && !isLoggedIn()) {
    router.navigate('/login', { replace: true });
    return false;
  }
  
  // 允许导航
  return true;
});

router.init();
```

### 全局后置钩子

```javascript
// 注册全局后置钩子
router.afterEach((to, from) => {
  // 更新页面标题
  document.title = to.meta?.title || '我的应用';
  
  // 记录访问日志
  console.log(`导航：${from.path} -> ${to.path}`);
});
```

---

## 完整示例

### 后台管理系统

```javascript
import { VRouter, VRouterViews, VLink, toast } from './yoya/components/router.js';
import { flex, vstack } from './yoya/index.js';

// 定义路由组件
function DashboardPage() {
  return div(d => {
    d.h1('📊 仪表盘');
    d.p('欢迎使用后台管理系统');
  });
}

function UsersPage() {
  const params = router.getParams();
  return div(u => {
    u.h1('👥 用户管理');
    if (params.id) {
      u.p(`查看用户 ID: ${params.id}`);
    }
  });
}

function SettingsPage() {
  return div(s => {
    s.h1('⚙️ 系统设置');
    s.p('配置系统参数');
  });
}

// 创建路由器
const router = new VRouter({
  routes: [
    { path: '/', component: DashboardPage, meta: { title: '仪表盘', icon: '📊' } },
    { path: '/users', component: UsersPage, meta: { title: '用户', icon: '👥' } },
    { path: '/users/:id', component: UsersPage, meta: { title: '用户详情', icon: '👤' } },
    { path: '/settings', component: SettingsPage, meta: { title: '设置', icon: '⚙️' } },
  ],
});

// 全局前置守卫
router.beforeEach((to, from) => {
  if (to.path.startsWith('/settings') && !isAdmin()) {
    toast.error('需要管理员权限');
    return false;
  }
  return true;
});

// 全局后置钩子
router.afterEach((to) => {
  document.title = to.meta?.title || '管理系统';
});

router.init();

// 创建多视图容器
const views = VRouterViews(router, v => {
  v.autoAddFromRoutes();
  v.enableStatePersistence();  // 启用状态持久化
});

// 侧边栏导航
const sidebar = vstack(s => {
  s.gap('8px');
  s.styles({ 
    width: '200px', 
    background: '#1a1a2e',
    padding: '20px',
  });
  
  s.child(VLink({ to: '/', text: '📊 仪表盘' }));
  s.child(VLink({ to: '/users', text: '👥 用户' }));
  s.child(VLink({ to: '/settings', text: '⚙️ 设置' }));
});

// 主应用布局
flex(app => {
  app.child(sidebar);
  app.div(main => {
    main.styles({ flex: 1, padding: '20px' });
    main.child(views);
  });
}).bindTo('#app');
```

---

## API 速查

### VRouter

```javascript
new VRouter(options)
- init()                      // 初始化路由器
- navigate(path, options)     // 导航到指定路径
- route(path)                 // 手动路由匹配
- getParams()                 // 获取当前路由参数
- getQueryParams()            // 获取查询参数
- getCurrentRoute()           // 获取当前路由信息
- beforeEach(fn)              // 注册全局前置守卫
- afterEach(fn)               // 注册全局后置钩子
- view()                      // 获取单视图容器 (VRouterView)
```

### VRouterViews

```javascript
VRouterViews(router, setup)
- addView(config)             // 添加视图
- removeView(viewId)          // 移除视图
- setActiveView(viewId)       // 激活视图
- getActiveViewId()           // 获取当前激活的视图 ID
- getViews()                  // 获取所有视图配置
- enableStatePersistence()    // 启用 localStorage 持久化
- autoAddFromRoutes()         // 从 routes 自动添加视图
```

### VLink

```javascript
VLink({ to, text, replace, className, activeClass })
// 或使用 setup 函数
VLink({ to: '/' }, link => {
  link.className('nav-link');
  link.text('首页');
})
```

---

## 注意事项

1. **初始化时机**：必须在 `router.init()` 调用后才能使用路由功能
2. **Hash 模式**：当前仅支持 hash 模式路由（`#/path`）
3. **视图唯一性**：VRouterViews 中 viewId 必须唯一
4. **状态持久化**：启用持久化后，视图状态保存在 localStorage
5. **守卫返回值**：beforeEach 守卫返回 `false` 可阻止导航
6. **参数获取**：使用 `router.getParams()` 获取动态路由参数

## 与其他路由方案的对比

| 特性 | VRouter | Vue Router | React Router |
|------|---------|------------|--------------|
| **零依赖** | ✅ | ❌ (依赖 Vue) | ❌ (依赖 React) |
| **Hash 模式** | ✅ | ✅ | ✅ |
| **History 模式** | ❌ | ✅ | ✅ |
| **多视图支持** | ✅ (VRouterViews) | ❌ | ❌ |
| **状态持久化** | ✅ | ❌ | ❌ |
| **导航守卫** | ✅ | ✅ | ✅ |
