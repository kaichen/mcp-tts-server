# mcp-tts-server

This project provides a Text-to-Speech (TTS) server based on the Model Context Protocol (MCP), utilizing the Groq API for speech generation.

## Features

-   Implements an MCP server for TTS functionality.
-   Connects to the Groq API (`https://api.groq.com/openai/v1/audio/speech`) for generating lifelike audio from text.
-   Provides a `generate_speech` tool accessible via the MCP protocol.
-   Supports multiple audio output formats (wav, mp3, aac, opus, flac).
-   Uses `@tropicbliss/symphonia` to play the generated audio directly on the server machine (optional).
-   Requires a Groq API key set as an environment variable (`GROQ_API_KEY`).

## Installation

To install dependencies:

```bash
bun install
```

## Running the Server on MCP Client

To run the server using the stdio transport:

```json
{
  "mcpServers": {
    "mcp-tts-server": {
      "command": "bunx",
      "args": [
        "--bun",
        "mcp-tts-server",
      ],
      "env": {
        "GROQ_API_KEY": "gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

## Project Structure

-   `src/server.ts`: Defines the core MCP server logic, including the `generate_speech` tool and interaction with the Groq API.
-   `src/cli.ts`: Provides a command-line interface to run the MCP server over stdio.

This project was created using `bun init` in bun v1.2.7. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
