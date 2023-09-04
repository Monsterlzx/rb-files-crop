import dts from 'rollup-plugin-dts';
import filesize from 'rollup-plugin-filesize';
import less from 'rollup-plugin-less';
import svg from 'rollup-plugin-svg';
import typescript from '@rollup/plugin-typescript';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json') as unknown as string);

// 入口文件
const input = 'src/index.tsx';
// 出口文件及以什么规范进行编译
const cjsOutput = { file: pkg.main, format: 'cjs', exports: 'auto' };
const esmOutput = { file: pkg.module, format: 'es' };
const dtsOutput = { file: pkg.types, format: 'es' };

// 插件
const tsPlugin = typescript();
const lessPlugin = less({ insert: true, output: false });
const dtsPlugin = dts();
const svgPlugin = svg();
const filesizePlugin = filesize();

// 我们在自己的库中需要使用第三方库，例如react，又不想在最终生成的打包文件中出现react，这个时候我们就需要使用external属性
const external = [
  ...Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies }),
  /^react($|\/)/,
  /^antd($|\/)/,
];

export default [
  {
    input,
    output: cjsOutput,
    plugins: [tsPlugin, lessPlugin, svgPlugin, filesizePlugin],
    external,
  },
  {
    input,
    output: esmOutput,
    plugins: [tsPlugin, lessPlugin, svgPlugin, filesizePlugin],
    external,
  },
  {
    input,
    output: dtsOutput,
    plugins: [dtsPlugin, svgPlugin],
    external: [/\.less$/],
  },
];
