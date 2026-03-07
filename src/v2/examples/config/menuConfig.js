/**
 * 统一菜单配置
 * 所有页面共用此菜单定义
 */

export const menuConfig = [
  {
    group: '开始',
    items: [
      { label: '介绍', page: 'Home', file: 'index.html' },
    ],
  },
  {
    group: '基础组件',
    items: [
      { label: 'Button 按钮', page: 'Button', file: 'button.html' },
      { label: 'Form 表单', page: 'Form', file: 'form.html' },
      { label: 'Card 卡片', page: 'Card', file: 'card.html' },
    ],
  },
  {
    group: '导航组件',
    items: [
      { label: 'Menu 菜单', page: 'Menu', file: 'menu.html' },
    ],
  },
  {
    group: '反馈组件',
    items: [
      { label: 'Message 消息', page: 'Message', file: 'message.html' },
      { label: 'Code 代码', page: 'Code', file: 'code.html' },
    ],
  },
  {
    group: '数据展示',
    items: [
      { label: 'Detail 详情', page: 'Detail', file: 'detail.html' },
      { label: 'Field 字段', page: 'Field', file: 'field.html' },
      { label: 'Table 表格', page: 'Table', file: 'table.html' },
    ],
  },
  {
    group: '布局组件',
    items: [
      { label: 'Body 容器', page: 'Body', file: 'body.html' },
    ],
  },
  {
    group: '工具',
    items: [
      { label: '动态加载', page: 'DynamicLoader', file: 'dynamic-loader.html' },
    ],
  },
];

/**
 * 根据当前页面获取激活状态
 */
export function getMenuItemState(currentFile, page) {
  const menuItems = menuConfig.flatMap(g => g.items);
  const item = menuItems.find(i => i.page === page);
  return item?.file === currentFile;
}

/**
 * 获取当前页面所在的分组
 */
export function getCurrentGroup(currentFile) {
  for (const group of menuConfig) {
    const found = group.items.some(item => item.file === currentFile);
    if (found) return group;
  }
  return null;
}

/**
 * 获取所有菜单项
 */
export function getAllMenuItems() {
  return menuConfig.flatMap(g => g.items);
}

/**
 * 根据页面名称获取文件
 */
export function getFileByPage(page) {
  const item = menuConfig.flatMap(g => g.items).find(i => i.page === page);
  return item?.file || null;
}
