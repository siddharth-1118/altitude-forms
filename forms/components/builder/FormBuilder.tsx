import React, { useState } from 'react';
import {
  Search,
  AlignLeft,
  AlignJustify,
  Mail,
  CheckSquare,
  FileSignature,
  Calendar,
  Languages,
  Mic,
  Plus,
  Trash2,
  Copy,
  Sparkles,
  X,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Edit3,
  HelpCircle,
  Settings2,
  Check,
  Sliders,
  GitBranch,
} from 'lucide-react';
import { FormField, FormItem, FieldType } from '../../types';
import { AISidekick } from './AISidekick';
import { FormSettingsTab } from './FormSettingsTab';
import { FormLogicTab } from './FormLogicTab';

interface FormBuilderProps {
  form: FormItem;
  onChangeForm: (updated: FormItem) => void;
  onOpenLivePreview: () => void;
  subTab?: 'build' | 'settings' | 'logic';
  onSelectSubTab?: (tab: 'build' | 'settings' | 'logic') => void;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({
  form,
  onChangeForm,
  onOpenLivePreview,
  subTab = 'build',
  onSelectSubTab,
}) => {
  const [elementSearch, setElementSearch] = useState('');
  const [showAiSuggestedCard, setShowAiSuggestedCard] = useState(true);
  const [activeFieldId, setActiveFieldId] = useState<string | null>(
    form.fields.length > 0 ? form.fields[0].id : null
  );

  // If subTab is settings or logic, render those dedicated views
  if (subTab === 'settings') {
    return (
      <FormSettingsTab
        form={form}
        onChangeForm={onChangeForm}
        onOpenLivePreview={onOpenLivePreview}
        onSelectSubTab={onSelectSubTab}
      />
    );
  }

  if (subTab === 'logic') {
    return (
      <FormLogicTab
        form={form}
        onChangeForm={onChangeForm}
        onOpenLivePreview={onOpenLivePreview}
        onSelectSubTab={onSelectSubTab}
      />
    );
  }

  // Basic Field Palette Items
  const basicFields = [
    { type: 'short_text' as FieldType, label: 'Short Text', icon: AlignLeft },
    { type: 'long_text' as FieldType, label: 'Long Text', icon: AlignJustify },
    { type: 'email' as FieldType, label: 'Email', icon: Mail },
    { type: 'multiple_choice' as FieldType, label: 'Multiple Choice', icon: CheckSquare },
  ];

  // Advanced Field Palette Items
  const advancedFields = [
    { type: 'digital_signature' as FieldType, label: 'Digital Signature', icon: FileSignature },
    { type: 'calendar_booking' as FieldType, label: 'Calendar Booking', icon: Calendar },
    { type: 'multi_language' as FieldType, label: 'Multi-language', icon: Languages },
    { type: 'voice_input' as FieldType, label: 'Voice Input', icon: Mic },
  ];

  const handleAddField = (type: FieldType, insertAfterIndex?: number) => {
    let newField: FormField;
    const id = `f_${Date.now()}`;

    switch (type) {
      case 'short_text':
        newField = {
          id,
          type,
          label: 'Untitled Question',
          placeholder: 'Short answer text',
          required: false,
        };
        break;
      case 'long_text':
        newField = {
          id,
          type,
          label: 'Detailed Description',
          placeholder: 'Enter your response...',
          required: false,
        };
        break;
      case 'email':
        newField = {
          id,
          type,
          label: 'Email Address',
          placeholder: 'name@example.com',
          required: true,
        };
        break;
      case 'multiple_choice':
        newField = {
          id,
          type,
          label: 'Select an Option',
          options: ['Option 1', 'Option 2', 'Option 3'],
          required: false,
        };
        break;
      case 'digital_signature':
        newField = {
          id,
          type,
          label: 'Digital Signature Authorization',
          placeholder: 'Sign Here',
          required: true,
          helpText: 'I certify that the information provided is accurate and authentic.',
        };
        break;
      case 'calendar_booking':
        newField = {
          id,
          type,
          label: 'Preferred Date & Time',
          placeholder: 'Choose date and time',
          required: false,
        };
        break;
      case 'multi_language':
        newField = {
          id,
          type,
          label: 'Preferred Language / Localization',
          placeholder: 'Select primary language',
          required: false,
        };
        break;
      case 'voice_input':
        newField = {
          id,
          type,
          label: 'Spoken Feedback (Voice Transcription)',
          placeholder: 'Click mic to dictate',
          required: false,
        };
        break;
    }

    const updatedFields = [...form.fields];
    if (insertAfterIndex !== undefined) {
      updatedFields.splice(insertAfterIndex + 1, 0, newField);
    } else {
      updatedFields.push(newField);
    }

    onChangeForm({
      ...form,
      fields: updatedFields,
    });
    setActiveFieldId(id);
  };

  const handleAddAiSuggestedAppointment = () => {
    const apptField: FormField = {
      id: `f_appt_${Date.now()}`,
      type: 'multiple_choice',
      label: 'Appointment Preference',
      options: ['Morning (9AM - 12PM)', 'Afternoon (1PM - 5PM)', 'Evening (5PM - 8PM)'],
      aiSuggested: true,
      required: false,
    };
    onChangeForm({
      ...form,
      fields: [...form.fields, apptField],
    });
    setShowAiSuggestedCard(false);
    setActiveFieldId(apptField.id);
  };

  const handleAddFieldsFromAi = (
    newFields: FormField[],
    suggestedTitle?: string,
    suggestedDescription?: string
  ) => {
    onChangeForm({
      ...form,
      title: suggestedTitle || form.title,
      description: suggestedDescription || form.description,
      fields: [...form.fields, ...newFields],
    });
    if (newFields.length > 0) {
      setActiveFieldId(newFields[0].id);
    }
  };

  const handleUpdateField = (id: string, updates: Partial<FormField>) => {
    onChangeForm({
      ...form,
      fields: form.fields.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    });
  };

  const handleDeleteField = (id: string) => {
    onChangeForm({
      ...form,
      fields: form.fields.filter((f) => f.id !== id),
    });
    if (activeFieldId === id) {
      setActiveFieldId(null);
    }
  };

  const handleDuplicateField = (field: FormField) => {
    const cloned: FormField = {
      ...field,
      id: `f_${Date.now()}`,
      label: `${field.label} (Copy)`,
      options: field.options ? [...field.options] : undefined,
    };
    const idx = form.fields.findIndex((f) => f.id === field.id);
    const updated = [...form.fields];
    updated.splice(idx + 1, 0, cloned);
    onChangeForm({ ...form, fields: updated });
    setActiveFieldId(cloned.id);
  };

  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= form.fields.length) return;
    const updated = [...form.fields];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);
    onChangeForm({ ...form, fields: updated });
  };

  // Option management for multiple choice
  const handleAddOption = (fieldId: string) => {
    const field = form.fields.find((f) => f.id === fieldId);
    if (!field) return;
    const currentOptions = field.options || ['Option 1', 'Option 2'];
    const nextOption = `Option ${currentOptions.length + 1}`;
    handleUpdateField(fieldId, {
      options: [...currentOptions, nextOption],
    });
  };

  const handleUpdateOption = (fieldId: string, optIndex: number, val: string) => {
    const field = form.fields.find((f) => f.id === fieldId);
    if (!field || !field.options) return;
    const updatedOptions = [...field.options];
    updatedOptions[optIndex] = val;
    handleUpdateField(fieldId, { options: updatedOptions });
  };

  const handleDeleteOption = (fieldId: string, optIndex: number) => {
    const field = form.fields.find((f) => f.id === fieldId);
    if (!field || !field.options) return;
    const updatedOptions = field.options.filter((_, idx) => idx !== optIndex);
    handleUpdateField(fieldId, { options: updatedOptions });
  };

  const filteredBasic = basicFields.filter((f) =>
    f.label.toLowerCase().includes(elementSearch.toLowerCase())
  );
  const filteredAdvanced = advancedFields.filter((f) =>
    f.label.toLowerCase().includes(elementSearch.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-[#fbfbfe]">
      {/* Left Elements Palette Sidebar matching Image 1 */}
      <aside
        id="builder-palette"
        className="w-full lg:w-68 bg-white border-b lg:border-b-0 lg:border-r border-[#e5e7eb] p-4 flex flex-col sm:flex-row lg:flex-col gap-4 lg:gap-5 overflow-y-auto shrink-0 select-none h-48 lg:h-full"
      >
        {/* Search Elements */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="search-elements-input"
            type="text"
            value={elementSearch}
            onChange={(e) => setElementSearch(e.target.value)}
            placeholder="Search elements..."
            className="w-full pl-8.5 pr-3 py-2 bg-white border border-[#e5e7eb] rounded-lg text-xs text-[#1f2937] placeholder-[#9ca3af] focus:outline-none focus:border-[#00a8b5]"
          />
        </div>

        {/* Basic Fields */}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280] mb-2.5">
            Basic Fields
          </div>
          <div className="grid grid-cols-2 gap-2">
            {filteredBasic.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.type}
                  id={`btn-add-${item.type}`}
                  onClick={() => handleAddField(item.type)}
                  className="flex flex-col items-center justify-center p-3 rounded-lg border border-[#e5e7eb] bg-white hover:bg-[#f0fdfa] hover:border-[#a7f3d0] transition-all cursor-pointer group text-center gap-1.5 shadow-2xs hover:shadow-xs active:scale-[0.98]"
                >
                  <Icon className="w-4 h-4 text-[#4b5563] group-hover:text-[#00a8b5] transition-colors" />
                  <span className="text-[11px] font-medium text-[#374151] group-hover:text-[#111827]">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Advanced Fields */}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280] mb-2.5">
            Advanced Modules
          </div>
          <div className="flex flex-col gap-2">
            {filteredAdvanced.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.type}
                  id={`btn-add-${item.type}`}
                  onClick={() => handleAddField(item.type)}
                  className="flex items-center gap-3 p-2.5 rounded-lg border border-[#e5e7eb] bg-white hover:bg-[#f0fdfa] hover:border-[#a7f3d0] transition-all cursor-pointer group shadow-2xs hover:shadow-xs text-left"
                >
                  <div className="w-7 h-7 rounded-md bg-[#ecfdf5] text-[#00a8b5] flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-medium text-[#374151] group-hover:text-[#111827]">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Add Question Button */}
        <div className="pt-2 border-t border-[#f3f4f6]">
          <button
            onClick={() => handleAddField('short_text')}
            className="w-full py-2.5 px-3 bg-[#ecfdf5] hover:bg-[#d1fae5] text-[#00a8b5] text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </button>
        </div>
      </aside>

      {/* Center Canvas with Blueprint Grid matching Image 1 */}
      <main
        id="builder-canvas-container"
        className="flex-1 overflow-y-auto p-6 md:p-8 relative bg-[#fbfbfe]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #e2e8f0 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      >
        <div className="max-w-2xl mx-auto space-y-4 pb-24">
          {/* Quick Sub-Tab Switcher on Canvas */}
          {onSelectSubTab && (
            <div className="flex items-center justify-between bg-white border border-[#e5e7eb] rounded-2xl p-2 shadow-2xs">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  id="canvas-tab-build"
                  onClick={() => onSelectSubTab('build')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    subTab === 'build'
                      ? 'bg-[#00a8b5] text-white shadow-2xs'
                      : 'text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6]'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Build</span>
                </button>
                <button
                  type="button"
                  id="canvas-tab-settings"
                  onClick={() => onSelectSubTab('settings')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    subTab === 'settings'
                      ? 'bg-[#00a8b5] text-white shadow-2xs'
                      : 'text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6]'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Settings</span>
                </button>
                <button
                  type="button"
                  id="canvas-tab-logic"
                  onClick={() => onSelectSubTab('logic')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    subTab === 'logic'
                      ? 'bg-[#00a8b5] text-white shadow-2xs'
                      : 'text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6]'
                  }`}
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>Logic</span>
                </button>
              </div>

              <div className="flex items-center gap-2 pr-2 text-xs font-mono text-[#6b7280]">
                <span className="font-semibold text-[#111827]">{form.fields.length}</span> questions
              </div>
            </div>
          )}

          {/* Card 1: Title & Description */}
          <div
            id="form-title-card"
            className="bg-white rounded-2xl border border-[#e5e7eb] p-6 shadow-2xs transition-all hover:border-[#d1d5db]"
          >
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#9ca3af] font-mono">
                Form Title
              </label>
              <input
                id="form-title-input"
                type="text"
                value={form.title}
                onChange={(e) => onChangeForm({ ...form, title: e.target.value })}
                placeholder="Untitled Form"
                className="w-full text-2xl font-black text-[#111827] placeholder-[#9ca3af] focus:outline-none border-b border-transparent focus:border-[#00a8b5] pb-1 transition-all"
              />
            </div>
            <div className="space-y-1 mt-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#9ca3af] font-mono">
                Description / Instructions
              </label>
              <input
                id="form-description-input"
                type="text"
                value={form.description}
                onChange={(e) => onChangeForm({ ...form, description: e.target.value })}
                placeholder="Form description..."
                className="w-full text-xs text-[#6b7280] placeholder-[#9ca3af] focus:outline-none border-b border-transparent focus:border-[#00a8b5] pt-1 pb-1 transition-all"
              />
            </div>
          </div>

          {/* Form Fields Cards List */}
          {form.fields.map((field, idx) => {
            const isActive = activeFieldId === field.id;
            return (
              <div
                key={field.id}
                id={`form-field-card-${field.id}`}
                onClick={() => setActiveFieldId(field.id)}
                className={`bg-white rounded-2xl border p-5 shadow-2xs transition-all relative group ${
                  isActive
                    ? 'border-[#00a8b5] ring-2 ring-[#00a8b5]/20 shadow-sm'
                    : 'border-[#e5e7eb] hover:border-[#cbd5e1]'
                }`}
              >
                {/* Field Header: Reordering, Question Label input, Required Badge & Actions */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-1">
                    {/* Move Up / Down Buttons */}
                    <div className="flex flex-col -space-y-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveField(idx, 'up');
                        }}
                        className="p-0.5 text-[#9ca3af] hover:text-[#111827] disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                        title="Move question up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === form.fields.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveField(idx, 'down');
                        }}
                        className="p-0.5 text-[#9ca3af] hover:text-[#111827] disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                        title="Move question down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-xs font-mono font-bold text-[#9ca3af] select-none">
                      {idx + 1}.
                    </span>

                    {/* Question Label Input */}
                    <div className="flex-1 relative flex items-center">
                      <input
                        id={`field-label-${field.id}`}
                        type="text"
                        value={field.label}
                        onChange={(e) =>
                          handleUpdateField(field.id, { label: e.target.value })
                        }
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Type question label..."
                        className="w-full font-bold text-sm text-[#111827] placeholder-[#9ca3af] px-2 py-1 rounded-lg border border-transparent hover:border-[#e5e7eb] focus:border-[#00a8b5] focus:bg-white focus:outline-none transition-all"
                      />
                      {field.required && (
                        <span className="text-red-500 text-sm font-bold ml-1 select-none">
                          *
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Actions Toolbar */}
                  <div className="flex items-center gap-1.5">
                    {/* Required Toggle */}
                    <button
                      type="button"
                      id={`btn-toggle-req-${field.id}`}
                      title={field.required ? 'Required field' : 'Mark as required'}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateField(field.id, { required: !field.required });
                      }}
                      className={`px-2 py-1 text-[10px] font-bold rounded-lg cursor-pointer transition-colors ${
                        field.required
                          ? 'bg-red-50 text-red-600 border border-red-200'
                          : 'bg-[#f3f4f6] text-[#6b7280] hover:text-[#111827] hover:bg-[#e5e7eb]'
                      }`}
                    >
                      {field.required ? 'Required *' : 'Optional'}
                    </button>

                    {/* Field Type Selector */}
                    <select
                      value={field.type}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        handleUpdateField(field.id, {
                          type: e.target.value as FieldType,
                          options:
                            e.target.value === 'multiple_choice' && !field.options
                              ? ['Option 1', 'Option 2', 'Option 3']
                              : field.options,
                        });
                      }}
                      className="text-[11px] font-semibold bg-[#f9fafb] border border-[#e5e7eb] rounded-lg px-2 py-1 text-[#374151] focus:outline-none focus:border-[#00a8b5] cursor-pointer"
                    >
                      <option value="short_text">Short Text</option>
                      <option value="long_text">Long Text</option>
                      <option value="email">Email</option>
                      <option value="multiple_choice">Multiple Choice</option>
                      <option value="digital_signature">Digital Signature</option>
                      <option value="calendar_booking">Calendar Booking</option>
                      <option value="voice_input">Voice Input</option>
                      <option value="multi_language">Multi-Language</option>
                    </select>

                    {/* Duplicate */}
                    <button
                      type="button"
                      id={`btn-dup-${field.id}`}
                      title="Duplicate field"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicateField(field);
                      }}
                      className="p-1.5 text-[#6b7280] hover:text-[#111827] rounded-lg hover:bg-[#f3f4f6] cursor-pointer transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      id={`btn-del-${field.id}`}
                      title="Delete field"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteField(field.id);
                      }}
                      className="p-1.5 text-[#6b7280] hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Subtitle / Help text input when active */}
                {isActive && (
                  <div className="mb-3 px-2">
                    <input
                      type="text"
                      value={field.helpText || ''}
                      onChange={(e) =>
                        handleUpdateField(field.id, { helpText: e.target.value })
                      }
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Add description / helper text for respondents (optional)..."
                      className="w-full text-xs text-[#6b7280] placeholder-[#9ca3af] bg-transparent border-b border-[#f3f4f6] focus:border-[#00a8b5] pb-1 focus:outline-none transition-all"
                    />
                  </div>
                )}

                {/* Field Representation / Live Controls inside Builder */}
                {field.type === 'short_text' && (
                  <div className="mt-2 px-2">
                    <div className="text-xs text-[#9ca3af] border-b border-dashed border-[#d1d5db] pb-2 font-mono">
                      {field.placeholder || 'Short answer text'}
                    </div>
                  </div>
                )}

                {field.type === 'long_text' && (
                  <div className="mt-2 px-2">
                    <div className="text-xs text-[#9ca3af] border border-dashed border-[#d1d5db] rounded-xl p-3 h-16 font-mono">
                      {field.placeholder || 'Long answer text...'}
                    </div>
                  </div>
                )}

                {field.type === 'email' && (
                  <div className="mt-2 px-2">
                    <div className="text-xs text-[#9ca3af] border-b border-dashed border-[#d1d5db] pb-2 font-mono flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#9ca3af]" />
                      <span>{field.placeholder || 'email@domain.com'}</span>
                    </div>
                  </div>
                )}

                {field.type === 'multiple_choice' && (
                  <div className="mt-2 px-2 space-y-2">
                    {(field.options || ['Option 1', 'Option 2', 'Option 3']).map(
                      (opt, optIdx) => (
                        <div
                          key={optIdx}
                          className="flex items-center gap-2 text-xs text-[#374151] group/opt"
                        >
                          <div className="w-3.5 h-3.5 rounded-full border border-[#9ca3af] shrink-0" />
                          <input
                            type="text"
                            value={opt}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              handleUpdateOption(field.id, optIdx, e.target.value)
                            }
                            className="flex-1 px-2 py-1 rounded border border-transparent hover:border-[#e5e7eb] focus:border-[#00a8b5] focus:outline-none text-xs text-[#111827]"
                          />
                          {(field.options || []).length > 1 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteOption(field.id, optIdx);
                              }}
                              className="text-[#9ca3af] hover:text-red-500 p-1 opacity-0 group-hover/opt:opacity-100 transition-opacity cursor-pointer"
                              title="Delete option"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      )
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddOption(field.id);
                      }}
                      className="text-xs font-semibold text-[#00a8b5] hover:text-[#008894] flex items-center gap-1 mt-2 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add option</span>
                    </button>
                  </div>
                )}

                {field.type === 'digital_signature' && (
                  <div className="mt-2 px-2">
                    <div className="border border-dashed border-[#a7f3d0] bg-[#f0fdfa] rounded-xl p-4 text-center text-xs text-[#00a8b5] flex items-center justify-center gap-2">
                      <FileSignature className="w-4 h-4" />
                      <span>Digital Signature Canvas Pad</span>
                    </div>
                  </div>
                )}

                {field.type === 'calendar_booking' && (
                  <div className="mt-2 px-2">
                    <div className="border border-dashed border-[#e5e7eb] rounded-xl p-3 text-xs text-[#6b7280] flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#00a8b5]" />
                      <span>Date and time scheduling widget</span>
                    </div>
                  </div>
                )}

                {field.type === 'voice_input' && (
                  <div className="mt-2 px-2">
                    <div className="border border-dashed border-[#e5e7eb] rounded-xl p-3 text-xs text-[#6b7280] flex items-center gap-2">
                      <Mic className="w-4 h-4 text-[#00a8b5]" />
                      <span>Speech-to-Text Transcription Enabled</span>
                    </div>
                  </div>
                )}

                {field.type === 'multi_language' && (
                  <div className="mt-2 px-2">
                    <div className="border border-dashed border-[#e5e7eb] rounded-xl p-3 text-xs text-[#6b7280] flex items-center gap-2">
                      <Languages className="w-4 h-4 text-[#00a8b5]" />
                      <span>Multi-language localization selector</span>
                    </div>
                  </div>
                )}

                {/* Inline Add Field Bar */}
                {isActive && (
                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Insert question:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {basicFields.map((bf) => (
                        <button
                          key={bf.type}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddField(bf.type, idx);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 hover:bg-[#00a8b5]/10 border border-slate-200 hover:border-[#00a8b5] text-slate-600 hover:text-[#00a8b5] text-[10px] font-semibold rounded-lg transition-all cursor-pointer active:scale-95"
                        >
                          <Plus className="w-3 h-3" />
                          <span>{bf.label}</span>
                        </button>
                      ))}
                      {advancedFields.slice(0, 2).map((af) => (
                        <button
                          key={af.type}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddField(af.type, idx);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 hover:bg-[#00a8b5]/10 border border-slate-200 hover:border-[#00a8b5] text-slate-600 hover:text-[#00a8b5] text-[10px] font-semibold rounded-lg transition-all cursor-pointer active:scale-95"
                        >
                          <Plus className="w-3 h-3" />
                          <span>{af.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Card 4: Dropzone matching Image 1 */}
          <div
            id="dropzone-area"
            onClick={() => handleAddField('short_text')}
            className="border-2 border-dashed border-[#d1d5db] hover:border-[#00a8b5] rounded-2xl p-8 text-center bg-[#fafafc] hover:bg-[#f5f6ff] transition-all cursor-pointer group flex flex-col items-center justify-center gap-2"
          >
            <div className="w-9 h-9 rounded-full bg-white border border-[#e5e7eb] group-hover:border-[#00a8b5] group-hover:text-[#00a8b5] text-[#6b7280] flex items-center justify-center shadow-2xs transition-all">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#6b7280] group-hover:text-[#00a8b5] transition-colors">
              Click or select from palette to add questions
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

