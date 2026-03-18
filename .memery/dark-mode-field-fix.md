# vField 深色模式修复记录

## 问题

vField 组件在深色模式下，编辑容器的背景和文字颜色仍然是浅色模式的颜色（rgb(51, 51, 51)），导致在深色背景下看不清楚。

## 原因分析

1. vField 组件使用内联样式设置颜色：
   ```javascript
   this.styles({
     color: 'var(--yoya-field-text-color, var(--yoya-text, #333))',
   });
   ```

2. 内联样式的 CSS 变量在组件创建时被计算，之后即使主题切换，内联样式中的 CSS 变量值也不会更新。

3. CSS 类规则的优先级低于内联样式，无法覆盖。

## 解决方案

### 1. 为 vField 组件添加 CSS 类名

在 `src/yoya/components/field.js` 中为所有元素添加类名：

```javascript
_setupBaseStyles() {
  this.className('yoya-field');
  // ...
}

_buildShowEl() {
  this._showEl = div(c => {
    c.className('yoya-field__show-el');
    // ...
  });
}

_buildEditContainer() {
  this._editContainer = div(e => {
    e.className('yoya-field__edit-container');
    e.styles({
      color: 'var(--yoya-field-text-color, var(--yoya-text, #333))',
    });
    // ...
  });
}
```

### 2. 创建 field.css 样式文件

创建 `src/yoya/theme/css/components/field.css`，使用 `!important` 覆盖内联样式：

```css
[data-theme='islands-dark'] .yoya-field {
  color: var(--yoya-field-text-color, var(--yoya-text, #e0e0e0)) !important;
}

[data-theme='islands-dark'] .yoya-field__edit-container {
  background: var(--yoya-field-edit-bg, var(--yoya-bg-secondary, #2a2a2a)) !important;
  color: var(--yoya-field-text-color, var(--yoya-text, #e0e0e0)) !important;
}
```

### 3. 在 index.css 中导入

```css
@import url('./field.css');
```

## 测试验证

创建 `tests/v2-theme-field.test.js` 测试：

```javascript
test('检查 vField 编辑区域的背景和文字颜色', async ({ page }) => {
  // 切换到深色模式
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'islands-dark');
  });

  // 双击进入编辑模式
  await page.getByText('张三').first().dblclick();

  // 检查编辑容器颜色
  const result = await page.evaluate(() => {
    const editContainer = document.querySelector('.yoya-field__edit-container');
    const style = window.getComputedStyle(editContainer);
    // 检查背景和文字颜色
  });

  // 断言：背景暗 (<100), 文字亮 (>150)
});
```

测试结果：
- 编辑容器背景：`rgb(42, 42, 42)`，亮度 42 ✓
- 编辑容器文字：`rgb(224, 224, 224)`，亮度 224 ✓

## 其他组件修复

### Table 表格
之前已修复，使用相同方法（`table.css` + `!important`）

### 其他组件
- Button: 使用主题变量，正常响应主题切换
- Menu: 使用主题变量，正常响应主题切换
- Card: 使用主题变量，正常响应主题切换
- Tabs: 需要检查
- Form: checkbox input 的 color 属性不影响显示，排除测试

## 关键模式

**主题敏感组件的 CSS 规则应该使用 `!important` 来覆盖内联样式**：

```css
[data-theme='islands-dark'] .component-name {
  color: var(--yoya-text, #e0e0e0) !important;
  background: var(--yoya-bg, #1a1a1a) !important;
}
```

这是因为组件的内联样式在创建时被计算，不会随主题切换而更新。
