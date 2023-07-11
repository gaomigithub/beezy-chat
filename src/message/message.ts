export interface RefreshAuthMessage {
  type: "refreshAuth";
}

export interface RefreshConversionsMessage {
  type: "refreshConversions";
}

export interface ShowLoginMessage {
  type: "showLogin";
}
export interface RefreshQuotaMessage {
  type: "refreshQuota";
}

export interface RefreshChannelMessage {
  type: "refreshChannel";
}

export interface RefreshExtensionMessage {
  type: "refreshExtension";
}

export interface RefreshSettingsMessage {
  type: "refreshSettings";
}

export type ServerWorkerMessage = { requestId: string } & (
  | RefreshAuthMessage
  | RefreshConversionsMessage
  | ShowLoginMessage
  | RefreshQuotaMessage
  | RefreshChannelMessage
  | RefreshExtensionMessage
  | RefreshSettingsMessage
);
