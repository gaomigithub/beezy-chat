/** @jsxImportSource @emotion/react */
import { Conversation } from '@/models/chat'
import { ConversationMessageList } from '@/pages/components/ConversationMessageList'
import { CreateFileConversationDialog } from '@/pages/components/CreateFileConversationDialog'
import { IntroduceView } from '@/pages/components/IntroduceView'
import { MessageFooterBar } from '@/pages/components/MessageFooterBar'
import { QuotaView } from '@/pages/components/QuotaView'
import { useLoginDialogStore } from '@/pages/mainChat/store/dialog'
import { EncooHttpService } from '@/pages/service/EncooHttpService'
import { useCurrentConversion } from '@/pages/store/chat'
import { getWidth } from '@/utils/_shared'
import { css } from '@emotion/react'
import { Resizable } from 're-resizable'
import { Fragment, memo, useCallback, useEffect, useState } from 'react'
// import Browser from "webextension-polyfill";

// const gMainChatExtensionUrl = Browser.runtime.getURL('mainChat.html')

const MessageContainer = memo((props: { conversation?: Conversation }) => {
  const { conversation } = props

  const [pageSize, setPageSize] = useState<'small' | 'normal'>('normal')
  const [windowWidth, setWindowWidth] = useState(getWidth())
  // 标记一下
  useEffect(() => {
    const widthSize = () => {
      setWindowWidth(getWidth())
    }
    window.addEventListener('resize', widthSize)
    return () => {
      window.removeEventListener('resize', widthSize)
    }
  }, [])
  useEffect(() => {
    if (windowWidth.width < 1360) {
      setPageSize('small')
    } else {
      setPageSize('normal')
    }
  }, [windowWidth.width])

  const onCreateConversation = useCallback((id: string) => {
    // document.location.href = gMainChatExtensionUrl + "#id=" + id;
    window.location.href =
      globalThis.window?.location.origin +
      // router.basePath +
      // router.pathname +
      '#id=' +
      id
  }, [])
  const { open } = useLoginDialogStore()
  const onNoAuth = useCallback(() => {
    open()
  }, [open])

  return (
    <Fragment>
      {/* <QuotaView /> */}
      {conversation ? (
        <ConversationMessageList />
      ) : (
        <IntroduceView size={pageSize} />
      )}
      <MessageFooterBar
        onCreateConversation={onCreateConversation}
        onNoAuth={onNoAuth}
      />
      <CreateFileConversationDialog
        onCreateConversation={onCreateConversation}
      />
    </Fragment>
  )
})

const PDFContainer = memo((props: { fileId: string }) => {
  const { fileId } = props
  const [url, setUrl] = useState<string | undefined>(undefined)

  useEffect(() => {
    EncooHttpService.file.getFileUrl(fileId).then((url) => setUrl(url))
  }, [fileId])

  return (
    <iframe
      css={css`
        flex: 1;
      `}
      src={url}
      title="pdf"
    ></iframe>
  )
})

export const ConversationLayout = memo(() => {
  const conversation = useCurrentConversion()

  return (
    <div
      css={css`
        display: flex;
        min-width: 0;
        flex: 1;
      `}
      className="w-full h-full"
    >
      {conversation?.type?.name === 'file' ? (
        <Fragment>
          <PDFContainer
            fileId={conversation?.type.fileId}
            key={conversation?.type.fileId}
          />
          <Resizable
            css={css`
              position: relative;
              background-color: #fcfcfc;
              min-width: 0;
            `}
            defaultSize={{
              height: '100%',
              width: '400',
            }}
            minWidth={'400'}
            maxWidth={'800'}
            enable={{
              top: false,
              right: false,
              bottom: false,
              left: true,
              topRight: false,
              bottomRight: false,
              bottomLeft: false,
              topLeft: false,
            }}
            className=" flex flex-col items-center justify-center"
          >
            <MessageContainer conversation={conversation} />
          </Resizable>
        </Fragment>
      ) : (
        <div
          css={css`
            position: relative;
            background-color: #fcfcfc;
            min-width: 0;
          `}
          className="w-full h-full flex flex-col items-center justify-center"
        >
          <MessageContainer conversation={conversation} />
        </div>
      )}
    </div>
  )
})
