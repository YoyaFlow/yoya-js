/**
 * VRouterViews 示例页面
 * 演示多路由视图容器的使用
 */

import {
  div, span,
  h2, h3, h4,
  p, ul, li,
  input, textarea, select, option,
  button,
  nav,
  table, thead, tbody, tr, th, td,
  vBody,
  vRouter,
  vRouterViews,
  vLink,
  vCard,
  vCardHeader,
  vCardBody,
  toast,
} from '../index.js';

// 创建首页内容
function createHomePage() {
  return div(box => {
    box.styles({ padding: '24px' });
    box.vCard(card => {
      card.vCardHeader('欢迎使用 VRouterViews');
      card.vCardBody(c => {
        c.div(box => {
          box.styles({ marginBottom: '16px' });
          box.h3('什么是 VRouterViews？');
          box.p('VRouterViews 是一个多路由视图容器，允许您在同一个页面中管理多个路由视图。它的设计类似于 Tabs，但每个标签页都有独立的路由。');
        });

        c.div(box => {
          box.styles({ marginBottom: '16px' });
          box.h3('主要特性');
          box.ul(list => {
            list.li('支持多个独立的路由视图');
            list.li('每个视图可以有自己的子路由');
            list.li('支持视图切换和关闭');
            list.li('与 VRouter 无缝集成');
          });
        });

        c.div(box => {
          box.styles({
            display: 'flex',
            gap: '12px',
            padding: '16px',
            background: 'var(--yoya-bg-secondary)',
            borderRadius: '8px'
          });
          box.p('👈 点击左侧导航试试，每个视图都有独立的路由！');
        });
      });
    });
  });
}

// 创建用户列表页面
function createUserListPage() {
  const users = [
    { id: 1, name: '张三', email: 'zhangsan@example.com', role: '管理员' },
    { id: 2, name: '李四', email: 'lisi@example.com', role: '编辑' },
    { id: 3, name: '王五', email: 'wangwu@example.com', role: '用户' },
    { id: 4, name: '赵六', email: 'zhaoliu@example.com', role: '用户' },
  ];

  return div(box => {
    box.styles({ padding: '24px' });

    box.h2('用户列表');
    box.p('这是一个用户管理页面的示例');

    box.div(tableBox => {
      tableBox.styles({
        marginTop: '20px',
        background: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      });
      box.table(table => {
        table.styles({ width: '100%', borderCollapse: 'collapse' });

        // 表头
        table.thead(thead => {
          thead.tr(tr => {
            tr.th(th => {
              th.text('ID');
              th.styles({ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb', background: '#f9fafb' });
            });
            tr.th(th => {
              th.text('姓名');
              th.styles({ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb', background: '#f9fafb' });
            });
            tr.th(th => {
              th.text('邮箱');
              th.styles({ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb', background: '#f9fafb' });
            });
            tr.th(th => {
              th.text('角色');
              th.styles({ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb', background: '#f9fafb' });
            });
            tr.th(th => {
              th.text('操作');
              th.styles({ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb', background: '#f9fafb' });
            });
          });
        });

        // 表体
        table.tbody(tbody => {
          users.forEach((user, index) => {
            tbody.tr(tr => {
              tr.td(td => {
                td.text(user.id);
                td.styles({ padding: '12px', borderBottom: '1px solid #e5e7eb' });
              });
              tr.td(td => {
                td.div(box => {
                  box.styles({ display: 'flex', alignItems: 'center', gap: '8px' });
                  box.span(a => {
                    a.styles({
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#3b82f6',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    });
                    a.text(user.name.charAt(0));
                  });
                  box.text(user.name);
                });
                td.styles({ padding: '12px', borderBottom: '1px solid #e5e7eb' });
              });
              tr.td(td => {
                td.text(user.email);
                td.styles({ padding: '12px', borderBottom: '1px solid #e5e7eb', color: '#6b7280' });
              });
              tr.td(td => {
                td.span(span => {
                  span.text(user.role);
                  const colors = {
                    '管理员': { background: '#fee2e2', color: '#dc2626' },
                    '编辑': { background: '#dbeafe', color: '#2563eb' },
                    '用户': { background: '#d1fae5', color: '#059669' }
                  };
                  span.styles({
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500',
                    ...(colors[user.role] || {})
                  });
                });
                td.styles({ padding: '12px', borderBottom: '1px solid #e5e7eb' });
              });
              tr.td(td => {
                td.button(btn => {
                  btn.text('编辑');
                  btn.styles({
                    padding: '6px 12px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  });
                  btn.on('click', () => {
                    toast.info(`编辑用户：${user.name}`);
                  });
                });
                td.styles({ padding: '12px', borderBottom: '1px solid #e5e7eb' });
              });
            });
          });
        });
      });
    });
  });
}

// 创建设置页面
function createSettingsPage() {
  return div(box => {
    box.styles({ padding: '24px', maxWidth: '600px' });

    box.h2('系统设置');

    // 常规设置
    box.vCard(card => {
      card.styles({ marginTop: '20px' });
      card.vCardHeader('常规设置');
      card.vCardBody(c => {
        c.div(item => {
          item.styles({ marginBottom: '16px' });
          item.h4('站点名称');
          item.input(inp => {
            inp.type('text');
            inp.value('我的网站');
            inp.styles({
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '14px'
            });
          });
        });

        c.div(item => {
          item.styles({ marginBottom: '16px' });
          item.h4('站点描述');
          item.textarea(ta => {
            ta.rows(3);
            ta.text('这是一个示例网站描述');
            ta.styles({
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '14px',
              resize: 'vertical'
            });
          });
        });

        c.div(item => {
          item.styles({ marginBottom: '16px' });
          item.h4('时区');
          item.select(sel => {
            sel.styles({
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '14px'
            });
            sel.option(o => { o.value('UTC'); o.text('UTC'); });
            sel.option(o => { o.value('Asia/Shanghai'); o.text('北京时间 (UTC+8)'); });
            sel.option(o => { o.value('Asia/Tokyo'); o.text('东京时间 (UTC+9)'); });
          });
        });
      });
    });

    // 通知设置
    box.vCard(card => {
      card.styles({ marginTop: '20px' });
      card.vCardHeader('通知设置');
      card.vCardBody(c => {
        c.div(item => {
          item.styles({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 0'
          });
          item.span('邮件通知');
          item.input(inp => {
            inp.type('checkbox');
            inp.attr('checked', true);
          });
        });

        c.div(item => {
          item.styles({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 0'
          });
          item.span('浏览器推送');
          item.input(inp => {
            inp.type('checkbox');
          });
        });

        c.div(item => {
          item.styles({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 0'
          });
          item.span('短信通知');
          item.input(inp => {
            inp.type('checkbox');
          });
        });
      });
    });

    // 保存按钮
    box.div(btnBox => {
      btnBox.styles({ marginTop: '24px', display: 'flex', gap: '12px' });
      btnBox.button(btn => {
        btn.text('保存设置');
        btn.styles({
          padding: '10px 20px',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '14px',
          cursor: 'pointer'
        });
        btn.on('click', () => {
          toast.success('设置已保存');
        });
      });
      btnBox.button(btn => {
        btn.text('重置');
        btn.styles({
          padding: '10px 20px',
          background: '#6b7280',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '14px',
          cursor: 'pointer'
        });
      });
    });
  });
}

// 创建数据分析页面
function createAnalyticsPage() {
  return div(box => {
    box.styles({ padding: '24px' });

    box.h2('数据分析');
    box.p('查看网站流量和用户行为数据');

    // 数据卡片
    box.div(statsBox => {
      statsBox.styles({
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginTop: '20px'
      });

      // 今日访问
      statsBox.vCard(card => {
        card.vCardBody(c => {
          c.div(box => {
            box.styles({ color: '#6b7280', fontSize: '14px', marginBottom: '8px' });
            box.text('今日访问');
          });
          c.div(box => {
            box.styles({ fontSize: '28px', fontWeight: 'bold', color: '#3b82f6' });
            box.text('1,234');
          });
          c.div(box => {
            box.styles({ fontSize: '12px', color: '#10b981', marginTop: '4px' });
            box.text('↑ 12.5% 较昨日');
          });
        });
      });

      // 总用户
      statsBox.vCard(card => {
        card.vCardBody(c => {
          c.div(box => {
            box.styles({ color: '#6b7280', fontSize: '14px', marginBottom: '8px' });
            box.text('总用户');
          });
          c.div(box => {
            box.styles({ fontSize: '28px', fontWeight: 'bold', color: '#10b981' });
            box.text('5,678');
          });
          c.div(box => {
            box.styles({ fontSize: '12px', color: '#10b981', marginTop: '4px' });
            box.text('↑ 8.2% 较上周');
          });
        });
      });

      // 订单数量
      statsBox.vCard(card => {
        card.vCardBody(c => {
          c.div(box => {
            box.styles({ color: '#6b7280', fontSize: '14px', marginBottom: '8px' });
            box.text('订单数量');
          });
          c.div(box => {
            box.styles({ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' });
            box.text('892');
          });
          c.div(box => {
            box.styles({ fontSize: '12px', color: '#ef4444', marginTop: '4px' });
            box.text('↓ 3.1% 较昨日');
          });
        });
      });

      // 转化率
      statsBox.vCard(card => {
        card.vCardBody(c => {
          c.div(box => {
            box.styles({ color: '#6b7280', fontSize: '14px', marginBottom: '8px' });
            box.text('转化率');
          });
          c.div(box => {
            box.styles({ fontSize: '28px', fontWeight: 'bold', color: '#8b5cf6' });
            box.text('3.2%');
          });
          c.div(box => {
            box.styles({ fontSize: '12px', color: '#10b981', marginTop: '4px' });
            box.text('↑ 1.2% 较上周');
          });
        });
      });
    });

    // 图表区域
    box.vCard(card => {
      card.styles({ marginTop: '20px' });
      card.vCardHeader('访问趋势');
      card.vCardBody(c => {
        c.div(chart => {
          chart.styles({
            height: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f9fafb',
            borderRadius: '8px'
          });
          chart.text('📈 图表占位区域 - 可集成 ECharts');
        });
      });
    });
  });
}

// 创建 404 页面
function createNotFoundPage() {
  return div(box => {
    box.styles({
      padding: '40px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%'
    });

    box.h1('404');
    box.styles({ fontSize: '72px', color: '#e5e7eb', marginBottom: '16px' });

    box.h2('页面不存在');
    box.styles({ color: '#6b7280', marginBottom: '24px' });

    box.p('您访问的路由不存在，请检查 URL 是否正确');

    box.button(btn => {
      btn.text('返回首页');
      btn.styles({
        marginTop: '20px',
        padding: '10px 20px',
        background: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '14px',
        cursor: 'pointer'
      });
      btn.on('click', () => {
        // 导航到首页
        window.location.hash = '/';
      });
    });
  });
}

// 主应用
function App() {
  return vBody(body => {
    body.styles({ display: 'flex', height: '100%' });

    // 左侧导航栏
    body.div(sidebar => {
      sidebar.styles({
        width: '220px',
        background: 'var(--yoya-bg-secondary)',
        borderRight: '1px solid var(--yoya-border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px'
      });

      // Logo
      sidebar.div(logo => {
        logo.styles({
          padding: '12px',
          marginBottom: '24px',
          fontSize: '18px',
          fontWeight: 'bold',
          color: 'var(--yoya-text-primary)'
        });
        logo.text('🚀 VRouterViews');
      });

      // 导航菜单
      sidebar.nav(nav => {
        nav.styles({ display: 'flex', flexDirection: 'column', gap: '8px' });

        // 首页链接
        nav.child(vLink('/home', link => {
          link.text('🏠 首页');
          link.styles({
            padding: '10px 12px',
            borderRadius: '6px',
            textDecoration: 'none',
            color: 'var(--yoya-text-secondary)',
            transition: 'all 0.15s ease'
          });
          link.on('mouseenter', function() {
            this.style('background', 'var(--yoya-bg-hover)');
          });
          link.on('mouseleave', function() {
            this.style('background', 'transparent');
          });
        }));

        // 用户管理链接
        nav.child(vLink('/users', link => {
          link.text('👥 用户管理');
          link.styles({
            padding: '10px 12px',
            borderRadius: '6px',
            textDecoration: 'none',
            color: 'var(--yoya-text-secondary)',
            transition: 'all 0.15s ease'
          });
        }));

        // 设置链接
        nav.child(vLink('/settings', link => {
          link.text('⚙️ 设置');
          link.styles({
            padding: '10px 12px',
            borderRadius: '6px',
            textDecoration: 'none',
            color: 'var(--yoya-text-secondary)',
            transition: 'all 0.15s ease'
          });
        }));

        // 数据分析链接
        nav.child(vLink('/analytics', link => {
          link.text('📊 数据分析');
          link.styles({
            padding: '10px 12px',
            borderRadius: '6px',
            textDecoration: 'none',
            color: 'var(--yoya-text-secondary)',
            transition: 'all 0.15s ease'
          });
        }));
      });

      // 提示信息
      sidebar.div(tip => {
        tip.styles({
          marginTop: 'auto',
          padding: '12px',
          background: 'var(--yoya-bg)',
          borderRadius: '6px',
          fontSize: '12px',
          color: 'var(--yoya-text-secondary)'
        });
        tip.text('💡 每个视图都有独立路由');
      });
    });

    // 右侧内容区
    body.div(main => {
      main.styles({ flex: 1, overflow: 'hidden' });

      // 顶部导航栏
      main.div(header => {
        header.styles({
          height: '56px',
          borderBottom: '1px solid var(--yoya-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          background: 'var(--yoya-bg)'
        });

        header.h3(title => {
          title.text('VRouterViews 演示');
          title.styles({ fontSize: '16px', fontWeight: '500' });
        });

        header.div(actions => {
          actions.button(btn => {
            btn.text('➕ 添加视图');
            btn.styles({
              padding: '8px 16px',
              background: 'var(--yoya-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '13px',
              cursor: 'pointer'
            });
            btn.on('click', () => {
              toast.info('添加新视图功能演示中...');
            });
          });
        });
      });

      // 主路由器
      main.vRouter(router => {
        router.default('/home');

        // 定义路由
        router.route('/home', {
          component: createHomePage
        });
        router.route('/users', {
          component: createUserListPage
        });
        router.route('/settings', {
          component: createSettingsPage
        });
        router.route('/analytics', {
          component: createAnalyticsPage
        });
        router.route('*', {
          component: createNotFoundPage
        });

        // VRouterViews 多视图容器
        router.div(content => {
          content.styles({
            height: 'calc(100% - 56px)',
            overflow: 'hidden'
          });

          content.vRouterViews(router, views => {
            // 添加多个可切换的视图
            views.addView('home', {
              title: '🏠 首页',
              icon: '🏠',
              closable: false,
              defaultRoute: '/home'
            });
            views.addView('users', {
              title: '👥 用户管理',
              icon: '👥',
              closable: true,
              defaultRoute: '/users'
            });
            views.addView('settings', {
              title: '⚙️ 设置',
              icon: '⚙️',
              closable: true,
              defaultRoute: '/settings'
            });
            views.addView('analytics', {
              title: '📊 数据分析',
              icon: '📊',
              closable: true,
              defaultRoute: '/analytics'
            });

            // 监听视图变化
            views.onChange((viewName) => {
              console.log('切换到视图:', viewName);
              toast.info(`切换到：${viewName}`);
            });

            // 默认激活首页
            views.setActiveView('home');
          });
        });
      });
    });
  });
}

// 渲染应用
const app = App();
app.bindTo('#app');

// 显示欢迎提示
setTimeout(() => {
  toast.success('VRouterViews 演示页面加载完成');
}, 500);
