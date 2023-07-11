import { HttpClientBase } from "@/apis/shared";
import { isWebUrl } from "@/utils/url";
import axios, { Method } from "axios";

export type EncooFileUploadPartResponseDataFromType = "Header";

export type EncooFileUploadState =
  | "Preparing"
  | "Uploading"
  | "Compositing"
  | "Completed"
  | "Failed";

export interface EncooFileUploadCallbackInfo {
  state: EncooFileUploadState;
  totalSize: number;
  percent: number;
  id?: string;
  url?: string;
}

export interface EncooFileUploadPartResponseData {
  name: string;
  fromType: EncooFileUploadPartResponseDataFromType;
  fromValue: string;
}

export interface EncooFileUploadPartContent {
  startPos: number;
  length: number;
  partNumber: number;
}

export interface EncooFileUploadUri {
  uri: string;
  headers?: Record<string, string>;
  type: string;
  verb: Method;
  partContent: EncooFileUploadPartContent;
  combineContent?: string;
  combineByConsoleContent?: Record<string, string>;
  partResponseDatas?: EncooFileUploadPartResponseData[];
}

export interface PreloadedFile {
  id: string;
  multiparts: boolean;
  multiUploadUri?: EncooFileUploadUri[];
  lastVersion: string;
}

export class EncooBeeFileHttpClient extends HttpClientBase {
  private async createPreloadedUri(
    fileName: string,
    fileSize: number,
    contentType: string
  ): Promise<PreloadedFile> {
    const { data } = await this.request<PreloadedFile>({
      url: `/honeybee/FileUpload`,
      method: "POST",
      data: { fileSize, fileName, contentType },
    });

    return data;
  }

  public async getFileUrl(id: string): Promise<string> {
    const { data } = await this.request<{ url: string }>({
      url: `/honeybee/FileUpload/${id}/downloaduri`,
      method: "GET",
    });

    return data.url;
  }

  private async uploadComplete(id: string): Promise<string> {
    const { data } = await this.request<{ url: string }>({
      url: `/honeybee/FileUpload/${id}`,
      method: "PATCH",
    });

    return data.url;
  }

  public async uploadFile(
    file: File,
    processCallback?: (info: EncooFileUploadCallbackInfo) => void
  ) {
    const totalSize = file.size;
    const fileName = file.name;
    await processCallback?.({
      state: "Preparing",
      percent: 0,
      totalSize,
    });

    try {
      const preloadedVersionFile = await this.createPreloadedUri(
        fileName,
        file.size,
        "application/pdf" // todo 先写死
      );
      const id = preloadedVersionFile.id;
      const uploadUris = preloadedVersionFile.multiUploadUri;

      const partUris =
        uploadUris?.filter(
          (uri) => uri.type === "MultiPart" || uri.type === "SingleFile"
        ) ?? [];
      const combineUri = uploadUris?.find(
        (uri) => uri.type === "CombineByConsole" || uri.type === "Combine"
      );

      await processCallback?.({
        state: "Uploading",
        percent: 0,
        totalSize,
      });

      let uploadCompleteCount = 0;

      const partResponseDatas: Record<string, string>[] = await Promise.all(
        partUris.map(async (uri) => {
          const response = await axios({
            method: uri.verb,
            headers: uri.headers,
            url: uri.uri,

            data:
              uri.type === "SingleFile"
                ? file
                : file.slice(
                    uri.partContent.startPos - 1,
                    uri.partContent.startPos - 1 + uri.partContent.length
                  ),
          });
          const partData: Record<string, string> = {};
          uri.partResponseDatas?.forEach((data) => {
            if (data.fromType === "Header") {
              partData[data.name] =
                response.headers[data.fromValue] ??
                response.headers[data.fromValue.toLocaleLowerCase()];
            }
          });

          uploadCompleteCount++;

          processCallback?.({
            state: "Uploading",
            percent: uploadCompleteCount / partUris.length,
            totalSize,
          });

          return partData;
        })
      );

      await processCallback?.({
        state: "Compositing",
        percent: 1,
        totalSize,
      });

      if (combineUri) {
        let data: Record<string, unknown> | string | undefined = {};

        if (combineUri.type === "Combine") {
          data = combineUri.combineContent;
        } else {
          let combineByConsoleContent = combineUri.combineByConsoleContent;
          partResponseDatas.forEach((data) => {
            combineByConsoleContent = { ...combineByConsoleContent, ...data };
          });
          data = combineByConsoleContent;
        }
        const baseURL = await this.options.getBaseUrl();
        const url = isWebUrl(combineUri.uri)
          ? combineUri.uri
          : `${baseURL}/${combineUri.uri}`;
        if (combineUri.type === "Combine") {
          await axios({
            method: combineUri.verb,
            headers: combineUri.headers,
            url,
            data,
          });
        } else {
          await this.request({
            url,
            data,
            method: combineUri.verb,
            headers: {
              "content-type":
                combineUri?.headers?.contentType ?? "application/json",
            },
          });
        }
      }

      const url = await this.uploadComplete(id);

      await processCallback?.({
        state: "Completed",
        percent: 1,
        totalSize,
        url,
        id,
      });
    } catch (e) {
      await processCallback?.({
        state: "Failed",
        percent: 0,
        totalSize,
      });

      throw e;
    }
  }
}
