/**
 * Yoya.Basic V2 - ECharts 图表演示页面
 * 展示 VEchart 组件的各种功能和用法
 */

import {
  div, span, vstack, hstack, flex, grid, responsiveGrid,
  vEchart,
  vButton, vCard, vCardHeader, vCardBody,
  toast
} from '../../../../yoya/index.js';
import { AppShell } from '../../framework/AppShell.js';
import { CodeDemo } from '../../components/CodeDemo.js';
import { DocSection } from '../../components/DocSection.js';
import { PageHeader } from '../../components/PageHeader.js';
import { ApiTable } from '../../components/ApiTable.js';

// 存储图表实例引用
const chartRefs = {};

/**
 * 创建柱状图演示
 */
function createBarChart() {
  return vEchart(chart => {
    chart.echartsLib(window.echarts);
    chart.height('300px');
    chart.option({
      title: { text: '销售统计', left: 'center', top: 10 },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      },
      yAxis: { type: 'value' },
      series: [{
        type: 'bar',
        data: [120, 200, 150, 80, 70, 110, 130],
        itemStyle: {
          color: new window.echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#667eea' },
            { offset: 1, color: '#764ba2' }
          ]),
          borderRadius: [4, 4, 0, 0]
        }
      }]
    });
    chart.onChartReady(instance => {
      chartRefs.bar = instance;
    });
  });
}

/**
 * 创建折线图演示
 */
function createLineChart() {
  return vEchart(chart => {
    chart.echartsLib(window.echarts);
    chart.height('300px');
    chart.option({
      title: { text: '温度趋势', left: 'center', top: 10 },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      },
      yAxis: { type: 'value' },
      series: [{
        type: 'line',
        smooth: true,
        data: [15, 18, 20, 17, 22, 19, 16],
        itemStyle: { color: '#28a745' },
        areaStyle: { opacity: 0.3 }
      }]
    });
    chart.onChartReady(instance => {
      chartRefs.line = instance;
    });
  });
}

/**
 * 创建饼图演示
 */
function createPieChart() {
  return vEchart(chart => {
    chart.echartsLib(window.echarts);
    chart.height('300px');
    chart.option({
      title: { text: '市场份额', left: 'center', top: 10 },
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      legend: { orient: 'vertical', left: 'left', top: 'middle' },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        data: [
          { value: 1048, name: '搜索引擎', itemStyle: { color: '#667eea' } },
          { value: 735, name: '直接访问', itemStyle: { color: '#764ba2' } },
          { value: 580, name: '邮件营销', itemStyle: { color: '#f56c6c' } },
          { value: 484, name: '联盟广告', itemStyle: { color: '#f093fb' } },
          { value: 300, name: '视频广告', itemStyle: { color: '#409eff' } }
        ]
      }]
    });
    chart.onChartReady(instance => {
      chartRefs.pie = instance;
    });
  });
}

/**
 * 创建雷达图演示
 */
function createRadarChart() {
  return vEchart(chart => {
    chart.echartsLib(window.echarts);
    chart.height('300px');
    chart.option({
      title: { text: '能力雷达图', left: 'center', top: 10 },
      tooltip: {},
      radar: {
        indicator: [
          { name: '销售', max: 100 },
          { name: '管理', max: 100 },
          { name: '技术', max: 100 },
          { name: '客服', max: 100 },
          { name: '研发', max: 100 }
        ],
        radius: '65%'
      },
      series: [{
        type: 'radar',
        data: [
          {
            value: [85, 90, 75, 80, 95],
            name: '团队 A',
            areaStyle: { color: 'rgba(102, 126, 234, 0.5)' },
            itemStyle: { color: '#667eea' }
          },
          {
            value: [70, 75, 90, 85, 80],
            name: '团队 B',
            areaStyle: { color: 'rgba(245, 108, 108, 0.5)' },
            itemStyle: { color: '#f56c6c' }
          }
        ]
      }]
    });
    chart.onChartReady(instance => {
      chartRefs.radar = instance;
    });
  });
}

/**
 * 创建仪表盘演示
 */
function createGaugeChart() {
  return vEchart(chart => {
    chart.echartsLib(window.echarts);
    chart.height('300px');
    chart.option({
      title: { text: '业绩完成率', left: 'center', top: '70%' },
      series: [{
        type: 'gauge',
        progress: {
          show: true,
          width: 18,
          itemStyle: {
            color: new window.echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#667eea' },
              { offset: 1, color: '#764ba2' }
            ])
          }
        },
        axisLine: { lineStyle: { width: 18 } },
        axisTick: { show: false },
        splitLine: { length: 15, lineStyle: { width: 2, color: '#999' } },
        anchor: { show: true, showAbove: true, size: 25 },
        detail: {
          valueAnimation: true,
          fontSize: 30,
          offsetCenter: [0, '-20%'],
          formatter: '{value}%'
        },
        data: [{ value: 75, name: '完成度' }]
      }]
    });
    chart.onChartReady(instance => {
      chartRefs.gauge = instance;
    });
  });
}

/**
 * 创建散点图演示
 */
function createScatterChart() {
  return vEchart(chart => {
    chart.echartsLib(window.echarts);
    chart.height('300px');
    chart.option({
      title: { text: '用户分布', left: 'center', top: 10 },
      tooltip: {
        formatter: (param) => `年龄：${param.data[0]}<br/>收入：${param.data[1]}k`
      },
      xAxis: { name: '年龄', type: 'value', min: 0, max: 60 },
      yAxis: { name: '收入 (k)', type: 'value', min: 0, max: 100 },
      series: [{
        type: 'scatter',
        symbolSize: (data) => Math.sqrt(data[1]) * 3,
        data: [
          [25, 30], [30, 45], [35, 55], [28, 38], [40, 70],
          [45, 80], [32, 50], [38, 60], [22, 25], [50, 85]
        ],
        itemStyle: {
          color: new window.echarts.graphic.LinearGradient(0, 0, 1, 1, [
            { offset: 0, color: '#667eea' },
            { offset: 1, color: '#764ba2' }
          ])
        }
      }]
    });
    chart.onChartReady(instance => {
      chartRefs.scatter = instance;
    });
  });
}

/**
 * 创建操作工具栏
 */
function createToolbar() {
  return div(toolbar => {
    toolbar.styles({
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap',
      marginBottom: '20px'
    });

    toolbar.child(vButton(btn => {
      btn.text('🔄 更新数据');
      btn.type('primary');
      btn.onClick(() => updateAllData());
    }));

    toolbar.child(vButton(btn => {
      btn.text('⏳ 显示加载');
      btn.type('success');
      btn.onClick(() => showAllLoading());
    }));

    toolbar.child(vButton(btn => {
      btn.text('✅ 隐藏加载');
      btn.onClick(() => hideAllLoading());
    }));

    toolbar.child(vButton(btn => {
      btn.text('🗑️ 清空图表');
      btn.type('danger');
      btn.onClick(() => clearAllCharts());
    }));

    toolbar.child(vButton(btn => {
      btn.text('📷 导出图表');
      btn.type('default');
      btn.onClick(() => exportCharts());
    }));
  });
}

/**
 * 更新所有图表数据
 */
function updateAllData() {
  Object.entries(chartRefs).forEach(([name, chart]) => {
    if (chart && !chart.isDisposed()) {
      const option = chart.getOption();
      if (option && option.series) {
        option.series.forEach(series => {
          if (series.data && Array.isArray(series.data)) {
            series.data = series.data.map(item => {
              if (Array.isArray(item)) {
                return item.map((v, i) => typeof v === 'number' ? Math.floor(Math.random() * 200) + 50 : v);
              }
              if (item && typeof item === 'object' && item.value !== undefined) {
                if (Array.isArray(item.value)) {
                  item.value = item.value.map(v => typeof v === 'number' ? Math.floor(Math.random() * 100) : v);
                } else {
                  item.value = Math.floor(Math.random() * 1000);
                }
                return item;
              }
              return typeof item === 'number' ? Math.floor(Math.random() * 200) + 50 : item;
            });
          }
        });
        chart.setOption(option, true);
      }
    }
  });
  toast.success('数据已更新');
}

/**
 * 显示所有加载
 */
function showAllLoading() {
  Object.values(chartRefs).forEach(chart => {
    if (chart && !chart.isDisposed()) {
      chart.showLoading({ text: '加载中...', color: '#667eea' });
    }
  });
}

/**
 * 隐藏所有加载
 */
function hideAllLoading() {
  Object.values(chartRefs).forEach(chart => {
    if (chart && !chart.isDisposed()) {
      chart.hideLoading();
    }
  });
}

/**
 * 清空所有图表
 */
function clearAllCharts() {
  Object.values(chartRefs).forEach(chart => {
    if (chart && !chart.isDisposed()) {
      chart.clear();
    }
  });
  toast.warning('图表已清空');
}

/**
 * 导出图表
 */
function exportCharts() {
  Object.entries(chartRefs).forEach(([name, chart]) => {
    if (chart && !chart.isDisposed()) {
      const url = chart.getDataURL({ type: 'png', pixelRatio: 2, backgroundColor: '#fff' });
      const a = document.createElement('a');
      a.href = url;
      a.download = `echart-${name}.png`;
      a.click();
    }
  });
  toast.success('图表已导出');
}

/**
 * 创建图表卡片
 */
function createChartCard(title, chart, code) {
  return vCard(card => {
    card.vCardHeader(h => {
      h.styles({ display: 'flex', justifyContent: 'space-between', alignItems: 'center' });
      h.div(title);
    });
    card.vCardBody(body => {
      body.styles({ padding: 0 });
      body.child(div(p => {
        p.styles({ padding: '16px' });
        p.child(chart);
      }));
    });
  });
}

/**
 * 创建首页内容
 */
export function createEchartPage() {
  const tocItems = [
    { text: '基础用法', href: '#basic', level: 1 },
    { text: '图表类型', href: '#types', level: 1 },
    { text: '代码示例', href: '#examples', level: 1 },
    { text: 'API', href: '#api', level: 1 },
  ];

  return AppShell({
    currentPage: 'echart.html',
    tocItems,
    content: (content) => {
      content.child(PageHeader({
        title: 'ECharts 图表',
        description: 'VEchart 组件提供 ECharts 图表库的集成，支持柱状图、折线图、饼图、雷达图、散点图、仪表盘等多种图表类型。',
      }));

      // 工具栏
      content.child(div(p => {
        p.styles({ marginBottom: '24px' });
        p.child(createToolbar());
      }));

      // 基础用法
      content.child(DocSection('basic', '基础用法', [
        CodeDemo('创建柱状图',
          createBarChart(),
          `import { vEchart } from 'yoya-basic';
import * as echarts from 'echarts';

vEchart(chart => {
  chart.echartsLib(echarts);
  chart.option({
    xAxis: { type: 'category', data: ['A', 'B', 'C'] },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: [10, 20, 30] }]
  });
});`
        ),
      ]));

      // 图表类型展示
      content.child(DocSection('types', '图表类型', [
        responsiveGrid(g => {
          g.minSize('400px');
          g.gap('20px');

          g.child(createChartCard('📊 柱状图', createBarChart()));
          g.child(createChartCard('📈 折线图', createLineChart()));
          g.child(createChartCard('🥧 饼图', createPieChart()));
          g.child(createChartCard('🎯 雷达图', createRadarChart()));
          g.child(createChartCard('🎛️ 仪表盘', createGaugeChart()));
          g.child(createChartCard('⚬ 散点图', createScatterChart()));
        }),
      ]));

      // 代码示例
      content.child(DocSection('examples', '代码示例', [
        CodeDemo('折线图',
          createLineChart(),
          `// 平滑折线图
vEchart(chart => {
  chart.echartsLib(echarts);
  chart.option({
    title: { text: '温度趋势' },
    xAxis: { type: 'category', data: ['周一', '周二', ...] },
    yAxis: { type: 'value' },
    series: [{
      type: 'line',
      smooth: true,
      areaStyle: { opacity: 0.3 },
      data: [15, 18, 20, 17, 22]
    }]
  });
});`
        ),

        CodeDemo('饼图',
          createPieChart(),
          `// 环形饼图
vEchart(chart => {
  chart.echartsLib(echarts);
  chart.option({
    title: { text: '市场份额' },
    tooltip: { formatter: '{b}: {c} ({d}%)' },
    legend: { orient: 'vertical', left: 'left' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: [
        { value: 1048, name: '搜索引擎' },
        { value: 735, name: '直接访问' }
      ]
    }]
  });
});`
        ),

        CodeDemo('雷达图',
          createRadarChart(),
          `// 能力雷达图
vEchart(chart => {
  chart.echartsLib(echarts);
  chart.option({
    radar: {
      indicator: [
        { name: '销售', max: 100 },
        { name: '管理', max: 100 }
      ]
    },
    series: [{
      type: 'radar',
      data: [
        { value: [85, 90, 75, 80, 95], name: '团队 A' }
      ]
    }]
  });
});`
        ),

        CodeDemo('仪表盘',
          createGaugeChart(),
          `// 仪表盘
vEchart(chart => {
  chart.echartsLib(echarts);
  chart.option({
    series: [{
      type: 'gauge',
      progress: { show: true, width: 18 },
      detail: { formatter: '{value}%' },
      data: [{ value: 75 }]
    }]
  });
});`
        ),
      ]));

      // API
      content.child(DocSection('api', 'API', [
        ApiTable([
          { name: 'echartsLib(lib)', desc: '设置 ECharts 库实例', type: 'function', default: '-' },
          { name: 'option(opt)', desc: '设置图表配置项', type: 'function', default: '-' },
          { name: 'width(val)', desc: '设置图表宽度', type: 'function', default: "'100%'" },
          { name: 'height(val)', desc: '设置图表高度', type: 'function', default: "'400px'" },
          { name: 'theme(val)', desc: '设置图表主题', type: 'function', default: 'null' },
          { name: 'renderer(val)', desc: '设置渲染器类型 (canvas/svg)', type: 'function', default: "'canvas'" },
          { name: 'autoResize(auto)', desc: '是否自动响应容器大小', type: 'function', default: 'true' },
          { name: 'loading(bool, text)', desc: '设置加载状态', type: 'function', default: 'false' },
          { name: 'onChartReady(fn)', desc: '注册图表就绪回调', type: 'function', default: '-' },
          { name: 'getChartInstance()', desc: '获取 ECharts 实例', type: 'function', default: '-' },
          { name: 'resize(opts)', desc: '更新图表大小', type: 'function', default: '-' },
          { name: 'clear()', desc: '清空图表', type: 'function', default: '-' },
          { name: 'dispose()', desc: '释放图表实例', type: 'function', default: '-' },
        ]),
      ]));
    },
  });
}
