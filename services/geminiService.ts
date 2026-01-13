
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

export class MathAgentService {
  private chat: Chat | null = null;

  resetChat() {
    this.chat = null;
  }

  private initChat(topic?: string) {
    if (!this.chat) {
      // Accessing injected process.env.API_KEY directly as per guidelines
      const apiKey = process.env.API_KEY;
      
      if (!apiKey) {
        throw new Error("SDK_AUTH_MISSING: The system could not find a valid API_KEY in the environment.");
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const instruction = topic 
        ? `${SYSTEM_INSTRUCTION}\n\nCURRENT FOCUS: The student wants to work on ${topic}. Be extremely encouraging.`
        : SYSTEM_INSTRUCTION;

      this.chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: instruction,
          temperature: 0.6,
        },
      });
    }
  }

  async *sendMessageStream(text: string, topic?: string) {
    this.initChat(topic);
    
    if (!this.chat) {
      throw new Error("INITIALIZATION_VOID: Mathematical logic engine failed to boot.");
    }

    try {
      const stream = await this.chat.sendMessageStream({ message: text });
      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        yield c.text || "";
      }
    } catch (error: any) {
      console.error("Stream Transmission Error:", error);
      // Re-throw with more context to help App.tsx catch it
      throw new Error(error.message || "Unknown network paradox detected.");
    }
  }
}

export const mathAgent = new MathAgentService();
