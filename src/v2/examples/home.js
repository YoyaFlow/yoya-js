/**
 * V2 VRouterViews 演示入口
 * 使用 VRouterViews 实现多视图容器路由
 *
 * 布局结构：
 * - AppShell 提供：TopNavbar（顶部）+ Sidebar（左侧）+ Content（内容区）
 * - Content 区域内使用 VRouterViews 管理多个可切换的视图
 * - 每个页面有自己的 TOC（固定在内容区右上角）
 */

import { vRouter, vRouterViews, div, flex, container } from '../../yoya/index.js';
import { demoRoutes } from './config/routes.v2.js';
import { AppShell, updateToc, setScrollContainer } from './framework/AppShell.js';

// 引入 ECharts 并暴露到全局，供 VEchart 组件使用
import * as echarts from 'echarts';
window.echarts = echarts;

// 初始化主题系统（从 localStorage 恢复主题偏好）
import { initTheme } from '../../yoya/index.js';

// 页面加载时从 localStorage 恢复主题
initTheme({
  defaultTheme: 'islands',
  defaultMode: 'auto',
});

// 页面组件加载器缓存
const pageLoaders = {};

// 全局 router 实例，供 Sidebar 使用
let routerInstance = null;
// 全局 VRouterViews 实例，供动态添加视图使用
let routerViewsInstance = null;
// 已添加的视图名称集合
const addedViews = new Set();
// 全局 TOC 更新函数
let updateTocFn = null;

/**
 * 页面 TOC 配置
 */
const pageTocConfigs = {
  home: [
    { text: 'setup 三种方式', href: '#setup', level: 1 },
    { text: '核心特性', href: '#features', level: 1 },
    { text: '快速上手', href: '#quickstart', level: 1 },
  ],
  button: [
    { text: 'setup 三种方式', href: '#setup', level: 1 },
    { text: '基础用法', href: '#basic', level: 1 },
    { text: '按钮尺寸', href: '#size', level: 1 },
    { text: '按钮状态', href: '#state', level: 1 },
    { text: 'API', href: '#api', level: 1 },
  ],
  buttons: [
    { text: '配置化用法', href: '#config', level: 1 },
    { text: '统一 onClick', href: '#onclick', level: 1 },
    { text: '链式用法', href: '#chain', level: 1 },
    { text: '布局方式', href: '#layout', level: 1 },
    { text: '紧凑模式', href: '#compact', level: 1 },
    { text: '按钮尺寸', href: '#size', level: 1 },
    { text: 'API', href: '#api', level: 1 },
  ],
  card: [
    { text: '基础用法', href: '#basic', level: 1 },
    { text: '卡片结构', href: '#structure', level: 1 },
    { text: '卡片组合', href: '#composite', level: 1 },
    { text: 'API', href: '#api', level: 1 },
  ],
  form: [
    { text: 'setup 三种方式', href: '#setup', level: 1 },
    { text: '输入框', href: '#input', level: 1 },
    { text: '文本域', href: '#textarea', level: 1 },
    { text: '选择框', href: '#select', level: 1 },
    { text: '复选框和单选', href: '#checkbox-radio', level: 1 },
  ],
  menu: [
    { text: 'setup 三种方式', href: '#setup', level: 1 },
    { text: '基础菜单', href: '#basic', level: 1 },
    { text: '分割线', href: '#divider', level: 1 },
    { text: '菜单分组', href: '#group', level: 1 },
    { text: '子菜单', href: '#submenu', level: 1 },
    { text: '项状态', href: '#state', level: 1 },
    { text: '下拉菜单', href: '#dropdown', level: 1 },
    { text: '侧边栏菜单', href: '#sidebar', level: 1 },
    { text: 'API', href: '#api', level: 1 },
  ],
  // 数据展示
  table: [
    { text: '基础用法', href: '#basic', level: 1 },
    { text: '完整功能', href: '#full', level: 1 },
    { text: '紧凑模式', href: '#compact', level: 1 },
    { text: '可排序', href: '#sortable', level: 1 },
    { text: '代码示例', href: '#examples', level: 1 },
    { text: 'API', href: '#api', level: 1 },
  ],
  detail: [
    { text: '基础用法', href: '#basic', level: 1 },
    { text: '纵向布局', href: '#vertical', level: 1 },
    { text: '自定义列数', href: '#columns', level: 1 },
    { text: 'API', href: '#api', level: 1 },
  ],
  field: [
    { text: '基础用法', href: '#basic', level: 1 },
    { text: '对象配置', href: '#object', level: 1 },
    { text: '配合 Detail 使用', href: '#detail', level: 1 },
    { text: '只读模式', href: '#readonly', level: 1 },
    { text: '自动保存', href: '#autoSave', level: 1 },
  ],
  statistic: [
    { text: '基础用法', href: '#basic', level: 1 },
    { text: '格式化数字', href: '#format', level: 1 },
    { text: '前缀和后缀', href: '#prefix-suffix', level: 1 },
    { text: '数值动画', href: '#animation', level: 1 },
    { text: '数据看板', href: '#dashboard', level: 1 },
    { text: 'API 参考', href: '#api', level: 1 },
  ],
  code: [
    { text: '基础用法', href: '#basic', level: 1 },
    { text: '带标题栏', href: '#with-header', level: 1 },
    { text: '不显示行号', href: '#no-line-numbers', level: 1 },
    { text: 'API', href: '#api', level: 1 },
  ],
  // 导航组件
  tabs: [
    { text: '基础用法', href: '#basic', level: 1 },
    { text: '带图标的标签页', href: '#icon', level: 1 },
    { text: '不可关闭的标签页', href: '#closable', level: 1 },
    { text: '动态添加删除', href: '#dynamic', level: 1 },
    { text: 'API', href: '#api', level: 1 },
  ],
  pager: [
    { text: '基础分页', href: '#basic', level: 1 },
    { text: '显示总数', href: '#with-total', level: 1 },
    { text: '快速跳转', href: '#with-jumper', level: 1 },
    { text: '简洁模式', href: '#simple', level: 1 },
    { text: '禁用状态', href: '#disabled', level: 1 },
    { text: '主题适配', href: '#theme', level: 1 },
    { text: '应用场景', href: '#scenarios', level: 1 },
    { text: '代码示例', href: '#pager-usage', level: 1 },
  ],
  // 反馈组件
  message: [
    { text: '基础用法', href: '#basic', level: 1 },
    { text: '不同状态', href: '#states', level: 1 },
    { text: '自定义时长', href: '#duration', level: 1 },
    { text: '清空消息', href: '#clear', level: 1 },
    { text: 'API', href: '#api', level: 1 },
  ],
  modal: [
    { text: '基础用法', href: '#basic', level: 1 },
    { text: '带标题弹出框', href: '#with-title', level: 1 },
    { text: '确认框', href: '#confirm', level: 1 },
    { text: '自定义内容', href: '#custom', level: 1 },
    { text: '不可关闭模式', href: '#unclosable', level: 1 },
    { text: '自定义尺寸', href: '#size', level: 1 },
    { text: 'API', href: '#api', level: 1 },
  ],
  // 工具
  i18n: [
    { text: '演示界面', href: '#demo', level: 1 },
    { text: '使用方法', href: '#i18n-usage', level: 1 },
    { text: '语言包结构', href: '#structure', level: 1 },
  ],
  theme: [
    { text: '主题切换', href: '#theme-switch', level: 1 },
    { text: '状态机', href: '#state', level: 1 },
    { text: 'API', href: '#api', level: 1 },
  ],
  // 图表和高级
  echart: [
    { text: '基础用法', href: '#basic', level: 1 },
    { text: '图表类型', href: '#types', level: 1 },
    { text: '代码示例', href: '#examples', level: 1 },
    { text: 'API', href: '#api', level: 1 },
  ],
  dashboard: [
    { text: '数字滚动动画', href: '#number-scroll', level: 1 },
    { text: '趋势指示器', href: '#trend', level: 1 },
    { text: '仪表盘', href: '#gauge', level: 1 },
    { text: '环形进度条', href: '#circular-progress', level: 1 },
    { text: '指标卡', href: '#indicator', level: 1 },
    { text: '时间序列', href: '#time-series', level: 1 },
    { text: '排行榜', href: '#rank-list', level: 1 },
    { text: '看板栅格', href: '#dashboard-grid', level: 1 },
    { text: '综合示例', href: '#dashboard-demo', level: 1 },
    { text: 'API 参考', href: '#api', level: 1 },
  ],
  vtree: [
    { text: '基础用法', href: '#basic', level: 1 },
    { text: ' checkboxes 模式', href: '#checkboxes', level: 1 },
    { text: '虚拟滚动', href: '#virtual-scroll', level: 1 },
    { text: '动态加载', href: '#dynamic-load', level: 1 },
    { text: 'API', href: '#api', level: 1 },
  ],
  // 布局组件
  body: [
    { text: '基础用法', href: '#basic', level: 1 },
    { text: '全屏模式', href: '#fullscreen', level: 1 },
    { text: '自定义样式', href: '#custom', level: 1 },
  ],
  'ui-components': [
    { text: 'VAvatar 头像', href: '#avatar', level: 1 },
    { text: 'VBadge 徽标', href: '#badge', level: 1 },
    { text: 'VProgress 进度条', href: '#progress', level: 1 },
    { text: 'VSkeleton 骨架屏', href: '#skeleton', level: 1 },
    { text: 'VTag 标签', href: '#tag', level: 1 },
    { text: 'VAlert 警告提示', href: '#alert', level: 1 },
    { text: 'VBreadcrumb 面包屑', href: '#breadcrumb', level: 1 },
  ],
  interaction: [
    { text: 'VTooltip 文字提示', href: '#tooltip', level: 1 },
    { text: 'VPopover 弹出气泡', href: '#popover', level: 1 },
    { text: 'VDropdown 下拉菜单', href: '#dropdown', level: 1 },
    { text: 'VCollapse 折叠面板', href: '#collapse', level: 1 },
    { text: 'VTree 树形控件', href: '#tree', level: 1 },
    { text: 'VTreeSelect 树形选择', href: '#treeselect', level: 1 },
    { text: 'API 参考', href: '#api', level: 1 },
  ],
  vtimer: [
    { text: '基础选择器', href: '#basic', level: 1 },
    { text: '日期时间', href: '#datetime', level: 1 },
    { text: '范围选择器', href: '#range', level: 1 },
    { text: '验证状态', href: '#validation', level: 1 },
    { text: '应用场景', href: '#scenarios', level: 1 },
    { text: '代码示例', href: '#vtimer-usage', level: 1 },
  ],
};

/**
 * 从 AppShell 包装的页面中提取纯内容
 * @param {Function} pageCreator - 页面创建函数（返回 AppShell）
 * @returns {div} 内容容器
 */
function extractContentFromAppShell(pageCreator) {
  const contentContainer = div(c => {
    c.styles({
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
    });
  });

  // 创建页面（返回 AppShell/vBody）
  const page = pageCreator();

  if (page && page._children) {
    // vBody 的第一个子元素是 TopNavbar，第二个是 flex 容器
    const flexContainer = page._children[1];
    if (flexContainer && flexContainer._children) {
      // flex 容器：[0]Sidebar, [1]Content
      const contentWrapper = flexContainer._children[1];
      if (contentWrapper) {
        // 复制内容容器的子元素
        if (contentWrapper._children) {
          contentWrapper._children.forEach(child => {
            contentContainer.child(child);
          });
        }
      }
    }
  }

  return contentContainer;
}

function createVRouterViewsContent() {
  // 创建主容器 - 使用 height: 100% 填充父容器
  const container = div(c => {
    c.styles({ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden' });
  });

  // 先创建 vRouter 实例（不绑定到 DOM）
  const router = vRouter(r => {
    routerInstance = r; // 保存 router 实例供 Sidebar 使用
    r.default('/home');

    // 根据 demoRoutes 注册路由
    demoRoutes.forEach(category => {
      category.items.forEach(item => {
        const routePath = item.route;
        r.route(routePath, {
          component: () => {
            // 返回一个容器，异步加载页面组件
            const compContainer = div(d => {
              d.styles({ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto' });
              d.text(`加载中...`);
            });

            // 缓存 loader，避免重复加载
            if (!pageLoaders[item.name]) {
              pageLoaders[item.name] = item.loader();
            }

            // 异步加载组件
            pageLoaders[item.name].then(createFn => {
              if (typeof createFn === 'function') {
                // 使用 extractContentFromAppShell 提取纯内容
                const content = extractContentFromAppShell(createFn);
                if (content && compContainer) {
                  // 清空容器并添加新组件
                  // 先标记所有子元素为删除
                  compContainer._children.forEach(child => {
                    if (child && typeof child.destroy === 'function') {
                      child.destroy();
                    }
                  });
                  // 然后添加新组件
                  compContainer._children = [];
                  compContainer.child(content);

                  // 如果已经渲染到 DOM，需要同步更新
                  if (compContainer._boundElement) {
                    compContainer._boundElement.innerHTML = '';
                    compContainer._boundElement.appendChild(content.renderDom());
                  }
                }
              }
            }).catch(err => {
              console.error(`加载页面失败 [${item.name}]:`, err);
              if (compContainer) {
                // 使用组件方法显示错误
                compContainer.html(`<div style="color: red; padding: 20px;">加载失败：${item.name}</div>`);
              }
            });

            return compContainer;
          }
        });
      });
    });
  });

  // 创建 VRouterViews 实例并添加到容器
  const routerViews = vRouterViews(router, views => {
    // 设置最大视图数量为 12
    views.setMaxViews(12);

    // 仅添加首页视图，其他视图在点击菜单时动态添加
    const homeItem = demoRoutes[0]?.items[0];
    if (homeItem) {
      views.addView(homeItem.name, {
        title: homeItem.title,
        icon: homeItem.icon,
        closable: homeItem.closable !== false,
        defaultRoute: homeItem.route,
      });
      addedViews.add(homeItem.name);
    }

    views.onChange((viewName) => {
      // 更新 TOC
      const tocItems = pageTocConfigs[viewName.toLowerCase()] || [];
      if (tocItems.length > 0) {
        updateToc(tocItems);
      }
      // 更新滚动容器引用
      updateScrollContainer();
    });
  });

  // 保存 VRouterViews 实例供外部使用
  routerViewsInstance = routerViews;

  // 设置 routerViews 容器样式，让它填充父容器
  routerViews.styles({ flex: 1, minHeight: 0 });

  // 设置滚动容器元素（用于 TOC 滚动监听）
  // 在视图切换时更新滚动容器引用
  const updateScrollContainer = () => {
    if (!routerViewsInstance) return;
    const activeView = routerViewsInstance._activeView;
    const container = activeView?._contentDiv?._el || null;
    setScrollContainer(container);
    // TOC 已在全局 updateToc 调用时更新
  };

  // 初始设置滚动容器
  updateScrollContainer();

  container.child(routerViews);

  // 导航到首页
  setTimeout(() => {
    router.navigate('/home');
  }, 0);

  return container;
}

/**
 * 根据路由路径动态添加视图
 * @param {string} routePath - 路由路径（如 '/button'）
 */
export function addViewByRoutePath(routePath) {
  if (!routerViewsInstance) {
    return;
  }

  // Router 路由有自己的路由器实例，不适合作为 VRouterViews 的一个视图
  // 在新窗口中打开
  if (routePath === '/router') {
    window.open('/v2/examples/router.html', '_blank');
    return;
  }

  // 查找对应的路由配置
  for (const category of demoRoutes) {
    for (const item of category.items) {
      if (item.route === routePath) {
        // 如果视图已存在，直接切换
        if (addedViews.has(item.name)) {
          routerViewsInstance.setActiveView(item.name);
          return;
        }

        // 添加新视图
        routerViewsInstance.addView(item.name, {
          title: item.title,
          icon: item.icon,
          closable: item.closable !== false,
          defaultRoute: item.route,
        });
        addedViews.add(item.name);

        // 切换到新添加的视图
        routerViewsInstance.setActiveView(item.name);
        return;
      }
    }
  }
}

// 先创建 VRouterViews 内容（会设置 routerInstance）
const vRouterViewsContent = createVRouterViewsContent();

// 首页 TOC 项
const homeTocItems = [
  { text: 'setup 三种方式', href: '#setup', level: 1 },
  { text: '核心特性', href: '#features', level: 1 },
  { text: '快速上手', href: '#quickstart', level: 1 },
];

// 使用 AppShell 布局，内容区使用 VRouterViews
const app = AppShell({
  currentPage: 'home.html',
  tocItems: homeTocItems, // 首页 TOC
  useVRouterViews: true, // 启用 VRouterViews 模式
  vRouterInstance: routerInstance, // 传递 router 实例给 Sidebar
  onNavigate: (routePath) => {
    // VRouterViews 模式下的导航回调
    addViewByRoutePath(routePath);
  },
  content: (content) => {
    // 设置容器样式，让它填充父容器
    vRouterViewsContent.styles({ flex: 1, minHeight: 0 });
    content.child(vRouterViewsContent);
  },
});

app.bindTo('#app');
