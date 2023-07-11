import { HttpClientBase } from "@/apis/shared";
import { wait } from "@/utils/timer";

export type PdfSessionState = "Ready" | "failure";

export interface PdfSession {
  id: string;
  createAt: string;
  sessionState: PdfSessionState;
  progress: number;
}

export interface PdfQueryResult {
  pageContent: string;
  pageId: number;
  relevence: number;
}

export interface PdfQueryResults {
  pdfQueryResults: PdfQueryResult[];
  createAt: string;
  sessionId: string;
}

interface CreatePdfChatUntilReadyCallBackInfo {
  success: boolean;
  session?: PdfSession;
  error?: unknown;
}

export class EncooBeePdfHttpClient extends HttpClientBase {
  public async createPdfChat(id: string, url: string): Promise<PdfSession> {
    const { data } = await this.request<PdfSession>({
      url: `/poster/api/pdfChat`,
      method: "POST",
      data: { pdfUrl: url, pdfIdentifier: id },
    });

    return data;
  }

  public async createPdfChatUntilReady(
    id: string,
    url: string,
    callback?: (session: CreatePdfChatUntilReadyCallBackInfo) => void
  ): Promise<PdfSession> {
    // callback?.({
    //   success: true,
    //   session: {
    //     sessionId: "1",
    //     createAt: "1",
    //     sessionState: "Ready",
    //     percent: 1,
    //   },
    // });

    // return {
    //   sessionId: "1",
    //   createAt: "1",
    //   sessionState: "Ready",
    //   percent: 1,
    // };
    try {
      let session = await this.createPdfChat(id, url);
      callback?.({ success: true, session });
      let count = 0;
      while (
        session.progress !== 100 &&
        !session.sessionState.startsWith("failure") &&
        count < 120
      ) {
        await wait(1000);
        session = await this.querySessionState(session.id);
        count++;
        if (session.sessionState.startsWith("failure")) {
          callback?.({
            success: false,
            error: new Error("failure."),
          });
        } else {
          callback?.({ success: true, session });
        }
      }

      return session;
    } catch (error) {
      callback?.({
        success: false,
        error,
      });
      throw error;
    }
  }

  public async querySessionState(sessionId: string) {
    const { data } = await this.request<PdfSession>({
      url: `/poster/api/pdfChat/${sessionId}`,
      method: "GET",
    });

    return data;
  }

  public async queryPdfChat(
    id: string,
    sessionId: string,
    pdfUrl: string,
    query: string
  ): Promise<PdfQueryResults> {
    const { data } = await this.request<PdfQueryResults>({
      url: `/poster/api/pdfChat/query`,
      method: "POST",
      data: {
        sessionId,
        pdfIdentifier: id,
        pdfUrl,
        queryString: query,
        minRelevanceScore: 0.5,
        maxPagesReturned: 3,
      },
    });

    return data;
  }
}
