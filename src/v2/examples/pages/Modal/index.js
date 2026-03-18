/**
 * Yoya.Basic V2 - Modal 弹出框演示页面
 */

import {
  flex,
  vstack,
  vButton,
  vModal,
  vConfirm,
  vForm,
  vInput,
  vTextarea,
  p,
  div,
  toast
} from '../../../../yoya/index.js';
import { AppShell } from '../../framework/AppShell.js';
import { CodeDemo } from '../../components/CodeDemo.js';
import { DocSection } from '../../components/DocSection.js';
import { PageHeader } from '../../components/PageHeader.js';
import { ApiTable } from '../../components/ApiTable.js';

/**
 * 创建 Modal 演示页面
 */
export function createModalPage() {
  // 预创建 Modal 实例
  const basicModal = vModal(m => {
    m.content(c => {
      c.p('这是一个基础的弹出框示例。您可以在这里放置任何内容。');
      c.p('弹出框支持动画效果，支持遮罩层点击关闭。');
    });
    m.footer(f => {
      f.child(vButton('取消')
        .type('secondary')
        .onClick(() => m.hide()));
      f.child(vButton('确定')
        .type('primary')
        .onClick(() => {
          toast.success('已确认');
          m.hide();
        }));
    });
  });

  const titleModal = vModal(m => {
    m.title('📢 系统通知');
    m.content(c => {
      c.p('您有一条新的系统消息：');
      c.p('系统将于今晚 22:00 进行例行维护，预计持续 2 小时。');
      c.p('请提前保存您的工作内容。');
    });
    m.footer(f => {
      f.child(vButton('我知道了')
        .type('primary')
        .onClick(() => {
          toast.info('已阅读通知');
          m.hide();
        }));
    });
    m.width('450px');
  });

  const customModal = vModal(m => {
    m.title('📝 用户反馈');
    m.content(c => {
      c.vForm(form => {
        form.vInput(input => {
          input.placeholder('请输入您的姓名');
        });
        form.vInput(input => {
          input.type('email');
          input.placeholder('请输入您的邮箱');
        });
        form.vTextarea(textarea => {
          textarea.placeholder('请详细描述您的问题或建议');
          textarea.rows(4);
        });
      });
    });
    m.footer(f => {
      f.child(vButton('取消')
        .type('secondary')
        .onClick(() => m.hide()));
      f.child(vButton('提交')
        .type('primary')
        .onClick(() => {
          toast.success('反馈已提交，感谢您的参与！');
          m.hide();
        }));
    });
    m.width('500px');
  });

  const largeModal = vModal(m => {
    m.title('📊 详细信息');
    m.content(c => {
      c.div(content => {
        content.style('padding', '10px 0');
        const data = [
          { name: '项目名称', value: 'Yoya.Basic 前端框架' },
          { name: '版本', value: 'v2.0.0' },
          { name: '作者', value: 'Yoya Team' },
          { name: '许可证', value: 'MIT' },
          { name: '仓库', value: 'github.com/yoya/basic' },
          { name: '文档', value: 'yoya.basic.dev' },
          { name: '支持', value: 'support@yoya.basic' },
          { name: '状态', value: '开发中' },
        ];
        data.forEach((item, index) => {
          content.div(row => {
            row.style('display', 'flex');
            row.style('padding', '12px 0');
            row.style('borderBottom', index < data.length - 1 ? '1px solid #f0f0f0' : 'none');
            row.div(label => {
              label.style('width', '120px');
              label.style('fontWeight', '600');
              label.style('color', '#666');
              label.text(item.name + ':');
            });
            row.div(value => {
              value.style('flex', '1');
              value.style('color', '#333');
              value.text(item.value);
            });
          });
        });
      });
    });
    m.footer(f => {
      f.child(vButton('关闭')
        .type('secondary')
        .onClick(() => m.hide()));
    });
    m.width('800px');
  });

  const tocItems = [
    { text: '基础用法', href: '#basic', level: 1 },
    { text: '带标题弹出框', href: '#with-title', level: 1 },
    { text: '确认框', href: '#confirm', level: 1 },
    { text: '自定义内容', href: '#custom', level: 1 },
    { text: '不可关闭模式', href: '#unclosable', level: 1 },
    { text: '自定义尺寸', href: '#size', level: 1 },
    { text: 'API', href: '#api', level: 1 },
  ];

  return AppShell({
    currentPage: 'modal.html',
    tocItems,
    content: (content) => {
      // 页面标题
      content.child(PageHeader({
        title: 'Modal 弹出框',
        description: '弹出框用于显示重要信息或确认操作。完全透明的控制，内容由您自定义。',
      }));

      // 基础用法
      content.child(DocSection('basic', '基础用法', [
        CodeDemo('基础弹出框',
          flex(row => {
            row.gap('12px');
            row.child(vButton('打开基础弹出框')
              .type('primary')
              .onClick(() => basicModal.show()));
          }),
          `const modal = vModal(m => {
  m.content(c => {
    c.p('弹出框内容');
  });
  m.footer(f => {
    f.button('取消', b => b.onClick(() => modal.hide()));
    f.button('确定', b => {
      b.type('primary');
      b.onClick(() => {
        toast.success('已确认');
        modal.hide();
      });
    });
  });
});

vButton('打开', b => b.onClick(() => modal.show()));`
        ),
      ]));

      // 带标题弹出框
      content.child(DocSection('with-title', '带标题弹出框', [
        CodeDemo('带标题的弹出框',
          flex(row => {
            row.gap('12px');
            row.child(vButton('打开带标题的弹出框')
              .type('success')
              .onClick(() => titleModal.show()));
          }),
          `const modal = vModal(m => {
  m.title('📢 系统通知');
  m.content(c => {
    c.p('您有一条新的系统消息：');
    c.p('系统将于今晚 22:00 进行维护');
  });
  m.footer(f => {
    f.button('我知道了', b => {
      b.type('primary');
      b.onClick(() => modal.hide());
    });
  });
  m.width('450px');
});`
        ),
      ]));

      // 确认框
      content.child(DocSection('confirm', '确认框', [
        CodeDemo('快速创建确认框',
          flex(row => {
            row.gap('12px');
            row.child(vButton('打开确认框')
              .type('danger')
              .onClick(() => {
                vConfirm('⚠️ 删除确认', '确定要删除这条记录吗？此操作无法恢复。', setup => {
                  setup
                    .confirmText('删除')
                    .cancelText('取消')
                    .onConfirm(() => toast.error('已删除'))
                    .onCancel(() => toast.info('已取消'))
                    .show();
                });
              }));
          }),
          `// 使用 vConfirm 快速创建确认框
vConfirm('⚠️ 删除确认', '确定要删除吗？', setup => {
  setup
    .confirmText('删除')
    .cancelText('取消')
    .onConfirm(() => toast.error('已删除'))
    .onCancel(() => toast.info('已取消'))
    .show();
});`
        ),
      ]));

      // 自定义内容
      content.child(DocSection('custom', '自定义内容', [
        CodeDemo('自定义内容 - 表单',
          flex(row => {
            row.gap('12px');
            row.child(vButton('打开自定义弹出框')
              .type('warning')
              .onClick(() => customModal.show()));
          }),
          `const modal = vModal(m => {
  m.title('📝 用户反馈');
  m.content(c => {
    c.vForm(form => {
      form.vInput(input => {
        input.placeholder('请输入您的姓名');
      });
      form.vInput(input => {
        input.type('email');
        input.placeholder('请输入您的邮箱');
      });
      form.vTextarea(textarea => {
        textarea.placeholder('请描述您的问题');
        textarea.rows(4);
      });
    });
  });
  m.footer(f => {
    f.button('取消', b => b.onClick(() => modal.hide()));
    f.button('提交', b => {
      b.type('primary');
      b.onClick(() => {
        toast.success('已提交');
        modal.hide();
      });
    });
  });
  m.width('500px');
});`
        ),
      ]));

      // 不可关闭模式
      content.child(DocSection('unclosable', '不可关闭模式', [
        CodeDemo('强制用户操作的弹出框',
          flex(row => {
            row.gap('12px');
            row.child(vButton('打开不可关闭的弹出框')
              .type('info')
              .onClick(() => {
                const modal = vModal(m => {
                  m.title('⏳ 处理中...');
                  m.content(c => {
                    c.div(content => {
                      content.style('text-align', 'center');
                      content.style('padding', '20px 0');
                      content.p('正在处理您的请求，请稍候...');
                      content.p('此窗口无法关闭');
                    });
                  });
                  m.footer(f => {
                    f.child(vButton('完成')
                      .type('primary')
                      .onClick(() => {
                        toast.success('处理完成');
                        m.hide();
                      }));
                  });
                  m.closable(false);
                  m.maskClosable(false);
                });
                modal.show();
              }));
          }),
          `const modal = vModal(m => {
  m.title('⏳ 处理中...');
  m.content(c => {
    c.p('正在处理请求...');
  });
  m.footer(f => {
    f.button('完成', b => {
      b.type('primary');
      b.onClick(() => modal.hide());
    });
  });
  // 禁用关闭功能
  m.closable(false);      // 隐藏关闭按钮
  m.maskClosable(false);  // 禁用遮罩点击关闭
});`
        ),
      ]));

      // 自定义尺寸
      content.child(DocSection('size', '自定义尺寸', [
        CodeDemo('大弹出框',
          flex(row => {
            row.gap('12px');
            row.child(vButton('打开大弹出框 (800px)')
              .type('secondary')
              .onClick(() => largeModal.show()));
          }),
          `const modal = vModal(m => {
  m.title('📊 详细信息');
  m.content(c => {
    // 内容...
  });
  m.footer(f => {
    f.button('关闭', b => b.onClick(() => modal.hide()));
  });
  // 自定义宽度
  m.width('800px');
});`
        ),
      ]));

      // API
      content.child(DocSection('api', 'API', [
        ApiTable([
          { name: 'title(title)', desc: '设置弹出框标题', type: 'string | Function' },
          { name: 'content(content)', desc: '设置弹出框内容', type: 'string | Function' },
          { name: 'footer(setup)', desc: '设置弹出框底部', type: 'Function' },
          { name: 'width(width)', desc: '设置弹出框宽度', type: 'string' },
          { name: 'closable(closable)', desc: '是否显示关闭按钮', type: 'boolean' },
          { name: 'maskClosable(maskClosable)', desc: '是否可点击遮罩关闭', type: 'boolean' },
          { name: 'centered(centered)', desc: '是否居中模式', type: 'boolean' },
          { name: 'show()', desc: '显示弹出框', type: '() => this' },
          { name: 'hide()', desc: '隐藏弹出框', type: '() => this' },
          { name: 'toggle()', desc: '切换显示状态', type: '() => this' },
          { name: 'afterClose(callback)', desc: '注册关闭后回调', type: 'Function' },
        ]),

        ApiTable([
          { name: 'vConfirm(title, content, setup)', desc: '快速创建确认框', type: 'Function' },
          { name: 'confirmText(text)', desc: '设置确认按钮文本', type: 'string' },
          { name: 'cancelText(text)', desc: '设置取消按钮文本', type: 'string' },
          { name: 'onConfirm(fn)', desc: '设置确认回调', type: 'Function' },
          { name: 'onCancel(fn)', desc: '设置取消回调', type: 'Function' },
        ]),
      ]));
    },
  });
}
