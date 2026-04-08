# Dashboard 组件库

## 概述

YoyaJS Dashboard 组件库提供了 24 个专为大屏看板设计的组件，分为两大类：数据展示组件和装饰组件。

## 组件清单

### 数据展示组件 (8 个)

| 组件名 | 工厂函数 | 说明 | 使用场景 |
|--------|---------|------|----------|
| VNumberScroll | vNumberScroll | 数字滚动动画 | 实时数据展示，数字翻牌效果 |
| VTrend | vTrend | 趋势指示器 | 上升/下降箭头 + 百分比 |
| VGauge | vGauge | 仪表盘 | 半圆/全圆进度条 |
| VCircularProgress | vCircularProgress | 环形进度条 | 简洁的环形进度显示 |
| VIndicator | vIndicator | 指标卡 | 关键指标展示（图标 + 标题 + 数值 + 趋势） |
| VTimeSeries | vTimeSeries | 时间序列 | 按时间排列的数据序列 |
| VRankList | vRankList | 排行榜 | 排名列表，支持前三名高亮 |
| VDashboardGrid | vDashboardGrid | 栅格布局 | 响应式看板布局 |

### 装饰组件 (7 个)

| 组件名 | 工厂函数 | 说明 | 使用场景 |
|--------|---------|------|----------|
| VBorder | vBorder | 装饰边框 | 4 种样式：普通、渐变、发光、角标 |
| VDivider | vDivider | 分割线 | 水平/垂直、渐变、虚线、带文字 |
| VCorner | vCorner | 角标装饰 | L 型、方块、三角三种形状 |
| VTitleBar | vTitleBar | 标题栏 | 带装饰的标题条，4 种样式 |
| VPanel | vPanel | 装饰面板 | 带边框的容器，支持科技风、渐变 |
| VGlowBox | vGlowBox | 发光盒子 | 带发光效果的容器 |
| VTechBorder | vTechBorder | 科技风边框 | 适合数据大屏的科技风格 |

## 文件结构

```
src/yoya/components/
├── dashboard.js              # 数据展示组件（8 个）
├── dashboard-decoration.js   # 装饰组件（7 个）
└── index.js                  # 组件导出

src/yoya/theme/css/components/
└── dashboard.css             # Dashboard 组件样式
```

## 使用示例

### 导入组件

```javascript
import { 
  // 数据展示组件
  vNumberScroll, vTrend, vGauge, 
  vCircularProgress, vIndicator, 
  vTimeSeries, vRankList, vDashboardGrid,
  // 装饰组件
  vBorder, vDivider, vCorner,
  vTitleBar, vPanel, vGlowBox, vTechBorder
} from './yoya/index.js';
```

### 数字滚动动画

```javascript
vNumberScroll(n => {
  n.value(987654);
  n.prefix('¥');
  n.separator(',');
  n.fontSize('48px');
  n.color('#00f5ff');
  n.duration(2000);
}).bindTo('#container');
```

### 趋势指示器

```javascript
vTrend(t => {
  t.value(15.8);  // 正数上升，负数下降
  t.precision(1);
}).bindTo('#container');
```

### 指标卡

```javascript
vIndicator(i => {
  i.icon('💰');
  i.title('总销售额');
  i.value(1234567);
  i.trend(12.5);
  i.prefix('¥');
  i.separator(',');
}).bindTo('#container');
```

### 装饰边框

```javascript
vBorder(b => {
  b.type('gradient');  // 'normal' | 'gradient' | 'glow' | 'corner'
  b.color('#667eea', '#764ba2');
  b.borderWidth(3);
  b.borderRadius(8);
  b.content('内容区域');
}).bindTo('#container');
```

### 科技风边框

```javascript
vTechBorder(t => {
  t.color('#00f5ff', '#667eea');
  t.borderWidth(2);
  t.animated(true);
  t.content('科技风内容区');
}).bindTo('#container');
```

### 标题栏

```javascript
vTitleBar(t => {
  t.title('数据监控');
  t.subtitle('Real-time Dashboard');
  t.icon('📊');
  t.type('gradient');
  t.color('#00f5ff', '#667eea');
  t.decorationWidth(100);
}).bindTo('#container');
```

### 完整看板示例

```javascript
import { vPanel, vTitleBar, vIndicator, vNumberScroll, vBorder } from './yoya/index.js';

// 创建看板面板
vPanel(p => {
  p.type('tech');
  p.color('#00f5ff');
  p.showHeader(false);
  p.content(div(c => {
    // 标题栏
    c.child(vTitleBar(t => {
      t.title('实时数据监控');
      t.icon('📊');
      t.type('gradient');
      t.color('#00f5ff', '#667eea');
    }).renderDom());
    
    // 指标卡
    c.child(div(i => {
      i.styles({ display: 'flex', gap: '20px' });
      i.child(vIndicator(ind => {
        ind.icon('💰');
        ind.title('销售额');
        ind.value(123456);
        ind.trend(12.5);
        ind.prefix('¥');
      }).renderDom());
    }));
    
    // 数字滚动
    c.child(vBorder(b => {
      b.type('glow');
      b.color('#00f5ff');
      b.content(vNumberScroll(n => {
        n.value(987654);
        n.prefix('¥');
        n.fontSize('48px');
      }).renderDom());
    }).renderDom());
  }));
}).bindTo('#dashboard');
```

## API 参考

### VNumberScroll

| 方法 | 参数 | 说明 |
|------|------|------|
| value | number | 设置目标值并触发动画 |
| prefix | string | 设置前缀 |
| suffix | string | 设置后缀 |
| precision | number | 设置小数位数 |
| separator | string | 设置千分位分隔符 |
| duration | number | 设置动画时长 (ms) |
| easing | string | 设置缓动函数 |
| fontSize | string | 设置字体大小 |
| color | string | 设置字体颜色 |

### VTrend

| 方法 | 参数 | 说明 |
|------|------|------|
| value | number | 设置趋势值（正数上升，负数下降） |
| precision | number | 设置小数位数 |
| showIcon | boolean | 是否显示图标 |
| showValue | boolean | 是否显示数值 |
| positiveColor | string | 设置上升颜色 |
| negativeColor | string | 设置下降颜色 |

### VGauge

| 方法 | 参数 | 说明 |
|------|------|------|
| value | number | 设置当前值 |
| min | number | 设置最小值 |
| max | number | 设置最大值 |
| size | number | 设置尺寸（像素） |
| strokeWidth | number | 设置进度条宽度 |
| type | string | 'semicircle' | 'circle' |
| label | string | 设置标签文本 |
| valueSuffix | string | 设置数值后缀 |

### VBorder

| 方法 | 参数 | 说明 |
|------|------|------|
| type | string | 边框类型 |
| color | string, string | 设置颜色（主色，副色） |
| borderWidth | number | 设置边框宽度 |
| borderRadius | number | 设置圆角 |
| padding | number | 设置内边距 |
| content | Tag\|string | 设置内容 |
| animated | boolean | 是否动画 |

### VDivider

| 方法 | 参数 | 说明 |
|------|------|------|
| orientation | string | 'horizontal' | 'vertical' |
| type | string | 'normal' | 'gradient' | 'dashed' | 'dotted' |
| text | string | 设置文字 |
| color | string, string | 设置颜色 |
| thickness | number | 设置粗细 |
| length | string | 设置长度 |

## CSS 变量

Dashboard 组件使用以下 CSS 变量：

```css
--yoya-primary           /* 主色调 */
--yoya-primary-light     /* 主色调浅色 */
--yoya-bg                /* 背景色 */
--yoya-bg-secondary      /* 次要背景色 */
--yoya-border            /* 边框色 */
--yoya-border-light      /* 浅色边框 */
--yoya-text-primary      /* 主文本色 */
--yoya-text-secondary    /* 次要文本色 */
--yoya-radius-md         /* 中等圆角 */
--yoya-radius-lg         /* 大圆角 */
```

## Dark Mode 支持

所有 Dashboard 组件都支持 Dark Mode，通过 CSS 变量自动适配：

```css
[data-theme="islands-dark"],
[data-theme="dark"] {
  --yoya-primary: #5a8bf7;
  --yoya-bg: #1a1a1a;
  --yoya-text-primary: #e0e0e0;
  /* ... 其他变量 */
}
```

## 动画关键帧

```css
@keyframes borderGlow {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

@keyframes cornerPulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 15px rgba(90, 139, 247, 0.3); }
  50% { box-shadow: 0 0 30px rgba(90, 139, 247, 0.5); }
}

@keyframes techLineFlow {
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
}
```

## 测试

运行测试：

```bash
npm test
```

所有 65 个现有测试通过。

## 演示页面

- 数据组件：http://localhost:3001/yoya/examples/yoya.dashboard.example.html
- 装饰组件：http://localhost:3001/yoya/examples/yoya.dashboard.decoration.html

## 设计原则

Dashboard 组件遵循以下设计原则：

1. **使用虚拟元素** - 所有组件使用 `this._children.push()` 添加子元素
2. **不直接操作 DOM** - 除了 SVG 必须使用 `createElementNS`
3. **setup 时构建结构** - 在构造函数中构建子元素，renderDom 只负责渲染
4. **CSS 变量驱动** - 所有颜色和尺寸使用 CSS 变量
5. **支持 Dark Mode** - 自动适配深色主题
6. **链式 API** - 所有设置方法返回 `this` 支持链式调用

## 更新日志

### v1.0.1 (2026-03-30)
**修复**:
- 修复 `addClass` 调用时传入空格分隔的类名导致的错误，改为分别调用
- 修复 `VDivider`、`VBorder`、`VPanel` 等组件在 `setup` 完成后没有正确渲染子元素的问题
- 添加 `VDivider.text()` 方法调用后重新渲染子元素的逻辑

### v1.0.0 (2026-03-30)
- 初始版本
- 发布 8 个数据展示组件
- 发布 7 个装饰组件
- 完整的 CSS 样式支持
- Dark Mode 支持

## 已知问题和注意事项

### addClass 使用注意事项

`addClass()` 方法不支持空格分隔的多个类名。如果需要添加多个类名，应该分别调用：

```javascript
// ❌ 错误
c.addClass('class1 class2');

// ✅ 正确
c.addClass('class1');
c.addClass('class2');
```

### 组件渲染时机

对于需要在 `setup` 完成后才能确定内部结构的组件（如 `VBorder`、`VDivider`、`VPanel`），装饰元素会在 `setup` 完成后自动创建。因此：

```javascript
// ✅ 正确 - type 在 setup 中设置
vBorder(b => {
  b.type('gradient');  // 装饰元素会在 setup 完成后创建
  b.content('内容');
});

// ⚠️ 注意 - 如果先调用 type() 再手动调用 _createDecoration() 可能导致重复创建
```
