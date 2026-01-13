
import 'dotenv/config';
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY tapılmadı. Zəhmət olmasa, .env faylını və ya hosting mühitinizin dəyişənlərini yoxlayın.");
}

export const ai = genkit({
  plugins: [googleAI()],
});
