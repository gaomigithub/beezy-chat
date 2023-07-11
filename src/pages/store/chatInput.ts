import { OpenAICompletionRequestMessageRoleEnum } from "@/apis/EncooBeeChatStreamClient";
import { createConversationMessageMagicTransform } from "@/models/chat";
import { EncooHttpService } from "@/pages/service/EncooHttpService";
import { useLoginUserStore } from "@/pages/store/loginUser";
import { trim, trimStart } from "lodash-es";
import { create } from "zustand";

export interface ChartInputStoreState {
  isMagicSending: boolean;
  text: string;
  setText: (text: string) => void;
  sendMagic: () => Promise<void>;
}

export const useChatInputStore = create<ChartInputStoreState>((set, get) => ({
  isMagicSending: false,
  text: "",
  setText: (text: string) => {
    set({ text });
  },
  sendMagic: async () => {
    const { text } = get();

    if (!text) {
      return;
    }

    set({ isMagicSending: true });

    let read = false;
    EncooHttpService.chatApi.sendMessage({
      prompt: [
        {
          role: OpenAICompletionRequestMessageRoleEnum.User,
          content: text,
          transform: createConversationMessageMagicTransform(),
        },
      ],
      onRead: (message: string) => {
        const { text } = get();
        const msg = message;
        const newText = read ? text + msg : trimStart(msg, "\n");
        read = true;
        set({
          text: newText,
        });
      },
      onDone: () => {
        const { text } = get();
        set({
          text: trim(text, "\n"),
        });
        set({ isMagicSending: false });
        const { refreshQuota } = useLoginUserStore.getState();
        refreshQuota();
      },
      onError: async (error) => {
        // todo error
        set({ isMagicSending: false });
      },
    });
  },
}));
