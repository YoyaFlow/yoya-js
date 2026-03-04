/**
 * Yoya.Basic - VTimer/VTimer2 组件演示
 * 日历选择器 / 日期范围选择器
 */

import {
  div, h2, h3, span, pre, code,
  vTimer, vTimer2, vButton,
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

// ============================================
// 基础日期选择器
// ============================================
const basicDateDemo = demoWithCode(
  '基础日期选择器',
  div(content => {
    content.child(h3(h => h.text('选择日期')));

    const timer = vTimer(t => {
      t.value('2024-03-15');
      t.onChange((value) => {
        valueDisplay.text('选中日期：' + value);
      });
    });
    content.child(timer);

    const valueDisplay = div(v => {
      v.styles({
        marginTop: '16px',
        padding: '8px 12px',
        background: '#f5f5f5',
        borderRadius: '6px',
        fontSize: '14px',
        color: '#333',
        fontFamily: 'monospace',
      });
      v.text('选中日期：2024-03-15');
    });
    content.child(valueDisplay);

    content.child(div(btnRow => {
      btnRow.styles({ marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' });
      btnRow.child(vButton('设为今天', b => {
        b.type('primary');
        b.size('small');
        b.on('click', () => {
          const today = new Date().toISOString().split('T')[0];
          timer.value(today);
          valueDisplay.text('选中日期：' + today);
        });
      }));
      btnRow.child(vButton('设为明天', b => {
        b.type('default');
        b.size('small');
        b.on('click', () => {
          const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
          timer.value(tomorrow);
          valueDisplay.text('选中日期：' + tomorrow);
        });
      }));
      btnRow.child(vButton('清空', b => {
        b.type('default');
        b.size('small');
        b.on('click', () => {
          timer.value('');
          valueDisplay.text('选中日期：（空）');
        });
      }));
    }));
  }),
  `
<span class="token-comment">// 基础日期选择器</span>
<span class="token-function">vTimer</span>(t => {
  t.<span class="token-function">value</span>(<span class="token-string">'2024-03-15'</span>);  <span class="token-comment">// 设置初始值</span>
  t.<span class="token-function">onChange</span>((value) => {
    console.<span class="token-function">log</span>('选中日期：', value);
  });
});`
);

// ============================================
// 日期时间选择器
// ============================================
const dateTimeDemo = demoWithCode(
  '日期时间选择器',
  div(content => {
    content.child(h3(h => h.text('选择日期和时间')));

    const timer = vTimer(t => {
      t.type('datetime-local');
      t.value('2024-03-15T14:30');
      t.onChange((value) => {
        valueDisplay.text('选中时间：' + value);
      });
    });
    content.child(timer);

    const valueDisplay = div(v => {
      v.styles({
        marginTop: '16px',
        padding: '8px 12px',
        background: '#f5f5f5',
        borderRadius: '6px',
        fontSize: '14px',
        color: '#333',
        fontFamily: 'monospace',
      });
      v.text('选中时间：2024-03-15T14:30');
    });
    content.child(valueDisplay);

    content.child(div(note => {
      note.styles({ marginTop: '16px', padding: '12px', background: '#e3f2fd', borderRadius: '6px', fontSize: '14px', color: '#1976d2' });
      note.text('💡 提示：使用 type("datetime-local") 可选择日期和时间');
    }));
  }),
  `
<span class="token-comment">// 日期时间选择器</span>
<span class="token-function">vTimer</span>(t => {
  t.<span class="token-function">type</span>(<span class="token-string">'datetime-local'</span>);  <span class="token-comment">// 日期 + 时间</span>
  t.<span class="token-function">value</span>(<span class="token-string">'2024-03-15T14:30'</span>);
  t.<span class="token-function">onChange</span>((value) => {
    console.<span class="token-function">log</span>('选中时间：', value);
  });
});`
);

// ============================================
// 时间选择器
// ============================================
const timeDemo = demoWithCode(
  '时间选择器',
  div(content => {
    content.child(h3(h => h.text('选择时间')));

    const timer = vTimer(t => {
      t.type('time');
      t.value('14:30');
      t.onChange((value) => {
        valueDisplay.text('选中时间：' + value);
      });
    });
    content.child(timer);

    const valueDisplay = div(v => {
      v.styles({
        marginTop: '16px',
        padding: '8px 12px',
        background: '#f5f5f5',
        borderRadius: '6px',
        fontSize: '14px',
        color: '#333',
        fontFamily: 'monospace',
      });
      v.text('选中时间：14:30');
    });
    content.child(valueDisplay);
  }),
  `
<span class="token-comment">// 时间选择器</span>
<span class="token-function">vTimer</span>(t => {
  t.<span class="token-function">type</span>(<span class="token-string">'time'</span>);  <span class="token-comment">// 仅时间</span>
  t.<span class="token-function">value</span>(<span class="token-string">'14:30'</span>);
  t.<span class="token-function">onChange</span>((value) => {
    console.<span class="token-function">log</span>('选中时间：', value);
  });
});`
);

// ============================================
// 禁用和只读状态
// ============================================
const disabledDemo = demoWithCode(
  '禁用和只读状态',
  div(content => {
    content.child(h3(h => h.text('禁用状态')));
    content.child(vTimer(t => {
      t.value('2024-03-15');
      t.disabled(true);
    }));

    content.child(h3(h => h.text('只读状态')));
    content.child(vTimer(t => {
      t.value('2024-03-15');
      t.readonly(true);
    }));

    content.child(h3(h => h.text('错误状态')));
    content.child(vTimer(t => {
      t.value('2024-03-15');
      t.error(true);
    }));
  }),
  `
<span class="token-comment">// 禁用状态</span>
<span class="token-function">vTimer</span>(t => {
  t.<span class="token-function">value</span>(<span class="token-string">'2024-03-15'</span>);
  t.<span class="token-function">disabled</span>(<span class="token-keyword">true</span>);
});

<span class="token-comment">// 只读状态</span>
<span class="token-function">vTimer</span>(t => {
  t.<span class="token-function">value</span>(<span class="token-string">'2024-03-15'</span>);
  t.<span class="token-function">readonly</span>(<span class="token-keyword">true</span>);
});

<span class="token-comment">// 错误状态</span>
<span class="token-function">vTimer</span>(t => {
  t.<span class="token-function">value</span>(<span class="token-string">'2024-03-15'</span>);
  t.<span class="token-function">error</span>(<span class="token-keyword">true</span>);
});`
);

// ============================================
// 日期范围选择器
// ============================================
const dateRangeDemo = demoWithCode(
  '日期范围选择器（VTimer2）',
  div(content => {
    content.child(h3(h => h.text('选择开始和结束日期')));

    const timer2 = vTimer2(t2 => {
      t2.value({ start: '2024-03-01', end: '2024-03-31' });
      t2.onChange((range) => {
        valueDisplay.text(`日期范围：${range.start} 至 ${range.end}`);
      });
    });
    content.child(timer2);

    const valueDisplay = div(v => {
      v.styles({
        marginTop: '16px',
        padding: '8px 12px',
        background: '#f5f5f5',
        borderRadius: '6px',
        fontSize: '14px',
        color: '#333',
        fontFamily: 'monospace',
      });
      v.text('日期范围：2024-03-01 至 2024-03-31');
    });
    content.child(valueDisplay);

    content.child(div(btnRow => {
      btnRow.styles({ marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' });
      btnRow.child(vButton('设为本月', b => {
        b.type('primary');
        b.size('small');
        b.on('click', () => {
          const now = new Date();
          const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
          const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
          timer2.value({ start, end });
          valueDisplay.text(`日期范围：${start} 至 ${end}`);
        });
      }));
      btnRow.child(vButton('设为本周', b => {
        b.type('default');
        b.size('small');
        b.on('click', () => {
          const now = new Date();
          const dayOfWeek = now.getDay();
          const start = new Date(now.getTime() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) * 86400000).toISOString().split('T')[0];
          const end = new Date(now.getTime() + (7 - dayOfWeek) * 86400000).toISOString().split('T')[0];
          timer2.value({ start, end });
          valueDisplay.text(`日期范围：${start} 至 ${end}`);
        });
      }));
      btnRow.child(vButton('设为今年', b => {
        b.type('default');
        b.size('small');
        b.on('click', () => {
          const year = new Date().getFullYear();
          const start = `${year}-01-01`;
          const end = `${year}-12-31`;
          timer2.value({ start, end });
          valueDisplay.text(`日期范围：${start} 至 ${end}`);
        });
      }));
    }));
  }),
  `
<span class="token-comment">// 日期范围选择器</span>
<span class="token-function">vTimer2</span>(t2 => {
  t2.<span class="token-function">value</span>({
    <span class="token-property">start</span>: <span class="token-string">'2024-03-01'</span>,  <span class="token-comment">// 开始日期</span>
    <span class="token-property">end</span>: <span class="token-string">'2024-03-31'</span>    <span class="token-comment">// 结束日期</span>
  });
  t2.<span class="token-function">onChange</span>((range) => {
    console.<span class="token-function">log</span>('日期范围：', range.start, '-', range.end);
  });
});

<span class="token-comment">// 限制日期范围</span>
<span class="token-function">vTimer2</span>(t2 => {
  t2.<span class="token-function">min</span>(<span class="token-string">'2024-01-01'</span>);  <span class="token-comment">// 最小日期</span>
  t2.<span class="token-function">max</span>(<span class="token-string">'2024-12-31'</span>);  <span class="token-comment">// 最大日期</span>
});`
);

// ============================================
// 日期时间范围选择器
// ============================================
const dateTimeRangeDemo = demoWithCode(
  '日期时间范围选择器',
  div(content => {
    content.child(h3(h => h.text('选择开始和结束日期时间')));

    const timer2 = vTimer2(t2 => {
      t2.type('datetime-local');
      t2.value({ start: '2024-03-15T09:00', end: '2024-03-15T18:00' });
      t2.onChange((range) => {
        valueDisplay.clear()
        valueDisplay.text(`时间范围：${range.start} 至 ${range.end}`);
      });
    });
    content.child(timer2);

    const valueDisplay = div(v => {
      v.styles({
        marginTop: '16px',
        padding: '8px 12px',
        background: '#f5f5f5',
        borderRadius: '6px',
        fontSize: '14px',
        color: '#333',
        fontFamily: 'monospace',
      });
      v.text('时间范围：2024-03-15T09:00 至 2024-03-15T18:00');
    });
    content.child(valueDisplay);

    content.child(div(note => {
      note.styles({ marginTop: '16px', padding: '12px', background: '#fff3cd', borderRadius: '6px', fontSize: '14px', color: '#856404' });
      note.text('💡 提示：使用 type("datetime-local") 可选择日期和时间范围');
    }));
  }),
  `
<span class="token-comment">// 日期时间范围选择器</span>
<span class="token-function">vTimer2</span>(t2 => {
  t2.<span class="token-function">type</span>(<span class="token-string">'datetime-local'</span>);
  t2.<span class="token-function">value</span>({
    <span class="token-property">start</span>: <span class="token-string">'2024-03-15T09:00'</span>,
    <span class="token-property">end</span>: <span class="token-string">'2024-03-15T18:00'</span>
  });
  t2.<span class="token-function">onChange</span>((range) => {
    console.<span class="token-function">log</span>('时间范围：', range.start, '-', range.end);
  });
});`
);

// ============================================
// 限制日期范围
// ============================================
const limitedRangeDemo = demoWithCode(
  '限制日期范围',
  div(content => {
    content.child(h3(h => h.text('限制开始和结束日期范围')));

    content.child(div(timerContainer => {
      timerContainer.styles({ marginBottom: '16px' });

      // 限制整体范围
      timerContainer.child(vTimer2(t2 => {
        t2.value({ start: '', end: '' });
        t2.min('2024-01-01');
        t2.max('2024-12-31');
        t2.onChange((range) => {
          valueDisplay.text(`选择范围：${range.start || '未选择'} 至 ${range.end || '未选择'}`);
        });
      }));

      const valueDisplay = div(v => {
        v.styles({
          marginTop: '12px',
          padding: '8px 12px',
          background: '#f5f5f5',
          borderRadius: '6px',
          fontSize: '14px',
          color: '#333',
          fontFamily: 'monospace',
        });
        v.text('选择范围：未选择 至 未选择');
      });
      timerContainer.child(valueDisplay);
    }));

    content.child(div(note => {
      note.styles({ marginTop: '16px', padding: '12px', background: '#e3f2fd', borderRadius: '6px', fontSize: '14px', color: '#1976d2' });
      note.text('💡 提示：使用 min() 和 max() 方法可以限制可选择的日期范围');
    }));

    content.child(h3(h => h.text('分别限制开始和结束日期')));

    content.child(vTimer2(t2 => {
      t2.value({ start: '', end: '' });
      t2.startMin('2024-01-01');
      t2.startMax('2024-06-30');
      t2.endMin('2024-07-01');
      t2.endMax('2024-12-31');
    }));

    content.child(div(note => {
      note.styles({ marginTop: '16px', padding: '12px', background: '#fff3cd', borderRadius: '6px', fontSize: '14px', color: '#856404' });
      note.text('💡 提示：使用 startMin/startMax 限制开始日期，使用 endMin/endMax 限制结束日期');
    }));
  }),
  `
<span class="token-comment">// 限制整体范围</span>
<span class="token-function">vTimer2</span>(t2 => {
  t2.<span class="token-function">min</span>(<span class="token-string">'2024-01-01'</span>);  <span class="token-comment">// 开始和结束的最小值</span>
  t2.<span class="token-function">max</span>(<span class="token-string">'2024-12-31'</span>);  <span class="token-comment">// 开始和结束的最大值</span>
});

<span class="token-comment">// 分别限制开始和结束日期</span>
<span class="token-function">vTimer2</span>(t2 => {
  t2.<span class="token-function">startMin</span>(<span class="token-string">'2024-01-01'</span>);  <span class="token-comment">// 开始日期最小值</span>
  t2.<span class="token-function">startMax</span>(<span class="token-string">'2024-06-30'</span>);  <span class="token-comment">// 开始日期最大值</span>
  t2.<span class="token-function">endMin</span>(<span class="token-string">'2024-07-01'</span>);    <span class="token-comment">// 结束日期最小值</span>
  t2.<span class="token-function">endMax</span>(<span class="token-string">'2024-12-31'</span>);  <span class="token-comment">// 结束日期最大值</span>
});`
);

// ============================================
// 应用场景：请假申请
// ============================================
const leaveApplicationDemo = demoWithCode(
  '应用场景：请假申请',
  div(content => {
    content.child(h3(h => h.text('请选择请假日期范围')));

    let startDate = '';
    let endDate = '';

    const infoDisplay = div(v => {
      v.styles({
        marginTop: '16px',
        padding: '16px',
        background: '#e8f5e9',
        borderRadius: '6px',
        fontSize: '14px',
        color: '#2e7d32',
      });
      v.text('请选择开始和结束日期');
    });

    content.child(vTimer2(t2 => {
      t2.value({ start: '', end: '' });
      t2.onChange((range) => {
        startDate = range.start;
        endDate = range.end;
        updateDisplay();
      });
    }));

    content.child(infoDisplay);

    function updateDisplay() {
      // 先清空内容
      infoDisplay.clear();

      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        infoDisplay.styles({ background: '#e8f5e9', color: '#2e7d32' });
        infoDisplay.text(`请假期间：${startDate} 至 ${endDate}，共 ${days} 天`);
      } else if (startDate) {
        infoDisplay.styles({ background: '#fff3cd', color: '#856404' });
        infoDisplay.text(`开始日期：${startDate}，请选择结束日期`);
      } else {
        infoDisplay.styles({ background: '#f5f5f5', color: '#666' });
        infoDisplay.text('请选择开始和结束日期');
      }
    }

    content.child(div(btnRow => {
      btnRow.styles({ marginTop: '16px', display: 'flex', gap: '12px' });
      btnRow.child(vButton('提交申请', b => {
        b.type('primary');
        b.on('click', () => {
          if (startDate && endDate) {
            toast.success(`请假申请已提交：${startDate} 至 ${endDate}`);
          } else {
            toast.error('请选择完整的日期范围');
          }
        });
      }));
    }));
  }),
  `
<span class="token-comment">// 请假申请场景</span>
<span class="token-function">vTimer2</span>(t2 => {
  t2.<span class="token-function">onChange</span>((range) => {
    <span class="token-function">calculateDays</span>(range.start, range.end);
  });
});

<span class="token-function">vButton</span>('提交申请', b => {
  b.<span class="token-function">on</span>(<span class="token-string">'click'</span>, () => {
    <span class="token-function">submitApplication</span>();
  });
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
    c.child(basicDateDemo);
    c.child(dateTimeDemo);
    c.child(timeDemo);
    c.child(disabledDemo);
    c.child(dateRangeDemo);
    c.child(limitedRangeDemo);
    c.child(dateTimeRangeDemo);
    c.child(leaveApplicationDemo);
  });
  container.bindTo('#app');
}

// 自动初始化
initApp();
