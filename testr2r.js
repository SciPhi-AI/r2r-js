const { r2rClient } = require("./dist/r2rClient");
const fs = require("fs");

const client = new r2rClient("http://localhost:8000");

async function main() {
  const filterCriteria = {
    filters: {
      search_latencies: "search_latency",
    },
  };

  const analysisTypes = {
    search_latencies: ["basic_statistics", "search_latency"],
  };

  result = await client.analytics(filterCriteria, analysisTypes);
  console.log(result);
}

main().catch(console.error);
