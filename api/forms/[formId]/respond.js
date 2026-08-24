import { getSupabase } from '../../lib/supabase.js';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { formId } = req.query;
  const supabase = getSupabase();
  if (!supabase) return res.status(500).json({ error: 'Database not configured' });

  const { answers } = req.body || {};

  // Insert response
  const { error: insertError } = await supabase.from('form_responses').insert({
    id: `resp-${Date.now()}`,
    form_id: formId,
    answers: answers || {},
  });

  if (insertError) return res.status(500).json({ error: insertError.message });

  // Increment response count
  const { data: form } = await supabase
    .from('forms')
    .select('responses_count')
    .eq('id', formId)
    .single();

  if (form) {
    await supabase
      .from('forms')
      .update({ responses_count: (form.responses_count || 0) + 1 })
      .eq('id', formId);
  }

  return res.json({ ok: true });
}
