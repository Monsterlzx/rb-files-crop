import { FC, useCallback, useContext, useMemo } from 'react';
import type { RcFile } from 'antd/lib/upload/interface';
import EditModal from './EditModal';
import RbFilesCropStore, { RbFilesCropStoreProvider } from './store';
import type { WapperProps } from './type';

const RbFilesCropPage: FC<{ children: JSX.Element }> = ({ children }) => {
  const {
    editModalTitle = '编辑文件',
    cb,
    beforeUploadRef,
    resolveMapRef,
    rejectMapRef,
    handleBeforeOpenEditModal,
    editFileList,
  } = useContext(RbFilesCropStore);

  /** antd的上传组件 */
  const uploadComponent = useMemo(() => {
    const upload = Array.isArray(children) ? children[0] : children;
    const { beforeUpload, ...restUploadProps } = upload.props;
    beforeUploadRef.current = beforeUpload;

    return {
      ...upload,
      props: {
        ...restUploadProps,
        beforeUpload: (file: RcFile, fileList: RcFile[]) => {
          return new Promise(async (resolve, reject) => {
            if (cb.current.beforeEdit) {
              const shouldCrop = await cb.current.beforeEdit(file, fileList);
              if (!shouldCrop) {
                return reject();
              }
            }

            resolveMapRef.current[file.uid] = (
              newFile: void | boolean | string | Blob | File
            ) => {
              cb.current.onModalOk?.(newFile);
              resolve(newFile);
            };
            rejectMapRef.current[file.uid] = (uploadErr: Error) => {
              cb.current.onUploadFail?.(uploadErr);
              reject();
            };

            handleBeforeOpenEditModal(fileList);
          });
        },
      },
    };
  }, [children, handleBeforeOpenEditModal]);

  const getComponent: (titleOfModal: string) => JSX.Element = useCallback(
    (titleOfModal: string) => (
      <>
        {uploadComponent}
        {!!editFileList.length && <EditModal titleOfModal={titleOfModal} />}
      </>
    ),
    [uploadComponent, editFileList]
  );

  return getComponent(editModalTitle);
};

const RbFilesCrop: FC<WapperProps> = ({ children, ...rest }) => {
  return (
    <RbFilesCropStoreProvider {...rest}>
      <RbFilesCropPage>{children}</RbFilesCropPage>
    </RbFilesCropStoreProvider>
  );
};

export default RbFilesCrop;
