import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';
import { RespondentForm } from './respondent/RespondentForm';
import { FormItem } from '../types';
import { supabase } from '../../src/lib/supabase';

interface PublicFormViewProps {
  formId: string;
}

export const PublicFormView: React.FC<PublicFormViewProps> = ({ formId }) => {
  const [form, setForm] = useState<FormItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetch live form data from the server (no auth required)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!supabase) {
          if (!cancelled) setError('Supabase not configured.');
          return;
        }
        const { data, error: dbErr } = await supabase
          .from('forms')
          .select('*')
          .eq('id', formId)
          .eq('status', 'live')
          .single();

        if (dbErr || !data) {
          if (!cancelled) setError('Form not found or no longer available.');
          return;
        }
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
        if (!cancelled) setError('Failed to load form. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [formId]);

  // Loading state
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f3f4f8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        <Loader2 className="w-8 h-8 text-[#00a8b5] animate-spin" />
        <p style={{ marginTop: '16px', fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
          Loading form...
        </p>
      </div>
    );
  }

  // Error state
  if (error || !form) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f3f4f8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: '#fef2f2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
        }}>
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
          Form Unavailable
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '360px', textAlign: 'center', lineHeight: 1.6 }}>
          {error || 'This form could not be loaded. It may have been removed or the link is invalid.'}
        </p>
      </div>
    );
  }

  // Already submitted — show success
  if (isSubmitted) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f3f4f8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: '#ecfdf5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          boxShadow: '0 0 0 8px rgba(16,185,129,0.1)',
        }}>
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
          Thank You!
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '360px', textAlign: 'center', lineHeight: 1.6, marginBottom: '24px' }}>
          Your response to <strong>{form.title}</strong> has been submitted successfully.
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            background: 'white',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#374151',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <RotateCcw className="w-4 h-4" />
          Submit Another Response
        </button>
      </div>
    );
  }

  // Render the form (always fetches fresh data from server)
  return (
    <RespondentForm
      form={form}
      onBackToBuilder={() => {}} // No-op for public view
      onSubmitSuccess={async (data) => {
        // Submit response to the server
        try {
          if (supabase) {
            await supabase.from('form_responses').insert({
              id: `resp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              form_id: formId,
              answers: data.responses,
            });
            await supabase.rpc('increment_responses_count', { form_id_param: formId }).catch(() => {});
          }
        } catch (err) {
          console.error('Failed to submit response:', err);
        }
        setIsSubmitted(true);
      }}
    />
  );
};
