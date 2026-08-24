import { getSupabase, getAuthUser, isAltitudeEmail } from '../lib/supabase.js';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { formId } = req.query;
  const supabase = getSupabase();
  if (!supabase) return res.status(500).json({ error: 'Database not configured' });

  if (req.method === 'GET') {
    // Public form access
    const { data, error } = await supabase
      .from('forms')
      .select('id, title, description, fields, updated_at')
      .eq('id', formId)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Form not found' });
    return res.json({
      id: data.id,
      title: data.title,
      description: data.description,
      fields: data.fields,
      updatedAt: data.updated_at,
    });
  }

  // Auth required for PUT/DELETE
  const user = await getAuthUser(req);
  if (!user || !isAltitudeEmail(user.email)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'PUT') {
    const updates = req.body;
    const { error } = await supabase.from('forms').upsert({
      id: formId,
      title: updates.title,
      description: updates.description,
      category: updates.category,
      status: updates.status,
      fields: updates.fields,
      responses_count: updates.responsesCount,
      folder_id: updates.folderId,
      header_badge_icon: updates.headerBadgeIcon,
      banner_image: updates.bannerImage,
      logic_rules: updates.logicRules,
      settings: updates.settings,
    }, { onConflict: 'id' });

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true });
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase.from('forms').delete().eq('id', formId);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
