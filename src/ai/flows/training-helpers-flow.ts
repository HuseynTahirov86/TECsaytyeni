'use server';
/**
 * @fileOverview A set of AI helper flows for creating and managing training content.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// --- Image Generation Flow ---

const imageGenerationInputSchema = z.string().describe("A concise title or prompt for image generation.");
const imageGenerationOutputSchema = z.object({
  url: z.string().url().describe("The URL of the generated image."),
});

export const generateImage = ai.defineFlow(
  {
    name: 'generateTrainingImage',
    inputSchema: imageGenerationInputSchema,
    outputSchema: imageGenerationOutputSchema,
  },
  async (promptText) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Generate a visually appealing, professional, and relevant image for a training module with the following title: "${promptText}". The image should be abstract or metaphorical, suitable for an educational context. Avoid text.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      throw new Error("AI şəkil yarada bilmədi.");
    }
    return { url: media.url };
  }
);
