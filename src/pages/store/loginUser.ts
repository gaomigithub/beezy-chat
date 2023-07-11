// import { ServerWorkerMessage } from "@/message/message";
import {
  AuthInfo,
  encooAuthService,
  LoginType,
} from '@/pages/service/EncooAuthService'
import { useChatQuotaStore } from '@/pages/store/chatQuota'
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export interface LoginUserStoreState {
  authInfo?: AuthInfo
  setAuthInfo: (auth?: AuthInfo) => void
  logout: () => Promise<void>
  init: () => Promise<void>
  refreshQuota: () => Promise<void>
  login: (type: LoginType) => void
}

export const useLoginUserStore = create(
  subscribeWithSelector<LoginUserStoreState>((set, get) => ({
    authInfo: undefined,
    setAuthInfo: (auth?: AuthInfo) => {
      set({ authInfo: auth })

      if (auth) {
        const { refreshQuota } = get()
        refreshQuota()
      }
    },
    login: async (type: LoginType) => {
      await encooAuthService.login(type)
    },
    logout: async () => {
      await encooAuthService.logout()
      const { setAuthInfo } = get()
      setAuthInfo(undefined)
    },
    init: async () => {
      const token = await encooAuthService.getToken()

      const { setAuthInfo } = get()
      setAuthInfo(token)
    },
    refreshQuota: async () => {
      const { refresh } = useChatQuotaStore.getState()
      refresh()
    },
  }))
)

const init = useLoginUserStore.getState().init
init()

encooAuthService.onAuthStatusChange.addListener((info) => {
  init()

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(function (registration) {
      registration.active?.postMessage({
        type: 'refreshAuth',
      })
    })
  }
})

// window.navigator.serviceWorker.addEventListener(
//   "message",
//   (event: MessageEvent) => {
//     const data = event.data as ServerWorkerMessage;
//     if (data.type === "refreshAuth") {
//       init();
//     }
//   }
// );
