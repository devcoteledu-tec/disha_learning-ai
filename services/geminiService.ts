
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { Message, Role } from "../types";

export class MathAgentService {
  private ai: GoogleGenAI;
  private chat: Chat | null = null;

  constructor() {
    // Check if process and process.env exist before accessing to prevent crashes
    const apiKey = (typeof process !== 'undefined' && process.env?.API_KEY) || '';
    this.ai = new GoogleGenAI({ apiKey });
  }

  resetChat() {
    this.chat = null;
  }

  private initChat(topic?: string) {
    if (!this.chat) {
      const instruction = topic 
        ? `${SYSTEM_INSTRUCTION}\n\nCURRENT FOCUS: The student wants to work on ${topic}. Tailor your questions and hints to this area of mathematics.`
        : SYSTEM_INSTRUCTION;

      this.chat = this.ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
          systemInstruction: instruction,
          temperature: 0.7,
        },
      });
    }
  }

  async sendMessage(text: string, topic?: string): Promise<string> {
    this.initChat(topic);
    try {
      const result: GenerateContentResponse = await this.chat!.sendMessage({ message: text });
      return result.text || "I apologize, but I couldn't generate a response. Let's try rephrasing your question.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("Failed to communicate with the Math Agent. Please check your connection.");
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
    } catch (error) {
      console.error("Gemini Streaming Error:", error);
      throw error;
    }
  }
}

export const mathAgent = new MathAgentService();
