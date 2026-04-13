/**
 * V2 演示路由配置
 * 用于 VRouterViews 多视图容器的路由配置
 */

// 演示页面分类配置
export const demoRoutes = [
  // 🏠 开始
  {
    category: '开始',
    icon: '🏠',
    items: [
      {
        name: 'home',
        title: '首页',
        icon: '🏠',
        description: '快速开始和介绍',
        loader: () => import('../pages/Home/index.js').then(m => m.createHomePage),
        route: '/home',
        closable: false,
      },
    ],
  },

  // 🔧 基础组件
  {
    category: '基础组件',
    icon: '🔧',
    items: [
      {
        name: 'button',
        title: 'Button 按钮',
        icon: '🔘',
        description: '基础按钮组件',
        loader: () => import('../pages/Button/index.js').then(m => m.createButtonPage),
        route: '/button',
      },
      {
        name: 'buttons',
        title: 'Buttons 按钮组',
        icon: '🔗',
        description: '按钮组组件',
        loader: () => import('../pages/Buttons/index.js').then(m => m.createButtonsPage),
        route: '/buttons',
      },
      {
        name: 'form',
        title: 'Form 表单',
        icon: '📝',
        description: '表单组件',
        loader: () => import('../pages/Form/index.js').then(m => m.createFormPage),
        route: '/form',
      },
      {
        name: 'icons',
        title: 'Icons 图标',
        icon: '🎨',
        description: '图标库使用',
        loader: () => import('../pages/Icons/index.js').then(m => m.createIconsPage),
        route: '/icons',
      },
    ],
  },

  // 📋 数据展示
  {
    category: '数据展示',
    icon: '📋',
    items: [
      {
        name: 'card',
        title: 'Card 卡片',
        icon: '',
        description: '卡片组件',
        loader: () => import('../pages/Card/index.js').then(m => m.createCardPage),
        route: '/card',
      },
      {
        name: 'table',
        title: 'Table 表格',
        icon: '📊',
        description: '表格组件',
        loader: () => import('../pages/Table/index.js').then(m => m.createTablePage),
        route: '/table',
      },
      {
        name: 'detail',
        title: 'Detail 详情',
        icon: '📄',
        description: '详情展示组件',
        loader: () => import('../pages/Detail/index.js').then(m => m.createDetailPage),
        route: '/detail',
      },
      {
        name: 'field',
        title: 'Field 字段',
        icon: '🏷️',
        description: '字段展示组件',
        loader: () => import('../pages/Field/index.js').then(m => m.createFieldPage),
        route: '/field',
      },
      {
        name: 'statistic',
        title: 'Statistic 统计数值',
        icon: '📈',
        description: '统计数值组件',
        loader: () => import('../pages/Statistic/index.js').then(m => m.createStatisticPage),
        route: '/statistic',
      },
      {
        name: 'code',
        title: 'Code 代码',
        icon: '💻',
        description: '代码展示组件',
        loader: () => import('../pages/Code/index.js').then(m => m.createCodePage),
        route: '/code',
      },
    ],
  },

  // 🧭 导航组件
  {
    category: '导航组件',
    icon: '🧭',
    items: [
      {
        name: 'menu',
        title: 'Menu 菜单',
        icon: '📋',
        description: '菜单组件',
        loader: () => import('../pages/Menu/index.js').then(m => m.createMenuPage),
        route: '/menu',
      },
      {
        name: 'tabs',
        title: 'Tabs 标签页',
        icon: '📑',
        description: '标签页组件',
        loader: () => import('../pages/Tabs/index.js').then(m => m.createTabsPage),
        route: '/tabs',
      },
      {
        name: 'pager',
        title: 'Pager 分页',
        icon: '📄',
        description: '分页组件',
        loader: () => import('../pages/Pager/index.js').then(m => m.createVPagerPage),
        route: '/pager',
      },
      {
        name: 'router',
        title: 'Router 路由',
        icon: '🧭',
        description: '路由组件',
        loader: () => import('../pages/Router/index.js').then(m => m.createRouterPage),
        route: '/router',
      },
    ],
  },

  // 💬 反馈组件
  {
    category: '反馈组件',
    icon: '💬',
    items: [
      {
        name: 'message',
        title: 'Message 消息',
        icon: '💌',
        description: '消息提示组件',
        loader: () => import('../pages/Message/index.js').then(m => m.createMessagePage),
        route: '/message',
      },
      {
        name: 'modal',
        title: 'Modal 弹出框',
        icon: '🪟',
        description: '模态框组件',
        loader: () => import('../pages/Modal/index.js').then(m => m.createModalPage),
        route: '/modal',
      },
    ],
  },

  // 🛠️ 工具
  {
    category: '工具',
    icon: '🛠️',
    items: [
      {
        name: 'dynamic-loader',
        title: 'DynamicLoader 动态加载',
        icon: '⚡',
        description: '动态组件加载',
        loader: () => import('../pages/DynamicLoader/index.js').then(m => m.createDynamicLoaderPage),
        route: '/dynamic-loader',
      },
      {
        name: 'i18n',
        title: 'I18n 国际化',
        icon: '🌐',
        description: '国际化支持',
        loader: () => import('../pages/I18n/index.js').then(m => m.createI18nPage),
        route: '/i18n',
      },
      {
        name: 'theme',
        title: 'Theme 主题系统',
        icon: '🎨',
        description: '主题切换系统',
        loader: () => import('../pages/Theme/index.js').then(m => m.createThemePage),
        route: '/theme',
      },
    ],
  },

  // 📊 图表和高级组件
  {
    category: '图表和高级',
    icon: '📊',
    items: [
      {
        name: 'echart',
        title: 'Echart 图表',
        icon: '📉',
        description: 'ECharts 图表组件',
        loader: () => import('../pages/Echart/index.js').then(m => m.createEchartPage),
        route: '/echart',
      },
      {
        name: 'dashboard',
        title: 'Dashboard 大屏看板',
        icon: '🖥️',
        description: '大屏看板组件',
        loader: () => import('../pages/Dashboard/index.js').then(m => m.createDashboardPage),
        route: '/dashboard',
      },
      {
        name: 'vtree',
        title: 'VTree 树形控件',
        icon: '🌳',
        description: '树形控件组件',
        loader: () => import('../pages/VTree/index.js').then(m => m.createVTreePage),
        route: '/vtree',
      },
    ],
  },

  // 📐 布局组件
  {
    category: '布局组件',
    icon: '📐',
    items: [
      {
        name: 'body',
        title: 'Body 容器',
        icon: '📦',
        description: '页面容器组件',
        loader: () => import('../pages/Body/index.js').then(m => m.createBodyPage),
        route: '/body',
      },
      {
        name: 'ui-components',
        title: 'UI Components 综合',
        icon: '🧩',
        description: 'UI 组件综合演示',
        loader: () => import('../pages/UIComponents/index.js').then(m => m.createUIComponentsPage),
        route: '/ui-components',
      },
      {
        name: 'interaction',
        title: 'Interaction 交互',
        icon: '🎯',
        description: '交互组件演示',
        loader: () => import('../pages/Interaction/index.js').then(m => m.createInteractionPage),
        route: '/interaction',
      },
      {
        name: 'vtimer',
        title: 'VTimer 日期选择器',
        icon: '📅',
        description: '日期时间选择器',
        loader: () => import('../pages/VTimer/index.js').then(m => m.createVTimerPage),
        route: '/vtimer',
      },
    ],
  },
];

/**
 * 获取所有演示路由（扁平化数组）
 */
export function getAllDemoRoutes() {
  return demoRoutes.flatMap(category => category.items);
}

/**
 * 获取路由配置用于 VRouter
 */
export function getV2RouterConfig() {
  const routes = {};

  demoRoutes.forEach(category => {
    category.items.forEach(item => {
      routes[item.name] = {
        name: item.name,
        title: item.title,
        icon: item.icon,
        description: item.description,
        loader: item.loader,
        route: item.route,
        closable: item.closable !== false, // 默认 true，除非明确设置为 false
      };
    });
  });

  return routes;
}

/**
 * 根据名称获取演示配置
 */
export function getDemoByName(name) {
  for (const category of demoRoutes) {
    const item = category.items.find(i => i.name === name);
    if (item) return item;
  }
  return null;
}
