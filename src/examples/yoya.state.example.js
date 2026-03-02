/**
 * Yoya.Basic - 状态管理演示
 * 演示元素状态变化的样式处理规则
 */

import {
  div, button, h1, p, section, pre, code,
  menu, menuItem, menuDivider, menuGroup
} from '../yoya/index.js';

// ============================================
// 演示页面样式
// ============================================

const pageStyles = {
  body: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    maxWidth: '900px',
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
// 演示模块 1: 菜单项状态
// ============================================

function createStateDemo() {
  return section(section => {
    section.h2(h2 => {
      h2.text('1. 菜单项状态演示');
      h2.styles(pageStyles.sectionTitle);
    });

    section.div(card => {
      card.styles(pageStyles.demoBox);

      card.p(p => {
        p.text('点击按钮切换菜单项的状态：');
        p.styles({ marginBottom: '16px', color: '#666' });
      });

      // 菜单示例
      card.menu(menuEl => {
        menuEl.id('state-menu');
        menuEl.bordered();
        menuEl.style('width', '200px');

        const item1 = menuEl.item('正常菜单项', item => {
          item.id('menu-item-1');
        });

        const item2 = menuEl.item('禁用菜单项', item => {
          item.id('menu-item-2');
          item.disabled();
        });

        const item3 = menuEl.item('激活菜单项', item => {
          item.id('menu-item-3');
          item.active();
        });

        menuEl.divider();

        const item4 = menuEl.item('危险操作', item => {
          item.id('menu-item-4');
          item.danger();
        });
      });

      card.div(btnGroup => {
        btnGroup.styles(pageStyles.buttonGroup);
        btnGroup.style('marginTop', '16px');

        // 切换禁用状态
        btnGroup.button(btn => {
          btn.styles({ ...pageStyles.button, ...buttonStyles.primary });
          btn.text('切换禁用状态');
          btn.on('click', () => {
            const item = document.getElementById('menu-item-1');
            if (item) {
              const yoyaItem = item._yoyaInstance;
              if (yoyaItem) {
                const isDisabled = yoyaItem.hasState('disabled');
                yoyaItem.setState('disabled', !isDisabled);
                console.log(`菜单项 1 禁用状态：${!isDisabled}`);
              }
            }
          });
        });

        // 切换激活状态
        btnGroup.button(btn => {
          btn.styles({ ...pageStyles.button, ...buttonStyles.success });
          btn.text('切换激活状态');
          btn.on('click', () => {
            const item = document.getElementById('menu-item-1');
            if (item) {
              const yoyaItem = item._yoyaInstance;
              if (yoyaItem) {
                const isActive = yoyaItem.hasState('active');
                yoyaItem.setState('active', !isActive);
                console.log(`菜单项 1 激活状态：${!isActive}`);
              }
            }
          });
        });

        // 获取当前状态
        btnGroup.button(btn => {
          btn.styles({ ...pageStyles.button, ...buttonStyles.error });
          btn.text('获取当前状态');
          btn.on('click', () => {
            const item = document.getElementById('menu-item-1');
            if (item) {
              const yoyaItem = item._yoyaInstance;
              if (yoyaItem) {
                const states = Array.from(yoyaItem.getStates());
                console.log('菜单项 1 当前状态:', states);
                alert(`菜单项 1 当前状态：${states.join(', ') || '无'}`);
              }
            }
          });
        });
      });

      // 源码
      card.pre(pre => {
        pre.styles(pageStyles.codeBlock);
        pre.code(c => {
          c.text(`// 创建菜单项
const menuItem = menu.item('菜单项');

// 设置状态
menuItem.setState('disabled', true);  // 禁用
menuItem.setState('active', true);    // 激活
menuItem.setState('danger', true);    // 危险

// 检查状态
const isDisabled = menuItem.hasState('disabled');

// 获取所有状态
const states = menuItem.getStates();

// 清除所有状态
menuItem.clearStates();`);
        });
      });
    });
  });
}

// ============================================
// 演示模块 2: 状态样式映射表
// ============================================

function createStateStylesDemo() {
  return section(section => {
    section.h2(h2 => {
      h2.text('2. 状态样式映射表');
      h2.styles(pageStyles.sectionTitle);
    });

    section.div(card => {
      card.styles(pageStyles.demoBox);

      card.p(p => {
        p.text('MenuItem 组件使用静态 stateStyles 定义状态与样式的映射：');
        p.styles({ marginBottom: '16px', color: '#666' });
      });

      // 源码
      card.pre(pre => {
        pre.styles(pageStyles.codeBlock);
        pre.code(c => {
          c.text(`class MenuItem extends Tag {
  // 状态样式映射表
  static stateStyles = {
    disabled: {
      opacity: '0.5',
      cursor: 'not-allowed',
      pointerEvents: 'none'
    },
    active: {
      background: 'rgba(102, 126, 234, 0.1)',
      fontWeight: '500'
    },
    danger: {
      color: '#dc3545'
    }
  };

  constructor() {
    super('div');
    // 继承状态样式映射
    this._stateStyles = { ...this.constructor.stateStyles };
  }

  // 快捷方法
  disabled() {
    return this.setState('disabled', true);
  }

  active() {
    return this.setState('active', true);
  }

  danger() {
    return this.setState('danger', true);
  }
}`);
        });
      });
    });
  });
}

// ============================================
// 演示模块 3: 状态优先级
// ============================================

function createStatePriorityDemo() {
  return section(section => {
    section.h2(h2 => {
      h2.text('3. 状态优先级说明');
      h2.styles(pageStyles.sectionTitle);
    });

    section.div(card => {
      card.styles(pageStyles.demoBox);

      card.p(p => {
        p.text('状态样式应用的优先级（从高到低）：');
        p.styles({ marginBottom: '16px', color: '#666' });
      });

      card.ul(ul => {
        ul.li(li => {
          li.text('1. 内联 style() 调用 - 用户自定义样式');
          li.styles({ padding: '8px 0', borderBottom: '1px solid #eee' });
        });
        ul.li(li => {
          li.text('2. 数据状态（loading, selected 等）- 业务数据驱动');
          li.styles({ padding: '8px 0', borderBottom: '1px solid #eee' });
        });
        ul.li(li => {
          li.text('3. 交互状态（hover, active 等）- 用户交互触发');
          li.styles({ padding: '8px 0', borderBottom: '1px solid #eee' });
        });
        ul.li(li => {
          li.text('4. 永久状态（disabled, bordered 等）- 组件变体');
          li.styles({ padding: '8px 0', borderBottom: '1px solid #eee' });
        });
        ul.li(li => {
          li.text('5. 默认样式（constructor 中设置）');
          li.styles({ padding: '8px 0' });
        });
      });

      // 源码
      card.pre(pre => {
        pre.styles(pageStyles.codeBlock);
        pre.code(c => {
          c.text(`// 状态优先级示例
class MenuItem extends Tag {
  constructor() {
    super('div');
    // 5. 默认样式（最低优先级）
    this.style('padding', '10px 16px');
    this.style('background', 'white');
  }

  // 4. 永久状态
  disabled() {
    return this.setState('disabled', true);
  }

  // 3. 交互状态
  on('click', () => {
    this.setState('active', true);
  });

  // 2. 数据状态
  setLoading(loading) {
    this.setState('loading', loading);
  }

  // 1. 内联样式（最高优先级）
  setCustomBackground(color) {
    return this.style('background', color);
  }
}`);
        });
      });
    });
  });
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
      p.text('Yoya.Basic State Management - 元素状态管理');
      p.styles({ marginBottom: '8px' });
    });

    footer.p(p => {
      p.text('统一的状态接口 / 状态样式映射表 / 优先级管理');
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
        title.text('🎯 State Management 状态管理演示');
        title.styles({
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '10px'
        });
      });
      h.p(subtitle => {
        subtitle.text('状态样式映射表 / 统一状态接口 / 优先级管理');
        subtitle.styles({
          color: '#666',
          fontSize: '16px'
        });
      });
    });

    // 内容区域
    app.main(main => {
      main.child(createStateDemo());
      main.child(createStateStylesDemo());
      main.child(createStatePriorityDemo());
      main.child(createFooter());
    });
  });
}

// ============================================
// 渲染应用
// ============================================

console.log('🚀 Yoya.Basic State Management 演示页面加载开始...');

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  console.log('📦 开始渲染 State Management 演示页面...');
  const appEl = document.getElementById('app');
  const app = createApp();
  app.bindTo(appEl);

  console.log('✅ State Management 演示页面渲染完成！');
}
