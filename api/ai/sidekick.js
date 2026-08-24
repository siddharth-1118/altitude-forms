import { getAuthUser, isAltitudeEmail } from '../lib/supabase.js';
import { GoogleGenAI, Type } from '@google/genai';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const user = await getAuthUser(req);
  if (!user || !isAltitudeEmail(user.email)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { prompt, currentForm } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Fallback without AI
    return res.json({
      message: `I've structured fields for "${prompt}".`,
      fields: [
        { id: `f_${Date.now()}_1`, type: 'short_text', label: `${prompt} - Primary Detail`, required: true },
        { id: `f_${Date.now()}_2`, type: 'long_text', label: 'Additional Notes', required: false },
      ],
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const systemInstruction = `You are altitude Forms AI Sidekick, a precision form design assistant.
The user wants to generate, modify, or extend a form.
Based on the user's prompt and current form state, respond with a helpful short conversational message and a list of new field objects to add to the form.
Supported field types: 'short_text', 'long_text', 'email', 'multiple_choice', 'digital_signature', 'calendar_booking', 'multi_language', 'voice_input'.
Field options are required for 'multiple_choice'.
Return valid JSON adhering to the schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `User request: "${prompt}". Current form: ${JSON.stringify(currentForm || {})}`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: { type: Type.STRING, description: 'Friendly response message.' },
            suggestedTitle: { type: Type.STRING, description: 'Optional revised form title.' },
            suggestedDescription: { type: Type.STRING, description: 'Optional revised form description.' },
            fields: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING },
                  label: { type: Type.STRING },
                  placeholder: { type: Type.STRING },
                  required: { type: Type.BOOLEAN },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  aiSuggested: { type: Type.BOOLEAN },
                },
                required: ['type', 'label'],
              },
            },
          },
          required: ['message', 'fields'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err) {
    console.error('Gemini API error:', err);
    return res.json({
      message: `I've structured fields for "${prompt}".`,
      fields: [
        { id: `f_${Date.now()}_1`, type: 'short_text', label: `${prompt} - Primary Detail`, required: true },
        { id: `f_${Date.now()}_2`, type: 'long_text', label: 'Additional Notes', required: false },
      ],
    });
  }
}
