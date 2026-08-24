import { getSupabase, getAuthUser, isAltitudeEmail } from '../../lib/supabase.js';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const user = await getAuthUser(req);
  if (!user || !isAltitudeEmail(user.email)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { formId } = req.query;
  const supabase = getSupabase();
  if (!supabase) return res.status(500).json({ error: 'Database not configured' });

  const { data, error } = await supabase
    .from('form_responses')
    .select('*')
    .eq('form_id', formId)
    .order('submitted_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  const responses = (data || []).map(row => ({
    id: row.id,
    answers: row.answers || {},
    submittedAt: row.submitted_at,
  }));

  return res.json({ responses, total: responses.length });
}
