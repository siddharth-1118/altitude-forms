import { getSupabase, getAuthUser, isAltitudeEmail } from '../lib/supabase.js';

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

  const supabase = getSupabase();
  if (!supabase) return res.status(500).json({ error: 'Database not configured' });

  // Check if forms already exist
  const { data: existing } = await supabase.from('forms').select('id').limit(1);
  if (existing && existing.length > 0) {
    return res.json({ seeded: false, count: existing.length });
  }

  const { forms } = req.body;
  if (!Array.isArray(forms) || forms.length === 0) {
    return res.json({ seeded: false });
  }

  const rows = forms.map(f => ({
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

  const { error } = await supabase.from('forms').upsert(rows, { onConflict: 'id' });
  if (error) return res.status(500).json({ error: error.message });

  return res.json({ seeded: true, count: forms.length });
}
