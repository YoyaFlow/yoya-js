# yoya-echart

YoyaJS ECharts 图表组件使用技能。当用户需要实现数据可视化、图表展示、仪表盘或数据分析界面时触发此技能。

## 触发条件

- 用户需要创建数据可视化图表
- 用户需要了解 ECharts 组件的 API
- 用户需要实现图表加载状态
- 用户需要响应式图表（自动适配容器大小）

## 图表组件概览

| 组件 | 用途 | 导入 |
|------|------|------|
| `vEchart` | ECharts 图表容器 | 柱状图、折线图、饼图、雷达图等 |

---

## 基础用法

### 创建图表

```javascript
import { vEchart } from './yoya/components/echart.js';

// 创建基础图表
const chart = vEchart(c => {
  c.styles({
    width: '600px',
    height: '400px',
  });
  
  c.option({
    title: {
      text: '销售统计',
      left: 'center',
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    yAxis: {
      type: 'value',
    },
    series: [{
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar',
    }],
  });
});

chart.bindTo('#app');
```

### 使用 setup 函数组织配置

```javascript
import { vEchart } from './yoya/components/echart.js';

vEchart(c => {
  c.styles({ width: '100%', height: '400px' });
  
  c.option(chart => {
    chart.title({
      text: '月度销售趋势',
      left: 'center',
    });
    
    chart.tooltip({
      trigger: 'axis',
    });
    
    chart.legend({
      data: ['2023 年', '2024 年'],
      top: '10%',
    });
    
    chart.xAxis({
      type: 'category',
      data: ['1 月', '2 月', '3 月', '4 月', '5 月', '6 月'],
    });
    
    chart.yAxis({
      type: 'value',
    });
    
    chart.series([
      {
        name: '2023 年',
        type: 'line',
        data: [820, 932, 901, 934, 1290, 1330],
      },
      {
        name: '2024 年',
        type: 'line',
        data: [920, 1032, 1001, 1034, 1390, 1430],
      },
    ]);
  });
}).bindTo('#app');
```

---

## 图表类型示例

### 柱状图

```javascript
import { vEchart } from './yoya/components/echart.js';

vEchart(c => {
  c.styles({ width: '100%', height: '400px' });
  
  c.option({
    title: { text: '柱状图示例' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['产品 A', '产品 B', '产品 C', '产品 D', '产品 E'],
    },
    yAxis: { type: 'value' },
    series: [{
      name: '销量',
      type: 'bar',
      data: [120, 200, 150, 80, 70],
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#83bff6' },
          { offset: 1, color: '#188df0' },
        ]),
      },
    }],
  });
}).bindTo('#app');
```

### 折线图

```javascript
import { vEchart } from './yoya/components/echart.js';

vEchart(c => {
  c.styles({ width: '100%', height: '400px' });
  
  c.option({
    title: { text: '折线图示例' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['邮件营销', '联盟广告', '视频广告'] },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: '邮件营销',
        type: 'line',
        data: [120, 132, 101, 134, 90, 230, 210],
        smooth: true,
      },
      {
        name: '联盟广告',
        type: 'line',
        data: [220, 182, 191, 234, 290, 330, 310],
        smooth: true,
      },
      {
        name: '视频广告',
        type: 'line',
        data: [150, 232, 201, 154, 190, 330, 410],
        smooth: true,
      },
    ],
  });
}).bindTo('#app');
```

### 饼图

```javascript
import { vEchart } from './yoya/components/echart.js';

vEchart(c => {
  c.styles({ width: '100%', height: '400px' });
  
  c.option({
    title: {
      text: '饼图示例',
      left: 'center',
    },
    tooltip: { trigger: 'item' },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [{
      name: '访问来源',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 1048, name: '搜索引擎' },
        { value: 735, name: '直接访问' },
        { value: 580, name: '邮件营销' },
        { value: 484, name: '联盟广告' },
        { value: 300, name: '视频广告' },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    }],
  });
}).bindTo('#app');
```

### 雷达图

```javascript
import { vEchart } from './yoya/components/echart.js';

vEchart(c => {
  c.styles({ width: '100%', height: '400px' });
  
  c.option({
    title: { text: '雷达图示例' },
    tooltip: {},
    legend: { data: ['预算分配', '实际开销'] },
    radar: {
      indicator: [
        { name: '销售', max: 6500 },
        { name: '管理', max: 16000 },
        { name: '信息技术', max: 30000 },
        { name: '客服', max: 38000 },
        { name: '研发', max: 52000 },
        { name: '市场', max: 25000 },
      ],
    },
    series: [{
      name: '预算 vs 开销',
      type: 'radar',
      data: [
        {
          value: [4200, 3000, 20000, 35000, 50000, 18000],
          name: '预算分配',
        },
        {
          value: [5000, 14000, 28000, 26000, 42000, 21000],
          name: '实际开销',
        },
      ],
    }],
  });
}).bindTo('#app');
```

### 散点图

```javascript
import { vEchart } from './yoya/components/echart.js';

vEchart(c => {
  c.styles({ width: '100%', height: '400px' });
  
  c.option({
    title: { text: '散点图示例' },
    tooltip: {
      trigger: 'item',
      formatter: '{a}: {c}',
    },
    xAxis: {
      scale: true,
      name: '温度 (°C)',
    },
    yAxis: {
      scale: true,
      name: '销量',
    },
    series: [{
      name: '温度 vs 销量',
      type: 'scatter',
      data: [
        [10, 220], [12, 250], [15, 280], [18, 320],
        [20, 350], [22, 380], [25, 420], [28, 450],
        [30, 480], [32, 500], [35, 520], [38, 550],
      ],
      markPoint: {
        data: [
          { type: 'max', name: '最大值' },
          { type: 'min', name: '最小值' },
        ],
      },
    }],
  });
}).bindTo('#app');
```

### 仪表盘

```javascript
import { vEchart } from './yoya/components/echart.js';

vEchart(c => {
  c.styles({ width: '100%', height: '400px' });
  
  c.option({
    title: { text: '仪表盘示例' },
    series: [{
      type: 'gauge',
      progress: {
        show: true,
      },
      detail: {
        valueAnimation: true,
        formatter: '{value}%',
      },
      data: [{
        value: 75,
        name: '完成率',
      }],
      axisLine: {
        lineStyle: {
          width: 30,
          color: [
            [0.3, '#67e0e3'],
            [0.7, '#37a2da'],
            [1, '#fd666d'],
          ],
        },
      },
    }],
  });
}).bindTo('#app');
```

---

## 图表状态管理

### 加载状态

```javascript
import { vEchart } from './yoya/components/echart.js';

const chart = vEchart(c => {
  c.styles({ width: '100%', height: '400px' });
  
  c.option({
    title: { text: '数据加载中...' },
  });
});

// 显示加载动画
chart.loading();

// 模拟异步数据加载
setTimeout(() => {
  chart.option({
    title: { text: '销售数据' },
    xAxis: { type: 'category', data: ['A', 'B', 'C', 'D'] },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: [10, 20, 30, 40] }],
  });
  
  // 隐藏加载动画
  chart.loaded();
}, 2000);
```

### 图表更新

```javascript
const chart = vEchart(c => {
  c.styles({ width: '100%', height: '400px' });
  c.option(initialOption);
});

// 更新图表数据
function updateChartData(newData) {
  const currentOption = chart.option();  // 获取当前配置
  currentOption.series[0].data = newData;
  chart.option(currentOption);  // 更新配置
}

// 完全替换配置
chart.option({
  title: { text: '新图表' },
  xAxis: { type: 'category', data: ['新数据'] },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: [100] }],
});
```

### 图表事件

```javascript
const chart = vEchart(c => {
  c.styles({ width: '100%', height: '400px' });
  c.option({
    xAxis: { type: 'category', data: ['A', 'B', 'C'] },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: [10, 20, 30] }],
  });
});

// 监听图表点击事件
chart.onChartReady((chartInstance) => {
  chartInstance.on('click', (params) => {
    console.log('点击数据点:', params);
    console.log('系列名:', params.seriesName);
    console.log('数据值:', params.value);
  });
});

// 监听图表缩放
chart.onChartReady((chartInstance) => {
  chartInstance.on('dataZoom', (params) => {
    console.log('图表缩放事件:', params);
  });
});
```

---

## 响应式图表

### 自动 resize

vEchart 组件内置 ResizeObserver，自动检测容器大小变化并重新渲染图表。

```javascript
import { vEchart } from './yoya/components/echart.js';

// 百分比宽度 - 自动适配父容器
vEchart(c => {
  c.styles({ width: '100%', height: '400px' });
  c.option({
    // 图表配置会自动响应容器大小变化
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
  });
}).bindTo('#app');
```

### 手动触发 resize

```javascript
const chart = vEchart(c => {
  c.styles({ width: '100%', height: '400px' });
  c.option(baseOption);
});

// 当容器大小变化时手动触发 resize
function onResize() {
  chart.onChartReady((chartInstance) => {
    chartInstance.resize();
  });
}

window.addEventListener('resize', onResize);
```

---

## ECharts 库配置

### 指定 ECharts 版本

```javascript
import { vEchart } from './yoya/components/echart.js';

// 如果项目中使用了自定义的 ECharts 构建
vEchart(c => {
  c.echartsLib(window.echarts);  // 使用全局 echarts 对象
  c.option(baseOption);
}).bindTo('#app');
```

---

## 完整示例

### 销售数据看板

```javascript
import { vEchart, toast } from './yoya/components/echart.js';
import { grid, flex, vCard } from './yoya/index.js';

// 创建销售趋势图
const trendChart = vEchart(c => {
  c.styles({ width: '100%', height: '300px' });
  c.option({
    title: { text: '销售趋势' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['销售额', '利润'] },
    xAxis: {
      type: 'category',
      data: ['1 月', '2 月', '3 月', '4 月', '5 月', '6 月'],
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: '销售额',
        type: 'line',
        data: [820, 932, 901, 934, 1290, 1330],
        smooth: true,
      },
      {
        name: '利润',
        type: 'line',
        data: [320, 432, 401, 434, 590, 630],
        smooth: true,
      },
    ],
  });
});

// 创建产品分类饼图
const pieChart = vEchart(c => {
  c.styles({ width: '100%', height: '300px' });
  c.option({
    title: { text: '产品分类占比' },
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: [
        { value: 1048, name: '电子产品' },
        { value: 735, name: '服装' },
        { value: 580, name: '家居' },
        { value: 484, name: '图书' },
      ],
    }],
  });
});

// 创建排行榜柱状图
const barChart = vEchart(c => {
  c.styles({ width: '100%', height: '300px' });
  c.option({
    title: { text: '商品销量 TOP10' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['商品 A', '商品 B', '商品 C', '商品 D', '商品 E'],
      axisLabel: { rotate: 45 },
    },
    yAxis: { type: 'value' },
    series: [{
      type: 'bar',
      data: [320, 280, 250, 220, 180],
      itemStyle: {
        color: '#5470c6',
      },
    }],
  });
});

// 创建仪表盘
const gaugeChart = vEchart(c => {
  c.styles({ width: '100%', height: '300px' });
  c.option({
    series: [{
      type: 'gauge',
      progress: { show: true },
      detail: { valueAnimation: true, formatter: '{value}%' },
      data: [{ value: 75, name: '目标完成率' }],
    }],
  });
});

// 网格布局
grid(g => {
  g.columns(2);
  g.gap('20px');
  
  g.div(cell1 => {
    cell1.child(vCard(c => {
      c.cardBody(trendChart);
    }));
  });
  
  g.div(cell2 => {
    cell2.child(vCard(c => {
      c.cardBody(pieChart);
    }));
  });
  
  g.div(cell3 => {
    cell3.child(vCard(c => {
      c.cardBody(barChart);
    }));
  });
  
  g.div(cell4 => {
    cell4.child(vCard(c => {
      c.cardBody(gaugeChart);
    }));
  });
}).bindTo('#app');

// 模拟数据更新
setInterval(() => {
  const newSalesData = Array.from({ length: 6 }, () => 
    Math.round(800 + Math.random() * 600)
  );
  
  trendChart.option(opt => {
    opt.series[0].data = newSalesData;
    return opt;
  });
}, 5000);
```

---

## API 速查

### vEchart

```javascript
vEchart(setup)
- echartsLib(lib)           // 设置 ECharts 库实例
- option(config)            // 设置/获取图表配置
- loading()                 // 显示加载动画
- loaded()                  // 隐藏加载动画
- onChartReady(fn)          // 图表就绪回调
- onChartResize(fn)         // 图表 resize 回调
```

### ECharts Option 常用配置

```javascript
{
  title: { text, subtext, left, top },
  tooltip: { trigger, formatter },
  legend: { data, orient, left, top },
  grid: { left, right, top, bottom, containLabel },
  xAxis: { type, data, boundaryGap },
  yAxis: { type, min, max },
  series: [
    { type: 'bar', data },      // 柱状图
    { type: 'line', data, smooth }, // 折线图
    { type: 'pie', data, radius },  // 饼图
    { type: 'scatter', data },  // 散点图
    { type: 'radar', data },    // 雷达图
    { type: 'gauge', data },    // 仪表盘
  ],
}
```

---

## 注意事项

1. **容器大小**：图表容器必须有明确的宽度和高度
2. **自动 resize**：组件内置 ResizeObserver 自动响应容器变化
3. **内存管理**：组件销毁时会自动 dispose 图表实例
4. **数据更新**：使用 `option()` 方法更新配置而非直接修改
5. **事件绑定**：通过 `onChartReady` 获取 chartInstance 后绑定事件
6. **加载状态**：异步数据加载时使用 `loading()` 和 `loaded()` 管理状态

## 常见问题

**Q: 图表不显示？**
- 检查容器是否有明确的宽高
- 确保调用了 `bindTo()` 绑定到 DOM
- 检查 ECharts 库是否正确加载

**Q: 图表变形？**
- 使用 `grid.containLabel: true` 自动计算边距
- 设置合理的容器宽高比

**Q: 数据更新后图表不刷新？**
- 确保调用 `chart.option(newConfig)` 而非直接修改配置对象
- 使用不可变模式创建新的配置对象
