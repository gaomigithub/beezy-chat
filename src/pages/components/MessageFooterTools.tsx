/** @jsxImportSource @emotion/react */
import { OpenAIChannelEnum } from '@/models/channel'
import { ConversationMessageExtensionEnum } from '@/models/chat'
import Button from '@/pages/components/Button'
import SvgIcon from '@/pages/components/SvgIcon'
import { useChatChannelStore } from '@/pages/store/chatChannel'
import {
  useChatExtensionStore,
  useExtensionsOfChannel,
} from '@/pages/store/chatExtension'
import { ReactComponent as IconGPT35 } from '@assets/img/icon-gpt35.svg'
import { ReactComponent as IconGPT40 } from '@assets/img/icon-gpt40.svg'
import { ReactComponent as IconGroup } from '@assets/img/icon-group.svg'
import { ReactComponent as IconLock } from '@assets/img/icon-lock.svg'
import { ReactComponent as IconNetwork } from '@assets/img/icon-network.svg'
import { ReactComponent as IconText } from '@assets/img/icon-text.svg'
import { css } from '@emotion/react'
import { Checkbox, Popover } from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { memoize } from 'lodash-es'
import { Fragment, memo, useCallback, useMemo, useState } from 'react'

interface OpenAIChannelProps {
  onClosePopup: () => void
}

interface OpenAIChannelItemProps extends OpenAIChannelProps {
  channel: OpenAIChannelEnum
  title: string
  desc: string
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  iconBackground: string
}

const OpenAIChannelItem = memo((props: OpenAIChannelItemProps) => {
  const { channel, title, icon, iconBackground, desc, onClosePopup } = props

  const setChannel = useChatChannelStore((state) => state.setChannel)
  const selectedChannel = useChatChannelStore(
    (state) => state.channel ?? OpenAIChannelEnum.gpt3
  )
  const onClick = useCallback(() => {
    setChannel(channel)
    onClosePopup()
  }, [channel, onClosePopup, setChannel])

  return (
    <div
      className="flex flex-row"
      css={[
        css`
          cursor: pointer;
          padding: 5px;
          border-radius: 3px;
          border: 1px solid
            ${channel === selectedChannel ? '#ffbc05' : 'transparent'};
          :hover {
            background-color: #f9f9f9;
          }
        `,
      ]}
      onClick={onClick}
    >
      <SvgIcon
        css={css`
          margin-right: 8px;
          background-color: ${iconBackground};
        `}
        SvgComponent={icon}
        value={36}
      />
      <div className="flex flex-col">
        <div
          css={css`
            color: #7e7e7e;
            font-size: 14px;
            line-height: 14px;
            margin-bottom: 5px;
          `}
        >
          {title}
        </div>
        <div
          css={css`
            color: #bebebe;
            font-size: 12px;
            line-height: 12px;
          `}
        >
          {desc}
        </div>
      </div>
    </div>
  )
})

const OpenAIChannelContent = memo((props: OpenAIChannelProps) => {
  const { onClosePopup } = props
  const items = useMemo(
    () => [
      {
        channel: OpenAIChannelEnum.gpt3,
        icon: IconGPT35,
        iconBackground: 'rgba(16, 163, 127, 0.2)',
        title: 'ChatGPT 3.5模式',
        desc: '2千亿级参数，比GPT4响应更快、逻辑推理较差',
      },
      {
        channel: OpenAIChannelEnum.gpt4,
        icon: IconGPT40,
        iconBackground: 'rgba(66, 133, 244, 0.24)',
        title: 'ChatGPT 4.0模式',
        desc: 'OpenAI最新发布，超强推理，更长上下文处理',
      },
    ],
    []
  )

  return (
    <div className="flex flex-col">
      {items.map((item) => (
        <OpenAIChannelItem
          key={item.channel}
          channel={item.channel}
          icon={item.icon}
          title={item.title}
          desc={item.desc}
          onClosePopup={onClosePopup}
          iconBackground={item.iconBackground}
        />
      ))}
    </div>
  )
})

const OpenAIButton = memo(() => {
  const [open, setOpen] = useState(false)

  const selectedChannel = useChatChannelStore(
    (state) => state.channel ?? OpenAIChannelEnum.gpt3
  )

  const onOpenChange = useCallback((visible: boolean) => {
    setOpen(visible)
  }, [])

  const onClosePopup = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <Popover
      content={<OpenAIChannelContent onClosePopup={onClosePopup} />}
      title="切换模式"
      trigger="click"
      open={open}
      onOpenChange={onOpenChange}
    >
      <Button
        css={css`
          display: flex;
          align-items: center;
          border: 1px solid #ededed !important;
          padding: 2px 8px;
          height: 28px;
          border-radius: 4px;
          background: #fcfcfc;
          margin-right: 7px;
        `}
        icon={
          <SvgIcon
            css={css`
              margin-right: 5px;
            `}
            SvgComponent={
              selectedChannel === OpenAIChannelEnum.gpt3 ? IconGPT35 : IconGPT40
            }
            value={20}
          />
        }
      >
        {`GPT${selectedChannel === OpenAIChannelEnum.gpt3 ? '3.5' : '4.0'}`}
      </Button>
    </Popover>
  )
})

export const conversionExtensionConfig = [
  {
    key: ConversationMessageExtensionEnum.longText,
    icon: IconText,
    name: '长文问答-Pro',
    describe: '高效处理超长文本提问或回答',
    enableInModels: [OpenAIChannelEnum.gpt4],
    warning: (
      <span
        css={css`
          font-weight: 200;
          margin-left: 3px;
          color: #999999;
        `}
      >
        (将消耗
        <span
          css={css`
            color: #ffc937;
            font-weight: bolder;
          `}
        >
          3倍
        </span>
        额度)
      </span>
    ),
    disableTag: {
      background: '#E1EBFC',
      color: '#4285F4',
      text: '仅支持4.0',
    },
    future: false,
  },
  {
    key: ConversationMessageExtensionEnum.network,
    icon: IconNetwork,
    name: '联网问答-Pro',
    describe: '实时联网问答，超越GPT 2021年的知识限制',
    future: true,
  },
]

export const MessageExtensionContent = memo(() => {
  const { channel, extensions } = useExtensionsOfChannel()
  const addExtension = useChatExtensionStore((state) => state.addExtension)
  const removeExtension = useChatExtensionStore(
    (state) => state.removeExtension
  )

  const modeOptions = useMemo(() => {
    return conversionExtensionConfig.map((config) => ({
      ...config,
      value: extensions.indexOf(config.key) > -1,
      disable:
        !config.enableInModels || config.enableInModels.indexOf(channel) === -1,
    }))
  }, [channel, extensions])

  const onCheckChanged = useMemo(
    () =>
      memoize(
        (extensionType: ConversationMessageExtensionEnum) =>
          (event: CheckboxChangeEvent) => {
            const checked = event.target.checked
            if (checked) {
              addExtension(channel, extensionType)
            } else {
              removeExtension(channel, extensionType)
            }
          }
      ),
    [addExtension, channel, removeExtension]
  )

  const onClick = useMemo(
    () =>
      memoize((extensionType: ConversationMessageExtensionEnum) => () => {
        const checked = !(extensions.indexOf(extensionType) > -1)
        if (checked) {
          addExtension(channel, extensionType)
        } else {
          removeExtension(channel, extensionType)
        }
      }),
    [addExtension, channel, removeExtension, extensions]
  )

  return (
    <div
      className="flex flex-col"
      css={css`
        min-width: 320px;
      `}
    >
      {modeOptions.map((item) => (
        <div
          key={item.key}
          className="bg-white flex flex-row items-center relative"
          css={[
            css`
              cursor: pointer;
              padding: 10px 0;
              border-radius: 4px;
              border: 1px solid
                ${item.value ? 'rgba(255, 195, 0, 0.3)' : '#ffffff'};

              :hover {
                background-color: #f9f9f9;
              }
            `,
          ]}
          onClick={item.future || item.disable ? undefined : onClick(item.key)}
        >
          <div
            css={css`
              margin-right: 6px;
            `}
          >
            <SvgIcon SvgComponent={item.icon} value={30} />
          </div>
          <div className="flex flex-col ">
            <div
              css={css`
                color: #7e7e7e;
                font-size: 14px;
                line-height: 14px;
                margin-bottom: 5px;
              `}
            >
              {item.name}
              {item.warning}
            </div>
            <div
              css={css`
                color: #bebebe;
                font-size: 12px;
                line-height: 12px;
              `}
            >
              {item.describe}
            </div>
          </div>

          {item.future || (item.disable && item.disableTag) ? (
            <div
              className="flex flex-row justify-center items-center"
              css={[
                css`
                  position: absolute;
                  width: 74px;
                  height: 24px;
                  border-radius: 4px;
                  opacity: 1;
                  background: ${item.disableTag
                    ? item.disableTag.background
                    : '#ffc937'};
                  font-size: 12px;
                  color: ${item.disableTag ? item.disableTag.color : '#ffffff'};
                  right: 5px;
                  top: 10px;
                `,
              ]}
            >
              {item.disableTag ? (
                item.disableTag.text
              ) : (
                <Fragment>
                  <SvgIcon SvgComponent={IconLock} value={12} />
                  &nbsp; 即将上线
                </Fragment>
              )}
            </div>
          ) : (
            <Checkbox
              checked={item.value}
              value={item.value}
              onChange={onCheckChanged(item.key)}
              disabled={item.disable}
              css={css`
                color: #efefef;
                margin-left: auto;
                margin-right: 5px;
                .ant-checkbox-checked .ant-checkbox-inner {
                  background-color: #ffc937;
                  border-color: transparent;
                }
                :hover {
                  .ant-checkbox-inner {
                    border-color: #d9d9d9 !important;
                  }
                  .ant-checkbox-checked .ant-checkbox-inner {
                    background-color: #ffc937 !important;
                    border-color: transparent !important;
                  }
                }
              `}
            />
          )}
        </div>
      ))}
    </div>
  )
})

const ExtensionButton = memo(() => {
  const [open, setOpen] = useState(false)

  const onOpenChange = useCallback((visible: boolean) => {
    setOpen(visible)
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onClosePopup = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <Popover
      content={<MessageExtensionContent />}
      title="技能"
      trigger="click"
      open={open}
      onOpenChange={onOpenChange}
    >
      <Button
        css={css`
          display: flex;
          align-items: center;
          border: 1px solid #ededed !important;
          padding: 2px 8px;
          height: 28px;
          border-radius: 4px;
          background: #fcfcfc;
        `}
        icon={
          <SvgIcon
            css={css`
              margin-right: 5px;
            `}
            SvgComponent={IconGroup}
            value={20}
          />
        }
      >
        技能
      </Button>
    </Popover>
  )
})

export const MessageFooterTools = memo(() => {
  return (
    <div
      className="w-full flex"
      css={css`
        padding: 6px 0px;
      `}
    >
      <OpenAIButton />
      <ExtensionButton />
    </div>
  )
})
