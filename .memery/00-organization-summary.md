# 记忆文件整理总结

**整理日期**: 2026-04-08  
**整理目标**: 将散落的项目开发规范、记忆文件分门别类，建立清晰的文档结构

---

## 整理前状态

### 问题

1. **散落文件**：`.memery/` 根目录有 9 个未分类的 `.md` 文件
2. **docs/ 目录混乱**：架构文档与 JSDoc 生成的 HTML 文件混在一起
3. **索引不完整**：`.memery/00-index.md` 未包含所有记忆文件
4. **重复文件**：事件系统重构设计文档在两个目录中存在

### 文件分布

| 位置 | 散落文件数 |
|------|----------|
| `.memery/` 根目录 | 9 |
| `docs/` | 4+ 架构文档 |
| `docs/superpowers/` | 7 个设计文档 |

---

## 整理操作

### 1. 移动散落文件到 `.memery/`

**移动到 10-fixes/**:
- `dark-mode-field-fix.md` → `10-fixes/2026-03-18-dark-mode-field-fix.md`

**移动到 20-architecture/**:
- `theme-system-analysis.md`
- `theme-system-fix.md`
- `vtree-redesign.md`
- `vtree-implementation-plan.md`
- `event-system/design.md` → `event-system-redesign.md`
- `event-system/plan.md` → `event-system-plan.md`

**移动到 30-components/**:
- `icons.md`
- `vbox-component.md`
- `switchers-component.md`

**移动到 40-patterns/**:
- `jetbrains-islands-theme-update.md`

### 2. 整合 docs/ 架构文档

**移动到 `.memery/20-architecture/`**:
- `architecture-analysis.md`
- `state-machine-architecture.md`
- `component-virtual-dom-architecture.md`
- `element-lifecycle-analysis.md`
- `complex-component-design-principles.md`
- `vtree-demo.md`
- `vtree-refactor-summary.md`
- `superpowers/specs/*.md` (7 个文件)
- `superpowers/plans/*.md` (6 个文件)

**删除空目录**:
- `docs/superpowers/specs/`
- `docs/superpowers/plans/`
- `docs/superpowers/`
- `.memery/event-system/`

### 3. 清理重复文件

**删除重复**:
- `40-patterns/event-system-redesign.md` (与 `20-architecture/2026-03-23-event-system-redesign.md` 重复)

### 4. 更新索引

**更新 `.memery/00-index.md`**:
- 添加所有修复记录链接
- 添加所有架构文档链接（按主题分组）
- 添加所有组件规范链接
- 添加所有开发模式链接
- 添加技能文档索引

**更新 `docs/README.md`**:
- 添加文档导航结构
- 链接到核心文档位置
- 说明文档分类规则

---

## 整理后结构

### .memery/ 目录

```
.memery/
├── 00-index.md                     # 总索引
├── 10-fixes/                       # 5 个修复记录
│   ├── 2026-03-04-vselect-vform-fix.md
│   ├── 2026-03-06-button-hover-state.md
│   ├── 2026-03-06-toast-api-refactor.md
│   ├── 2026-03-06-toast-setPosition.md
│   └── 2026-03-18-dark-mode-field-fix.md
├── 20-architecture/                # 23 个架构文档
│   ├── 核心架构 (4 个)
│   ├── 主题系统 (5 个)
│   ├── VTree 组件 (6 个)
│   ├── 事件系统 (4 个)
│   ├── 组件开发 (3 个)
│   └── V2 架构 (3 个)
├── 30-components/                  # 7 个组件规范
│   ├── form-components.md
│   ├── grid-components.md
│   ├── icons.md
│   ├── layout-components.md
│   ├── switchers-component.md
│   ├── ui-components.md
│   └── vbox-component.md
└── 40-patterns/                    # 8 个开发模式
    ├── chain-api-pattern.md
    ├── dashboard-demo-page.md
    ├── dynamic-loader.md
    ├── event-handler-pattern.md
    ├── event-handler-summary.md
    ├── factory-setup-preference.md
    ├── jetbrains-islands-theme-update.md
    └── state-handler-pattern.md
```

### 文件统计

| 目录 | 文件数 |
|------|-------|
| 10-fixes/ | 5 |
| 20-architecture/ | 23 |
| 30-components/ | 7 |
| 40-patterns/ | 8 |
| **总计** | **43** |

---

## 验收结果

### 文件组织 ✅

- [x] `.memery/` 根目录仅保留 `00-index.md`
- [x] 所有文件按 10/20/30/40 分类存放
- [x] 索引文件包含所有记忆文件链接

### 文档体系 ✅

- [x] `docs/README.md` 包含文档导航
- [x] 架构文档整合到 `.memery/20-architecture/`
- [x] JSDoc HTML 文件保留在 `docs/`

### 可检索性 ✅

- [x] 按组件名可搜索到对应文档（30-components/）
- [x] 按模式名可搜索到对应文档（40-patterns/）
- [x] 修复记录可按日期检索（10-fixes/）
- [x] 架构文档按主题分组（20-architecture/）

---

## 后续建议

### 文档维护

1. **新增修复记录**：在 `10-fixes/` 中使用 `YYYY-MM-DD-topic-fix.md` 格式
2. **新增架构文档**：放入 `20-architecture/` 并使用描述性文件名
3. **新增组件规范**：放入 `30-components/`
4. **新增模式文档**：放入 `40-patterns/`
5. **更新索引**：每次添加文件后更新 `00-index.md`

### CLAUDE.md 精简（未完成）

计划将 CLAUDE.md 中的详细开发规范提取到独立文档，但考虑到：
- CLAUDE.md 当前 1356 行
- 包含大量组件 API 参考和使用示例
- 作为快速参考文档是合适的

**建议**：保持 CLAUDE.md 现状，因为它同时充当：
1. 项目配置文件
2. 组件 API 快速参考
3. 使用示例手册

如需精简，可考虑：
- 将「组件优先使用原则」移动到 `skills/component-priority.md`（已存在）
- 将「状态机与主题系统」移动到 `.memery/20-architecture/`（已有相关文件）

---

## 相关文件

- [记忆索引](./.memery/00-index.md)
- [文档导航](./docs/README.md)
- [技能索引](./skills/README.md)
