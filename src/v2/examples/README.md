# YoyaJS V2 - 项目结构说明

## 目录结构

```
src/v2/examples/
├── index.html                    # 唯一入口 HTML
├── index.js                      # 应用入口（初始化主题、路由）
│
├── framework/                    # 【页面框架层】
│   ├── index.js                  # 框架模块导出
│   ├── AppShell.js               # 应用外壳（三栏布局）
│   ├── TopNavbar.js              # 顶部导航栏
│   ├── Sidebar.js                # 左侧菜单栏组件
│   └── TableOfContents.js        # 右侧目录组件
│
├── config/                       # 【配置层】
│   ├── index.js                  # 配置模块导出
│   ├── menuConfig.js             # 统一菜单定义（所有页面共用）
│   └── routes.js                 # 路由配置
│
├── components/                   # 【公共组件层】
│   ├── index.js                  # 组件模块导出
│   ├── DocSection.js             # 文档章节容器
│   ├── CodeDemo.js               # 代码演示块
│   ├── ApiTable.js               # API 表格
│   └── PageHeader.js             # 页面标题头
│
└── pages/                        # 【页面层】
    ├── Home/                     # 首页
    │   └── index.js
    ├── Button/                   # Button 页面
    │   └── index.js
    ├── Form/                     # Form 页面
    │   └── index.js
    ├── Menu/                     # Menu 页面
    │   └── index.js
    ├── Card/                     # Card 页面
    │   └── index.js
    ├── Message/                  # Message 页面
    │   └── index.js
    ├── Code/                     # Code 页面
    │   └── index.js
    ├── Detail/                   # Detail 页面
    │   └── index.js
    ├── Field/                    # Field 页面
    │   └── index.js
    ├── Body/                     # Body 页面
    │   └── index.js
    └── DynamicLoader/            # DynamicLoader 页面
        └── index.js
```

## 各层职责

### framework/ - 页面框架层

提供标准的演示页面布局：

| 文件 | 说明 |
|------|------|
| `AppShell.js` | 应用主布局（顶部 + 左侧菜单 + 内容 + 右侧目录） |
| `TopNavbar.js` | 顶部导航栏（品牌、主导航、主题切换） |
| `Sidebar.js` | 左侧菜单（使用统一菜单配置） |
| `TableOfContents.js` | 右侧页面目录导航 |

### config/ - 配置层

集中管理应用配置：

| 文件 | 说明 |
|------|------|
| `menuConfig.js` | 统一菜单定义，所有页面共用 |
| `routes.js` | 页面路由映射，支持懒加载 |

### components/ - 公共组件层

可复用的页面组件：

| 文件 | 说明 |
|------|------|
| `DocSection.js` | 文档章节容器（带标题和内容） |
| `CodeDemo.js` | 代码演示块（演示区 + 代码区） |
| `ApiTable.js` | API 属性表格 |
| `PageHeader.js` | 页面标题头（标题 + 描述） |

### pages/ - 页面层

每个页面一个目录，包含：

- `index.js` - 页面入口，导出 `createXxxPage()` 函数
- `components/` - 页面私有子组件（可选）

## 新增页面示例

```javascript
// pages/NewComponent/index.js
import { AppShell } from '../../framework/AppShell.js';
import { CodeDemo } from '../../components/CodeDemo.js';
import { DocSection } from '../../components/DocSection.js';
import { PageHeader } from '../../components/PageHeader.js';

export function createNewComponentPage() {
  const tocItems = [
    { text: '基础用法', href: '#basic', level: 1 },
    { text: 'API', href: '#api', level: 1 },
  ];

  return AppShell({
    currentPage: 'new-component.html',
    tocItems,
    content: (content) => {
      content.child(PageHeader({
        title: 'NewComponent 新组件',
        description: '组件描述信息',
      }));

      content.child(DocSection('basic', '基础用法', [
        CodeDemo('示例标题', demoContent, codeString),
      ]));
    },
  });
}
```

然后在 `config/routes.js` 中添加路由：

```javascript
export const routes = {
  // ...
  'NewComponent': () => import('../pages/NewComponent/index.js')
    .then(m => m.createNewComponentPage),
};

export function getPageComponent(fileName) {
  const pageMap = {
    // ...
    'new-component.html': 'NewComponent',
  };
  // ...
}
```

最后在 `config/menuConfig.js` 中添加菜单项。

## 与 V1 的差异

| 特性 | V1 | V2 |
|------|----|----|
| 文件组织 | HTML + JS 混排 | 标准 pages 目录 |
| 菜单定义 | 每个页面重复定义 | 统一 `menuConfig.js` |
| 布局组件 | `layout.js` 混用 | 分层 `framework/` |
| 公共组件 | 未抽离 | `components/` 统一复用 |
| 入口文件 | 多个 `*-entry.js` | 统一 `index.js` |

## 使用方式

访问：`http://localhost:3000/src/v2/examples/index.html`

（需要先运行 `npm run dev` 启动 Vite 开发服务器）
