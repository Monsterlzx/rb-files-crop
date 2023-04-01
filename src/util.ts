import type { RcFile } from 'antd/lib/upload/interface';
import BigNumber from 'bignumber.js';
import excel from './assets/excel.svg';
import otherFiles from './assets/otherFiles.svg';
import pdf from './assets/pdf.svg';
import ppt from './assets/ppt.svg';
import rar from './assets/rar.svg';
import txt from './assets/txt.svg';
import word from './assets/word.svg';
import zip from './assets/zip.svg';
import { PictureSuffixList } from './constant';
import { FileSuffix } from './enum';
import type { PreviewIcons, RbFile } from './type';

/**
 * 文件大小转换(由B->B|KB|MB|GB)
 *  @param {number} size 文件字节大小(单位B)
 *  @param {string} 带单位的文件大小
 */
export const bytesToSize = (size = 0) => {
  let fullSize = '0B';

  if (size > 0) {
    if (size < 1024) {
      fullSize = `${size}B`;
    } else if (size >= 1024 && size < 1024 ** 2) {
      fullSize = new BigNumber(size).div(1024).dp(2) + 'KB';
    } else if (size >= 1024 ** 2 && size < 1024 ** 3) {
      fullSize = new BigNumber(size).div(1024 ** 2).dp(2) + 'MB';
    } else {
      fullSize = new BigNumber(size).div(1024 ** 3).dp(2) + 'GB';
    }
  }

  return fullSize;
};

/**
 * 将返回svg字符串转成img标签可使用的src
 * @param { string | undefined } svgStr
 * @return { undefined | string } base64Str
 */
export const imgSvgSrcRender = (svgStr?: string): undefined | string => {
  if (!svgStr) return;

  return `data:image/svg+xml;base64,${btoa(svgStr)}`;
  return svgStr;
};

/**
 * 根据文件后缀名获取预览图标
 *  @param {string} suffix 文件后缀名
 *  @param {PreviewIcons} previewIcons 文件预览图标
 *  @param {string} 实际预览iconUrl
 */
export const getPreviewIconUrl = (
  suffix: FileSuffix,
  previewIcons?: PreviewIcons
) => {
  // 图片类型则返回实际图片base64数据
  if (PictureSuffixList.includes(suffix))
    return previewIcons?.picture as string;

  switch (suffix) {
    case FileSuffix.DOC:
    case FileSuffix.DOCX:
      return previewIcons?.word || imgSvgSrcRender(word);
    case FileSuffix.XLS:
    case FileSuffix.XLSX:
      return previewIcons?.excel || imgSvgSrcRender(excel);
    case FileSuffix.TXT:
      return previewIcons?.txt || imgSvgSrcRender(txt);
    case FileSuffix.PDF:
      return previewIcons?.pdf || imgSvgSrcRender(pdf);
    case FileSuffix.PPT:
    case FileSuffix.PPTX:
      return previewIcons?.ppt || imgSvgSrcRender(ppt);
    case FileSuffix.RAR:
      return previewIcons?.rar || imgSvgSrcRender(rar);
    case FileSuffix.ZIP:
      return previewIcons?.zip || imgSvgSrcRender(zip);
    default:
      return previewIcons?.others || imgSvgSrcRender(otherFiles);
  }
};

/**
 * 文件对象(blob对象)转换base64数据字符串
 * @param {RcFile | Blob} blob blob对象
 * @returns { Promise<string> }
 */
export const blobToBase64String = (blob: Blob | RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

/**
 * RcFile文件对象转换成RbFile文件对象
 * @param {RcFile} file 文件对象
 * @returns { Promise<RbFile> }
 */
export const rcFileToRbFile = (
  file: RcFile,
  previewIcons?: PreviewIcons
): Promise<RbFile> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () =>
      resolve({
        uid: file.uid,
        fullName: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        lastModifiedDate: file.lastModifiedDate,
        name: file.name.slice(0, file.name.lastIndexOf('.')),
        suffix: file.name.slice(file.name.lastIndexOf('.')),
        base64Data: reader.result as string,
        fullSize: bytesToSize(file.size),
        previewIconUrl: getPreviewIconUrl(
          file.name.slice(file.name.lastIndexOf('.')) as FileSuffix,
          {
            picture: reader.result as string,
            ...previewIcons,
          }
        ),
        rcFile: file,
      });
    reader.onerror = (error) => reject(error);
  });
