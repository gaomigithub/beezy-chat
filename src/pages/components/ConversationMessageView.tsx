/** @jsxImportSource @emotion/react */
import { OpenAIChannelConfig, OpenAIChannelEnum } from "@/models/channel";
import {
  ConversationMessageContext,
  ConversationMessageSender,
} from "@/models/chat";
import { MarkdownView } from "@/pages/components/MarkdownView";
import { css } from "@emotion/react";
import { Fragment, memo, useMemo } from "react";

export interface ConversationMessageViewProps {
  sender: ConversationMessageSender;
  message: string;
  channel?: OpenAIChannelEnum;
  context?: ConversationMessageContext;
  doing?: boolean;
  error?: string;
}
// todo 多语言
export const ConversationMessageView = memo(
  (props: ConversationMessageViewProps) => {
    const {
      message,
      sender,
      channel = OpenAIChannelEnum.gpt3,
      doing,
      error,
      context,
    } = props;

    const config = useMemo(() => OpenAIChannelConfig[channel], [channel]);
    const showLabel = useMemo(
      () => !error && !doing && sender === "robot",
      [doing, error, sender]
    );

    const fileContext = useMemo(() => {
      if (context?.type === "file") {
        if (context.content?.queryResults?.length === 0) {
          return "无相关内容";
        } else {
          return `相关页面：${context.content.queryResults
            .map((r) => r.pageId + 1)
            .join("、")}`;
        }
      }
    }, [context]);

    return (
      <div
        css={[
          css`
            font-size: 14px;
            padding: 14px 12px ${showLabel ? 4 : 14}px 12px;
            max-width: 90%;
            border-radius: 8px;
            margin-bottom: 16px;
          `,
          sender === "robot"
            ? css`
                margin-right: auto;
                background-color: ${config.message.background};
              `
            : css`
                margin-left: auto;
                background-color: #fff5cc;
              `,
          error &&
            css`
              border: 1px solid #ff9494;
              background-color: rgba(239, 68, 68, 0.1);
            `,
        ]}
      >
        {!error && (
          <Fragment>
            <MarkdownView
              message={message}
              sender={sender}
              channel={channel}
              doing={doing}
            />
            {fileContext && (
              <p
                css={css`
                  text-align: right;
                  color: #808080;
                  font-size: 12px;
                `}
              >
                {fileContext}
              </p>
            )}
          </Fragment>
        )}
        {error && (
          <p>
            似乎出了点小问题，您可以重试或者稍等片刻。原因:
            {error}
          </p>
        )}
        {showLabel && (
          <div
            css={css`
              font-size: 12px;
              text-align: right;
              color: ${config.message.label};
            `}
          >
            {config.title}
          </div>
        )}
      </div>
    );
  }
);
