/** @jsxImportSource @emotion/react */
import { EncooFileUploadCallbackInfo } from '@/apis/EncooBeeFileHttpClient'
import { Dialog } from '@/pages/components/Dialog'
import Upload from '@/pages/components/Upload'
import { EncooHttpService } from '@/pages/service/EncooHttpService'
import { useConversationListStore } from '@/pages/store/chat'
import { useUploadDialogStore } from '@/pages/store/dialog.ts/upload'
import spinImg from '@assets/img/spin.png'
import { css, keyframes } from '@emotion/react'
import { memo, useCallback, useEffect, useState } from 'react'

const MAX_SIZE = 10 * 1024 * 1024

const UploadContent = memo(
  (props: {
    onChange: (file: File) => void
    error?: string
    className?: string
  }) => {
    const { onChange, error, className } = props

    return (
      <Upload
        accept=".pdf"
        css={css`
          display: block;
          height: 230px;
          border: 2px dashed #ffcc00;
          border-radius: 5px;
          background: rgba(255, 204, 0, 0.04);

          .ant-upload {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
        `}
        onChange={onChange}
        className={className}
      >
        <div
          css={css`
            color: #666666;
          `}
        >
          将PDF文件拖入此处
        </div>
        <div
          css={css`
            min-height: 14px;
            font-size: 12px;
            color: red;
            margin-top: 16px;
            text-align: center;
            max-width: 200px;
          `}
        >
          {error}
        </div>
        <div
          css={css`
            text-align: center;
            width: 140px;
            height: 40px;
            line-height: 40px;
            margin-top: 10px;
            border-radius: 4px;
            background: linear-gradient(180deg, #ffcc00 0%, #ffbc05 100%);
            color: #ffffff;
          `}
        >
          上传文件
        </div>
      </Upload>
    )
  }
)

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

const ProgressContent = memo(
  (props: { text: string; percent: number; className?: string }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { text, percent, className } = props

    return (
      <div
        css={css`
          display: flex;
          flex-direction: row;
          height: 230px;
          border: 2px dashed #ffcc00;
          border-radius: 5px;
          background: rgba(255, 204, 0, 0.04);
        `}
        className={className}
      >
        <img
          css={css`
            animation: ${spin} 1.2s infinite;
            animation-timing-function: linear;
            margin: auto;
          `}
          src={spinImg}
          alt={''}
        />
      </div>
    )
  }
)

export const CreateFileConversationDialog = memo(
  function CreateFileConversationDialog(props: {
    onCreateConversation: (id: string) => void
  }) {
    const { onCreateConversation } = props

    const isOpen = useUploadDialogStore((state) => state.isOpen)
    const close = useUploadDialogStore((state) => state.close)
    const [mode, setMode] = useState<'upload' | 'progress'>('upload')
    const [error, setError] = useState<string | undefined>()
    const [progressText, setProgressText] = useState<undefined | string>('')
    const [percent, setPercent] = useState<number>(0)

    useEffect(() => {
      if (!isOpen) {
        setMode('upload')
        setError(undefined)
      }
    }, [isOpen])

    const createByFile = useConversationListStore((state) => state.createByFile)

    const createPdfChatUntilReady = useCallback(
      async (payload: { fileId: string; url: string; fileName: string }) => {
        const { fileId, url, fileName } = payload

        setProgressText('文件解析中...')
        setPercent(0)

        EncooHttpService.pdf.createPdfChatUntilReady(fileId, url, (info) => {
          if (info.error) {
            setError(
              '此文档解析失败，请换文件试试吧。(Beta功能，团队正在优化中……)'
            )
            setMode('upload')
            return
          }
          setPercent(info.session?.progress ?? 0)

          if (info.session?.sessionState === 'Ready') {
            const conversionId = createByFile({
              fileName,
              fileId,
              sessionId: info.session.id,
            })
            onCreateConversation(conversionId)
            close()
          }
        })
      },
      [close, createByFile, onCreateConversation]
    )

    const uploadFile = useCallback(
      async (file: File) => {
        EncooHttpService.file.uploadFile(
          file,
          (info: EncooFileUploadCallbackInfo) => {
            switch (info.state) {
              case 'Preparing':
                setProgressText('文件上传中...')
                setPercent(0)
                setMode('progress')
                break
              case 'Uploading':
                setPercent(info.percent)
                break
              case 'Compositing':
                setPercent(info.percent)
                break
              case 'Completed':
                setPercent(100)
                if (info.id && info.url) {
                  createPdfChatUntilReady({
                    fileId: info.id,
                    url: info.url,
                    fileName: file.name,
                  })
                  EncooHttpService.profile.traceEvent(
                    'UPLOAD-PDF',
                    JSON.stringify({ name: file.name, id: info.id })
                  )
                }

                break
              case 'Failed':
                setError('文件上传失败。')
                setMode('upload')
                break
            }
          }
        )
      },
      [createPdfChatUntilReady]
    )

    const onChange = useCallback(
      (file: File) => {
        // todo 进度条
        if (file.size > MAX_SIZE) {
          setError('文件超过了最大限制.(最大10M)')
          return
        }
        setError(undefined)
        uploadFile(file)
      },
      [uploadFile]
    )

    return (
      <Dialog visible={isOpen} title="新建PDF对话" onCancel={close}>
        <UploadContent
          css={
            mode !== 'upload'
              ? css`
                  display: none;
                `
              : undefined
          }
          error={error}
          onChange={onChange}
        />

        <ProgressContent
          css={
            mode !== 'progress'
              ? css`
                  display: none;
                `
              : undefined
          }
          text={progressText ?? ''}
          percent={percent}
        />
      </Dialog>
    )
  }
)
