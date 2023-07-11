// import { ServerWorkerMessage } from '@/message/message'
// import { Conversation, ConversationMessage } from '@/models/chat'
// import { EncooHttpService } from '@/pages/service/EncooHttpService'
// import { useConversationsPropsStore } from '@/pages/store/chat/conversationsProps'
// import { browserStorage } from '@/utils/browserStorage'
// import { newGuid } from '@/utils/uuid'
import { Conversation, ConversationMessage } from '@/models/chat'
import produce from 'immer'
import { debounce } from 'lodash-es'
import { useMemo } from 'react'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { useConversationsPropsStore } from './conversationsProps'
import { newGuid } from '@/utils/uuid'
import { EncooHttpService } from '@/pages/service/EncooHttpService'

export type ConversationCreateProps = Omit<Conversation, 'id' | 'createTime'>

export type ConversationMessageUpdateProps = Partial<ConversationMessage> &
  Pick<ConversationMessage, 'id'>

export type ConversationUpdateProps = Partial<Conversation> &
  Pick<Conversation, 'id'>

export interface ConversationListState {
  conversations: Conversation[]
  create: (conversation: ConversationCreateProps) => string
  createByFile: (payload: {
    fileName: string
    fileId: string
    sessionId: string
  }) => string
  delete: (conversationId: string) => void
  update: (conversation: ConversationUpdateProps) => void
  updateMessage: (
    conversionId: string,
    message: ConversationMessageUpdateProps
  ) => void
  addMessage: (
    conversionId: string,
    message: ConversationMessage
  ) => Promise<void>
  resend: (conversionId: string) => void
  clearErrorMessage: (conversionId: string) => void
  setConversions: (conversations: Conversation[]) => void
}

const setCurrentConversionId =
  useConversationsPropsStore.getState().setCurrentConversionId
const reply = useConversationsPropsStore.getState().reply

export const useConversationListStore = create(
  persist<ConversationListState>(
    (set, get) => ({
      conversations: [],
      create: (conversation: ConversationCreateProps) => {
        const { conversations, setConversions } = get()

        const id = newGuid()
        const newConversion = {
          id,
          createTime: new Date().getTime(),
          ...conversation,
        }
        const newConversions = produce(conversations, (draft) => {
          draft.push(newConversion)
          return draft
        })
        setConversions(newConversions)
        reply(newConversion)

        return id
      },
      createByFile: (payload: {
        fileName: string
        fileId: string
        sessionId: string
      }): string => {
        const { fileName, fileId, sessionId } = payload
        const { conversations, setConversions } = get()
        const id = newGuid()

        const newConversions = produce(conversations, (draft) => {
          draft.push({
            id,
            createTime: new Date().getTime(),
            title: fileName,
            messages: [],
            type: {
              name: 'file',
              fileName,
              sessionId,
              fileId,
            },
          })
          return draft
        })
        setConversions(newConversions)
        return id
      },
      delete: (conversationId: string) => {
        const { conversations, setConversions } = get()
        const { currentConversionId } = useConversationsPropsStore.getState()

        const newConversions = produce(conversations, (draft) => {
          return draft.filter(
            (conversation) => conversation.id !== conversationId
          )
        })
        setConversions(newConversions)

        // todo on Delete
        if (currentConversionId === conversationId) {
          setCurrentConversionId(undefined)
        }
      },
      update: (conversation: ConversationUpdateProps) => {
        const { conversations, setConversions } = get()

        const newConversions = produce(conversations, (draft) => {
          return draft.map((item) =>
            item.id === conversation.id ? { ...item, ...conversation } : item
          )
        })
        setConversions(newConversions)
      },
      addMessage: async (
        conversionId: string,
        message: ConversationMessage
      ) => {
        const { conversations, setConversions } = get()

        let content = message.message

        if (message.sender === 'robot' && content) {
          try {
            content = await EncooHttpService.chatQuota.scanText(content)
          } catch (error) {
            // 忽略错误
          }
        }

        const newConversions = produce(conversations, (draft) => {
          const conversion = draft.find((item) => item.id === conversionId)

          conversion?.messages.push({ ...message, message: content })
          return draft
        })
        setConversions(newConversions)
        if (message.sender === 'user') {
          const conversation = newConversions.find(
            (item) => item.id === conversionId
          )

          if (conversation) {
            reply(conversation)
          }
        }
      },
      resend: (conversionId: string) => {
        const { conversations, update } = get()
        const conversion = conversations.find((c) => c.id === conversionId)
        if (conversion?.needResend) {
          update({ ...conversion, needResend: false })
        }
        if (conversion) {
          reply(conversion)
        }
      },
      updateMessage: (
        conversionId: string,
        message: ConversationMessageUpdateProps
      ) => {
        const { conversations, setConversions } = get()
        const newConversions = produce(conversations, (draft) => {
          const conversion = draft.find((item) => item.id === conversionId)

          if (conversion) {
            conversion.messages = conversion.messages.map((msg) =>
              msg.id === message.id
                ? {
                    ...msg,
                    ...message,
                  }
                : msg
            )
          }

          return draft
        })
        setConversions(newConversions)
      },

      clearErrorMessage: (conversionId: string) => {
        const { conversations, setConversions } = get()
        const conversion = conversations.find((c) => c.id === conversionId)
        const hasError = conversion?.messages.some((msg) => msg.error)

        if (!hasError) {
          return
        }

        const newConversions = produce(conversations, (draft) => {
          const conversion = draft.find((c) => c.id === conversionId)

          if (conversion?.messages) {
            conversion.messages = conversion.messages.filter(
              (msg) => !msg.error
            )
          }

          return draft
        })
        setConversions(newConversions)
      },

      setConversions: (conversations: Conversation[]) => {
        set({
          conversations,
        })

        const func = debounce(() => {
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(function (registration) {
              registration.active?.postMessage({
                type: 'refreshConversions',
              })
            })
          }
        }, 500)
        func()
      },
    }),

    {
      name: 'bee-conversations', // unique name
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
)

export function useCurrentConversion(): Conversation | undefined {
  const currentConversionId = useConversationsPropsStore(
    (state) => state.currentConversionId
  )

  const conversations = useConversationListStore((state) => state.conversations)
  const conversation = useMemo(() => {
    return currentConversionId
      ? conversations.find((item) => item.id === currentConversionId)
      : undefined
  }, [conversations, currentConversionId])

  // const c = useMemo(() => {
  //   return conversation
  //     ? ({
  //         ...conversation,
  //         type: {
  //           name: "file",
  //           fileName: "text.pdf",
  //           fileId: "",
  //           sessionId: "",
  //         },
  //       } as Conversation)
  //     : undefined;
  // }, [conversation]);

  return conversation
}

// window.navigator.serviceWorker.addEventListener(
//   'message',
//   (event: MessageEvent) => {
//     const data = event.data as ServerWorkerMessage
//     if (data.type === 'refreshConversions') {
//       useConversationListStore.persist.rehydrate()
//     }
//   }
// )
