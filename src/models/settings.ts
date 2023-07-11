export interface BeezySettingsFloatButton {
  globalDisable?: boolean;
  disableUrls?: string[];
}

export type BeezySettingsMiniViewMode = "left" | "right";

export interface BeezySettingsMiniView {
  mode?: BeezySettingsMiniViewMode;
}

export interface BeezySettings {
  floatButton?: BeezySettingsFloatButton;
  miniView?: BeezySettingsMiniView;
}
