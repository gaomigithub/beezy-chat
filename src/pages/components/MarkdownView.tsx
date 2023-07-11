/** @jsxImportSource @emotion/react */
import { OpenAIChannelConfig, OpenAIChannelEnum } from "@/models/channel";
import { ConversationMessageSender } from "@/models/chat";
import Button from "@/pages/components/Button";
import SvgIcon from "@/pages/components/SvgIcon";
import { ReactComponent as IconCopyCode } from "@assets/img/copyCode.svg";
import { css } from "@emotion/react";
import { trim } from "lodash-es";
import { Fragment, memo, useCallback, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow, vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

export interface MarkdownViewProps {
  sender: ConversationMessageSender;
  message: string;
  doing?: boolean;
  channel?: OpenAIChannelEnum;
  className?: string;
  theme?: "dark" | "white";
  size?: "normal" | "small";
}

export const MarkdownView = memo((props: MarkdownViewProps) => {
  const {
    message,
    doing,
    sender,
    className,
    channel = OpenAIChannelEnum.gpt3,
    theme = "dark",
    size = "normal",
  } = props;

  const trimMessage = useMemo(() => trim(message, "\n"), [message]);

  const copy = useCallback((code: string) => {
    navigator.clipboard.writeText(code);
  }, []);

  const isReceivingCode = useMemo(() => {
    if (!doing) {
      return false;
    }
    let sign = 0;

    message.split("\n").forEach((item) => {
      if (item !== "```" && item.startsWith("```")) {
        sign++;
      } else if (item === "```") {
        sign--;
      }
    });
    return sign > 0;
  }, [doing, message]);

  const config = useMemo(() => OpenAIChannelConfig[channel], [channel]);

  const radius = useMemo(() => (size === "normal" ? 8 : 4), [size]);

  return (
    <div
      className={className}
      css={[
        css`
          display: inline;
          code {
            word-break: break-all;
          }
          p:first-of-type {
            margin-top: 0;
          }
          p {
            word-break: break-all;
            margin-top: 12px;
          }
          img {
            max-width: 120px;
          }
          table {
            min-width: 130px;
            text-align: left;
            border: 0px solid;
          }
          thead {
            color: #ffffff;
          }
          thead th {
            background-color: ${config.message.table.th.background};
            border-bottom-width: 0px;
            border-left-width: 1px;
            border-top-width: 0px;
            padding: 10px 10px;
            border-color: ${config.message.table.tr.border};
          }
          thead th:first-of-type {
            border-left-width: 0px;
            border-top-left-radius: ${radius}px;
          }
          thead th:last-child {
            border-right-width: 0px;
            border-top-right-radius: ${radius}px;
          }
          tbody tr {
            border-bottom-color: #ffffff;
            border-bottom-width: 0px;
            background-color: #ffffff;
          }
          tbody tr:last-child {
            border-bottom-width: 0;
          }
          tbody tr:last-child td:first-of-type {
            border-bottom-left-radius: ${radius}px;
          }
          tbody tr:nth-of-type(2n) {
            background-color: ${config.message.table.tr.evenBackground};
          }
          tbody td {
            border-bottom-width: 0px;
            border-left-width: 1px;
            padding: 10px 10px;
            border-color: ${config.message.table.tr.border};
            background-color: transparent;
          }
          tbody tr:last-child td:last-child {
            border-bottom-right-radius: ${radius}px;
          }
          tbody td:first-of-type {
            border-left-width: 0px;
          }
          tbody td:last-child {
            border-right-width: 0px;
          }
        `,
        doing &&
          !isReceivingCode &&
          sender === "robot" &&
          trimMessage &&
          css`
            > p:last-child:after,
            ol:last-child > li:last-child > p:last-child:after,
            ul:last-child > li:last-child > p:last-child:after {
              content: " ";
              display: inline-block;
              width: 25px;
              height: 25px;
              background: url(imgs/sending.gif);
              background-size: 25px 25px;
              margin-bottom: -9px;
            }
          `,
        doing &&
          isReceivingCode &&
          sender === "robot" &&
          trimMessage &&
          css`
            @keyframes pulse {
              50% {
                opacity: 0.7;
              }
            }
            code:last-child span:last-child:after {
              display: inline-block;
              animation: pulse 1.5s steps(5, start) infinite;
              content: "▍";
              margin-left: 0.25rem;
              vertical-align: bottom;
            }
          `,
        doing &&
          sender === "robot" &&
          !trimMessage &&
          css`
            content: " ";
            display: inline-block;
            width: 25px;
            height: 25px;
            background: url(imgs/sending.gif);
            background-size: 25px 25px;
            margin-bottom: -9px;
          `,
      ]}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeRaw]}
        children={message}
        components={{
          del({ node, children, ...props }) {
            return <Fragment>~{children}~</Fragment>;
          },
          a({ node, children, ...props }) {
            return (
              <a
                {...props}
                css={css`
                  color: rgb(59 130 246);
                `}
                target="_blank"
              >
                {children}
              </a>
            );
          },
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");

            return !inline && match ? (
              <div
                className="flex flex-col"
                css={css`
                  min-width: 130px;
                  border-radius: 6px;
                  margin-top: 10px;
                `}
              >
                <div
                  className="flex flex-row items-center"
                  css={[
                    css`
                      display: flex;

                      padding: ${size === "normal" ? "8px 12px" : "4px 6px"};
                      border-top-right-radius: ${radius}px;
                      border-top-left-radius: ${radius}px;
                      background-color: ${theme === "dark"
                        ? "#141414"
                        : "white"};
                      color: ${theme === "dark" ? "white" : "#3d3d3d"};
                      font-size: ${size === "normal" ? 14 : 12}px;
                    `,
                    theme === "white" &&
                      css`
                        border: 1px solid rgb(221, 221, 221);
                        border-bottom: none;
                      `,
                  ]}
                >
                  <div>{match[1]}</div>
                  <Button
                    css={css`
                      display: flex;
                      align-items: center;
                      color: ${theme === "dark" ? "white" : "#3d3d3d"};
                      margin-left: auto;
                      background-color: transparent;
                    `}
                    icon={
                      <SvgIcon
                        css={css`
                          margin-right: 3px;
                          color: ${theme === "dark" ? "white" : "#3d3d3d"};
                        `}
                        SvgComponent={IconCopyCode}
                        value={size === "small" ? 16 : 20}
                      />
                    }
                    onClick={() => {
                      copy(String(children));
                    }}
                  >
                    Copy code
                  </Button>
                </div>
                <SyntaxHighlighter
                  children={String(children).replace(/\n$/, "")}
                  style={(theme === "dark" ? tomorrow : vs) as any}
                  css={css`
                    margin-top: 0 !important;
                    border-bottom-right-radius: ${radius}px;
                    border-bottom-left-radius: ${radius}px;
                  `}
                  language={match[1]}
                  PreTag="div"
                  CodeTag={"code"}
                  {...props}
                />
              </div>
            ) : (
              <code
                className={className}
                css={css`
                  white-space: pre-wrap;
                `}
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      ></ReactMarkdown>
    </div>
  );
});
