/**
 * Rollup 配置文件 - 用于打包 V2 Examples
 *
 * 输出目录：dist/v2-examples/
 * 用途：GitHub Pages 部署演示
 *
 * 打包后的 HTML 文件会引用 dist/ 目录下的库文件：
 * - ../yoya.esm.min.js
 * - ../yoya.theme.min.css
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
      // 复制 JS 文件（pages、components、framework 等目录中的）
      mkdirSync(dirname(outputPath), { recursive: true });
      cpSync(inputPath, outputPath, { force: true });
    }
  }
}

function processHtmlFile(inputPath, outputPath, distPrefix) {
  let content = readFileSync(inputPath, 'utf-8');

  // 替换 index.js 引用为压缩后的库文件
  content = content.replace(
    /<script\s+type="module"\s+src="\.\/index\.js"\s*><\/script>/g,
    `<script type="module" src="${distPrefix}yoya.esm.min.js"></script>`
  );

  // 替换多个 CSS 引用为单一的 yoya.theme.min.css
  // 匹配：从 <!-- 统一主题 CSS --> 到最后一个 link 标签
  const cssBlockPattern = /<!-- 统一主题 CSS -->[\s\S]*?<link\s+rel="stylesheet"\s+href="[^"]*base\.css"[^>]*>(?:\s*<link\s+rel="stylesheet"\s+href="[^"]*\.css"[^>]*>)*/;

  content = content.replace(
    cssBlockPattern,
    `<!-- 统一主题 CSS -->\n  <link rel="stylesheet" href="${distPrefix}yoya.theme.min.css">`
  );

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, content, 'utf-8');
  console.log(`[HTML] ${inputPath} -> ${outputPath}`);
}

/**
 * 资源复制插件
 */
function copyAssetsPlugin() {
  return {
    name: 'copy-assets',
    writeBundle() {
      // 复制配置和代码目录（排除 i18n）
      const dirsToCopy = [
        { src: 'src/v2/examples/config', dest: 'dist/v2-examples/config' },
        { src: 'src/v2/examples/pages', dest: 'dist/v2-examples/pages' },
        { src: 'src/v2/examples/framework', dest: 'dist/v2-examples/framework' },
        { src: 'src/v2/examples/components', dest: 'dist/v2-examples/components' },
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
