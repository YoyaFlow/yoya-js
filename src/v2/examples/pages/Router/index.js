/**
 * Yoya.Basic V2 - Router Page
 * VRouter 路由组件演示页面
 * 展示基于 Hash 的路由系统，支持路由匹配、参数提取、导航守卫等功能
 */

import {
  flex, grid, responsiveGrid, vstack, hstack,
  vCard, vCardHeader, vCardBody,
  vButton, toast,
  vRouter, vLink, vRouterView,
  div, span, p, h2, h3, code, pre,
} from '../../../../yoya/index.js';
import { AppShell } from '../../framework/AppShell.js';
import { CodeDemo } from '../../components/CodeDemo.js';
import { DocSection } from '../../components/DocSection.js';
import { PageHeader } from '../../components/PageHeader.js';
import { ApiTable } from '../../components/ApiTable.js';

// ============================================
// 演示用页面组件
// ============================================

/**
 * 首页组件
 */
function HomePage() {
  return vCard(c => {
    c.vCardHeader('🏠 首页');
    c.vCardBody(content => {
      content.div('欢迎使用 VRouter 路由系统！');
      content.div('这是一个基于 Hash 的简单路由，支持：');
      content.ul(list => {
        list.li('✅ 动态路由参数');
        list.li('✅ 路由守卫');
        list.li('✅ 查询参数解析');
        list.li('✅ 404 处理');
        list.li('✅ vLink 导航链接');
      });
    });
  });
}

/**
 * 用户列表页
 */
function UserListPage() {
  return vCard(c => {
    c.vCardHeader('👥 用户列表');
    c.vCardBody(content => {
      content.p('以下是系统用户：');
      content.div(users => {
        users.styles({ display: 'flex', flexDirection: 'column', gap: '8px' });

        // 用户 1
        users.child(vLink('/router/user/1', user => {
          user.styles({
            padding: '12px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            display: 'block',
          });
          user.text('👤 张三 (点击查看详情)');
        }));

        // 用户 2
        users.child(vLink('/router/user/2', user => {
          user.styles({
            padding: '12px',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            display: 'block',
          });
          user.text('👤 李四 (点击查看详情)');
        }));

        // 用户 3
        users.child(vLink('/router/user/3', user => {
          user.styles({
            padding: '12px',
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            display: 'block',
          });
          user.text('👤 王五 (点击查看详情)');
        }));
      });
    });
  });
}

/**
 * 用户详情页（带动态参数）
 * @param {Object} params - 路由参数
 */
function UserDetailPage(params) {
  const userId = params?.id || 'unknown';
  const names = { '1': '张三', '2': '李四', '3': '王五' };
  const name = names[userId] || '未知用户';

  return vCard(c => {
    c.vCardHeader(`👤 用户详情 - ${name}`);
    c.vCardBody(content => {
      content.div(info => {
        info.styles({ display: 'flex', flexDirection: 'column', gap: '12px' });
        info.div(span(`用户 ID: ${code(userId)}`));
        info.div(span(`姓名：${name}`));
        info.div(span(`邮箱：${name.toLowerCase()}@example.com`));
      });

      content.div(actions => {
        actions.styles({ marginTop: '20px', display: 'flex', gap: '12px' });
        actions.child(vButton('返回列表')
          .ghost()
          .onClick(() => window.location.hash = '/users'));
        actions.child(vButton('编辑用户')
          .type('primary'));
      });
    });
  });
}

/**
 * 产品列表页（带查询参数）
 */
function ProductListPage() {
  return vCard(c => {
    c.vCardHeader('📦 产品列表');
    c.vCardBody(content => {
      content.p('查询参数演示：在 URL 中添加 ?category=electronics&sort=price 来筛选产品');

      content.div(products => {
        products.styles({ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' });

        const productList = [
          { name: '笔记本电脑', price: '¥5,999', category: 'electronics' },
          { name: '无线鼠标', price: '¥199', category: 'electronics' },
          { name: '机械键盘', price: '¥399', category: 'electronics' },
          { name: '办公椅', price: '¥899', category: 'furniture' },
          { name: '书桌', price: '¥1,299', category: 'furniture' },
          { name: '台灯', price: '¥159', category: 'furniture' },
        ];

        productList.forEach(product => {
          products.child(vCard(p => {
            p.styles({ cursor: 'pointer', transition: 'transform 0.2s' });
            p.on('mouseenter', () => p.style('transform', 'translateY(-4px)'));
            p.on('mouseleave', () => p.style('transform', 'translateY(0)'));
            p.vCardBody(c => {
              c.div(product.name);
              c.div(d => {
                d.styles({ color: '#667eea', fontWeight: '600', marginTop: '8px' });
                d.text(product.price);
              });
              c.div(cat => {
                cat.styles({ fontSize: '12px', color: '#999', marginTop: '4px' });
                cat.text(`分类：${product.category}`);
              });
            });
          }));
        });
      });
    });
  });
}

/**
 * 设置页（带守卫）
 */
function SettingsPage() {
  return vCard(c => {
    c.vCardHeader('⚙️ 设置');
    c.vCardBody(content => {
      content.div('此页面有路由守卫，进入前会弹出确认对话框。');
      content.div('试试点击左侧菜单的"设置"选项。');

      content.div(tips => {
        tips.styles({
          marginTop: '20px',
          padding: '16px',
          background: '#fff3cd',
          borderRadius: '8px',
          border: '1px solid #ffc107',
        });
        tips.div('💡 提示：beforeEnter 守卫可以返回 false 来阻止导航。');
      });
    });
  });
}

/**
 * 关于页
 */
function AboutPage() {
  return vCard(c => {
    c.vCardHeader('📖 关于');
    c.vCardBody(content => {
      content.div('Yoya.Basic VRouter 是一个轻量级的 Hash 路由实现。');
      content.div('特点：');
      content.ul(list => {
        list.li('• 简单易用，API 直观');
        list.li('• 支持动态路由参数');
        list.li('• 支持查询参数自动解析');
        list.li('• 提供路由守卫机制');
        list.li('• 自动处理 404 情况');
      });
    });
  });
}

// ============================================
// 主页面创建函数
// ============================================

/**
 * 创建 Router 演示页面
 */
export function createRouterPage() {
  // 右侧目录项
  const tocItems = [
    { text: '基础用法', href: '#basic', level: 1 },
    { text: '动态参数', href: '#dynamic', level: 1 },
    { text: '查询参数', href: '#query', level: 1 },
    { text: '路由守卫', href: '#guards', level: 1 },
    { text: 'API 参考', href: '#api', level: 1 },
  ];

  // 创建路由器
  const router = vRouter(r => {
    r.default('/router/home');

    // 全局前置守卫
    r.beforeEach((to, from) => {
      console.log('[全局前置守卫]', `从 ${from?.path} 到 ${to?.path}`);
      return true;
    });

    // 全局后置钩子
    r.afterEach((to, from) => {
      console.log('[全局后置钩子]', `已从 ${from?.path} 导航到 ${to?.path}`);
    });

    // 定义路由
    r.route('/router/home', {
      component: () => HomePage(),
    });

    r.route('/router/users', h => {
      h.component(() => UserListPage());
    });

    r.route('/router/user/:id', h => {
      h.component((params) => UserDetailPage(params));
    });

    r.route('/router/products', {
      component: () => ProductListPage(),
    });

    r.route('/router/settings', {
      component: () => SettingsPage(),
      beforeEnter: (to, from) => {
        // 模拟守卫确认
        return confirm('确定要进入设置页面吗？');
      },
    });

    r.route('/router/about', {
      component: () => AboutPage(),
    });
  });

  // 创建演示用导航菜单
  const navMenu = vCard(nav => {
    nav.styles({ marginBottom: '16px' });
    nav.vCardHeader('🧭 快速导航');
    nav.vCardBody(content => {
      content.div(links => {
        links.styles({ display: 'flex', flexWrap: 'wrap', gap: '8px' });

        const navItems = [
          { path: '/router/home', label: '🏠 首页' },
          { path: '/router/users', label: '👥 用户列表' },
          { path: '/router/user/1', label: '👤 用户 1' },
          { path: '/router/user/2', label: '👤 用户 2' },
          { path: '/router/products', label: '📦 产品列表' },
          { path: '/router/settings', label: '⚙️ 设置（有守卫）' },
          { path: '/router/about', label: '📖 关于' },
          { path: '/router/nonexistent', label: '❌ 404 测试' },
        ];

        navItems.forEach(item => {
          links.child(vLink(item.path, btn => {
            btn.styles({
              padding: '8px 16px',
              background: '#667eea',
              color: 'white',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '14px',
              transition: 'opacity 0.2s',
            });
            btn.on('mouseenter', () => btn.style('opacity', '0.8'));
            btn.on('mouseleave', () => btn.style('opacity', '1'));
            btn.text(item.label);
          }));
        });
      });
    });
  });

  // 当前路由信息展示
  const routeInfoCard = vCard(info => {
    info.styles({ marginBottom: '16px' });
    info.vCardHeader('📍 当前路由');
    info.vCardBody(content => {
      content.div(routeDisplay => {
        routeDisplay.styles({ display: 'flex', flexDirection: 'column', gap: '8px' });

        // 当前路径
        routeDisplay.child(hstack(row => {
          row.gap('8px');
          row.child(span('当前路径：').styles({ fontWeight: '600' }));
          row.child(codeEl => {
            codeEl.styles({ background: '#f0f0f0', padding: '4px 8px', borderRadius: '4px' });
            codeEl.text(window.location.hash || '/');
          });
        }));

        // 监听路由变化更新显示
        const updateRouteInfo = () => {
          const hash = window.location.hash || '/';
          const params = router.currentParams();
          const paramsStr = Object.keys(params).length > 0
            ? JSON.stringify(params)
            : '无';

          routeDisplay.clear();

          routeDisplay.child(hstack(r1 => {
            r1.gap('8px');
            r1.child(span('当前路径：').styles({ fontWeight: '600' }));
            r1.child(code(c => {
              c.styles({ background: '#f0f0f0', padding: '4px 8px', borderRadius: '4px' });
              c.text(hash);
            }));
          }));

          routeDisplay.child(hstack(r2 => {
            r2.gap('8px');
            r2.child(span('路由参数：').styles({ fontWeight: '600' }));
            r2.child(code(c => {
              c.styles({ background: '#f0f0f0', padding: '4px 8px', borderRadius: '4px' });
              c.text(paramsStr);
            }));
          }));
        };

        window.addEventListener('hashchange', updateRouteInfo);
        updateRouteInfo();
      });
    });
  });

  return AppShell({
    currentPage: 'router.html',
    tocItems,
    content: (content) => {
      // 页面标题
      content.child(PageHeader({
        title: 'VRouter 路由',
        description: '基于 URL Hash 的轻量级路由系统，支持动态参数、查询参数、路由守卫等功能。',
      }));

      // 演示区域
      content.child(vCard(demo => {
        demo.styles({
          marginBottom: '24px',
          border: '2px solid #667eea',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
        });
        demo.vCardHeader('🎮 在线演示');
        demo.vCardBody(demoContent => {
          demoContent.child(navMenu);
          demoContent.child(routeInfoCard);
          demoContent.child(vRouterView(router, view => {
            view.styles({
              minHeight: '300px',
              padding: '20px',
              background: 'white',
              borderRadius: '8px',
            });
          }));
        });
      }));

      // 代码示例部分
      content.child(DocSection('basic', '基础用法', [
        CodeDemo('创建路由器',
          div('示例代码见右侧'),
          `// 导入路由组件
import { vRouter, vLink, vRouterView } from 'yoya';

// 创建路由器实例
const router = vRouter(r => {
  // 设置默认路径
  r.default('/home');

  // 添加路由
  r.route('/home', {
    component: () => div('首页内容')
  });

  r.route('/about', {
    component: () => div('关于页面')
  });
});

// 渲染路由视图
vRouterView(router);`
        ),

        CodeDemo('导航链接',
          div('示例代码见右侧'),
          `// 创建导航链接
vLink('/home', '返回首页');
vLink('/about', '关于页面');

// 链式调用
vLink('/user/123', link => {
  link.styles({ color: '#667eea' });
  link.text('查看用户详情');
});

// 在组件中使用
vCard(c => {
  c.vCardHeader('用户中心');
  c.vCardBody(content => {
    content.child(vLink('/profile', '个人资料'));
    content.child(vLink('/settings', '账号设置'));
  });
});`
        ),
      ]));

      content.child(DocSection('dynamic', '动态路由参数', [
        CodeDemo('定义动态路由',
          div('示例代码见右侧'),
          `// 使用 :paramName 语法定义动态参数
r.route('/user/:id', h => {
  h.component((params) => {
    const userId = params.id;
    return div('用户 ID: ' + userId);
  });
});

// 多个参数
r.route('/post/:postId/comment/:commentId', h => {
  h.component((params) => {
    const { postId, commentId } = params;
    return div('文章' + postId + '的评论' + commentId);
  });
});

// 访问参数
vLink('/user/123', '用户 123');
vLink('/user/456', '用户 456');`
        ),

        CodeDemo('获取路由参数',
          div('示例代码见右侧'),
          `// 在组件内部获取当前参数
r.route('/product/:id', {
  component: (params) => {
    return vCard(c => {
      c.vCardHeader('商品详情');
      c.vCardBody(content => {
        content.div('商品 ID: ' + params.id);

        // 或者通过路由器实例获取
        const currentParams = router.currentParams();
        content.div('当前参数：' + JSON.stringify(currentParams));
      });
    });
  }
});`
        ),
      ]));

      content.child(DocSection('query', '查询参数', [
        CodeDemo('自动解析查询参数',
          div('示例代码见右侧'),
          `// 查询参数会自动解析到 params 中
// 访问：#/search?keyword=vue&page=2

r.route('/search', {
  component: (params) => {
    return vCard(c => {
      c.vCardHeader('搜索结果');
      c.vCardBody(content => {
        content.div('关键词：' + params.keyword);  // vue
        content.div('页码：' + params.page);        // 2
      });
    });
  }
});

// 导航时带查询参数
vLink('/search?keyword=react&page=1', '搜索 React');`
        ),
      ]));

      content.child(DocSection('guards', '路由守卫', [
        CodeDemo('路由守卫',
          div('示例代码见右侧'),
          `// 全局前置守卫
r.beforeEach((to, from) => {
  console.log('即将导航到:', to.path);
  // 返回 false 可以阻止导航
  if (!isLoggedIn && to.path !== '/login') {
    alert('请先登录');
    return false;
  }
  return true;
});

// 单个路由守卫
r.route('/admin', {
  component: () => div('管理后台'),
  beforeEnter: (to, from) => {
    if (!isAdmin) {
      alert('无权访问');
      return false;
    }
    return true;
  }
});

// 全局后置钩子
r.afterEach((to, from) => {
  console.log('已从', from.path, '导航到', to.path);
  // 可用于统计页面访问等
});`
        ),
      ]));

      // API 表格
      content.child(ApiTable({
        title: 'API 参考',
        items: [
          {
            name: 'vRouter',
            description: '创建路由器实例',
            props: [
              { name: 'setup', type: 'Function', description: '初始化函数' },
            ],
            returns: 'VRouter 实例',
          },
          {
            name: 'vLink',
            description: '创建导航链接',
            props: [
              { name: 'to', type: 'String', description: '目标路径' },
              { name: 'content', type: 'String|Function', description: '链接内容或 setup 函数' },
              { name: 'setup', type: 'Function', description: '初始化函数' },
            ],
            returns: 'VLink 实例',
          },
          {
            name: 'vRouterView',
            description: '创建路由视图容器',
            props: [
              { name: 'router', type: 'VRouter', description: '路由器实例' },
              { name: 'setup', type: 'Function', description: '初始化函数' },
            ],
            returns: 'VRouterView 实例',
          },
        ],
      }));

      content.child(ApiTable({
        title: '路由器方法',
        items: [
          {
            name: 'default(path)',
            description: '设置默认路径',
            props: [
              { name: 'path', type: 'String', description: '默认路径' },
            ],
            returns: 'this',
          },
          {
            name: 'route(pattern, config)',
            description: '添加路由配置',
            props: [
              { name: 'pattern', type: 'String', description: '路由模式，支持 :param 动态参数' },
              { name: 'config', type: 'Object|Function', description: '路由配置对象或函数' },
            ],
            returns: 'this',
          },
          {
            name: 'beforeEach(guard)',
            description: '设置全局前置守卫',
            props: [
              { name: 'guard', type: 'Function', description: '守卫函数，接收 (to, from) 参数' },
            ],
            returns: 'this',
          },
          {
            name: 'afterEach(hook)',
            description: '设置全局后置钩子',
            props: [
              { name: 'hook', type: 'Function', description: '钩子函数，接收 (to, from) 参数' },
            ],
            returns: 'this',
          },
          {
            name: 'navigate(path, options)',
            description: '导航到指定路径',
            props: [
              { name: 'path', type: 'String', description: '目标路径' },
              { name: 'options.replace', type: 'Boolean', description: '是否替换历史记录' },
            ],
            returns: 'this',
          },
          {
            name: 'currentPath()',
            description: '获取当前路径',
            props: [],
            returns: 'String - 当前路径',
          },
          {
            name: 'currentParams()',
            description: '获取当前路由参数',
            props: [],
            returns: 'Object - 参数对象',
          },
          {
            name: 'back()',
            description: '后退一页',
            props: [],
            returns: 'this',
          },
          {
            name: 'forward()',
            description: '前进一页',
            props: [],
            returns: 'this',
          },
          {
            name: 'go(delta)',
            description: '前进/后退指定步数',
            props: [
              { name: 'delta', type: 'Number', description: '步数，负数后退，正数前进' },
            ],
            returns: 'this',
          },
        ],
      }));

      // 使用提示
      content.child(vCard(tips => {
        tips.styles({ marginTop: '24px' });
        tips.vCardHeader('💡 使用提示');
        tips.vCardBody(content => {
          content.ul(list => {
            list.li('VRouter 基于 Hash 实现，URL 格式为 #/path');
            list.li('动态参数使用 :paramName 语法定义');
            list.li('查询参数自动解析到 component 的 params 参数中');
            list.li('beforeEnter 守卫返回 false 可阻止导航');
            list.li('使用 vLink 组件创建声明式导航链接');
            list.li('vRouterView 用于在指定位置渲染路由内容');
          });
        });
      }));
    },
  });
}
