const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const symphonia = require('@tropicbliss/symphonia');
const { z } = require("zod");

const apiUrl = "https://api.groq.com/openai/v1/audio/speech";

const generateSpeechArgsSchema = {
  input: z.string().describe("the text to generate audio from"),
  voice: z.string().optional().default("Arista-PlayAI").describe("the desired voice for output"),
  response_format: z.enum(["wav", "mp3", "aac", "opus", "flac"]).optional().default("wav").describe("audio output format"),
};

// Create server instance
const server = new McpServer({
  name: "mcp-tts-server",
  version: "0.1.9"
});

server.tool(
  "speech_text", 
  "generate lifelike audio from text(only english is supported)", 
  generateSpeechArgsSchema, 
  async (args: any) => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("Missing GROQ_API_KEY environment variable.");
    }

    const requestBody = {
      model: "playai-tts",
      input: args.input!,
      voice: args.voice!,
      response_format: args.response_format!,
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Groq API request failed, status code ${response.status}: ${errorText}`);
      }

      const audioData = await response.arrayBuffer();
      
      try {
        // Convert ArrayBuffer to Buffer for symphonia
        const audioBuffer = Buffer.from(audioData); 
        symphonia.playFromBuf(audioBuffer, { isBlocking: true }); // Play the audio buffer
      } catch (playError) {
        console.log(JSON.stringify({ level: 'error', message: 'Error playing audio', error: playError }));
        // Decide if playback error should throw or just log
        // throw new Error("Failed to play audio."); 
      }

      return {
        content: [
          {
            type: 'text',
            text: 'Audio generated and played successfully'
          }
        ]
      };
    } catch (error) {
      console.log(JSON.stringify({ level: 'error', message: 'Error calling Groq API', error: error }));
      if (error instanceof Error) {
          throw new Error(`Failed to generate speech: ${error.message}`);
      }
      throw new Error("Unknown error occurred while generating speech.");
    }
  }
);

module.exports = { server };
