import { FileSuffix } from './enum';

/**
 * 样式前缀
 * @default 'rb-files-crop'
 */
export const PREFIX = 'rb-files-crop';

/**
 * img标签加载失败提示
 * @default '文件解析失败, 请联系管理员!'
 */
export const IMG_ALT = '文件解析失败, 请联系管理员!';

/** 图片类型后缀集合 */
export const PictureSuffixList = [
  FileSuffix.JPG,
  FileSuffix.JPEG,
  FileSuffix.PNG,
  FileSuffix.GIF,
  FileSuffix.SVG,
  FileSuffix.BMP,
  FileSuffix.TIF,
  FileSuffix.TIFF,
];
