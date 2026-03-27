import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "./prompt.js";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const gemini = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const generateRecipeInstruction = async () => {
	const response = await gemini.models.generateContent({
		model: "gemini-3-flash-preview",
		contents: "Why is the sky blue?",
		config: {
			systemInstruction: SYSTEM_PROMPT,
			temperature: 1,
		},
	});
	return response.text;
};
