import React, { useState } from 'react';
import {
  Sparkles,
  Shield,
  Key,
  Webhook,
  Sliders,
  Check,
  Save,
  Globe,
  Bell,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [modelChoice, setModelChoice] = useState('gemini-3.7-flash');
  const [nlpSensitivity, setNlpSensitivity] = useState('High Precision');
  const [botProtection, setBotProtection] = useState(true);
  const [offlineSync, setOfflineSync] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div id="settings-view-root" className="flex-1 overflow-y-auto bg-[#fbfbfe] p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#111827]">
            Workspace Settings
          </h1>
          <p className="text-xs text-[#6b7280] mt-1">
            Configure precision AI intelligence, security rules, and workspace defaults.
          </p>
        </div>

        {/* AI Intelligence Configuration */}
        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold text-[#00a8b5]">
            <Sparkles className="w-4 h-4" />
            <span>AI Sidekick & NLP Engine</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#374151]">Model Engine</label>
              <select
                value={modelChoice}
                onChange={(e) => setModelChoice(e.target.value)}
                className="w-full px-3 py-2 border border-[#d1d5db] rounded-xl text-xs text-[#111827] bg-white focus:outline-none"
              >
                <option value="gemini-3.7-flash">Gemini 3.7 Flash (Default / High Speed)</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep Analytics)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#374151]">NLP Sentiment Extraction</label>
              <select
                value={nlpSensitivity}
                onChange={(e) => setNlpSensitivity(e.target.value)}
                className="w-full px-3 py-2 border border-[#d1d5db] rounded-xl text-xs text-[#111827] bg-white focus:outline-none"
              >
                <option value="High Precision">High Precision (Grammar & Intent)</option>
                <option value="Standard">Standard</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security & Integrity */}
        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#111827]">
            <Shield className="w-4 h-4 text-[#00a8b5]" />
            <span>Security & Bot Radar</span>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 border border-[#f0f2f5] rounded-xl cursor-pointer hover:bg-[#fafbfc]">
              <div>
                <div className="text-xs font-bold text-[#111827]">Automated Bot Quarantining</div>
                <div className="text-[11px] text-[#6b7280]">Automatically flag sub-second submissions from identical IP clusters</div>
              </div>
              <input
                type="checkbox"
                checked={botProtection}
                onChange={(e) => setBotProtection(e.target.checked)}
                className="w-4 h-4 text-[#00a8b5] rounded focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between p-3 border border-[#f0f2f5] rounded-xl cursor-pointer hover:bg-[#fafbfc]">
              <div>
                <div className="text-xs font-bold text-[#111827]">Offline Client-Side Service Worker Caching</div>
                <div className="text-[11px] text-[#6b7280]">Allow respondents to securely fill out forms without active internet</div>
              </div>
              <input
                type="checkbox"
                checked={offlineSync}
                onChange={(e) => setOfflineSync(e.target.checked)}
                className="w-4 h-4 text-[#00a8b5] rounded focus:ring-0"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#00a8b5] hover:bg-[#008894] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'Settings Saved!' : 'Save Preferences'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
