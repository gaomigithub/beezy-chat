export enum OpenAIChannelEnum {
  "gpt3" = "gpt3",
  "gpt4" = "gpt4",
}

export const OpenAIChannelGpt3Config = {
  title: "GPT 3.5",
  fullName: "ChatGPT 3.5",
  message: {
    background: "#E7F5F2",
    label: "#92D4C5",
    table: {
      th: { background: "#10A37F", border: "58bfa6" },
      tr: {
        evenBackground: "#EFFAF7",
        border: "#B8E4D9",
      },
    },
  },
  quota: {
    background: "rgba(16, 163, 127, 0.05);",
    color: "#10A37F",
    quotaBackground: "rgba(16, 163, 127, 0.1)",
    question: "#82C9B8",
  },
};

type OpenAIChannelItemConfig = typeof OpenAIChannelGpt3Config;

export const OpenAIChannelGpt4Config: OpenAIChannelItemConfig = {
  title: "GPT 4.0",
  fullName: "ChatGPT 4.0",
  message: {
    background: "#E1EBFC",
    label: "#A2C3F9",
    table: {
      th: { background: "#4285F4", border: "58bfa6" },
      tr: {
        evenBackground: "#EDF4FF",
        border: "#DAE8FF",
      },
    },
  },
  quota: {
    background: "rgba(0, 96, 255, 0.05)",
    color: "#2184FF",
    quotaBackground: " rgba(0, 96, 255, 0.1);",
    question: "#94B8F3",
  },
};

export const OpenAIChannelConfig: Record<
  OpenAIChannelEnum,
  OpenAIChannelItemConfig
> = {
  [OpenAIChannelEnum.gpt3]: OpenAIChannelGpt3Config,
  [OpenAIChannelEnum.gpt4]: OpenAIChannelGpt4Config,
};
