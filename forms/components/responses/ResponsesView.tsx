import React, { useState, useEffect } from 'react';
import {
  FileText,
  Clock,
  User,
  Mail,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Inbox,
  Download,
  Search,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../../src/lib/auth';
import { supabase } from '../../../src/lib/supabase';
import { FormItem } from '../../types';

interface ResponseEntry {
  id: string;
  answers: Record<string, any>;
  submittedAt: string;
}

interface ResponsesViewProps {
  forms: FormItem[];
  activeFormId: string;
}

export const ResponsesView: React.FC<ResponsesViewProps> = ({ forms, activeFormId }) => {
  const { user } = useAuth();
  const [responses, setResponses] = useState<ResponseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFormId, setSelectedFormId] = useState(activeFormId);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const getToken = async (): Promise<string> => {
    try {
      const { data } = await supabase!.auth.getSession();
      return data.session?.access_token || '';
    } catch { return ''; }
  };

  const fetchResponses = async (formId: string) => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`/api/forms/${formId}/responses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setResponses(data.responses || []);
      } else {
        setResponses([]);
      }
    } catch {
      setResponses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedFormId) fetchResponses(selectedFormId);
  }, [selectedFormId]);

  const selectedForm = forms.find(f => f.id === selectedFormId);

  // Filter responses by search
  const filteredResponses = responses.filter(r => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return JSON.stringify(r.answers).toLowerCase().includes(q);
  });

  // Get field label by ID
  const getFieldLabel = (fieldId: string): string => {
    if (!selectedForm) return fieldId;
    const field = selectedForm.fields.find(f => f.id === fieldId);
    return field?.label || fieldId;
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#fbfbfe] p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#111827] flex items-center gap-3">
              <Inbox className="w-7 h-7 text-[#00a8b5]" />
              Form Responses
            </h1>
            <p className="text-xs text-[#6b7280] mt-1">
              View all submissions from your published forms
            </p>
          </div>
          <button
            onClick={() => fetchResponses(selectedFormId)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#374151] bg-white border border-[#e5e7eb] rounded-xl hover:bg-[#f9fafb] cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Form selector & Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedFormId}
            onChange={(e) => setSelectedFormId(e.target.value)}
            className="px-4 py-2.5 bg-white border border-[#e5e7eb] rounded-xl text-xs font-semibold text-[#111827] focus:outline-none focus:border-[#00a8b5] cursor-pointer min-w-[240px]"
          >
            {forms.map(f => (
              <option key={f.id} value={f.id}>
                {f.title} ({f.responsesCount} responses)
              </option>
            ))}
          </select>

          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-[#9ca3af] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search responses..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e5e7eb] rounded-xl text-xs text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:border-[#00a8b5]"
            />
          </div>
        </div>

        {/* Summary card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5 shadow-2xs">
            <div className="text-xs font-semibold text-[#6b7280]">Total Responses</div>
            <div className="text-2xl font-black text-[#111827] mt-1">{responses.length}</div>
          </div>
          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5 shadow-2xs">
            <div className="text-xs font-semibold text-[#6b7280]">Form Fields</div>
            <div className="text-2xl font-black text-[#111827] mt-1">{selectedForm?.fields.length || 0}</div>
          </div>
          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5 shadow-2xs">
            <div className="text-xs font-semibold text-[#6b7280]">Last Submission</div>
            <div className="text-sm font-bold text-[#111827] mt-1">
              {responses.length > 0
                ? new Date(responses[0].submittedAt).toLocaleString()
                : 'No submissions yet'}
            </div>
          </div>
        </div>

        {/* Responses list */}
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3">
            <Loader2 className="w-5 h-5 text-[#00a8b5] animate-spin" />
            <span className="text-sm text-[#6b7280]">Loading responses...</span>
          </div>
        ) : filteredResponses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Inbox className="w-12 h-12 text-[#d1d5db] mb-4" />
            <h3 className="text-sm font-bold text-[#111827] mb-1">No Responses Yet</h3>
            <p className="text-xs text-[#6b7280] max-w-sm">
              {responses.length === 0
                ? 'Share your form URL to start collecting submissions.'
                : 'No responses match your search.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredResponses.map((response, idx) => {
              const isExpanded = expandedId === response.id;
              return (
                <div
                  key={response.id}
                  className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden shadow-2xs hover:shadow-xs transition-all"
                >
                  {/* Response header */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : response.id)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left cursor-pointer hover:bg-[#fafbfc] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-xl bg-[#f0fdfa] border border-[#d1fae5] flex items-center justify-center text-[#00a8b5] font-bold text-xs">
                        #{idx + 1}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#111827]">
                          Response {idx + 1}
                          {response.answers && Object.values(response.answers)[0] && (
                            <span className="ml-2 text-xs font-normal text-[#6b7280]">
                              — {String(Object.values(response.answers)[0]).slice(0, 50)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-[11px] text-[#6b7280] font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(response.submittedAt).toLocaleString()}
                          </span>
                          <span className="text-[11px] text-[#9ca3af] font-mono">
                            {Object.keys(response.answers || {}).length} fields answered
                          </span>
                        </div>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-[#9ca3af]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#9ca3af]" />
                    )}
                  </button>

                  {/* Expanded answers */}
                  {isExpanded && (
                    <div className="px-6 pb-5 pt-2 border-t border-[#f3f4f6] bg-[#fafbfc]">
                      <div className="space-y-3">
                        {Object.entries(response.answers || {}).map(([fieldId, value]) => (
                          <div key={fieldId} className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider font-mono">
                              {getFieldLabel(fieldId)}
                            </label>
                            <div className="px-3.5 py-2.5 bg-white border border-[#e5e7eb] rounded-xl text-xs text-[#111827]">
                              {value ? String(value) : <span className="text-[#9ca3af] italic">No answer</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
