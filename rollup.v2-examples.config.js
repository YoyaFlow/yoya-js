/**
 * Rollup 配置文件 - 用于打包 V2 Examples
 *
 * 输出目录：dist/v2-examples/
 * 用途：GitHub Pages 部署演示
 *
 * 打包后的文件结构:
 * - dist/yoya.esm.min.js - 基础库（压缩版）
 * - dist/yoya.echart.esm.min.js - ECharts 组件库（压缩版）
 * - dist/yoya.theme.css - 主题 CSS（非压缩版）
 * - dist/v2-examples/*.html - 页面 (引用 ../yoya.esm.min.js 和 ../yoya.theme.css)
 * - dist/v2-examples/*.js - 页面脚本 (从 ../yoya.esm.min.js 导入)
 *
 * 构建命令:
 * 1. npm run build - 构建基础库 (yoya.esm.min.js)
 * 2. npm run build:theme - 构建主题 CSS (yoya.theme.css)
 * 3. npm run build:echart - 构建 ECharts 组件 (yoya.echart.esm.min.js)
 * 4. npm run build:v2 - 打包 V2 Examples
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
            // 替换所有 yoya/yoya.echart.js 导入为 ../yoya.echart.esm.min.js
            chunk.code = chunk.code.replace(
              /['"](\.\.\/)*(yoya\/yoya\.echart\.js)['"]/g,
              "'../yoya.echart.esm.min.js'"
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
      // 跳过 node_modules, i18n 目录（这些由 copyAssetsPlugin 处理）
      if (entry === 'node_modules' || entry === 'i18n') continue;

      // 跳过 styles 目录（作为资源复制，不进行 JS 处理）
      if (entry === 'styles') {
        mkdirSync(outputPath, { recursive: true });
        cpSync(inputPath, outputPath, { recursive: true, force: true });
        console.log(`[STYLES] Copied ${inputPath} -> ${outputPath}`);
        continue;
      }

      // 递归处理子目录（包括 config, pages, framework, components）
      mkdirSync(outputPath, { recursive: true });
      processDirectory(inputPath, outputPath, distPrefix + '../');
    } else if (entry.endsWith('.html')) {
      // 所有 HTML 文件都使用 distPrefix 前缀（根目录和子目录都需要）
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
  const echartPath = distPrefix + 'yoya.echart.esm.min.js';

  // 替换所有 yoya/index.js 导入
  content = content.replace(
    /from\s+['"](\.\.\/)*(yoya\/index\.js|yoya\/components\/index\.js)['"]/g,
    `from '${yoyaPath}'`
  );

  // 替换所有 yoya/yoya.echart.js 导入
  content = content.replace(
    /from\s+['"](\.\.\/)*(yoya\/yoya\.echart\.js)['"]/g,
    `from '${echartPath}'`
  );

  // 替换动态 import - yoya
  content = content.replace(
    /import\(['"](\.\.\/)*(yoya\/index\.js|yoya\/components\/index\.js)['"]\)/g,
    `import('${yoyaPath}')`
  );

  // 替换动态 import - echart
  content = content.replace(
    /import\(['"](\.\.\/)*(yoya\/yoya\.echart\.js)['"]\)/g,
    `import('${echartPath}')`
  );

  // 替换裸模块 'echarts' 导入为 CDN URL（用于 home.js 等文件）
  content = content.replace(
    /from\s+['"]echarts['"]/g,
    `from 'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js'`
  );

  // 注意：动态 import 的 pages 路径不需要修改
  // 因为源文件中的 '../pages/xxx' 在 dist 中仍然是正确的相对路径

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, content, 'utf-8');
  console.log(`[JS] ${inputPath} -> ${outputPath}`);
}

function processHtmlFile(inputPath, outputPath, distPrefix) {
  let content = readFileSync(inputPath, 'utf-8');

  // 替换 JS 文件引用
  // 匹配 src="./xxx.js" 并替换为 src="${distPrefix}xxx.js"
  content = content.replace(
    /<script\s+type="module"\s+src="\.\/([^"']+)\.js"\s*><\/script>/g,
    (match, fileName) => {
      return `<script type="module" src="${distPrefix}${fileName}.js"></script>`;
    }
  );

  // 替换 common.css 引用为 dist 目录下的路径
  // 匹配 href="./styles/common.css" 或 href="../styles/common.css" 等
  content = content.replace(
    /href="(\.\/|\.\.\/)+styles\/common\.css"/g,
    `href="${distPrefix}styles/common.css"`
  );

  // 替换多个 CSS 引用为单一的 yoya.theme.css（非压缩版本）
  // 支持两种模式：
  // 1. <!-- 统一主题 CSS --> 注释后的多个 CSS 链接
  // 2. 直接的 ../../../yoya/theme/css/base.css 引用
  const cssBlockPattern = /<!-- 统一主题 CSS -->[\s\S]*?<link\s+rel="stylesheet"\s+href="[^"]*base\.css"[^>]*>(?:\s*<link\s+rel="stylesheet"\s+href="[^"]*\.css"[^>]*>)*/;
  const baseCssPattern = /<link\s+rel="stylesheet"\s+href="(\.\.\/)*(\.\.\/)*(\.\.\/)*yoya\/theme\/css\/base\.css"[^>]*>(?:\s*<link\s+rel="stylesheet"\s+href="[^"]*yoya\/theme\/css\/[^"]*"[^>]*>)*/;

  content = content.replace(
    cssBlockPattern,
    `<!-- 统一主题 CSS -->\n  <link rel="stylesheet" href="${distPrefix}yoya.theme.css">`
  );

  // 处理没有注释的纯 base.css 引用
  content = content.replace(
    baseCssPattern,
    `<link rel="stylesheet" href="${distPrefix}yoya.theme.css">`
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
    // 在 htmlPlugin 之后运行，这样 JS 文件可以先被处理
    enforce: 'post',
    writeBundle() {
      // 单独复制 i18n 目录（作为资源，不进行 JS 处理）
      const i18nSrc = 'src/v2/examples/i18n';
      const i18nDest = 'dist/v2-examples/i18n';
      if (existsSync(i18nSrc)) {
        mkdirSync(i18nDest, { recursive: true });
        cpSync(i18nSrc, i18nDest, { recursive: true, force: true });
        console.log(`[ASSETS] Copied ${i18nSrc} -> ${i18nDest}`);
      }

      // 复制 CSS 文件到 dist/（非压缩版本）
      const cssFiles = [
        { src: 'dist/yoya.theme.css', dest: 'dist/v2-examples/yoya.theme.css' },
      ];

      for (const { src, dest } of cssFiles) {
        if (existsSync(src)) {
          cpSync(src, dest, { force: true });
          console.log(`[CSS] Copied ${src} -> ${dest}`);
        }
      }

      // 复制基础库文件到 dist/
      const libFiles = [
        { src: 'dist/yoya.esm.min.js', dest: 'dist/v2-examples/yoya.esm.min.js' },
        { src: 'dist/yoya.esm.min.js.map', dest: 'dist/v2-examples/yoya.esm.min.js.map' },
        { src: 'dist/yoya.echart.esm.min.js', dest: 'dist/v2-examples/yoya.echart.esm.min.js' },
        { src: 'dist/yoya.echart.esm.min.js.map', dest: 'dist/v2-examples/yoya.echart.esm.min.js.map' },
      ];

      for (const { src, dest } of libFiles) {
        if (existsSync(src)) {
          cpSync(src, dest, { force: true });
          console.log(`[LIB] Copied ${src} -> ${dest}`);
        }
      }

      // 复制 theme/css 目录到 dist/v2-examples/css（用于 HTML 中的相对路径引用）
      const themeCssSrc = 'src/yoya/theme/css';
      const themeCssDest1 = 'dist/v2-examples/css';
      if (existsSync(themeCssSrc)) {
        mkdirSync(themeCssDest1, { recursive: true });
        cpSync(themeCssSrc, themeCssDest1, { recursive: true, force: true });
        console.log(`[THEME] Copied ${themeCssSrc} -> ${themeCssDest1}`);
      }

      // 复制 theme/css 目录到 dist/css（用于 yoya.esm.min.js 中 getThemeBasePath() 的动态加载）
      const themeCssDest2 = 'dist/css';
      if (existsSync(themeCssSrc)) {
        mkdirSync(themeCssDest2, { recursive: true });
        cpSync(themeCssSrc, themeCssDest2, { recursive: true, force: true });
        console.log(`[THEME] Copied ${themeCssSrc} -> ${themeCssDest2}`);
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
