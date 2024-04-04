import axios, { AxiosResponse } from 'axios';
import FormData from 'form-data';
import fs from 'fs';

class R2RClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async uploadAndProcessFile(
    documentId: string,
    filePath: string,
    metadata: Record<string, any> = {},
    settings: Record<string, any> = {}
  ): Promise<any> {
    const url = `${this.baseUrl}/upload_and_process_file/`;
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    formData.append('document_id', documentId);
    formData.append('metadata', JSON.stringify(metadata));
    formData.append('settings', JSON.stringify(settings));

    const response: AxiosResponse = await axios.post(url, formData, {
      headers: formData.getHeaders(),
    });
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
    limit: number = 10,
    filters: Record<string, any> = {},
    settings: Record<string, any> = {}
  ): Promise<any> {
    const url = `${this.baseUrl}/search/`;
    const data = {
      query,
      filters,
      limit,
      settings,
    };
    const response: AxiosResponse = await axios.post(url, data);
    return response.data;
  }

  async ragCompletion(
    query: string,
    limit: number = 10,
    filters: Record<string, any> = {},
    settings: Record<string, any> = {},
    generationConfig: Record<string, any> = {}
  ): Promise<any> {
    const url = `${this.baseUrl}/rag_completion/`;
    const data = {
      query,
      filters,
      limit,
      settings,
      generation_config: generationConfig,
    };
    const response: AxiosResponse = await axios.post(url, data);
    return response.data;
  }

  async eval(
    query: string,
    context: string,
    completionText: string,
    runId: string,
    settings: Record<string, any> = {}
  ): Promise<any> {
    const url = `${this.baseUrl}/eval/`;
    const data = {
      query,
      context,
      completion_text: completionText,
      run_id: runId,
      settings,
    };
    const response: AxiosResponse = await axios.post(url, data);
    return response.data;
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
}

export default R2RClient;