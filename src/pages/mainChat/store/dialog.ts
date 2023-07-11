// import { ServerWorkerMessage } from '@/message/message'
import { createDialogStore } from '@/pages/store/dialog.ts/util'

export const useLoginDialogStore = createDialogStore()
// export const useFollowDialogStore = createDialogStoreState();

// window.navigator.serviceWorker.addEventListener(
//   "message",
//   (event: MessageEvent) => {
//     const data = event.data as ServerWorkerMessage;
//     if (data.type === "showLogin") {
//       const { open } = useLoginDialogStore.getState();
//       open();
//     }
//   }
// );
