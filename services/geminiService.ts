
import { GoogleGenAI, Type } from "@google/genai";
import { PestAnalysisResult, CropRecommendation, FertilizerPlan } from "../types";

// Initialize Gemini Client
// NOTE: In a real app, ensure process.env.API_KEY is defined.
// If it's missing, the service calls will fail gracefully in the components.
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const GeminiService = {
  /**
   * General chat interaction
   */
  async chat(message: string, history: {role: string, parts: {text: string}[]}[] = []): Promise<string> {
    try {
      const model = 'gemini-2.5-flash';
      const chatSession = ai.chats.create({
        model,
        config: {
          systemInstruction: "You are AgriQNet, an advanced agricultural AI assistant. \n\nGuidelines:\n1. Format your response using Markdown. Use bolding for key terms, lists for steps, and clear headings.\n2. If the user asks for a process (e.g., 'how to grow corn'), provide a structured step-by-step workflow.\n3. Keep answers concise, practical, and encouraging.",
        },
        history: history.map(h => ({
            role: h.role,
            parts: h.parts
        }))
      });

      const result = await chatSession.sendMessage({ message });
      return result.text || "I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error("Chat Error:", error);
      return "Sorry, I'm having trouble connecting to the agricultural database right now.";
    }
  },

  /**
   * Recommend crops based on soil data
   */
  async recommendCrops(soil: any): Promise<CropRecommendation[]> {
    try {
      const prompt = `Based on the following soil and environmental conditions, recommend the top 3 best suitable crops.
      Conditions: Nitrogen: ${soil.nitrogen}, Phosphorus: ${soil.phosphorus}, Potassium: ${soil.potassium}, pH: ${soil.ph}, Rainfall: ${soil.rainfall}mm.
      
      For each crop, provide a detailed analysis including scientific name, growth period, yield potential, and economic analysis.
      Return the result as a JSON array.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                scientificName: { type: Type.STRING },
                confidence: { type: Type.NUMBER, description: "Percentage match 0-100" },
                description: { type: Type.STRING, description: "A detailed description of why this crop fits." },
                imageUrl: { type: Type.STRING, description: "Leave empty, handled by frontend" },
                requirements: {
                  type: Type.OBJECT,
                  properties: {
                    water: { type: Type.STRING },
                    sun: { type: Type.STRING },
                    soil: { type: Type.STRING }
                  }
                },
                growthPeriod: { type: Type.STRING, description: "e.g., 90-120 days" },
                yieldPotential: { type: Type.STRING, description: "e.g., 4-5 tons/hectare" },
                economicAnalysis: { type: Type.STRING, description: "Short profitability analysis" }
              }
            }
          }
        }
      });

      const text = response.text;
      if (!text) return [];
      return JSON.parse(text) as CropRecommendation[];
    } catch (error) {
      console.error("Crop Rec Error:", error);
      throw error;
    }
  },

  /**
   * Analyze pest image
   */
  async analyzePestImage(base64Image: string): Promise<PestAnalysisResult> {
    try {
      const prompt = "Analyze this image. If it contains a plant pest or disease, identify it, estimate severity, and provide treatments. If no pest is found, state that.";
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
            { text: prompt }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              pestName: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              severity: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"] },
              description: { type: Type.STRING },
              treatments: { type: Type.ARRAY, items: { type: Type.STRING } },
              preventions: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      });

       const text = response.text;
       if (!text) throw new Error("No response text");
       return JSON.parse(text) as PestAnalysisResult;
    } catch (error) {
      console.error("Pest Analysis Error:", error);
      throw error;
    }
  },

  /**
   * Suggest fertilizer plan
   */
  async recommendFertilizer(cropName: string, soilCondition: string): Promise<FertilizerPlan[]> {
    try {
      const prompt = `Recommend 2 detailed fertilizer plans for growing ${cropName} in ${soilCondition} soil conditions. Focus on organic and sustainable options if possible.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                applicationFrequency: { type: Type.STRING },
                dosage: { type: Type.STRING },
                warnings: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          }
        }
      });

      const text = response.text;
      if (!text) return [];
      return JSON.parse(text) as FertilizerPlan[];
    } catch (error) {
      console.error("Fertilizer Rec Error:", error);
      throw error;
    }
  }
};
