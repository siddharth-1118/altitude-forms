import React, { useState } from 'react';
import {
  GitBranch,
  Plus,
  Trash2,
  Check,
  Zap,
  ArrowRight,
  Sliders,
  Sparkles,
  Eye,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  HelpCircle,
  Edit3,
} from 'lucide-react';
import { FormItem, LogicRule, FormField } from '../../types';

interface FormLogicTabProps {
  form: FormItem;
  onChangeForm: (updated: FormItem) => void;
  onOpenLivePreview?: () => void;
  onSelectSubTab?: (tab: 'build' | 'settings' | 'logic') => void;
}

export const FormLogicTab: React.FC<FormLogicTabProps> = ({
  form,
  onChangeForm,
  onOpenLivePreview,
  onSelectSubTab,
}) => {
  // Fallback initial logic rules if none exist
  const initialRules: LogicRule[] = form.logicRules || [
    {
      id: 'rule-1',
      name: 'Show Legal Entity DBA when Business name provided',
      fieldId: form.fields[0]?.id || 'f-legal-entity',
      condition: 'is_filled',
      value: '',
      action: 'show_field',
      targetFieldId: form.fields[1]?.id || 'f-dba',
      enabled: true,
    },
    {
      id: 'rule-2',
      name: 'Require Authorization Signature before Final Submit',
      fieldId: form.fields[form.fields.length - 1]?.id || 'f-digital-signature',
      condition: 'is_filled',
      value: '',
      action: 'require_field',
      targetFieldId: form.fields[form.fields.length - 1]?.id || 'f-digital-signature',
      enabled: true,
    },
  ];

  const [rules, setRules] = useState<LogicRule[]>(initialRules);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [testSimulatorValues, setTestSimulatorValues] = useState<Record<string, string>>({});

  // New Rule draft state
  const [draftName, setDraftName] = useState('New Conditional Branch');
  const [draftFieldId, setDraftFieldId] = useState(form.fields[0]?.id || '');
  const [draftCondition, setDraftCondition] = useState<LogicRule['condition']>('equals');
  const [draftValue, setDraftValue] = useState('');
  const [draftAction, setDraftAction] = useState<LogicRule['action']>('show_field');
  const [draftTargetFieldId, setDraftTargetFieldId] = useState(
    form.fields[1]?.id || form.fields[0]?.id || ''
  );

  const selectedTriggerField = form.fields.find((f) => f.id === draftFieldId);

  const handleToggleRule = (ruleId: string) => {
    const updated = rules.map((r) =>
      r.id === ruleId ? { ...r, enabled: !r.enabled } : r
    );
    setRules(updated);
    onChangeForm({ ...form, logicRules: updated });
  };

  const handleDeleteRule = (ruleId: string) => {
    const updated = rules.filter((r) => r.id !== ruleId);
    setRules(updated);
    onChangeForm({ ...form, logicRules: updated });
  };

  const handleSaveNewRule = () => {
    if (!draftFieldId) return;

    const newRule: LogicRule = {
      id: `rule_${Date.now()}`,
      name: draftName || 'Conditional Action Rule',
      fieldId: draftFieldId,
      condition: draftCondition,
      value: draftValue,
      action: draftAction,
      targetFieldId: draftTargetFieldId,
      enabled: true,
    };

    const updated = [...rules, newRule];
    setRules(updated);
    onChangeForm({ ...form, logicRules: updated });
    setIsCreatingNew(false);

    // Reset draft fields
    setDraftName('New Conditional Branch');
    setDraftValue('');
  };

  const handleAddAiSuggestedRule = () => {
    const aiRule: LogicRule = {
      id: `rule_ai_${Date.now()}`,
      name: 'AI Smart Branch: High Priority Escalation',
      fieldId: form.fields[0]?.id || 'f-legal-entity',
      condition: 'contains',
      value: 'Enterprise',
      action: 'send_email_alert',
      targetMessage: 'Trigger VIP Fast-Track workflow on submission',
      enabled: true,
    };
    const updated = [...rules, aiRule];
    setRules(updated);
    onChangeForm({ ...form, logicRules: updated });
  };

  // Helper to format labels
  const getFieldLabel = (fieldId?: string) => {
    const field = form.fields.find((f) => f.id === fieldId);
    return field ? field.label : fieldId || 'Unknown Field';
  };

  return (
    <div id="form-logic-tab-root" className="flex-1 overflow-y-auto bg-[#fbfbfe] p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Quick Sub-Tab Switcher */}
        {onSelectSubTab && (
          <div className="flex items-center justify-between bg-white border border-[#e5e7eb] rounded-2xl p-2 shadow-2xs">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                id="logic-tab-build"
                onClick={() => onSelectSubTab('build')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6] transition-all cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Build</span>
              </button>
              <button
                type="button"
                id="logic-tab-settings"
                onClick={() => onSelectSubTab('settings')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6] transition-all cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Settings</span>
              </button>
              <button
                type="button"
                id="logic-tab-logic"
                onClick={() => onSelectSubTab('logic')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#00a8b5] text-white shadow-2xs transition-all cursor-pointer"
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>Logic</span>
              </button>
            </div>

            <div className="flex items-center gap-2 pr-2 text-xs font-mono text-[#6b7280]">
              <span>Editing: <strong className="text-[#111827]">{form.title}</strong></span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#e5e7eb]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00a8b5] uppercase tracking-wider">
              <GitBranch className="w-3.5 h-3.5" />
              <span>Logic &amp; Branching Engine</span>
            </div>
            <h1 className="text-2xl font-black text-[#111827] tracking-tight mt-1">
              Conditional Logic Rules
            </h1>
            <p className="text-xs text-[#6b7280]">
              Create dynamic paths, hide/show questions, or trigger actions based on respondent answers in <strong>{form.title}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleAddAiSuggestedRule}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#7c3aed] bg-[#ecfdf5] hover:bg-[#ede9fe] border border-[#a7f3d0] rounded-xl transition-all cursor-pointer shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Suggest Rule</span>
            </button>

            <button
              type="button"
              id="btn-add-new-logic-rule"
              onClick={() => setIsCreatingNew(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#00a8b5] hover:bg-[#008894] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Rule</span>
            </button>
          </div>
        </div>

        {/* Create Rule Modal / Card */}
        {isCreatingNew && (
          <div className="bg-white border-2 border-[#00a8b5] rounded-2xl p-6 shadow-md space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-[#111827]">
                <Zap className="w-4 h-4 text-[#00a8b5]" />
                <span>Build New Conditional Rule</span>
              </div>
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="text-xs text-[#6b7280] hover:text-[#111827] font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#374151]">Rule Name / Description</label>
                <input
                  type="text"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  placeholder="e.g. Show NDA field if Enterprise is selected"
                  className="w-full px-3 py-2 border border-[#d1d5db] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#00a8b5]"
                />
              </div>

              {/* IF Condition Box */}
              <div className="bg-[#f0fdfa] border border-[#d1fae5] rounded-xl p-4 space-y-3">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#00a8b5]">
                  IF (Condition Trigger)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#4b5563]">When Question</label>
                    <select
                      value={draftFieldId}
                      onChange={(e) => setDraftFieldId(e.target.value)}
                      className="w-full px-3 py-2 border border-[#d1d5db] rounded-xl text-xs text-[#111827] bg-white focus:outline-none"
                    >
                      {form.fields.map((f, idx) => (
                        <option key={f.id} value={f.id}>
                          {idx + 1}. {f.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#4b5563]">Operator</label>
                    <select
                      value={draftCondition}
                      onChange={(e) => setDraftCondition(e.target.value as any)}
                      className="w-full px-3 py-2 border border-[#d1d5db] rounded-xl text-xs text-[#111827] bg-white focus:outline-none"
                    >
                      <option value="equals">is equal to</option>
                      <option value="not_equals">is not equal to</option>
                      <option value="contains">contains text</option>
                      <option value="is_filled">is filled / answered</option>
                      <option value="is_empty">is empty / skipped</option>
                    </select>
                  </div>

                  {draftCondition !== 'is_filled' && draftCondition !== 'is_empty' && (
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-[#4b5563]">Value</label>
                      {selectedTriggerField?.options ? (
                        <select
                          value={draftValue}
                          onChange={(e) => setDraftValue(e.target.value)}
                          className="w-full px-3 py-2 border border-[#d1d5db] rounded-xl text-xs text-[#111827] bg-white focus:outline-none"
                        >
                          <option value="">-- Choose Option --</option>
                          {selectedTriggerField.options.map((opt, oIdx) => (
                            <option key={oIdx} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={draftValue}
                          onChange={(e) => setDraftValue(e.target.value)}
                          placeholder="e.g. Yes / Special Value"
                          className="w-full px-3 py-2 border border-[#d1d5db] rounded-xl text-xs text-[#111827] focus:outline-none"
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* THEN Action Box */}
              <div className="bg-[#faf5ff] border border-[#f3e8ff] rounded-xl p-4 space-y-3">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7c3aed]">
                  THEN (Resulting Action)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#4b5563]">Action</label>
                    <select
                      value={draftAction}
                      onChange={(e) => setDraftAction(e.target.value as any)}
                      className="w-full px-3 py-2 border border-[#d1d5db] rounded-xl text-xs text-[#111827] bg-white focus:outline-none"
                    >
                      <option value="show_field">Show Question</option>
                      <option value="hide_field">Hide Question</option>
                      <option value="require_field">Make Question Required</option>
                      <option value="send_email_alert">Send Immediate Email Alert</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#4b5563]">Target Field / Question</label>
                    <select
                      value={draftTargetFieldId}
                      onChange={(e) => setDraftTargetFieldId(e.target.value)}
                      className="w-full px-3 py-2 border border-[#d1d5db] rounded-xl text-xs text-[#111827] bg-white focus:outline-none"
                    >
                      {form.fields.map((f, idx) => (
                        <option key={f.id} value={f.id}>
                          {idx + 1}. {f.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="px-4 py-2 border border-[#e5e7eb] rounded-xl text-xs font-semibold text-[#4b5563] hover:bg-[#f9fafb] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveNewRule}
                  className="px-5 py-2 bg-[#00a8b5] hover:bg-[#008894] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Logic Rule</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Existing Rules List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#111827]">
              Active Rules ({rules.length})
            </h2>
            <span className="text-xs text-[#6b7280] font-mono">
              Evaluated sequentially top-to-bottom
            </span>
          </div>

          {rules.length === 0 ? (
            <div className="bg-white border border-[#e5e7eb] rounded-2xl p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#ecfdf5] text-[#00a8b5] flex items-center justify-center mx-auto">
                <GitBranch className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#111827]">No Logic Rules Yet</h3>
              <p className="text-xs text-[#6b7280] max-w-sm mx-auto">
                Conditional logic lets you build interactive forms that adapt to respondent choices automatically.
              </p>
              <button
                type="button"
                onClick={() => setIsCreatingNew(true)}
                className="px-4 py-2 bg-[#00a8b5] text-white text-xs font-bold rounded-xl hover:bg-[#008894] cursor-pointer"
              >
                Create Your First Rule
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {rules.map((rule, rIdx) => (
                <div
                  key={rule.id}
                  className={`bg-white border rounded-2xl p-5 shadow-2xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    rule.enabled
                      ? 'border-[#e5e7eb] hover:border-[#cbd5e1]'
                      : 'border-[#f3f4f6] opacity-60 bg-[#fafafa]'
                  }`}
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono font-bold text-[#6b7280]">
                        #{rIdx + 1}
                      </span>
                      <span className="text-xs font-bold text-[#111827]">
                        {rule.name}
                      </span>
                      {rule.enabled ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold font-mono">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-[#f3f4f6] text-[#6b7280] text-[10px] font-bold font-mono">
                          PAUSED
                        </span>
                      )}
                    </div>

                    {/* Rule sentence block */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#374151]">
                      <span className="font-mono font-bold text-[#00a8b5] bg-[#ecfdf5] px-2 py-0.5 rounded">
                        IF
                      </span>
                      <span className="font-semibold text-[#111827]">
                        "{getFieldLabel(rule.fieldId)}"
                      </span>
                      <span className="text-[#6b7280]">{rule.condition.replace('_', ' ')}</span>
                      {rule.value && (
                        <span className="font-mono bg-[#f3f4f6] px-2 py-0.5 rounded text-[#111827]">
                          "{rule.value}"
                        </span>
                      )}
                      <ArrowRight className="w-3.5 h-3.5 text-[#9ca3af]" />
                      <span className="font-mono font-bold text-[#7c3aed] bg-[#ecfdf5] px-2 py-0.5 rounded uppercase">
                        THEN {rule.action.replace('_', ' ')}
                      </span>
                      <span className="font-semibold text-[#111827]">
                        "{getFieldLabel(rule.targetFieldId)}"
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-[#f3f4f6]">
                    <button
                      type="button"
                      onClick={() => handleToggleRule(rule.id)}
                      className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                        rule.enabled
                          ? 'text-[#00a8b5] hover:bg-[#ecfdf5]'
                          : 'text-[#9ca3af] hover:bg-[#f3f4f6]'
                      }`}
                      title={rule.enabled ? 'Pause rule' : 'Enable rule'}
                    >
                      {rule.enabled ? (
                        <ToggleRight className="w-6 h-6" />
                      ) : (
                        <ToggleLeft className="w-6 h-6" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteRule(rule.id)}
                      className="p-1.5 text-[#9ca3af] hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer transition-colors"
                      title="Delete rule"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
