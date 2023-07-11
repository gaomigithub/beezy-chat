/** @jsxImportSource @emotion/react */

import { ConversationList } from '@/pages/mainChat/components/ConversationList'
import { css } from '@emotion/react'
import { Resizable } from 're-resizable'
import { memo } from 'react'

export const LeftPanel = memo(() => {
  return (
    <Resizable
      className="h-full flex flex-col"
      css={css`
        box-shadow: 1px 0px 0px 0px #f0f0f0;
        padding: 8px 0;
        z-index: 3;
      `}
      defaultSize={{
        height: '100%',
        width: '200',
      }}
      enable={{
        top: false,
        right: true,
        bottom: false,
        left: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }}
      minWidth={'200'}
      maxWidth={'550'}
    >
      <ConversationList />
    </Resizable>
  )
})
