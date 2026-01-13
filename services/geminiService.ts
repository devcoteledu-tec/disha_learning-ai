
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

export class MathAgentService {
  private chat: Chat | null = null;

  private getClient() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY environment variable is missing.");
    }
    return new GoogleGenAI({ apiKey });
  }

  resetChat() {
    this.chat = null;
  }

  private initChat(topic?: string) {
    if (!this.chat) {
      const ai = this.getClient();
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
    }
  }

  async *sendMessageStream(text: string, topic?: string) {
    this.initChat(topic);
    try {
      const stream = await this.chat!.sendMessageStream({ message: text });
      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        yield c.text || "";
      }
    } catch (error: any) {
      console.error("Gemini API Error Details:", error);
      throw error;
    }
  }
}

export const mathAgent = new MathAgentService();

