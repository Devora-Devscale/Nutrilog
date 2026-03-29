import { HTTPException } from "hono/http-exception";
import { env } from "../../utils/env.js";

interface OpenRouterResponse {
	choices: Array<{
		message: {
			content: string;
		};
	}>;
	error?: {
		message: string;
	};
}

const SYSTEM_PROMPT = `
Kamu adalah ahli memasak Indonesia. Tugasmu adalah membuat instruksi memasak yang jelas, langkah demi langkah, dalam bahasa Indonesia.

Format output:
1. Gunakan penomoran (1, 2, 3, dst) untuk setiap langkah
2. Setiap langkah harus jelas dan mudah diikuti
3. Sertakan detail penting seperti suhu, waktu memasak, dan teknik
4. Akhiri dengan tips penyajian jika relevan

Contoh format:
1. Panaskan minyak di wajan dengan api sedang...
2. Tambahkan bumbu halus dan tumis hingga harum...
3. Masukkan ayam, masak hingga berubah warna...
...

Pastikan instruksi:
- Praktis dan bisa diikuti oleh pemula
- Menggunakan bahan-bahan yang umum di Indonesia
- Langkah-langkah yang logis dan sistematis
- Berikan jumlah bahan untuk 1 porsi.
`;

export const generateRecipeInstruction = async (
	recipeName: string,
): Promise<string> => {
	const envVars = env();
	const apiKey = envVars.OPENROUTER_API_KEY;

	if (!apiKey) {
		throw new HTTPException(500, {
			message: "OPENROUTER_API_KEY not configured in .env",
		});
	}

	try {
		console.log("Calling OpenRouter API...");
		console.log(
			"API Key (masked):",
			`${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`,
		);

		const response = await fetch(
			"https://openrouter.ai/api/v1/chat/completions",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${apiKey}`,
					"HTTP-Referer": "http://localhost:8000",
					"X-Title": "Nutrilog",
				},
				body: JSON.stringify({
					model: "nvidia/nemotron-3-super-120b-a12b:free",
					messages: [
						{
							role: "system",
							content: SYSTEM_PROMPT.trim(),
						},
						{
							role: "user",
							content: `Buat instruksi memasak untuk resep "${recipeName}" dalam bahasa Indonesia.`,
						},
					],
					max_tokens: 4096,
					temperature: 0.7,
				}),
			},
		);

		const responseText = await response.text();
		console.log("OpenRouter API status:", response.status);

		if (!response.ok) {
			console.error("OpenRouter Error response:", responseText);
			let errorMessage = `OpenRouter API Error (${response.status})`;
			try {
				const errorData: OpenRouterResponse = JSON.parse(responseText);
				errorMessage = errorData.error?.message || responseText;
			} catch {
				errorMessage = responseText;
			}
			throw new HTTPException(500, { message: errorMessage });
		}

		const data: OpenRouterResponse = JSON.parse(responseText);
		const rawInstruction =
			data.choices[0]?.message?.content ||
			"Gagal generate instruksi. Coba lagi.";

		// Clean up markdown formatting
		const instruction = rawInstruction
			.replace(/\*\*/g, "") // Remove bold markers
			.replace(/\*/g, "") // Remove italic markers
			.replace(/`/g, "") // Remove code markers
			.trim();

		console.log("OpenRouter success, instruction length:", instruction.length);
		return instruction;
	} catch (error) {
		console.error("AI generation error:", error);
		if (error instanceof HTTPException) {
			throw error;
		}
		throw new HTTPException(500, {
			message:
				error instanceof Error
					? error.message
					: "Terjadi kesalahan tak terduga",
		});
	}
};
