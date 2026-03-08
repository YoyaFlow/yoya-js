# yoya-svg

Yoya.Basic SVG 组件使用技能。当用户需要创建 SVG 图形、使用 SVG 组件时触发此技能。

## 触发条件

- 用户需要创建 SVG 图形
- 用户需要使用 circle、rect、path 等 SVG 元素
- 用户需要绘制图表、图标或矢量图形
- 用户需要了解 SVG 组件的 API

## SVG 组件概览

| 组件 | 用途 | 示例 |
|------|------|------|
| `svg` | SVG 容器 | `svg(s => {...})` |
| `circle` | 圆形 | `circle(c => { c.cx(50).cy(50).r(40); })` |
| `ellipse` | 椭圆 | `ellipse(e => { e.rx(50).ry(30); })` |
| `rect` | 矩形 | `rect(r => { r.width(100).height(50); })` |
| `line` | 线段 | `line(l => { l.x2(100).y2(100); })` |
| `polyline` | 折线 | `polyline(p => { p.points([[0,0],[50,50],[100,0]]); })` |
| `polygon` | 多边形 | `polygon(p => { p.points([[50,0],[100,100],[0,100]]); })` |
| `path` | 路径 | `path('M 10 10 L 50 50 L 90 10 Z')` |
| `g` | 组容器 | `g(g => { g.translate(50,50); ... })` |
| `defs` | 定义容器 | `defs(d => { d.linearGradient(...); })` |
| `linearGradient` | 线性渐变 | 渐变定义 |
| `radialGradient` | 径向渐变 | 渐变定义 |
| `filter` | 滤镜 | 滤镜效果 |

---

## 基础用法

### SVG 容器

```javascript
import { svg, circle, rect } from './yoya/index.js';

svg(s => {
  // 设置视图框
  s.viewBox(0, 0, 100, 100);

  // 设置尺寸
  s.width(200);
  s.height(200);

  // 添加图形
  s.circle(c => {
    c.cx(50);
    c.cy(50);
    c.r(40);
    c.style('fill', 'red');
  });
}).bindTo('#app');
```

---

## 基础形状

### 圆形

```javascript
svg(s => {
  s.viewBox(0, 0, 100, 100);
  s.circle(c => {
    c.cx(50);      // 圆心 X
    c.cy(50);      // 圆心 Y
    c.r(40);       // 半径
    c.style('fill', 'red');
    c.style('stroke', '#333');
    c.style('stroke-width', '2');
  });
}).bindTo('#app');
```

### 椭圆

```javascript
svg(s => {
  s.viewBox(0, 0, 100, 100);
  s.ellipse(e => {
    e.cx(50);      // 中心 X
    e.cy(50);      // 中心 Y
    e.rx(40);      // X 轴半径
    e.ry(20);      // Y 轴半径
    e.style('fill', 'blue');
  });
}).bindTo('#app');
```

### 矩形

```javascript
svg(s => {
  s.viewBox(0, 0, 100, 100);
  s.rect(r => {
    r.x(10);       // 左上角 X
    r.y(10);       // 左上角 Y
    r.width(80);   // 宽度
    r.height(60);  // 高度
    r.style('fill', 'green');
    r.style('stroke', '#333');
    r.style('stroke-width', '2');
  });
}).bindTo('#app');
```

### 圆角矩形

```javascript
svg(s => {
  s.rect(r => {
    r.x(10);
    r.y(10);
    r.width(80);
    r.height(60);
    r.rx(10);      // X 轴圆角半径
    r.ry(10);      // Y 轴圆角半径
    r.style('fill', 'purple');
  });
});
```

### 线段

```javascript
svg(s => {
  s.viewBox(0, 0, 100, 100);
  s.line(l => {
    l.x1(10);      // 起点 X
    l.y1(10);      // 起点 Y
    l.x2(90);      // 终点 X
    l.y2(90);      // 终点 Y
    l.style('stroke', '#333');
    l.style('stroke-width', '2');
    l.style('stroke-linecap', 'round');  // 圆头端点
  });
}).bindTo('#app');
```

### 折线

```javascript
svg(s => {
  s.viewBox(0, 0, 100, 100);
  s.polyline(p => {
    // 点数组
    p.points([
      [10, 10],
      [50, 50],
      [90, 10],
      [50, 90]
    ]);
    p.style('fill', 'none');
    p.style('stroke', 'red');
    p.style('stroke-width', '2');
  });
}).bindTo('#app');
```

### 多边形

```javascript
svg(s => {
  s.viewBox(0, 0, 100, 100);
  s.polygon(p => {
    // 三角形
    p.points([
      [50, 0],
      [100, 100],
      [0, 100]
    ]);
    p.style('fill', 'yellow');
    p.style('stroke', '#333');
    p.style('stroke-width', '2');
  });
}).bindTo('#app');
```

---

## 路径 Path

### 使用 d 属性字符串

```javascript
svg(s => {
  s.viewBox(0, 0, 100, 100);
  s.path(p => {
    p.d('M 10 10 L 50 50 L 90 10 Z');
    p.style('fill', 'lightblue');
    p.style('stroke', '#333');
    p.style('stroke-width', '2');
  });
}).bindTo('#app');

// 路径命令简写
// M = moveTo, L = lineTo, Z = closePath
```

### 使用链式方法

```javascript
svg(s => {
  s.path(p => {
    p.moveTo(10, 10)
     .lineTo(50, 50)
     .lineTo(90, 10)
     .closePath();
    p.style('fill', 'orange');
  });
});
```

### 曲线

```javascript
svg(s => {
  s.viewBox(0, 0, 100, 100);
  s.path(p => {
    p.moveTo(10, 50);
    // 三次贝塞尔曲线
    p.curveTo(30, 10, 70, 90, 90, 50);
    p.style('fill', 'none');
    p.style('stroke', 'blue');
    p.style('stroke-width', '2');
  });
}).bindTo('#app');

// 或二次贝塞尔曲线
// .quadraticCurveTo(cx, cy, x, y)
```

### 弧线

```javascript
svg(s => {
  s.path(p => {
    p.moveTo(50, 50);
    // rx, ry, rotation, largeArc, sweep, x, y
    p.arcTo(30, 30, 0, 1, 1, 80, 20);
    p.style('fill', 'none');
    p.style('stroke', 'green');
  });
});
```

---

## 文本

### 基础文本

```javascript
svg(s => {
  s.viewBox(0, 0, 100, 100);
  s.text(t => {
    t.x(50);
    t.y(50);
    t.text('Hello SVG');
    t.style('fill', '#333');
    t.style('font-size', '16');
    t.style('font-weight', 'bold');
    t.style('text-anchor', 'middle');  // 居中对齐
  });
}).bindTo('#app');
```

### 嵌套 tspan

```javascript
svg(s => {
  s.text(t => {
    t.x(50);
    t.y(30);
    t.tspan('粗体').style('font-weight', 'bold');
    t.tspan(' 普通字体');

    t.tspan(t2 => {
      t2.x(50);
      t2.y(60);
      t2.text('第二行文字');
      t2.style('fill', 'red');
    });
  });
});
```

---

## 渐变

### 线性渐变

```javascript
svg(s => {
  s.viewBox(0, 0, 100, 100);

  // 定义渐变
  s.linearGradient(g => {
    g.id('grad1');
    g.x1(0); g.y1(0);
    g.x2(100); g.y2(0);  // 水平渐变
    g.stop(0, '#ff0000');    // 红色
    g.stop(100, '#0000ff');  // 蓝色
  });

  // 使用渐变
  s.rect(r => {
    r.x(10); r.y(10);
    r.width(80); r.height(80);
    r.style('fill', 'url(#grad1)');
  });
}).bindTo('#app');
```

### 径向渐变

```javascript
svg(s => {
  s.radialGradient(g => {
    g.id('radialGrad1');
    g.cx(50); g.cy(50);
    g.r(50);
    g.stop(0, '#ffff00');  // 黄色中心
    g.stop(100, '#ff0000'); // 红色边缘
  });

  s.circle(c => {
    c.cx(50); c.cy(50); c.r(40);
    c.style('fill', 'url(#radialGrad1)');
  });
});
```

---

## 滤镜

### 高斯模糊

```javascript
svg(s => {
  s.viewBox(0, 0, 100, 100);

  s.filter('blurFilter', f => {
    f.gaussianBlur(5);  // 模糊半径
  });

  s.rect(r => {
    r.x(10); r.y(10);
    r.width(80); r.height(80);
    r.style('fill', 'red');
    r.style('filter', 'url(#blurFilter)');
  });
}).bindTo('#app');
```

### 投影

```javascript
svg(s => {
  s.filter('shadowFilter', f => {
    f.dropShadow(2, 2, 3, '#000', 0.5);
    // dx, dy, stdDeviation, floodColor, floodOpacity
  });

  s.circle(c => {
    c.cx(50); c.cy(50); c.r(40);
    c.style('fill', 'white');
    c.style('filter', 'url(#shadowFilter)');
  });
});
```

---

## 组与变换

### 组容器

```javascript
svg(s => {
  s.viewBox(0, 0, 100, 100);

  s.g(g => {
    // 组内可以包含多个元素
    g.circle(c => {
      c.cx(30); c.cy(50); c.r(20);
      c.style('fill', 'red');
    });
    g.rect(r => {
      r.x(50); r.y(30); r.width(40); r.height(40);
      r.style('fill', 'blue');
    });
  });
});
```

### 变换

```javascript
svg(s => {
  s.viewBox(0, 0, 100, 100);

  // 平移
  s.g(g => {
    g.translate(50, 50);
    g.circle(c => {
      c.cx(0); c.cy(0); c.r(20);
      c.style('fill', 'red');
    });
  });

  // 旋转
  s.g(g => {
    g.rotate(45);  // 旋转 45 度
    g.rect(r => {
      r.x(-25); r.y(-25);
      r.width(50); r.height(50);
      r.style('fill', 'blue');
    });
  });

  // 缩放
  s.g(g => {
    g.scale(1.5);
    g.circle(c => {
      c.cx(30); c.cy(30); c.r(10);
      c.style('fill', 'green');
    });
  });
});
```

---

## 完整示例

### 简单的图表

```javascript
import { svg, circle, rect, line, text } from './yoya/index.js';

svg(s => {
  s.viewBox(0, 0, 200, 100);
  s.width(400);
  s.height(200);

  // 背景
  s.rect(r => {
    r.width(200); r.height(100);
    r.style('fill', '#f5f5f5');
  });

  // 柱状图
  const data = [30, 50, 80, 60, 90];
  const barWidth = 30;
  const gap = 10;

  data.forEach((value, index) => {
    const x = gap + index * (barWidth + gap);
    const height = value;
    const y = 100 - height;

    s.rect(r => {
      r.x(x);
      r.y(y);
      r.width(barWidth);
      r.height(height);
      r.style('fill', `hsl(${index * 60}, 70%, 50%)`);
    });

    // 数值标签
    s.text(t => {
      t.x(x + barWidth / 2);
      t.y(y - 5);
      t.text(value.toString());
      t.style('font-size', '10');
      t.style('text-anchor', 'middle');
    });
  });

  // 基线
  s.line(l => {
    l.x1(0); l.y1(100);
    l.x2(200); l.y2(100);
    l.style('stroke', '#333');
    l.style('stroke-width', '2');
  });
}).bindTo('#app');
```

### 图标

```javascript
svg(s => {
  s.viewBox(0, 0, 24, 24);
  s.width(48);
  s.height(48);

  // 圆形背景
  s.circle(c => {
    c.cx(12); c.cy(12); c.r(12);
    c.style('fill', '#1890ff');
  });

  // 对勾
  s.path(p => {
    p.moveTo(7, 12);
    p.lineTo(10, 15);
    p.lineTo(17, 8);
    p.style('fill', 'none');
    p.style('stroke', 'white');
    p.style('stroke-width', '2');
    p.style('stroke-linecap', 'round');
    p.style('stroke-linejoin', 'round');
  });
}).bindTo('#app');
```

### 带有渐变的按钮

```javascript
svg(s => {
  s.viewBox(0, 0, 120, 40);

  // 定义渐变
  s.linearGradient(g => {
    g.id('btnGradient');
    g.x1(0); g.y1(0);
    g.x2(0); g.y2(100);
    g.stop(0, '#667eea');
    g.stop(100, '#764ba2');
  });

  // 定义阴影
  s.filter('shadow', f => {
    f.dropShadow(0, 2, 4, '#000', 0.3);
  });

  // 按钮背景
  s.rect(r => {
    r.x(0); r.y(0);
    r.width(120); r.height(40);
    r.rx(20);  // 圆角
    r.style('fill', 'url(#btnGradient)');
    r.style('filter', 'url(#shadow)');
  });

  // 按钮文字
  s.text(t => {
    t.x(60);
    t.y(25);
    t.text('Click Me');
    t.style('fill', 'white');
    t.style('font-size', '14');
    t.style('font-weight', 'bold');
    t.style('text-anchor', 'middle');
  });
}).bindTo('#app');
```

---

## API 方法汇总

### svg 容器
- `viewBox(x, y, w, h)` - 设置视图框
- `width(val)` / `height(val)` - 设置尺寸
- `circle(setup)` / `rect(setup)` / `line(setup)`... - 添加子元素

### 基础形状
- `circle`: `cx()`, `cy()`, `r()`
- `ellipse`: `cx()`, `cy()`, `rx()`, `ry()`
- `rect`: `x()`, `y()`, `width()`, `height()`, `rx()`, `ry()`
- `line`: `x1()`, `y1()`, `x2()`, `y2()`
- `polyline/polygon`: `points([[x1,y1], [x2,y2], ...])`
- `path`: `d(pathString)` 或 `moveTo()`, `lineTo()`, `curveTo()`, `arcTo()`, `closePath()`

### 文本
- `text`: `x()`, `y()`, `text(content)`, `tspan(setup)`

### 渐变
- `linearGradient`: `id()`, `x1()`, `y1()`, `x2()`, `y2()`, `stop(offset, color)`
- `radialGradient`: `id()`, `cx()`, `cy()`, `r()`, `stop(offset, color)`

### 滤镜
- `filter(id, setup)`: `gaussianBlur(stdDeviation)`, `dropShadow(dx, dy, stdDeviation, color, opacity)`

### 组变换
- `g`: `translate(x, y)`, `rotate(deg)`, `scale(sx, sy)`, `skewX(deg)`, `skewY(deg)`

---

## 注意事项

1. **SVG 元素在父容器内调用时**，第一个参数传 `null`：
   ```javascript
   svg(s => {
     s.polyline(null, p => { p.points([[0,0], [50,50]]); });
   });
   ```

2. **路径命令可以直接传入字符串**，也可以使用链式方法

3. **渐变和滤镜需要在 defs 中定义**，然后通过 `url(#id)` 引用

4. **坐标系统由 viewBox 定义**，建议使用 viewBox 而不是直接设置 width/height
