/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { memo } from "react";

export interface ExtendableLabelProps {
  text: string;
}

export const ExtendableLabel = memo((props: ExtendableLabelProps) => {
  const { text } = props;

  return (
    <div
      css={css`
        display: inline;
        margin: 0 auto 10px auto;
        color: #999999;
      `}
    >
      <span
        css={css`
          font-weight: bolder;
        `}
      >
        CONTEXT:
      </span>
      <span
      // css={css`
      //   overflow: hidden;
      //   white-space: normal !important;
      //   text-overflow: ellipsis;
      //   word-wrap: break-word;
      //   -webkit-line-clamp: 3;
      //   -webkit-box-orient: vertical;
      // `}
      >
        {text}
      </span>
    </div>
  );
});
