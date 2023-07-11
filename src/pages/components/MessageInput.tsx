/** @jsxImportSource @emotion/react */
import { ConversationMessage } from "@/models/chat";
import Button from "@/pages/components/Button";
import SvgIcon from "@/pages/components/SvgIcon";
import {
  useConversationListStore,
  useConversationsPropsStore,
} from "@/pages/store/chat";
import { useChatInputStore } from "@/pages/store/chatInput";
import { useLoginUserStore } from "@/pages/store/loginUser";
import { newGuid } from "@/utils/uuid";
import { ReactComponent as IconChartSend } from "@assets/img/chartSend.svg";
import { ReactComponent as IconMagic } from "@assets/img/icon-magic.svg";
import { css } from "@emotion/react";
import { Input } from "antd";
import { TextAreaRef } from "antd/es/input/TextArea";
import { memo, useCallback, useEffect, useMemo, useRef } from "react";

const TextArea = Input.TextArea;

export const MessageInput = memo(
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

    const createConversion = useConversationListStore((state) => state.create);
    const addMessage = useConversationListStore((state) => state.addMessage);
    const authInfo = useLoginUserStore((state) => state.authInfo);
    const text = useChatInputStore((state) => state.text);
    const setText = useChatInputStore((state) => state.setText);
    const sendMagic = useChatInputStore((state) => state.sendMagic);
    const isMagicSending = useChatInputStore((state) => state.isMagicSending);
    const inputRef = useRef<TextAreaRef>(null);
    const enterRef = useRef<boolean>(false);

    useEffect(() => {
      inputRef.current?.focus();
      setText("");
    }, [currentConversionId, setText]);

    const onChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (enterRef.current === true) {
          enterRef.current = false;
          return;
        }
        const text = e.target.value;
        setText(text ?? "");
      },
      [setText]
    );

    const onKeyDown = useCallback((event: React.KeyboardEvent<Element>) => {
      if (!event.shiftKey && event.key === "Enter") {
        enterRef.current = true;
        event.stopPropagation();
      }
    }, []);

    const trimText = useMemo(() => text, [text]);

    const onSend = useCallback(
      (e: any) => {
        if (e.shiftKey && e.key === "Enter") {
          return;
        }

        enterRef.current = true;
        e.stopPropagation();
        if (replyingMessage?.conversationId) {
          return;
        }

        if (!authInfo) {
          onNoAuth();
          return;
        }

        if (!trimText) {
          return;
        }

        const message: ConversationMessage = {
          id: newGuid(),
          sender: "user",
          message: trimText,
          createTime: Date.now(),
        };
        setText("");
        if (currentConversionId) {
          addMessage(currentConversionId, message);
        } else {
          const id = createConversion({
            title: trimText,
            messages: [message],
          });
          onCreateConversation(id);
        }
      },
      [
        replyingMessage?.conversationId,
        authInfo,
        trimText,
        setText,
        currentConversionId,
        onNoAuth,
        addMessage,
        createConversion,
        onCreateConversation,
      ]
    );

    const onSendMagic = useCallback(() => {
      if (!authInfo) {
        onNoAuth();
        return;
      }
      sendMagic();
    }, [authInfo, onNoAuth, sendMagic]);

    useEffect(() => {
      const container = inputRef.current?.resizableTextArea?.textArea;
      if (container && isMagicSending) {
        const top = container?.scrollHeight - container?.clientHeight;
        container?.scroll({ left: 0, top });
      }
    }, [text, isMagicSending]);

    return (
      <div className="flex items-center h-full">
        <div
          css={css`
            display: flex;
            flex-grow: 1;
            align-items: center;
            min-height: 56px;
            height: 100%;
            border: 1px solid #f6f6f6;
            padding: 12px 10px;
            border-radius: 4px;
            background: ${isMagicSending ? "#FFF9E5" : "#ffffff"};
          `}
        >
          <Button
            css={css`
              width: 20px !important;
              height: 20px;
              min-width: 20px;

              background-color: #fffad5;
              margin-top: 0;
              margin-bottom: auto;
              margin-right: 8px;
              border: 1px solid #fffad5 !important;
              color: #ffbc05;
              border-radius: 2px;

              :hover {
                color: #ffbc05 !important;
                background-color: #fff5cc;
                border-color: #ffbc05 !important;
              }
              :disabled {
                color: ${isMagicSending ? "#FFBC05" : "#C1C1C1"} !important;
                background-color: ${isMagicSending
                  ? "#FFECA4"
                  : "#F4F4F4"} !important;
                border-color: ${isMagicSending
                  ? "#ffe068"
                  : "transparent"} !important;
              }
            `}
            icon={
              <SvgIcon
                css={css`
                  margin: auto;
                `}
                SvgComponent={IconMagic}
                value={12}
              />
            }
            disabled={trimText === "" || isMagicSending}
            onClick={onSendMagic}
          />
          <TextArea
            ref={inputRef}
            css={css`
              flex-grow: 1;
              min-height: 45px !important;
              height: 100% !important;
              padding: 0;
              resize: none !important;
            `}
            bordered={false}
            value={text}
            onChange={onChange}
            onPressEnter={onSend}
            maxLength={3000}
            onKeyDown={onKeyDown}
            disabled={isMagicSending}
          />
          <div
            css={css`
              display: flex;
              align-items: center;
              margin-top: auto;
              margin-bottom: -3px;
            `}
          >
            {replyingMessage || isMagicSending ? (
              <img
                src="imgs/sending.gif"
                alt=""
                css={css`
                  margin: auto;
                  width: 25px;
                  height: 25px;
                `}
              />
            ) : (
              <Button
                css={css`
                  margin: auto;
                  background-color: transparent !important;
                `}
                icon={
                  <SvgIcon
                    css={css`
                      margin: auto;
                    `}
                    SvgComponent={IconChartSend}
                    value={20}
                  />
                }
                onClick={onSend}
                disabled={!trimText}
              ></Button>
            )}
          </div>
        </div>
      </div>
    );
  }
);
