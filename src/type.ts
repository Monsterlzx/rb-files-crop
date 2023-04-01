import type { RcFile } from 'antd/lib/upload/interface';

/**
 * 编辑文件容器属性
 */
export type WapperProps = {
  /** 子元素(目前仅支持antd中的Upload组件) */
  children: JSX.Element;

  /**
   * 编辑弹窗标题
   * @default '编辑文件'
   */
  editModalTitle?: string;
  /** 编辑弹窗宽度 */
  editModalWidth?: number | string;
  /** 编辑弹窗属性名 */
  editModalClassName?: string;
  /** 编辑列表预览图标 */
  previewIcons?: PreviewIcons;
  /** 打开编辑弹窗前操作 */
  beforeEdit?: (file: RcFile, fileList: RcFile[]) => boolean | Promise<boolean>;
  /** 编辑弹窗确认操作 */
  onModalOk?: (file: void | boolean | string | Blob | File) => void;
  /** 编辑弹窗关闭操作 */
  onModalCancel?: () => void;
  /** 上传失败回调 */
  onUploadFail?: (err: Error) => void;
};

/** 编辑弹窗确认 */
export type OnModalOk = NonNullable<WapperProps['onModalOk']>;

/** 内置自定义的文件对象属性 */
export type RbFile = {
  /** 唯一id */
  uid: string;

  /** 文件名(不含类型后缀) */
  name: string;
  /** 文件名(含类型后缀) */
  fullName: string;

  /** 文件大小 */
  size: number;
  /** 文件实际单位的大小 */
  fullSize: string;

  /** 文件类型 */
  type: string;
  /** 文件类型后缀 */
  suffix: string;

  /** 文件转化的base64数据字符串 */
  base64Data: string;
  /** 文件预览图标Url */
  previewIconUrl: string;

  /** 文件最后修改时间戳 */
  lastModified: number;
  /** 文件最后修改时间 */
  lastModifiedDate: Date;

  /** RcFile文件对象 */
  rcFile: RcFile;
};

/** context属性 */
export type WapperStoreProps = {
  /**
   * 编辑弹窗标题
   * @default '编辑文件'
   */
  editModalTitle?: string;
  /** 编辑弹窗属性名 */
  editModalClassName?: string;
  /** 编辑弹窗属性 */
  editModalProps: Record<string, any>;

  /** 打开编辑弹窗前操作 */
  beforeEdit?: (file: RcFile, fileList: RcFile[]) => boolean | Promise<boolean>;

  /** 缓存传入的方法ref：如 beforeEdit */
  cb: React.MutableRefObject<any>;
  /** 缓存antd的beforeUpload的ref */
  beforeUploadRef: React.MutableRefObject<any>;
  /** 缓存antd上传前文件resolve的ref */
  resolveMapRef: React.MutableRefObject<any>;
  /** 缓存antd上传前文件reject的ref */
  rejectMapRef: React.MutableRefObject<any>;

  /** 打开编辑弹窗前文件处理 */
  handleBeforeOpenEditModal: (fileList: RcFile[]) => void;
  /** 当前编辑文件的uid */
  currentEditFileUid: string;
  /** 设置当前编辑文件的uid */
  setCurrentEditFileUid: (uid: string) => void;
  /** 当前编辑文件列表 */
  editFileList: RbFile[];
  /** 设置当前编辑文件列表 */
  setEditFileList: (fileList: RbFile[]) => void;
  /** 关闭编辑弹窗处理 */
  handleEditModalCancel: () => void;
  /** 上传前处理 */
  handleBeforeUpload: () => void;
};

/** 文件编辑弹窗属性 */
export type EditModalProps = {
  /** 弹窗标题 */
  titleOfModal: string;
};

/** 编辑列表文件非图片图标 */
export type PreviewIcons = {
  picture?: string;
  word?: string;
  excel?: string;
  txt?: string;
  pdf?: string;
  ppt?: string;
  rar?: string;
  zip?: string;
  others?: string;
};
