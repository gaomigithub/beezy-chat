// import { ServerWorkerMessage } from '@/message/message'
import { OpenAIChannelEnum } from '@/models/channel'
// import { browserStorage } from '@/utils/browserStorage'
import { debounce } from 'lodash-es'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface ChatChannelState {
  channel?: OpenAIChannelEnum
  setChannel: (channel: OpenAIChannelEnum) => void
}

export const useChatChannelStore = create(
  persist<ChatChannelState>(
    (set, get) => ({
      channel: OpenAIChannelEnum.gpt3,
      setChannel: (channel: OpenAIChannelEnum) => {
        set({ channel })
        const func = debounce(() => {
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(function (registration) {
              registration.active?.postMessage({
                type: 'refreshChannel',
              })
            })
          }
        }, 500)
        func()
      },
    }),
    {
      name: 'bee-chartChannel', // unique name
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
)

// window.navigator.serviceWorker.addEventListener(
//   'message',
//   (event: MessageEvent) => {
//     const data = event.data as ServerWorkerMessage
//     if (data.type === 'refreshChannel') {
//       useChatChannelStore.persist.rehydrate()
//     }
//   }
// )
