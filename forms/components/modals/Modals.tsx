import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ShieldAlert,
  Copy,
  Check,
  Code,
  QrCode,
  FolderPlus,
  UserPlus,
  Send,
  Ticket,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { TeamMember, DirectoryFolder } from '../../types';

interface DevTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTicketCreated: (ticketData: any) => void;
}

export const DevTicketModal: React.FC<DevTicketModalProps> = ({
  isOpen,
  onClose,
  onTicketCreated,
}) => {
  const [ticketTitle, setTicketTitle] = useState('[PERF] Optimize checkout latency in Q3 feedback flow');
  const [priority, setPriority] = useState('P1 - High');
  const [assignee, setAssignee] = useState('Engineers / Core Platform');
  const [isCreated, setIsCreated] = useState(false);

  if (!isOpen) return null;

  const handleCreate = () => {
    setIsCreated(true);
    setTimeout(() => {
      onTicketCreated({ title: ticketTitle, priority, assignee });
      setIsCreated(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-[#e5e7eb] shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="px-6 py-4 border-b border-[#f3f4f6] flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-[#111827]">
            <Ticket className="w-4 h-4 text-[#7c3aed]" />
            <span>Generate Engineering Ticket</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-[#9ca3af] hover:text-[#4b5563] cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-3 bg-[#ecfdf5] border border-[#a7f3d0] rounded-xl text-xs text-[#6d28d9]">
            <div className="font-bold flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Insight Context</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Extracted from 1,248 respondent entries. 28% of complaints mention checkout load latency exceeding 3 seconds.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#374151]">Issue Summary</label>
            <input
              type="text"
              value={ticketTitle}
              onChange={(e) => setTicketTitle(e.target.value)}
              className="w-full px-3.5 py-2 border border-[#d1d5db] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#7c3aed]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#374151]">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 border border-[#d1d5db] rounded-xl text-xs text-[#111827] focus:outline-none"
              >
                <option>P0 - Blocker</option>
                <option>P1 - High</option>
                <option>P2 - Medium</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#374151]">Target Integration</label>
              <select className="w-full px-3 py-2 border border-[#d1d5db] rounded-xl text-xs text-[#111827] focus:outline-none">
                <option>Jira Cloud</option>
                <option>GitHub Issues</option>
                <option>Linear</option>
              </select>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-[#f9fafb] border-t border-[#f3f4f6] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#4b5563] hover:text-[#111827] cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={isCreated}
            className="px-5 py-2 text-xs font-bold text-white bg-[#7c3aed] hover:bg-[#6d28d9] rounded-xl shadow-xs transition-all cursor-pointer"
          >
            {isCreated ? 'Created #DEV-8492!' : 'Create Ticket →'}
          </button>
        </div>
      </div>
    </div>
  );
};

interface QuarantineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuarantineResolved: () => void;
}

export const QuarantineModal: React.FC<QuarantineModalProps> = ({
  isOpen,
  onClose,
  onQuarantineResolved,
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>(['bot-1', 'bot-2', 'bot-3', 'bot-4', 'bot-5', 'bot-6']);
  const [isQuarantining, setIsQuarantining] = useState(false);

  if (!isOpen) return null;

  const botList = [
    { id: 'bot-1', ip: '198.51.100.42', latency: '0.8s', time: '14:22:01', status: 'flagged' },
    { id: 'bot-2', ip: '198.51.100.42', latency: '0.9s', time: '14:22:02', status: 'flagged' },
    { id: 'bot-3', ip: '198.51.100.43', latency: '1.1s', time: '14:22:04', status: 'flagged' },
    { id: 'bot-4', ip: '198.51.100.44', latency: '0.7s', time: '14:22:07', status: 'flagged' },
    { id: 'bot-5', ip: '198.51.100.45', latency: '0.6s', time: '14:22:08', status: 'flagged' },
    { id: 'bot-6', ip: '198.51.100.46', latency: '0.8s', time: '14:22:11', status: 'flagged' },
  ];

  const handleExecuteQuarantine = () => {
    setIsQuarantining(true);
    setTimeout(() => {
      setIsQuarantining(false);
      onQuarantineResolved();
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-[#e5e7eb] shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="px-6 py-4 border-b border-[#f3f4f6] flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-[#dc2626]">
            <ShieldAlert className="w-4 h-4" />
            <span>Review & Quarantine Suspicious Submissions</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-[#9ca3af] hover:text-[#4b5563] cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-[#4b5563] leading-relaxed">
            altitude Forms Bot Radar identified <strong>6 suspicious submissions</strong> exhibiting automated robotic signatures (sub-second completion times & burst requests).
          </p>

          <div className="border border-[#e5e7eb] rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f9fafb] text-[#6b7280] font-mono border-b border-[#e5e7eb]">
                <tr>
                  <th className="p-2.5">IP Address</th>
                  <th className="p-2.5">Fill Duration</th>
                  <th className="p-2.5">Timestamp</th>
                  <th className="p-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6] font-mono">
                {botList.map((bot) => (
                  <tr key={bot.id} className="hover:bg-[#fef2f2]/50">
                    <td className="p-2.5 font-bold text-[#111827]">{bot.ip}</td>
                    <td className="p-2.5 text-rose-600 font-bold">{bot.latency}</td>
                    <td className="p-2.5 text-[#6b7280]">{bot.time}</td>
                    <td className="p-2.5 text-right text-rose-600 font-semibold">Quarantine</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="px-6 py-4 bg-[#f9fafb] border-t border-[#f3f4f6] flex items-center justify-between">
          <span className="text-xs text-[#6b7280]">
            Excluded entries won't distort analytics metrics.
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#4b5563] hover:text-[#111827] cursor-pointer"
            >
              Dismiss
            </button>
            <button
              onClick={handleExecuteQuarantine}
              className="px-5 py-2 text-xs font-bold text-white bg-[#dc2626] hover:bg-[#b91c1c] rounded-xl shadow-xs transition-all cursor-pointer"
            >
              {isQuarantining ? 'Quarantining...' : 'Quarantine All 6 Entries'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  formTitle: string;
  formId?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  formTitle,
  formId,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeShareTab, setActiveShareTab] = useState<'link' | 'embed' | 'qr'>('link');

  if (!isOpen) return null;

  // Generate the public form URL
  const publicFormUrl = formId
    ? `${window.location.origin}/form/${formId}`
    : window.location.href;
  const shareUrl = publicFormUrl;
  const embedCode = `<iframe src="${publicFormUrl}" width="100%" height="700" frameborder="0"></iframe>`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-[#e5e7eb] shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="px-6 py-4 border-b border-[#f3f4f6] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#111827]">Share "{formTitle}"</h3>
          <button onClick={onClose} className="p-1 rounded-md text-[#9ca3af] hover:text-[#4b5563] cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex border-b border-[#e5e7eb] gap-4">
            <button
              onClick={() => setActiveShareTab('link')}
              className={`pb-2.5 text-xs font-semibold cursor-pointer ${
                activeShareTab === 'link' ? 'text-[#00a8b5] border-b-2 border-[#00a8b5]' : 'text-[#6b7280]'
              }`}
            >
              Direct Link
            </button>
            <button
              onClick={() => setActiveShareTab('embed')}
              className={`pb-2.5 text-xs font-semibold cursor-pointer ${
                activeShareTab === 'embed' ? 'text-[#00a8b5] border-b-2 border-[#00a8b5]' : 'text-[#6b7280]'
              }`}
            >
              Embed HTML
            </button>
            <button
              onClick={() => setActiveShareTab('qr')}
              className={`pb-2.5 text-xs font-semibold cursor-pointer ${
                activeShareTab === 'qr' ? 'text-[#00a8b5] border-b-2 border-[#00a8b5]' : 'text-[#6b7280]'
              }`}
            >
              QR Code
            </button>
          </div>

          {activeShareTab === 'link' && (
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#374151] uppercase font-mono">Public Respondent URL</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="w-full px-3 py-2 bg-[#f9fafb] border border-[#d1d5db] rounded-xl text-xs text-[#111827] font-mono select-all"
                />
                <button
                  onClick={() => copyToClipboard(shareUrl)}
                  className="px-3.5 py-2 bg-[#00a8b5] text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          )}

          {activeShareTab === 'embed' && (
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#374151] uppercase font-mono">Embed Snippet</label>
              <textarea
                readOnly
                rows={3}
                value={embedCode}
                className="w-full px-3 py-2 bg-[#f9fafb] border border-[#d1d5db] rounded-xl text-xs text-[#111827] font-mono resize-none"
              />
              <button
                onClick={() => copyToClipboard(embedCode)}
                className="w-full py-2 bg-[#00a8b5] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Embed Code'}</span>
              </button>
            </div>
          )}

          {activeShareTab === 'qr' && (
            <div className="flex flex-col items-center justify-center p-4 space-y-3">
              <div className="w-36 h-36 border-2 border-[#e5e7eb] rounded-2xl p-2 bg-white flex items-center justify-center shadow-xs">
                <QrCode className="w-32 h-32 text-[#00a8b5]" />
              </div>
              <span className="text-xs text-[#6b7280]">Scan with any phone camera to fill out</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface NewFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFolder: (folder: DirectoryFolder) => void;
}

export const NewFolderModal: React.FC<NewFolderModalProps> = ({
  isOpen,
  onClose,
  onAddFolder,
}) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#00a8b5');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddFolder({
      id: `dir-${Date.now()}`,
      name: name.trim(),
      formsCount: 0,
      updatedAt: 'Just now',
      color,
      iconType: 'folder',
    });
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-[#e5e7eb] shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="px-6 py-4 border-b border-[#f3f4f6] flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-[#111827]">
            <FolderPlus className="w-4 h-4 text-[#00a8b5]" />
            <span>Create New Directory Folder</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-[#9ca3af] hover:text-[#4b5563] cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#374151]">Folder Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Compliance & Audits"
              className="w-full px-3.5 py-2 border border-[#d1d5db] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#00a8b5]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#374151]">Accent Color</label>
            <div className="flex items-center gap-3">
              {['#00a8b5', '#7c3aed', '#059669', '#d97706', '#dc2626', '#475569'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                    color === c ? 'ring-2 ring-offset-2 ring-[#00a8b5] scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#4b5563] hover:text-[#111827] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#00a8b5] hover:bg-[#008894] rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Create Folder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface ManagePermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamMembers: TeamMember[];
  onAddMember: (member: TeamMember) => void;
  onUpdateRole: (id: string, role: 'ADMIN' | 'EDITOR' | 'VIEWER') => void;
}

export const ManagePermissionsModal: React.FC<ManagePermissionsModalProps> = ({
  isOpen,
  onClose,
  teamMembers,
  onAddMember,
  onUpdateRole,
}) => {
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'ADMIN' | 'EDITOR' | 'VIEWER'>('EDITOR');

  if (!isOpen) return null;

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newName.trim()) return;

    const initials = newName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    onAddMember({
      id: `tm-${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim(),
      role: newRole,
      avatarInitials: initials || 'TM',
      avatarBg: 'bg-[#6366f1]',
    });

    setNewName('');
    setNewEmail('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-[#e5e7eb] shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="px-6 py-4 border-b border-[#f3f4f6] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#111827]">Manage Team Permissions</h3>
          <button onClick={onClose} className="p-1 rounded-md text-[#9ca3af] hover:text-[#4b5563] cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Invite form */}
          <form onSubmit={handleInvite} className="space-y-3 bg-[#fafafa] p-4 border border-[#e5e7eb] rounded-xl">
            <div className="text-xs font-bold text-[#111827]">Invite New Teammate</div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Full Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="px-3 py-1.5 border border-[#d1d5db] rounded-lg text-xs bg-white focus:outline-none"
              />
              <input
                type="email"
                placeholder="Work Email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="px-3 py-1.5 border border-[#d1d5db] rounded-lg text-xs bg-white focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as any)}
                className="px-3 py-1.5 border border-[#d1d5db] rounded-lg text-xs bg-white focus:outline-none"
              >
                <option value="ADMIN">Role: ADMIN</option>
                <option value="EDITOR">Role: EDITOR</option>
                <option value="VIEWER">Role: VIEWER</option>
              </select>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#00a8b5] hover:bg-[#008894] text-white text-xs font-bold rounded-lg transition-all cursor-pointer"
              >
                Send Invite
              </button>
            </div>
          </form>

          {/* Members list */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-[#6b7280] uppercase tracking-wider">Active Members</div>
            <div className="divide-y divide-[#f3f4f6]">
              {teamMembers.map((m) => (
                <div key={m.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#111827]">{m.name}</div>
                    <div className="text-[11px] text-[#6b7280]">{m.email}</div>
                  </div>
                  <select
                    value={m.role}
                    onChange={(e) => onUpdateRole(m.id, e.target.value as any)}
                    className="text-xs border border-[#e5e7eb] rounded-lg px-2 py-1 bg-white font-mono"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="EDITOR">EDITOR</option>
                    <option value="VIEWER">VIEWER</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-3 bg-[#f9fafb] border-t border-[#f3f4f6] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#374151] hover:bg-[#1f2937] text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
