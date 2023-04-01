# rb-files-crop

文件上传编辑容器(上传前图片裁剪、文件重命名等)，目前仅用于 Ant Design [Upload](https://ant.design/components/upload-cn/) 组件

[![npm](https://img.shields.io/npm/v/rb-files-crop.svg?style=flat-square)](https://www.npmjs.com/package/rb-files-crop)
[![npm type definitions](https://img.shields.io/npm/types/typescript?style=flat-square)](https://github.com/Monsterlzx/rb-files-crop/blob/main/src/type.ts)


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

| 属性                    | 类型                                 | 默认          | 说明                                    |
| ----------------------- | ----------------------------------- | ------------ | -------------------------------------- |
| editModalTitle          | `string`                            | `编辑文件`    | 编辑弹窗标题                             |
| editModalWidth          | `number` \| `string`                | `55vm`       | 编辑弹窗宽度，`px` 的数值或百分比           |
| editModalClassName      | `string`                            | -            | 为 Modal 容器提供您自己的类名              |
| beforeEdit              | `function`                          | -            | 弹窗打开前调用                           |
| previewIcons            | [`PreviewIcons`](#PreviewIcons)     | -            | 编辑列表预览图标                          |
| onModalOK               | `function`                          | -            | 编辑弹窗确认操作                          |
| onModalCancel           | `function`                          | -            | 点击弹窗遮罩层、右上角叉、取消的关闭操作      |
| onUploadFail            | `function`                          | -            | 上传失败时的回调                          |

### PreviewIcons

| 属性          | 类型       | 默认 | 说明                      |
| ------------ | ----------| -----| ------------------------  |
| picture      | `string`  | -    | 编辑列表图片图标            |
| word         | `string`  | -    | 编辑列表word图标           |
| excel        | `string`  | -    | 编辑列表excel图标          |
| txt          | `string`  | -    | 编辑列表txt图标            |
| pdf          | `string`  | -    | 编辑列表pdf图标            |
| ppt          | `string`  | -    | 编辑列表ppt图标            |
| rar          | `string`  | -    | 编辑列表rar图标            |
| zip          | `string`  | -    | 编辑列表zip图标            |
| others       | `string`  | -    | 编辑列表除上述外其它文件图标  |