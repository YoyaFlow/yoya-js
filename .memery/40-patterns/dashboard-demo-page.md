---
name: dashboard-demo-page
description: V2 Dashboard 大屏看板演示页面的实现
type: project
---

# Dashboard 演示页面

## 创建时间
2026-03-31

## 文件位置
- `src/v2/examples/dashboard.html` - 演示页面入口
- `src/v2/examples/pages/Dashboard/index.js` - 页面组件
- `tests/browser/dashboard.test.js` - 浏览器测试

## 配置更新
- `src/v2/examples/config/routes.js` - 添加 Dashboard 路由
- `src/v2/examples/config/menuConfig.js` - 添加菜单项

## 演示的组件
演示页面包含以下 Dashboard 组件的使用示例：

1. **vNumberScroll** - 数字滚动动画组件
   - 基础数字滚动
   - 带前缀和后缀
   - 触发动画演示

2. **vTrend** - 趋势指示器
   - 基础趋势（上升/下降/持平）
   - 趋势样式自定义

3. **vGauge** - 仪表盘组件
   - 半圆仪表盘
   - 全圆仪表盘

4. **vCircularProgress** - 环形进度条
   - 基础环形进度
   - 自定义样式（粗细、单位）

5. **vIndicator** - 指标卡组件
   - 基础指标卡
   - 指标卡组合（2x2 网格）

6. **vTimeSeries** - 时间序列卡片
   - 基础时间序列
   - 实时数据更新演示

7. **vRankList** - 排行榜组件
   - 基础排行榜
   - 自定义排行榜

8. **vDashboardGrid** - 看板栅格布局
   - 12 列栅格布局演示

9. **综合示例** - 销售数据看板
   - 第一行：4 个指标卡
   - 第二行：数字滚动 + 环形进度 + 排行榜

## 测试状态
所有 20 个 dashboard 相关测试通过：
- dashboard.test.js - 1 个测试
- dashboard-decoration.test.js - 10 个测试
- dashboard-decoration-usage.test.js - 9 个测试

## 页面特点
- 遵循 V2 演示页面的标准结构
- 使用 CodeDemo 组件展示代码示例
- 使用 DocSection 组织内容章节
- 使用 PageHeader 显示页面标题
- 使用 ApiTable 展示 API 参考
- 支持目录导航（TOC）
