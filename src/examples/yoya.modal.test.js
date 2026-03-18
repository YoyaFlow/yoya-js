/**
 * Yoya Modal 弹出框组件演示
 */

import {
  vModal,
  vConfirm,
  confirm,
  vForm,
  vInput,
  vTextarea,
  div,
  p,
  toast
} from '../yoya/index.js';

// ============================================
// 基础弹出框
// ============================================
const basicModal = vModal(m => {
  m.content(c => {
    c.p('这是一个基础的弹出框示例。您可以在这里放置任何内容。');
    c.p('弹出框支持动画效果，支持遮罩层点击关闭。');
  });
  m.footer(f => {
    f.button(b => {
      b.className('demo-btn demo-btn--secondary');
      b.text('取消');
      b.onClick(() => m.hide());
    });
    f.button(b => {
      b.className('demo-btn demo-btn--primary');
      b.text('确定');
      b.onClick(() => {
        toast.success('已确认');
        m.hide();
      });
    });
  });
});

document.getElementById('basicModalBtn').onclick = () => {
  basicModal.show();
};

// ============================================
// 带标题的弹出框
// ============================================
const titleModal = vModal(m => {
  m.title('📢 系统通知');
  m.content(c => {
    c.p('您有一条新的系统消息：');
    c.p('系统将于今晚 22:00 进行例行维护，预计持续 2 小时。');
    c.p('请提前保存您的工作内容。');
  });
  m.footer(f => {
    f.button(b => {
      b.className('demo-btn demo-btn--primary');
      b.text('我知道了');
      b.onClick(() => {
        toast.info('已阅读通知');
        m.hide();
      });
    });
  });
  m.width('450px');
});

document.getElementById('titleModalBtn').onclick = () => {
  titleModal.show();
};

// ============================================
// 确认框
// ============================================
document.getElementById('confirmBtn').onclick = () => {
  vConfirm('⚠️ 删除确认', '确定要删除这条记录吗？此操作无法恢复。', setup => {
    setup
      .confirmText('删除')
      .cancelText('取消')
      .onConfirm(() => {
        toast.error('已删除');
      })
      .onCancel(() => {
        toast.info('已取消');
      });
  }).show();
};

// ============================================
// 自定义内容弹出框 - 表单
// ============================================
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
    f.button(b => {
      b.className('demo-btn demo-btn--secondary');
      b.text('取消');
      b.onClick(() => m.hide());
    });
    f.button(b => {
      b.className('demo-btn demo-btn--primary');
      b.text('提交');
      b.onClick(() => {
        toast.success('反馈已提交，感谢您的参与！');
        m.hide();
      });
    });
  });
  m.width('500px');
});

document.getElementById('customModalBtn').onclick = () => {
  customModal.show();
};

// ============================================
// 不可关闭的弹出框
// ============================================
const unclosableModal = vModal(m => {
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
    f.button(b => {
      b.className('demo-btn demo-btn--primary');
      b.text('完成');
      b.onClick(() => {
        toast.success('处理完成');
        m.hide();
      });
    });
  });
  m.closable(false);
  m.maskClosable(false);
});

document.getElementById('unclosableModalBtn').onclick = () => {
  unclosableModal.show();
};

// ============================================
// 大弹出框
// ============================================
const largeModal = vModal(m => {
  m.title('📊 详细信息');
  m.content(c => {
    c.div(content => {
      content.style('padding', '10px 0');

      // 模拟一个表格内容
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
    f.button(b => {
      b.className('demo-btn demo-btn--secondary');
      b.text('关闭');
      b.onClick(() => m.hide());
    });
  });
  m.width('800px');
});

document.getElementById('largeModalBtn').onclick = () => {
  largeModal.show();
};

// ============================================
// 欢迎消息
// ============================================
setTimeout(() => {
  toast.success('欢迎使用 Yoya Modal 组件！');
}, 1000);
