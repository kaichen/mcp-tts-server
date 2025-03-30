#!/usr/bin/env node

const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { server } = require("./server.js");

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("TTS MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});