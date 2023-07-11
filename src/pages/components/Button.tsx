/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Button as AntButton } from "antd";
import { BaseButtonProps } from "antd/es/button/button";
import { forwardRef, memo, useImperativeHandle, useRef } from "react";

export interface ButtonProps extends BaseButtonProps {
  backgroundColor?: string;
  color?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

export default memo(
  forwardRef(function Button(props: ButtonProps, ref) {
    const { className, children, color, backgroundColor, ...antButtonProps } =
      props;

    const antdButtonRef = useRef<HTMLElement>(null);

    useImperativeHandle(
      ref,
      () => ({
        focus: () => {
          antdButtonRef.current?.focus();
        },
        blur: () => {
          antdButtonRef.current?.blur();
        },
      }),
      []
    );

    return (
      <AntButton
        ref={antdButtonRef}
        css={[
          css`
            padding: 0;
            background-color: ${backgroundColor};
            color: ${color};
            font-size: 12px;
            border: none;
            &.ant-btn:hover:not([disabled]),
            &.ant-btn:focus:not([disabled]),
            &.ant-btn:active:not([disabled]) {
              background-color: ${backgroundColor};
              color: ${color};
              border: none;
              opacity: 0.9;
            }
            &.ant-btn[disabled] {
              color: rgba(0, 0, 0, 0.25);
              border-color: #d9d9d9;
            }
          `,
        ]}
        className={className}
        {...antButtonProps}
      >
        {children}
      </AntButton>
    );
  })
);
