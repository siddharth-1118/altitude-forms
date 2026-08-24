import React from 'react';
import {
  FileText,
  BarChart2,
  Users2,
  Settings,
  Home,
  Plus,
  Zap,
  LogOut,
  Video,
  Mail,
  HardDrive,
  ExternalLink,
  Inbox,
} from 'lucide-react';
import { useAuth } from '../../src/lib/auth';

interface SidebarProps {
  currentTab: 'home' | 'forms' | 'analytics' | 'responses' | 'team' | 'settings';
  onSelectTab: (tab: 'home' | 'forms' | 'analytics' | 'responses' | 'team' | 'settings') => void;
  onCreateNewForm: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onCreateNewForm,
}) => {
  const { user, signOut } = useAuth();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, color: '#00a8b5' },
    { id: 'forms', label: 'Forms', icon: FileText, color: '#8b5cf6' },
    { id: 'analytics', label: 'Analytics', icon: BarChart2, color: '#3b82f6' },
    { id: 'responses', label: 'Responses', icon: Inbox, color: '#10b981' },
    { id: 'team', label: 'Team', icon: Users2, color: '#f59e0b' },
    { id: 'settings', label: 'Settings', icon: Settings, color: '#64748b' },
  ] as const;

  return (
    <aside className="w-full lg:w-60 flex-shrink-0 flex flex-col justify-between p-5 lg:h-screen lg:sticky lg:top-0 bg-gradient-to-b from-[#0c1a2a] via-[#0f2638] to-[#0d2030] overflow-hidden select-none relative">
      {/* Decorative gradient orb */}
      <div style={{
        position: 'absolute', top: '-40px', left: '-40px',
        width: '160px', height: '160px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,168,181,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="flex flex-col sm:flex-row lg:flex-col sm:items-center lg:items-stretch justify-between lg:justify-start w-full">
        {/* Brand */}
        <div
          onClick={() => onSelectTab('forms')}
          className="flex items-center gap-3 px-2 py-1 mb-6 cursor-pointer relative z-10 flex-shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center shadow-lg shadow-purple-500/20">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', lineHeight: 1 }}>
              altitude
            </div>
            <div style={{ fontSize: '0.6rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginTop: '3px' }}>
              Forms Builder
            </div>
          </div>
        </div>

        {/* Create New Form Button */}
        <div className="px-1 py-2 flex-shrink-0 sm:w-48 lg:w-auto">
          <button
            onClick={onCreateNewForm}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-[#00a8b5] to-[#008894] hover:shadow-lg hover:shadow-cyan-500/20 active:shadow-md text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 border-none cursor-pointer transition-all transform hover:-translate-y-0.5 active:translate-y-0 relative z-10"
          >
            <Plus className="w-4 h-4" style={{ strokeWidth: 2.5 }} />
            <span>Create New Form</span>
          </button>
        </div>

        {/* Nav list */}
        <nav className="px-1.5 py-2 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1 lg:gap-0.5 scrollbar-none w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex-shrink-0 flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-cyan-500/10 text-[#00e5f2] border border-cyan-500/25'
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5 mr-2">
                  <Icon className="w-[18px] h-[18px]" />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Workspace Apps */}
      <div className="relative z-10 padding-12-y border-t lg:border-t-0 border-slate-800 flex flex-row lg:flex-col justify-end lg:justify-start gap-1 lg:gap-0.5 mt-2 lg:mt-0">
        {[
          { label: 'Meet', icon: <Video className="w-[14px] h-[14px]" />, url: 'http://localhost:3000', color: '#00e5f2' },
          { label: 'Mail', icon: <Mail className="w-[14px] h-[14px]" />, url: 'http://localhost:3001', color: '#00e5f2' },
          { label: 'Drive', icon: <HardDrive className="w-[14px] h-[14px]" />, url: 'http://localhost:3002', color: '#00e5f2' },
        ].map((link) => (
          <a
            key={link.label}
            href={link.url}
            className="flex-shrink-0 flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 transition-all cursor-pointer hover:bg-slate-800/40 hover:text-[#00e5f2]"
          >
            {link.icon}
            <span>{link.label}</span>
            <ExternalLink className="w-3 h-3 ml-auto opacity-40 hidden lg:inline" />
          </a>
        ))}
      </div>

      {/* User card at bottom */}
      {user && (
        <div className="relative z-10 mt-3 lg:mt-6 p-2 rounded-xl bg-slate-800/30 border border-slate-700/30 flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0 hidden sm:block lg:block">
            <div className="text-[11px] font-bold text-slate-200 truncate leading-none">
              {user.email?.split('@')[0]}
            </div>
            <div className="text-[9px] text-slate-500 truncate mt-0.5">
              {user.email}
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); signOut?.(); }}
            title="Sign out"
            className="bg-slate-800/40 border-none rounded-lg p-1.5 cursor-pointer text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all flex items-center justify-center flex-shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </aside>
  );
};
