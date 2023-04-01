import { createContext, useCallback, useMemo, useRef, useState } from 'react';
import type { UploadProps } from 'antd';
import AntUpload from 'antd/lib/upload';
import type { RcFile } from 'antd/lib/upload/interface';
import _ from 'lodash';
import type { OnModalOk, RbFile, WapperProps, WapperStoreProps } from './type';
import { rcFileToRbFile } from './util';

const RbFilesCropStore = createContext<WapperStoreProps>({
  editModalTitle: '',
  editModalClassName: '',
  editModalProps: {},
  beforeEdit: () => false,
  cb: { current: undefined },
  beforeUploadRef: { current: undefined },
  resolveMapRef: { current: undefined },
  rejectMapRef: { current: undefined },
  handleBeforeOpenEditModal: () => {},
  currentEditFileUid: '',
  setCurrentEditFileUid: () => {},
  editFileList: [],
  setEditFileList: () => {},
  handleEditModalCancel: () => {},
  handleBeforeUpload: () => {},
});
export default RbFilesCropStore;

export const RbFilesCropStoreProvider = (props: WapperProps) => {
  const {
    children,
    editModalTitle = '编辑文件',
    editModalWidth,
    editModalClassName,
    beforeEdit,
    onModalCancel,
    onModalOk,
    onUploadFail,
    previewIcons,
  } = props;

  // upload-cb
  const cb = useRef<
    Pick<
      WapperProps,
      'beforeEdit' | 'onModalCancel' | 'onModalOk' | 'onUploadFail'
    >
  >({});
  cb.current.beforeEdit = beforeEdit;
  cb.current.onModalCancel = onModalCancel;
  cb.current.onModalOk = onModalOk;
  cb.current.onUploadFail = onUploadFail;

  // uploading-ref
  const beforeUploadRef = useRef<UploadProps['beforeUpload']>();
  const resolveMapRef = useRef<Record<string, OnModalOk>>({});
  const rejectMapRef = useRef<Record<string, (err: Error) => void>>({});
  // uploading-state
  const [currentEditFileUid, setCurrentEditFileUid] = useState<string>('');
  const [editFileList, setEditFileList] = useState<RbFile[]>([]);

  // editModal-props
  const editModalProps = useMemo(() => {
    const obj = { width: editModalWidth };
    Object.keys(obj).forEach((prop) => {
      const key = prop as keyof typeof obj;
      if (obj[key] === undefined) {
        delete obj[key];
      }
    });
    return obj;
  }, [editModalWidth]);

  /** 打开编辑弹窗前处理 */
  const handleBeforeOpenEditModal = useCallback(
    _.debounce((fileList: RcFile[]) => {
      Promise.all(
        fileList.map((_file) => rcFileToRbFile(_file, previewIcons))
      ).then((base64FileList) => {
        setCurrentEditFileUid(base64FileList[0].uid);
        setEditFileList(base64FileList);
      });
    }),
    [previewIcons]
  );

  /** 关闭编辑弹窗后, 清空编辑图片缓存数据 */
  const handleClearState = useCallback(() => {
    setCurrentEditFileUid('');
    setEditFileList([]);
  }, []);

  /** 关闭编辑弹窗执行操作 */
  const handleEditModalCancel = useCallback(() => {
    cb.current.onModalCancel?.();
    handleClearState();
  }, [handleClearState]);

  /** 上传操作 */
  const handleBeforeUpload = useCallback(async () => {
    // 上传前关闭弹窗
    handleEditModalCancel();

    if (!beforeUploadRef.current) {
      editFileList.forEach((file) => {
        const newFile = file.rcFile;
        resolveMapRef.current[file.uid](newFile);
      });
    } else {
      const fileList = editFileList.map((file) => file.rcFile);
      editFileList.forEach(async (file) => {
        const newFile = file.rcFile;
        const result = await (beforeUploadRef as any).current(
          newFile,
          fileList
        );

        if (result === true) {
          return resolveMapRef.current[file.uid](newFile);
        }

        if (result === false) {
          return rejectMapRef.current[file.uid](
            new Error('beforeUpload return false')
          );
        }

        delete newFile[AntUpload.LIST_IGNORE as keyof typeof newFile];

        if (typeof result === 'string' && /^(__LIST_IGNORE_)/.test(result)) {
          Object.defineProperty(newFile, result, {
            value: true,
            configurable: true,
          });
          return rejectMapRef.current[file.uid](
            new Error('beforeUpload return LIST_IGNORE')
          );
        }

        if (typeof result === 'object' && result !== null) {
          return resolveMapRef.current[file.uid](result);
        }
      });
    }
  }, [editFileList, handleEditModalCancel]);

  const value = {
    editModalTitle,
    editModalClassName,
    editModalProps,
    beforeEdit,
    cb,
    beforeUploadRef,
    resolveMapRef,
    rejectMapRef,
    handleBeforeOpenEditModal,
    currentEditFileUid,
    setCurrentEditFileUid,
    editFileList,
    setEditFileList,
    handleEditModalCancel,
    handleBeforeUpload,
  };

  return (
    <RbFilesCropStore.Provider value={value}>
      {children}
    </RbFilesCropStore.Provider>
  );
};
