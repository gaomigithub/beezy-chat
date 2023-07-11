/** @jsxImportSource @emotion/react */
import SvgIcon from '@/pages/components/SvgIcon'
import { ReactComponent as IconDialogClose } from '@assets/img/dialog-close.svg'
import { css } from '@emotion/react'
import { Modal, Spin } from 'antd'
import { ModalFuncProps } from 'antd/lib/modal'
import React, { CSSProperties } from 'react'

export interface DialogDefaultFooterProps {
  okText?: string
  okDisabled?: boolean
  okProcessing?: boolean
  onOk?: () => void

  cancelText?: string
  onCancel?: () => void
}

export const DialogDefaultFooter = React.memo(function DialogDefaultFooter(
  props: DialogDefaultFooterProps
) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { okText, okDisabled, okProcessing, onOk, cancelText, onCancel } = props

  return (
    <div
      css={css`
        button {
          min-width: 90px;
        }
      `}
    ></div>
  )
})

export interface DialogProps extends DialogDefaultFooterProps {
  style?: React.CSSProperties
  className?: string
  wrapClassName?: string
  visible?: boolean
  loading?: boolean

  destroyOnClose?: boolean
  getContainer?: ModalFuncProps['getContainer']
  title?: string
  maskStyle?: CSSProperties

  closable?: boolean
  closeIcon?: React.ReactNode
  footer?: React.ReactNode
  children?: React.ReactNode
  maskClosable?: boolean
}

export const Dialog = React.memo(function Dialog(props: DialogProps) {
  const {
    style,
    className,
    wrapClassName,
    visible,
    loading,
    destroyOnClose,
    title,
    maskStyle,
    closable,

    // okText,
    // okDisabled,
    // okProcessing,
    // onOk,

    // cancelText,
    onCancel,

    children,
    getContainer,
    maskClosable,
  } = props
  let { footer, closeIcon } = props

  if (footer === undefined) {
    footer = undefined
    // footer = (
    //   <DialogDefaultFooter
    //     okText={okText}
    //     okDisabled={okDisabled || loading}
    //     okProcessing={okProcessing}
    //     cancelText={cancelText}
    //     onOk={onOk}
    //     onCancel={onCancel}
    //   />
    // );
  }

  if (closeIcon === undefined) {
    closeIcon = <SvgIcon SvgComponent={IconDialogClose} value={24} />
  }

  return (
    <Modal
      style={style}
      width={520}
      css={css`
        .ant-modal-header {
          display: flex;
          align-items: center;
          height: 20px;
          padding: 0;
          border-bottom: 0;
        }

        .ant-modal-title {
          font-size: 14px;
        }

        .ant-modal-close {
          display: flex;
          align-items: center;
          justify-content: center;

          line-height: 36px;
        }

        .ant-modal-body {
          padding: 30px 32px 20px;
        }

        .ant-modal-footer {
          display: none;
          padding: 20px 32px;
          border: none;
        }
      `}
      className={className}
      maskStyle={maskStyle}
      closable={closable}
      closeIcon={closeIcon}
      open={visible}
      title={title}
      footer={footer}
      maskClosable={maskClosable ?? false}
      onCancel={onCancel}
      destroyOnClose={destroyOnClose}
      getContainer={getContainer}
      wrapClassName={wrapClassName}
    >
      {children}
      {loading && (
        <div
          css={css`
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;

            display: flex;
            align-items: center;

            background-color: RGBA(255, 255, 255, 0.5);
            z-index: 1010;
          `}
        >
          <Spin
            css={css`
              margin: auto;
            `}
          />
        </div>
      )}
    </Modal>
  )
})
