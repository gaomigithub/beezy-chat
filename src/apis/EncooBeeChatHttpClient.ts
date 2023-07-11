import { HttpClientBase } from "@/apis/shared";
import { ChatQuota } from "@/models/chat";

export class EncooBeeChatHttpClient extends HttpClientBase {
  public async getChatQuota() {
    const { data } = await this.request<{ data: ChatQuota }>({
      method: "GET",
      url: `/chat/quota`,
    });
    return data.data;
  }

  public async getChatQuota4() {
    const { data } = await this.request<{ data: ChatQuota }>({
      method: "GET",
      url: `/chat/quota/gpt4 `,
    });
    return data.data;
  }

  public async scanText(text: string): Promise<string> {
    const { data } = await this.request<{ filteredContent: string }>({
      method: "POST",
      url: `/chat/textscan`,
      data: { content: text },
    });
    return data.filteredContent;
  }
}
