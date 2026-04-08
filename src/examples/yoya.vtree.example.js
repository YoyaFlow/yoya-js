/**
 * VTree 树形组件演示页面
 */

import { vTree, div, span, button, flex } from '../yoya/index.js';

console.log('VTree 演示页面脚本加载');

// 使用 setTimeout 确保 DOM 已经加载
setTimeout(() => {
  console.log('执行初始化代码，readyState:', document.readyState);
  initDemo();
}, 100);

function initDemo() {

  // ==================== 演示 1: 基础树形结构 ====================
  const treeData1 = [
    {
      key: '0',
      title: '根节点',
      children: [
        {
          key: '1',
          title: '节点 1',
          children: [
            { key: '1-1', title: '节点 1-1' },
            { key: '1-2', title: '节点 1-2', children: [
              { key: '1-2-1', title: '节点 1-2-1' },
              { key: '1-2-2', title: '节点 1-2-2' },
              { key: '1-2-3', title: '节点 1-2-3' }
            ]}
          ]
        },
        {
          key: '2',
          title: '节点 2',
          children: [
            { key: '2-1', title: '节点 2-1' },
            { key: '2-2', title: '节点 2-2 (禁用)', disabled: true }
          ]
        },
        {
          key: '3',
          title: '节点 3',
          children: [
            { key: '3-1', title: '节点 3-1' },
            { key: '3-2', title: '节点 3-2' }
          ]
        }
      ]
    }
  ];

  let tree1Instance = null;

  function updateStateDisplay1() {
    if (!tree1Instance) return;

    const selectedKeys = tree1Instance.selectedKeys();
    const checkedKeys = tree1Instance.checkedKeys();

    const selectedEl = document.getElementById('selectedState1');
    const checkedEl = document.getElementById('checkedState1');

    selectedEl.innerHTML = selectedKeys.length > 0
      ? selectedKeys.map(k => `<span style="display:inline-block;background:#e6f7ff;color:#1890ff;padding:2px 8px;border-radius:4px;margin:2px;">${k}</span>`).join('')
      : '<span class="empty-state">暂无选中节点</span>';

    checkedEl.innerHTML = checkedKeys.length > 0
      ? checkedKeys.map(k => `<span style="display:inline-block;background:#f6ffed;color:#52c41a;padding:2px 8px;border-radius:4px;margin:2px;">${k}</span>`).join('')
      : '<span class="empty-state">暂无勾选节点</span>';
  }

  // 操作按钮
  const actionBar1 = document.getElementById('actionBar1');
  const buttons1 = [
    { text: '展开全部', action: () => tree1Instance?.expandAll() },
    { text: '收起全部', action: () => tree1Instance?.collapseAll() },
    { text: '选中节点 1-2-1', action: () => tree1Instance?.selectedKeys(['1-2-1']) },
    { text: '勾选节点 1', action: () => tree1Instance?.checkedKeys(['1']) },
    { text: '清空选中', action: () => { tree1Instance?.selectedKeys([]); updateStateDisplay1(); } },
    { text: '清空勾选', action: () => { tree1Instance?.checkedKeys([]); updateStateDisplay1(); } }
  ];

  buttons1.forEach(btn => {
    const buttonEl = button(b => {
      b.text(btn.text);
      b.styles({
        padding: '8px 16px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.9rem'
      });
      b.onClick(() => {
        btn.action();
        updateStateDisplay1();
        showToast('操作完成', 'success');
      });
    });
    actionBar1.appendChild(buttonEl.renderDom());
  });

  // 创建树
  const tree1El = document.getElementById('tree1');
  const tree1 = vTree(t => {
    t.data(treeData1);
    t.checkable(true);
    t.expandedKeys(['0', '1']);
    t.onSelect((e) => {
      console.log('[VTree1 onSelect]', e);
      updateStateDisplay1();
      showToast(`选中：${e.node.title}`, 'info');
    });
    t.onCheck((e) => {
      console.log('[VTree1 onCheck]', e);
      updateStateDisplay1();
      showToast(`勾选：${e.node.title}`, 'success');
    });
    t.onExpand((e) => {
      console.log('[VTree1 onExpand]', e);
    });
  });
  tree1Instance = tree1;
  tree1El.appendChild(tree1.renderDom());

  // ==================== 演示 2: 单选模式 ====================
  const treeData2 = [
    {
      key: 'a',
      title: '分类 A',
      children: [
        { key: 'a-1', title: '选项 A-1' },
        { key: 'a-2', title: '选项 A-2' },
        { key: 'a-3', title: '选项 A-3' }
      ]
    },
    {
      key: 'b',
      title: '分类 B',
      children: [
        { key: 'b-1', title: '选项 B-1' },
        { key: 'b-2', title: '选项 B-2' }
      ]
    },
    {
      key: 'c',
      title: '分类 C',
      children: [
        { key: 'c-1', title: '选项 C-1' },
        { key: 'c-2', title: '选项 C-2' }
      ]
    }
  ];

  let tree2Instance = null;

  function updateStateDisplay2() {
    if (!tree2Instance) return;

    const selectedKeys = tree2Instance.selectedKeys();
    const selectedEl = document.getElementById('selectedState2');

    selectedEl.innerHTML = selectedKeys.length > 0
      ? selectedKeys.map(k => `<span style="display:inline-block;background:#e6f7ff;color:#1890ff;padding:2px 8px;border-radius:4px;margin:2px;">${k}</span>`).join('')
      : '<span class="empty-state">暂无选中节点</span>';
  }

  const tree2El = document.getElementById('tree2');
  const tree2 = vTree(t => {
    t.data(treeData2);
    t.singleSelectMode(true);
    t.onSelect((e) => {
      console.log('[VTree2 onSelect]', e);
      updateStateDisplay2();
    });
  });
  tree2Instance = tree2;
  tree2El.appendChild(tree2.renderDom());

  // ==================== 演示 3: 自定义节点内容 ====================
  const treeData3 = [
    {
      key: 'custom-1',
      title: span(s => {
        s.styles({ display: 'inline-flex', alignItems: 'center', gap: '6px' });
        s.html('📁 文档库');
      })
    },
    {
      key: 'custom-2',
      title: span(s => {
        s.styles({ display: 'inline-flex', alignItems: 'center', gap: '6px' });
        s.html('🖼️ 图片集');
      }),
      children: [
        {
          key: 'custom-2-1',
          title: span(s => {
            s.styles({ display: 'inline-flex', alignItems: 'center', gap: '6px' });
            s.html('📷 照片');
          })
        },
        {
          key: 'custom-2-2',
          title: span(s => {
            s.styles({ display: 'inline-flex', alignItems: 'center', gap: '6px' });
            s.html('🎨 设计稿');
          })
        }
      ]
    },
    {
      key: 'custom-3',
      title: span(s => {
        s.styles({ display: 'inline-flex', alignItems: 'center', gap: '6px' });
        s.html('🎵 音频文件');
      })
    },
    {
      key: 'custom-4',
      title: span(s => {
        s.styles({ display: 'inline-flex', alignItems: 'center', gap: '6px' });
        s.html('🎬 视频文件');
      })
    }
  ];

  const tree3El = document.getElementById('tree3');
  const tree3 = vTree(t => {
    t.data(treeData3);
    t.expandedKeys(['custom-2']);
  });
  tree3El.appendChild(tree3.renderDom());

  // ==================== Toast 提示 ====================
  function showToast(message, type = 'info') {
    const div = document.createElement('div');
    div.textContent = message;
    div.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      background: ${type === 'success' ? '#52c41a' : type === 'warning' ? '#faad14' : type === 'error' ? '#ff4d4f' : '#1890ff'};
      color: '#fff';
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
      transition: all 0.3s;
      font-weight: 500;
    `;
    document.body.appendChild(div);
    setTimeout(() => {
      div.style.opacity = '0';
      div.style.transform = 'translateY(-20px)';
      setTimeout(() => div.remove(), 300);
    }, 2000);
  }

  // 初始化显示状态
  setTimeout(() => {
    updateStateDisplay1();
    updateStateDisplay2();
  }, 100);

  console.log('VTree 演示页面初始化完成');
}
