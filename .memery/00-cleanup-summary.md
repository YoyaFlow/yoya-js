# 测试文件和图片清理总结

**清理日期**: 2026-04-08  
**清理目标**: 清理项目中无用的测试文件和调试截图

---

## 执行的操作

### 1. 删除根目录临时截图（44 个文件）

删除的 PNG 文件：
- button-*.png (3 个)
- dropdown-*.png (2 个)
- icons-*.png (5 个)
- layout-*.png (10 个)
- toc-*.png (12 个)
- tabs-*.png (4 个)
- test-*.png (3 个)
- 其他调试截图 (5 个)

**保留文件**:
- VTree 逻辑结构.drawio.png（已在之前删除，非 git 跟踪文件）

### 2. 清理 .playwright-mcp/ 目录（57 个文件）

删除内容：
- page-*.png 截图 (约 50 个)
- console-*.log 日志 (约 7 个)

### 3. 删除临时测试文件（15 个文件）

**src/examples/ 目录**:
- `yoga.box.simple.test.html`
- `yoga.box.test.html`
- `yoga.button.hover.test.html`
- `yoga.components.theme.test.html`
- `yoga.echart.test.html`
- `yoga.icons.test.html`
- `yoga.modal.test.html`
- `yoga.modal.test.js`
- `yoga.state.test.html`
- `yoga.switchers.simple.test.html`
- `yoga.switchers.test.html`
- `yoga.theme.button.test.html`
- `yoga.theme.test.html`
- `yoga.vbuttons.test.html`
- `test-field-hover.html`
- `test-field-save.html`
- `islands-theme-test.html`

**src/yoya/examples/ 目录**:
- `test-vertical.html`

### 4. 删除空报告目录（2 个目录）

- `test-results/`
- `playwright-report/`

### 5. 更新 .gitignore

添加以下规则：
```
# 临时截图和测试文件
*.png
.playwright-mcp/
src/examples/*.test.html
src/examples/*.test.js
```

---

## 清理统计

| 类别 | 删除数量 |
|------|---------|
| 根目录 PNG 截图 | 44 |
| .playwright-mcp/ 文件 | ~57 |
| 临时测试 HTML/JS | 17 |
| 空目录 | 2 |
| **总计** | **~120 个文件** |

---

## 预计收益

| 收益 | 说明 |
|------|------|
| 减少仓库体积 | ~15-20MB |
| 减少 git 变更文件数 | 151 个文件 |
| 提升文件检索效率 | 减少无关文件干扰 |
| 防止误提交 | .gitignore 已更新 |

---

## 保留的测试相关资源

以下测试相关文件已保留：

| 文件/目录 | 用途 |
|-----------|------|
| `tests/` | 正式测试目录 |
| `tests/*.test.js` | 正式测试文件 |
| `tests/screenshots/*.png` | 测试报告配图 |
| `test-tree-check.cjs` | 测试脚本 |
| `playwright.config.js` | Playwright 配置 |

---

## 后续建议

1. **开发测试截图**：使用临时目录存储，如 `tmp/` 或 `tmp-screenshots/`
2. **Playwright 调试**：截图保存到 `.gitignore` 的临时目录
3. **定期清理**：每隔一段时间运行类似清理

---

## Git 提交

本次清理共变更 151 个文件，建议提交消息：

```
chore: 清理临时测试文件和调试截图

- 删除根目录临时 PNG 截图 (44 个)
- 清理 .playwright-mcp/ 目录 (57 个文件)
- 删除临时测试 HTML/JS 文件 (17 个)
- 删除空报告目录 test-results/ 和 playwright-report/
- 更新 .gitignore 添加临时文件规则
```
