# Yoya.Basic 示例文档

本目录包含 Yoya.Basic 库的所有示例代码，分为独立 HTML 示例和组件演示页面。

## 📁 目录结构

```
src/examples/
├── yoya.example.html           # 入口导航页面（所有示例的索引）
├── yoya.router.example.html    # VRouter 路由组件完整演示
├── yoya.router.simple.html     # VRouter 简单测试页面
├── yoya.basic.example.*        # 基础元素完整演示
├── yoya.components.example.*   # UI 组件集合演示
├── yoya.layout.example.*       # 布局组件演示
├── yoya.svg.example.*          # SVG 图形绘制演示
├── yoya.form.example.*         # 表单组件演示（待创建）
└── ...                         # 各组件独立演示
```

## 🚀 快速开始

1. 启动开发服务器：
```bash
npm run dev
```

2. 访问入口页面：http://localhost:3000/examples/yoya.example.html

3. 从导航页面选择要查看的示例

## 📖 示例分类

### 核心功能示例

| 示例文件 | 描述 | 访问路径 |
|---------|------|---------|
| [yoga.example.html](./yoya.example.html) | 入口导航页面，包含所有示例的链接 | `/examples/yoya.example.html` |
| [yoya.basic.example.html](./yoya.basic.example.html) | 基础元素完整演示（40+ 元素） | `/examples/yoya.basic.example.html` |
| [yoya.components.example.html](./yoya.components.example.html) | UI 组件集合演示（Card、Menu、Message 等） | `/examples/yoya.components.example.html` |
| [yoya.layout.example.html](./yoya.layout.example.html) | 布局组件演示（Flex、Grid、Stack 等） | `/examples/yoya.layout.example.html` |
| [yoya.svg.example.html](./yoya.svg.example.html) | SVG 图形绘制演示 | `/examples/yoya.svg.example.html` |

### 组件独立演示

| 示例文件 | 描述 | 访问路径 |
|---------|------|---------|
| [yoya.card.example.html](./yoya.card.example.html) | Card 卡片组件演示 | `/examples/yoya.card.example.html` |
| [yoya.menu.example.html](./yoya.menu.example.html) | Menu 菜单组件演示 | `/examples/yoya.menu.example.html` |
| [yoya.message.example.html](./yoya.message.example.html) | Message 消息组件演示 | `/examples/yoya.message.example.html` |
| [yoya.checkboxes.example.html](./yoya.checkboxes.example.html) | VCheckboxes 复选框组演示 | `/examples/yoya.checkboxes.example.html` |
| [yoya.timer.example.html](./yoya.timer.example.html) | VTimer/VTimer2 日期选择器演示 | `/examples/yoya.timer.example.html` |
| [yoya.code.example.html](./yoya.code.example.html) | VCode 代码展示组件演示 | `/examples/yoya.code.example.html` |
| [yoya.echart.example.html](./yoya.echart.example.html) | VEchart 图表组件演示 | `/examples/yoya.echart.example.html` |
| [yoya.theme.example.html](./yoya.theme.example.html) | 主题和状态机演示 | `/examples/yoya.theme.example.html` |

### 路由组件示例

| 示例文件 | 描述 | 访问路径 |
|---------|------|---------|
| [yoya.router.example.html](./yoya.router.example.html) | VRouter 路由组件完整演示 | `/examples/yoya.router.example.html` |
| [yoya.router.simple.html](./yoya.router.simple.html) | VRouter 简单测试页面 | `/examples/yoya.router.simple.html` |

### 测试页面

| 示例文件 | 描述 |
|---------|------|
| [islands-theme-test.html](./islands-theme-test.html) | 主题岛暗色/亮色模式测试 |
| [test-field-hover.html](./test-field-hover.html) | VField 组件 hover 测试 |
| [test-field-save.html](./test-field-save.html) | VField 组件保存功能测试 |
| [yoya.state.test.html](./yoya.state.test.html) | 状态机简单测试 |
| [yoya.echart.test.html](./yoya.echart.test.html) | ECharts 组件测试 |
| [yoya.router.vlink-test.html](./yoya.router.vlink-test.html) | VLink 组件测试 |

## 💡 使用方式

### 1. 直接访问 HTML 示例

所有 `.html` 文件都可以在开发服务器上直接访问：

```
http://localhost:3000/examples/yoya.basic.example.html
```

### 2. 参考 JS 源码学习

每个示例都有对应的 `.js` 文件，包含完整的实现代码：

```javascript
// 例如：yoya.basic.example.js
import { div, button, flex, toast } from '../yoya/index.js';

// ... 组件实现代码
```

### 3. 在项目中复用

复制示例代码中的组件实现，根据你的需求修改：

```javascript
// 复制 vCard 组件的使用方式
import { vCard, cardHeader, cardBody, cardFooter } from '../yoya/index.js';

vCard(c => {
  c.cardHeader('你的标题');
  c.cardBody('你的内容');
  c.cardFooter(btn => {
    btn.button('操作').onclick(() => toast.success('操作成功'));
  });
}).bindTo('#app');
```

## 📚 相关文档

- [技能文档](../../skills/README.md) - 详细的使用指南
- [JSDoc 文档](../../docs/index.html) - API 参考文档
- [设计文档](../../DESIGN.md) - 架构设计说明

## 🆘 获取帮助

遇到问题？
1. 查看 [CLAUDE.md](../../CLAUDE.md) 了解项目规范
2. 查看 [skills/](../../skills/) 目录的使用教程
3. 在 [issues](https://github.com/your-repo/yoya.basic/issues) 中提问
