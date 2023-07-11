/** @jsxImportSource @emotion/react */
import { ConversationMessageView } from "@/pages/components/ConversationMessageView";
import { ExtendableLabel } from "@/pages/components/ExtendableLabel";
import { MessageTime } from "@/pages/components/MessageTime";
import SvgIcon from "@/pages/components/SvgIcon";
import {
  useConversationsPropsStore,
  useCurrentConversion,
} from "@/pages/store/chat";
import { ReactComponent as IconPDF } from "@assets/img/icon-pdf.svg";
import { css } from "@emotion/react";
import { Fragment, memo, useEffect, useRef } from "react";

const ConversationFileHeader = memo((props: { name: string }) => {
  const { name } = props;
  // todo 样式
  return (
    <Fragment>
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          margin-bottom: 12px;
          font-size: 12px;
          color: #808080;
        `}
      >
        <SvgIcon SvgComponent={IconPDF} value={16} /> 文件名称：{name}
      </div>
      <div
        css={[
          css`
            font-size: 14px;
            padding: 14px 12px 14px 12px;
            max-width: 90%;
            border-radius: 8px;
            margin-bottom: 16px;

            margin-right: auto;
            background-color: #e7f5f2;
          `,
        ]}
      >
        {`欢迎来到BeezyPDF(内测版)，在这里您可以：`} <br />
        {`💬 像聊天一样与PDF进行对话问答`} <br />
        {`✍️ 让我解释PDF中提到的内容`} <br />
        {`🔎 让我帮您查找PDF中的任何信息`}
        <br />
        <br />
        {`期待您在Beezy用户微信群中反馈建议，帮助我们一起优化❤️`}
        <br />
        <a
          css={css`
            color: rgb(59 130 246);
          `}
          href="erweima.png"
          target="blank"
        >
          点击加入官方企业微信
        </a>
      </div>
    </Fragment>
  );
});

export const ConversationMessageList = memo((props: { className?: string }) => {
  const { className } = props;
  const conversation = useCurrentConversion();
  const replyingMessage = useConversationsPropsStore(
    (state) => state.replyingMessage
  );

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      const top = container?.scrollHeight - container?.clientHeight;
      container?.scroll({ left: 0, top: top - 26 });
    }
  }, [replyingMessage?.message, conversation?.id]);

  return (
    <div
      css={css`
        padding: 16px 16px 26px 16px;
        overflow: auto;
        color: #3d3d3d;
      `}
      className={`w-full h-full flex flex-col ${className}`}
      ref={containerRef}
    >
      {conversation?.type?.name === "file" && (
        <ConversationFileHeader name={conversation.type.fileName} />
      )}
      {conversation?.messages.map((message, index) => (
        <Fragment key={message.id}>
          {message.createTime && message.sender === "user" ? (
            <MessageTime
              currentTime={message.createTime}
              prevTime={conversation?.messages[index - 1]?.createTime}
            />
          ) : null}

          {message.context?.type === "selection" && (
            <ExtendableLabel text={message.context.content} />
          )}
          <ConversationMessageView
            message={message.message}
            context={
              message.sender === "robot"
                ? conversation?.messages[index - 1]?.context
                : undefined
            }
            sender={message.sender}
            channel={message.channel}
            error={message.error}
          />
        </Fragment>
      ))}

      {replyingMessage &&
        replyingMessage.conversationId === conversation?.id && (
          <ConversationMessageView
            message={replyingMessage.message}
            sender={"robot"}
            channel={replyingMessage.channel}
            doing={true}
          />
        )}
    </div>
  );
});
