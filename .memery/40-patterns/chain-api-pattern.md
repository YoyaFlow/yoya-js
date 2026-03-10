# 链式 API 模式

## 基本模式

所有设置方法返回 `this`，支持链式调用：

```javascript
div(box => {
  box.id('main')
     .className('container')
     .style('padding', '20px')
     .on('click', handler);
});
```

## getter/setter 约定

```javascript
// 设置值返回 this
placeholder(value) {
  this._placeholder = value;
  if (this._inputEl) {
    this._inputEl.attr('placeholder', value);
  }
  return this;
}

// 获取值返回属性
placeholder() {
  return this._placeholder;
}

// 合并到一个方法
placeholder(value) {
  if (value === undefined) return this._placeholder;
  this._placeholder = value;
  // ... 同步到 DOM
  return this;
}
```

## 状态链式方法

```javascript
disabled(value = true) {
  return this.setState('disabled', value);
}

error(value = true) {
  return this.setState('error', value);
}
```

## 工厂方法链式扩展

```javascript
// Tag 原型扩展 - 所有元素可用
Tag.prototype.div = function(setup = null) {
  const el = div(setup);
  this.child(el);
  return this;
};

// 使用
div(box => {
  box.header('标题')      // 添加 header
     .h2('副标题')        // 添加 h2
     .button('提交');     // 添加 button
});
```

## 特定父元素扩展

```javascript
// Table.tr() - 表格添加行
Table.prototype.tr = function(setup = null) {
  const row = tr(setup);
  this.child(row);
  return this;
};

// Form.input() - 表单添加输入框
Form.prototype.input = function(setup = null) {
  const input = input(setup);
  this.child(input);
  return this;
};
```

## 设计原则

| 原则 | 说明 |
|------|------|
| 设置方法返回 this | 支持链式调用 |
| 获取方法返回值 | 无参数时返回当前值 |
| 统一参数判断 | `undefined` 判断是否获取值 |
| 默认值处理 | 布尔参数默认值为 `true` |

## 相关文件

- `src/yoya/core/basic.js` - Tag 基类
- 各组件类定义
