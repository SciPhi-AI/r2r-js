const { r2rClient } = require("r2r-js");

const client = new r2rClient("http://localhost:8000");

async function main() {
  const files = [
    { path: "examples/data/raskolnikov.txt", name: "raskolnikov.txt" },
  ];

  console.log("Ingesting file...");
  const ingestResult = await client.ingestFiles(files, {
    metadatas: [{ title: "raskolnikov.txt" }],
    user_ids: ["123e4567-e89b-12d3-a456-426614174000"],
    skip_document_info: false,
  });
  console.log("Ingest result:", JSON.stringify(ingestResult, null, 2));

  console.log("Performing RAG...");
  const ragResponse = await client.rag({
    query: "What does the file talk about?",
    rag_generation_config: {
      model: "gpt-4o",
      temperature: 0.0,
      stream: false,
    },
  });

  console.log("Search Results:");
  ragResponse.results.search_results.vector_search_results.forEach(
    (result, index) => {
      console.log(`\nResult ${index + 1}:`);
      console.log(`Text: ${result.metadata.text.substring(0, 100)}...`);
      console.log(`Score: ${result.score}`);
    },
  );

  console.log("\nCompletion:");
  console.log(ragResponse.results.completion.choices[0].message.content);
}

main();
