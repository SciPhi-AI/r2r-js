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
const { R2RClient } = require('r2r-js');

const baseUrl = 'http://localhost:8000';
const client = new R2RClient(baseUrl);

async function main() {
  // Upload and process a file
  const filePath = 'path/to/your/file.pdf';
  const metadata = { tags: ['example', 'test'] };
  const uploadResponse = await client.uploadAndProcessFile('document-id', filePath, metadata);
  console.log('Upload response:', uploadResponse);

  // Perform a search
  const searchResponse = await client.search('your search query', 5);
  console.log('Search response:', searchResponse);

  // Perform a RAG completion
  const ragResponse = await client.ragCompletion('your query', 5);
  console.log('RAG response:', ragResponse);
}

main().catch((error) => console.error(error));
```

For more detailed usage examples and API documentation, please refer to the [R2R JavaScript Client documentation](https://link-to-docs).

## Contributing

Contributions to the R2R JavaScript client are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request on the GitHub repository.

## License

The R2R JavaScript client is open-source software licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Acknowledgements

The R2R JavaScript client is built on top of the R2R framework developed by SciPhi-AI. We would like to thank the R2R community for their ongoing support and contributions.