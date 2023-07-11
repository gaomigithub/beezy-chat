// import { ServerWorkerMessage } from '@/message/message'
import { ChatQuota } from '@/models/chat'
import { EncooHttpService } from '@/pages/service/EncooHttpService'
// // import { browserStorage } from '@/utils/browserStorage'
import { debounce } from 'lodash-es'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface ChatQuotaStoreState {
  refresh: () => Promise<void>
  quota3?: ChatQuota
  quota4?: ChatQuota
}

export const useChatQuotaStore = create(
  persist<ChatQuotaStoreState>(
    (set, get) => ({
      refresh: async () => {
        try {
          const quota = await EncooHttpService.chatQuota.getChatQuota()
          set({
            quota3: {
              max: quota.max,
              used: quota.used,
            },
          })
        } catch (error) {
          //
        }
        try {
          const quota4 = await EncooHttpService.chatQuota.getChatQuota4()
          set({
            quota4: {
              max: quota4.max,
              used: quota4.used,
            },
          })
        } catch (error) {
          //
        }
        const func = debounce(() => {
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(function (registration) {
              registration.active?.postMessage({
                type: 'refreshQuota',
              })
            })
          }
        }, 500)
        func()
      },
    }),
    {
      name: 'bee-chartQuota', // unique name
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
)

// window.navigator.serviceWorker.addEventListener(
//   'message',
//   (event: MessageEvent) => {
//     const data = event.data as ServerWorkerMessage
//     if (data.type === 'refreshQuota') {
//       useChatQuotaStore.persist.rehydrate()
//     }
//   }
// )
