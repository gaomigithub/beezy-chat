/** @jsxImportSource @emotion/react */
import useFreeLogin from '@/client/use-free-login'
import { OpenAIChannelConfig, OpenAIChannelEnum } from '@/models/channel'
import SvgIcon from '@/pages/components/SvgIcon'
import { useChatChannelStore } from '@/pages/store/chatChannel'
import { useChatQuotaStore } from '@/pages/store/chatQuota'
import { ReactComponent as IconQuestion } from '@assets/img/icon-question.svg'
import { css } from '@emotion/react'
import { Tooltip } from 'antd'
import { memo, useMemo } from 'react'

export const QuotaView = memo(() => {
  const { code } = useFreeLogin()

  const channel = useChatChannelStore(
    (state) => state.channel ?? OpenAIChannelEnum.gpt3
  )

  const quota3 = useChatQuotaStore((state) => state.quota3)
  const quota4 = useChatQuotaStore((state) => state.quota4)
  const quota = useMemo(
    () => (channel === OpenAIChannelEnum.gpt3 ? quota3 : quota4),
    [channel, quota3, quota4]
  )

  const config = useMemo(() => OpenAIChannelConfig[channel], [channel])

  const quotaMax = useMemo(() => {
    const max = quota?.max ?? 0
    return max > 100000 ? '∞' : max
  }, [quota])

  if (!quota) {
    return null
  }

  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        width: 100%;
        height: 32px;
        min-height: 32px;
        background-color: #ffffff;
        font-size: 12px;
        color: #80643e;
        padding: 0 10px;
        box-shadow: 0px 1px 0px 0px #f3f3f3;
        z-index: 2;
      `}
    >
      {code ? code : 111}
      {config.fullName} 额度：{quota?.used}/{quotaMax}
      <Tooltip
        title={`每日可获取${quotaMax}个${config.title}提问额度，早8点更新`}
      >
        <span
          css={css`
            color: #80643e;
          `}
        >
          <SvgIcon
            css={css`
              margin-left: 8px;
            `}
            SvgComponent={IconQuestion}
            value={12}
          />
        </span>
      </Tooltip>
    </div>
  )
})
