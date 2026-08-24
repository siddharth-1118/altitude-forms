import React, { useState } from 'react';
import {
  Settings,
  Bell,
  Shield,
  Palette,
  Check,
  Save,
  Globe,
  Lock,
  Mail,
  Webhook,
  Sliders,
  Sparkles,
  Link2,
  Calendar,
  Layers,
  ArrowRight,
  Eye,
  Edit3,
  GitBranch,
} from 'lucide-react';
import { FormItem, FormSettings } from '../../types';

interface FormSettingsTabProps {
  form: FormItem;
  onChangeForm: (updated: FormItem) => void;
  onOpenLivePreview?: () => void;
  onSelectSubTab?: (tab: 'build' | 'settings' | 'logic') => void;
}

export const FormSettingsTab: React.FC<FormSettingsTabProps> = ({
  form,
  onChangeForm,
  onOpenLivePreview,
  onSelectSubTab,
}) => {
  const currentSettings: FormSettings = form.settings || {
    submitButtonText: 'Submit Application',
    confirmationMessage: 'Thank you! Your submission has been securely received and recorded.',
    redirectUrl: '',
    allowMultipleSubmissions: true,
    limitOnePerIP: false,
    passwordProtection: false,
    password: '',
    emailNotifications: true,
    notificationEmail: 'ops-team@formx.io',
    autoResponder: true,
    brandColor: '#00a8b5',
    offlineEnabled: true,
    maxResponses: 5000,
  };

  const [settings, setSettings] = useState<FormSettings>(currentSettings);
  const [title, setTitle] = useState(form.title);
  const [description, setDescription] = useState(form.description);
  const [category, setCategory] = useState(form.category);
  const [status, setStatus] = useState(form.status);
  const [bannerImage, setBannerImage] = useState(form.bannerImage || '');
  const [isSaved, setIsSaved] = useState(false);
  const [activeSubSection, setActiveSubSection] = useState<'general' | 'notifications' | 'security' | 'theme'>('general');

  const bannerPresets = [
    {
      label: 'Indigo Geometric',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    },
    {
      label: 'Deep Crystal',
      url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop',
    },
    {
      label: 'Modern Minimal',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    },
    {
      label: 'Cyan Grid',
      url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1200&auto=format&fit=crop',
    },
  ];

  const handleUpdate = (partial: Partial<FormSettings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    onChangeForm({
      ...form,
      title,
      description,
      category,
      status,
      bannerImage,
      settings: updated,
    });
  };

  const handleSaveAll = () => {
    onChangeForm({
      ...form,
      title,
      description,
      category,
      status,
      bannerImage,
      settings,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div id="form-settings-tab-root" className="flex-1 overflow-y-auto bg-[#fbfbfe] p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Quick Sub-Tab Switcher */}
        {onSelectSubTab && (
          <div className="flex items-center justify-between bg-white border border-[#e5e7eb] rounded-2xl p-2 shadow-2xs">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                id="settings-tab-build"
                onClick={() => onSelectSubTab('build')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6] transition-all cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Build</span>
              </button>
              <button
                type="button"
                id="settings-tab-settings"
                onClick={() => onSelectSubTab('settings')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#00a8b5] text-white shadow-2xs transition-all cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Settings</span>
              </button>
              <button
                type="button"
                id="settings-tab-logic"
                onClick={() => onSelectSubTab('logic')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6] transition-all cursor-pointer"
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

        {/* Header Title with Save Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#e5e7eb]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00a8b5] uppercase tracking-wider">
              <Settings className="w-3.5 h-3.5" />
              <span>Form Configuration</span>
            </div>
            <h1 className="text-2xl font-black text-[#111827] tracking-tight mt-1">
              Form Settings &amp; Rules
            </h1>
            <p className="text-xs text-[#6b7280]">
              Configure submission endpoints, team alerts, security limits, and visual styling for <strong>{form.title}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {onOpenLivePreview && (
              <button
                type="button"
                onClick={onOpenLivePreview}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#4b5563] bg-white border border-[#e5e7eb] hover:bg-[#f9fafb] rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                <Eye className="w-3.5 h-3.5 text-[#6b7280]" />
                <span>Test Live</span>
              </button>
            )}
            <button
              type="button"
              id="btn-save-form-settings"
              onClick={handleSaveAll}
              className="flex items-center gap-2 px-5 py-2 bg-[#00a8b5] hover:bg-[#008894] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{isSaved ? 'Settings Saved!' : 'Save Settings'}</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#e5e7eb] pb-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveSubSection('general')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubSection === 'general'
                ? 'bg-[#00a8b5] text-white shadow-2xs'
                : 'text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>General &amp; Publishing</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubSection('notifications')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubSection === 'notifications'
                ? 'bg-[#00a8b5] text-white shadow-2xs'
                : 'text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6]'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Notifications &amp; Emails</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubSection('security')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubSection === 'security'
                ? 'bg-[#00a8b5] text-white shadow-2xs'
                : 'text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Access &amp; Security</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubSection('theme')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubSection === 'theme'
                ? 'bg-[#00a8b5] text-white shadow-2xs'
                : 'text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6]'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Theme &amp; Artwork</span>
          </button>
        </div>

        {/* SECTION 1: General & Publishing */}
        {activeSubSection === 'general' && (
          <div className="space-y-5 animate-in fade-in">
            <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#00a8b5]" />
                <span>Form Metadata &amp; Lifecycle</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#374151]">Form Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      onChangeForm({ ...form, title: e.target.value });
                    }}
                    className="w-full px-3 py-2 border border-[#d1d5db] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#00a8b5]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#374151]">Category / Workspace</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      onChangeForm({ ...form, category: e.target.value });
                    }}
                    className="w-full px-3 py-2 border border-[#d1d5db] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#00a8b5]"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-semibold text-[#374151]">Form Description / Instructions</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      onChangeForm({ ...form, description: e.target.value });
                    }}
                    className="w-full px-3 py-2 border border-[#d1d5db] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#00a8b5]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#374151]">Publishing Status</label>
                  <select
                    value={status}
                    onChange={(e) => {
                      const newStat = e.target.value as 'live' | 'draft' | 'archived';
                      setStatus(newStat);
                      onChangeForm({ ...form, status: newStat });
                    }}
                    className="w-full px-3 py-2 border border-[#d1d5db] rounded-xl text-xs text-[#111827] bg-white focus:outline-none focus:border-[#00a8b5]"
                  >
                    <option value="live">🟢 Live &amp; Accepting Submissions</option>
                    <option value="draft">🟡 Draft (Hidden from Public)</option>
                    <option value="archived">⚪ Archived (Closed)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#374151]">Submit Button Text</label>
                  <input
                    type="text"
                    value={settings.submitButtonText || 'Submit Form'}
                    onChange={(e) => handleUpdate({ submitButtonText: e.target.value })}
                    className="w-full px-3 py-2 border border-[#d1d5db] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#00a8b5]"
                  />
                </div>
              </div>
            </div>

            {/* Post-Submission Behavior */}
            <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#7c3aed]" />
                <span>Post-Submission Behavior</span>
              </h2>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#374151]">Custom Confirmation Message</label>
                  <textarea
                    rows={2}
                    value={settings.confirmationMessage || ''}
                    onChange={(e) => handleUpdate({ confirmationMessage: e.target.value })}
                    placeholder="Thank you! Your submission has been securely recorded."
                    className="w-full px-3 py-2 border border-[#d1d5db] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#00a8b5]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#374151]">Redirect URL after submit (optional)</label>
                  <div className="relative">
                    <Link2 className="w-3.5 h-3.5 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      value={settings.redirectUrl || ''}
                      onChange={(e) => handleUpdate({ redirectUrl: e.target.value })}
                      placeholder="https://example.com/thank-you"
                      className="w-full pl-9 pr-3 py-2 border border-[#d1d5db] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#00a8b5]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: Notifications & Emails */}
        {activeSubSection === 'notifications' && (
          <div className="space-y-5 animate-in fade-in">
            <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#00a8b5]" />
                <span>Email Alerts &amp; Auto-Responders</span>
              </h2>

              <div className="space-y-4">
                <label className="flex items-start justify-between p-3.5 border border-[#f0f2f5] rounded-xl cursor-pointer hover:bg-[#fafbfc] transition-colors">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-[#111827]">Instant Team Notification Email</div>
                    <div className="text-[11px] text-[#6b7280]">
                      Send an alert with submission summary whenever a respondent submits this form.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications ?? true}
                    onChange={(e) => handleUpdate({ emailNotifications: e.target.checked })}
                    className="w-4 h-4 text-[#00a8b5] rounded focus:ring-0 cursor-pointer"
                  />
                </label>

                {settings.emailNotifications && (
                  <div className="space-y-1 pl-3.5 border-l-2 border-[#00a8b5]">
                    <label className="text-xs font-semibold text-[#374151]">Recipient Notification Email(s)</label>
                    <input
                      type="text"
                      value={settings.notificationEmail || ''}
                      onChange={(e) => handleUpdate({ notificationEmail: e.target.value })}
                      placeholder="ops@company.com, legal@company.com"
                      className="w-full px-3 py-2 border border-[#d1d5db] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#00a8b5]"
                    />
                  </div>
                )}

                <label className="flex items-start justify-between p-3.5 border border-[#f0f2f5] rounded-xl cursor-pointer hover:bg-[#fafbfc] transition-colors">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-[#111827]">Respondent Auto-Confirmation Email</div>
                    <div className="text-[11px] text-[#6b7280]">
                      Automatically dispatch a copy of the filled response and digital signature receipt to the user's email.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoResponder ?? true}
                    onChange={(e) => handleUpdate({ autoResponder: e.target.checked })}
                    className="w-4 h-4 text-[#00a8b5] rounded focus:ring-0 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: Access & Security */}
        {activeSubSection === 'security' && (
          <div className="space-y-5 animate-in fade-in">
            <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#00a8b5]" />
                <span>Anti-Spam, Limits &amp; Privacy</span>
              </h2>

              <div className="space-y-4">
                <label className="flex items-start justify-between p-3.5 border border-[#f0f2f5] rounded-xl cursor-pointer hover:bg-[#fafbfc] transition-colors">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-[#111827]">Limit to One Submission per IP</div>
                    <div className="text-[11px] text-[#6b7280]">
                      Prevents duplicate ballot stuffing or repeat submissions from the same browser footprint.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.limitOnePerIP ?? false}
                    onChange={(e) => handleUpdate({ limitOnePerIP: e.target.checked })}
                    className="w-4 h-4 text-[#00a8b5] rounded focus:ring-0 cursor-pointer"
                  />
                </label>

                <label className="flex items-start justify-between p-3.5 border border-[#f0f2f5] rounded-xl cursor-pointer hover:bg-[#fafbfc] transition-colors">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-[#111827]">Offline Caching &amp; Background Sync</div>
                    <div className="text-[11px] text-[#6b7280]">
                      Allows field agents or respondents to fill out the form without active internet connection.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.offlineEnabled ?? true}
                    onChange={(e) => handleUpdate({ offlineEnabled: e.target.checked })}
                    className="w-4 h-4 text-[#00a8b5] rounded focus:ring-0 cursor-pointer"
                  />
                </label>

                <label className="flex items-start justify-between p-3.5 border border-[#f0f2f5] rounded-xl cursor-pointer hover:bg-[#fafbfc] transition-colors">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-[#111827]">Password Protection</div>
                    <div className="text-[11px] text-[#6b7280]">
                      Require respondents to enter a passcode before accessing this form.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.passwordProtection ?? false}
                    onChange={(e) => handleUpdate({ passwordProtection: e.target.checked })}
                    className="w-4 h-4 text-[#00a8b5] rounded focus:ring-0 cursor-pointer"
                  />
                </label>

                {settings.passwordProtection && (
                  <div className="space-y-1 pl-3.5 border-l-2 border-[#00a8b5]">
                    <label className="text-xs font-semibold text-[#374151]">Form Passcode</label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={settings.password || ''}
                        onChange={(e) => handleUpdate({ password: e.target.value })}
                        placeholder="e.g. Enterprise2026"
                        className="w-full pl-9 pr-3 py-2 border border-[#d1d5db] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#00a8b5]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: Theme & Artwork */}
        {activeSubSection === 'theme' && (
          <div className="space-y-5 animate-in fade-in">
            <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#00a8b5]" />
                <span>Brand Colors &amp; Header Banner Artwork</span>
              </h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#374151]">Header Banner Artwork URL</label>
                  <input
                    type="url"
                    value={bannerImage}
                    onChange={(e) => {
                      setBannerImage(e.target.value);
                      onChangeForm({ ...form, bannerImage: e.target.value });
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 border border-[#d1d5db] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#00a8b5]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#374151]">Banner Artwork Presets</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {bannerPresets.map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => {
                          setBannerImage(preset.url);
                          onChangeForm({ ...form, bannerImage: preset.url });
                        }}
                        className={`h-20 rounded-xl overflow-hidden relative border-2 transition-all cursor-pointer ${
                          bannerImage === preset.url
                            ? 'border-[#00a8b5] ring-2 ring-[#00a8b5]/20'
                            : 'border-[#e5e7eb] hover:border-[#cbd5e1]'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-1">
                          <span className="text-[10px] font-bold text-white text-center">
                            {preset.label}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Banner Preview */}
                {bannerImage && (
                  <div className="relative h-28 rounded-2xl overflow-hidden border border-[#e5e7eb]">
                    <img
                      src={bannerImage}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-2 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono text-white">
                      Live Cover Preview
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
