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

  // 根据文件所在目录动态计算 yoya 库的相对路径
  // 根目录文件使用 './yoya.esm.min.js'
  // 子目录文件使用 '../yoya.esm.min.js'
  const outputDir = dirname(outputPath);
  const relDepth = outputDir.replace('dist/v2-examples', '').split('/').filter(Boolean).length;
  const relPrefix = relDepth > 0 ? '../'.repeat(relDepth) : './';

  const yoyaPath = `${relPrefix}yoya.esm.min.js`;
  const echartPath = `${relPrefix}yoya.echart.esm.min.js`;

  // 替换所有 yoya/index.js 导入（支持相对路径和绝对路径）
  content = content.replace(
    /from\s+['"]((\.\.\/)*|(\/))((yoya\/index\.js)|(yoya\/components\/index\.js))['"]/g,
    `from '${yoyaPath}'`
  );

  // 替换所有 yoya/yoya.echart.js 导入（支持相对路径和绝对路径）
  content = content.replace(
    /from\s+['"]((\.\.\/)*|(\/))(yoya\/yoya\.echart\.js)['"]/g,
    `from '${echartPath}'`
  );

  // 替换动态 import - yoya（支持相对路径和绝对路径）
  content = content.replace(
    /import\(['"]((\.\.\/)*|(\/))((yoya\/index\.js)|(yoya\/components\/index\.js))['"]\)/g,
    `import('${yoyaPath}')`
  );

  // 替换动态 import - echart（支持相对路径和绝对路径）
  content = content.replace(
    /import\(['"]((\.\.\/)*|(\/))(yoya\/yoya\.echart\.js)['"]\)/g,
    `import('${echartPath}')`
  );

  // 注意：裸模块 'echarts' 不替换，由 HTML 中的 Import map 处理
  // Import map 会将 'echarts' 解析为 ./echarts.min.js

  // 替换 /v2/examples/ 绝对路径为相对路径
  // 例如：/v2/examples/config/routes.v2.js -> ./config/routes.v2.js (根目录) 或 ../config/routes.v2.js (子目录)
  content = content.replace(
    /from\s+['"]\/v2\/examples\//g,
    `from '${relPrefix}`
  );

  // 替换动态 import 中的 /v2/examples/ 绝对路径
  content = content.replace(
    /import\(['"]\/v2\/examples\//g,
    `import('${relPrefix}`
  );

  // 注意：动态 import 的 pages 路径不需要修改
  // 因为源文件中的 '../pages/xxx' 在 dist 中仍然是正确的相对路径

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, content, 'utf-8');
  console.log(`[JS] ${inputPath} -> ${outputPath}`);
}

function processHtmlFile(inputPath, outputPath, distPrefix) {
  let content = readFileSync(inputPath, 'utf-8');

  // 替换 JS 文件引用为相对路径（./xxx.js）
  content = content.replace(
    /<script\s+type="module"\s+src="(\.\/|\.\.\/)*([^"']+)\.js"\s*><\/script>/g,
    (match, prefix, fileName) => {
      return `<script type="module" src="./${fileName}.js"></script>`;
    }
  );

  // 替换 common.css 引用为相对路径
  content = content.replace(
    /href="(\.\/|\.\.\/)+styles\/common\.css"/g,
    `href="./styles/common.css"`
  );

  // 替换 yoya.theme.css 引用为相对路径
  const cssBlockPattern = /<!-- 统一主题 CSS -->[\s\S]*?<link\s+rel="stylesheet"\s+href="[^"]*base\.css"[^>]*>(?:\s*<link\s+rel="stylesheet"\s+href="[^"]*\.css"[^>]*>)*/;
  const baseCssPattern = /<link\s+rel="stylesheet"\s+href="(\.\.\/)*yoya\/theme\/css\/base\.css"[^>]*>(?:\s*<link\s+rel="stylesheet"\s+href="[^"]*yoya\/theme\/css\/[^"]*"[^>]*>)*/;
  const themeCssPattern = /href="(\.\/|\.\.\/)+yoya\.theme\.css"/;

  content = content.replace(
    cssBlockPattern,
    `<!-- 统一主题 CSS -->\n  <link rel="stylesheet" href="./yoya.theme.css">`
  );

  content = content.replace(
    baseCssPattern,
    `<link rel="stylesheet" href="./yoya.theme.css">`
  );

  content = content.replace(
    themeCssPattern,
    `href="./yoya.theme.css"`
  );

  // 替换 Import map 中的 echarts CDN 引用为本地路径
  content = content.replace(
    /"echarts":\s*"[^"]+"/g,
    `"echarts": "./echarts.min.js"`
  );

  // 在 Import map 后添加 echarts 脚本加载（UMD 格式，直接设置 window.echarts）
  content = content.replace(
    /<\/script>\n  <style>/g,
    `</script>
  <script src="./echarts.min.js"></script>
  <style>`
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

      // 复制 echarts 库文件到 dist/v2-examples/
      const echartSrc = 'dist/echarts.min.js';
      const echartDest = 'dist/v2-examples/echarts.min.js';
      if (existsSync(echartSrc)) {
        cpSync(echartSrc, echartDest, { force: true });
        console.log(`[ECHARTS] Copied ${echartSrc} -> ${echartDest}`);
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
