# UI 组件 API

## Card 卡片

```javascript
card(c => {
  c.cardHeader(h => {
    h.text('标题');
    h.styles({ fontSize: '16px', fontWeight: '600' });
  });
  c.cardBody('内容或 setup 函数');
  c.cardFooter(b => {
    b.button('操作');
  });
});
```

### Card 内部缓存结构

```javascript
class Card extends Tag {
  _headerBox;   // 缓存 CardHeader
  _bodyBox;     // 缓存 CardBody
  _footerBox;   // 缓存 CardFooter
}
```

## Menu 菜单

```javascript
menu(m => {
  // 菜单项
  m.item(it => {
    it.text('菜单项');
    it.icon('<svg>...</svg>');
    it.shortcut('Ctrl+S');
    it.active();
    it.disabled();
    it.danger();
    it.onclick(fn);
  });

  // 分割线
  m.divider();

  // 菜单组
  m.group(g => {
    g.label('组名');
    g.item(...);
  });
});
```

### MenuItem 状态

| 状态 | 方法 | 效果 |
|------|------|------|
| disabled | `.disabled()` | 透明度 0.5, 不可点击 |
| active | `.active()` | 激活高亮 |
| danger | `.danger()` | 红色警告样式 |
| hoverable | `.hoverable()` | 可悬停高亮 |

## DropdownMenu 下拉菜单

```javascript
dropdownMenu(d => {
  d.trigger('点击我');
  d.menuContent(menu(...));
  d.closeOnClickOutside();
});
```

## ContextMenu 右键菜单

```javascript
const ctxMenu = contextMenu(ctx => {
  ctx.menuContent(menu(...));
});
ctxMenu.target(document.getElementById('target'));
```

## Message 消息提示

```javascript
import { toast } from '../yoya/index.js';

toast.success('操作成功！');
toast.error('操作失败！');
toast.warning('请注意！');
toast.info('提示信息');

// 自定义时长
toast.info('消息', 'info', 5000);  // 5 秒
toast.info('消息', 'info', 0);     // 不自动关闭
```

## VEchart ECharts 图表

```javascript
import { vEchart } from '../yoya/index.js';

vEchart(chart => {
  chart.echartsLib(window.echarts);
  chart.height('300px');
  chart.option({
    xAxis: { type: 'category', data: ['A', 'B', 'C'] },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: [10, 20, 30] }]
  });
  chart.onChartReady(instance => {
    console.log('图表已就绪');
  });
});
```

### API 方法

| 方法 | 说明 |
|------|------|
| `echartsLib(lib)` | 设置 ECharts 库实例 |
| `option(opt)` | 设置图表配置项 |
| `width(val)` / `height(val)` | 设置宽高 |
| `theme(val)` | 设置主题 (dark/light) |
| `renderer(val)` | 设置渲染器 (canvas/svg) |
| `autoResize(auto)` | 是否自动响应容器大小 |
| `loading(bool, text)` | 设置加载状态 |
| `onChartReady(fn)` | 注册图表就绪回调 |
| `onChartResize(fn)` | 注册图表大小变化回调 |
| `getChartInstance()` | 获取 ECharts 实例 |
| `resize(opts)` | 更新图表大小 |
| `clear()` | 清空图表 |
| `dispose()` | 释放图表实例 |

### 支持的图表类型

- 柱状图 (bar)
- 折线图 (line)
- 饼图 (pie)
- 雷达图 (radar)
- 散点图 (scatter)
- 仪表盘 (gauge)

## VStatistic 统计数值

```javascript
// 基础用法
vStatistic(s => {
  s.title('总访问量');
  s.value(12345);
});

// 格式化数字
vStatistic(s => {
  s.title('销售额');
  s.value(1234567.89);
  s.prefix('¥');
  s.separator(',');  // 千分位分隔符
  s.precision(2);    // 保留 2 位小数
});

// 前缀和后缀
vStatistic(s => {
  s.title('完成率');
  s.value(87.5);
  s.suffix('%');
});

// 数值动画
vStatistic(s => {
  s.title('实时在线');
  s.value(0);
  s.animated(true);     // 启用动画
  s.duration(2000);     // 动画时长 2s
});
```

### API 方法

| 方法 | 说明 | 返回值 |
|------|------|--------|
| `title(str)` | 设置统计项标题 | this |
| `value(num)` | 设置统计数值 | this |
| `prefix(str)` | 设置前缀（如货币符号） | this |
| `suffix(str)` | 设置后缀（如单位） | this |
| `separator(str)` | 设置数字分隔符（默认 `,`） | this |
| `precision(n)` | 设置小数位数 | this |
| `animated(bool)` | 是否启用数值动画 | this |
| `duration(ms)` | 动画时长（毫秒） | this |

## 相关文件

- `src/yoya/components/card.js` - Card 组件
- `src/yoya/components/menu.js` - Menu 组件
- `src/yoya/components/message.js` - Message 组件
- `src/yoya/components/echart.js` - VEchart 组件
- `src/yoya/components/ui.js` - UI 组件（Avatar, Badge, Progress, Skeleton, Tag, Alert, Breadcrumb, Statistic）
