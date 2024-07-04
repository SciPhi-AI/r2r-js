<p align="left">
  <a href="https://r2r-docs.sciphi.ai"><img src="https://img.shields.io/badge/docs.sciphi.ai-3F16E4" alt="Docs"></a>
  <a href="https://discord.gg/p6KqD2kjtB"><img src="https://img.shields.io/discord/1120774652915105934?style=social&logo=discord" alt="Discord"></a>
  <a href="https://github.com/SciPhi-AI/R2R"><img src="https://img.shields.io/github/stars/SciPhi-AI/R2R" alt="Github Stars"></a>
  <a href="https://github.com/SciPhi-AI/R2R/pulse"><img src="https://img.shields.io/github/commit-activity/w/SciPhi-AI/R2R" alt="Commits-per-week"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-purple.svg" alt="License: MIT"></a>
  <a href="https://www.npmjs.com/package/r2r-js"><img src="https://img.shields.io/npm/v/r2r-js.svg" alt="npm version"></a>
</p>

<img src="https://raw.githubusercontent.com/SciPhi-AI/R2R/main/assets/r2r.png" alt="R2R JavaScript Client">
<h3 align="center">
The ultimate open source RAG answer engine - JavaScript Client
</h3>

# About

The official JavaScript client for R2R (Retrieval-Augmented Generation to Riches). R2R is designed to bridge the gap between local LLM experimentation and scalable, production-ready Retrieval-Augmented Generation (RAG). This JavaScript client provides a seamless interface to interact with the R2R RESTful API.

For a more complete view of R2R, check out the [full documentation](https://r2r-docs.sciphi.ai/).

## Key Features

- **📁 Multimodal Support**: Ingest files ranging from `.txt`, `.pdf`, `.json` to `.png`, `.mp3`, and more.
- **🔍 Hybrid Search**: Combine semantic and keyword search with reciprocal rank fusion for enhanced relevancy.
- **🔗 Graph RAG**: Automatically extract relationships and build knowledge graphs.
- **🗂️ App Management**: Efficiently manage documents and users with rich observability and analytics.
- **🌐 Client-Server**: RESTful API support out of the box.
- **🧩 Configurable**: Provision your application using intuitive configuration files.
- **🔌 Extensible**: Develop your application further with easy builder + factory pattern.
- **🖥️ Dashboard**: Use the [R2R Dashboard](https://github.com/SciPhi-AI/R2R-Dashboard), an open-source React+Next.js app for a user-friendly interaction with R2R.

## Table of Contents

1. [Install](#install)
2. [R2R JavaScript Client Quickstart](#r2r-javascript-client-quickstart)
3. [Community and Support](#community-and-support)
4. [Contributing](#contributing)

# Install

```bash
npm install r2r-js
```

# R2R JavaScript Client Quickstart

## Initialize the R2R client

```javascript
const { r2rClient } = require("r2r-js");

const client = new r2rClient("http://localhost:8000");
```

## Ingest files

```javascript
const files = [
  { path: "examples/data/raskolnikov.txt", name: "raskolnikov.txt" },
  { path: "examples/data/karamozov.txt", name: "karamozov.txt" },
];

const ingestResult = await client.ingestFiles(files, {
  metadatas: [{ title: "raskolnikov.txt" }, { title: "karamozov.txt" }],
  user_ids: [
    "123e4567-e89b-12d3-a456-426614174000",
    "123e4567-e89b-12d3-a456-426614174000",
  ],
  skip_document_info: false,
});
console.log(ingestResult);
```

## Perform a search

```javascript
const searchResult = await client.search("Who was Raskolnikov?");
console.log(searchResult);
```

## Perform RAG

```javascript
const ragResult = await client.rag({
  query: "Who was Raskolnikov?",
  use_vector_search: true,
  search_filters: {},
  search_limit: 10,
  do_hybrid_search: false,
  use_kg_search: false,
  kg_generation_config: {},
  rag_generation_config: {
    model: "gpt-4o",
    temperature: 0.0,
    stream: false,
  },
});
console.log(ragResult);
```

## Stream a RAG Response

```javascript
const streamingRagResult = await client.rag({
  query: "Who was Raskolnikov?",
  rag_generation_config: {
    stream: true,
  },
});

if (streamingRagResult instanceof ReadableStream) {
  const reader = streamingRagResult.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    console.log(new TextDecoder().decode(value));
  }
}
```

# Hello r2r-js

Building with the R2R JavaScript client is easy - see the `hello_r2r` example below:

```javascript
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
```

And the results:

```bash
Ingesting file...
Ingest result: {
  "results": {
    "processed_documents": [
      "File 'raskolnikov.txt' processed successfully."
    ],
    "failed_documents": [],
    "skipped_documents": []
  }
}
Performing RAG...
Search Results:

Result 1:
Text: praeterire culinam eius, cuius ianua semper aperta erat, cogebatur. Et quoties praeteribat,
iuvenis ...
Score: 0.08281802143835804

Result 2:
Text: In vespera praecipue calida ineunte Iulio iuvenis e cenaculo in quo hospitabatur in
S. loco exiit et...
Score: 0.052743945852283036

Completion:
The file discusses the experiences of a young man who is burdened by debt and is staying in a small room in a tall house. He feels anxious and ashamed whenever he passes by the kitchen, where the door is always open, and he is particularly worried about encountering his landlady, who provides him with meals and services. The young man tries to avoid meeting her, especially when he leaves his room, which is more like a closet than a proper room [1], [2].
```

# Community and Support

- [Discord](https://discord.gg/p6KqD2kjtB): Chat live with maintainers and community members
- [Github Issues](https://github.com/SciPhi-AI/R2R-js/issues): Report bugs and request features

**Explore our [R2R Docs](https://r2r-docs.sciphi.ai/) for tutorials and cookbooks on various R2R features and integrations.**

# Contributing

We welcome contributions of all sizes! Here's how you can help:

- Open a PR for new features, improvements, or better documentation.
- Submit a [feature request](https://github.com/SciPhi-AI/R2R-js/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=) or [bug report](https://github.com/SciPhi-AI/R2R-js/issues/new?assignees=&labels=&projects=&template=bug_report.md&title=)

### Our Contributors

<a href="https://github.com/SciPhi-AI/R2R/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=SciPhi-AI/R2R" />
</a>
