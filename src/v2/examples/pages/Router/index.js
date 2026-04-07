/**
 * Yoya.Basic V2 - Router Page
 * VRouter 路由组件演示页面
 * 展示基于 Hash 的路由系统，支持路由匹配、参数提取、导航守卫等功能
 */

import {
  flex, grid, responsiveGrid, vstack, hstack,
  vCard, vCardHeader, vCardBody,
  vButton, toast,
  vRouter, vLink, vRouterView, vRouterViews,
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
// VRouterViews 演示用页面组件
// ============================================

/**
 * VRouterViews 演示 - 欢迎页
 */
function RVWelcomePage() {
  return div(box => {
    box.styles({ padding: '16px' });
    box.h3('🎉 欢迎使用 VRouterViews');
    box.p('VRouterViews 是一个多路由视图容器，允许在同一个页面中管理多个路由视图。');
    box.div(tips => {
      tips.styles({
        marginTop: '16px',
        padding: '12px',
        background: '#e8f4f8',
        borderRadius: '6px',
      });
      tips.div('💡 每个标签页都有独立的路由，可以单独导航。');
    });
  });
}

/**
 * VRouterViews 演示 - 用户管理页
 */
function RVUserManagePage() {
  return div(box => {
    box.styles({ padding: '16px' });
    box.h3('👥 用户管理');

    const users = [
      { name: '张三', email: 'zhangsan@example.com', role: '管理员' },
      { name: '李四', email: 'lisi@example.com', role: '编辑' },
      { name: '王五', email: 'wangwu@example.com', role: '用户' },
    ];

    box.div(tableBox => {
      tableBox.styles({
        marginTop: '12px',
        background: 'white',
        borderRadius: '6px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      });
      box.table(table => {
        table.styles({ width: '100%', borderCollapse: 'collapse' });
        table.thead(thead => {
          thead.tr(tr => {
            tr.th(th => { th.text('姓名'); th.styles({ padding: '10px', borderBottom: '2px solid #e5e7eb', background: '#f9fafb' }); });
            tr.th(th => { th.text('邮箱'); th.styles({ padding: '10px', borderBottom: '2px solid #e5e7eb', background: '#f9fafb' }); });
            tr.th(th => { th.text('角色'); th.styles({ padding: '10px', borderBottom: '2px solid #e5e7eb', background: '#f9fafb' }); });
          });
        });
        table.tbody(tbody => {
          users.forEach(user => {
            tbody.tr(tr => {
              tr.td(td => { td.text(user.name); td.styles({ padding: '10px', borderBottom: '1px solid #e5e7eb' }); });
              tr.td(td => { td.text(user.email); td.styles({ padding: '10px', borderBottom: '1px solid #e5e7eb', color: '#666' }); });
              tr.td(td => {
                td.span(s => {
                  s.text(user.role);
                  const colors = {
                    '管理员': { background: '#fee2e2', color: '#dc2626' },
                    '编辑': { background: '#dbeafe', color: '#2563eb' },
                    '用户': { background: '#d1fae5', color: '#059669' },
                  };
                  s.styles({ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', ...(colors[user.role] || {}) });
                });
                td.styles({ padding: '10px', borderBottom: '1px solid #e5e7eb' });
              });
            });
          });
        });
      });
    });
  });
}

/**
 * VRouterViews 演示 - 系统设置页
 */
function RVSettingsPage() {
  return div(box => {
    box.styles({ padding: '16px', maxWidth: '500px' });
    box.h3('⚙️ 系统设置');

    box.vCard(card => {
      card.styles({ marginTop: '12px' });
      card.vCardBody(c => {
        c.div(item => {
          item.styles({ marginBottom: '12px' });
          item.h4('站点名称');
          item.input(inp => {
            inp.type('text');
            inp.value('我的网站');
            inp.styles({ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' });
          });
        });
        c.div(item => {
          item.styles({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 0',
          });
          item.span('邮件通知');
          item.input(inp => { inp.type('checkbox'); inp.attr('checked', true); });
        });
        c.div(item => {
          item.styles({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 0',
          });
          item.span('浏览器推送');
          item.input(inp => { inp.type('checkbox'); });
        });
      });
    });

    box.div(btnBox => {
      btnBox.styles({ marginTop: '16px', display: 'flex', gap: '8px' });
      btnBox.button(btn => {
        btn.text('保存设置');
        btn.styles({ padding: '8px 16px', background: '#667eea', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' });
        btn.on('click', () => toast.success('设置已保存'));
      });
    });
  });
}

/**
 * VRouterViews 演示 - 数据分析页
 */
function RVAnalyticsPage() {
  return div(box => {
    box.styles({ padding: '16px' });
    box.h3('📊 数据分析');

    // 数据卡片
    box.div(statsBox => {
      statsBox.styles({
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        marginTop: '16px',
      });

      const stats = [
        { title: '今日访问', value: '1,234', trend: '↑ 12.5%', color: '#3b82f6' },
        { title: '总用户', value: '5,678', trend: '↑ 8.2%', color: '#10b981' },
        { title: '订单数量', value: '892', trend: '↓ 3.1%', color: '#f59e0b' },
        { title: '转化率', value: '3.2%', trend: '↑ 1.2%', color: '#8b5cf6' },
      ];

      stats.forEach(stat => {
        statsBox.child(vCard(s => {
          s.vCardBody(c => {
            c.div(box => {
              box.styles({ color: '#666', fontSize: '14px' });
              box.text(stat.title);
            });
            c.div(box => {
              box.styles({ fontSize: '24px', fontWeight: 'bold', color: stat.color, marginTop: '8px' });
              box.text(stat.value);
            });
            c.div(box => {
              box.styles({ fontSize: '12px', color: stat.trend.startsWith('↑') ? '#10b981' : '#ef4444', marginTop: '4px' });
              box.text(stat.trend);
            });
          });
        }));
      });
    });
  });
}

// ============================================
// VRouterViews 路由联动演示组件
// ============================================

/**
 * 产品列表视图
 */
function ProductsView() {
  return vCard(c => {
    c.vCardHeader('📄 产品列表');
    c.vCardBody(content => {
      content.div(products => {
        products.styles({ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' });

        const productList = [
          { name: '笔记本电脑', price: '¥5,999', sales: 1234, icon: '💻' },
          { name: '无线鼠标', price: '¥199', sales: 5678, icon: '🖱️' },
          { name: '机械键盘', price: '¥399', sales: 3456, icon: '⌨️' },
          { name: '显示器', price: '¥1,899', sales: 890, icon: '🖥️' },
          { name: '耳机', price: '¥299', sales: 2345, icon: '🎧' },
          { name: '摄像头', price: '¥459', sales: 1567, icon: '📷' },
        ];

        productList.forEach(product => {
          products.child(vCard(p => {
            p.styles({ cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' });
            p.on('mouseenter', () => p.style('transform', 'translateY(-4px)'));
            p.on('mouseleave', () => p.style('transform', 'translateY(0)'));
            p.vCardBody(c => {
              c.div(icon => {
                icon.styles({ fontSize: '32px', textAlign: 'center', marginBottom: '12px' });
                icon.text(product.icon);
              });
              c.div(product.name);
              c.div(d => {
                d.styles({ color: '#667eea', fontWeight: '600', marginTop: '8px' });
                d.text(product.price);
              });
              c.div(sales => {
                sales.styles({ fontSize: '12px', color: '#999', marginTop: '4px' });
                sales.text(`月销 ${product.sales}`);
              });
            });
          }));
        });
      });
    });
  });
}

/**
 * 客户管理视图
 */
function CustomersView() {
  return vCard(c => {
    c.vCardHeader('👤 客户管理');
    c.vCardBody(content => {
      content.div(customers => {
        customers.styles({ display: 'flex', flexDirection: 'column', gap: '12px' });

        const customersList = [
          { name: '张三', email: 'zhangsan@example.com', company: '阿里巴巴', status: 'active', avatar: '👨' },
          { name: '李四', email: 'lisi@example.com', company: '腾讯', status: 'active', avatar: '👩' },
          { name: '王五', email: 'wangwu@example.com', company: '字节跳动', status: 'inactive', avatar: '👨‍🦱' },
          { name: '赵六', email: 'zhaoliu@example.com', company: '华为', status: 'active', avatar: '👩‍🦰' },
          { name: '孙七', email: 'sunqi@example.com', company: '小米', status: 'pending', avatar: '👨‍🦳' },
        ];

        customersList.forEach(customer => {
          customers.child(vCard(item => {
            item.styles({ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px' });
            item.vCardBody(c => {
              c.div(avatar => {
                avatar.styles({ fontSize: '40px', width: '50px', textAlign: 'center' });
                avatar.text(customer.avatar);
              });
              c.div(info => {
                info.styles({ flex: 1 });
                info.div(name => {
                  name.styles({ fontWeight: '600', fontSize: '16px' });
                  name.text(customer.name);
                });
                info.div(email => {
                  email.styles({ fontSize: '13px', color: '#666', marginTop: '4px' });
                  email.text(customer.email);
                });
                info.div(company => {
                  company.styles({ fontSize: '12px', color: '#999', marginTop: '4px' });
                  company.text(customer.company);
                });
              });
              c.div(status => {
                const statusColors = { active: '#10b981', inactive: '#ef4444', pending: '#f59e0b' };
                const statusTexts = { active: '活跃', inactive: '离线', pending: '待审核' };
                status.styles({
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  background: statusColors[customer.status],
                  color: 'white',
                });
                status.text(statusTexts[customer.status]);
              });
            });
          }));
        });
      });
    });
  });
}

/**
 * 订单中心视图
 */
function OrdersView() {
  return vCard(c => {
    c.vCardHeader('📊 订单中心');
    c.vCardBody(content => {
      // 订单统计
      content.div(stats => {
        stats.styles({ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' });

        const orderStats = [
          { title: '待付款', value: '23', color: '#f59e0b' },
          { title: '待发货', value: '15', color: '#3b82f6' },
          { title: '待收货', value: '8', color: '#8b5cf6' },
          { title: '已完成', value: '1,234', color: '#10b981' },
        ];

        orderStats.forEach(stat => {
          stats.child(div(box => {
            box.styles({ padding: '16px', borderRadius: '8px', background: '#f9fafb', textAlign: 'center' });
            box.div(title => {
              title.styles({ fontSize: '13px', color: '#666' });
              title.text(stat.title);
            });
            box.div(value => {
              value.styles({ fontSize: '24px', fontWeight: 'bold', color: stat.color, marginTop: '8px' });
              value.text(stat.value);
            });
          }));
        });
      });

      // 订单列表
      content.div(orders => {
        orders.styles({ display: 'flex', flexDirection: 'column', gap: '12px' });

        const ordersList = [
          { id: 'ORD-2024-001', product: 'MacBook Pro 14"', amount: '¥12,999', status: 'completed', date: '2024-01-15' },
          { id: 'ORD-2024-002', product: 'AirPods Pro', amount: '¥1,899', status: 'pending', date: '2024-01-16' },
          { id: 'ORD-2024-003', product: 'Magic Mouse', amount: '¥699', status: 'shipped', date: '2024-01-17' },
          { id: 'ORD-2024-004', product: 'Studio Display', amount: '¥11,499', status: 'processing', date: '2024-01-18' },
        ];

        ordersList.forEach(order => {
          orders.child(vCard(item => {
            item.styles({ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px' });
            item.vCardBody(c => {
              c.div(id => {
                id.styles({ fontFamily: 'monospace', fontSize: '13px', color: '#667eea' });
                id.text(order.id);
              });
              c.div(product => {
                product.styles({ flex: 1, fontWeight: '500' });
                product.text(order.product);
              });
              c.div(amount => {
                amount.styles({ fontWeight: '600', color: '#667eea' });
                amount.text(order.amount);
              });
              c.div(status => {
                const statusColors = { completed: '#10b981', pending: '#f59e0b', shipped: '#3b82f6', processing: '#8b5cf6' };
                const statusTexts = { completed: '已完成', pending: '待处理', shipped: '已发货', processing: '处理中' };
                status.styles({
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  background: statusColors[order.status],
                  color: 'white',
                });
                status.text(statusTexts[order.status]);
              });
              c.div(date => {
                date.styles({ fontSize: '12px', color: '#999' });
                date.text(order.date);
              });
            });
          }));
        });
      });
    });
  });
}

/**
 * 系统配置视图
 */
function SystemConfigView() {
  return vCard(c => {
    c.vCardHeader('⚙️ 系统配置');
    c.vCardBody(content => {
      content.div(configs => {
        configs.styles({ display: 'flex', flexDirection: 'column', gap: '16px' });

        const configSections = [
          {
            title: '基本设置',
            items: [
              { label: '网站名称', value: 'Yoja.Basic V2', type: 'text' },
              { label: '管理员邮箱', value: 'admin@example.com', type: 'email' },
            ]
          },
          {
            title: '安全设置',
            items: [
              { label: '双因素认证', value: '已启用', type: 'toggle', enabled: true },
              { label: '会话超时', value: '30 分钟', type: 'select' },
            ]
          },
          {
            title: '通知设置',
            items: [
              { label: '邮件通知', value: '已启用', type: 'toggle', enabled: true },
              { label: '短信通知', value: '未启用', type: 'toggle', enabled: false },
            ]
          },
        ];

        configSections.forEach(section => {
          configs.child(vCard(box => {
            box.styles({ padding: '16px' });
            box.vCardBody(c => {
              c.div(title => {
                title.styles({ fontWeight: '600', fontSize: '15px', marginBottom: '16px', color: '#374151' });
                title.text(section.title);
              });
              c.div(items => {
                items.styles({ display: 'flex', flexDirection: 'column', gap: '12px' });
                section.items.forEach(item => {
                  items.child(div(row => {
                    row.styles({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f9fafb', borderRadius: '8px' });
                    row.div(label => {
                      label.styles({ fontSize: '14px', color: '#374151' });
                      label.text(item.label);
                    });
                    row.div(value => {
                      if (item.type === 'toggle') {
                        value.styles({
                          width: '44px',
                          height: '24px',
                          borderRadius: '12px',
                          background: item.enabled ? '#10b981' : '#d1d5db',
                          position: 'relative',
                          cursor: 'pointer',
                        });
                        value.div(knob => {
                          knob.styles({
                            position: 'absolute',
                            top: '2px',
                            left: item.enabled ? '22px' : '2px',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: 'white',
                            transition: 'left 0.2s',
                          });
                        });
                      } else {
                        value.styles({ fontSize: '14px', color: '#6b7280' });
                        value.text(item.value);
                      }
                    });
                  }));
                });
              });
            });
          }));
        });
      });
    });
  });
}

/**
 * 默认路径视图（用于未知路径）
 */
function DefaultPathView(pathStr) {
  return div(box => {
    box.styles({
      padding: '20px',
      textAlign: 'center',
      color: '#666',
    });
    box.div(line1 => {
      line1.child(span('📍 路由路径：'));
      line1.child(code(pathStr));
    });
    box.div(line2 => {
      line2.styles({ marginTop: '8px' });
      line2.text('这是一个动态路由视图');
    });
    box.div(line3 => {
      line3.styles({ marginTop: '16px', fontSize: '13px', color: '#999' });
      line3.text('点击上方按钮添加更多演示视图');
    });
  });
}

/**
 * 数据分析视图
 */
function AnalyticsView() {
  return vCard(c => {
    c.vCardHeader('📈 数据分析');
    c.vCardBody(content => {
      content.div(stats => {
        stats.styles({ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' });
        const statsData = [
          { title: '访问量', value: '12,345', change: '+12.5%' },
          { title: '转化率', value: '3.2%', change: '+0.8%' },
          { title: '留存率', value: '68%', change: '+2.1%' },
          { title: 'GMV', value: '¥89.6K', change: '+15.3%' },
        ];
        statsData.forEach(stat => {
          stats.child(div(box => {
            box.styles({ padding: '16px', background: '#f9fafb', borderRadius: '8px' });
            box.div(title => {
              title.styles({ fontSize: '13px', color: '#666' });
              title.text(stat.title);
            });
            box.div(value => {
              value.styles({ fontSize: '24px', fontWeight: 'bold', color: '#667eea', marginTop: '8px' });
              value.text(stat.value);
            });
            box.div(change => {
              change.styles({ fontSize: '12px', color: '#10b981', marginTop: '4px' });
              change.text(stat.change);
            });
          }));
        });
      });
    });
  });
}

/**
 * 报表生成视图
 */
function ReportsView() {
  return vCard(c => {
    c.vCardHeader('📝 报表生成');
    c.vCardBody(content => {
      content.div(reports => {
        reports.styles({ display: 'flex', flexDirection: 'column', gap: '12px' });
        const reportsList = [
          { name: '销售日报', time: '每天 9:00 自动生成', status: '已生成' },
          { name: '用户周报', time: '每周一 10:00 自动生成', status: '已生成' },
          { name: '月度分析', time: '每月 1 号生成', status: '待生成' },
        ];
        reportsList.forEach(report => {
          reports.child(div(item => {
            item.styles({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f9fafb', borderRadius: '8px' });
            item.div(info => {
              info.div(name => {
                name.styles({ fontWeight: '600' });
                name.text(report.name);
              });
              info.div(time => {
                time.styles({ fontSize: '12px', color: '#999', marginTop: '4px' });
                time.text(report.time);
              });
            });
            item.span(status => {
              status.styles({
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                background: report.status === '已生成' ? '#d1fae5' : '#fef3c7',
                color: report.status === '已生成' ? '#059669' : '#d97706',
              });
              status.text(report.status);
            });
          }));
        });
      });
    });
  });
}

/**
 * 消息通知视图
 */
function NotificationsView() {
  return vCard(c => {
    c.vCardHeader('🔔 消息通知');
    c.vCardBody(content => {
      content.div(notifications => {
        notifications.styles({ display: 'flex', flexDirection: 'column', gap: '12px' });
        const notificationsList = [
          { icon: '📢', title: '系统公告', message: '系统将于今晚 23:00 进行维护', time: '10 分钟前' },
          { icon: '💰', title: '订单提醒', message: '您有一笔新订单待处理', time: '30 分钟前' },
          { icon: '👤', title: '用户反馈', message: '收到 3 条新的用户反馈', time: '1 小时前' },
        ];
        notificationsList.forEach(notif => {
          notifications.child(div(item => {
            item.styles({ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', background: '#f9fafb', borderRadius: '8px' });
            item.div(icon => {
              icon.styles({ fontSize: '24px' });
              icon.text(notif.icon);
            });
            item.div(content => {
              content.styles({ flex: 1 });
              content.div(title => {
                title.styles({ fontWeight: '600', fontSize: '14px' });
                title.text(notif.title);
              });
              content.div(message => {
                message.styles({ fontSize: '13px', color: '#666', marginTop: '4px' });
                message.text(notif.message);
              });
            });
            item.div(time => {
              time.styles({ fontSize: '12px', color: '#999' });
              time.text(notif.time);
            });
          }));
        });
      });
    });
  });
}

/**
 * 文件管理视图
 */
function FilesView() {
  return vCard(c => {
    c.vCardHeader('📁 文件管理');
    c.vCardBody(content => {
      content.div(files => {
        files.styles({ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' });
        const filesList = [
          { name: '项目文档', type: 'folder', count: '12 个文件' },
          { name: '设计资源', type: 'folder', count: '28 个文件' },
          { name: '数据导出', type: 'folder', count: '5 个文件' },
          { name: 'report.pdf', type: 'file', size: '2.4 MB' },
          { name: 'data.xlsx', type: 'file', size: '1.1 MB' },
          { name: 'backup.zip', type: 'file', size: '15.6 MB' },
        ];
        filesList.forEach(file => {
          files.child(div(item => {
            item.styles({ padding: '16px', background: '#f9fafb', borderRadius: '8px', textAlign: 'center', cursor: 'pointer' });
            item.on('mouseenter', () => item.style('background', '#f3f4f6'));
            item.on('mouseleave', () => item.style('background', '#f9fafb'));
            item.div(icon => {
              icon.styles({ fontSize: '32px', marginBottom: '8px' });
              icon.text(file.type === 'folder' ? '📁' : '📄');
            });
            item.div(name => {
              name.styles({ fontWeight: '500', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' });
              name.text(file.name);
            });
            item.div(info => {
              info.styles({ fontSize: '12px', color: '#999', marginTop: '4px' });
              info.text(file.type === 'folder' ? file.count : file.size);
            });
          }));
        });
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
    { text: '多视图容器', href: '#rvbasic', level: 1 },
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

    // VRouterViews 演示路由
    r.route('/rv/home', { component: () => RVWelcomePage() });
    r.route('/rv/users', { component: () => RVUserManagePage() });
    r.route('/rv/settings', { component: () => RVSettingsPage() });
    r.route('/rv/analytics', { component: () => RVAnalyticsPage() });
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
            codeEl.styles({ background: 'var(--yoya-bg-tertiary)', padding: '4px 8px', borderRadius: '4px' });
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
              c.styles({ background: 'var(--yoya-bg-tertiary)', padding: '4px 8px', borderRadius: '4px' });
              c.text(hash);
            }));
          }));

          routeDisplay.child(hstack(r2 => {
            r2.gap('8px');
            r2.child(span('路由参数：').styles({ fontWeight: '600' }));
            r2.child(code(c => {
              c.styles({ background: 'var(--yoya-bg-tertiary)', padding: '4px 8px', borderRadius: '4px' });
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

      // VRouterViews 演示区域 - 基础演示
      const rvNavMenu = vCard(nav => {
        nav.styles({ marginBottom: '12px' });
        nav.vCardHeader('🗂️ 视图切换');
        nav.vCardBody(content => {
          content.div(links => {
            links.styles({ display: 'flex', flexWrap: 'wrap', gap: '8px' });
            links.div(tip => {
              tip.styles({ fontSize: '13px', color: '#666' });
              tip.text('点击下方按钮切换视图，每个视图有独立路由。');
            });
          });
        });
      });

      // VRouterViews 演示区域 - 联动演示
      const linkNavMenu = vCard(nav => {
        nav.styles({ marginBottom: '12px' });
        nav.vCardHeader('🔗 路由联动演示');
        nav.vCardBody(content => {
          content.div(links => {
            links.styles({ display: 'flex', flexWrap: 'wrap', gap: '8px' });
            links.div(tip => {
              tip.styles({ fontSize: '13px', color: '#666', marginBottom: '8px' });
              tip.text('点击链接导航，自动添加/切换到新视图（最多 8 个页面，右上角 ☰ 可查看所有打开的页面）：');
            });
            // 首页按钮
            links.child(vButton('🏠 首页')
              .type('default')
              .size('small')
              .onClick(() => {
                window.location.hash = '/home';
              }));
            // 导航链接 - 使用 router.navigate() 方法
            links.child(vButton('📄 产品列表')
              .type('primary')
              .size('small')
              .onClick(() => {
                window.location.hash = '/products';
              }));
            links.child(vButton('👤 客户管理')
              .type('primary')
              .size('small')
              .onClick(() => {
                window.location.hash = '/customers';
              }));
            links.child(vButton('📊 订单中心')
              .type('primary')
              .size('small')
              .onClick(() => {
                window.location.hash = '/orders';
              }));
            links.child(vButton('⚙️ 系统配置')
              .type('primary')
              .size('small')
              .onClick(() => {
                window.location.hash = '/system/config';
              }));
            links.child(vButton('📈 数据分析')
              .type('primary')
              .size('small')
              .onClick(() => {
                window.location.hash = '/analytics';
              }));
            links.child(vButton('📝 报表生成')
              .type('primary')
              .size('small')
              .onClick(() => {
                window.location.hash = '/reports';
              }));
            links.child(vButton('🔔 消息通知')
              .type('primary')
              .size('small')
              .onClick(() => {
                window.location.hash = '/notifications';
              }));
            links.child(vButton('📁 文件管理')
              .type('primary')
              .size('small')
              .onClick(() => {
                window.location.hash = '/files';
              }));
          });
        });
      });

      content.child(DocSection('rvbasic', '多视图容器 VRouterViews', [
        div('VRouterViews 允许在同一个页面中管理多个路由视图，类似 Tabs 但每个视图有独立的路由。'),

        // 基础演示
        vCard(rvDemo => {
          rvDemo.styles({
            marginTop: '16px',
            border: '2px solid #10b981',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%)',
          });
          rvDemo.vCardHeader('🎮 VRouterViews 演示 - 基础用法');
          rvDemo.vCardBody(demoContent => {
            demoContent.child(rvNavMenu);
            demoContent.child(vRouter(router => {
              router.default('/rv/home');

              // 定义 VRouterViews 演示的路由
              router.route('/rv/home', { component: () => RVWelcomePage() });
              router.route('/rv/users', { component: () => RVUserManagePage() });
              router.route('/rv/settings', { component: () => RVSettingsPage() });
              router.route('/rv/analytics', { component: () => RVAnalyticsPage() });

              router.div(content => {
                content.styles({ height: '350px', overflow: 'hidden' });
                content.vRouterViews(router, views => {
                  views.addView('home', {
                    title: '欢迎',
                    icon: '🏠',
                    closable: false,
                    defaultRoute: '/rv/home',
                    showTitle: false,  // 隐藏首页 title
                  });
                  views.addView('users', {
                    title: '用户',
                    icon: '👥',
                    closable: true,
                    defaultRoute: '/rv/users',
                  });
                  views.addView('settings', {
                    title: '设置',
                    icon: '⚙️',
                    closable: true,
                    defaultRoute: '/rv/settings',
                  });
                  views.addView('analytics', {
                    title: '分析',
                    icon: '📊',
                    closable: true,
                    defaultRoute: '/rv/analytics',
                  });

                  views.onChange((viewName) => {
                    console.log('切换到视图:', viewName);
                  });
                });
              });
            }));
          });
        }),

        // 联动演示
        vCard(linkDemo => {
          linkDemo.styles({
            marginTop: '16px',
            border: '2px solid #6366f1',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
          });
          linkDemo.vCardHeader('🔗 VRouterViews 演示 - 路由联动');
          linkDemo.vCardBody(demoContent => {
            demoContent.child(linkNavMenu);
            demoContent.child(vRouter(router => {
              router.default('/home');

              // 动态路由 - 匹配任意路径，根据路径返回不同的组件
              router.route('/*', { component: (params) => {
                const pathStr = params?.path || 'unknown';
                console.log('[通配符路由 _dispatchRoute] params:', params, 'path:', pathStr);

                // 根据路径返回不同的演示组件
                if (pathStr === 'products') {
                  return ProductsView();
                } else if (pathStr === 'customers') {
                  return CustomersView();
                } else if (pathStr === 'orders') {
                  return OrdersView();
                } else if (pathStr === 'system/config') {
                  return SystemConfigView();
                } else if (pathStr === 'analytics') {
                  return AnalyticsView();
                } else if (pathStr === 'reports') {
                  return ReportsView();
                } else if (pathStr === 'notifications') {
                  return NotificationsView();
                } else if (pathStr === 'files') {
                  return FilesView();
                }

                // 默认视图
                return DefaultPathView(pathStr);
              }});

              router.div(content => {
                content.styles({ height: '350px', overflow: 'hidden' });
                content.vRouterViews(router, views => {
                  // 启用自动添加视图功能
                  views.enableAutoView(true);

                  // 添加初始视图（首页不显示 title）
                  views.addView('home', {
                    title: '首页',
                    icon: '🏠',
                    closable: false,
                    defaultRoute: '/home',
                    showTitle: false,  // 隐藏首页 title，只显示图标
                  });

                  views.onChange((viewName, viewData) => {
                    console.log('[VRouterViews] 视图切换:', viewName, '->', viewData?.defaultRoute);
                  });

                  // 设置最大视图数量
                  views.setMaxViews(8);

                  // 监听路由器变化，手动更新视图内容
                  router.afterEach((to, from) => {
                    console.log('[router.afterEach] to:', to, 'path:', to?.path);
                  });
                });
              });
            }));
          });
        }),

        CodeDemo('VRouterViews 基础用法',
          div('多视图容器，每个视图有独立路由'),
          `// 导入组件
import { vRouter, vRouterViews } from 'yoya';

// 创建路由器
const router = vRouter(r => {
  r.default('/home');

  // 定义各视图的路由
  r.route('/home', { component: () => div('首页') });
  r.route('/users', { component: () => div('用户') });
  r.route('/settings', { component: () => div('设置') });
});

// 创建多视图容器
vRouterViews(router, views => {
  views.addView('home', {
    title: '首页',
    icon: '🏠',
    closable: false,
    defaultRoute: '/home'
  });

  views.addView('users', {
    title: '用户管理',
    icon: '👥',
    closable: true,
    defaultRoute: '/users'
  });

  views.addView('settings', {
    title: '系统设置',
    icon: '⚙️',
    closable: true,
    defaultRoute: '/settings'
  });

  // 监听视图切换
  views.onChange((viewName) => {
    console.log('切换到视图:', viewName);
  });
});`
        ),

        CodeDemo('视图配置选项',
          div('每个视图可以配置标题、图标、是否可关闭等'),
          `views.addView('home', {
  title: '首页',        // 视图标题
  icon: '🏠',          // 视图图标
  closable: false,     // 是否可关闭
  defaultRoute: '/'    // 默认路由
});

// 动态更新标题
views.updateViewTitle('home', '新的标题');

// 获取当前激活视图
const activeView = views.getActiveViewName();

// 移除视图
views.removeView('home');`
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
          {
            name: 'vRouterViews',
            description: '创建多路由视图容器',
            props: [
              { name: 'router', type: 'VRouter', description: '路由器实例' },
              { name: 'setup', type: 'Function', description: '初始化函数' },
            ],
            returns: 'VRouterViews 实例',
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

      content.child(ApiTable({
        title: 'VRouterViews 方法',
        items: [
          {
            name: 'addView(name, options)',
            description: '添加视图',
            props: [
              { name: 'name', type: 'String', description: '视图名称（唯一标识）' },
              { name: 'options.title', type: 'String', description: '视图标题' },
              { name: 'options.icon', type: 'String', description: '视图图标' },
              { name: 'options.closable', type: 'Boolean', description: '是否可关闭' },
              { name: 'options.defaultRoute', type: 'String', description: '默认路由' },
            ],
            returns: 'this',
          },
          {
            name: 'setActiveView(name)',
            description: '设置激活的视图',
            props: [
              { name: 'name', type: 'String', description: '视图名称' },
            ],
            returns: 'this',
          },
          {
            name: 'getActiveViewName()',
            description: '获取激活的视图名称',
            props: [],
            returns: 'String - 视图名称',
          },
          {
            name: 'getViews()',
            description: '获取所有视图',
            props: [],
            returns: 'Array - 视图数组',
          },
          {
            name: 'removeView(name)',
            description: '移除视图',
            props: [
              { name: 'name', type: 'String', description: '视图名称' },
            ],
            returns: 'this',
          },
          {
            name: 'updateViewTitle(name, title)',
            description: '更新视图标题',
            props: [
              { name: 'name', type: 'String', description: '视图名称' },
              { name: 'title', type: 'String', description: '新标题' },
            ],
            returns: 'this',
          },
          {
            name: 'onChange(fn)',
            description: '设置视图变化回调',
            props: [
              { name: 'fn', type: 'Function', description: '回调函数，接收 viewName 参数' },
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
