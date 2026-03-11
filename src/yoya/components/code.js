/**
 * Yoya.Components - Code
 * 代码展示组件，支持语法高亮和一键复制功能
 * @module Yoya.Code
 * @example
 * // 基础用法
 * import { vCode, toast } from '../yoya/index.js';
 *
 * vCode(c => {
 *   c.content(`const hello = (name) => {
 *   console.log('Hello, ' + name);
 * };`);
 *   c.title('JavaScript 示例');
 *   c.onCopy(() => toast.success('代码已复制'));
 * });
 *
 * // 快速创建代码块
 * import { codeBlock } from '../yoya/index.js';
 * codeBlock('示例代码', 'const x = 1;');
 */

import { Tag, pre, code, div, span } from '../core/basic.js';

// ============================================
// VCode 代码展示组件
// ============================================

/**
 * VCode 代码展示组件
 * 支持语法高亮、行号显示、一键复制功能
 * @class
 * @extends Tag
 */
class VCode extends Tag {
  static _stateAttrs = ['copied'];

  /**
   * 创建 VCode 实例
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', null);

    this._codeContent = '';
    this._language = 'javascript';
    this._showLineNumbers = true;
    this._showCopyButton = true;
    this._title = '';
    this._onCopy = null;

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({
      copied: false,
    });

    // 3. 设置基础样式
    this._setupBaseStyles();

    // 4. 保存基础样式快照
    this.saveBaseStylesSnapshot();

    // 5. 注册状态处理器
    this._registerStateHandlers();

    // 6. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }

    // 7. 创建内部元素
    this._createInternalElements();
  }

  /**
   * 设置基础样式
   * @private
   */
  _setupBaseStyles() {
    this.styles({
      display: 'block',
      borderRadius: 'var(--islands-code-radius, 8px)',
      overflow: 'hidden',
      background: 'var(--islands-code-bg, #1e1e1e)',
      border: 'var(--islands-code-border, 1px solid rgba(255,255,255,0.1))',
    });
  }

  /**
   * 注册状态处理器
   * @private
   */
  _registerStateHandlers() {
    this.registerStateHandler('copied', (copied, host) => {
      if (host._copyButton) {
        if (copied) {
          host._copyButton.textContent('✓ 已复制');
          host._copyButton.styles({
            background: 'var(--islands-code-copy-success-bg, #28a745)',
            color: 'var(--islands-code-copy-success-color, white)',
          });
          // 2 秒后恢复
          setTimeout(() => {
            host.setState('copied', false);
          }, 2000);
        } else {
          host._copyButton.textContent('📋 复制');
          host._copyButton.styles({
            background: 'var(--islands-code-copy-bg, #444)',
            color: 'var(--islands-code-copy-color, #ccc)',
          });
        }
      }
    });
  }

  _createInternalElements() {
    // 标题栏
    if (this._title || this._showCopyButton) {
      this._headerBar = div(h => {
        h.styles({
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 'var(--islands-code-header-padding, 10px 16px)',
          background: 'var(--islands-code-header-bg, rgba(255,255,255,0.05))',
          borderBottom: 'var(--islands-code-header-border, 1px solid rgba(255,255,255,0.1))',
        });

        // 标题
        if (this._title) {
          h.child(span(t => {
            t.styles({
              color: 'var(--islands-code-title-color, #007acc)',
              fontSize: 'var(--islands-code-title-font-size, 13px)',
              fontWeight: 'var(--islands-code-title-font-weight, 600)',
            });
            t.text(this._title);
          }));
        } else {
          h.child(span(s => s.styles({ flex: 1 })));
        }

        // 复制按钮
        if (this._showCopyButton) {
          h.child(this._copyButton = span(b => {
            b.styles({
              padding: 'var(--islands-code-copy-padding, 4px 10px)',
              borderRadius: 'var(--islands-code-copy-radius, 4px)',
              fontSize: 'var(--islands-code-copy-font-size, 12px)',
              cursor: 'pointer',
              background: 'var(--islands-code-copy-bg, #444)',
              color: 'var(--islands-code-copy-color, #ccc)',
              transition: 'all 0.2s',
              userSelect: 'none',
            });
            b.text('📋 复制');
            b.on('click', () => this._handleCopy());
            b.on('mouseenter', () => {
              if (!this.hasState('copied')) {
                b.styles({
                  background: 'var(--islands-code-copy-hover-bg, #555)',
                  color: 'var(--islands-code-copy-hover-color, white)',
                });
              }
            });
            b.on('mouseleave', () => {
              if (!this.hasState('copied')) {
                b.styles({
                  background: 'var(--islands-code-copy-bg, #444)',
                  color: 'var(--islands-code-copy-color, #ccc)',
                });
              }
            });
          }));
        }
      });

      this.child(this._headerBar);
    }

    // 代码容器
    this._codeContainer = pre(c => {
      c.styles({
        margin: 0,
        padding: 'var(--islands-code-padding, 16px)',
        overflow: 'auto',
        fontSize: 'var(--islands-code-font-size, 13px)',
        lineHeight: 'var(--islands-code-line-height, 1.6)',
        color: 'var(--islands-code-text-color, #d4d4d4)',
        fontFamily: 'var(--islands-code-font-family, "Fira Code", "Consolas", "Monaco", monospace)',
      });

      c.child(this._codeElement = code(inner => {
        inner.styles({
          color: 'var(--islands-code-text-color, #d4d4d4)',
          fontFamily: 'inherit',
        });
        if (this._showLineNumbers) {
          inner.styles({ counterReset: 'line' });
        }
      }));
    });

    this.child(this._codeContainer);

    // 直接设置代码内容的 innerHTML
    this._updateCodeContent();
  }

  /**
   * 更新代码内容
   * @private
   */
  _updateCodeContent() {
    if (this._codeElement && this._codeContent) {
      const highlighted = this._highlightCode(this._codeContent);
      this._codeElement._htmlContent = highlighted;
      // 如果已经渲染，更新 DOM
      if (this._codeElement._el) {
        this._codeElement._el.innerHTML = highlighted;
      }
    }
  }

  /**
   * 语法高亮处理
   * @param {string} content - 代码内容
   * @returns {string} 高亮后的 HTML
   * @private
   */
  _highlightCode(content) {
    // 1. 先提取字符串，使用占位符保护
    const strings = [];
    let idx = 0;
    let code = content.replace(/(['"`])(?:[^\\]|\\.)*?\1/g, (match) => {
      strings.push(match);
      return `___STR${idx++}___`;
    });

    // 2. 先不转义，直接进行语法高亮
    // 使用特殊标记包裹关键字，避免后续转义影响
    const markers = [];
    let markerIdx = 0;

    // 2a. 注释高亮
    code = code.replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g, (match) => {
      markers.push({ type: 'comment', content: match });
      return `___MRK${markerIdx++}___`;
    });

    // 2b. 关键字高亮
    const keywords = ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
                      'do', 'switch', 'case', 'break', 'continue', 'new', 'class', 'extends',
                      'import', 'export', 'from', 'default', 'try', 'catch', 'finally', 'throw',
                      'async', 'await', 'yield', 'typeof', 'instanceof', 'in', 'of',
                      'true', 'false', 'null', 'undefined', 'this', 'super'];

    keywords.forEach(kw => {
      code = code.replace(new RegExp(`\\b${kw}\\b`, 'g'), (match) => {
        markers.push({ type: 'keyword', content: kw });
        return `___MRK${markerIdx++}___`;
      });
    });

    // 2c. 函数名高亮 - 排除已经是占位符的内容
    code = code.replace(/(\w+)(?=\s*\()/g, (match) => {
      // 跳过占位符
      if (match.startsWith('___MRK') || match.startsWith('___STR')) {
        return match;
      }
      markers.push({ type: 'function', content: match });
      return `___MRK${markerIdx++}___`;
    });

    // 3. HTML 转义
    code = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // 4. 恢复标记为 HTML 标签
    markers.forEach((marker, i) => {
      const escapedContent = marker.content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      code = code.replace(`___MRK${i}___`, `<span class="token-${marker.type}">${escapedContent}</span>`);
    });

    // 5. 恢复字符串
    strings.forEach((str, i) => {
      const escapedStr = str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      code = code.replace(`___STR${i}___`, `<span class="token-string">${escapedStr}</span>`);
    });

    return code;
  }

  /**
   * 处理复制操作
   * @private
   */
  _handleCopy() {
    // 复制代码到剪贴板
    if (navigator.clipboard) {
      navigator.clipboard.writeText(this._codeContent).then(() => {
        this.setState('copied', true);
        if (this._onCopy) {
          this._onCopy({ event: new ClipboardEvent('copy'), value: this._codeContent, target: this });
        }
      }).catch(() => {
        this._fallbackCopy();
      });
    } else {
      this._fallbackCopy();
    }
  }

  /**
   * 备用复制方法（当 navigator.clipboard 不可用时）
   * @private
   */
  _fallbackCopy() {
    // 备用复制方法
    const textarea = document.createElement('textarea');
    textarea.value = this._codeContent;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      this.setState('copied', true);
      if (this._onCopy) {
        this._onCopy({ event: new ClipboardEvent('copy'), value: this._codeContent, target: this });
      }
    } catch (err) {
      console.error('复制失败:', err);
    }
    document.body.removeChild(textarea);
  }

  // ============================================
  // 链式方法
  // ============================================

  content(c) {
    if (c === undefined) return this._codeContent;
    this._codeContent = c;
    this._updateCodeContent();
    return this;
  }

  language(lang) {
    if (lang === undefined) return this._language;
    this._language = lang;
    return this;
  }

  showLineNumbers(show) {
    if (show === undefined) return this._showLineNumbers;
    this._showLineNumbers = show;
    return this;
  }

  showCopyButton(show) {
    if (show === undefined) return this._showCopyButton;
    this._showCopyButton = show;
    return this;
  }

  title(t) {
    if (t === undefined) return this._title;
    this._title = t;
    return this;
  }

  onCopy(handler) {
    this._onCopy = handler;
    return this;
  }
}

function vCode(setup = null) {
  return new VCode(setup);
}

// ============================================
// CodeBlock 简化代码块（快速创建带标题的代码块）
// ============================================

class CodeBlock extends Tag {
  constructor(title = '', content = '', setup = null) {
    if (typeof title === 'function') {
      setup = title;
      title = '';
    } else if (typeof content === 'function') {
      setup = content;
      content = '';
    }

    super('div', null);

    this._title = title;
    this._content = content;

    // 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }

    // 创建内容
    this._createInternalElements();
  }

  _createInternalElements() {
    this.child(vCode(c => {
      c.title(this._title);
      c.content(this._content);
    }));
  }
}

function codeBlock(title = '', content = '', setup = null) {
  return new CodeBlock(title, content, setup);
}

// ============================================
// 导出
// ============================================

export { VCode, vCode, CodeBlock, codeBlock };

// 添加到 Tag 原型
Tag.prototype.vCode = function(setup = null) {
  const code = vCode(setup);
  this.child(code);
  return this;
};

Tag.prototype.codeBlock = function(title = '', content = '', setup = null) {
  const block = codeBlock(title, content, setup);
  this.child(block);
  return this;
};
