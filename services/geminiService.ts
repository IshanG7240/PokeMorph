import { GoogleGenAI, Type } from "@google/genai";
import { AspectRatio, ImageSize } from "../types";

// Helper to get the AI instance. 
// We create a new instance each time to ensure we pick up any API key changes (e.g. from user selection).
const getAI = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const transformImageToPokemon = async (
  imageBase64: string,
  pokemonName: string,
  customInstruction?: string
): Promise<string> => {
  const ai = getAI();
  const model = "gemini-2.5-flash-image";

  const prompt = `Transform the person or subject in this image into a ${pokemonName}. 
  ${customInstruction ? `Additional details: ${customInstruction}.` : ''}
  
  CRITICAL INSTRUCTION: Morph the subject's anatomy and body structure to match the species of ${pokemonName}.
  - Completely alter the skin texture (fur, scales, smooth skin), head shape, and facial features to resemble the Pokémon.
  - Adjust limb proportions and add necessary appendages (tails, wings, horns, ears) that define the Pokémon.
  - STRICTLY maintain the original pose, gesture, and composition of the source image.
  - The goal is a photorealistic or high-quality cinematic image where the subject appears to BE the Pokémon, not a human wearing a costume.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              data: imageBase64,
              mimeType: "image/png", 
            },
          },
          { text: prompt },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData && part.inlineData.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Transformation error:", error);
    throw error;
  }
};

export const generatePokemonImage = async (
  prompt: string,
  aspectRatio: AspectRatio,
  imageSize: ImageSize
): Promise<string> => {
  const ai = getAI();
  const model = "gemini-3-pro-image-preview"; // Using the pro model for high quality generation

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: imageSize,
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData && part.inlineData.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Generation error:", error);
    throw error;
  }
};

export const analyzeImageForPokemon = async (imageBase64: string): Promise<string> => {
  const ai = getAI();
  const model = "gemini-3-pro-preview"; // Use Pro for reasoning

  const prompt = `Analyze this image. 
  1. If there is a person, describe what kind of Pokémon Trainer they would be and suggest a signature Pokémon that matches their vibe/clothing.
  2. If there is an object or animal, describe it in the style of a Pokédex entry (Name, Type, Description).
  Return the result as a markdown formatted string with bold headers.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              data: imageBase64,
              mimeType: "image/png",
            },
          },
          { text: prompt },
        ],
      },
    });
    return response.text || "Could not analyze image.";
  } catch (error) {
    console.error("Analysis error:", error);
    throw error;
  }
};

export const checkApiKey = async (): Promise<boolean> => {
  if (window.aistudio && window.aistudio.hasSelectedApiKey) {
    return await window.aistudio.hasSelectedApiKey();
  }
  return false;
};

export const requestApiKey = async (): Promise<void> => {
   if (window.aistudio && window.aistudio.openSelectKey) {
    await window.aistudio.openSelectKey();
  }
}