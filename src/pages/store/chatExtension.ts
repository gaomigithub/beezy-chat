// import { ServerWorkerMessage } from "@/message/message";
import { OpenAIChannelEnum } from '@/models/channel'
import { ConversationMessageExtensionEnum } from '@/models/chat'
import { useChatChannelStore } from '@/pages/store/chatChannel'
import produce from 'immer'
import { debounce } from 'lodash-es'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface ChatExtensionStoreState {
  extensionsOfChannel?: Record<
    OpenAIChannelEnum,
    ConversationMessageExtensionEnum[] | undefined
  >
  setExtensionsOfChannel: (
    extensionsOfChannel?: Record<
      OpenAIChannelEnum,
      ConversationMessageExtensionEnum[] | undefined
    >
  ) => void
  addExtension: (
    channel: OpenAIChannelEnum,
    extension: ConversationMessageExtensionEnum
  ) => void
  removeExtension: (
    channel: OpenAIChannelEnum,
    extension: ConversationMessageExtensionEnum
  ) => void
}

export const useChatExtensionStore = create(
  persist<ChatExtensionStoreState>(
    (set, get) => ({
      extensionsOfChannel: undefined,
      setExtensionsOfChannel: (
        extensionsOfChannel?: Record<
          OpenAIChannelEnum,
          ConversationMessageExtensionEnum[] | undefined
        >
      ) => {
        set({
          extensionsOfChannel,
        })

        const func = debounce(() => {
          navigator.serviceWorker.controller?.postMessage({
            type: 'refreshExtension',
          })
        }, 500)
        func()
      },
      addExtension: (
        channel: OpenAIChannelEnum,
        extension: ConversationMessageExtensionEnum
      ) => {
        const { extensionsOfChannel, setExtensionsOfChannel } = get()

        const newExtensions = produce(extensionsOfChannel, (draft) => {
          let channels = draft

          if (!channels) {
            channels = {} as Record<
              OpenAIChannelEnum,
              ConversationMessageExtensionEnum[] | undefined
            >
          }

          let extensions = channels?.[channel] ?? []

          if (extensions.indexOf(extension) === -1) {
            extensions = [...extensions, extension]
          }

          channels[channel] = extensions

          return channels
        })

        setExtensionsOfChannel(newExtensions)
      },
      removeExtension: (
        channel: OpenAIChannelEnum,
        extension: ConversationMessageExtensionEnum
      ) => {
        const { extensionsOfChannel, setExtensionsOfChannel } = get()

        if (!extensionsOfChannel) {
          return
        }

        const newExtensions = produce(extensionsOfChannel, (draft) => {
          const channels = draft

          const extensions = channels[channel] ?? []
          channels[channel] = extensions.filter((e) => e !== extension)

          return channels
        })
        setExtensionsOfChannel(newExtensions)
      },
    }),
    {
      name: 'bee-chatExtensions', // unique name
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
)

export function useExtensionsOfChannel() {
  const channel = useChatChannelStore(
    (state) => state.channel ?? OpenAIChannelEnum.gpt3
  )
  const extensionsOfChannel = useChatExtensionStore(
    (state) => state.extensionsOfChannel
  )

  return {
    channel,
    extensions: extensionsOfChannel?.[channel] ?? [],
  }
}

// window.navigator.serviceWorker.addEventListener(
//   "message",
//   (event: MessageEvent) => {
//     const data = event.data as ServerWorkerMessage;
//     if (data.type === "refreshExtension") {
//       useChatExtensionStore.persist.rehydrate();
//     }
//   }
// );
