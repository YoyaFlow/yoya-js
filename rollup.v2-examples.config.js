/**
 * Rollup 配置文件 - 用于打包 V2 Examples
 *
 * 输出目录：dist/v2-examples/
 * 用途：GitHub Pages 部署演示
 *
 * 打包后的文件结构:
 * - dist/yoya.esm.min.js - 基础库
 * - dist/yoya.theme.min.css - 主题 CSS
 * - dist/v2-examples/*.html - 页面 (引用 ../yoya.esm.min.js 和 ../yoya.theme.min.css)
 * - dist/v2-examples/*.js - 页面脚本 (从 ../yoya.esm.min.js 导入)
 */

import { defineConfig } from 'rollup';
import json from '@rollup/plugin-json';
import { existsSync, mkdirSync, cpSync, readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { dirname, join } from 'path';

/**
 * CSS 文件忽略插件
 */
function ignoreCssPlugin() {
  return {
    name: 'ignore-css',
    transform(code, id) {
      if (id.endsWith('.css')) {
        return { code: '', map: null };
      }
      return null;
    }
  };
}

/**
 * JS 文件路径替换插件 - 将 yoya/index.js 导入替换为 yoya.esm.min.js
 */
function jsPathReplacePlugin() {
  return {
    name: 'js-path-replace',
    generateBundle(options, bundle) {
      for (const fileName in bundle) {
        if (fileName.endsWith('.js')) {
          const chunk = bundle[fileName];
          if (chunk.code) {
            // 替换所有 yoya/index.js 导入为 ../yoya.esm.min.js
            chunk.code = chunk.code.replace(
              /['"](\.\.\/)*(yoya\/index\.js|yoya\/components\/index\.js)['"]/g,
              "'../yoya.esm.min.js'"
            );
          }
        }
      }
    }
  };
}

/**
 * HTML 文件处理插件 - 复制 HTML 并修改引用路径
 */
function htmlPlugin(options) {
  const { inputDir, outputDir } = options;

  return {
    name: 'html-plugin',
    buildStart() {
      // 清理输出目录
      if (existsSync(outputDir)) {
        try {
          cpSync(outputDir, outputDir + '.bak', { recursive: true });
        } catch (e) {}
      }
      mkdirSync(outputDir, { recursive: true });
    },
    writeBundle() {
      processDirectory(inputDir, outputDir, '../');
    }
  };
}

function processDirectory(inputDir, outputDir, distPrefix) {
  const items = readdirSync(inputDir);

  for (const entry of items) {
    const inputPath = join(inputDir, entry);
    const outputPath = join(outputDir, entry);
    const stat = statSync(inputPath);

    if (stat.isDirectory()) {
      // 跳过 node_modules, i18n 等目录
      if (entry === 'node_modules' || entry === 'i18n') continue;

      // 递归处理子目录
      mkdirSync(outputPath, { recursive: true });
      processDirectory(inputPath, outputPath, distPrefix + '../');
    } else if (entry.endsWith('.html')) {
      processHtmlFile(inputPath, outputPath, distPrefix);
    } else if (entry.endsWith('.js') && !entry.includes('.test.') && !entry.endsWith('.json')) {
      // 复制 JS 文件并替换导入路径
      processJsFile(inputPath, outputPath, distPrefix);
    }
  }
}

function processJsFile(inputPath, outputPath, distPrefix) {
  let content = readFileSync(inputPath, 'utf-8');

  // 计算到 yoya.esm.min.js 的路径
  const yoyaPath = distPrefix + 'yoya.esm.min.js';

  // 替换所有 yoya/index.js 导入
  content = content.replace(
    /from\s+['"](\.\.\/)*(yoya\/index\.js|yoya\/components\/index\.js)['"]/g,
    `from '${yoyaPath}'`
  );

  // 替换动态 import
  content = content.replace(
    /import\(['"](\.\.\/)*(yoya\/index\.js|yoya\/components\/index\.js)['"]\)/g,
    `import('${yoyaPath}')`
  );

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, content, 'utf-8');
  console.log(`[JS] ${inputPath} -> ${outputPath}`);
}

function processHtmlFile(inputPath, outputPath, distPrefix) {
  let content = readFileSync(inputPath, 'utf-8');

  // 替换 index.js 引用为对应的页面 JS 文件
  const htmlFileName = basename(inputPath);
  const jsFileName = htmlFileName.replace('.html', '.js');

  // 检查是否存在对应的 JS 入口文件
  const jsEntryPath = join(dirname(inputPath), jsFileName);
  if (jsFileName !== 'index.js' && existsSync(jsEntryPath)) {
    // 有独立 JS 文件的页面
    content = content.replace(
      /<script\s+type="module"\s+src="\.\/index\.js"\s*><\/script>/g,
      `<script type="module" src="${distPrefix}${jsFileName}"></script>`
    );
  } else {
    // 使用统一入口的页面
    content = content.replace(
      /<script\s+type="module"\s+src="\.\/index\.js"\s*><\/script>/g,
      `<script type="module" src="${distPrefix}index.js"></script>`
    );
  }

  // 替换 common.css 引用为 dist 目录下的路径
  // 源文件中使用 ./styles/common.css 或 ../../styles/common.css
  // 在 dist 中统一使用 ../styles/common.css
  content = content.replace(
    /href="(\.\/)*styles\/common\.css"/g,
    `href="${distPrefix}styles/common.css"`
  );
  content = content.replace(
    /href="(\.\.\/)+styles\/common\.css"/g,
    `href="${distPrefix}styles/common.css"`
  );

  // 替换多个 CSS 引用为单一的 yoya.theme.min.css
  const cssBlockPattern = /<!-- 统一主题 CSS -->[\s\S]*?<link\s+rel="stylesheet"\s+href="[^"]*base\.css"[^>]*>(?:\s*<link\s+rel="stylesheet"\s+href="[^"]*\.css"[^>]*>)*/;

  content = content.replace(
    cssBlockPattern,
    `<!-- 统一主题 CSS -->\n  <link rel="stylesheet" href="${distPrefix}yoya.theme.min.css">`
  );

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, content, 'utf-8');
  console.log(`[HTML] ${inputPath} -> ${outputPath}`);
}

function basename(path) {
  return path.split('/').pop();
}

/**
 * 资源复制插件 - 只复制不需要 JS 处理的目录
 */
function copyAssetsPlugin() {
  return {
    name: 'copy-assets',
    // 在 htmlPlugin 之前运行，这样 htmlPlugin 处理的 JS 文件不会被覆盖
    enforce: 'pre',
    writeBundle() {
      // 复制配置目录（不包含 JS 入口文件的目录）
      const dirsToCopy = [
        { src: 'src/v2/examples/config', dest: 'dist/v2-examples/config' },
        { src: 'src/v2/examples/styles', dest: 'dist/v2-examples/styles' },
      ];

      for (const { src, dest } of dirsToCopy) {
        if (existsSync(src)) {
          mkdirSync(dirname(dest), { recursive: true });
          cpSync(src, dest, { recursive: true, force: true });
          console.log(`[ASSETS] Copied ${src} -> ${dest}`);
        }
      }

      // 单独复制 i18n 目录（作为资源，不进行 JS 处理）
      const i18nSrc = 'src/v2/examples/i18n';
      const i18nDest = 'dist/v2-examples/i18n';
      if (existsSync(i18nSrc)) {
        mkdirSync(i18nDest, { recursive: true });
        cpSync(i18nSrc, i18nDest, { recursive: true, force: true });
        console.log(`[ASSETS] Copied ${i18nSrc} -> ${i18nDest}`);
      }

      // 复制 CSS 文件到 dist/
      const cssFiles = [
        { src: 'dist/yoya.theme.min.css', dest: 'dist/v2-examples/yoya.theme.min.css' },
        { src: 'dist/yoya.theme.css', dest: 'dist/v2-examples/yoya.theme.css' },
      ];

      for (const { src, dest } of cssFiles) {
        if (existsSync(src)) {
          cpSync(src, dest, { force: true });
          console.log(`[CSS] Copied ${src} -> ${dest}`);
        }
      }
    }
  };
}

export default defineConfig([
  {
    // 打包 V2 Examples - 主应用
    input: {
      'index': 'src/v2/examples/index.js',
      'components-demo': 'src/v2/examples/components-demo.js',
    },
    output: {
      dir: 'dist/v2-examples',
      format: 'esm',
      sourcemap: true,
      entryFileNames: '[name].js',
      chunkFileNames: 'chunks/[name]-[hash].js',
    },
    plugins: [
      json(),
      ignoreCssPlugin(),
      jsPathReplacePlugin(),
      htmlPlugin({
        inputDir: 'src/v2/examples',
        outputDir: 'dist/v2-examples',
      }),
      copyAssetsPlugin(),
    ],
    external: [
      '../../../../yoya/index.js',
      '../../../yoya/index.js',
      '../../yoya/index.js',
      '../yoya/index.js',
    ],
    treeshake: true,
  },
]);
