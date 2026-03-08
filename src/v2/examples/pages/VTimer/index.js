/**
 * Yoya.Basic V2 - VTimer 日期选择器演示页面
 * 展示日期、时间、日期时间等选择器功能
 */

import {
  div, span, vstack, hstack, grid, responsiveGrid,
  vCard, vCardHeader, vCardBody, toast,
  vTimer, vTimer2, vButton
} from '../../../../yoya/index.js';
import { AppShell } from '../../framework/AppShell.js';
import { CodeDemo } from '../../components/CodeDemo.js';
import { DocSection } from '../../components/DocSection.js';
import { PageHeader } from '../../components/PageHeader.js';

/**
 * 创建基础日期选择器演示
 */
function createDatePickers() {
  return vCard(card => {
    card.vCardHeader('📅 基础日期选择器');
    card.vCardBody(content => {
      content.styles({ display: 'flex', flexDirection: 'column', gap: '16px' });

      // 日期选择器
      content.div(row => {
        row.styles({ display: 'flex', alignItems: 'center', gap: '12px' });
        row.span(label => {
          label.styles({ width: '100px', fontSize: '14px', color: 'var(--islands-text-secondary)' });
          label.text('日期：');
        });
        row.child(vTimer(t => {
          t.type('date');
          t.value('2026-03-08');
          t.onChange(({ value }) => {
            toast.info(`选中日期：${value}`);
          });
        }));
      });

      // 月份选择器
      content.div(row => {
        row.styles({ display: 'flex', alignItems: 'center', gap: '12px' });
        row.span(label => {
          label.styles({ width: '100px', fontSize: '14px', color: 'var(--islands-text-secondary)' });
          label.text('月份：');
        });
        row.child(vTimer(t => {
          t.type('month');
          t.value('2026-03');
          t.onChange(({ value }) => {
            toast.info(`选中月份：${value}`);
          });
        }));
      });

      // 周选择器
      content.div(row => {
        row.styles({ display: 'flex', alignItems: 'center', gap: '12px' });
        row.span(label => {
          label.styles({ width: '100px', fontSize: '14px', color: 'var(--islands-text-secondary)' });
          label.text('周：');
        });
        row.child(vTimer(t => {
          t.type('week');
          t.value('2026-W10');
          t.onChange(({ value }) => {
            toast.info(`选中周：${value}`);
          });
        }));
      });

      // 时间选择器
      content.div(row => {
        row.styles({ display: 'flex', alignItems: 'center', gap: '12px' });
        row.span(label => {
          label.styles({ width: '100px', fontSize: '14px', color: 'var(--islands-text-secondary)' });
          label.text('时间：');
        });
        row.child(vTimer(t => {
          t.type('time');
          t.value('14:30');
          t.onChange(({ value }) => {
            toast.info(`选中时间：${value}`);
          });
        }));
      });
    });
  });
}

/**
 * 创建日期时间选择器演示
 */
function createDateTimePickers() {
  return vCard(card => {
    card.vCardHeader('🕐 日期时间选择器');
    card.vCardBody(content => {
      content.styles({ display: 'flex', flexDirection: 'column', gap: '16px' });

      // 日期时间选择器
      content.div(row => {
        row.styles({ display: 'flex', alignItems: 'center', gap: '12px' });
        row.span(label => {
          label.styles({ width: '120px', fontSize: '14px', color: 'var(--islands-text-secondary)' });
          label.text('日期时间：');
        });
        row.child(vTimer(t => {
          t.type('datetime-local');
          t.value('2026-03-08T14:30');
          t.onChange(({ value }) => {
            toast.info(`选中日期时间：${value}`);
          });
        }));
      });

      // 带最小/最大值的日期时间
      content.div(row => {
        row.styles({ display: 'flex', alignItems: 'center', gap: '12px' });
        row.span(label => {
          label.styles({ width: '120px', fontSize: '14px', color: 'var(--islands-text-secondary)' });
          label.text('限制范围：');
        });
        row.child(vTimer(t => {
          t.type('datetime-local');
          t.min('2026-01-01T00:00');
          t.max('2026-12-31T23:59');
          t.value('2026-06-15T10:00');
          t.onChange(({ value }) => {
            toast.info(`选中日期时间：${value}`);
          });
        }));
      });
    });
  });
}

/**
 * 创建日期范围选择器演示
 */
function createDateRangePickers() {
  return vCard(card => {
    card.vCardHeader('📆 日期范围选择器');
    card.vCardBody(content => {
      content.styles({ display: 'flex', flexDirection: 'column', gap: '16px' });

      // 基础日期范围
      content.div(row => {
        row.styles({ display: 'flex', alignItems: 'center', gap: '12px' });
        row.span(label => {
          label.styles({ width: '120px', fontSize: '14px', color: 'var(--islands-text-secondary)' });
          label.text('日期范围：');
        });
        row.child(vTimer2(t2 => {
          t2.type('date');
          t2.value({
            start: '2026-03-01',
            end: '2026-03-31'
          });
          t2.onChange(({ value }) => {
            toast.info(`选中范围：${value.start} ~ ${value.end}`);
          });
        }));
      });

      // 月份范围
      content.div(row => {
        row.styles({ display: 'flex', alignItems: 'center', gap: '12px' });
        row.span(label => {
          label.styles({ width: '120px', fontSize: '14px', color: 'var(--islands-text-secondary)' });
          label.text('月份范围：');
        });
        row.child(vTimer2(t2 => {
          t2.type('month');
          t2.value({
            start: '2026-01',
            end: '2026-12'
          });
          t2.onChange(({ value }) => {
            toast.info(`选中范围：${value.start} ~ ${value.end}`);
          });
        }));
      });

      // 日期时间范围
      content.div(row => {
        row.styles({ display: 'flex', alignItems: 'center', gap: '12px' });
        row.span(label => {
          label.styles({ width: '120px', fontSize: '14px', color: 'var(--islands-text-secondary)' });
          label.text('时间范围：');
        });
        row.child(vTimer2(t2 => {
          t2.type('datetime-local');
          t2.value({
            start: '2026-03-01T09:00',
            end: '2026-03-31T18:00'
          });
          t2.onChange(({ value }) => {
            toast.info(`选中范围：${value.start} ~ ${value.end}`);
          });
        }));
      });
    });
  });
}

/**
 * 创建带验证的选择器演示
 */
function createValidationPickers() {
  return vCard(card => {
    card.vCardHeader('✅ 带验证的选择器');
    card.vCardBody(content => {
      content.styles({ display: 'flex', flexDirection: 'column', gap: '16px' });

      // 必填日期
      content.div(row => {
        row.styles({ display: 'flex', alignItems: 'center', gap: '12px' });
        row.span(label => {
          label.styles({ width: '120px', fontSize: '14px', color: 'var(--islands-text-secondary)' });
          label.text('必填日期：');
        });
        row.child(vTimer(t => {
          t.type('date');
          t.placeholder('请选择日期');
          t.onChange(({ value }) => {
            if (!value) {
              t.error(true);
              toast.error('日期不能为空');
            } else {
              t.error(false);
              toast.success(`选中日期：${value}`);
            }
          });
        }));
      });

      // 禁用状态
      content.div(row => {
        row.styles({ display: 'flex', alignItems: 'center', gap: '12px' });
        row.span(label => {
          label.styles({ width: '120px', fontSize: '14px', color: 'var(--islands-text-secondary)' });
          label.text('禁用状态：');
        });
        row.child(vTimer(t => {
          t.type('date');
          t.value('2026-01-01');
          t.disabled(true);
        }));
      });

      // 只读状态
      content.div(row => {
        row.styles({ display: 'flex', alignItems: 'center', gap: '12px' });
        row.span(label => {
          label.styles({ width: '120px', fontSize: '14px', color: 'var(--islands-text-secondary)' });
          label.text('只读状态：');
        });
        row.child(vTimer(t => {
          t.type('date');
          t.value('2026-06-01');
          t.readonly(true);
        }));
      });

      // 错误状态
      content.div(row => {
        row.styles({ display: 'flex', alignItems: 'center', gap: '12px' });
        row.span(label => {
          label.styles({ width: '120px', fontSize: '14px', color: 'var(--islands-text-secondary)' });
          label.text('错误状态：');
        });
        row.child(vTimer(t => {
          t.type('date');
          t.value('2026-02-30');
          t.error(true);
        }));
      });
    });
  });
}

/**
 * 创建实际应用场景演示
 */
function createScenarios() {
  return vCard(card => {
    card.vCardHeader('💼 实际应用场景');
    card.vCardBody(content => {
      content.styles({ display: 'flex', flexDirection: 'column', gap: '20px' });

      // 请假申请表单
      content.div(form => {
        form.styles({
          border: '1px solid var(--islands-border)',
          borderRadius: '8px',
          padding: '16px',
          background: 'var(--islands-bg-secondary)'
        });

        form.div(title => {
          title.styles({ fontSize: '14px', fontWeight: '600', marginBottom: '12px' });
          title.text('📝 请假申请');
        });

        form.div(field => {
          field.styles({ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' });
          field.span(label => {
            label.styles({ width: '80px', fontSize: '13px', color: 'var(--islands-text-secondary)' });
            label.text('开始时间：');
          });
          field.child(vTimer(t => {
            t.type('datetime-local');
            t.value('2026-03-10T09:00');
            t.id('leave-start');
          }));
        });

        form.div(field => {
          field.styles({ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' });
          field.span(label => {
            label.styles({ width: '80px', fontSize: '13px', color: 'var(--islands-text-secondary)' });
            label.text('结束时间：');
          });
          field.child(vTimer(t => {
            t.type('datetime-local');
            t.value('2026-03-12T18:00');
            t.id('leave-end');
          }));
        });

        form.div(actions => {
          actions.styles({ display: 'flex', gap: '8px', marginTop: '16px' });
          actions.child(vButton('提交申请')
            .type('primary')
            .onClick(() => {
              const start = document.getElementById('leave-start');
              const end = document.getElementById('leave-end');
              toast.success(`请假申请：${start?._boundElement?.value} 至 ${end?._boundElement?.value}`);
            }));
          actions.child(vButton('取消').type('default'));
        });
      });

      // 会议预定表单
      content.div(form => {
        form.styles({
          border: '1px solid var(--islands-border)',
          borderRadius: '8px',
          padding: '16px',
          background: 'var(--islands-bg-secondary)'
        });

        form.div(title => {
          title.styles({ fontSize: '14px', fontWeight: '600', marginBottom: '12px' });
          title.text('📅 会议预定');
        });

        form.div(field => {
          field.styles({ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' });
          field.span(label => {
            label.styles({ width: '80px', fontSize: '13px', color: 'var(--islands-text-secondary)' });
            label.text('会议日期：');
          });
          field.child(vTimer(t => {
            t.type('date');
            t.value('2026-03-15');
            t.id('meeting-date');
          }));
        });

        form.div(field => {
          field.styles({ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' });
          field.span(label => {
            label.styles({ width: '80px', fontSize: '13px', color: 'var(--islands-text-secondary)' });
            label.text('开始时间：');
          });
          field.child(vTimer(t => {
            t.type('time');
            t.value('14:00');
            t.id('meeting-start');
          }));
        });

        form.div(actions => {
          actions.styles({ display: 'flex', gap: '8px', marginTop: '16px' });
          actions.child(vButton('预定会议室')
            .type('primary')
            .onClick(() => {
              toast.success('会议室预定成功！');
            }));
          actions.child(vButton('取消').type('default'));
        });
      });
    });
  });
}

/**
 * 创建代码示例部分
 */
function createCodeExamples() {
  return DocSection('vtimer-usage', 'VTimer 使用方法', [
    CodeDemo('基础日期选择器',
      div(example => {
        example.child(vTimer(t => {
          t.type('date');
          t.value('2026-03-08');
          t.onChange(({ value }) => {
            console.log('选中日期:', value);
          });
        }));
      }),
      `// 日期选择器
vTimer(t => {
  t.type('date');  // 'date', 'month', 'week', 'time', 'datetime-local'
  t.value('2026-03-08');
  t.onChange(({ value }) => {
    console.log('选中日期:', value);
  });
});`
    ),

    CodeDemo('日期范围选择器',
      div(example => {
        example.child(vTimer2(t2 => {
          t2.type('date');
          t2.value({
            start: '2026-03-01',
            end: '2026-03-31'
          });
          t2.onChange(({ value }) => {
            console.log('选中范围:', value.start, '-', value.end);
          });
        }));
      }),
      `// 日期范围选择器
vTimer2(t2 => {
  t2.type('date');
  t2.value({
    start: '2026-03-01',
    end: '2026-03-31'
  });
  t2.onChange(({ value }) => {
    console.log('选中范围:', value.start, '-', value.end);
  });
});`
    ),

    CodeDemo('带限制的选择器',
      div(example => {
        example.child(vTimer(t => {
          t.type('date');
          t.min('2026-01-01');
          t.max('2026-12-31');
          t.value('2026-06-15');
        }));
      }),
      `// 设置最小/最大值
vTimer(t => {
  t.type('date');
  t.min('2026-01-01');    // 最小日期
  t.max('2026-12-31');    // 最大日期
  t.value('2026-06-15');
});

// 日期时间范围
vTimer(t => {
  t.type('datetime-local');
  t.min('2026-01-01T00:00');
  t.max('2026-12-31T23:59');
});`
    ),

    CodeDemo('状态控制',
      div(example => {
        example.styles({ display: 'flex', flexDirection: 'column', gap: '8px' });
        example.child(vTimer(t => {
          t.type('date');
          t.disabled(true);
          t.value('2026-01-01');
        }));
        example.child(vTimer(t => {
          t.type('date');
          t.readonly(true);
          t.value('2026-06-01');
        }));
        example.child(vTimer(t => {
          t.type('date');
          t.error(true);
          t.value('2026-02-30');
        }));
      }),
      `// 禁用状态
vTimer(t => {
  t.disabled(true);
});

// 只读状态
vTimer(t => {
  t.readonly(true);
});

// 错误状态
vTimer(t => {
  t.error(true);
});`
    ),
  ]);
}

/**
 * 创建 VTimer 页面
 */
export function createVTimerPage() {
  const tocItems = [
    { text: '基础选择器', href: '#basic', level: 1 },
    { text: '日期时间', href: '#datetime', level: 1 },
    { text: '范围选择器', href: '#range', level: 1 },
    { text: '验证状态', href: '#validation', level: 1 },
    { text: '应用场景', href: '#scenarios', level: 1 },
    { text: '代码示例', href: '#vtimer-usage', level: 1 },
  ];

  return AppShell({
    currentPage: 'vtimer.html',
    tocItems,
    content: (content) => {
      content.child(PageHeader({
        title: 'VTimer 日期选择器',
        description: '支持日期、时间、日期时间、月份、周等多种类型的选择器，以及范围选择功能',
      }));

      // 基础选择器
      content.div(section => {
        section.id('basic');
        section.styles({ marginBottom: '24px' });
        section.h2(h2 => {
          h2.styles({ fontSize: '18px', fontWeight: '600', marginBottom: '16px' });
          h2.text('📅 基础选择器');
        });
        section.child(responsiveGrid(grid => {
          grid.minSize('300px');
          grid.gap('16px');
          grid.child(createDatePickers());
          grid.child(createDateTimePickers());
        }));
      });

      // 范围选择器
      content.div(section => {
        section.id('range');
        section.styles({ marginBottom: '24px' });
        section.h2(h2 => {
          h2.styles({ fontSize: '18px', fontWeight: '600', marginBottom: '16px' });
          h2.text('📆 范围选择器');
        });
        section.child(createDateRangePickers());
      });

      // 验证和状态
      content.div(section => {
        section.id('validation');
        section.styles({ marginBottom: '24px' });
        section.h2(h2 => {
          h2.styles({ fontSize: '18px', fontWeight: '600', marginBottom: '16px' });
          h2.text('✅ 验证与状态');
        });
        section.child(createValidationPickers());
      });

      // 应用场景
      content.div(section => {
        section.id('scenarios');
        section.styles({ marginBottom: '24px' });
        section.h2(h2 => {
          h2.styles({ fontSize: '18px', fontWeight: '600', marginBottom: '16px' });
          h2.text('💼 应用场景');
        });
        section.child(createScenarios());
      });

      // 代码示例
      content.child(createCodeExamples());
    },
  });
}
