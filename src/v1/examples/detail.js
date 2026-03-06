/**
 * Yoya.Basic V1 - Detail Demo Page
 * Detail 详情展示演示页面
 */

import {
  flex, vstack, vCard, vCardHeader, vCardBody,
  vMenu, vMenuItem, vButton, vDetail, vDetailItem, toast,
  a, img,
} from '../../yoya/index.js';

import { appLayout, sidebarGroup, sidebarItem, tocItem, docSection, codeDemo } from './layout.js';

/**
 * 创建 Detail 演示页面
 */
export function createDetailPage() {
  return appLayout({
    // 左侧菜单
    sidebar: (sidebar) => {
      sidebar.child(sidebarGroup('开始', [
        sidebarItem('介绍', 'index.html'),
      ]));
      sidebar.child(sidebarGroup('基础组件', [
        sidebarItem('Button 按钮', 'button.html'),
        sidebarItem('Form 表单', 'form.html'),
        sidebarItem('Card 卡片', 'card.html'),
      ]));
      sidebar.child(sidebarGroup('导航组件', [
        sidebarItem('Menu 菜单', 'menu.html'),
      ]));
      sidebar.child(sidebarGroup('反馈组件', [
        sidebarItem('Message 消息', 'message.html'),
        sidebarItem('Code 代码', 'code.html'),
      ]));
      sidebar.child(sidebarGroup('数据展示', [
        sidebarItem('Detail 详情', 'detail.html', true),
        sidebarItem('Field 字段', 'field.html'),
      ]));
    },

    // 中间内容
    content: (content) => {
      // 页面标题
      content.child(vstack(header => {
        header.gap('8px');
        header.child(vMenuItem('Detail 详情展示'));
        header.child(vMenuItem('类似 antd Descriptions 组件，用于展示键值对信息。'));
      }));

      // 基础用法
      content.child(docSection('basic', '基础用法', [
        codeDemo('基础详情展示',
          vDetail(d => {
            d.item('用户名', 'zhangsan');
            d.item('邮箱', 'zhangsan@example.com');
            d.item('手机', '138****1234');
          }),
          `vDetail(d => {
  d.item('用户名', 'zhangsan');
  d.item('邮箱', 'zhangsan@example.com');
  d.item('手机', '138****1234');
})`
        ),
      ]));

      // 自定义列数
      content.child(docSection('column', '自定义列数', [
        codeDemo('不同列数布局',
          vstack(s => {
            s.gap('20px');

            // 1 列
            s.child(vCard(c => {
              c.vCardHeader('1 列模式');
              c.vCardBody(d1 => {
                d1.child(vDetail(d => {
                  d.column(1);
                  d.item('用户名', 'zhangsan');
                  d.item('邮箱', 'zhangsan@example.com');
                  d.item('手机', '138****1234');
                }));
              });
            }));

            // 2 列
            s.child(vCard(c => {
              c.vCardHeader('2 列模式');
              c.vCardBody(d2 => {
                d2.child(vDetail(d => {
                  d.column(2);
                  d.item('用户名', 'zhangsan');
                  d.item('邮箱', 'zhangsan@example.com');
                  d.item('手机', '138****1234');
                  d.item('地址', '北京市朝阳区');
                }));
              });
            }));

            // 3 列（默认）
            s.child(vCard(c => {
              c.vCardHeader('3 列模式（默认）');
              c.vCardBody(d3 => {
                d3.child(vDetail(d => {
                  d.column(3);
                  d.item('用户名', 'zhangsan');
                  d.item('邮箱', 'zhangsan@example.com');
                  d.item('手机', '138****1234');
                  d.item('地址', '北京市朝阳区');
                  d.item('职位', '前端工程师');
                  d.item('部门', '技术部');
                }));
              });
            }));
          }),
          `// 设置列数
vDetail(d => {
  d.column(1);  // 1 列
  d.column(2);  // 2 列
  d.column(3);  // 3 列（默认）

  d.item('用户名', 'zhangsan');
  d.item('邮箱', 'zhangsan@example.com');
})`
        ),
      ]));

      // 带边框
      content.child(docSection('bordered', '带边框模式', [
        codeDemo('边框样式',
          vstack(s => {
            s.gap('16px');
            s.child(vCard(c => {
              c.vCardBody(d => {
                d.child(vDetail(d2 => {
                  d2.bordered(true);
                  d2.column(2);
                  d2.item('用户名', 'zhangsan');
                  d2.item('邮箱', 'zhangsan@example.com');
                  d2.item('手机', '138****1234');
                  d2.item('地址', '北京市朝阳区');
                }));
              });
            }));
          }),
          `// 带边框模式
vDetail(d => {
  d.bordered(true);
  d.column(2);
  d.item('用户名', 'zhangsan');
  d.item('邮箱', 'zhangsan@example.com');
})`
        ),
      ]));

      // 带标题
      content.child(docSection('title', '带标题', [
        codeDemo('详情标题',
          vstack(s => {
            s.gap('16px');
            s.child(vCard(c => {
              c.vCardBody(d => {
                d.child(vDetail(d2 => {
                  d2.title('用户信息');
                  d2.column(2);
                  d2.item('用户名', 'zhangsan');
                  d2.item('邮箱', 'zhangsan@example.com');
                  d2.item('手机', '138****1234');
                  d2.item('地址', '北京市朝阳区');
                }));
              });
            }));
          }),
          `// 带标题
vDetail(d => {
  d.title('用户信息');
  d.column(2);
  d.item('用户名', 'zhangsan');
})`
        ),
      ]));

      // 自定义内容
      content.child(docSection('custom', '自定义内容', [
        codeDemo('自定义单元格内容',
          vstack(s => {
            s.gap('16px');
            s.child(vCard(c => {
              c.vCardBody(d => {
                d.child(vDetail(d2 => {
                  d2.title('个人信息');
                  d2.column(2);
                  d2.item('头像', img(i => {
                    i.src('https://via.placeholder.com/60');
                    i.styles({ borderRadius: '50%' });
                  }));
                  d2.item('昵称', a(link => {
                    link.text('@zhangsan');
                    link.href('#');
                    link.style('color', '#667eea');
                  }));
                  d2.item('状态', span(s => {
                    s.styles({
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      background: '#d4edda',
                      color: '#155724',
                    });
                    s.text('已激活');
                  }));
                  d2.item('简介', '前端开发工程师，热爱技术，喜欢分享');
                }));
              });
            }));
          }),
          `// 自定义内容
vDetail(d => {
  d.item('头像', img({ src: 'avatar.jpg' }));
  d.item('昵称', a({ href: '/user', text: '@zhangsan' }));
  d.item('状态', span({ text: '已激活' }));
})`
        ),
      ]));

      // 完整示例
      content.child(docSection('complete', '完整示例', [
        vCard(c => {
          c.vCardHeader('用户详情卡片');
          c.vCardBody(complete => {
            complete.child(flex(layout => {
              layout.gap('20px');

              // 左侧头像
              layout.child(div(left => {
                left.styles({
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '20px',
                  minWidth: '150px',
                });
                left.child(img(avatar => {
                  avatar.src('https://via.placeholder.com/100');
                  avatar.styles({
                    borderRadius: '50%',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  });
                }));
                left.child(vButton('编辑资料').type('primary'));
              }));

              // 右侧详情
              layout.child(div(right => {
                right.styles({ flex: 1 });
                right.child(vDetail(d => {
                  d.title('基本信息');
                  d.column(2);
                  d.bordered(true);
                  d.item('用户名', 'zhangsan');
                  d.item('邮箱', 'zhangsan@example.com');
                  d.item('手机', '138****1234');
                  d.item('地址', '北京市朝阳区');
                  d.item('职位', '前端工程师');
                  d.item('部门', '技术部');
                }));
              }));
            }));
          });
        }),
      ]));

      // API
      content.child(docSection('api', 'API', [
        vCard(c => {
          c.vCardBody(api => {
            api.child(vMenu(apiMenu => {
              apiMenu.vertical();

              const apiItems = [
                { name: 'item()', desc: '添加详情项', props: 'label, content' },
                { name: 'items()', desc: '批量添加', props: 'array' },
                { name: 'column()', desc: '列数', props: 'number' },
                { name: 'title()', desc: '标题', props: 'string' },
                { name: 'bordered()', desc: '边框', props: 'boolean' },
              ];

              apiItems.forEach(item => {
                apiMenu.item(it => {
                  it.child(flex(apiRow => {
                    apiRow.justifyBetween();
                    apiRow.child(vMenuItem(item.name));
                    apiRow.child(vMenuItem(item.desc));
                    apiRow.child(vMenuItem(item.props));
                  }));
                });
              });
            }));
          });
        }),
      ]));
    },

    // 右侧目录
    toc: (toc) => {
      toc.child(vMenuItem('本页目录'));
      toc.child(vstack(links => {
        links.gap('4px');
        links.child(tocItem('基础用法', '#basic'));
        links.child(tocItem('列数设置', '#column'));
        links.child(tocItem('边框模式', '#bordered'));
        links.child(tocItem('标题', '#title'));
        links.child(tocItem('自定义内容', '#custom'));
        links.child(tocItem('完整示例', '#complete'));
        links.child(tocItem('API', '#api'));
      }));
    },
  });
}
