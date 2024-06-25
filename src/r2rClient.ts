import axios, { AxiosInstance } from "axios";
import FormData from "form-data";
import posthog from "posthog-js";
import { Readable } from "stream";
import fs from "fs";

import { feature } from "./feature";
import {
  R2RUpdatePromptRequest,
  R2RIngestDocumentsRequest,
  R2RIngestFilesRequest,
  R2RUpdateDocumentsRequest,
  R2RSearchRequest,
  R2RRAGRequest,
  R2RDeleteRequest,
  R2RAnalyticsRequest,
  R2RUpdateFilesRequest,
  R2RUsersOverviewRequest,
  R2RDocumentsOverviewRequest,
  R2RDocumentChunksRequest,
  R2RLogsRequest,
  FilterCriteria,
  AnalysisTypes,
  VectorSearchSettings,
  KGSearchSettings,
  GenerationConfig,
} from "./models";

export class r2rClient {
  private axiosInstance: AxiosInstance;
  private baseUrl: string;

  constructor(baseURL: string, prefix: string = "/v1") {
    this.baseUrl = `${baseURL}${prefix}`;
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
      transformRequest: [
        (data) => {
          if (typeof data === "string") {
            return data;
          }
          return JSON.stringify(data);
        },
      ],
    });
  }

  async healthCheck(): Promise<any> {
    const response = await this.axiosInstance.get("/health");
    return response.data;
  }

  @feature("updatePrompt")
  async updatePrompt(request: R2RUpdatePromptRequest): Promise<any> {
    const response = await this.axiosInstance.post("/update_prompt", request);
    return response.data;
  }

  @feature("ingestDocuments")
  async ingestDocuments(request: R2RIngestDocumentsRequest): Promise<any> {
    const response = await this.axiosInstance.post(
      "/ingest_documents",
      request,
    );
    return response.data;
  }

  @feature("ingestFiles")
  async ingestFiles(
    files: (File | { path: string; name: string })[],
    options: {
      metadatas?: Record<string, any>[];
      document_ids?: string[];
      user_ids?: (string | null)[];
      versions?: string[];
      skip_document_info?: boolean;
    } = {},
  ): Promise<any> {
    const formData = new FormData();

    files.forEach((file, index) => {
      if ("path" in file) {
        formData.append("files", fs.createReadStream(file.path), file.name);
      } else {
        formData.append("files", file);
      }
    });

    if (options.metadatas) {
      formData.append("metadatas", JSON.stringify(options.metadatas));
    }
    if (options.document_ids) {
      formData.append("document_ids", JSON.stringify(options.document_ids));
    }
    if (options.user_ids) {
      formData.append("user_ids", JSON.stringify(options.user_ids));
    }
    if (options.versions) {
      formData.append("versions", JSON.stringify(options.versions));
    }
    if (options.skip_document_info !== undefined) {
      formData.append(
        "skip_document_info",
        JSON.stringify(options.skip_document_info),
      );
    }

    const response = await this.axiosInstance.post("/ingest_files", formData, {
      headers: {
        ...formData.getHeaders(),
        "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`,
      },
    });

    return response.data;
  }

  @feature("updateDocuments")
  async updateDocuments(request: R2RUpdateDocumentsRequest): Promise<any> {
    const response = await this.axiosInstance.post(
      "/update_documents",
      request,
    );
    return response.data;
  }

  @feature("updateFiles")
  async updateFiles(
    files: (File | { path: string; name: string })[],
    options: {
      document_ids: string[];
      metadatas?: Record<string, any>[];
    },
  ): Promise<any> {
    const request: R2RUpdateFilesRequest = {
      document_ids: options.document_ids,
      metadatas: options.metadatas || [],
    };

    const formData = new FormData();

    files.forEach((file, index) => {
      if ("path" in file) {
        // It's a file path object (for Node.js)
        formData.append(`file${index}`, Readable.from([]), file.name);
      } else {
        // It's a File object (for browser)
        formData.append(`file${index}`, file);
      }
    });

    // Append request data to formData
    Object.entries(request).forEach(([key, value]) => {
      if (value !== undefined && value.length > 0) {
        formData.append(key, JSON.stringify(value));
      }
    });

    const response = await this.axiosInstance.post("/update_files", formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    return response.data;
  }

  @feature("search")
  async search(
    query: string,
    use_vector_search?: boolean,
    search_filters?: Record<string, any>,
    search_limit?: number,
    do_hybrid_search?: boolean,
    use_kg_sarch?: boolean,
    kg_agent_generation_config?: GenerationConfig,
  ): Promise<any> {
    const vector_search_settings: VectorSearchSettings = {
      use_vector_search: use_vector_search || true,
      search_filters: search_filters || {},
      search_limit: search_limit || 10,
      do_hybrid_search: do_hybrid_search || false,
    };

    const kg_search_settings: KGSearchSettings = {
      use_kg: use_kg_sarch || false,
      agent_generation_config: kg_agent_generation_config || null,
    };

    const request: R2RSearchRequest = {
      query,
      vector_search_settings,
      kg_search_settings,
    };

    const response = await this.axiosInstance.post("/search", request);
    return response.data;
  }

  @feature("rag")
  async rag(
    query: string,
    use_vector_search?: boolean,
    search_filters?: Record<string, any>,
    search_limit?: number,
    do_hybrid_search?: boolean,
    use_kg_sarch?: boolean,
    kg_agent_generation_config?: GenerationConfig,
    rag_generation_config?: GenerationConfig,
  ): Promise<any> {
    const vector_search_settings: VectorSearchSettings = {
      use_vector_search: use_vector_search || true,
      search_filters: search_filters || {},
      search_limit: search_limit || 10,
      do_hybrid_search: do_hybrid_search || false,
    };

    const kg_search_settings: KGSearchSettings = {
      use_kg: use_kg_sarch || false,
      agent_generation_config: kg_agent_generation_config || null,
    };

    const request: R2RRAGRequest = {
      query,
      vector_search_settings,
      kg_search_settings,
      rag_generation_config,
    };

    if (request.rag_generation_config?.stream) {
      return this.streamRag(request);
    } else {
      const response = await this.axiosInstance.post(
        "/rag",
        JSON.stringify(request),
      );
      return response.data;
    }
  }

  @feature("streamingRag")
  private async streamRag(request: R2RRAGRequest): Promise<any> {
    const response = await this.axiosInstance.post(
      "/rag",
      JSON.stringify(request),
      {
        responseType: "stream",
      },
    );
    return response.data;
  }

  @feature("delete")
  async delete(keys: string[], values: any[]): Promise<any> {
    const request: R2RDeleteRequest = {
      keys,
      values,
    };

    const response = await this.axiosInstance({
      method: "delete",
      url: "/delete",
      data: {
        keys: request.keys,
        values: request.values,
      },
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  }

  @feature("logs")
  async logs(
    log_type_filter?: string,
    max_runs_requested: number = 100,
  ): Promise<any> {
    const request: R2RLogsRequest = {
      max_runs_requested,
      ...(log_type_filter !== undefined && { log_type_filter }),
    };

    const response = await this.axiosInstance.post("/logs", request, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }

  @feature("appSettings")
  async appSettings(): Promise<any> {
    const response = await this.axiosInstance.get("/app_settings");
    return response.data;
  }

  @feature("analytics")
  async analytics(
    filter_criteria: FilterCriteria,
    analysis_types: AnalysisTypes,
  ): Promise<any> {
    const request: R2RAnalyticsRequest = {
      filter_criteria,
      analysis_types,
    };

    const response = await this.axiosInstance.post("/analytics", request, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }

  @feature("usersOverview")
  async usersOverview(user_ids?: string[]): Promise<any> {
    const request: R2RUsersOverviewRequest =
      user_ids && user_ids.length > 0 ? { user_ids } : {};

    const response = await this.axiosInstance.post("/users_overview", request, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }

  @feature("documentsOverview")
  async documentsOverview(
    document_ids?: string[],
    user_ids?: string[],
  ): Promise<any> {
    const request: R2RDocumentsOverviewRequest = {
      ...(document_ids && document_ids.length > 0 && { document_ids }),
      ...(user_ids && user_ids.length > 0 && { user_ids }),
    };

    const response = await this.axiosInstance.post(
      "/documents_overview",
      request,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  }

  @feature("documentChunks")
  async documentChunks(document_id: string): Promise<any> {
    const request: R2RDocumentChunksRequest = {
      document_id,
    };

    const response = await this.axiosInstance.post(
      "/document_chunks",
      request,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    posthog.capture("TSClient", { requestType: "documentChunks success" });
    return response.data;
  }
}

export default r2rClient;
