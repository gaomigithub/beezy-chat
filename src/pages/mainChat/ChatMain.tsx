/** @jsxImportSource @emotion/react */

import { LeftPanel } from '@/pages/mainChat/LeftPanel'
import { useConversationsPropsStore } from '@/pages/store/chat'
import { css } from '@emotion/react'
import { memo, useEffect } from 'react'
import { ConversationLayout } from './ConversationLayout'

export const ChatMain = memo(() => {
  const setCurrentConversionId = useConversationsPropsStore(
    (state) => state.setCurrentConversionId
  )
  const searchParams = new URLSearchParams(
    window.location.hash.replace('#', '')
  )
  const conversionId = searchParams.get('id')

  useEffect(() => {
    if (conversionId) {
      setCurrentConversionId(conversionId)
    }
  }, [conversionId, setCurrentConversionId])

  useEffect(() => {
    const hashChange = async () => {
      const searchParams = new URLSearchParams(
        window.location.hash.replace('#', '')
      )

      const conversionId = searchParams.get('id')
      setCurrentConversionId(conversionId ?? undefined)
    }
    window.addEventListener('hashchange', hashChange)

    return () => {
      window.removeEventListener('hashchange', hashChange)
    }
  }, [setCurrentConversionId])

  return (
    <div
      css={css`
        z-index: 1;
      `}
      className="w-full h-full flex flex-row items-center justify-center"
    >
      <LeftPanel />
      <ConversationLayout />
    </div>
  )
})
