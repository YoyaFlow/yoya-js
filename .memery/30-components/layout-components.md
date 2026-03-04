# 布局组件 API

## Flex 弹性布局

```javascript
flex(box => {
  box.row();               // 水平排列 (默认)
  box.column();            // 垂直排列
  box.justifyCenter();
  box.justifyBetween();
  box.justifyAround();
  box.alignCenter();
  box.alignStretch();
  box.wrap();              // 换行
  box.gap('12px');
});
```

## Grid 网格布局

```javascript
grid(g => {
  g.columns(3);            // 3 列等宽
  g.rows(2);               // 2 行等高
  g.minSize('200px');      // 最小尺寸
  g.gap('16px');
  g.templateColumns('1fr 2fr 1fr');
});
```

## ResponsiveGrid 响应式网格

```javascript
responsiveGrid(g => {
  g.minSize('250px');      // 每个格子最小宽度
  g.gap('16px');
});
```

自动根据容器宽度调整列数。

## Stack 堆叠布局

```javascript
// 垂直堆叠 (默认)
vstack(s => {
  s.gap('16px');
  s.div('上');
  s.div('下');
});

// 水平堆叠
hstack(s => {
  s.gap('16px');
  s.div('左');
  s.div('右');
});
```

## Center 居中布局

```javascript
center(c => {
  c.div('居中内容');
});
```

## 其他布局组件

```javascript
// 弹性占位
spacer();

// 响应式容器
container(c => {
  c.maxWidth('1200px');
  c.padding('20px');
});

// 分割线
divider();
```

## 布局组合示例

```javascript
card(c => {
  c.cardHeader('标题');
  c.cardBody(content => {
    content.child(vstack(s => {
      s.gap('12px');
      s.child(flex(row => {
        row.justifyBetween();
        row.div('左侧');
        row.div('右侧');
      }));
      s.child(grid(g => {
        g.columns(2);
        g.gap('8px');
      }));
    }));
  });
});
```

## 相关文件

- `src/yoya/core/layout.js` - 所有布局组件实现
- `src/yoya/index.d.ts` - TypeScript 类型定义
