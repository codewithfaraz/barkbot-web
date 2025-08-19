import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const usePrediction = () => {
  const [isLoading, setIsLoading] = useState(false);

  const makePrediction = async (base64Image: string, description: string) => {
    try {
      setIsLoading(true);
      console.log("Starting prediction...");

      // Extract MIME type and clean base64 data
      const mimeTypeMatch = base64Image.match(/^data:([^;]+);base64,/);
      const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : "image/jpeg";

      // Remove the data URL prefix to get clean base64
      const cleanBase64 = base64Image.replace(/^data:[^;]+;base64,/, "");

      console.log("MIME Type:", mimeType);
      console.log("Base64 length:", cleanBase64.length);

      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp", // Updated to a more stable model
      });

      const prompt = `
You are a dog thought predictor AI. I'll provide you with a photo of a dog and a short description of the situation: "${description}"

Return the dog's thoughts as JSON in this exact format:

{
  "title": "A short, catchy title (3-5 words) with a relevant emoji",
  "description": "A detailed thought description, max 50 words"
}

If there's no dog in the image, return:

{
  "error": "Sorry, I couldn't find a dog in the image."
}

Return ONLY the JSON, no other text.`;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: mimeType,
            data: cleanBase64,
          },
        },
      ]);

      const response = await result.response;
      const textResponse = response.text();

      console.log("Raw response:", textResponse);

      // Clean any markdown code block wrappers
      const cleanJsonText = textResponse
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/, "")
        .replace(/```\s*$/, "")
        .trim();

      console.log("Cleaned JSON text:", cleanJsonText);

      const jsonResponse = JSON.parse(cleanJsonText);
      console.log("Parsed response:", jsonResponse);

      return jsonResponse;
    } catch (err: any) {
      console.error("Prediction error:", err);
      // More specific error handling
      if (err instanceof SyntaxError) {
        console.error("JSON parsing failed");
        return { error: "Failed to parse AI response" };
      }

      if (err.message?.includes("API key")) {
        return { error: "API key issue. Please check your configuration." };
      }

      return { error: "Something went wrong. Please try again." };
    } finally {
      setIsLoading(false);
    }
  };

  return { makePrediction, isLoading };
};
