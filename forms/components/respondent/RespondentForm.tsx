import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Mic,
  MicOff,
  Building,
  Lock,
  Wifi,
  Globe,
  Save,
  CheckCircle2,
  ArrowLeft,
  RotateCcw,
  Loader2,
  Calendar,
  Mail,
  Check,
  FileSignature,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FormItem, FormField } from '../../types';

interface RespondentFormProps {
  form: FormItem;
  onBackToBuilder: () => void;
  onSubmitSuccess: (data: any) => void;
}

export const RespondentForm: React.FC<RespondentFormProps> = ({
  form,
  onBackToBuilder,
  onSubmitSuccess,
}) => {
  // Dynamic form state keyed by field.id
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [hasSignature, setHasSignature] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [summarizingFieldId, setSummarizingFieldId] = useState<string | null>(null);
  const [activeMicFieldId, setActiveMicFieldId] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('EN');
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // HTML5 Signature Canvas ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  // Initialize Canvas for any digital_signature fields
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High DPI scaling
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#1e1b4b';
  }, [isSubmitted, form.fields]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  // Canvas drawing handlers
  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isDrawingRef.current = true;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleClearAll = () => {
    setFormValues({});
    clearSignature();
  };

  // Voice to text dictation for specific field
  const handleVoiceDictation = (fieldId: string) => {
    if (activeMicFieldId === fieldId) {
      setActiveMicFieldId(null);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setActiveMicFieldId(fieldId);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setFormValues((prev) => ({
          ...prev,
          [fieldId]: prev[fieldId] ? `${prev[fieldId]} ${transcript}` : transcript,
        }));
        setActiveMicFieldId(null);
      };

      recognition.onerror = () => {
        setActiveMicFieldId(null);
      };

      recognition.onend = () => {
        setActiveMicFieldId(null);
      };

      recognition.start();
    } catch {
      setActiveMicFieldId(null);
    }
  };

  // AI Summarize text refinement
  const handleAiSummarize = async (fieldId: string, currentText: string) => {
    if (!currentText || !currentText.trim()) {
      alert('Please enter some text before summarizing with AI.');
      return;
    }

    setSummarizingFieldId(fieldId);
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: currentText,
          context: `Form field: ${form.title}`,
        }),
      });
      const data = await res.json();
      if (data.summary) {
        setFormValues((prev) => ({
          ...prev,
          [fieldId]: data.summary,
        }));
      }
    } catch (err) {
      console.error('Error during AI summarization:', err);
    } finally {
      setSummarizingFieldId(null);
    }
  };

  const handleSaveDraft = () => {
    setIsDraftSaved(true);
    setTimeout(() => setIsDraftSaved(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check required fields
    for (const field of form.fields) {
      if (field.required) {
        if (field.type === 'digital_signature') {
          if (!hasSignature) {
            alert(`Please sign the "${field.label}" pad to continue.`);
            return;
          }
        } else {
          const val = formValues[field.id];
          if (!val || (typeof val === 'string' && !val.trim())) {
            alert(`Please fill in the required field: "${field.label}".`);
            return;
          }
        }
      }
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00a8b5', '#7c3aed', '#6366f1', '#10b981'],
        });
      } catch {
        // ignore
      }

      onSubmitSuccess({
        formId: form.id,
        formTitle: form.title,
        responses: formValues,
        hasSignature,
        submittedAt: new Date().toISOString(),
      });
    }, 600);
  };

  return (
    <div
      id="respondent-view-root"
      className="min-h-screen bg-[#f3f4f8] flex flex-col font-sans relative"
      style={{
        backgroundImage:
          'radial-gradient(circle, #dbe0ea 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* Top Floating App Bar */}
      <header className="h-16 bg-white/90 backdrop-blur-md border-b border-[#e5e7eb] px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-4">
          <button
            id="btn-back-to-builder"
            onClick={onBackToBuilder}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-[#4b5563] hover:text-[#111827] bg-[#f9fafb] hover:bg-[#f3f4f6] border border-[#e5e7eb] rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit Preview</span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#00a8b5] text-white flex items-center justify-center shadow-xs">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" fill="none" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" fill="none" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" fill="none" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" />
              </svg>
            </div>
            <span className="font-bold text-sm text-[#111827]">altitude Forms Portal</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="appearance-none bg-[#f9fafb] border border-[#e5e7eb] text-xs font-semibold text-[#374151] py-1.5 pl-7 pr-6 rounded-xl cursor-pointer hover:border-[#d1d5db] focus:outline-none"
            >
              <option value="EN">EN</option>
              <option value="ES">ES</option>
              <option value="FR">FR</option>
              <option value="DE">DE</option>
              <option value="JA">JA</option>
            </select>
            <Globe className="w-3.5 h-3.5 text-[#6b7280] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Save Draft */}
          <button
            id="btn-save-draft"
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#4b5563] hover:text-[#111827] bg-[#f9fafb] hover:bg-[#f3f4f6] border border-[#e5e7eb] rounded-xl transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-[#6b7280]" />
            <span>{isDraftSaved ? 'Draft Saved!' : 'Save Draft'}</span>
          </button>
        </div>
      </header>

      {/* Main Container matching Image 7 */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4 md:p-8 flex flex-col justify-center my-auto">
        {!isSubmitted ? (
          <div
            id="respondent-form-card"
            className="bg-white rounded-3xl border border-[#e5e7eb] shadow-md overflow-hidden"
          >
            {/* Top High-Tech Geometric Banner Image matching Image 7 */}
            <div className="relative h-44 w-full bg-gradient-to-tr from-[#1e1b4b] via-[#312e81] to-[#4338ca] overflow-hidden">
              <img
                src={
                  form.bannerImage ||
                  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop'
                }
                alt="Banner Geometric"
                className="w-full h-full object-cover opacity-65 mix-blend-overlay"
                referrerPolicy="no-referrer"
              />

              {/* Floating Building Icon badge in center */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl bg-white border-4 border-[#f3f4f8] shadow-sm flex items-center justify-center text-[#00a8b5]">
                <Building className="w-6 h-6" />
              </div>
            </div>

            {/* Form Content Body */}
            <form onSubmit={handleSubmit} className="p-6 md:p-8 pt-10 space-y-6">
              {/* Form Title & Description */}
              <div className="text-center space-y-2">
                <h1 className="text-xl md:text-2xl font-black text-[#111827] tracking-tight">
                  {form.title}
                </h1>
                {form.description && (
                  <p className="text-xs text-[#6b7280] leading-relaxed max-w-md mx-auto">
                    {form.description}
                  </p>
                )}
              </div>

              {/* Form Fields List (Dynamic Question Labels & Controls) */}
              <div className="space-y-5 pt-2">
                {form.fields.map((field, index) => {
                  const val = formValues[field.id] ?? '';

                  return (
                    <div
                      key={field.id}
                      id={`respondent-question-${field.id}`}
                      className="space-y-1.5"
                    >
                      {/* Dynamic Question Label */}
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor={`input-${field.id}`}
                          className="text-[11px] font-bold text-[#374151] uppercase tracking-wider font-mono flex items-center gap-1"
                        >
                          <span>{field.label}</span>
                          {field.required && (
                            <span className="text-red-500 font-bold">*</span>
                          )}
                        </label>

                        {field.aiSuggested && (
                          <span className="px-2 py-0.5 rounded-full bg-[#ecfdf5] text-[#00a8b5] text-[9px] font-bold font-mono tracking-wider">
                            AI SMART
                          </span>
                        )}
                      </div>

                      {/* Helper description text if provided */}
                      {field.helpText && (
                        <p className="text-[11px] text-[#6b7280] leading-relaxed pb-0.5">
                          {field.helpText}
                        </p>
                      )}

                      {/* Short Text Field */}
                      {field.type === 'short_text' && (
                        <div className="relative">
                          <input
                            id={`input-${field.id}`}
                            type="text"
                            required={field.required}
                            value={val}
                            onChange={(e) =>
                              handleFieldChange(field.id, e.target.value)
                            }
                            placeholder={field.placeholder || 'Your answer'}
                            className="w-full pl-4 pr-10 py-2.5 bg-white border border-[#d1d5db] rounded-xl text-xs text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:border-[#00a8b5] focus:ring-1 focus:ring-[#00a8b5] transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => handleVoiceDictation(field.id)}
                            title="Dictate with voice"
                            className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors cursor-pointer ${
                              activeMicFieldId === field.id
                                ? 'bg-red-100 text-red-600 animate-pulse'
                                : 'text-[#9ca3af] hover:text-[#4b5563]'
                            }`}
                          >
                            <Mic className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {/* Long Text Field with AI Summarize & Mic */}
                      {field.type === 'long_text' && (
                        <div className="relative border border-[#d1d5db] rounded-xl p-3 bg-white focus-within:border-[#00a8b5] focus-within:ring-1 focus-within:ring-[#00a8b5] transition-all">
                          <textarea
                            id={`input-${field.id}`}
                            rows={3}
                            required={field.required}
                            value={val}
                            onChange={(e) =>
                              handleFieldChange(field.id, e.target.value)
                            }
                            placeholder={
                              field.placeholder ||
                              'Describe the details or responses...'
                            }
                            className="w-full bg-transparent border-none text-xs text-[#111827] placeholder-[#9ca3af] resize-none focus:outline-none leading-relaxed"
                          />

                          {/* Bottom Action Pill & Mic */}
                          <div className="flex items-center justify-between pt-2 border-t border-[#f3f4f6]">
                            <button
                              type="button"
                              onClick={() => handleAiSummarize(field.id, val)}
                              disabled={
                                summarizingFieldId === field.id || !val.trim()
                              }
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ecfdf5] hover:bg-[#ede9fe] text-[#7c3aed] text-[11px] font-bold tracking-wider border border-[#a7f3d0] transition-all cursor-pointer disabled:opacity-50"
                            >
                              {summarizingFieldId === field.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Sparkles className="w-3 h-3" />
                              )}
                              <span>AI Summarize</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleVoiceDictation(field.id)}
                              className={`p-1 rounded-lg transition-colors cursor-pointer ${
                                activeMicFieldId === field.id
                                  ? 'bg-red-100 text-red-600 animate-pulse'
                                  : 'text-[#9ca3af] hover:text-[#4b5563]'
                              }`}
                            >
                              <Mic className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Email Field */}
                      {field.type === 'email' && (
                        <div className="relative">
                          <input
                            id={`input-${field.id}`}
                            type="email"
                            required={field.required}
                            value={val}
                            onChange={(e) =>
                              handleFieldChange(field.id, e.target.value)
                            }
                            placeholder={field.placeholder || 'email@domain.com'}
                            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#d1d5db] rounded-xl text-xs text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:border-[#00a8b5] focus:ring-1 focus:ring-[#00a8b5] transition-all"
                          />
                          <Mail className="w-3.5 h-3.5 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      )}

                      {/* Multiple Choice Field */}
                      {field.type === 'multiple_choice' && (
                        <div className="space-y-2 pt-1">
                          {(field.options || ['Option 1', 'Option 2']).map(
                            (opt, optIdx) => {
                              const isSelected = val === opt;
                              return (
                                <label
                                  key={optIdx}
                                  onClick={() =>
                                    handleFieldChange(field.id, opt)
                                  }
                                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                    isSelected
                                      ? 'border-[#00a8b5] bg-[#f0fdfa] text-[#00a8b5] font-semibold'
                                      : 'border-[#e5e7eb] hover:border-[#cbd5e1] text-[#374151]'
                                  }`}
                                >
                                  <div
                                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                                      isSelected
                                        ? 'border-[#00a8b5] bg-[#00a8b5]'
                                        : 'border-[#9ca3af]'
                                    }`}
                                  >
                                    {isSelected && (
                                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                    )}
                                  </div>
                                  <span className="text-xs">{opt}</span>
                                </label>
                              );
                            }
                          )}
                        </div>
                      )}

                      {/* Digital Signature Field */}
                      {field.type === 'digital_signature' && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-[#6b7280]">
                              Draw your signature using cursor or touch
                            </span>
                            <button
                              type="button"
                              id="btn-clear-signature"
                              onClick={clearSignature}
                              className="text-[10px] font-semibold text-[#6b7280] hover:text-red-600 cursor-pointer"
                            >
                              Clear signature
                            </button>
                          </div>

                          <div className="relative border-2 border-dashed border-[#a7f3d0] rounded-2xl bg-[#fafbff] h-28 overflow-hidden cursor-crosshair group">
                            <canvas
                              ref={canvasRef}
                              onMouseDown={startDrawing}
                              onMouseMove={draw}
                              onMouseUp={stopDrawing}
                              onMouseLeave={stopDrawing}
                              onTouchStart={startDrawing}
                              onTouchMove={draw}
                              onTouchEnd={stopDrawing}
                              className="w-full h-full block"
                            />

                            {/* Guideline */}
                            {!hasSignature && (
                              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                <div className="flex items-center gap-2 text-xs font-medium text-[#818cf8]/70 border-b border-dashed border-[#a5b4fc] pb-1 px-4">
                                  <span>✍️ Draw signature here</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Calendar Booking Field */}
                      {field.type === 'calendar_booking' && (
                        <div className="relative">
                          <input
                            id={`input-${field.id}`}
                            type="datetime-local"
                            required={field.required}
                            value={val}
                            onChange={(e) =>
                              handleFieldChange(field.id, e.target.value)
                            }
                            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#d1d5db] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#00a8b5] focus:ring-1 focus:ring-[#00a8b5] transition-all cursor-pointer"
                          />
                          <Calendar className="w-3.5 h-3.5 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      )}

                      {/* Voice Input Field */}
                      {field.type === 'voice_input' && (
                        <div className="relative flex items-center gap-2">
                          <input
                            id={`input-${field.id}`}
                            type="text"
                            required={field.required}
                            value={val}
                            onChange={(e) =>
                              handleFieldChange(field.id, e.target.value)
                            }
                            placeholder={field.placeholder || 'Voice dictated message'}
                            className="flex-1 pl-4 pr-4 py-2.5 bg-white border border-[#d1d5db] rounded-xl text-xs text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:border-[#00a8b5]"
                          />
                          <button
                            type="button"
                            onClick={() => handleVoiceDictation(field.id)}
                            className={`p-2.5 rounded-xl border transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                              activeMicFieldId === field.id
                                ? 'bg-red-50 border-red-300 text-red-600 animate-pulse'
                                : 'bg-[#ecfdf5] border-[#a7f3d0] text-[#00a8b5] hover:bg-[#d1fae5]'
                            }`}
                          >
                            <Mic className="w-3.5 h-3.5" />
                            <span>{activeMicFieldId === field.id ? 'Listening...' : 'Dictate'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons matching Image 7 */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f3f4f6]">
                <button
                  type="button"
                  id="btn-clear-form"
                  onClick={handleClearAll}
                  className="px-5 py-2.5 text-xs font-semibold text-[#4b5563] hover:text-[#111827] bg-[#f9fafb] hover:bg-[#f3f4f6] border border-[#e5e7eb] rounded-xl transition-all cursor-pointer"
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  id="btn-submit-form"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#00a8b5] hover:bg-[#008894] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Form'}</span>
                </button>
              </div>
            </form>

            {/* Bottom Footer Information matching Image 7 */}
            <div className="bg-[#fafbfc] border-t border-[#e5e7eb] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#6b7280]">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-emerald-600 font-semibold font-mono">
                  <Wifi className="w-3.5 h-3.5" />
                  <span>Works Offline</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <Lock className="w-3.5 h-3.5 text-[#00a8b5]" />
                  <span>256-Bit Encrypted</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[#9ca3af] font-mono text-[10px]">
                <span>altitude Forms Secure Infrastructure</span>
              </div>
            </div>
          </div>
        ) : (
          /* Submission Success Card */
          <div className="bg-white rounded-3xl border border-[#e5e7eb] p-8 shadow-md text-center space-y-5 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-[#111827]">
                Submission Received!
              </h2>
              <p className="text-xs text-[#6b7280] max-w-sm mx-auto leading-relaxed">
                Thank you for completing <strong>{form.title}</strong>. Your response has been securely encrypted and synchronized to the workspace stream.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  handleClearAll();
                }}
                className="flex items-center gap-1.5 px-4 py-2 border border-[#e5e7eb] text-xs font-semibold text-[#374151] rounded-xl hover:bg-[#f9fafb] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Submit Another Response</span>
              </button>
              <button
                onClick={onBackToBuilder}
                className="flex items-center gap-1.5 px-5 py-2 bg-[#00a8b5] text-white text-xs font-bold rounded-xl hover:bg-[#008894] cursor-pointer"
              >
                <span>Back to Builder</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
