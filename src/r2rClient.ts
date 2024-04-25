import axios, { AxiosResponse } from 'axios';
import FormData from 'form-data';

export class R2RClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  
  async uploadFile(
    documentId: string,
    fileOrPath: File | string,
    metadata: Record<string, any> = {},
    settings: Record<string, any> = {}
  ): Promise<any> {
    const url = `${this.baseUrl}/upload_and_process_file/`;
    const formData = new FormData();
  
    if (typeof fileOrPath === 'string') {
      // Node.js environment
      if (typeof window === 'undefined') {
        // Check if running in a Node.js environment
        const fs = require('fs');
        formData.append('file', fs.createReadStream(fileOrPath));
      } else {
        throw new Error('Uploading a file path is not supported in web browsers.');
      }
    } else {
      // Web application environment
      formData.append('file', fileOrPath);
    }

    formData.append('document_id', documentId);
    formData.append('metadata', JSON.stringify(metadata));
    formData.append('settings', JSON.stringify(settings));
  
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
  
    const response: AxiosResponse = await axios.post(url, formData, config);
    return response.data;
  }

  async addEntry(
    documentId: string,
    blobs: Record<string, string>,
    metadata: Record<string, any> = {},
    doUpsert: boolean = false,
    settings: Record<string, any> = {}
  ): Promise<any> {
    const url = `${this.baseUrl}/add_entry/`;
    const data = {
      entry: {
        document_id: documentId,
        blobs,
        metadata,
      },
      settings: settings || { embedding_settings: { do_upsert: doUpsert } },
    };
    const response: AxiosResponse = await axios.post(url, data);
    return response.data;
  }

  async addEntries(
    entries: Record<string, any>[],
    doUpsert: boolean = false,
    settings: Record<string, any> = {}
  ): Promise<any> {
    const url = `${this.baseUrl}/add_entries/`;
    const data = {
      entries,
      settings: settings || { embedding_settings: { do_upsert: doUpsert } },
    };
    const response: AxiosResponse = await axios.post(url, data);
    return response.data;
  }

  async search(
    query: string,
    searchLimit: number = 25,
    rerankLimit: number = 15,
    filters: Record<string, any> = {},
    settings: Record<string, any> = {}
  ): Promise<any> {
    const url = `${this.baseUrl}/search/`;
    const data = {
      message: query,
      filters,
      search_limit: searchLimit,
      rerank_limit: rerankLimit,
      settings,
    };
    const response: AxiosResponse = await axios.post(url, data);
    return response.data;
  }

  async ragCompletion(
    message: string,
    searchLimit: number = 25,
    rerankLimit: number = 15,
    filters: Record<string, any> = {},
    settings: Record<string, any> = {},
    generationConfig: Record<string, any> = {}
  ): Promise<any> {
    const stream = generationConfig.stream || false;

    if (stream) {
      throw new Error("To stream, use the `streamRagCompletion` method.");
    }

    const url = `${this.baseUrl}/rag_completion/`;
    const data = {
      message,
      filters,
      search_limit: searchLimit,
      rerank_limit: rerankLimit,
      settings,
      generation_config: generationConfig,
    };
    const response: AxiosResponse = await axios.post(url, data);
    return response.data;
  }

  async eval(
    message: string,
    context: string,
    completionText: string,
    runId: string,
    settings: Record<string, any> = {}
  ): Promise<any> {
    const url = `${this.baseUrl}/eval/`;
    const data = {
      message,
      context,
      completion_text: completionText,
      run_id: runId,
      settings,
    };
    const response: AxiosResponse = await axios.post(url, data);
    return response.data;
  }

  async streamRagCompletion(
    message: string,
    searchLimit: number = 25,
    rerankLimit: number = 15,
    filters: Record<string, any> = {},
    settings: Record<string, any> = {},
    generationConfig: Record<string, any> = {}
  ): Promise<void> {
    const stream = generationConfig.stream || false;
    if (!stream) {
      throw new Error("`streamRagCompletion` method is only for streaming.");
    }

    const url = `${this.baseUrl}/rag_completion/`;
    const data = {
      message,
      filters,
      search_limit: searchLimit,
      rerank_limit: rerankLimit,
      settings,
      generation_config: generationConfig,
    };

    const headers = {
      accept: "application/json",
      "Content-Type": "application/json",
    };

    await this.streamingRequest(url, data, (chunk) => {
      // Handle the streaming response chunk
      console.log(chunk);
    });
  }

  async filteredDeletion(key: string, value: boolean | number | string): Promise<any> {
    const url = `${this.baseUrl}/filtered_deletion/`;
    const response: AxiosResponse = await axios.delete(url, {
      params: { key, value },
    });
    return response.data;
  }

  async getLogs(): Promise<any> {
    const url = `${this.baseUrl}/logs`;
    const response: AxiosResponse = await axios.get(url);
    return response.data;
  }

  async getLogsSummary(): Promise<any> {
    const url = `${this.baseUrl}/logs_summary`;
    const response: AxiosResponse = await axios.get(url);
    return response.data;
  }

  async getUserIds(): Promise<any> {
    const url = `${this.baseUrl}/get_user_ids/`;
    const response: AxiosResponse = await axios.get(url);
    return response.data;
  }

  async getUserDocuments(userId: string): Promise<any> {
    const url = `${this.baseUrl}/get_user_documents/`;
    const response: AxiosResponse = await axios.get(url, {
      params: { user_id: userId },
    });
    return response.data;
  }

  async streamingRequest(
    endpoint: string,
    data: object,
    onData: (value: string) => void,
    onError?: (status: number) => void
  ): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify(data),
      });
  
      if (response.status !== 200) {
        onError?.(response.status);
        return;
      }
  
      if (!response.body) {
        return;
      }
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
  
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        onData(decoder.decode(value));
      }
    } catch (error) {
      console.error("Error fetching data", error);
      onError?.(500);
    }
  }
}
