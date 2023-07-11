/** @jsxImportSource @emotion/react */
import Button from "@/pages/components/Button";
import { ConversionExtensionsGroup } from "@/pages/components/ConversionExtensionsGroup";
import { MessageFooterTools } from "@/pages/components/MessageFooterTools";
import { MessageInput } from "@/pages/components/MessageInput";
import SvgIcon from "@/pages/components/SvgIcon";
import {
  useConversationListStore,
  useConversationsPropsStore,
  useCurrentConversion,
} from "@/pages/store/chat";
import { useLoginUserStore } from "@/pages/store/loginUser";
import { ReactComponent as IconResend } from "@assets/img/icon-resend.svg";
import { ReactComponent as IconStop } from "@assets/img/icon-stop.svg";
import { css } from "@emotion/react";
import { Resizable } from "re-resizable";
import { Fragment, memo, useCallback, useMemo } from "react";

// todo 多语言
export const MessageFooterBar = memo(
  (props: {
    onCreateConversation: (id: string) => void;
    onNoAuth: () => void;
  }) => {
    const { onCreateConversation, onNoAuth } = props;
    const replyingMessage = useConversationsPropsStore(
      (state) => state.replyingMessage
    );
    const currentConversionId = useConversationsPropsStore(
      (state) => state.currentConversionId
    );
    const stop = useConversationsPropsStore((state) => state.stop);
    const conversations = useCurrentConversion();
    const resend = useConversationListStore((state) => state.resend);
    const authInfo = useLoginUserStore((state) => state.authInfo);

    const hasError = useMemo(
      () => conversations?.messages.some((msg) => msg.error),
      [conversations?.messages]
    );

    const onResend = useCallback(() => {
      if (!authInfo) {
        onNoAuth();
        return;
      }
      if (currentConversionId) {
        resend(currentConversionId);
      }
    }, [authInfo, currentConversionId, onNoAuth, resend]);

    const showResend = useMemo(
      () => hasError && !replyingMessage?.message,
      [hasError, replyingMessage?.message]
    );

    return (
      <Fragment>
        <ConversionExtensionsGroup />
        <Resizable
          css={css`
            padding: 0 8px 16px 8px;
            height: 120px;
            border-top: 1px solid #f0f0f0;
            background-color: #fcfcfc;
          `}
          defaultSize={{
            height: "120",
            width: "100%",
          }}
          enable={{
            top: true,
            right: false,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false,
          }}
          minHeight={"120"}
          maxHeight={"450"}
        >
          <Fragment>
            {replyingMessage?.message && (
              <Button
                css={css`
                  display: flex;
                  align-items: center;
                  color: #ffffff !important;
                  padding: 0;
                  font-size: 12px;
                  border: none;
                  border-radius: 8px;
                  background-color: #ff9494;
                  width: 140px;
                  height: 40px;
                  margin: auto;
                  margin-top: -50px;
                  margin-bottom: 10px;
                `}
                onClick={stop}
              >
                <div
                  css={css`
                    display: flex;
                    margin: auto;
                  `}
                >
                  <SvgIcon
                    css={css`
                      margin-right: 3px;
                    `}
                    SvgComponent={IconStop}
                    value={16}
                  />
                  终止回答
                </div>
              </Button>
            )}
            <div className="flex flex-col h-full">
              <MessageFooterTools />
              {showResend ? (
                <div
                  css={css`
                    display: flex;
                    align-items: center;
                    min-height: 56px;
                    height: 100%;
                  `}
                  className="w-full"
                >
                  <Button
                    css={css`
                      display: flex;
                      align-items: center;
                      color: #ffffff !important;
                      padding: 0;
                      font-size: 12px;
                      border: none;
                      border-radius: 8px;
                      background-color: #0ca37f;
                      width: 140px;
                      height: 40px;
                      margin: auto;
                    `}
                    disabled={!!replyingMessage}
                    onClick={onResend}
                  >
                    <div
                      css={css`
                        display: flex;
                        margin: auto;
                      `}
                    >
                      <SvgIcon
                        css={css`
                          margin-right: 3px;
                        `}
                        SvgComponent={IconResend}
                        value={16}
                      />
                      重新回答
                    </div>
                  </Button>
                </div>
              ) : (
                <MessageInput
                  onCreateConversation={onCreateConversation}
                  onNoAuth={onNoAuth}
                />
              )}
            </div>
          </Fragment>
        </Resizable>
      </Fragment>
    );
  }
);
