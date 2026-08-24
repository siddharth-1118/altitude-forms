import { getSupabase, getAuthUser, isAltitudeEmail } from '../lib/supabase.js';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  const user = await getAuthUser(req);
  if (!user || !isAltitudeEmail(user.email)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const supabase = getSupabase();
  if (!supabase) return res.status(500).json({ error: 'Database not configured' });

  if (req.method === 'GET') {
    // List forms with real response counts
    const { data: forms, error } = await supabase
      .from('forms')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    // Get real response counts
    const formIds = (forms || []).map(f => f.id);
    const responseCounts = {};
    
    if (formIds.length > 0) {
      const { data: counts } = await supabase
        .from('form_responses')
        .select('form_id')
        .in('form_id', formIds);
      
      if (counts) {
        for (const row of counts) {
          responseCounts[row.form_id] = (responseCounts[row.form_id] || 0) + 1;
        }
      }
    }

    const mappedForms = (forms || []).map(row => ({
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

    return res.json({ forms: mappedForms });
  }

  if (req.method === 'POST') {
    // Create new form
    const { title, description, fields } = req.body;
    const newForm = {
      id: `form-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: title || 'Untitled Form',
      description: description || '',
      fields: fields || [],
    };

    const { error } = await supabase.from('forms').upsert({
      id: newForm.id,
      title: newForm.title,
      description: newForm.description,
      fields: newForm.fields,
    }, { onConflict: 'id' });

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ form: newForm });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
