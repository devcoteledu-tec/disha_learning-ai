
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

export class MathAgentService {
  private chat: Chat | null = null;

  resetChat() {
    this.chat = null;
  }

  private initChat(topic?: string) {
    if (!this.chat) {
      // Use the injected API_KEY directly as per guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const instruction = topic 
        ? `${SYSTEM_INSTRUCTION}\n\nCURRENT FOCUS: The student wants to work on ${topic}.`
        : SYSTEM_INSTRUCTION;

      this.chat = ai.chats.create({
        model: 'gemini-3-pro-preview', // Upgraded to Pro for superior math reasoning
        config: {
          systemInstruction: instruction,
          temperature: 0.4, // Lower temperature for more consistent mathematical logic
        },
      });
    }
  }

  async *sendMessageStream(text: string, topic?: string) {
    this.initChat(topic);
    
    if (!this.chat) {
      throw new Error("Failed to initialize mathematical neural link.");
    }

    try {
      const responseStream = await this.chat.sendMessageStream({ message: text });
      for await (const chunk of responseStream) {
        const c = chunk as GenerateContentResponse;
        yield c.text || "";
      }
    } catch (error: any) {
      console.error("Gemini API Transmission Error:", error);
      throw error;
    }
  }
}

export const mathAgent = new MathAgentService();
