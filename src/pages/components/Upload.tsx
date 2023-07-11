/** @jsxImportSource @emotion/react */
import { Upload as AntUpload } from "antd";
import { RcFile } from "antd/lib/upload";
import React, { useCallback } from "react";

interface UploadProps {
  children?: React.ReactNode;
  onChange?: (file: File) => void;
  accept?: string;
  className?: string;
}

export default React.memo(function Upload(props: UploadProps) {
  const { children, accept, className, onChange } = props;
  const beforUpload = useCallback(
    (file: RcFile) => {
      onChange?.(file);
      return false;
    },
    [onChange]
  );

  const emptyCallback = useCallback(() => {
    // hop
  }, []);

  return (
    <AntUpload
      accept={accept}
      beforeUpload={beforUpload}
      customRequest={emptyCallback}
      showUploadList={false}
      className={className}
    >
      {children}
    </AntUpload>
  );
});
