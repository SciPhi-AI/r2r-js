import path from 'path';
import R2RClient from './r2rClient';
import { generateIdFromLabel } from './utils';

const baseUrl = 'http://localhost:8000';
const client = new R2RClient(baseUrl);

async function main() {
  console.log('Upserting entry to remote db...');
  const entryResponse = await client.addEntry(
    generateIdFromLabel('doc 1'),
    { txt: 'This is a test entry' },
    { tags: ['example', 'test'] },
    true
  );
  console.log(`Upsert entry response:\n${JSON.stringify(entryResponse)}\n\n`);

  console.log('Upserting entries to remote db...');
  const entries = [
    {
      document_id: generateIdFromLabel('doc 2'),
      blobs: { txt: 'Second test entry' },
      metadata: { tags: 'bulk' },
    },
    {
      document_id: generateIdFromLabel('doc 3'),
      blobs: { txt: 'Third test entry' },
      metadata: { tags: 'example' },
    },
  ];
  const bulkUpsertResponse = await client.addEntries(entries, true);
  console.log(`Upsert entries response:\n${JSON.stringify(bulkUpsertResponse)}\n\n`);

  console.log('Searching remote db...');
  const searchResponse = await client.search('test', 5);
  console.log(`Search response:\n${JSON.stringify(searchResponse)}\n\n`);

  console.log('Searching remote db with filter...');
  const filteredSearchResponse = await client.search('test', 5, { tags: 'bulk' });
  console.log(`Search response w/ filter:\n${JSON.stringify(filteredSearchResponse)}\n\n`);

  console.log('Deleting sample document in remote db...');
  const response = await client.filteredDeletion('document_id', generateIdFromLabel('doc 2'));
  console.log(`Deletion response:\n${JSON.stringify(response)}\n\n`);

  console.log('Searching remote db with filter after deletion...');
  const postDeletionFilteredSearchResponse = await client.search('test', 5, { tags: 'bulk' });
  console.log(`Search response w/ filter+deletion:\n${JSON.stringify(postDeletionFilteredSearchResponse)}\n\n`);

  const filePath = path.join(__dirname, '..', 'data', 'test.pdf');
  console.log(`Uploading and processing file: ${filePath}...`);
  const metadata = { tags: ['example', 'test'] };
  const uploadPdfResponse = await client.uploadAndProcessFile(generateIdFromLabel('pdf 1'), filePath, metadata);
  console.log(`Upload test pdf response:\n${JSON.stringify(uploadPdfResponse)}\n\n`);

  console.log('Searching remote db after upload...');
  const pdfFilteredSearchResponse = await client.search('what is a cool physics equation?', 5, { document_id: generateIdFromLabel('pdf 1') });
  console.log(`Search response w/ uploaded pdf filter:\n${JSON.stringify(pdfFilteredSearchResponse)}\n`);

  console.log('Performing RAG...');
  const ragResponse = await client.ragCompletion('Are there any test documents?', 5, { document_id: generateIdFromLabel('pdf 1') });
  console.log(`RAG response:\n${JSON.stringify(ragResponse)}\n`);

  console.log('Fetching logs after all steps...');
  const logsResponse = await client.getLogs();
  console.log(`Logs response:\n${JSON.stringify(logsResponse)}\n`);

  console.log('Fetching logs summary after all steps...');
  const logsSummaryResponse = await client.getLogsSummary();
  console.log(`Logs summary response:\n${JSON.stringify(logsSummaryResponse)}\n`);
}

main().catch((error) => console.error(error));