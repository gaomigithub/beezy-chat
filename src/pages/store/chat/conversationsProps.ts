import {
  OpenAICompletionRequestMessage,
  OpenAICompletionRequestMessageRoleEnum,
} from '@/apis/EncooBeeChatStreamClient'
import { PdfQueryResult } from '@/apis/EncooBeePdfHttpClient'
import { OpenAIChannelEnum } from '@/models/channel'
import {
  Conversation,
  ConversationMessageExtensionEnum,
  ConversationReplyingMessage,
} from '@/models/chat'
import { EncooHttpService } from '@/pages/service/EncooHttpService'
import { useConversationListStore } from '@/pages/store/chat/conversationList'
import { useChatChannelStore } from '@/pages/store/chatChannel'
import { useChatExtensionStore } from '@/pages/store/chatExtension'
import { useChatQuotaStore } from '@/pages/store/chatQuota'
import { newGuid } from '@/utils/uuid'
import { last } from 'lodash-es'
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export interface ConversationsPropsState {
  currentConversionId: string | undefined
  replyingMessage?: ConversationReplyingMessage
  setCurrentConversionId: (currentConversionId: string | undefined) => void
  setReplyingMessage: (replyingMessage?: ConversationReplyingMessage) => void
  reply: (conversation: Conversation) => Promise<void>
  stop: () => Promise<void>
}

function transformFileMessage(message: string, queryResults: PdfQueryResult[]) {
  if (queryResults.length > 0) {
    const { channel = OpenAIChannelEnum.gpt3 } = useChatChannelStore.getState()
    const { extensionsOfChannel } = useChatExtensionStore.getState()
    const extensions = extensionsOfChannel?.[channel]
    const isLongText = extensions?.includes(
      ConversationMessageExtensionEnum.longText
    )
    const maxLength = isLongText ? 3000 : 1000
    return `Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.\n
    ${queryResults
      .map((r) => r.pageContent)
      .join('\n')
      .substring(0, maxLength)}\n
    Question: ${message}
    用中文回答:`
  } else {
    return `Use only chat log above to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.

    Question: ${message}
    用中文回答:`
  }
}

async function transferConversionToPrompts(conversion: Conversation) {
  if (conversion.type?.name === 'file') {
    const message = last(
      conversion.messages.filter((msg) => msg.sender === 'user')
    )

    if (message && !message?.context) {
      const fileId = conversion.type.fileId
      const sessionId = conversion.type.sessionId

      const url = await EncooHttpService.file.getFileUrl(conversion.type.fileId)
      const queryResult = await EncooHttpService.pdf.queryPdfChat(
        fileId,
        sessionId,
        url,
        message?.message ?? ''
      )

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { update, updateMessage, addMessage } =
        useConversationListStore.getState()

      updateMessage(conversion.id, {
        id: message.id,
        context: {
          type: 'file',
          content: {
            queryResults: queryResult?.pdfQueryResults ?? [],
          },
        },
      })
    }
  }
  const { conversations } = useConversationListStore.getState()
  // todo context = fil.e 时转换
  const messages =
    conversations
      .find((c) => c.id === conversion.id)
      ?.messages.filter((msg) => !msg.error) ?? []
  // .filter((msg) => !msg.error)
  // .map(
  //   (c) =>
  //     `[${c.sender === "user" ? "Question" : "Answer"}]:${
  //       c.context?.type === "selection"
  //         ? `${c.message}:${c.context}`
  //         : c.message
  //     }\n`
  // ) ?? [];

  let prompt = ''
  const prompts: OpenAICompletionRequestMessage[] = []
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i]
    const temp = message.message + prompt
    if (prompt.length > 8000) {
      break
    }
    prompt = temp
    prompts.push({
      role:
        message.sender === 'robot'
          ? OpenAICompletionRequestMessageRoleEnum.Assistant
          : OpenAICompletionRequestMessageRoleEnum.User,
      content:
        message.context?.type === 'selection'
          ? message.context.content
          : message.context?.type === 'file'
          ? transformFileMessage(
              message.message,
              message.context.content.queryResults
            )
          : message.message,
      transform: message.transform,
    })
  }

  return prompts.reverse()
}

export const useConversationsPropsStore = create(
  subscribeWithSelector<ConversationsPropsState>((set, get) => ({
    currentConversionId: undefined,
    replyingMessage: undefined,
    setCurrentConversionId: (currentConversionId: string | undefined) =>
      set({ currentConversionId }),
    setReplyingMessage: (replyingMessage?: ConversationReplyingMessage) =>
      set({ replyingMessage }),
    stop: async () => {
      const { replyingMessage } = get()

      if (replyingMessage?.message) {
        const { addMessage, clearErrorMessage } =
          useConversationListStore.getState()
        const { conversationId } = replyingMessage

        await addMessage(conversationId, {
          message: replyingMessage.message,
          sender: 'robot',
          id: newGuid(),
          channel: replyingMessage.channel,
          createTime: Date.now(),
          extensions: replyingMessage.extensions,
        })
        clearErrorMessage(conversationId)

        set({ replyingMessage: undefined })
        // const { refresh } = useChatQuotaStore.getState()
        // refresh()
      }
    },
    reply: async (conversation: Conversation) => {
      const { replyingMessage } = get()

      if (replyingMessage) {
        // 只允许一个进行中的问题
        return
      }

      const conversationId = conversation.id

      const replyId = newGuid()
      const { channel = OpenAIChannelEnum.gpt3 } =
        useChatChannelStore.getState()
      const { extensionsOfChannel } = useChatExtensionStore.getState()
      const extensions = extensionsOfChannel?.[channel]

      const onError = async (error: unknown) => {
        const { replyingMessage } = get()

        if (replyingMessage?.id === replyId) {
          const { addMessage } = useConversationListStore.getState()
          await addMessage(conversationId, {
            message: replyingMessage.message,
            sender: 'robot',
            id: newGuid(),
            channel: replyingMessage.channel,
            error: (error as { message?: string }).message ?? `${error}`,
            createTime: Date.now(),
          })

          set({ replyingMessage: undefined })
        }
      }

      set({
        replyingMessage: {
          message: '',
          conversationId,
          id: replyId,
          channel,
          extensions,
        },
      })

      try {
        const prompts = await transferConversionToPrompts(conversation)

        if (prompts.length === 0) {
          set({ replyingMessage: undefined })
          return
        }

        EncooHttpService.chatApi.sendMessage({
          prompt: prompts,
          channel,
          extensions,
          onRead: (text: string) => {
            const { replyingMessage } = get()

            if (replyingMessage?.id === replyId) {
              set({
                replyingMessage: {
                  id: replyingMessage.id,
                  channel: replyingMessage.channel,
                  conversationId,
                  message: (replyingMessage?.message ?? '') + text,
                },
              })
            }
          },
          onDone: () => {
            const { replyingMessage, stop } = get()

            if (replyingMessage?.id === replyId) {
              stop()
            }
          },
          onError: async (error) => {
            onError(error)
          },
        })
      } catch (error) {
        onError(error)
      }
    },
  }))
)
