import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';
import { RespondentForm } from './respondent/RespondentForm';
import { FormItem } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

interface PublicFormViewProps {
  formId: string;
}

async function supaGet(table: string, params: string): Promise<any> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

export const PublicFormView: React.FC<PublicFormViewProps> = ({ formId }) => {
  const [form, setForm] = useState<FormItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
          if (!cancelled) setError('Supabase not configured.');
          return;
        }
        const rows = await supaGet('forms', `id=eq.${formId}&status=eq.live&select=*`);
        if (!rows || rows.length === 0) {
          if (!cancelled) setError('Form not found or no longer available.');
          return;
        }
        const data = rows[0];
        if (!cancelled) {
          setForm({
            id: data.id,
            title: data.title,
            description: data.description,
            category: 'Public',
            status: 'live',
            fields: data.fields,
            responsesCount: 0,
            updatedAt: data.updated_at,
          });
        }
      } catch (err) {
        console.error('PublicFormView error:', err);
        if (!cancelled) setError('Failed to load form. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [formId]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f3f4f8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <Loader2 className="w-8 h-8 text-[#00a8b5] animate-spin" />
        <p style={{ marginTop: '16px', fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Loading form...</p>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div style={{ minHeight: '100vh', background: '#f3f4f8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Form Unavailable</h2>
        <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '360px', textAlign: 'center', lineHeight: 1.6 }}>{error || 'This form could not be loaded.'}</p>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#f3f4f8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', boxShadow: '0 0 0 8px rgba(16,185,129,0.1)' }}>
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Thank You!</h2>
        <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '360px', textAlign: 'center', lineHeight: 1.6, marginBottom: '24px' }}>
          Your response to <strong>{form.title}</strong> has been submitted successfully.
        </p>
        <button onClick={() => setIsSubmitted(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px', border: '1px solid #e5e7eb', background: 'white', fontSize: '0.8rem', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
          <RotateCcw className="w-4 h-4" /> Submit Another Response
        </button>
      </div>
    );
  }

  return (
    <RespondentForm
      form={form}
      onBackToBuilder={() => {}}
      onSubmitSuccess={async (data) => {
        try {
          await fetch(`${SUPABASE_URL}/rest/v1/form_responses`, {
            method: 'POST',
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
              Prefer: 'return=minimal',
            },
            body: JSON.stringify({
              id: `resp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              form_id: formId,
              answers: data.responses,
            }),
          });
        } catch (err) {
          console.error('Failed to submit response:', err);
        }
        setIsSubmitted(true);
      }}
    />
  );
};
