/**
 * @fileoverview Rollup 配置 - SCADA 画布 standalone 构建
 * 生成 yoya.scada.js standalone 文件
 */

export default {
  input: 'src/yoya/scada/scada.js',
  output: {
    file: 'dist/yoya.scada.js',
    format: 'esm',
    name: 'YoyaScada',
    sourcemap: true,
    exports: 'named'
  }
};
