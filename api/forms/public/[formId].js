import { getSupabase } from '../../lib/supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { formId } = req.query;
  if (!formId) return res.status(400).json({ error: 'formId required' });

  const supabase = getSupabase();
  if (!supabase) return res.status(500).json({ error: 'Database not configured' });

  const { data, error } = await supabase
    .from('forms')
    .select('*')
    .eq('id', formId)
    .eq('status', 'live')
    .single();

  if (error || !data) {
    return res.status(404).json({ error: 'Form not found or not published' });
  }

  return res.json({
    id: data.id,
    title: data.title,
    description: data.description,
    fields: data.fields,
    settings: data.settings,
    updatedAt: data.updated_at,
  });
}
