
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";

/**
 * Generates an image based on a text prompt using the Gemini API.
 * @param prompt The text description of the image to generate.
 * @param aspectRatio The desired aspect ratio for the image.
 * @returns A promise that resolves to the base64 encoded image string.
 */
export const generateImage = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: aspectRatio,
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const imageBytes = response.generatedImages[0]?.image?.imageBytes;
      if (imageBytes) {
        return imageBytes;
      }
    }
    
    throw new Error("Image generation failed: No image data received from the API.");

  } catch (error) {
    console.error("Error generating image with Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unexpected error occurred during image generation.");
  }
};
