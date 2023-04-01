# rb-files-crop

文件上传编辑工具(图片裁剪、文件重命名等)，目前仅用于 Ant Design [Upload](https://ant.design/components/upload-cn/) 组件

[![npm](https://img.shields.io/npm/v/rb-files-crop.svg?style=flat-square)](https://www.npmjs.com/package/rb-files-crop)
[![npm type definitions](https://img.shields.io/npm/types/typescript?style=flat-square)](https://github.com/nanxiaobei/antd-img-crop/blob/main/src/types.ts)


## 安装

```sh
npm i rb-files-crop
```

## 使用

```jsx
import { Upload } from 'antd';
import FilesCrop from 'rb-files-crop';

const Demo = () => (
  <FilesCrop>
    <Upload>+ Add image</Upload>
  </FilesCrop>
);
```

## Props

| 属性                    | 类型                 | 默认         | 说明                                                   |
| ----------------------- | -------------------- | ------------ | ------------------------------------------------------ |
| aspect                  | `number`             | `1 / 1`      | 裁切区域宽高比，`width / height`                       |
| shape                   | `string`             | `'rect'`     | 裁切区域形状，`'rect'` 或 `'round'`                    |
| grid                    | `boolean`            | `false`      | 显示裁切区域网格（九宫格）                             |
| quality                 | `number`             | `0.4`        | 图片质量，`0 ~ 1`                                      |
| fillColor               | `string`             | `'white'`    | 裁切图像小于画布时的填充颜色                           |
| zoom                    | `boolean`            | `true`       | 启用图片缩放                                           |
| rotate                  | `boolean`            | `false`      | 启用图片旋转                                           |
| minZoom                 | `number`             | `1`          | 最小缩放倍数                                           |
| maxZoom                 | `number`             | `3`          | 最大缩放倍数                                           |
| modalTitle              | `string`             | `'编辑图片'` | 弹窗标题                                               |
| modalWidth              | `number` \| `string` | `520`        | 弹窗宽度，`px` 的数值或百分比                          |
| modalOk                 | `string`             | `'确定'`     | 弹窗确定按钮文字                                       |
| modalCancel             | `string`             | `'取消'`     | 弹窗取消按钮文字                                       |
| modalMaskTransitionName | `string`             | `'fade'`     | 弹窗遮罩过渡效果, 设为 `'none'` 可禁用默认过渡效果     |
| modalClassName          | `string`             | `''`         | 为 Modal 容器提供您自己的类名                          |
| modalTransitionName     | `string`             | `'fade'`     | 弹窗过渡效果, 设为 `'none'` 可禁用默认过渡效果         |
| onModalOK               | `function`           | -            | 点击弹窗确定回调                                       |
| onModalCancel           | `function`           | -            | 点击弹窗遮罩层、右上角叉、取消的回调                   |
| beforeCrop              | `function`           | -            | 弹窗打开前调用，若返回 `false`，弹框将不会打开         |
| onUploadFail            | `function`           | -            | 上传失败时的回调                                       |
| cropperProps            | `object`             | -            | [react-easy-crop] 的 props（\* [已有 props] 无法重写） |
