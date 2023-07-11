import { PdfQueryResult } from "@/apis/EncooBeePdfHttpClient";
import { OpenAIChannelEnum } from "@/models/channel";

export type ConversationMessageSender = "user" | "robot";
export type ConversationMessageContext =
  | {
      type: "selection";
      content: string;
    }
  | {
      type: "file";
      content: {
        queryResults: PdfQueryResult[];
      };
    };
export enum ConversationMessageExtensionEnum {
  "longText" = "longText",
  "network" = "network",
}
export interface ConversationReplyingMessage {
  id: string;
  conversationId: string;
  message: string;
  channel?: OpenAIChannelEnum;
  extensions?: ConversationMessageExtensionEnum[];
}

export type ConversationMessageTransformType =
  | "magic"
  | "summarize"
  | "translate"
  | "explain"
  | "ask";

export interface ConversationMessageTransform {
  type: ConversationMessageTransformType;
  payload?: unknown;
}

export function createConversationMessageMagicTransform(): ConversationMessageTransform {
  return { type: "magic" };
}

export interface ConversationMessage {
  id: string;
  sender: ConversationMessageSender;
  context?: ConversationMessageContext;
  message: string;
  error?: string;
  channel?: OpenAIChannelEnum;
  createTime: number;
  extensions?: ConversationMessageExtensionEnum[];
  transform?: ConversationMessageTransform;
}

export type ConversationType =
  | { name: "text" }
  | {
      name: "file";
      fileName: string;
      fileId: string;
      sessionId: string;
    };

export interface Conversation {
  id: string;
  title: string;
  createTime: number;
  messages: ConversationMessage[];
  needResend?: boolean;
  type?: ConversationType; // default text
}

export interface ChatQuota {
  max: number;
  used: number;
}
