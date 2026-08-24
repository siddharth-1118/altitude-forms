import React from 'react';
import {
  Search,
  Eye,
  Share2,
  Bell,
  HelpCircle,
  Send,
} from 'lucide-react';

interface HeaderProps {
  currentTab: 'home' | 'forms' | 'analytics' | 'responses' | 'team' | 'settings';
  builderSubTab: 'build' | 'settings' | 'logic';
  analyticsSubTab: 'dashboard' | 'workflows';
  onSelectBuilderSubTab: (tab: 'build' | 'settings' | 'logic') => void;
  onSelectAnalyticsSubTab: (tab: 'dashboard' | 'workflows') => void;
  onOpenLivePreview: () => void;
  onOpenShareModal: () => void;
  onPublish: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  builderSubTab,
  analyticsSubTab,
  onSelectBuilderSubTab,
  onSelectAnalyticsSubTab,
  onOpenLivePreview,
  onOpenShareModal,
  onPublish,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header
      id="main-app-header"
      className="h-16 bg-white border-b border-[#e5e7eb] px-6 flex items-center justify-between shrink-0 select-none z-10"
    >
      {/* Left section */}
      <div className="flex items-center gap-6">
        {currentTab === 'forms' ? (
          /* Builder Sub Tabs: Build, Settings, Logic */
          <div className="flex items-center gap-6">
            {(['build', 'settings', 'logic'] as const).map((tab) => {
              const isActive = builderSubTab === tab;
              return (
                <button
                  key={tab}
                  id={`builder-tab-${tab}`}
                  onClick={() => onSelectBuilderSubTab(tab)}
                  className={`text-sm font-semibold capitalize transition-all cursor-pointer relative py-5 ${
                    isActive
                      ? 'text-[#00a8b5]'
                      : 'text-[#6b7280] hover:text-[#111827]'
                  }`}
                >
                  {tab}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00a8b5] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          /* Search Input for Analytics, Team, Home */
          <div className="relative w-80">
            <Search className="w-4 h-4 text-[#9ca3af] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="header-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={
                currentTab === 'analytics'
                  ? 'Search analytics...'
                  : currentTab === 'team'
                  ? 'Search workspace...'
                  : 'Search forms & templates...'
              }
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#e5e7eb] rounded-xl text-xs text-[#1f2937] placeholder-[#9ca3af] focus:outline-none focus:border-[#00a8b5] focus:ring-1 focus:ring-[#00a8b5] transition-all"
            />
          </div>
        )}
      </div>

      {/* Center Sub Tabs (for Analytics & Team screens: Dashboard vs Workflows) */}
      {(currentTab === 'analytics' || currentTab === 'team') && (
        <div className="flex items-center gap-6">
          <button
            id="subtab-dashboard"
            onClick={() => onSelectAnalyticsSubTab('dashboard')}
            className={`text-sm font-semibold transition-all cursor-pointer relative py-5 ${
              analyticsSubTab === 'dashboard'
                ? 'text-[#00a8b5]'
                : 'text-[#6b7280] hover:text-[#111827]'
            }`}
          >
            Dashboard
            {analyticsSubTab === 'dashboard' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00a8b5] rounded-full" />
            )}
          </button>
          <button
            id="subtab-workflows"
            onClick={() => onSelectAnalyticsSubTab('workflows')}
            className={`text-sm font-semibold transition-all cursor-pointer relative py-5 ${
              analyticsSubTab === 'workflows'
                ? 'text-[#00a8b5]'
                : 'text-[#6b7280] hover:text-[#111827]'
            }`}
          >
            Workflows
            {analyticsSubTab === 'workflows' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00a8b5] rounded-full" />
            )}
          </button>
        </div>
      )}

      {/* Right Actions */}
      <div className="flex items-center gap-1.5 sm:gap-3.5">
        {/* Auto-saved indicator in Builder */}
        {currentTab === 'forms' && (
          <div
            id="auto-save-indicator"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-medium text-[#4b5563]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00a8b5] animate-pulse" />
            <span className="hidden md:inline">Auto-saved</span>
          </div>
        )}

        {/* Builder Preview Button */}
        {currentTab === 'forms' && (
          <button
            id="btn-live-preview"
            onClick={onOpenLivePreview}
            className="flex items-center gap-1.5 px-2 sm:px-3.5 py-2 text-xs font-medium text-[#374151] hover:text-[#111827] bg-[#f9fafb] hover:bg-[#f3f4f6] border border-[#e5e7eb] rounded-xl transition-all cursor-pointer"
            title="Live Preview"
          >
            <Eye className="w-4 h-4 text-[#6b7280]" />
            <span className="hidden sm:inline">Live Preview</span>
          </button>
        )}

        {/* Utility icons for other tabs */}
        {currentTab !== 'forms' && (
          <>
            <button
              id="btn-help"
              title="Help & Documentation"
              className="w-9 h-9 flex items-center justify-center rounded-xl text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6] transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4.5 h-4.5" />
            </button>
            <button
              id="btn-notifications"
              title="Notifications"
              className="relative w-9 h-9 flex items-center justify-center rounded-xl text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6] transition-colors cursor-pointer"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </>
        )}

        {/* Share Button */}
        <button
          id="btn-share-form"
          onClick={onOpenShareModal}
          className="flex items-center gap-1.5 px-2 sm:px-3.5 py-2 text-xs font-medium text-[#374151] hover:text-[#111827] bg-[#f9fafb] hover:bg-[#f3f4f6] border border-[#e5e7eb] rounded-xl transition-all cursor-pointer"
          title="Share"
        >
          <Share2 className="w-4 h-4 text-[#6b7280]" />
          <span className="hidden sm:inline">Share</span>
        </button>

        {/* Publish Button */}
        <button
          id="btn-publish-form"
          onClick={onPublish}
          className="flex items-center gap-1.5 px-2.5 sm:px-4 py-2 text-xs font-medium text-white bg-[#00a8b5] hover:bg-[#008894] active:scale-95 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
          title="Publish"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Publish</span>
        </button>
      </div>
    </header>
  );
};
