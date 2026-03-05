/**
 * Yoya.Basic - 多类型状态值演示
 * 演示 boolean、string、number 多种状态值类型的使用
 */

import {
  div, button, h1, p, section, pre, code,
  vMenu, vMenuItem
} from '../yoya/index.js';

// ============================================
// 演示页面样式
// ============================================

const pageStyles = {
  body: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '40px 20px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  sectionTitle: {
    color: '#333',
    borderBottom: '2px solid #667eea',
    paddingBottom: '10px',
    marginBottom: '20px'
  },
  demoBox: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  button: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  codeBlock: {
    background: '#2d2d2d',
    color: '#f8f8f2',
    padding: '16px',
    borderRadius: '6px',
    overflow: 'auto',
    fontSize: '13px',
    marginTop: '16px'
  },
  stateDisplay: {
    background: '#f5f5f5',
    padding: '12px',
    borderRadius: '6px',
    fontFamily: 'monospace',
    fontSize: '13px',
    marginTop: '12px'
  }
};

const buttonStyles = {
  primary: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white'
  },
  success: {
    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
    color: 'white'
  },
  error: {
    background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
    color: 'white'
  }
};

// ============================================
// 演示模块 1: Boolean 状态
// ============================================

function createBooleanDemo() {
  return section(section => {
    section.h2(h2 => {
      h2.text('1. Boolean 状态（开关型）');
      h2.styles(pageStyles.sectionTitle);
    });

    section.div(card => {
      card.styles(pageStyles.demoBox);

      card.p(p => {
        p.text('Boolean 状态用于开关型控制，如 disabled、active、selected 等：');
        p.styles({ marginBottom: '16px', color: '#666' });
      });

      // 菜单示例
      card.menu(menuEl => {
        menuEl.id('boolean-menu');
        menuEl.bordered();
        menuEl.style('width', '250px');

        const item1 = menuEl.item('项目 1（可切换禁用）', item => {
          item.id('bool-item-1');
        });

        const item2 = menuEl.item('项目 2（初始禁用）', item => {
          item.id('bool-item-2');
          item.disabled();
        });

        menuEl.divider();

        const item3 = menuEl.item('项目 3', item => {
          item.id('bool-item-3');
        });
      });

      card.div(btnGroup => {
        btnGroup.styles(pageStyles.buttonGroup);
        btnGroup.style('marginTop', '16px');

        // 切换禁用
        btnGroup.button(btn => {
          btn.styles({ ...pageStyles.button, ...buttonStyles.primary });
          btn.text('切换项目 1 禁用');
          btn.on('click', () => {
            const item = document.getElementById('bool-item-1');
            if (item && item._stateMachine) {
              const isDisabled = item.hasState('disabled');
              item.setState('disabled', !isDisabled);
              updateStateDisplay('boolean-display', item.getAllStates());
            }
          });
        });

        // 启用项目 2
        btnGroup.button(btn => {
          btn.styles({ ...pageStyles.button, ...buttonStyles.success });
          btn.text('启用项目 2');
          btn.on('click', () => {
            const item = document.getElementById('bool-item-2');
            if (item && item._stateMachine) {
              item.setState('disabled', false);
              updateStateDisplay('boolean-display', item.getAllStates());
            }
          });
        });

        // 切换激活
        btnGroup.button(btn => {
          btn.styles({ ...pageStyles.button, ...buttonStyles.error });
          btn.text('切换项目 3 激活');
          btn.on('click', () => {
            const item = document.getElementById('bool-item-3');
            if (item && item._stateMachine) {
              const isActive = item.hasState('active');
              item.setState('active', !isActive);
              updateStateDisplay('boolean-display', item.getAllStates());
            }
          });
        });
      });

      // 状态显示
      card.div(display => {
        display.id('boolean-display');
        display.styles(pageStyles.stateDisplay);
        display.text('状态：{ disabled: false, active: false }');
      });

      // 源码
      card.pre(pre => {
        pre.styles(pageStyles.codeBlock);
        pre.code(c => {
          c.text(`// Boolean 状态 - 开关型控制
// 注册状态属性（默认 boolean 类型）
this.registerStateAttrs('disabled', 'active', 'selected');

// 设置状态
menuItem.setState('disabled', true);   // 禁用
menuItem.setState('disabled', false);  // 启用
menuItem.setState('active', true);     // 激活

// 获取状态
const isDisabled = menuItem.hasState('disabled');
const isActive = menuItem.hasState('active');

// 或者使用快捷方法
menuItem.setState('disabled', !menuItem.hasState('disabled'));`);
        });
      });
    });
  });
}

// ============================================
// 演示模块 2: String 状态
// ============================================

function createStringDemo() {
  // 创建一个支持 string 状态的自定义组件
  class StatefulButton extends Tag {
    constructor(setup = null) {
      super('button', null);

      // 注册混合类型状态：boolean 和 string
      this.registerStateAttrs(
        'disabled',  // boolean（默认）
        { size: 'string' },
        { variant: 'string' },
        { loadingText: 'string' }
      );

      // 注册状态处理器
      this._registerHandlers();

      // 基础样式
      this.styles({
        padding: '10px 20px',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'all 0.2s'
      });

      // 初始化状态
      this.initializeStates({
        disabled: false,
        size: 'medium',
        variant: 'default',
        loadingText: '加载中...'
      });

      if (setup) this.setup(setup);
    }

    _registerHandlers() {
      // size 状态处理器
      this.registerStateHandler('size', (value, host) => {
        const sizes = {
          small: { padding: '6px 12px', fontSize: '12px' },
          medium: { padding: '10px 20px', fontSize: '14px' },
          large: { padding: '14px 28px', fontSize: '16px' }
        };
        host.styles(sizes[value] || sizes.medium);
      });

      // variant 状态处理器
      this.registerStateHandler('variant', (value, host) => {
        const variants = {
          default: { background: '#667eea', color: 'white' },
          success: { background: '#28a745', color: 'white' },
          danger: { background: '#dc3545', color: 'white' },
          warning: { background: '#ffc107', color: '#333' }
        };
        host.styles(variants[value] || variants.default);
      });

      // disabled 状态处理器
      this.registerStateHandler('disabled', (value, host) => {
        host.styles({
          opacity: value ? '0.5' : '1',
          cursor: value ? 'not-allowed' : 'pointer',
          pointerEvents: value ? 'none' : 'auto'
        });
      });
    }

    // 快捷方法
    size(value) {
      return this.setState('size', value);
    }

    variant(value) {
      return this.setState('variant', value);
    }

    loadingText(value) {
      return this.setState('loadingText', value);
    }

    getSize() {
      return this.getStringState('size');
    }

    getVariant() {
      return this.getStringState('variant');
    }
  }

  function statefulButton(setup = null) {
    return new StatefulButton(setup);
  }

  return section(section => {
    section.h2(h2 => {
      h2.text('2. String 状态（枚举型）');
      h2.styles(pageStyles.sectionTitle);
    });

    section.div(card => {
      card.styles(pageStyles.demoBox);

      card.p(p => {
        p.text('String 状态用于枚举型控制，如 size、variant、status 等：');
        p.styles({ marginBottom: '16px', color: '#666' });
      });

      // 演示按钮
      card.div(btnWrap => {
        btnWrap.styles({ marginBottom: '20px' });

        const btn = statefulButton();
        btn.id('string-demo-btn');
        btn.text('状态按钮');
        btnWrap.child(btn);
      });

      card.div(btnGroup => {
        btnGroup.styles(pageStyles.buttonGroup);
        btnGroup.style('marginTop', '16px');

      // 设置尺寸
        btnGroup.button(btn => {
          btn.styles({ ...pageStyles.button, ...buttonStyles.primary });
          btn.text('尺寸：Small');
          btn.on('click', () => {
            const btn = document.getElementById('string-demo-btn');
            if (btn && btn._stateMachine) {
              btn._stateMachine.setState('size', 'small');
              updateStateDisplay('string-display', btn.getAllStates());
            }
          });
        });

        btnGroup.button(btn => {
          btn.styles({ ...pageStyles.button, ...buttonStyles.primary });
          btn.text('尺寸：Medium');
          btn.on('click', () => {
            const btn = document.getElementById('string-demo-btn');
            if (btn && btn._stateMachine) {
              btn._stateMachine.setState('size', 'medium');
              updateStateDisplay('string-display', btn.getAllStates());
            }
          });
        });

        btnGroup.button(btn => {
          btn.styles({ ...pageStyles.button, ...buttonStyles.primary });
          btn.text('尺寸：Large');
          btn.on('click', () => {
            const btn = document.getElementById('string-demo-btn');
            if (btn && btn._stateMachine) {
              btn._stateMachine.setState('size', 'large');
              updateStateDisplay('string-display', btn.getAllStates());
            }
          });
        });
      });

      card.div(btnGroup => {
        btnGroup.styles(pageStyles.buttonGroup);
        btnGroup.style('marginTop', '12px');

        // 设置变体
        btnGroup.button(btn => {
          btn.styles({ ...pageStyles.button, ...buttonStyles.success });
          btn.text('变体：Success');
          btn.on('click', () => {
            const btn = document.getElementById('string-demo-btn');
            if (btn && btn._stateMachine) {
              btn._stateMachine.setState('variant', 'success');
              updateStateDisplay('string-display', btn.getAllStates());
            }
          });
        });

        btnGroup.button(btn => {
          btn.styles({ ...pageStyles.button, ...buttonStyles.error });
          btn.text('变体：Danger');
          btn.on('click', () => {
            const btn = document.getElementById('string-demo-btn');
            if (btn && btn._stateMachine) {
              btn._stateMachine.setState('variant', 'danger');
              updateStateDisplay('string-display', btn.getAllStates());
            }
          });
        });

        btnGroup.button(btn => {
          btn.styles({ ...pageStyles.button, background: '#ffc107', color: '#333' });
          btn.text('变体：Warning');
          btn.on('click', () => {
            const btn = document.getElementById('string-demo-btn');
            if (btn && btn._stateMachine) {
              btn._stateMachine.setState('variant', 'warning');
              updateStateDisplay('string-display', btn.getAllStates());
            }
          });
        });
      });

      // 状态显示
      card.div(display => {
        display.id('string-display');
        display.styles(pageStyles.stateDisplay);
        display.text('状态：{ size: "medium", variant: "default", disabled: false }');
      });

      // 源码
      card.pre(pre => {
        pre.styles(pageStyles.codeBlock);
        pre.code(c => {
          c.text(`// String 状态 - 枚举型控制
// 注册状态时指定类型
this.registerStateAttrs(
  'disabled',  // boolean（默认）
  { size: 'string' },
  { variant: 'string' }
);

// 设置状态值
button.setState('size', 'large');
button.setState('variant', 'success');

// 获取状态值
const size = button.getStringState('size');  // "large"
const variant = button.getStringState('variant');  // "success"

// 状态处理器根据值应用不同样式
this.registerStateHandler('size', (value, host) => {
  const sizes = {
    small: { padding: '6px 12px', fontSize: '12px' },
    medium: { padding: '10px 20px', fontSize: '14px' },
    large: { padding: '14px 28px', fontSize: '16px' }
  };
  host.styles(sizes[value] || sizes.medium);
});`);
        });
      });
    });
  });
}

// ============================================
// 演示模块 3: Number 状态
// ============================================

function createNumberDemo() {
  // 创建一个支持 number 状态的计数器组件
  class Counter extends Tag {
    constructor(initialValue = 0, setup = null) {
      super('div', null);

      // 注册 number 状态
      this.registerStateAttrs(
        { count: 'number' },
        { max: 'number' },
        { min: 'number' }
      );

      // 基础样式
      this.styles({
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px',
        background: '#f5f5f5',
        borderRadius: '8px'
      });

      // 初始化状态
      this.initializeStates({
        count: initialValue,
        max: 100,
        min: 0
      });

      // 注册状态处理器
      this._registerHandlers();

      // 构建 UI
      this._buildUI();

      if (setup) this.setup(setup);
    }

    _registerHandlers() {
      // count 状态处理器：更新显示
      this.registerStateHandler('count', (value, host, oldValue) => {
        const display = host._countDisplay;
        if (display) {
          display.text(String(value));
        }

        // 根据值改变样式
        if (value >= host.getNumberState('max')) {
          host.style('color', '#dc3545');
        } else if (value <= host.getNumberState('min')) {
          host.style('color', '#999');
        } else {
          host.style('color', '#333');
        }
      });
    }

    _buildUI() {
      // 减按钮
      this.child(button(btn => {
        btn.text('-');
        btn.styles({
          width: '30px',
          height: '30px',
          border: 'none',
          borderRadius: '4px',
          background: '#667eea',
          color: 'white',
          cursor: 'pointer',
          fontSize: '18px'
        });
        btn.on('click', () => {
          const current = this.getNumberState('count');
          const min = this.getNumberState('min');
          this.setState('count', Math.max(min, current - 1));
          updateStateDisplay('number-display', this.getAllStates());
        });
      }));

      // 计数显示
      this._countDisplay = span(display => {
        display.text(String(this.getNumberState('count')));
        display.styles({
          minWidth: '30px',
          textAlign: 'center',
          fontSize: '16px',
          fontWeight: 'bold'
        });
      });
      this.child(this._countDisplay);

      // 加按钮
      this.child(button(btn => {
        btn.text('+');
        btn.styles({
          width: '30px',
          height: '30px',
          border: 'none',
          borderRadius: '4px',
          background: '#667eea',
          color: 'white',
          cursor: 'pointer',
          fontSize: '18px'
        });
        btn.on('click', () => {
          const current = this.getNumberState('count');
          const max = this.getNumberState('max');
          this.setState('count', Math.min(max, current + 1));
          updateStateDisplay('number-display', this.getAllStates());
        });
      }));
    }

    getCount() {
      return this.getNumberState('count');
    }

    setCount(value) {
      return this.setState('count', value);
    }
  }

  function counter(initialValue = 0, setup = null) {
    return new Counter(initialValue, setup);
  }

  return section(section => {
    section.h2(h2 => {
      h2.text('3. Number 状态（数值型）');
      h2.styles(pageStyles.sectionTitle);
    });

    section.div(card => {
      card.styles(pageStyles.demoBox);

      card.p(p => {
        p.text('Number 状态用于数值型控制，如 count、progress、level 等：');
        p.styles({ marginBottom: '16px', color: '#666' });
      });

      // 计数器
      card.div(counterWrap => {
        counterWrap.styles({ marginBottom: '20px' });
        const counterEl = counter(5);
        counterEl.id('number-demo-counter');
        counterWrap.child(counterEl);
      });

      card.div(btnGroup => {
        btnGroup.styles(pageStyles.buttonGroup);
        btnGroup.style('marginTop', '16px');

        // 设置值
        btnGroup.button(btn => {
          btn.styles({ ...pageStyles.button, ...buttonStyles.primary });
          btn.text('设为 10');
          btn.on('click', () => {
            const counter = document.getElementById('number-demo-counter');
            if (counter && counter._stateMachine) {
              counter._stateMachine.setState('count', 10);
              updateStateDisplay('number-display', counter.getAllStates());
            }
          });
        });

        btnGroup.button(btn => {
          btn.styles({ ...pageStyles.button, ...buttonStyles.success });
          btn.text('设为 50');
          btn.on('click', () => {
            const counter = document.getElementById('number-demo-counter');
            if (counter && counter._stateMachine) {
              counter._stateMachine.setState('count', 50);
              updateStateDisplay('number-display', counter.getAllStates());
            }
          });
        });

        btnGroup.button(btn => {
          btn.styles({ ...pageStyles.button, ...buttonStyles.error });
          btn.text('设为 100');
          btn.on('click', () => {
            const counter = document.getElementById('number-demo-counter');
            if (counter && counter._stateMachine) {
              counter._stateMachine.setState('count', 100);
              updateStateDisplay('number-display', counter.getAllStates());
            }
          });
        });
      });

      // 状态显示
      card.div(display => {
        display.id('number-display');
        display.styles(pageStyles.stateDisplay);
        display.text('状态：{ count: 5, max: 100, min: 0 }');
      });

      // 源码
      card.pre(pre => {
        pre.styles(pageStyles.codeBlock);
        pre.code(c => {
          c.text(`// Number 状态 - 数值型控制
// 注册数值类型状态
this.registerStateAttrs(
  { count: 'number' },
  { max: 'number' },
  { progress: 'number' },
  { level: 'number' }
);

// 设置数值
counter.setState('count', 10);
counter.setState('progress', 75);

// 获取数值
const count = counter.getNumberState('count');  // 10
const progress = counter.getNumberState('progress');  // 75

// 状态处理器根据数值改变样式
this.registerStateHandler('count', (value, host, oldValue) => {
  // 更新显示
  host._display.text(String(value));

  // 根据值改变样式
  if (value >= host.getNumberState('max')) {
    host.style('color', '#dc3545');  // 达到最大值变红
  } else if (value <= host.getNumberState('min')) {
    host.style('color', '#999');  // 达到最小值变灰
  }
});`);
        });
      });
    });
  });
}

// ============================================
// 演示模块 4: 混合类型状态
// ============================================

function createMixedDemo() {
  return section(section => {
    section.h2(h2 => {
      h2.text('4. 混合类型状态综合演示');
      h2.styles(pageStyles.sectionTitle);
    });

    section.div(card => {
      card.styles(pageStyles.demoBox);

      card.p(p => {
        p.text('一个组件可以同时拥有 boolean、string、number 多种类型的状态：');
        p.styles({ marginBottom: '16px', color: '#666' });
      });

      // 源码示例
      card.pre(pre => {
        pre.styles(pageStyles.codeBlock);
        pre.code(c => {
          c.text(`// 混合类型状态示例
class AdvancedButton extends Tag {
  constructor() {
    super('button');

    // 混合注册所有状态
    this.registerStateAttrs(
      // boolean 状态（默认类型）
      'disabled',
      'loading',
      'selected',

      // string 状态（枚举型）
      { size: 'string' },      // 'small' | 'medium' | 'large'
      { variant: 'string' },   // 'default' | 'primary' | 'success' | 'danger'
      { status: 'string' },    // 'idle' | 'pending' | 'success' | 'error'

      // number 状态（数值型）
      { count: 'number' },     // 计数
      { progress: 'number' },  // 进度 0-100
      { priority: 'number' }   // 优先级 1-5
    );

    // 初始化状态
    this.initializeStates({
      disabled: false,
      loading: false,
      selected: false,
      size: 'medium',
      variant: 'default',
      status: 'idle',
      count: 0,
      progress: 0,
      priority: 1
    });
  }

  // boolean 状态快捷方法
  disable() { return this.setState('disabled', true); }
  enable() { return this.setState('disabled', false); }
  isLoading() { return this.hasState('loading'); }

  // string 状态快捷方法
  setSize(size) { return this.setState('size', size); }
  setVariant(variant) { return this.setState('variant', variant); }
  getStatus() { return this.getStringState('status'); }

  // number 状态快捷方法
  setCount(count) { return this.setState('count', count); }
  getCount() { return this.getNumberState('count'); }
  incrementProgress(delta) {
    const current = this.getNumberState('progress');
    return this.setState('progress', current + delta);
  }
}

// 使用示例
const btn = new AdvancedButton();
btn.disable();
btn.setSize('large');
btn.setCount(10);
btn.incrementProgress(25);

console.log(btn.getAllStates());
// 输出：{ disabled: true, loading: false, size: 'large', count: 10, progress: 25, ... }`);
        });
      });
    });
  });
}

// ============================================
// 辅助函数
// ============================================

function updateStateDisplay(displayId, states) {
  const display = document.getElementById(displayId);
  if (display) {
    const formatted = JSON.stringify(states, null, 2)
      .replace(/[{}]/g, '')
      .replace(/"/g, '')
      .replace(/,/g, ', ');
    display.text('状态：{ ' + formatted + ' }');
  }
}

// ============================================
// 页脚
// ============================================

function createFooter() {
  return section(footer => {
    footer.styles({
      textAlign: 'center',
      padding: '30px',
      color: '#666',
      borderTop: '1px solid #e0e0e0',
      marginTop: '40px'
    });

    footer.p(p => {
      p.text('Yoya.Basic Multi-Type State System');
      p.styles({ marginBottom: '8px' });
    });

    footer.p(p => {
      p.text('Boolean / String / Number 多类型状态支持');
      p.styles({ fontSize: '14px', color: '#999' });
    });
  });
}

// ============================================
// 主应用
// ============================================

function createApp() {
  return div(app => {
    app.styles(pageStyles.body);

    // 页面标题
    app.header(h => {
      h.styles(pageStyles.header);
      h.h1(title => {
        title.text('🔢 Multi-Type State System');
        title.styles({
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '10px'
        });
      });
      h.p(subtitle => {
        subtitle.text('Boolean / String / Number 状态值类型支持');
        subtitle.styles({
          color: '#666',
          fontSize: '16px'
        });
      });
    });

    // 内容区域
    app.main(main => {
      main.child(createBooleanDemo());
      main.child(createStringDemo());
      main.child(createNumberDemo());
      main.child(createMixedDemo());
      main.child(createFooter());
    });
  });
}

// ============================================
// 渲染应用
// ============================================

console.log('🚀 Yoya.Basic Multi-Type State 演示页面加载开始...');

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  console.log('📦 开始渲染 Multi-Type State 演示页面...');
  const appEl = document.getElementById('app');
  const app = createApp();
  app.bindTo(appEl);

  console.log('✅ Multi-Type State 演示页面渲染完成！');
  console.log('📊 支持的状态值类型：boolean, string, number');
}
