
import { GoogleGenAI, Type } from "@google/genai";
import type { Question } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    questionText: {
      type: Type.OBJECT,
      properties: {
        ja: { type: Type.STRING, description: "Question text in Japanese" },
        en: { type: Type.STRING, description: "Question text in English" },
        vi: { type: Type.STRING, description: "Question text in Vietnamese" },
      },
      required: ['ja', 'en', 'vi'],
    },
    options: {
      type: Type.OBJECT,
      properties: {
        ja: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 options in Japanese" },
        en: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 options in English (translated from Japanese options)" },
        vi: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 options in Vietnamese (translated from Japanese options)" },
      },
      required: ['ja', 'en', 'vi'],
    },
    correctAnswerIndex: {
      type: Type.INTEGER,
      description: 'The 0-based index of the correct answer in the options array.',
    },
    explanation: {
      type: Type.OBJECT,
      properties: {
        ja: { type: Type.STRING, description: "Explanation in Japanese" },
        en: { type: Type.STRING, description: "Explanation in English" },
        vi: { type: Type.STRING, description: "Explanation in Vietnamese" },
      },
      required: ['ja', 'en', 'vi'],
    },
    illustrationPrompt: {
        type: Type.STRING,
        description: "If the question is clearer with a visual (like a network diagram or flowchart), provide a simple, descriptive English prompt for an image generation model. Otherwise, return an empty string.",
    },
  },
  required: ['questionText', 'options', 'correctAnswerIndex', 'explanation', 'illustrationPrompt'],
};

async function generateImageFromPrompt(prompt: string): Promise<string | undefined> {
    if (!prompt || prompt.trim() === "") return undefined;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: prompt }],
            },
            config: {
                imageConfig: {
                    aspectRatio: "4:3",
                },
            },
        });
        
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64Data = part.inlineData.data;
                return `data:image/png;base64,${base64Data}`;
            }
        }
        return undefined;
    } catch (error) {
        console.error("Error generating illustration:", error);
        return undefined; // Fail gracefully, don't block the question
    }
}


export const generateQuestion = async (topic: string, examType: 'FE' | 'ISTQB'): Promise<Question> => {
  let examContext = "";
  if (examType === 'FE') {
      examContext = "Japanese Fundamental Information Technology Engineer (FE) Examination";
  } else {
      examContext = "ISTQB Foundation Level (CTFL) Examination";
  }

  const prompt = `Generate a multiple-choice question for the ${examContext} on the topic "${topic}".
    
    The output MUST be a JSON object adhering strictly to the provided schema.
    It must include translations for the Question, Options, and Explanation in three languages:
    1. Japanese (ja) - ${examType === 'FE' ? 'The original exam language.' : 'Translated accurately.'}
    2. English (en) - ${examType === 'ISTQB' ? 'The original exam language.' : 'Translated accurately.'}
    3. Vietnamese (vi) - A clear translation.
    
    Ensure the indices of the options correspond correctly across all languages (e.g., Option index 0 in Japanese must match Option index 0 in English and Vietnamese).
    Do not include any text or markdown outside the JSON object.`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: responseSchema,
            temperature: 0.8,
        },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);
    
    // Basic validation
    if (
        !parsedData.questionText?.ja ||
        !parsedData.options?.ja ||
        parsedData.options.ja.length !== 4 ||
        typeof parsedData.correctAnswerIndex !== 'number' ||
        !parsedData.explanation?.ja
    ) {
        throw new Error('Invalid question format received from API');
    }

    const imageUrl = await generateImageFromPrompt(parsedData.illustrationPrompt);

    return { ...parsedData, imageUrl } as Question;

  } catch (error) {
    console.error("Error generating question with Gemini:", error);
    throw new Error("Failed to parse question from Gemini response.");
  }
};
