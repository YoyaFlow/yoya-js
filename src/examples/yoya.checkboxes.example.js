/**
 * Yoya.Basic - VCheckboxes 组件演示
 */

import {
  div, h2, h3, span, pre, code,
  vCheckboxes, vButton,
  toast
} from '../yoya/index.js';

// ============================================
// 辅助函数：创建演示 + 代码组合
// ============================================
function demoWithCode(title, demoContent, codeString) {
  return div(section => {
    section.styles({
      background: 'white',
      borderRadius: '12px',
      marginBottom: '24px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      overflow: 'hidden',
    });

    // 演示区域
    section.child(div(demoArea => {
      demoArea.styles({ padding: '30px', borderBottom: '1px solid #e0e0e0' });

      demoArea.child(h2(h => {
        h.text(title);
        h.styles({
          color: '#333',
          fontSize: '20px',
          marginBottom: '20px',
          paddingBottom: '12px',
          borderBottom: '2px solid #667eea',
        });
      }));

      demoArea.child(demoContent);
    }));

    // 代码区域
    section.child(div(codeArea => {
      codeArea.styles({ background: '#1e1e1e', padding: '20px' });

      codeArea.child(div(header => {
        header.styles({ color: '#007acc', fontSize: '14px', marginBottom: '10px', fontWeight: '600' });
        header.text('💻 示例代码');
      }));

      codeArea.child(pre(p => {
        p.child(code(c => {
          c.styles({ color: '#d4d4d4' });
          c.html(codeString);
        }));
      }));
    }));
  });
}

// 选项数据
const fruitOptions = [
  { value: 'apple', label: '🍎 苹果' },
  { value: 'banana', label: '🍌 香蕉' },
  { value: 'orange', label: '🍊 橙子' },
  { value: 'grape', label: '🍇 葡萄' },
  { value: 'strawberry', label: '🍓 草莓' },
];

const colorOptions = [
  { value: 'red', label: '红色' },
  { value: 'green', label: '绿色' },
  { value: 'blue', label: '蓝色' },
  { value: 'yellow', label: '黄色' },
];

// ============================================
// 基础多选复选框组
// ============================================
const basicMultipleDemo = demoWithCode(
  '基础多选复选框组',
  div(content => {
    content.child(h3(h => h.text('选择你喜欢的水果（多选）')));

    const checkboxes = vCheckboxes(cb => {
      cb.options(fruitOptions);
      cb.multiple(true);
      cb.value(['apple', 'banana']);
      cb.onChange((values) => {
        valueDisplay.text('当前选中：' + values.join(', '));
      });
    });
    content.child(checkboxes);

    const valueDisplay = div(v => {
      v.styles({
        marginTop: '16px',
        padding: '8px 12px',
        background: '#f5f5f5',
        borderRadius: '6px',
        fontSize: '14px',
        color: '#333',
      });
      v.text('当前选中：apple, banana');
    });
    content.child(valueDisplay);

    content.child(div(btnRow => {
      btnRow.styles({ marginTop: '16px', display: 'flex', gap: '12px' });
      btnRow.child(vButton('全选', b => {
        b.type('primary');
        b.size('small');
        b.on('click', () => {
          checkboxes.value(fruitOptions.map(opt => opt.value));
          valueDisplay.text('当前选中：' + fruitOptions.map(opt => opt.value).join(', '));
        });
      }));
      btnRow.child(vButton('清空', b => {
        b.type('default');
        b.size('small');
        b.on('click', () => {
          checkboxes.value([]);
          valueDisplay.text('当前选中：（无）');
        });
      }));
    }));
  }),
  `
<span class="token-keyword">const</span> fruitOptions = [
  { <span class="token-property">value</span>: <span class="token-string">'apple'</span>, <span class="token-property">label</span>: <span class="token-string">'🍎 苹果'</span> },
  { <span class="token-property">value</span>: <span class="token-string">'banana'</span>, <span class="token-property">label</span>: <span class="token-string">'🍌 香蕉'</span> },
  { <span class="token-property">value</span>: <span class="token-string">'orange'</span>, <span class="token-property">label</span>: <span class="token-string">'🍊 橙子'</span> },
];

<span class="token-function">vCheckboxes</span>(cb => {
  cb.<span class="token-function">options</span>(fruitOptions);
  cb.<span class="token-function">multiple</span>(<span class="token-keyword">true</span>);  <span class="token-comment">// 多选模式</span>
  cb.<span class="token-function">value</span>([<span class="token-string">'apple'</span>, <span class="token-string">'banana'</span>]);
  cb.<span class="token-function">onChange</span>((values) => {
    console.<span class="token-function">log</span>('选中：', values);
  });
});`
);

// ============================================
// 单选复选框组
// ============================================
const singleDemo = demoWithCode(
  '单选复选框组',
  div(content => {
    content.child(h3(h => h.text('选择一个颜色（单选）')));

    const checkboxes = vCheckboxes(cb => {
      cb.options(colorOptions);
      cb.multiple(false);  // 单选模式
      cb.value('red');
      cb.onChange((value) => {
        valueDisplay.text('当前选中：' + value);
      });
    });
    content.child(checkboxes);

    const valueDisplay = div(v => {
      v.styles({
        marginTop: '16px',
        padding: '8px 12px',
        background: '#f5f5f5',
        borderRadius: '6px',
        fontSize: '14px',
        color: '#333',
      });
      v.text('当前选中：red');
    });
    content.child(valueDisplay);
  }),
  `
<span class="token-keyword">const</span> colorOptions = [
  { <span class="token-property">value</span>: <span class="token-string">'red'</span>, <span class="token-property">label</span>: <span class="token-string">'红色'</span> },
  { <span class="token-property">value</span>: <span class="token-string">'green'</span>, <span class="token-property">label</span>: <span class="token-string">'绿色'</span> },
  { <span class="token-property">value</span>: <span class="token-string">'blue'</span>, <span class="token-property">label</span>: <span class="token-string">'蓝色'</span> },
];

<span class="token-function">vCheckboxes</span>(cb => {
  cb.<span class="token-function">options</span>(colorOptions);
  cb.<span class="token-function">multiple</span>(<span class="token-keyword">false</span>);  <span class="token-comment">// 单选模式</span>
  cb.<span class="token-function">value</span>(<span class="token-string">'red'</span>);
  cb.<span class="token-function">onChange</span>((value) => {
    console.<span class="token-function">log</span>('选中：', value);
  });
});`
);

// ============================================
// 布局方式：行布局
// ============================================
const rowLayoutDemo = demoWithCode(
  '布局方式：行布局',
  div(content => {
    content.child(h3(h => h.text('row - 水平排列')));
    content.child(vCheckboxes(cb => {
      cb.options(colorOptions);
      cb.multiple(true);
      cb.value(['red', 'blue']);
      cb.layout('row');
    }));
  }),
  `
<span class="token-function">vCheckboxes</span>(cb => {
  cb.<span class="token-function">options</span>(colorOptions);
  cb.<span class="token-function">multiple</span>(<span class="token-keyword">true</span>);
  cb.<span class="token-function">layout</span>(<span class="token-string">'row'</span>);  <span class="token-comment">// 水平排列</span>
});`
);

// ============================================
// 布局方式：列布局
// ============================================
const columnLayoutDemo = demoWithCode(
  '布局方式：列布局',
  div(content => {
    content.child(h3(h => h.text('column - 垂直排列（默认）')));
    content.child(vCheckboxes(cb => {
      cb.options(colorOptions);
      cb.multiple(true);
      cb.value(['red', 'blue']);
      cb.layout('column');
    }));
  }),
  `
<span class="token-function">vCheckboxes</span>(cb => {
  cb.<span class="token-function">options</span>(colorOptions);
  cb.<span class="token-function">multiple</span>(<span class="token-keyword">true</span>);
  cb.<span class="token-function">layout</span>(<span class="token-string">'column'</span>);  <span class="token-comment">// 垂直排列（默认）</span>
});`
);

// ============================================
// 布局方式：网格布局
// ============================================
const gridLayoutDemo = demoWithCode(
  '布局方式：网格布局',
  div(content => {
    content.child(h3(h => h.text('grid - 2 列网格')));
    content.child(vCheckboxes(cb => {
      cb.options(fruitOptions);
      cb.multiple(true);
      cb.value(['apple', 'grape']);
      cb.layout('grid');
      cb.columns(2);
    }));

    content.child(h3(h => h.text('grid - 3 列网格')));
    content.child(vCheckboxes(cb => {
      cb.options(fruitOptions);
      cb.multiple(true);
      cb.value(['banana', 'strawberry']);
      cb.layout('grid');
      cb.columns(3);
    }));

    content.child(h3(h => h.text('grid - 4 列网格')));
    content.child(vCheckboxes(cb => {
      cb.options(fruitOptions);
      cb.multiple(true);
      cb.layout('grid');
      cb.columns(4);
    }));
  }),
  `
<span class="token-comment">// 2 列网格</span>
<span class="token-function">vCheckboxes</span>(cb => {
  cb.<span class="token-function">options</span>(fruitOptions);
  cb.<span class="token-function">multiple</span>(<span class="token-keyword">true</span>);
  cb.<span class="token-function">layout</span>(<span class="token-string">'grid'</span>);  <span class="token-comment">// 网格布局</span>
  cb.<span class="token-function">columns</span>(<span class="token-number">2</span>);      <span class="token-comment">// 2 列</span>
});

<span class="token-comment">// 3 列网格</span>
<span class="token-function">vCheckboxes</span>(cb => {
  cb.<span class="token-function">options</span>(fruitOptions);
  cb.<span class="token-function">layout</span>(<span class="token-string">'grid'</span>);
  cb.<span class="token-function">columns</span>(<span class="token-number">3</span>);      <span class="token-comment">// 3 列</span>
});`
);

// ============================================
// 禁用状态
// ============================================
const disabledDemo = demoWithCode(
  '禁用状态',
  div(content => {
    content.child(h3(h => h.text('整体禁用')));
    content.child(vCheckboxes(cb => {
      cb.options(colorOptions);
      cb.multiple(true);
      cb.value(['red']);
      cb.disabled(true);
    }));

    content.child(h3(h => h.text('部分选项禁用 - 需要在 options 中设置）')));
    content.child(div(note => {
      note.styles({ color: '#666', fontSize: '14px', marginBottom: '12px' });
      note.text('提示：可以在 vCheckbox 的 setup 中对单个选项设置 disabled()');
    }));
  }),
  `
<span class="token-comment">// 整体禁用</span>
<span class="token-function">vCheckboxes</span>(cb => {
  cb.<span class="token-function">options</span>(colorOptions);
  cb.<span class="token-function">disabled</span>(<span class="token-keyword">true</span>);
});`
);

// ============================================
// 错误状态
// ============================================
const errorDemo = demoWithCode(
  '错误状态',
  div(content => {
    content.child(h3(h => h.text('错误状态')));
    content.child(vCheckboxes(cb => {
      cb.options(colorOptions);
      cb.multiple(true);
      cb.error(true);
    }));

    content.child(div(btnRow => {
      btnRow.styles({ marginTop: '16px', display: 'flex', gap: '12px' });
      btnRow.child(vButton('显示错误', b => {
        b.type('danger');
        b.size('small');
        b.on('click', () => {
          toast.error('请至少选择一个选项！');
        });
      }));
    }));
  }),
  `
<span class="token-comment">// 错误状态</span>
<span class="token-function">vCheckboxes</span>(cb => {
  cb.<span class="token-function">options</span>(colorOptions);
  cb.<span class="token-function">error</span>(<span class="token-keyword">true</span>);
});`
);

// ============================================
// 初始化应用
// ============================================
export function initApp() {
  const app = document.getElementById('app');

  if (!app) {
    console.error('未找到 #app 元素');
    return;
  }

  // 渲染所有演示区域
  const container = div(c => {
    c.child(basicMultipleDemo);
    c.child(singleDemo);
    c.child(rowLayoutDemo);
    c.child(columnLayoutDemo);
    c.child(gridLayoutDemo);
    c.child(disabledDemo);
    c.child(errorDemo);
  });
  container.bindTo('#app');
}

// 自动初始化
initApp();
