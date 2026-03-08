# Yoya.Echart - ECharts 集成组件

用于在 Yoya.Basic 中使用 ECharts 图表库的集成组件。

## 安装

业务项目需要先安装 ECharts：

```bash
npm install echarts
```

## 使用方式

### 1. 从源码导入（开发环境）

```javascript
import { vEchart, VEchart } from './src/yoya/index.js';
import * as echarts from 'echarts';

// 使用工厂函数
vEchart(chart => {
  chart.echartsLib(echarts);
  chart.option({
    title: { text: '销售统计' },
    xAxis: { type: 'category', data: ['周一', '周二', '周三'] },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: [10, 20, 30] }]
  });
  chart.onChartReady((instance) => {
    console.log('图表已就绪');
  });
});
```

### 2. 从打包文件导入（生产环境）

```javascript
import { vEchart } from './dist/yoya.echart.esm.js';
import * as echarts from 'echarts';

vEchart(chart => {
  chart.echartsLib(echarts);
  chart.option({ /* 配置项 */ });
});
```

### 3. 使用 npm 包导入（发布后）

```javascript
import { vEchart } from 'yoya-basic/echart';
import * as echarts from 'echarts';
```

## API 文档

### VEchart 类

#### 方法

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `echartsLib(lib)` | `lib: EChartsLib` | `this` | 设置 ECharts 库实例 |
| `option(opt)` | `opt: EChartsOption` | `this` | 设置图表配置项 |
| `width(val)` | `val: string` | `this` | 设置图表宽度 |
| `height(val)` | `val: string` | `this` | 设置图表高度 |
| `theme(val)` | `val: string \| null` | `this` | 设置图表主题（'dark', 'light' 或自定义） |
| `renderer(val)` | `val: 'canvas' \| 'svg'` | `this` | 设置渲染器类型 |
| `devicePixelRatio(val)` | `val: number` | `this` | 设置设备像素比 |
| `autoResize(auto)` | `auto: boolean` | `this` | 是否自动响应容器大小变化 |
| `loading(loading, text)` | `loading: boolean, text?: string` | `this` | 设置加载状态 |
| `onChartReady(callback)` | `callback: (instance) => void` | `this` | 注册图表就绪回调 |
| `onChartResize(callback)` | `callback: (size) => void` | `this` | 注册图表大小变化回调 |
| `getChartInstance()` | - | `EChartsInstance \| null` | 获取 ECharts 实例 |
| `resize(opts)` | `opts?: { width?, height? }` | `this` | 更新图表大小 |
| `clear()` | - | `this` | 清空图表 |
| `dispose()` | - | `this` | 释放图表实例 |
| `destroy()` | - | `void` | 销毁图表 |

## 完整示例

### 柱状图

```javascript
import { vEchart } from './src/yoya/index.js';
import * as echarts from 'echarts';

vEchart(chart => {
  chart.echartsLib(echarts);
  chart.height('400px');
  chart.option({
    title: { text: '月度销售', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['1 月', '2 月', '3 月', '4 月', '5 月', '6 月']
    },
    yAxis: { type: 'value' },
    series: [{
      type: 'bar',
      data: [120, 200, 150, 80, 70, 110],
      itemStyle: { color: '#5470c6' }
    }]
  });
});
```

### 折线图

```javascript
vEchart(chart => {
  chart.echartsLib(echarts);
  chart.option({
    title: { text: '温度趋势' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五'] },
    yAxis: { type: 'value' },
    series: [{
      type: 'line',
      smooth: true,
      data: [15, 18, 20, 17, 22]
    }]
  });
});
```

### 饼图

```javascript
vEchart(chart => {
  chart.echartsLib(echarts);
  chart.option({
    title: { text: '市场份额' },
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [{
      type: 'pie',
      radius: '50%',
      data: [
        { value: 1048, name: '搜索引擎' },
        { value: 735, name: '直接访问' },
        { value: 580, name: '邮件营销' }
      ]
    }]
  });
});
```

### 动态更新

```javascript
const chart = vEchart(c => {
  c.echartsLib(echarts);
  c.option({ /* 初始配置 */ });
});

// 更新数据
chart.getChartInstance().setOption({
  series: [{ data: [100, 200, 300, 400, 500] }]
});

// 显示加载动画
chart.loading(true, '数据加载中...');

// 隐藏加载动画
chart.loading(false);
```

### 主题切换

```javascript
// 使用暗色主题
vEchart(chart => {
  chart.echartsLib(echarts);
  chart.theme('dark');
  chart.option({ /* 配置项 */ });
});

// 自定义主题
const customTheme = {
  color: ['#5470c6', '#91cc75', '#fac858'],
  backgroundColor: '#1a1a2e'
};

vEchart(chart => {
  chart.echartsLib(echarts);
  chart.theme(customTheme);
  chart.option({ /* 配置项 */ });
});
```

## 打包

使用以下命令打包生成 `yoya.echart.esm.js`：

```bash
npm run build:echart
```

输出文件：
- `dist/yoya.echart.esm.js` - ESM 格式打包文件
- `dist/yoya.echart.esm.js.map` - Source map 文件

## 注意事项

1. **必须提供 ECharts 库**：组件本身不包含 ECharts，需要业务项目自行引入
2. **echartsLib 必须先调用**：在使用 `option()` 等方法前，必须先调用 `echartsLib()` 设置 ECharts 实例
3. **DOM 就绪后初始化**：图表会在 `renderDom()` 或 `bindTo()` 调用后才真正初始化
4. **内存管理**：不再使用的图表应调用 `dispose()` 或 `destroy()` 释放资源

## 文件结构

```
src/yoya/
├── components/
│   └── echart.js       # VEchart 组件实现
├── yoya.echart.js      # Echart 模块入口
└── yoya.echart.d.ts    # TypeScript 类型声明

dist/
└── yoya.echart.esm.js  # 打包后的 ESM 文件

rollup.echart.config.js # Rollup 打包配置
```
