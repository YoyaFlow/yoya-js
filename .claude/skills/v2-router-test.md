# v2-router-test

测试 V2 VRouter 路由演示页面。

## 触发条件

当用户要求测试 VRouter 路由页面、运行路由测试或验证路由功能时触发。

## 执行流程

1. 确保 Vite 开发服务器正在运行（`npm run dev`）
2. 设置 Playwright 浏览器环境变量：`export PLAYWRIGHT_BROWSERS_PATH=/home/join/.cache/ms-playwright`
3. 运行测试命令：`npx playwright test tests/v2-router.test.js --project=chromium`
4. 检查测试结果，报告通过/失败情况
5. 如有失败，分析错误原因并提供修复建议

## 输出格式

- 测试总数和通过数量
- 失败测试的详细错误信息
- 修复建议（如有失败）

## 示例

```bash
# 运行 VRouter 测试
export PLAYWRIGHT_BROWSERS_PATH=/home/join/.cache/ms-playwright
npx playwright test tests/v2-router.test.js --project=chromium
```

## 测试覆盖

- 页面加载验证
- 导航菜单功能
- 路由切换（首页、用户列表、产品列表、设置、关于）
- 动态路由参数（`/router/user/:id`）
- 路由守卫（beforeEnter 确认对话框）
- 404 页面处理
- 浏览器后退/前进导航
- 代码示例区域
- API 文档表格
