# R2R JavaScript Client

[![npm version](https://img.shields.io/npm/v/r2r-js.svg)](https://www.npmjs.com/package/r2r-js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This repository contains a JavaScript client for the R2R (RAG to Riches) framework. R2R is a powerful tool for building, deploying, and optimizing RAG (Retrieval-Augmented Generation) systems.

## About R2R

R2R provides a fast and efficient way to deliver high-quality RAG to end-users. The framework is built around customizable pipelines and a feature-rich FastAPI implementation.

Key features of R2R include:

- Instant deployment of production-ready RAG pipelines with streaming capabilities
- Customizable pipelines with intuitive configuration files
- Extensibility with custom code integrations
- Autoscaling capabilities in the cloud using SciPhi
- Open-source framework developed by the community to simplify RAG deployment

For more information about R2R, please refer to the [R2R documentation](https://r2r-docs.sciphi.ai).

## Installation

To install the R2R JavaScript client, run the following command:

```
npm install r2r-js
```

## Usage

Here's a basic example of how to use the R2R JavaScript client:

```javascript
import { R2RClient } from "r2r-js";

const baseUrl = "http://localhost:8000";
const client = new R2RClient(baseUrl);

async function main() {
  // Perform a health check
  const healthCheck = await client.healthCheck();
  console.log("Health check:", healthCheck);

  // Ingest documents
  const ingestRequest = {
    texts: ["Sample text 1", "Sample text 2"],
    metadatas: [{ source: "file1" }, { source: "file2" }],
    ids: ["doc1", "doc2"],
  };
  const ingestResponse = await client.ingestDocuments(ingestRequest);
  console.log("Ingest response:", ingestResponse);

  // Perform a search
  const searchRequest = {
    query: "your search query",
    n_results: 5,
  };
  const searchResponse = await client.search(searchRequest);
  console.log("Search response:", searchResponse);

  // Perform a RAG completion
  const ragRequest = {
    query: "your query",
    n_results: 5,
  };
  const ragResponse = await client.rag(ragRequest);
  console.log("RAG response:", ragResponse);
}

main().catch((error) => console.error(error));
```

For more detailed usage examples and API documentation, please refer to the [R2R documentation](https://r2r-docs.sciphi.ai/introduction).

## Features

The R2R JavaScript client supports various operations:

- Health check
- Update prompt
- Ingest documents and files
- Update documents and files
- Search
- RAG (Retrieval-Augmented Generation)
- Delete documents
- Retrieve logs
- Get app settings
- Analytics
- Users overview
- Documents overview
- Document chunks

Each feature is implemented as a method in the `R2RClient` class, allowing for easy integration with your application.

## Contributing

Contributions to the R2R JavaScript client are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request on the GitHub repository.

## License

The R2R JavaScript client is open-source software licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Contributing

We welcome contributions of all sizes!
