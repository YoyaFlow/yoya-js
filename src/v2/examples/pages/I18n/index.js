/**
 * Yoya.Basic V2 - I18n 国际化演示页面
 * 展示多语言切换和国际化功能
 */

import {
  div, span, vDetail, vField, vInput, vButton, toast,
  initI18n, setLanguage, getLanguage
} from '../../../../yoya/index.js';
import { AppShell } from '../../framework/AppShell.js';
import { CodeDemo } from '../../components/CodeDemo.js';
import { DocSection } from '../../components/DocSection.js';
import { PageHeader } from '../../components/PageHeader.js';

// 语言包数据（内联避免浏览器 import assert 兼容性问题）
const zhCN = {
  common: { save: '保存', cancel: '取消', edit: '编辑', delete: '删除', download: '下载', view: '查看', warning: '警告' },
  order: { orderInfo: '订单信息', customerInfo: '客户信息', contractInfo: '合同信息', orderNumber: '订单编号', orderDate: '订单日期', orderStatus: '订单状态', orderAmount: '订单金额', customerName: '客户姓名', customerEmail: '客户邮箱', customerCompany: '客户公司', customerLevel: '客户等级', contractNumber: '合同编号', contractName: '合同名称', contractType: '合同类型', signDate: '签订日期', effectiveDate: '生效日期', expiryDate: '到期日期', partyA: '甲方', partyB: '乙方', agentName: '经办人', department: '部门', title: '订单管理' },
  status: { pending: '待处理', processing: '处理中', completed: '已完成', active: '生效中', expired: '已过期' },
  contractType: { purchase: '采购合同', sales: '销售合同', service: '服务合同' },
  customerLevel: { vip: 'VIP 客户', regular: '普通客户', new: '新客户' },
  form: { fieldRequired: '{field} 不能为空' },
  message: { saveSuccess: '保存成功', deleteSuccess: '删除成功', deleteConfirm: '确定要删除吗？' }
};
const en = {
  common: { save: 'Save', cancel: 'Cancel', edit: 'Edit', delete: 'Delete', download: 'Download', view: 'View', warning: 'Warning' },
  order: { orderInfo: 'Order Information', customerInfo: 'Customer Information', contractInfo: 'Contract Information', orderNumber: 'Order Number', orderDate: 'Order Date', orderStatus: 'Order Status', orderAmount: 'Order Amount', customerName: 'Customer Name', customerEmail: 'Customer Email', customerCompany: 'Customer Company', customerLevel: 'Customer Level', contractNumber: 'Contract Number', contractName: 'Contract Name', contractType: 'Contract Type', signDate: 'Sign Date', effectiveDate: 'Effective Date', expiryDate: 'Expiry Date', partyA: 'Party A', partyB: 'Party B', agentName: 'Agent', department: 'Department', title: 'Order Management' },
  status: { pending: 'Pending', processing: 'Processing', completed: 'Completed', active: 'Active', expired: 'Expired' },
  contractType: { purchase: 'Purchase Contract', sales: 'Sales Contract', service: 'Service Contract' },
  customerLevel: { vip: 'VIP Customer', regular: 'Regular Customer', new: 'New Customer' },
  form: { fieldRequired: '{field} is required' },
  message: { saveSuccess: 'Saved successfully', deleteSuccess: 'Deleted successfully', deleteConfirm: 'Are you sure you want to delete?' }
};
const mn = {
  common: { save: 'Хадгалах', cancel: 'Болих', edit: 'Засах', delete: 'Устгах', download: 'Татаж авах', view: 'Үзэх', warning: 'Анхааруулга' },
  order: { orderInfo: 'Захиалгын мэдээлэл', customerInfo: 'Харилцагчийн мэдээлэл', contractInfo: 'Гэрээний мэдээлэл', orderNumber: 'Захиалгын дугаар', orderDate: 'Захиалгын огноо', orderStatus: 'Захиалгын төлөв', orderAmount: 'Захиалгын дүн', customerName: 'Харилцагчийн нэр', customerEmail: 'Имэйл', customerCompany: 'Компани', customerLevel: 'Харилцагчийн түвшин', contractNumber: 'Гэрээний дугаар', contractName: 'Гэрээний нэр', contractType: 'Гэрээний төрөл', signDate: 'Байгуулсан огноо', effectiveDate: 'Хэрэгжиж эхэлсэн огноо', expiryDate: 'Дуусах хугацаа', partyA: 'Захиалагч', partyB: 'Гүйцэтгэгч', agentName: 'Хариуцагч', department: 'Хэлтэс', title: 'Захиалгын удирдлага' },
  status: { pending: 'Хүлээгдэж буй', processing: 'Боловсруулж буй', completed: 'Дууссан', active: 'Идэвхтэй', expired: 'Хугацаа дууссан' },
  contractType: { purchase: 'Худалдан авах гэрээ', sales: 'Борлуулах гэрээ', service: 'Үйлчилгээний гэрээ' },
  customerLevel: { vip: 'VIP харилцагч', regular: 'Енгийн харилцагч', new: 'Шинэ харилцагч' },
  form: { fieldRequired: '{field} заавал бөглөнө үү' },
  message: { saveSuccess: 'Амжилттай хадгаллаа', deleteSuccess: 'Амжилттай устгалаа', deleteConfirm: 'Та устгахдаа итгэлтэй байна уу?'}
};

// 初始化 i18n
initI18n({
  defaultLanguage: 'zh-CN',
  languages: new Map([
    ['zh-CN', zhCN],
    ['en', en],
    ['mn', mn]
  ])
});

// 模拟订单数据
let orderData = {
  orderNumber: 'ORD-2026030801',
  orderDate: '2026-03-08',
  orderStatus: 'processing',
  orderAmount: '12,580.00',
  currency: 'CNY',
  customerName: '张三',
  customerEmail: 'zhangsan@example.com',
  customerCompany: '某某科技有限公司',
  customerLevel: 'vip',
  contractNumber: 'CTR-2026-001',
  contractName: '年度采购框架协议',
  contractType: 'purchase',
  signDate: '2026-01-15',
  effectiveDate: '2026-01-20',
  expiryDate: '2027-01-19',
  partyA: '某某科技有限公司',
  partyB: '供应商有限公司',
  agentName: '李四',
  department: '采购部'
};

/**
 * 创建语言切换器组件
 * @param {Function} onChange - 切换后的回调函数
 * @param {boolean} autoRefresh - 是否自动刷新页面（默认 true）
 */
function createLanguageSwitcher(onChange, autoRefresh = true) {
  return div(lang => {
    lang.styles({ display: 'flex', gap: '8px', alignItems: 'center' });

    const languages = [
      { code: 'zh-CN', name: '中文' },
      { code: 'en', name: 'English' },
      { code: 'mn', name: 'Монгол' }
    ];

    languages.forEach(({ code, name }) => {
      lang.button(btn => {
        const isActive = getLanguage() === code;
        btn.styles({
          padding: '8px 16px',
          border: isActive ? '2px solid var(--yoya-primary)' : '1px solid var(--yoya-border)',
          borderRadius: '6px',
          background: isActive ? 'var(--yoya-primary)' : 'var(--yoya-bg)',
          color: isActive ? 'white' : 'var(--yoya-text)',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500'
        });
        btn.text(name);
        btn.on('click', () => {
          setLanguage(code);
          // 语言切换后自动刷新页面
          if (autoRefresh) {
            setTimeout(() => {
              window.location.reload();
            }, 300);
          }
          onChange && onChange(code);
        });
      });
    });
  });
}

/**
 * 创建状态徽章
 */
function createStatusBadge(status) {
  return div(badge => {
    const colorMap = {
      processing: { bg: 'var(--yoya-info-bg)', color: 'var(--yoya-info)' },
      completed: { bg: 'var(--yoya-success-bg)', color: 'var(--yoya-success)' },
      pending: { bg: 'var(--yoya-warning-bg)', color: 'var(--yoya-warning)' },
      active: { bg: 'var(--yoya-primary-alpha)', color: 'var(--yoya-primary)' },
      expired: { bg: 'var(--yoya-error-bg)', color: 'var(--yoya-error)' }
    };
    const colors = colorMap[status] || colorMap.pending;

    badge.styles({
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500',
      background: colors.bg,
      color: colors.color
    });
    badge.text(''.t(`status.${status}`));
  });
}

/**
 * 创建客户等级徽章
 */
function createCustomerLevelBadge(level) {
  return div(badge => {
    badge.styles({
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500',
      background: 'var(--yoya-primary-alpha)',
      color: 'var(--yoya-primary)'
    });
    badge.text(''.t(`customerLevel.${level}`));
  });
}

/**
 * 创建可编辑字段
 */
function createEditableField(key, type = 'text') {
  return vField(f => {
    f.value(orderData[key]);
    f.showContent((el, val) => el.text(val));
    f.editContent((el, setValue, field) => {
      el.vInput(inp => {
        inp.type(type);
        inp.value(field.value());
        inp.onChange(e => setValue(e.value));
      });
    });
    f.onSave(({ value }) => {
      orderData[key] = value;
      toast.success(''.t('message.saveSuccess'));
    });
  });
}

/**
 * 创建订单信息卡片
 */
function createOrderCard() {
  return div(section => {
    section.styles({
      background: 'var(--yoya-card-bg)',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: 'var(--yoya-shadow)',
      border: '1px solid var(--yoya-border-light)'
    });

    section.div(title => {
      title.styles({
        fontSize: '16px',
        fontWeight: '600',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid var(--yoya-border-light)'
      });
      title.text(''.t('order.orderInfo'));
    });

    section.vDetail(detail => {
      detail.column(2);
      detail.bordered(true);

      detail.item(''.t('order.orderNumber'), createEditableField('orderNumber'));
      detail.item(''.t('order.orderDate'), orderData.orderDate);
      detail.item(''.t('order.orderStatus'), createStatusBadge(orderData.orderStatus));
      detail.item(''.t('order.orderAmount'), `¥ ${orderData.orderAmount} ${orderData.currency}`);
    });

    // 操作按钮
    section.div(actions => {
      actions.styles({
        display: 'flex',
        gap: '12px',
        marginTop: '20px',
        paddingTop: '16px',
        borderTop: '1px solid var(--yoya-border-light)'
      });

      actions.vButton(btn => {
        btn.type('primary');
        btn.text(''.t('common.edit'));
        btn.on('click', () => toast.info(''.t('common.edit')));
      });

      actions.vButton(btn => {
        btn.type('default');
        btn.text(''.t('common.cancel'));
        btn.on('click', () => toast.info(''.t('common.cancel')));
      });
    });
  });
}

/**
 * 创建客户信息卡片
 */
function createCustomerCard() {
  return div(section => {
    section.styles({
      background: 'var(--yoya-card-bg)',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: 'var(--yoya-shadow)',
      border: '1px solid var(--yoya-border-light)'
    });

    section.div(title => {
      title.styles({
        fontSize: '16px',
        fontWeight: '600',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid var(--yoya-border-light)'
      });
      title.text(''.t('order.customerInfo'));
    });

    section.vDetail(detail => {
      detail.column(2);
      detail.bordered(true);

      detail.item(''.t('order.customerName'), createEditableField('customerName'));
      detail.item(''.t('order.customerEmail'), createEditableField('customerEmail', 'email'));
      detail.item(''.t('order.customerCompany'), orderData.customerCompany);
      detail.item(''.t('order.customerLevel'), createCustomerLevelBadge(orderData.customerLevel));
    });

    // 操作按钮
    section.div(actions => {
      actions.styles({
        display: 'flex',
        gap: '12px',
        marginTop: '20px',
        paddingTop: '16px',
        borderTop: '1px solid var(--yoya-border-light)'
      });

      actions.vButton(btn => {
        btn.type('primary');
        btn.text(''.t('common.edit'));
        btn.on('click', () => toast.info(''.t('common.edit')));
      });

      actions.vButton(btn => {
        btn.type('default');
        btn.text(''.t('common.view'));
        btn.on('click', () => toast.info(''.t('common.view')));
      });
    });
  });
}

/**
 * 创建合同信息卡片
 */
function createContractCard() {
  return div(section => {
    section.styles({
      background: 'var(--yoya-card-bg)',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: 'var(--yoya-shadow)',
      border: '1px solid var(--yoya-border-light)',
      gridColumn: '1 / -1'
    });

    section.div(title => {
      title.styles({
        fontSize: '16px',
        fontWeight: '600',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid var(--yoya-border-light)'
      });
      title.text(''.t('order.contractInfo'));
    });

    section.vDetail(detail => {
      detail.column(3);
      detail.bordered(true);

      detail.item(''.t('order.contractNumber'), orderData.contractNumber);
      detail.item(''.t('order.contractName'), orderData.contractName);
      detail.item(''.t('order.contractType'), ''.t(`contractType.${orderData.contractType}`));
      detail.item(''.t('order.signDate'), orderData.signDate);
      detail.item(''.t('order.effectiveDate'), orderData.effectiveDate);

      // 到期日期带警告提示
      detail.item(''.t('order.expiryDate'), div(exp => {
        exp.text(orderData.expiryDate);
        const days = Math.ceil((new Date(orderData.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
        if (days > 0 && days <= 30) {
          exp.span(badge => {
            badge.styles({
              marginLeft: '8px',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              background: 'var(--yoya-warning-bg)',
              color: 'var(--yoya-warning)'
            });
            badge.text(`${''.t('common.warning')} - ${days}天`);
          });
        } else if (days <= 0) {
          exp.span(badge => {
            badge.styles({
              marginLeft: '8px',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              background: 'var(--yoya-error-bg)',
              color: 'var(--yoya-error)'
            });
            badge.text(''.t('status.expired'));
          });
        }
      }));

      detail.item(''.t('order.partyA'), orderData.partyA);
      detail.item(''.t('order.partyB'), orderData.partyB);
      detail.item(''.t('order.agentName'), createEditableField('agentName'));
      detail.item(''.t('order.department'), orderData.department);
    });

    // 操作按钮
    section.div(actions => {
      actions.styles({
        display: 'flex',
        gap: '12px',
        marginTop: '20px',
        paddingTop: '16px',
        borderTop: '1px solid var(--yoya-border-light)'
      });

      actions.vButton(btn => {
        btn.type('primary');
        btn.text(''.t('common.edit'));
        btn.on('click', () => toast.info(''.t('common.edit')));
      });

      actions.vButton(btn => {
        btn.type('default');
        btn.text(''.t('common.download'));
        btn.on('click', () => toast.info(''.t('common.download')));
      });

      actions.vButton(btn => {
        btn.type('danger');
        btn.text(''.t('common.delete'));
        btn.on('click', () => {
          if (confirm(''.t('message.deleteConfirm'))) {
            toast.success(''.t('message.deleteSuccess'));
          }
        });
      });
    });
  });
}

/**
 * 创建演示区域 - 订单合同管理界面
 */
function createDemoSection() {
  return div(demo => {
    demo.styles({
      background: 'var(--yoya-bg)',
      borderRadius: '8px',
      padding: '24px',
      marginBottom: '24px'
    });

    demo.div(header => {
      header.styles({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      });

      header.h2(h2 => {
        h2.styles({ fontSize: '18px', fontWeight: '600', margin: 0 });
        h2.text(''.t('order.title'));
      });

      header.child(createLanguageSwitcher(() => {
        renderDemoContent();
        toast.success(''.t('message.saveSuccess'));
      }, false));
    });

    // 内容区域
    demo.div(content => {
      content.styles({
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '24px'
      });

      content.child(createOrderCard());
      content.child(createCustomerCard());
      content.child(createContractCard());
    });
  });
}

// 全局组件引用，用于语言切换时重新渲染
let demoContentComponent = null;
let codeExamplesComponent = null;

/**
 * 渲染演示内容（支持语言切换后重新渲染）
 */
function renderDemoContent() {
  // 使用组件方法更新内容，而不是直接操作 DOM
  if (demoContentComponent) {
    // 清空子元素并重新添加
    demoContentComponent._children = [];
  }

  div(demo => {
    demo.styles({
      background: 'var(--yoya-bg)',
      borderRadius: '8px',
      padding: '24px',
      marginBottom: '24px'
    });

    demo.div(header => {
      header.styles({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      });

      header.h2(h2 => {
        h2.styles({ fontSize: '18px', fontWeight: '600', margin: 0 });
        h2.text(''.t('order.title'));
      });

      // 演示区域内的语言切换器：禁用自动刷新，使用回调刷新局部
      header.child(createLanguageSwitcher(() => {
        renderDemoContent();
        toast.success(''.t('message.saveSuccess'));
      }, false));
    });

    demo.div(content => {
      content.styles({
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '24px'
      });

      content.child(createOrderCard());
      content.child(createCustomerCard());
      content.child(createContractCard());
    });

    // 如果已有组件引用，直接绑定到现有元素
    if (demoContentComponent) {
      demo.bindTo(demoContentComponent._el);
    } else {
      // 首次渲染，保存组件引用
      demoContentComponent = demo;
    }
  });
}

/**
 * 创建代码示例部分
 */
function createCodeExamples() {
  return DocSection('i18n-usage', 'i18n 使用方法', [
    CodeDemo('初始化 i18n',
      div(example => {
        example.text('当前语言：' + getLanguage());
      }),
      `// 1. 导入语言包
import zhCN from './i18n/zh-CN.json' assert { type: 'json' };
import en from './i18n/en.json' assert { type: 'json' };
import mn from './i18n/mn.json' assert { type: 'json' };

// 2. 初始化 i18n
initI18n({
  defaultLanguage: 'zh-CN',
  languages: new Map([
    ['zh-CN', zhCN],
    ['en', en],
    ['mn', mn]
  ])
});`
    ),

    CodeDemo('翻译函数 - 使用 "".t() 方法',
      div(example => {
        example.styles({ display: 'flex', flexDirection: 'column', gap: '8px' });
        example.div(span => {
          span.styles({ fontSize: '14px' });
          span.text(`''.t('common.save') = ${''.t('common.save')}`);
        });
        example.div(span => {
          span.styles({ fontSize: '14px' });
          span.text(`''.t('order.title') = ${''.t('order.title')}`);
        });
        example.div(span => {
          span.styles({ fontSize: '14px' });
          span.text(`''.t('status.processing') = ${''.t('status.processing')}`);
        });
      }),
      `// 使用 String.prototype.t() 方法
''.t('common.save')      // "保存"
''.t('order.title')      // "订单管理"
''.t('status.processing') // "处理中"

// 带占位符的翻译
''.t('form.fieldRequired', { field: '姓名' })
// "姓名不能为空"`
    ),

    CodeDemo('语言切换',
      div(example => {
        example.styles({ display: 'flex', gap: '8px' });
        ['zh-CN', 'en', 'mn'].forEach(code => {
          example.button(btn => {
            btn.styles({
              padding: '8px 16px',
              border: '1px solid var(--yoya-border)',
              borderRadius: '6px',
              background: getLanguage() === code ? 'var(--yoya-primary)' : 'var(--yoya-bg)',
              color: getLanguage() === code ? 'white' : 'var(--yoya-text)',
              cursor: 'pointer'
            });
            btn.text(code === 'zh-CN' ? '中文' : (code === 'en' ? 'English' : 'Монгол'));
            btn.on('click', () => {
              setLanguage(code);
              setTimeout(() => {
                renderDemoContent();
                // 重新渲染代码示例
                setTimeout(() => updateCodeExamples(), 100);
              }, 100);
              toast.success(`语言已切换为 ${code}`);
            });
          });
        });
      }),
      `// 切换语言
setLanguage('en');  // 切换到英文
setLanguage('zh-CN'); // 切换到中文

// 获取当前语言
const lang = getLanguage();  // "zh-CN"

// 监听语言切换事件
window.addEventListener('language-changed', (e) => {
  // 语言已切换：e.detail.language
});`
    ),
  ]);
}

/**
 * 更新代码示例（语言切换后）
 */
function updateCodeExamples() {
  // 使用组件方法更新内容，而不是直接操作 DOM
  if (codeExamplesComponent) {
    // 清空子元素并重新添加
    codeExamplesComponent._children = [];
  }

  div(wrapper => {
    wrapper.child(createCodeExamples());

    // 如果已有组件引用，直接绑定到现有元素
    if (codeExamplesComponent) {
      wrapper.bindTo(codeExamplesComponent._el);
    } else {
      // 首次渲染，保存组件引用
      codeExamplesComponent = wrapper;
    }
  });
}

/**
 * 创建首页内容
 */
export function createI18nPage() {
  const tocItems = [
    { text: '演示界面', href: '#demo', level: 1 },
    { text: '使用方法', href: '#i18n-usage', level: 1 },
    { text: '语言包结构', href: '#structure', level: 1 },
  ];

  return AppShell({
    currentPage: 'i18n.html',
    tocItems,
    content: (content) => {
      content.child(PageHeader({
        title: 'i18n 国际化',
        description: '多语言国际化支持，包含完整的语言包和语言切换功能',
      }));

      // 演示界面
      content.div(section => {
        section.id('i18n-demo-content');
        // 保存组件引用用于语言切换时重新渲染
        demoContentComponent = section;
        section.child(createDemoSection());
      });

      // 代码示例
      content.div(id => {
        id.id('i18n-code-examples');
        // 保存组件引用用于语言切换时重新渲染
        codeExamplesComponent = id;
        id.child(createCodeExamples());
      });

      // 语言包结构说明
      content.child(DocSection('structure', '语言包结构', [
        div(info => {
          info.styles({
            background: 'var(--yoya-bg-secondary)',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '16px'
          });

          info.h3(h3 => {
            h3.styles({ fontSize: '16px', fontWeight: '600', marginBottom: '12px' });
            h3.text('语言包采用嵌套结构组织翻译键');
          });

          info.pre(code => {
            code.styles({
              background: 'var(--yoya-bg)',
              borderRadius: '6px',
              padding: '16px',
              overflow: 'auto',
              fontSize: '13px',
              fontFamily: 'monospace'
            });
            code.text(`{
  "common": {
    "save": "保存",
    "cancel": "取消",
    "edit": "编辑"
  },
  "order": {
    "title": "订单管理",
    "orderInfo": "订单信息"
  },
  "status": {
    "pending": "待处理",
    "processing": "处理中",
    "completed": "已完成"
  }
}`);
          });

          info.p(p => {
            p.styles({ marginTop: '12px', fontSize: '14px', lineHeight: '1.6' });
            p.text('翻译键使用点号 (.) 分隔层级，例如：\'\'.t(\'common.save\')、\'\'.t(\'order.title\')');
          });
        }),
      ]));
    },
  });
}
