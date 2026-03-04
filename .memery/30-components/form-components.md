# 表单组件 API

## VInput 输入框

```javascript
vInput(i => {
  i.placeholder('请输入...');
  i.value('默认值');
  i.type('password');      // text, password, email, number 等
  i.name('fieldName');
  i.disabled();
  i.readonly();
  i.error();
  i.loading();
  i.size('large');         // large, default, small
  i.onChange(fn);
});
```

## VSelect 选择框

```javascript
vSelect(s => {
  s.placeholder('请选择...');
  s.options([{ value, label }, ...]);
  s.value('selected');
  s.multiple();            // 多选模式
  s.name('fieldName');
  s.disabled();
  s.error();
  s.size('large');
  s.onChange(fn);
});
```

### VSelect placeholder 实现细节

- 非 multiple 模式：添加禁用占位选项
- multiple 模式：不显示 placeholder

```javascript
// placeholder 选项
option(o => {
  o.text(this._placeholder);
  o.attr('value', '');
  o.attr('disabled', 'disabled');
  o.attr('selected', 'selected');
});
```

## VTextarea 文本域

```javascript
vTextarea(t => {
  t.placeholder('请输入...');
  t.value('内容');
  t.rows(4);
  t.name('fieldName');
  t.disabled();
  t.readonly();
  t.error();
  t.onChange(fn);
});
```

## VCheckboxes 复选框组

```javascript
vCheckboxes(cb => {
  cb.options([{ value, label }, ...]);
  cb.multiple(true);       // 多选模式
  cb.value(['apple']);
  cb.layout('column');     // column, row, grid
  cb.columns(3);           // grid 布局列数
  cb.disabled();
  cb.error();
  cb.onChange(fn);
});
```

## VTimer 日期选择器

```javascript
vTimer(t => {
  t.type('date');          // date, datetime-local, time, month, week
  t.value('2024-03-15');
  t.disabled();
  t.readonly();
  t.error();
  t.min('2024-01-01');
  t.max('2024-12-31');
  t.step(1);
  t.onChange(fn);
});
```

## VTimer2 日期范围选择器

```javascript
vTimer2(t2 => {
  t2.type('date');
  t2.value({ start: '2024-03-01', end: '2024-03-31' });
  t2.disabled();
  t2.readonly();
  t2.error();
  t2.min('2024-01-01');
  t2.max('2024-12-31');
  t2.startMin('2024-01-01');
  t2.startMax('2024-06-30');
  t2.endMin('2024-07-01');
  t2.endMax('2024-12-31');
  t2.onChange(fn);
});
```

## VForm 表单容器

```javascript
vForm(f => {
  f.gap('16px');           // 子元素间距
  f.action('/submit');
  f.method('post');
  f.onSubmit(fn);
});
```

## 相关文件

- `src/yoya/components/form.js` - 所有表单组件实现
- `src/yoya/components/index.d.ts` - TypeScript 类型定义
