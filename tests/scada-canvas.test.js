/**
 * @fileoverview ScadaCanvas 单元测试
 * 测试视口变换、图层管理、显示配置、渲染循环
 */

import { JSDOM } from 'jsdom';

// 设置 jsdom 环境
const dom = new JSDOM('<!DOCTYPE html><html><body><div id="app"></div></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
  resources: 'usable'
});

global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;
global.CanvasRenderingContext2D = class CanvasRenderingContext2D {
  save() {}
  restore() {}
  clearRect() {}
  fillRect() {}
  beginPath() {}
  moveTo() {}
  lineTo() {}
  stroke() {}
  createPattern() { return {}; }
  setLineDash() {}
};
global.HTMLCanvasElement = dom.window.HTMLCanvasElement;

// 测试断言
function assert(condition, message) {
  if (!condition) {
    throw new Error(`❌ 测试失败：${message}`);
  }
  console.log(`✅ ${message}`);
}

// 导入被测试模块
const {
  ScadaCanvas,
  Viewport,
  LayerManager,
  DisplayConfig,
  EventEmitter,
  Matrix2D
} = await import('../src/yoya/scada/index.js');

// 测试用例
const tests = {
  // ========== EventEmitter 测试 ==========
  'EventEmitter 应该订阅和触发事件': () => {
    const emitter = new EventEmitter();
    let called = false;
    let eventData = null;

    emitter.on('test', (data) => {
      called = true;
      eventData = data;
    });

    emitter.emit('test', { value: 123 });

    assert(called, 'Handler 应该被调用');
    assert(eventData.value === 123, '应该传递事件数据');
  },

  'EventEmitter 应该取消订阅': () => {
    const emitter = new EventEmitter();
    let called = false;

    const handler = () => { called = true; };
    emitter.on('test', handler);
    emitter.off('test', handler);
    emitter.emit('test');

    assert(!called, '取消订阅后不应该被调用');
  },

  'EventEmitter 应该只触发一次': () => {
    const emitter = new EventEmitter();
    let count = 0;

    emitter.once('test', () => { count++; });
    emitter.emit('test');
    emitter.emit('test');

    assert(count === 1, '应该只触发一次');
  },

  // ========== Matrix2D 测试 ==========
  'Matrix2D 应该创建单位矩阵': () => {
    const matrix = new Matrix2D();
    assert(matrix.a === 1, 'a 应该是 1');
    assert(matrix.b === 0, 'b 应该是 0');
    assert(matrix.c === 0, 'c 应该是 0');
    assert(matrix.d === 1, 'd 应该是 1');
    assert(matrix.e === 0, 'e 应该是 0');
    assert(matrix.f === 0, 'f 应该是 0');
  },

  'Matrix2D 应该平移': () => {
    const matrix = new Matrix2D().translate(100, 50);
    assert(matrix.e === 100, 'e (tx) 应该是 100');
    assert(matrix.f === 50, 'f (ty) 应该是 50');
  },

  'Matrix2D 应该缩放': () => {
    const matrix = new Matrix2D().scale(2, 3);
    assert(matrix.a === 2, 'a (sx) 应该是 2');
    assert(matrix.d === 3, 'd (sy) 应该是 3');
  },

  'Matrix2D 应该变换点': () => {
    const matrix = new Matrix2D(1, 0, 0, 1, 100, 50); // 单位矩阵 + 平移
    const point = matrix.transformPoint(10, 20);
    assert(point.x === 110, 'x 应该被变换');
    assert(point.y === 70, 'y 应该被变换');
  },

  'Matrix2D 应该相乘': () => {
    const m1 = new Matrix2D(1, 0, 0, 1, 100, 50);
    const m2 = new Matrix2D(2, 0, 0, 2, 0, 0);
    const result = m1.multiply(m2);
    assert(result.a === 2, 'a 应该相乘');
    assert(result.d === 2, 'd 应该相乘');
    assert(result.e === 200, 'e 应该变换');
    assert(result.f === 100, 'f 应该变换');
  },

  'Matrix2D 应该求逆': () => {
    const matrix = new Matrix2D(2, 0, 0, 2, 100, 50);
    const inverted = matrix.invert();
    assert(Math.abs(inverted.a - 0.5) < 0.001, 'a 应该求逆');
    assert(Math.abs(inverted.d - 0.5) < 0.001, 'd 应该求逆');
  },

  // ========== Viewport 测试 ==========
  'Viewport 应该使用默认值创建': () => {
    const viewport = new Viewport();
    assert(viewport.zoom === 1.0, '默认缩放应该是 1.0');
    assert(viewport.offsetX === 0, '默认 offsetX 应该是 0');
    assert(viewport.offsetY === 0, '默认 offsetY 应该是 0');
  },

  'Viewport 应该使用选项创建': () => {
    const viewport = new Viewport({
      zoom: 2.0,
      offsetX: 100,
      offsetY: 50,
      canvasWidth: 1920,
      canvasHeight: 1080
    });
    assert(viewport.zoom === 2.0, '缩放应该被设置');
    assert(viewport.offsetX === 100, 'offsetX 应该被设置');
    assert(viewport.offsetY === 50, 'offsetY 应该被设置');
    assert(viewport.canvasWidth === 1920, 'canvasWidth 应该被设置');
    assert(viewport.canvasHeight === 1080, 'canvasHeight 应该被设置');
  },

  'Viewport 应该设置缩放': () => {
    const viewport = new Viewport();
    viewport.setZoom(2.0);
    assert(viewport.zoom === 2.0, '缩放应该被设置');
  },

  'Viewport 应该限制缩放范围': () => {
    const viewport = new Viewport({ minZoom: 0.5, maxZoom: 5.0 });
    viewport.setZoom(0.1);
    assert(viewport.zoom === 0.5, '缩放应该限制到最小值');
    viewport.setZoom(10.0);
    assert(viewport.zoom === 5.0, '缩放应该限制到最大值');
  },

  'Viewport 应该平移': () => {
    const viewport = new Viewport({ offsetX: 100, offsetY: 50 });
    viewport.pan(10, 20);
    assert(viewport.offsetX === 110, 'offsetX 应该被平移');
    assert(viewport.offsetY === 70, 'offsetY 应该被平移');
  },

  'Viewport 应该将屏幕坐标变换为世界坐标': () => {
    const viewport = new Viewport({ zoom: 2.0, offsetX: 100, offsetY: 50 });
    const world = viewport.screenToWorld(300, 200);
    assert(world.x === 100, '世界坐标 X 应该是 (300-100)/2 = 100');
    assert(world.y === 75, '世界坐标 Y 应该是 (200-50)/2 = 75');
  },

  'Viewport 应该将世界坐标变换为屏幕坐标': () => {
    const viewport = new Viewport({ zoom: 2.0, offsetX: 100, offsetY: 50 });
    const screen = viewport.worldToScreen(100, 75);
    assert(screen.x === 300, '屏幕坐标 X 应该是 100*2+100 = 300');
    assert(screen.y === 200, '屏幕坐标 Y 应该是 75*2+50 = 200');
  },

  'Viewport 应该触发变更事件': () => {
    const viewport = new Viewport();
    let changed = false;
    viewport.on('change', () => { changed = true; });
    viewport.setZoom(2.0);
    assert(changed, '应该触发变更事件');
  },

  'Viewport 应该获取可见范围': () => {
    const viewport = new Viewport({
      zoom: 1.0,
      offsetX: 0,
      offsetY: 0,
      canvasWidth: 800,
      canvasHeight: 600
    });
    const bounds = viewport.getVisibleBounds();
    assert(bounds.minX === 0, 'minX 应该是 0');
    assert(bounds.minY === 0, 'minY 应该是 0');
    assert(bounds.maxX === 800, 'maxX 应该是 800');
    assert(bounds.maxY === 600, 'maxY 应该是 600');
  },

  // ========== LayerManager 测试 ==========
  'LayerManager 应该创建图层': () => {
    const manager = new LayerManager();
    const layer = manager.createLayer('layer1', {
      name: '测试图层',
      visible: true
    });
    assert(layer.id === 'layer1', '图层 ID 应该匹配');
    assert(layer.name === '测试图层', '图层名称应该匹配');
    assert(layer.visible === true, '图层应该可见');
  },

  'LayerManager 应该获取图层': () => {
    const manager = new LayerManager();
    manager.createLayer('layer1');
    const layer = manager.getLayer('layer1');
    assert(layer !== null, '图层应该存在');
    assert(layer.id === 'layer1', '图层 ID 应该匹配');
  },

  'LayerManager 应该删除图层': () => {
    const manager = new LayerManager();
    manager.createLayer('layer1');
    const deleted = manager.deleteLayer('layer1');
    assert(deleted !== null, '应该返回删除的图层');
    assert(manager.getLayer('layer1') === null, '图层应该被移除');
  },

  'LayerManager 应该设置图层可见性': () => {
    const manager = new LayerManager();
    manager.createLayer('layer1', { visible: true });
    manager.setLayerVisibility('layer1', false);
    const layer = manager.getLayer('layer1');
    assert(layer.visible === false, '可见性应该被更新');
  },

  'LayerManager 应该设置活动图层': () => {
    const manager = new LayerManager();
    manager.createLayer('layer1');
    manager.createLayer('layer2');
    manager.setActiveLayer('layer2');
    assert(manager.activeLayerId === 'layer2', '活动图层应该被更新');
  },

  'LayerManager 应该获取可见图层': () => {
    const manager = new LayerManager();
    manager.createLayer('layer1', { visible: true });
    manager.createLayer('layer2', { visible: false });
    manager.createLayer('layer3', { visible: true });
    const visible = manager.getVisibleLayers();
    assert(visible.length === 2, '应该有 2 个可见图层');
  },

  'LayerManager 应该重新排序图层': () => {
    const manager = new LayerManager();
    manager.createLayer('layer1', { order: 0 });
    manager.createLayer('layer2', { order: 1 });
    manager.createLayer('layer3', { order: 2 });
    manager.reorderLayer('layer3', 0);
    assert(manager.layerOrder[0] === 'layer3', '图层应该被重新排序');
  },

  'LayerManager 应该序列化为 JSON': () => {
    const manager = new LayerManager();
    manager.createLayer('layer1', { name: 'Layer 1', visible: true });
    const json = manager.toJSON();
    assert(json.layers.length === 1, 'JSON 中应该有 1 个图层');
    assert(json.layers[0].id === 'layer1', '图层 ID 应该匹配');
  },

  // ========== DisplayConfig 测试 ==========
  'DisplayConfig 应该使用默认值创建': () => {
    const config = new DisplayConfig();
    assert(config.get('grid.enabled') === false, '默认 grid.enabled');
    assert(config.get('grid.size') === 20, '默认 grid.size');
    assert(config.get('rulers.enabled') === false, '默认 rulers.enabled');
    assert(config.get('rulers.width') === 30, '默认 rulers.width');
  },

  'DisplayConfig 应该使用自定义默认值创建': () => {
    const config = new DisplayConfig({
      grid: { enabled: true, size: 50 },
      rulers: { enabled: true }
    });
    assert(config.get('grid.enabled') === true, '自定义 grid.enabled');
    assert(config.get('grid.size') === 50, '自定义 grid.size');
    assert(config.get('rulers.enabled') === true, '自定义 rulers.enabled');
  },

  'DisplayConfig 应该设置嵌套值': () => {
    const config = new DisplayConfig();
    config.set('grid.enabled', true);
    config.set('grid.size', 100);
    assert(config.get('grid.enabled') === true, '值应该被设置');
    assert(config.get('grid.size') === 100, '值应该被设置');
  },

  'DisplayConfig 应该触发变更事件': () => {
    const config = new DisplayConfig();
    let changed = false;
    let changedPath = null;
    config.on('change', (path) => {
      changed = true;
      changedPath = path;
    });
    config.set('grid.enabled', true);
    assert(changed, '应该触发变更事件');
    assert(changedPath === 'grid.enabled', '应该传递变更路径');
  },

  'DisplayConfig 应该切换布尔值': () => {
    const config = new DisplayConfig({ grid: { enabled: false } });
    config.toggle('grid.enabled');
    assert(config.get('grid.enabled') === true, '应该切换到 true');
    config.toggle('grid.enabled');
    assert(config.get('grid.enabled') === false, '应该切换到 false');
  },

  'DisplayConfig 应该获取所有配置': () => {
    const config = new DisplayConfig();
    const all = config.getAll();
    assert(typeof all === 'object', '应该返回对象');
    assert('grid' in all, '应该有 grid');
    assert('rulers' in all, '应该有 rulers');
  },

  'DisplayConfig 应该序列化为 JSON': () => {
    const config = new DisplayConfig();
    config.set('grid.enabled', true);
    const json = config.toJSON();
    assert(json.grid.enabled === true, 'JSON 应该反映变更');
  },

  // ========== 集成测试 ==========
  '应该创建 ScadaCanvas 实例': () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;

    const scadaCanvas = new ScadaCanvas(canvas, {
      zoom: 1.0,
      defaults: {
        grid: { enabled: true },
        rulers: { enabled: true }
      }
    });

    assert(scadaCanvas !== null, 'ScadaCanvas 应该被创建');
    assert(scadaCanvas.viewport.zoom === 1.0, 'Viewport 应该被初始化');
    assert(scadaCanvas.displayConfig.get('grid.enabled') === true, '配置应该被设置');
    assert(scadaCanvas.layerManager !== null, 'LayerManager 应该被初始化');

    scadaCanvas.destroy();
  },

  '应该注册渲染器': () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;

    const scadaCanvas = new ScadaCanvas(canvas);
    const renderer = {
      render: (ctx, viewport, config) => {}
    };

    scadaCanvas.registerRenderer('test', renderer);
    assert(scadaCanvas._renderers.has('test'), '渲染器应该被注册');

    scadaCanvas.unregisterRenderer('test');
    assert(!scadaCanvas._renderers.has('test'), '渲染器应该被取消注册');

    scadaCanvas.destroy();
  },

  '应该序列化和恢复': () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;

    const scadaCanvas = new ScadaCanvas(canvas);
    scadaCanvas.setConfig('grid.enabled', true);
    scadaCanvas.setConfig('grid.size', 50);
    scadaCanvas.viewport.setZoom(2.0);

    const json = scadaCanvas.toJSON();
    scadaCanvas.fromJSON(json);

    assert(scadaCanvas.displayConfig.get('grid.enabled') === true, '配置应该被恢复');
    assert(scadaCanvas.displayConfig.get('grid.size') === 50, '配置应该被恢复');
    assert(scadaCanvas.viewport.zoom === 2.0, 'Viewport 应该被恢复');

    scadaCanvas.destroy();
  }
};

// 运行测试
console.log('\n🧪 运行 ScadaCanvas 单元测试...\n');

let passed = 0;
let failed = 0;

for (const [name, testFn] of Object.entries(tests)) {
  try {
    testFn();
    passed++;
  } catch (error) {
    failed++;
    console.error(`❌ ${name}`);
    console.error(`   ${error.message}`);
  }
}

console.log(`\n${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}
