import { r2rClient } from "../src/index";
import { FilterCriteria, AnalysisTypes } from "../src/models";
const fs = require("fs");

const baseUrl = "http://localhost:8000";

describe("r2rClient Integration Tests", () => {
  let client: r2rClient;

  beforeAll(async () => {
    client = new r2rClient(baseUrl);
  });

  test("Health check", async () => {
    await expect(client.healthCheck()).resolves.not.toThrow();
  });

  test("Ingest file", async () => {
    const files = [
      { path: "examples/data/raskolnikov.txt", name: "raskolnikov.txt" },
    ];

    await expect(
      client.ingestFiles(files, {
        metadatas: [{ title: "raskolnikov.txt" }, { title: "karamozov.txt" }],
        user_ids: ["123e4567-e89b-12d3-a456-426614174000"],
        skip_document_info: false,
      }),
    ).resolves.not.toThrow();
  });

  test("Ingest files in folder", async () => {
    const files = ["examples/data/folder"];

    await expect(client.ingestFiles(files)).resolves.not.toThrow();
  });

  test("Update files", async () => {
    const updated_file = [
      { path: "examples/data/folder/myshkin.txt", name: "myshkin.txt" },
    ];
    await expect(
      client.updateFiles(updated_file, {
        document_ids: ["48e29904-3010-54fe-abe5-a4f3fba59110"],
        metadatas: [{ title: "updated_karamozov.txt" }],
      }),
    ).resolves.not.toThrow();
  });

  test("Search documents", async () => {
    await expect(client.search("test")).resolves.not.toThrow();
  });

  test("Generate RAG response", async () => {
    await expect(client.rag({ query: "test" })).resolves.not.toThrow();
  });

  test("Delete document", async () => {
    await expect(
      client.delete(["document_id"], ["153a0857-efc4-57dd-b629-1c7d58c24a93"]),
    ).resolves.not.toThrow();
  });

  test("Get logs", async () => {
    await expect(client.logs()).resolves.not.toThrow();
  });

  test("Get app settings", async () => {
    await expect(client.appSettings()).resolves.not.toThrow();
  });

  test("Get analytics", async () => {
    const filterCriteria: FilterCriteria = {
      filters: {
        search_latencies: "search_latency",
      },
    };

    const analysisTypes: AnalysisTypes = {
      analysis_types: {
        search_latencies: ["basic_statistics", "search_latency"],
      },
    };

    await expect(
      client.analytics(filterCriteria, analysisTypes),
    ).resolves.not.toThrow();
  });

  test("Get users overview", async () => {
    await expect(client.usersOverview()).resolves.not.toThrow();
  });

  test("Get documents overview", async () => {
    await expect(client.documentsOverview()).resolves.not.toThrow();
  });

  test("Get document chunks", async () => {
    await expect(
      client.documentChunks("48e29904-3010-54fe-abe5-a4f3fba59110"),
    ).resolves.not.toThrow();
  });

  afterAll(async () => {
    // Clean up
    await client.delete(
      ["document_id", "document_id"],
      [
        "48e29904-3010-54fe-abe5-a4f3fba59110",
        "102e815f-3998-5373-8d7d-a07795266ed6",
      ],
    );
  });
});
