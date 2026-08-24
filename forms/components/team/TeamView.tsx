import React, { useState } from 'react';
import {
  Folder,
  Briefcase,
  Lock,
  Plus,
  FileDown,
  Sparkles,
  Send,
  FileText,
  Ticket,
  Clock,
  Mail,
  SlidersHorizontal,
  MoreVertical,
  ArrowRight,
  Shield,
  Check,
} from 'lucide-react';
import { DirectoryFolder, Workflow, TeamMember } from '../../types';

interface TeamViewProps {
  directories: DirectoryFolder[];
  workflows: Workflow[];
  teamMembers: TeamMember[];
  onOpenNewFolderModal: () => void;
  onOpenManagePermissionsModal: () => void;
  onToggleWorkflow: (id: string) => void;
  onExportReport: () => void;
  onSelectDirectory: (dirId: string) => void;
}

export const TeamView: React.FC<TeamViewProps> = ({
  directories,
  workflows,
  teamMembers,
  onOpenNewFolderModal,
  onOpenManagePermissionsModal,
  onToggleWorkflow,
  onExportReport,
  onSelectDirectory,
}) => {
  return (
    <div id="team-workspace-view" className="flex-1 overflow-y-auto bg-[#fbfbfe] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header matching Image 5 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#111827]">
              Team Workspace
            </h1>
            <p className="text-xs text-[#6b7280] mt-1">
              Manage forms, automations, and team access across your organization.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="btn-export-workspace-report"
              onClick={onExportReport}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#374151] hover:text-[#111827] bg-white hover:bg-[#f9fafb] border border-[#e5e7eb] rounded-xl shadow-2xs transition-all cursor-pointer"
            >
              <FileDown className="w-4 h-4 text-[#6b7280]" />
              <span>Export Report</span>
            </button>
            <button
              id="btn-new-folder"
              onClick={onOpenNewFolderModal}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-[#00a8b5] hover:bg-[#008894] active:scale-95 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Folder</span>
            </button>
          </div>
        </div>

        {/* Section 1: Directories matching Image 5 */}
        <section id="section-directories">
          <h2 className="text-sm font-bold text-[#111827] mb-4">
            Directories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {directories.map((dir) => (
              <div
                key={dir.id}
                id={`folder-card-${dir.id}`}
                onClick={() => onSelectDirectory(dir.id)}
                className="bg-white border border-[#e5e7eb] hover:border-[#a7f3d0] hover:shadow-xs rounded-2xl p-5 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-2xs group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: dir.color }}
                  >
                    {dir.iconType === 'folder' && <Folder className="w-5 h-5" />}
                    {dir.iconType === 'briefcase' && <Briefcase className="w-5 h-5" />}
                    {dir.iconType === 'lock' && <Lock className="w-5 h-5" />}
                  </div>

                  <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#f3f4f6] text-[#4b5563] font-mono">
                    {dir.formsCount} Forms
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-bold text-[#111827] group-hover:text-[#00a8b5] transition-colors">
                    {dir.name}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-[#6b7280] mt-1 font-mono">
                    <span>{dir.updatedAt}</span>
                    {dir.isLocked && (
                      <span className="text-amber-600 font-semibold flex items-center gap-1 text-[10px]">
                        <Lock className="w-3 h-3" />
                        Locked
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Active Workflows matching Image 5 */}
        <section
          id="section-workflows"
          className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-2xs"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-bold text-[#111827]">
                Active Workflows
              </h2>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ecfdf5] text-[#7c3aed] text-[10px] font-bold tracking-wider uppercase border border-[#a7f3d0] font-mono">
                <Sparkles className="w-3 h-3" />
                AI Active
              </span>
            </div>

            <button
              title="Workflow settings"
              className="text-[#9ca3af] hover:text-[#4b5563] p-1 rounded-md hover:bg-[#f3f4f6] cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Pipeline 1: On Form Submit -> Notify #hr-alerts -> Create Ticket */}
            <div
              id="workflow-row-1"
              className="border border-[#f0f2f5] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#fafbfc]"
            >
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[#111827]">
                {/* Node 1 */}
                <div className="flex items-center gap-2 px-3 py-2 bg-white border border-[#e5e7eb] rounded-xl shadow-2xs">
                  <div className="w-5 h-5 rounded-md bg-[#ecfdf5] text-[#00a8b5] flex items-center justify-center">
                    <Send className="w-3 h-3" />
                  </div>
                  <span>On Form Submit</span>
                </div>

                <ArrowRight className="w-4 h-4 text-[#9ca3af] shrink-0" />

                {/* Node 2 */}
                <div className="flex items-center gap-2 px-3 py-2 bg-white border border-[#e5e7eb] rounded-xl shadow-2xs">
                  <div className="w-5 h-5 rounded-md bg-[#f3f4f6] text-[#4b5563] flex items-center justify-center">
                    <FileText className="w-3 h-3" />
                  </div>
                  <span>Notify #hr-alerts</span>
                </div>

                <ArrowRight className="w-4 h-4 text-[#9ca3af] shrink-0" />

                {/* Node 3 */}
                <div className="flex items-center gap-2 px-3 py-2 bg-white border border-[#e5e7eb] rounded-xl shadow-2xs">
                  <div className="w-5 h-5 rounded-md bg-[#fef3c7] text-[#d97706] flex items-center justify-center">
                    <Ticket className="w-3 h-3" />
                  </div>
                  <span>Create Ticket</span>
                </div>
              </div>

              {/* Toggle switch matching Image 5 */}
              <div className="flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={workflows[0]?.enabled ?? true}
                    onChange={() => onToggleWorkflow(workflows[0]?.id || 'wf-1')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00a8b5]" />
                </label>
              </div>
            </div>

            {/* Pipeline 2: Weekly Report -> AI Summarize Data -> Email Exec Team */}
            <div
              id="workflow-row-2"
              className="border border-[#f0f2f5] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#fafbfc]"
            >
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[#111827]">
                {/* Node 1 */}
                <div className="flex items-center gap-2 px-3 py-2 bg-white border border-[#e5e7eb] rounded-xl shadow-2xs">
                  <div className="w-5 h-5 rounded-md bg-[#f3f4f6] text-[#4b5563] flex items-center justify-center">
                    <Clock className="w-3 h-3" />
                  </div>
                  <span>Weekly Report</span>
                </div>

                <ArrowRight className="w-4 h-4 text-[#9ca3af] shrink-0" />

                {/* Node 2: AI Box with Dashed Purple Outline matching Image 5 */}
                <div className="flex items-center gap-2 px-3.5 py-2 bg-[#fdf4ff] border border-dashed border-[#c084fc] rounded-xl shadow-2xs text-[#7e22ce]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="font-bold">AI Summarize Data</span>
                </div>

                <ArrowRight className="w-4 h-4 text-[#9ca3af] shrink-0" />

                {/* Node 3 */}
                <div className="flex items-center gap-2 px-3 py-2 bg-white border border-[#e5e7eb] rounded-xl shadow-2xs">
                  <div className="w-5 h-5 rounded-md bg-[#ecfdf5] text-[#00a8b5] flex items-center justify-center">
                    <Mail className="w-3 h-3" />
                  </div>
                  <span>Email Exec Team</span>
                </div>
              </div>

              {/* Toggle switch */}
              <div className="flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={workflows[1]?.enabled ?? true}
                    onChange={() => onToggleWorkflow(workflows[1]?.id || 'wf-2')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00a8b5]" />
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Team Access matching Image 5 */}
        <section
          id="section-team-access"
          className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-2xs"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#111827]">
              Team Access
            </h2>
            <button
              id="btn-manage-permissions"
              onClick={onOpenManagePermissionsModal}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#374151] hover:text-[#111827] bg-white hover:bg-[#f9fafb] border border-[#e5e7eb] rounded-lg shadow-2xs transition-all cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#6b7280]" />
              <span>Manage Permissions</span>
            </button>
          </div>

          <div className="divide-y divide-[#f3f4f6]">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                id={`team-member-${member.id}`}
                className="py-3.5 flex items-center justify-between gap-4 hover:bg-[#fafbfc] px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-full ${member.avatarBg} text-white font-bold text-xs flex items-center justify-center shadow-2xs`}
                  >
                    {member.avatarInitials}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#111827]">
                      {member.name}
                    </h4>
                    <p className="text-[11px] text-[#6b7280] font-mono">
                      {member.email}
                    </p>
                  </div>
                </div>

                <div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider uppercase font-mono ${
                      member.role === 'ADMIN'
                        ? 'bg-[#ecfdf5] text-[#00a8b5] border border-[#a7f3d0]'
                        : member.role === 'EDITOR'
                        ? 'bg-[#f1f5f9] text-[#475569] border border-[#cbd5e1]'
                        : 'bg-[#f8fafc] text-[#64748b] border border-[#e2e8f0]'
                    }`}
                  >
                    {member.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
