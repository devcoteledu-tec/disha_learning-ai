
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

export class MathAgentService {
  private chat: Chat | null = null;

  private getApiKey(): string {
    // Check multiple possible locations for the API key
    const key = (typeof process !== 'undefined' && process.env) 
      ? (process.env.API_KEY || (process.env as any).VITE_API_KEY)
      : undefined;
      
    if (!key) {
      throw new Error("MISSING_API_KEY");
    }
    return key;
  }

  resetChat() {
    this.chat = null;
  }

  private initChat(topic?: string) {
    if (!this.chat) {
      try {
        const apiKey = this.getApiKey();
        const ai = new GoogleGenAI({ apiKey });
        const instruction = topic 
          ? `${SYSTEM_INSTRUCTION}\n\nCURRENT FOCUS: The student wants to work on ${topic}.`
          : SYSTEM_INSTRUCTION;

        this.chat = ai.chats.create({
          model: 'gemini-3-flash-preview',
          config: {
            systemInstruction: instruction,
            temperature: 0.7,
          },
        });
      } catch (error) {
        throw error;
      }
    }
  }

  async *sendMessageStream(text: string, topic?: string) {
    this.initChat(topic);
    if (!this.chat) throw new Error("CHAT_INIT_FAILED");

    try {
      const stream = await this.chat.sendMessageStream({ message: text });
      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        yield c.text || "";
      }
    } catch (error: any) {
      console.error("Gemini Stream Error:", error);
      throw error;
    }
  }
}

export const mathAgent = new MathAgentService();

