import { FC, useCallback, useContext, useState } from 'react';
import Cropper from 'react-cropper';
import { version } from 'antd';
import AntdInput from 'antd/lib/input';
import AntdModal from 'antd/lib/modal';
import AntdSlider from 'antd/lib/slider';
import AntdTooltip from 'antd/lib/tooltip';
import type { RcFile } from 'antd/lib/upload/interface';
import { RedoOutlined, UndoOutlined } from '@ant-design/icons/lib/icons';
import { compareVersions } from 'compare-versions';
import 'cropperjs/dist/cropper.css';
import cannotPreview from './assets/cannotPreview.svg';
import { IMG_ALT, PictureSuffixList, PREFIX } from './constant';
import { FileSuffix } from './enum';
import './index.less';
import EditWapperStore from './store';
import type { EditModalProps, RbFile } from './type';
import {
  blobToBase64String,
  bytesToSize,
  getPreviewIconUrl,
  imgSvgSrcRender,
} from './util';

const modalVisibleProp =
  compareVersions(version, '4.23.0') === -1
    ? { visible: true }
    : { open: true };

const EditModal: FC<EditModalProps> = ({ titleOfModal }) => {
  const {
    editModalClassName,
    handleEditModalCancel,
    handleBeforeUpload,
    editModalProps,
    currentEditFileUid,
    editFileList,
    setEditFileList,
    setCurrentEditFileUid,
  } = useContext(EditWapperStore);

  const [cropper, setCropper] = useState<any>();
  const [rotate, setRotate] = useState<number>(0);

  /** 图片旋转展示 */
  const handleToRotate = useCallback(
    (type: 'right' | 'slider' | 'left', value?: number) => {
      let _rotate = 0;
      switch (type) {
        case 'right':
          _rotate = rotate + 10 > 180 ? 180 : rotate + 10;
          break;
        case 'slider':
          _rotate = value || 0;
          break;
        case 'left':
          _rotate = rotate - 10 < -180 ? -180 : rotate - 10;
          break;
        default:
          break;
      }

      setRotate(_rotate);
      if (cropper) {
        cropper.rotateTo(_rotate);
      }
    },
    [rotate, cropper]
  );

  /** 保存当前裁剪完的图片数据 */
  const handleSaveCurrentEditFile = useCallback(async () => {
    if (cropper) {
      await cropper
        .getCroppedCanvas({
          imageSmoothingQuality: 'high', // 设置图像平滑的质量“低”（默认）、“中”或“高”之一
        })
        .toBlob(async (blob: Blob) => {
          // 最新文件大小
          const size = blob.size;
          const fullSize = bytesToSize(blob.size);
          const base64Data = await blobToBase64String(blob);
          // 修改时间
          const lastModifiedDate = new Date();
          const lastModified = lastModifiedDate.valueOf();

          // 更新文件列表数据
          const newEditFileList = editFileList.map((file: RbFile) => {
            if (file.uid === currentEditFileUid) {
              const previewIconUrl = getPreviewIconUrl(
                file.suffix as FileSuffix,
                {
                  picture: base64Data,
                }
              );

              const newRcFile = Object.assign(
                new File([blob as BlobPart], file.fullName, {
                  type: file.type,
                }),
                {
                  uid: file.uid,
                }
              ) as RcFile;

              return {
                ...file,
                size,
                fullSize,
                base64Data,
                previewIconUrl,
                lastModifiedDate,
                lastModified,
                rcFile: newRcFile,
              };
            }

            return { ...file };
          });
          setEditFileList(newEditFileList);
        });
    }
  }, [cropper, editFileList, currentEditFileUid]);

  /** 修改文件名级联变更 */
  const handleChangeCurrentEditFileName = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // 获取当前选中文件
      const currentFile = editFileList.find(
        (file) => file.uid === currentEditFileUid
      );

      // 获取最新的文件名(不含类型后缀)
      const name = e.target.value;
      // 获取最新的文件名(含类型后缀)
      const fullName = e.target.value + (currentFile?.suffix || '');

      // 更新文件列表数据
      const newEditFileList = editFileList.map((file: RbFile) => {
        if (file.uid === currentEditFileUid) {
          // 修改时间
          const lastModifiedDate = new Date();
          const lastModified = lastModifiedDate.valueOf();

          const newRcFile = { ...file.rcFile, name: fullName } as RcFile;
          return {
            ...file,
            name,
            fullName,
            lastModifiedDate,
            lastModified,
            rcFile: newRcFile,
          };
        }

        return { ...file };
      });
      setEditFileList(newEditFileList);
    },
    [editFileList, currentEditFileUid]
  );

  /** 文件列表区域 */
  const renderFileList = useCallback(() => {
    return editFileList.map((file: RbFile, index: number) => {
      return (
        <div
          key={file.uid}
          className={`${PREFIX}-list-item-container`}
          onClick={() => setCurrentEditFileUid(file.uid)}
        >
          <div className={`${PREFIX}-list-item-index`}>{index + 1}</div>
          <div
            className={
              currentEditFileUid === file.uid
                ? `${PREFIX}-list-item-img-container ${PREFIX}-list-item-img-container-active`
                : `${PREFIX}-list-item-img-container`
            }
          >
            <img
              className={`${PREFIX}-list-item-img`}
              alt={IMG_ALT}
              src={file.previewIconUrl}
            />
            <div className={`${PREFIX}-list-item-img-name`}>
              <AntdTooltip title={file.fullName}>{file.fullName}</AntdTooltip>
            </div>
            <div className={`${PREFIX}-list-item-img-size`}>
              <AntdTooltip title={file.fullSize}>{file.fullSize}</AntdTooltip>
            </div>
          </div>
        </div>
      );
    });
  }, [editFileList, currentEditFileUid]);

  /** 编辑区域 */
  const renderEditArea = useCallback(() => {
    // 获取当前选中文件
    const currentFile = editFileList.find(
      (file) => file.uid === currentEditFileUid
    );
    // 判断是否图片
    const isPicture = PictureSuffixList.includes(
      currentFile?.suffix as FileSuffix
    );
    return isPicture ? (
      <Cropper
        className={`${PREFIX}-edit-crop`}
        zoomTo={0} // 默认缩放
        initialAspectRatio={1}
        dragMode="move" // 拖拽模式
        minCropBoxHeight={50} // 剪切框最小高度
        minCropBoxWidth={50} // 剪切框最小宽度
        rotatable // 启用旋转
        autoCropArea={1} // 默认裁剪框与画布比例
        checkOrientation={false} // 是否启用检查方向
        src={currentFile?.base64Data}
        center
        cropBoxResizable
        // 设置cropper对象
        onInitialized={(instance) => setCropper(instance)}
      />
    ) : (
      <div className={`${PREFIX}-not-edit-container`}>
        <img src={imgSvgSrcRender(cannotPreview)} alt={IMG_ALT} />
        <div>该文件类型暂不支持裁剪!</div>
      </div>
    );
  }, [editFileList, currentEditFileUid]);

  /** 操作区域 */
  const renderOperationArea = useCallback(() => {
    // 获取当前选中文件
    const currentFile = editFileList.find(
      (file) => file.uid === currentEditFileUid
    );
    // 判断是否图片
    const isPicture = PictureSuffixList.includes(
      currentFile?.suffix as FileSuffix
    );
    return (
      <>
        {isPicture && (
          <div className={`${PREFIX}-btn-slider`}>
            <RedoOutlined
              type="RedoOutlined"
              rotate={-90}
              onClick={() => handleToRotate('left')}
            />
            <AntdSlider
              min={-180}
              max={180}
              value={rotate}
              onChange={(value) => handleToRotate('slider', value)}
            />
            <UndoOutlined
              type="UndoOutlined"
              rotate={90}
              onClick={() => handleToRotate('right')}
            />
          </div>
        )}
        <div className={`${PREFIX}-btn-input`}>
          <AntdInput
            bordered={false}
            prefix="文件名:"
            suffix={currentFile?.suffix}
            value={currentFile?.name}
            size="small"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChangeCurrentEditFileName(e)
            }
          />
        </div>
        <button onClick={handleSaveCurrentEditFile}>保存</button>
      </>
    );
  }, [
    editFileList,
    currentEditFileUid,
    rotate,
    handleToRotate,
    handleChangeCurrentEditFileName,
    handleSaveCurrentEditFile,
  ]);

  return (
    <AntdModal
      {...modalVisibleProp}
      wrapClassName={`${PREFIX}-modal ${editModalClassName || ''}`}
      maskClosable={false}
      destroyOnClose
      title={titleOfModal}
      width="55vw"
      okText="上传"
      cancelText="取消"
      onOk={handleBeforeUpload}
      onCancel={handleEditModalCancel}
      {...editModalProps}
    >
      <div className={`${PREFIX}-modal-container`}>
        <div className={`${PREFIX}-list-container`}>{renderFileList()}</div>
        <div className={`${PREFIX}-edit-container`}>
          <div className={`${PREFIX}-edit`}>{renderEditArea()}</div>
          <div className={`${PREFIX}-edit-btn-container`}>
            {renderOperationArea()}
          </div>
        </div>
      </div>
    </AntdModal>
  );
};

export default EditModal;
