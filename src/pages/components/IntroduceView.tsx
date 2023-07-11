/** @jsxImportSource @emotion/react */
import SvgIcon from "@/pages/components/SvgIcon";
import { useChatInputStore } from "@/pages/store/chatInput";
import { ReactComponent as IconAbility } from "@assets/img/icon-ability.svg";
import { ReactComponent as IconEnter } from "@assets/img/icon-enter.svg";
import { ReactComponent as IconLimit } from "@assets/img/icon-limit.svg";
import { ReactComponent as IconSun } from "@assets/img/icon-sun.svg";
import { css } from "@emotion/react";
import { Fragment, memo } from "react";

const cssCard = css`
  max-height: 60px;
  min-height: 60px;
  border-radius: 4px;
  padding: 0 24px;
  margin-right: 8px;
  margin-bottom: 8px;
`;

// todo 多语言

const IntroduceAskGroup = memo((props: { size: "small" | "normal" }) => {
  const { size } = props;

  const setText = useChatInputStore((state) => state.setText);

  return (
    <div
      className="flex flex-col "
      css={[
        size === "normal" &&
          css`
            justify-content: center;
          `,
      ]}
    >
      <div
        className="flex flex-col items-center justify-center"
        css={[
          css`
            margin-bottom: 10px;
          `,
        ]}
      >
        {size === "small" ? (
          "🤔你可以这样问"
        ) : (
          <Fragment>
            <div>
              <SvgIcon SvgComponent={IconSun} value={20} />
            </div>
            <div
              css={css`
                margin-top: 5px;
                margin-bottom: 10px;
                font-size: 14px;
                font-weight: 500;
              `}
            >
              你可以这样问
            </div>
          </Fragment>
        )}
      </div>

      <div
        className="flex flex-col justify-center"
        css={[
          css`
            cursor: pointer;
            background: #fcf9ed;
            :hover {
              background: #fff5cc;
            }
          `,
          cssCard,
        ]}
        onClick={() => setText("帮我制定一个健身计划")}
      >
        <div>
          <span>
            "帮我制定一个健身计划"
            <SvgIcon
              css={css`
                display: inline-block;
              `}
              SvgComponent={IconEnter}
              value={12}
            />
          </span>
        </div>
      </div>

      <div
        className="flex flex-col justify-center"
        css={[
          css`
            cursor: pointer;
            background: #fcf9ed;
            :hover {
              background: #fff5cc;
            }
          `,
          cssCard,
        ]}
        onClick={() => setText("如何向6岁的孩子解释外星人是否存在？")}
      >
        <div>
          <span>
            "如何向6岁的孩子解释外星人是否存在？"
            <SvgIcon
              css={css`
                display: inline-block;
              `}
              SvgComponent={IconEnter}
              value={12}
            />
          </span>
        </div>
      </div>

      <div
        className="flex flex-col justify-center"
        css={[
          css`
            cursor: pointer;
            background: #fcf9ed;
            :hover {
              background: #fff5cc;
            }
          `,
          cssCard,
        ]}
        onClick={() => setText("情人节送女朋友什么礼物不落俗套？")}
      >
        <div>
          <span>
            "情人节送女朋友什么礼物不落俗套？"
            <SvgIcon
              css={css`
                display: inline-block;
              `}
              SvgComponent={IconEnter}
              value={12}
            />
          </span>
        </div>
      </div>

      <div
        className="flex flex-col justify-center"
        css={[
          css`
            cursor: pointer;
            background: #fcf9ed;
            :hover {
              background: #fff5cc;
            }
          `,
          cssCard,
        ]}
        onClick={() => setText("帮我写一段脚本每天8点自动发送问候邮件")}
      >
        <div>
          <span>
            "帮我写一段脚本每天8点自动发送问候邮件"
            <SvgIcon
              css={css`
                display: inline-block;
              `}
              SvgComponent={IconEnter}
              value={12}
            />
          </span>
        </div>
      </div>
    </div>
  );
});

const IntroduceAbilityGroup = memo(() => {
  return (
    <div className="flex flex-col justify-center">
      <div className="flex flex-col items-center justify-center">
        <div>
          <SvgIcon SvgComponent={IconAbility} value={20} />
        </div>
        <div
          css={css`
            margin-top: 5px;
            margin-bottom: 10px;
            font-size: 14px;
            font-weight: 500;
          `}
        >
          能力
        </div>
      </div>

      <div
        className="flex flex-col justify-center"
        css={[
          css`
            background: rgba(117, 197, 162, 0.06);
          `,
          cssCard,
        ]}
      >
        <div>
          <span>记得你说过的每一句话</span>
        </div>
      </div>

      <div
        className="flex flex-col justify-center"
        css={[
          css`
            background: rgba(117, 197, 162, 0.06);
          `,
          cssCard,
        ]}
      >
        <div>
          <span>允许您对它的回答进行纠正 </span>
        </div>
      </div>

      <div
        className="flex flex-col justify-center"
        css={[
          css`
            background: rgba(117, 197, 162, 0.06);
          `,
          cssCard,
        ]}
      >
        <div>
          <span>可以生成各种语言，包括回答问题、写作文和创作诗歌</span>
        </div>
      </div>

      <div
        className="flex flex-col justify-center"
        css={[
          css`
            background: rgba(117, 197, 162, 0.06);
          `,
          cssCard,
        ]}
      >
        <div>
          <span>可以拒绝不恰当的请求，所以请不要让它做不好的事情</span>
        </div>
      </div>
    </div>
  );
});

const IntroduceLimitGroup = memo(() => {
  return (
    <div className="flex flex-col justify-center">
      <div className="flex flex-col items-center justify-center">
        <div>
          <SvgIcon SvgComponent={IconLimit} value={20} />
        </div>
        <div
          css={css`
            margin-top: 5px;
            margin-bottom: 10px;
            font-size: 14px;
            font-weight: 500;
          `}
        >
          限制
        </div>
      </div>

      <div
        className="flex flex-col justify-center"
        css={[
          css`
            background: rgba(255, 148, 148, 0.06);
          `,
          cssCard,
        ]}
      >
        <div>
          <span>它是一个计算机程序，不具有真正的意识和情感</span>
        </div>
      </div>

      <div
        className="flex flex-col justify-center"
        css={[
          css`
            background: rgba(255, 148, 148, 0.06);
          `,
          cssCard,
        ]}
      >
        <div>
          <span>对世界和2021年以后的事件的知识有限</span>
        </div>
      </div>

      <div
        className="flex flex-col justify-center"
        css={[
          css`
            background: rgba(255, 148, 148, 0.06);
          `,
          cssCard,
        ]}
      >
        <div>
          <span>不能识别模糊的语言，所以请尽量清晰明了地表达你的问题</span>
        </div>
      </div>

      <div
        className="flex flex-col justify-center"
        css={[
          css`
            background: rgba(255, 148, 148, 0.06);
          `,
          cssCard,
        ]}
      >
        <div>
          <span>偶尔可能生成错误的信息，所以请不要完全相信它的回答</span>
        </div>
      </div>
    </div>
  );
});

export const IntroduceView = memo((props: { size?: "small" | "normal" }) => {
  const { size = "normal" } = props;

  return (
    <div
      className="w-full h-full flex flex-row justify-center"
      css={[
        css`
          overflow: auto;
          padding: ${size === "small" ? 80 : 25}px 17px 0 25px;
        `,
      ]}
    >
      <IntroduceAskGroup size={size} />
      {size === "normal" && (
        <Fragment>
          <IntroduceAbilityGroup />
          <IntroduceLimitGroup />
        </Fragment>
      )}
    </div>
  );
});
