/**
 * Yoya.Basic - Menu 组件演示界面
 * 展示 Menu 菜单组件的功能
 */

import {
  div, span, p, h1, h2, h3, h4, section, br, footer, button,
  flex, hstack, vstack, spacer,
  vMenu, vMenuItem, vMenuDivider, vMenuGroup,
  vDropdownMenu, vContextMenu,
  toast
} from '../yoya/index.js';

// ============================================
// 演示页面样式
// ============================================

const pageStyles = {
  body: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
  },
  header: {
    textAlign: 'center',
    color: 'white',
    marginBottom: '40px'
  },
  sectionTitle: {
    color: '#4facfe',
    borderBottom: '2px solid #4facfe',
    paddingBottom: '10px',
    marginBottom: '20px'
  },
  demoBox: {
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px'
  },
  codeBlock: {
    background: '#2d2d2d',
    color: '#f8f8f2',
    padding: '16px',
    borderRadius: '6px',
    overflow: 'auto',
    fontSize: '13px',
    marginTop: '10px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px'
  },
  // 演示区域背景
  demoArea: {
    background: '#f5f5f5',
    borderRadius: '8px',
    padding: '20px',
    minHeight: '150px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

// ============================================
// 演示模块 1: 基础菜单
// ============================================

function createBasicMenuDemo() {
  return section(section => {
    section.h2(h2 => {
      h2.text('1. 基础菜单');
      h2.styles(pageStyles.sectionTitle);
    });

    section.div(container => {
      container.styles(pageStyles.grid);

      // 垂直菜单
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('垂直菜单（默认）');

        card.div(demo => {
          demo.styles(pageStyles.demoArea);

          demo.vMenu(m => {
            m.item(it => {
              it.text('📋 菜单项 1')
                .onClick(() => toast.info('点击了菜单项 1'));
            });
            m.item(it => {
              it.text('📁 菜单项 2')
                .onClick(() => toast.info('点击了菜单项 2'));
            });
            m.item(it => {
              it.text('⚙️ 菜单项 3')
                .onClick(() => toast.info('点击了菜单项 3'));
            });
            m.item(it => {
              it.text('❓ 菜单项 4')
                .onClick(() => toast.info('点击了菜单项 4'));
            });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 垂直菜单
vMenu(m => {
  m.item('📋 菜单项 1');
  m.item('📁 菜单项 2');
  m.item('⚙️ 菜单项 3');
});`);
          });
        });
      });

      // 带分割线的菜单
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('带分割线的菜单');

        card.div(demo => {
          demo.styles(pageStyles.demoArea);

          demo.vMenu(m => {
            m.item(it => {
              it.text('✂️ 剪切')
                .onClick(() => toast.info('剪切'));
            });
            m.item(it => {
              it.text('📋 复制')
                .onClick(() => toast.info('复制'));
            });
            m.item(it => {
              it.text('📌 粘贴')
                .onClick(() => toast.info('粘贴'));
            });
            m.divider();
            m.item(it => {
              it.text('🗑️ 删除')
                .onClick(() => toast.warning('删除'));
            });
            m.divider();
            m.item(it => {
              it.text('⚙️ 设置')
                .onClick(() => toast.info('设置'));
            });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 带分割线
vMenu(m => {
  m.item('✂️ 剪切');
  m.item('📋 复制');
  m.item('📌 粘贴');
  m.divider();
  m.item('🗑️ 删除');
  m.item('⚙️ 设置');
});`);
          });
        });
      });

      // 带分组的菜单
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('带分组的菜单');

        card.div(demo => {
          demo.styles(pageStyles.demoArea);

          demo.vMenu(m => {
            m.group(g => {
              g.label('文件操作');
              g.item(it => {
                it.text('📄 新建')
                  .onClick(() => toast.info('新建文件'));
              });
              g.item(it => {
                it.text('📂 打开')
                  .onClick(() => toast.info('打开文件'));
              });
              g.item(it => {
                it.text('💾 保存')
                  .onClick(() => toast.success('保存成功'));
              });
            });
            m.divider();
            m.group(g => {
              g.label('编辑操作');
              g.item(it => {
                it.text('✂️ 剪切')
                  .onClick(() => toast.info('剪切'));
              });
              g.item(it => {
                it.text('📋 复制')
                  .onClick(() => toast.info('复制'));
              });
            });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 分组菜单
vMenu(m => {
  m.group(g => {
    g.label('文件操作');
    g.item('📄 新建');
    g.item('📂 打开');
    g.item('💾 保存');
  });
  m.divider();
  m.group(g => {
    g.label('编辑操作');
    g.item('✂️ 剪切');
    g.item('📋 复制');
  });
});`);
          });
        });
      });
    });
  });
}

// ============================================
// 演示模块 2: 菜单状态
// ============================================

function createMenuStateDemo() {
  return section(section => {
    section.h2(h2 => {
      h2.text('2. 菜单状态');
      h2.styles(pageStyles.sectionTitle);
    });

    section.div(container => {
      container.styles(pageStyles.grid);

      // 激活状态
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('激活状态');

        card.div(demo => {
          demo.styles(pageStyles.demoArea);

          demo.vMenu(m => {
            m.item(it => {
              it.text('🏠 首页')
                .active()
                .onClick(() => toast.info('首页'));
            });
            m.item(it => {
              it.text('📊 数据')
                .onClick(() => toast.info('数据'));
            });
            m.item(it => {
              it.text('👤 个人')
                .onClick(() => toast.info('个人'));
            });
            m.item(it => {
              it.text('⚙️ 设置')
                .onClick(() => toast.info('设置'));
            });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 激活状态
vMenu(m => {
  m.item('🏠 首页').active();
  m.item('📊 数据');
  m.item('👤 个人');
});`);
          });
        });
      });

      // 禁用状态
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('禁用状态');

        card.div(demo => {
          demo.styles(pageStyles.demoArea);

          demo.vMenu(m => {
            m.item(it => {
              it.text('📄 新建')
                .onClick(() => toast.info('新建'));
            });
            m.item(it => {
              it.text('📂 打开')
                .disabled();
            });
            m.item(it => {
              it.text('💾 保存')
                .onClick(() => toast.success('保存'));
            });
            m.divider();
            m.item(it => {
              it.text('🗑️ 删除')
                .disabled();
            });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 禁用状态
vMenu(m => {
  m.item('📄 新建');
  m.item('📂 打开').disabled();
  m.item('💾 保存');
  m.divider();
  m.item('🗑️ 删除').disabled();
});`);
          });
        });
      });

      // 危险项
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('危险项（删除）');

        card.div(demo => {
          demo.styles(pageStyles.demoArea);

          demo.vMenu(m => {
            m.item(it => {
              it.text('✏️ 编辑')
                .onClick(() => toast.info('编辑'));
            });
            m.item(it => {
              it.text('📋 复制')
                .onClick(() => toast.info('复制'));
            });
            m.divider();
            m.item(it => {
              it.text('🗑️ 删除')
                .danger()
                .onClick(() => toast.error('删除'));
            });
            m.item(it => {
              it.text('🚫 禁用')
                .danger()
                .disabled();
            });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 危险项
vMenu(m => {
  m.item('✏️ 编辑');
  m.item('📋 复制');
  m.divider();
  m.item('🗑️ 删除').danger();
});`);
          });
        });
      });
    });
  });
}

// ============================================
// 演示模块 3: 下拉菜单
// ============================================

function createDropdownMenuDemo() {
  return section(section => {
    section.h2(h2 => {
      h2.text('3. 下拉菜单');
      h2.styles(pageStyles.sectionTitle);
    });

    section.div(container => {
      container.styles(pageStyles.grid);

      // 基础下拉菜单
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('基础下拉菜单');

        card.div(demo => {
          demo.styles(pageStyles.demoArea);

          demo.dropdownMenu(d => {
            d.trigger('点击我');
            d.menuContent(vMenu(m => {
              m.item(it => {
                it.text('📋 选项 1')
                  .onClick(() => toast.info('选项 1'));
              });
              m.item(it => {
                it.text('📁 选项 2')
                  .onClick(() => toast.info('选项 2'));
              });
              m.item(it => {
                it.text('⚙️ 选项 3')
                  .onClick(() => toast.info('选项 3'));
              });
            }));
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 下拉菜单
dropdownMenu(d => {
  d.trigger('点击我');
  d.menuContent(vMenu(m => {
    m.item('📋 选项 1');
    m.item('📁 选项 2');
    m.item('⚙️ 选项 3');
  }));
});`);
          });
        });
      });

      // 带快捷键的下拉菜单
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('带快捷键');

        card.div(demo => {
          demo.styles(pageStyles.demoArea);

          demo.dropdownMenu(d => {
            d.trigger('操作');
            d.menuContent(vMenu(m => {
              m.item(it => {
                it.text('✂️ 剪切')
                  .shortcut('Ctrl+X')
                  .onClick(() => toast.info('剪切'));
              });
              m.item(it => {
                it.text('📋 复制')
                  .shortcut('Ctrl+C')
                  .onClick(() => toast.info('复制'));
              });
              m.item(it => {
                it.text('📌 粘贴')
                  .shortcut('Ctrl+V')
                  .onClick(() => toast.info('粘贴'));
              });
              m.divider();
              m.item(it => {
                it.text('🔍 查找')
                  .shortcut('Ctrl+F')
                  .onClick(() => toast.info('查找'));
              });
            }));
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 带快捷键
dropdownMenu(d => {
  d.trigger('操作');
  d.menuContent(vMenu(m => {
    m.item('✂️ 剪切').shortcut('Ctrl+X');
    m.item('📋 复制').shortcut('Ctrl+C');
    m.item('📌 粘贴').shortcut('Ctrl+V');
  }));
});`);
          });
        });
      });

      // 用户菜单下拉
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('用户菜单');

        card.div(demo => {
          demo.styles(pageStyles.demoArea);

          demo.dropdownMenu(d => {
            d.trigger('👤 用户');
            d.menuContent(vMenu(m => {
              m.item(it => {
                it.text('👤 个人资料')
                  .onClick(() => toast.info('个人资料'));
              });
              m.item(it => {
                it.text('⚙️ 账户设置')
                  .onClick(() => toast.info('账户设置'));
              });
              m.divider();
              m.item(it => {
                it.text('🚪 退出登录')
                  .danger()
                  .onClick(() => toast.warning('退出登录'));
              });
            }));
            d.closeOnClickOutside();
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 用户菜单
dropdownMenu(d => {
  d.trigger('👤 用户');
  d.menuContent(vMenu(m => {
    m.item('👤 个人资料');
    m.item('⚙️ 账户设置');
    m.divider();
    m.item('🚪 退出登录').danger();
  }));
  d.closeOnClickOutside();
});`);
          });
        });
      });
    });
  });
}

// ============================================
// 演示模块 4: 导航菜单
// ============================================

function createNavMenuDemo() {
  return section(section => {
    section.h2(h2 => {
      h2.text('4. 导航菜单');
      h2.styles(pageStyles.sectionTitle);
    });

    section.div(container => {
      container.styles(pageStyles.grid);

      // 水平导航菜单
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('水平导航菜单');

        card.div(demo => {
          demo.styles({ ...pageStyles.demoArea, minHeight: '100px', display: 'block' });

          demo.vMenu(m => {
            m.horizontal();
            m.styles({
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '12px 20px'
            });
            m.item(it => {
              it.text('🏠 首页')
                .styles({ color: 'white' })
                .active()
                .onClick(() => toast.info('首页'));
            });
            m.item(it => {
              it.text('📊 数据')
                .styles({ color: 'rgba(255,255,255,0.8)' })
                .onClick(() => toast.info('数据'));
            });
            m.item(it => {
              it.text('📁 项目')
                .styles({ color: 'rgba(255,255,255,0.8)' })
                .onClick(() => toast.info('项目'));
            });
            m.item(it => {
              it.text('👥 团队')
                .styles({ color: 'rgba(255,255,255,0.8)' })
                .onClick(() => toast.info('团队'));
            });
            m.item(it => {
              it.text('⚙️ 设置')
                .styles({ color: 'rgba(255,255,255,0.8)' })
                .onClick(() => toast.info('设置'));
            });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 水平导航菜单
vMenu(m => {
  m.horizontal();  // 水平布局
  m.style('background', gradient);
  m.style('gap', '8px');

  m.item('🏠 首页').active();
  m.item('📊 数据');
  m.item('📁 项目');
});`);
          });
        });
      });

      // 侧边栏菜单
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('侧边栏菜单');

        card.div(demo => {
          demo.styles({ ...pageStyles.demoArea, minHeight: '250px', display: 'block' });

          demo.vMenu(m => {
            m.styles({
              width: '200px',
              background: '#f8f9fa',
              borderRight: '1px solid #e0e0e0'
            });
            m.item(it => {
              it.text('📊 仪表盘')
                .onClick(() => toast.info('仪表盘'));
            });
            m.item(it => {
              it.text('📁 项目管理')
                .onClick(() => toast.info('项目管理'));
            });
            m.item(it => {
              it.text('👥 团队成员')
                .onClick(() => toast.info('团队成员'));
            });
            m.item(it => {
              it.text('📝 任务列表')
                .onClick(() => toast.info('任务列表'));
            });
            m.divider();
            m.item(it => {
              it.text('📈 数据统计')
                .onClick(() => toast.info('数据统计'));
            });
            m.item(it => {
              it.text('📋 报表中心')
                .onClick(() => toast.info('报表中心'));
            });
            m.divider();
            m.item(it => {
              it.text('⚙️ 系统设置')
                .onClick(() => toast.info('系统设置'));
            });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 侧边栏菜单
vMenu(m => {
  m.style('width', '200px');
  m.style('background', '#f8f9fa');

  m.item('📊 仪表盘');
  m.item('📁 项目管理');
  m.item('👥 团队成员');
  m.divider();
  m.item('⚙️ 系统设置');
});`);
          });
        });
      });
    });
  });
}

// ============================================
// 演示模块 5: 右键菜单
// ============================================

function createContextMenuDemo() {
  return section(section => {
    section.h2(h2 => {
      h2.text('5. 右键菜单');
      h2.styles(pageStyles.sectionTitle);
    });

    section.div(container => {
      container.styles(pageStyles.grid);

      // 右键菜单演示
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('右键点击演示区域');

        card.div(demo => {
          demo.styles({
            ...pageStyles.demoArea,
            minHeight: '200px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textAlign: 'center'
          });
          demo.id('context-menu-target');

          demo.div(d => {
            d.text('👈 在这里点击右键');
            d.styles({ fontSize: '18px', marginBottom: '10px' });
          });
          demo.p(p => {
            p.text('体验自定义右键菜单效果');
            p.styles({ opacity: 0.8 });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 右键菜单
const target = document.getElementById('demo');
const ctxMenu = vContextMenu(ctx => {
  ctx.target(target);
  ctx.menuContent(vMenu(m => {
    m.item('✏️ 编辑');
    m.item('📋 复制');
    m.item('🗑️ 删除').danger();
  }));
});`);
          });
        });
      });
    });
  });
}

// ============================================
// 页脚
// ============================================

function createFooter() {
  return footer(f => {
    f.styles({
      textAlign: 'center',
      padding: '30px',
      color: 'rgba(255,255,255,0.7)',
      marginTop: '40px'
    });

    f.p(p => {
      f.text('Yoya.Basic Menu - 菜单组件库');
      f.styles({ marginBottom: '10px' });
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
        title.text('📋 Yoya.Basic Menu 演示');
        title.styles({
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        });
      });
      h.p(subtitle => {
        subtitle.text('灵活的菜单组件 / 下拉菜单 / 右键菜单');
        subtitle.styles({
          color: 'rgba(255,255,255,0.8)',
          marginTop: '10px'
        });
      });
    });

    // 内容区域
    app.main(main => {
      main.child(createBasicMenuDemo());
      main.child(createMenuStateDemo());
      main.child(createDropdownMenuDemo());
      main.child(createNavMenuDemo());
      main.child(createContextMenuDemo());
      main.child(createFooter());
    });
  });
}

// ============================================
// 渲染应用
// ============================================

console.log('🚀 Yoya.Basic Menu 演示页面加载开始...');

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  console.log('📦 开始渲染 Menu 演示页面...');
  let appEl = document.getElementById("app");
  const app = createApp();
  app.bindTo(appEl);

  // 初始化右键菜单
  initContextMenu();

  console.log('✅ Menu 演示页面渲染完成！');
}

// 初始化右键菜单
function initContextMenu() {
  const target = document.getElementById('context-menu-target');
  if (!target) return;

  const ctxMenu = vContextMenu(ctx => {
    ctx.menuContent(vMenu(m => {
      m.item('✏️ 编辑').onClick(() => {
        toast.info('编辑');
        ctxMenu.hide();
      });
      m.item('📋 复制').onClick(() => {
        toast.info('复制');
        ctxMenu.hide();
      });
      m.divider();
      m.item('🗑️ 删除').danger().onClick(() => {
        toast.warning('删除');
        ctxMenu.hide();
      });
    }));
  });

  ctxMenu.target(target);
  document.body.appendChild(ctxMenu.renderDom());
}
