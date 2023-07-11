import { HttpClientBase } from "@/apis/shared";
import { OpenAIChannelEnum } from "@/models/channel";
import { ConversationMessageExtensionEnum } from "@/models/chat";
import { BeeErrorCode, createBeeError } from "@/utils/error";

export interface OpenAICompletionsResponseChoice {
  text: string;
  index: number;
  logprobs?: string | null;
  finish_reason?: string | null;
}

export interface OpenAICompletionsResponse {
  id: string;
  object: string;
  created: number;
  choices: OpenAICompletionsResponseChoice[];
  model: "text-davinci-003";
}

export interface OpenAICompletionsErrorResponse {
  message: string;
  type: "server_error";
  param: null;
  code: null;
}

export enum OpenAICompletionRequestMessageRoleEnum {
  System = "system",
  User = "user",
  Assistant = "assistant",
}

export interface OpenAICompletionRequestMessage {
  role: OpenAICompletionRequestMessageRoleEnum;
  content: string;
  transform?: {
    type: string;
    payload?: unknown;
  };
}

function parseOpenAIValue(value: string): OpenAICompletionsResponse[] {
  return value
    .split("\n\n")
    .map((item) => {
      let v = item;

      if (v.charAt(v.length - 1) === "\n") {
        v = v.substring(0, v.length - 1);
      }
      v = v.replace("data: ", "");

      try {
        if (!v) {
          return undefined;
        }
        const o = JSON.parse(v) as OpenAICompletionsResponse;

        return {
          ...o,
          choices: o.choices.map((ch: { text: string }) => ({
            ...ch,
            text: ch.text,
          })),
        };
      } catch (error) {
        return undefined;
      }
    })
    .filter(Boolean) as OpenAICompletionsResponse[];
}

export class EncooBeeChatStreamClient extends HttpClientBase {
  public async sendMessage(payload: {
    prompt: OpenAICompletionRequestMessage[];
    channel?: OpenAIChannelEnum;
    extensions?: ConversationMessageExtensionEnum[];
    willBegin?: () => void; // 权限判断成功后，开始前
    onRead: (text: string) => void | Promise<void>;
    onDone: () => void | Promise<void>;
    onError: (error: unknown) => void | Promise<void>;
  }) {
    const { prompt, extensions, channel, willBegin, onRead, onDone, onError } =
      payload;
    try {
      const token = await this.options.getAccessToken(); // (await Browser.storage.local.get("_token"))["_token"];

      if (!token) {
        onError(createBeeError(BeeErrorCode.NoAuth, "Not login."));
        return;
      }
      const baseURL = (await this.options.getBaseUrl())[token.nation];

      willBegin?.();

      const response = await fetch(`${baseURL}/chat/promptbystreamingv2`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${token?.token}`,
        },
        body: JSON.stringify({
          extensions,
          messages: prompt,
          channel: channel === OpenAIChannelEnum.gpt3 ? undefined : channel,
        }),
      });

      if (response.status !== 200) {
        const text = await response.text();

        const errorResp: OpenAICompletionsErrorResponse = JSON.parse(text);

        onError(new Error(errorResp?.message ?? "An error occurred. "));
        return;
      }

      const reader = response.body
        ?.pipeThrough(new TextDecoderStream())
        ?.getReader();

      while (reader) {
        const { value, done } = await reader.read();
        if (value) {
          const results = parseOpenAIValue(value);

          let text = "";
          for (const result of results) {
            text += result.choices?.[0].text ?? "";
          }

          await onRead(text);
        }

        if (done) {
          await onDone();
          break;
        }
      }
    } catch (error) {
      await onError(error);
    }
  }
}
