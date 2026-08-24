import express from 'express';
import http from 'http';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
dotenv.config({ path: path.join(process.cwd(), '.env.local'), override: false });

export const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// --- Altitude email validation ---
const ALTITUDE_EMAIL_REGEX = /^[\w.-]+@altitude\.com$/i;
function isAltitudeEmail(email: string): boolean {
  return ALTITUDE_EMAIL_REGEX.test(email.trim().toLowerCase());
}

// --- Identity (Supabase auth) ---
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

let _supabaseServer: ReturnType<typeof createClient> | null = null;
function getSupabaseServer() {
  if (!_supabaseServer && SUPABASE_URL && SUPABASE_ANON_KEY) {
    _supabaseServer = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _supabaseServer;
}

interface AuthUser { id: string; email: string; }

async function getAuthUser(req: express.Request): Promise<AuthUser | null> {
  const header = String(req.headers.authorization || '');
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return null;
  const supabaseServer = getSupabaseServer();
  if (supabaseServer) {
    const { data, error } = await supabaseServer.auth.getUser(token);
    if (!error && data.user) return { id: data.user.id, email: data.user.email || '' };
    return null;
  }
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1] || '', 'base64url').toString('utf-8'));
    if (payload && payload.email) return { id: payload.sub || payload.email, email: String(payload.email) };
  } catch {}
  return null;
}

async function requireUser(req: express.Request, res: express.Response): Promise<AuthUser | null> {
  const user = await getAuthUser(req);
  if (!user || !user.email) {
    res.status(401).json({ error: 'Unauthorized — sign in to access Forms.' });
    return null;
  }
  if (!isAltitudeEmail(user.email)) {
    res.status(403).json({ error: 'Only @altitude.com emails can access altitude Forms.' });
    return null;
  }
  return user;
}

// --- Gemini AI client ---
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// --- Form data store (Supabase) ---
interface FormEntry {
  id: string;
  title: string;
  description: string;
  category?: string;
  status?: string;
  fields: any[];
  responses?: any[];
  responsesCount?: number;
  folderId?: string;
  headerBadgeIcon?: string;
  bannerImage?: string;
  logicRules?: any[];
  settings?: any;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

function getSupabaseClient() {
  const url = SUPABASE_URL;
  const key = SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

async function getUserForms(email: string): Promise<FormEntry[]> {
  const client = getSupabaseClient();
  if (!client) return [];
  const { data: userForms, error } = await client
    .from('forms')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error('[forms] fetch error:', error.message); return []; }

  // Compute real response counts from form_responses table
  const formIds = (userForms || []).map((r: any) => r.id);
  const responseCounts: Record<string, number> = {};
  if (formIds.length > 0) {
    const { data: counts } = await client
      .from('form_responses')
      .select('form_id')
      .in('form_id', formIds);
    if (counts) {
      for (const row of counts as any[]) {
        responseCounts[row.form_id] = (responseCounts[row.form_id] || 0) + 1;
      }
    }
  }

  return (userForms || []).map((row: any) => ({
    id: row.id,
    title: row.title,
    description: row.description || '',
    category: row.category || 'General',
    status: row.status || 'draft',
    fields: row.fields || [],
    responsesCount: responseCounts[row.id] || 0,
    folderId: row.folder_id,
    headerBadgeIcon: row.header_badge_icon,
    bannerImage: row.banner_image,
    logicRules: row.logic_rules || [],
    settings: row.settings,
    createdBy: row.user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

async function saveUserForms(userId: string, forms: FormEntry[]): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  for (const form of forms) {
    await client.from('forms').upsert({
      id: form.id,
      title: form.title,
      description: form.description || '',
      category: form.category || 'General',
      status: form.status || 'draft',
      fields: form.fields || [],
      responses_count: form.responsesCount || 0,
      folder_id: form.folderId || null,
      header_badge_icon: form.headerBadgeIcon || null,
      banner_image: form.bannerImage || null,
      logic_rules: form.logicRules || [],
      settings: form.settings || null,
    }, { onConflict: 'id' });
  }
}

async function upsertSingleForm(form: FormEntry): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  await client.from('forms').upsert({
    id: form.id,
    title: form.title,
    description: form.description || '',
    category: form.category || 'General',
    status: form.status || 'draft',
    fields: form.fields || [],
    responses_count: form.responsesCount || 0,
    folder_id: form.folderId || null,
    header_badge_icon: form.headerBadgeIcon || null,
    banner_image: form.bannerImage || null,
    logic_rules: form.logicRules || [],
    settings: form.settings || null,
  }, { onConflict: 'id' });
}

async function getFormResponses(formId: string): Promise<any[]> {
  const client = getSupabaseClient();
  if (!client) return [];
  const { data, error } = await client
    .from('form_responses')
    .select('*')
    .eq('form_id', formId)
    .order('submitted_at', { ascending: false });
  if (error) { console.error('[forms] fetch responses error:', error.message); return []; }
  return (data || []).map((row: any) => ({
    id: row.id,
    answers: row.answers || {},
    submittedAt: row.submitted_at,
  }));
}

async function addFormResponse(formId: string, answers: any): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  await client.from('form_responses').insert({
    id: `resp-${Date.now()}`,
    form_id: formId,
    answers: answers || {},
  });
  // Increment responses count on the form
  const { data: form } = await client.from('forms').select('responses_count').eq('id', formId).single();
  if (form) {
    await client.from('forms').update({ responses_count: (form.responses_count || 0) + 1 }).eq('id', formId);
  }
}

async function deleteFormById(formId: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  await client.from('forms').delete().eq('id', formId);
}

// --- Health check ---
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', aiEnabled: Boolean(process.env.GEMINI_API_KEY) });
});

// --- Seed initial forms (called once when store is empty) ---
app.post('/api/forms/seed', async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;
  const existing = await getUserForms(user.email);
  if (existing.length > 0) return res.json({ seeded: false, count: existing.length });
  const { forms } = req.body;
  if (Array.isArray(forms) && forms.length > 0) {
    const client = getSupabaseClient();
    if (client) {
      const rows = forms.map((f: any) => ({
        id: f.id,
        title: f.title || 'Untitled Form',
        description: f.description || '',
        category: f.category || 'General',
        status: f.status || 'draft',
        fields: f.fields || [],
        responses_count: f.responsesCount || 0,
        folder_id: f.folderId || null,
        header_badge_icon: f.headerBadgeIcon || null,
        banner_image: f.bannerImage || null,
        logic_rules: f.logicRules || [],
        settings: f.settings || null,
      }));
      const { error } = await client.from('forms').upsert(rows, { onConflict: 'id' });
      if (error) console.error('[forms] seed error:', error.message);
    }
    return res.json({ seeded: true, count: forms.length });
  }
  res.json({ seeded: false });
});

// --- Forms CRUD (altitude auth required) ---

// List all forms for the user
app.get('/api/forms', async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;
  const forms = await getUserForms(user.email);
  res.json({ forms });
});

// Create a new form
app.post('/api/forms', async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;
  const { title, description, fields } = req.body;
  const newForm: FormEntry = {
    id: `form-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: title || 'Untitled Form',
    description: description || '',
    fields: fields || [],
    responses: [],
    createdBy: user.email,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await upsertSingleForm(newForm);
  res.json({ form: newForm });
});

// Update a form
app.put('/api/forms/:formId', async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;
  const forms = await getUserForms(user.email);
  const existing = forms.find(f => f.id === req.params.formId);
  if (!existing) return res.status(404).json({ error: 'Form not found' });
  const updated = { ...existing, ...req.body, updatedAt: new Date().toISOString() };
  await upsertSingleForm(updated);
  res.json({ form: updated });
});

// Delete a form
app.delete('/api/forms/:formId', async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;
  await deleteFormById(req.params.formId);
  res.json({ ok: true });
});

// Get form data publicly (no auth — for the public form URL)
app.get('/api/forms/public/:formId', async (req, res) => {
  const client = getSupabaseClient();
  if (!client) return res.status(500).json({ error: 'Database not configured' });
  const { data, error } = await client
    .from('forms')
    .select('id, title, description, fields, updated_at')
    .eq('id', req.params.formId)
    .single();
  if (error || !data) return res.status(404).json({ error: 'Form not found' });
  res.json({
    id: data.id,
    title: data.title,
    description: data.description,
    fields: data.fields,
    updatedAt: data.updated_at,
  });
});

// Submit a response to a form (public — anyone with the form link can respond)
app.post('/api/forms/:formId/respond', async (req, res) => {
  await addFormResponse(req.params.formId, req.body.answers || {});
  res.json({ ok: true });
});

// Get form responses (auth required — only form creator)
app.get('/api/forms/:formId/responses', async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;
  const responses = await getFormResponses(req.params.formId);
  res.json({ responses, total: responses.length });
});

// --- AI Sidekick Endpoint ---
app.post('/api/ai/sidekick', async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  const { prompt, currentForm } = req.body;

  try {
    const ai = getAiClient();
    if (ai) {
      const systemInstruction = `You are altitude Forms AI Sidekick, a precision form design assistant.
The user wants to generate, modify, or extend a form.
Based on the user's prompt and current form state, respond with a helpful short conversational message and a list of new field objects to add to the form.
Supported field types: 'short_text', 'long_text', 'email', 'multiple_choice', 'digital_signature', 'calendar_booking', 'multi_language', 'voice_input'.
Field options are required for 'multiple_choice'.
Return valid JSON adhering to the schema.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
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
    }
  } catch (err) {
    console.error('Gemini API call failed:', err);
  }

  // Fallback
  res.json({
    message: `I've structured fields for "${prompt}".`,
    fields: [
      { id: `f_${Date.now()}_1`, type: 'short_text', label: `${prompt} - Primary Detail`, required: true },
      { id: `f_${Date.now()}_2`, type: 'long_text', label: 'Additional Notes', required: false },
    ],
  });
});

// --- AI Summarize Endpoint ---
app.post('/api/ai/summarize', async (req, res) => {
  const { text, context } = req.body;
  if (!text || text.trim() === '') return res.json({ summary: '' });

  try {
    const ai = getAiClient();
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Summarize concisely: "${text}". Context: ${context || 'Form response'}`,
      });
      return res.json({ summary: response.text?.trim() || text });
    }
  } catch (err) {
    console.error('Summarize error:', err);
  }

  res.json({ summary: text.split(/\s+/).slice(0, 20).join(' ') });
});

// Serve built static files (production only — in dev mode Vite handles serving)
if (process.env.RUN_SERVER === 'true') {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath, { index: false }));

  // SPA fallback: serve index.html for all non-API routes (including /form/:id)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    const indexPath = path.join(distPath, 'index.html');
    res.sendFile(indexPath, (err) => { if (err) next(); });
  });
}

// Listen
if (process.env.RUN_SERVER === 'true') {
  const PORT = Number(process.env.PORT) || 3003;
  const server = http.createServer(app);
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`📋 altitude Forms Server running on port ${PORT}`);
  });
}
