/**
 * i18n 演示页面 - 订单/合同管理
 * 展示多语言支持下的订单和合同管理界面
 */

import {
  div, span, vDetail, vField, vInput, vSelect, vButton, toast
} from '../../../yoya/index.js';

// 当前语言
let currentLang = 'zh-CN';

// 语言包缓存
let languagePacks = {};

// 当前订单数据
export let orderData = {
  orderNumber: 'ORD-2026030801',
  orderDate: '2026-03-08',
  orderStatus: 'processing',
  orderAmount: '12,580.00',
  currency: 'CNY',
  paymentMethod: 'alipay',
  paymentStatus: 'paid',
  shippingMethod: 'express',
  shippingStatus: 'shipped',
  shippingAddress: '北京市朝阳区 xxx 街道 xxx 号',
  trackingNumber: 'SF1234567890',
  customerName: '张三',
  customerEmail: 'zhangsan@example.com',
  customerPhone: '138****5678',
  customerCompany: '某某科技有限公司',
  customerLevel: 'vip',
  contractNumber: 'CTR-2026-001',
  contractName: '年度采购框架协议',
  contractType: 'purchase',
  contractAmount: '50,000.00',
  signDate: '2026-01-15',
  effectiveDate: '2026-01-20',
  expiryDate: '2027-01-19',
  partyA: '某某科技有限公司',
  partyB: '供应商有限公司',
  agentName: '李四',
  department: '采购部',
  remark: '长期合作客户，享受 VIP 折扣'
};

/**
 * 加载语言包
 */
export async function loadLanguagePacks() {
  try {
    const [zh, en, mn] = await Promise.all([
      import('./i18n/zh-CN.json'),
      import('./i18n/en.json'),
      import('./i18n/mn.json')
    ]);
    languagePacks = {
      'zh-CN': zh.default,
      'en': en.default,
      'mn': mn.default
    };
    return true;
  } catch (error) {
    console.error('Failed to load language packs:', error);
    return false;
  }
}

/**
 * 设置当前语言
 */
export function setLanguage(lang) {
  if (languagePacks[lang]) {
    currentLang = lang;
    // 保存到 localStorage
    localStorage.setItem('i18n-demo-language', lang);
  }
}

/**
 * 获取当前语言
 */
export function getLanguage() {
  return currentLang;
}

/**
 * 翻译函数
 */
export function t(key, params = {}) {
  const pack = languagePacks[currentLang];
  if (!pack) return key;

  const keys = key.split('.');
  let value = pack;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // 回退到英文
      const enPack = languagePacks['en'];
      if (enPack) {
        value = enPack;
        for (const k of keys) {
          if (value && typeof value === 'object' && k in value) {
            value = value[k];
          } else {
            return key;
          }
        }
        break;
      }
      return key;
    }
  }

  // 替换占位符
  if (params && typeof params === 'object') {
    return String(value).replace(/\{(\w+)\}/g, (match, pKey) => params[pKey] || match);
  }
  return value;
}

/**
 * 创建语言切换器
 */
export function createLanguageSwitcher(onChange) {
  return div(lang => {
    lang.styles({ display: 'flex', gap: '8px', alignItems: 'center' });

    const languages = [
      { code: 'zh-CN', name: '中文' },
      { code: 'en', name: 'English' },
      { code: 'mn', name: 'Монгол' }
    ];

    languages.forEach(({ code, name }) => {
      lang.button(btn => {
        const isActive = currentLang === code;
        btn.styles({
          padding: '8px 16px',
          border: isActive ? '1px solid var(--yoya-primary)' : '1px solid var(--yoya-border)',
          borderRadius: '6px',
          background: isActive ? 'var(--yoya-primary)' : 'var(--yoya-bg)',
          color: isActive ? 'white' : 'var(--yoya-text)',
          cursor: 'pointer',
          fontSize: '14px',
          transition: 'all 0.2s'
        });
        btn.text(name);
        btn.onClick(() => {
          setLanguage(code);
          onChange && onChange(code);
        });
      });
    });
  });
}

/**
 * 创建状态徽章
 */
function createStatusBadge(statusKey) {
  const statusStyles = {
    pending: { bg: 'var(--yoya-warning-bg)', color: 'var(--yoya-warning)' },
    processing: { bg: 'var(--yoya-info-bg)', color: 'var(--yoya-info)' },
    completed: { bg: 'var(--yoya-success-bg)', color: 'var(--yoya-success)' },
    active: { bg: 'var(--yoya-primary-alpha)', color: 'var(--yoya-primary)' },
    expired: { bg: 'var(--yoya-error-bg)', color: 'var(--yoya-error)' },
    paid: { bg: 'var(--yoya-success-bg)', color: 'var(--yoya-success)' },
    unpaid: { bg: 'var(--yoya-warning-bg)', color: 'var(--yoya-warning)' },
    shipped: { bg: 'var(--yoya-info-bg)', color: 'var(--yoya-info)' }
  };

  const style = statusStyles[statusKey] || statusStyles.pending;

  return div(badge => {
    badge.styles({
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500',
      background: style.bg,
      color: style.color
    });
    badge.text(t(`status.${statusKey}`));
  });
}

/**
 * 创建可编辑字段
 */
function createEditableField(dataKey, label, options = {}) {
  return vField(f => {
    f.value(orderData[dataKey]);
    f.showContent((el, val) => {
      el.text(val);
      if (options.render) {
        options.render(el, val);
      }
    });
    f.editContent((el, setValue) => {
      el.vInput(inp => {
        inp.type(options.type || 'text');
        inp.value(val);
        inp.onchange(e => setValue(e.target.value));
      });
    });
    f.onSave(({ value }) => {
      orderData[dataKey] = value;
      if (options.onSave) {
        options.onSave(value);
      }
      toast.success(t('message.saveSuccess'));
    });
  });
}

/**
 * 创建订单信息卡片
 */
export function createOrderCard() {
  return div(section => {
    section.styles({
      background: 'var(--yoya-card-bg)',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: 'var(--yoya-shadow)',
      border: '1px solid var(--yoya-border-light)'
    });

    // 标题
    section.div(title => {
      title.styles({
        fontSize: '16px',
        fontWeight: '600',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid var(--yoya-border-light)'
      });
      title.text(t('order.orderInfo'));
    });

    // 详情展示
    section.vDetail(detail => {
      detail.column(2);
      detail.bordered(true);

      detail.item(t('order.orderNumber'), createEditableField('orderNumber', t('order.orderNumber')));
      detail.item(t('order.orderDate'), orderData.orderDate);
      detail.item(t('order.orderStatus'), createStatusBadge(orderData.orderStatus));
      detail.item(t('order.orderAmount'), `¥ ${orderData.orderAmount} ${orderData.currency}`);
      detail.item(t('order.paymentMethod'), t(`payment.${orderData.paymentMethod}`));
      detail.item(t('order.paymentStatus'), createStatusBadge(orderData.paymentStatus));
      detail.item(t('order.shippingMethod'), t(`shipping.${orderData.shippingMethod}`) || orderData.shippingMethod);
      detail.item(t('order.shippingStatus'), createStatusBadge(orderData.shippingStatus));
    });

    // 物流信息
    section.div(shipping => {
      shipping.styles({ marginTop: '16px', padding: '12px', background: 'var(--yoya-bg-secondary)', borderRadius: '6px' });

      shipping.div(row => {
        row.styles({ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' });
        row.span(label => {
          label.styles({ color: 'var(--yoya-text-secondary)', fontSize: '13px' });
          label.text(t('order.trackingNumber'));
        });
        row.span(value => {
          value.styles({ fontWeight: '500' });
          value.text(orderData.trackingNumber);
        });
      });

      shipping.div(row => {
        row.styles({ display: 'flex', justifyContent: 'space-between' });
        row.span(label => {
          label.styles({ color: 'var(--yoya-text-secondary)', fontSize: '13px' });
          label.text(t('order.shippingAddress'));
        });
        row.span(value => {
          value.styles({ fontWeight: '500', textAlign: 'right' });
          value.text(orderData.shippingAddress);
        });
      });
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
        btn.styles({ padding: '10px 20px' });
        btn.type('primary');
        btn.text(t('common.edit'));
      });

      actions.vButton(btn => {
        btn.styles({ padding: '10px 20px' });
        btn.type('default');
        btn.text(t('common.cancel'));
      });
    });
  });
}

/**
 * 创建客户信息卡片
 */
export function createCustomerCard() {
  return div(section => {
    section.styles({
      background: 'var(--yoya-card-bg)',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: 'var(--yoya-shadow)',
      border: '1px solid var(--yoya-border-light)'
    });

    // 标题
    section.div(title => {
      title.styles({
        fontSize: '16px',
        fontWeight: '600',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid var(--yoya-border-light)'
      });
      title.text(t('order.customerInfo'));
    });

    // 详情展示
    section.vDetail(detail => {
      detail.column(2);
      detail.bordered(true);

      detail.item(t('order.customerName'), createEditableField('customerName'));
      detail.item(t('order.customerEmail'), createEditableField('customerEmail', null, { type: 'email' }));
      detail.item(t('order.customerPhone'), orderData.customerPhone);
      detail.item(t('order.customerCompany'), orderData.customerCompany);
      detail.item(t('order.customerLevel'), div(l => {
        l.styles({
          display: 'inline-block',
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '500',
          background: 'var(--yoya-primary-alpha)',
          color: 'var(--yoya-primary)'
        });
        l.text(t(`customerLevel.${orderData.customerLevel}`));
      }));
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
        btn.styles({ padding: '10px 20px' });
        btn.type('primary');
        btn.text(t('common.edit'));
      });

      actions.vButton(btn => {
        btn.styles({ padding: '10px 20px' });
        btn.type('default');
        btn.text(t('common.view'));
      });
    });
  });
}

/**
 * 创建合同信息卡片
 */
export function createContractCard() {
  return div(section => {
    section.styles({
      background: 'var(--yoya-card-bg)',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: 'var(--yoya-shadow)',
      border: '1px solid var(--yoya-border-light)',
      gridColumn: '1 / -1'
    });

    // 标题
    section.div(title => {
      title.styles({
        fontSize: '16px',
        fontWeight: '600',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid var(--yoya-border-light)'
      });
      title.text(t('order.contractInfo'));
    });

    // 详情展示
    section.vDetail(detail => {
      detail.column(3);
      detail.bordered(true);

      detail.item(t('order.contractNumber'), orderData.contractNumber);
      detail.item(t('order.contractName'), orderData.contractName);
      detail.item(t('order.contractType'), t(`contractType.${orderData.contractType}`));
      detail.item(t('order.contractAmount'), `¥ ${orderData.contractAmount}`);
      detail.item(t('order.signDate'), orderData.signDate);
      detail.item(t('order.effectiveDate'), orderData.effectiveDate);

      // 到期日期，带过期警告
      detail.item(t('order.expiryDate'), div(exp => {
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
            badge.text(`${t('common.warning')} - ${days}${t('order.daysLeft') || '天'}`);
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
            badge.text(t('status.expired'));
          });
        }
      }));

      detail.item(t('order.partyA'), orderData.partyA);
      detail.item(t('order.partyB'), orderData.partyB);
      detail.item(t('order.agentName'), createEditableField('agentName'));
      detail.item(t('order.department'), orderData.department);
    });

    // 备注
    section.div(remark => {
      remark.styles({
        marginTop: '16px',
        padding: '12px',
        background: 'var(--yoya-bg-secondary)',
        borderRadius: '6px'
      });
      remark.div(label => {
        label.styles({ color: 'var(--yoya-text-secondary)', fontSize: '13px', marginBottom: '6px' });
        label.text(t('common.remark'));
      });
      remark.div(content => {
        content.styles({ color: 'var(--yoya-text)', fontSize: '14px' });
        content.text(orderData.remark || t('common.noData'));
      });
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
        btn.styles({ padding: '10px 20px' });
        btn.type('primary');
        btn.text(t('common.edit'));
      });

      actions.vButton(btn => {
        btn.styles({ padding: '10px 20px' });
        btn.type('default');
        btn.text(t('common.download'));
      });

      actions.vButton(btn => {
        btn.styles({ padding: '10px 20px' });
        btn.type('danger');
        btn.text(t('common.delete'));
      });
    });
  });
}

/**
 * 创建完整的订单/合同页面
 */
export function createOrderContractPage() {
  return div(page => {
    page.styles({ maxWidth: '1400px', margin: '0 auto', padding: '20px' });

    // 页面头部
    page.div(header => {
      header.styles({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--yoya-border)'
      });

      header.div(title => {
        title.styles({ fontSize: '24px', fontWeight: '600' });
        title.text(t('order.title'));
      });

      header.child(createLanguageSwitcher(() => {
        // 语言切换后重新渲染
        page.clear();
        createOrderContractPage().renderDom();
      }));
    });

    // 内容区域
    page.div(content => {
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

/**
 * 初始化演示页面
 */
export async function initOrderContractDemo(containerId = 'app') {
  await loadLanguagePacks();

  // 从 localStorage 加载语言
  const savedLang = localStorage.getItem('i18n-demo-language') || 'zh-CN';
  setLanguage(savedLang);

  const container = document.getElementById(containerId);
  if (container) {
    const page = createOrderContractPage();
    page.bindTo(container);
  }

  return { orderData, setLanguage, getLanguage, t };
}

// 默认导出
export default {
  loadLanguagePacks,
  setLanguage,
  getLanguage,
  t,
  createLanguageSwitcher,
  createOrderCard,
  createCustomerCard,
  createContractCard,
  createOrderContractPage,
  initOrderContractDemo,
  orderData
};
