# VSelect/VForm/VSwitch 组件修复

**日期**: 2026-03-04

## 问题 1: `s.placeholder is not a function`

**错误位置**: `src/v1/examples/form.js:115`

### 原因
VSelect 组件缺少 `placeholder()` 和 `multiple()` 方法，但示例代码中调用了它们。

### 修复内容
- 添加 `_placeholder` 和 `_multiple` 属性
- 添加 `placeholder()` 和 `multiple()` 方法
- 新增 `_updateOptionsWithPlaceholder()` 统一管理选项
- 修复 `options()` 和 `value()` 方法
- 更新 TypeScript 类型定义

---

## 问题 2: `f.gap is not a function`

**错误位置**: `src/v1/examples/form.js:286`

### 修复
为 VForm 添加 `gap()` 方法。

---

## 问题 3: VSwitch label 与按钮重合/滑块不是圆形

**错误位置**: `src/v1/examples/form.js:220`

### 原因
1. 原有实现将 label 添加到 VSwitch 容器内部，导致样式冲突
2. VSwitch 容器本身应始终是开关按钮样式，label 应在外部

### 修复
重新设计 VSwitch 结构：
- `_switchEl` - 开关按钮容器（圆角矩形背景）
- `knob` - 圆形滑块（在 _switchEl 内部）
- `_wrapper` - 包裹 _switchEl 和 _labelEl 的容器（当有 label 时）

### 渲染结果
**开启通知（checked 状态）**: 背景 #667eea，滑块 translateX(22px)
**自动同步（disabled 状态）**: 背景 #e0e0e0，滑块 translateX(0px)

---

## 相关文件
- `src/yoya/components/form.js`
- `src/yoya/components/index.d.ts`
