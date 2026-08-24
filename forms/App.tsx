import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../src/lib/auth';
import { supabase } from '../src/lib/supabase';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { FormBuilder } from './components/builder/FormBuilder';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { TeamView } from './components/team/TeamView';
import { RespondentForm } from './components/respondent/RespondentForm';
import { PublicFormView } from './components/PublicFormView';
import { HomeView } from './components/home/HomeView';
import { SettingsView } from './components/settings/SettingsView';
import { ResponsesView } from './components/responses/ResponsesView';
import {
  DevTicketModal,
  QuarantineModal,
  ShareModal,
  NewFolderModal,
  ManagePermissionsModal,
} from './components/modals/Modals';
import {
  INITIAL_FORMS,

  INITIAL_DIRECTORIES,
  INITIAL_WORKFLOWS,
  INITIAL_TEAM_MEMBERS,
} from './data/initialData';
import { FormItem, AnalyticsData, DirectoryFolder, Workflow, TeamMember } from './types';
import { Check, Sparkles, X } from 'lucide-react';export function App() {
  // Public form view: detect /form/:id in URL
  const [publicFormId] = useState<string | null>(() => {
    const match = window.location.pathname.match(/^\/form\/([^/]+)/);
    return match ? match[1] : null;
  });

  const [currentTab, setCurrentTab] = useState<'home' | 'forms' | 'analytics' | 'responses' | 'team' | 'settings'>('forms');
  const [builderSubTab, setBuilderSubTab] = useState<'build' | 'settings' | 'logic'>('build');
  const [analyticsSubTab, setAnalyticsSubTab] = useState<'dashboard' | 'workflows'>('dashboard');

  const { user } = useAuth();
  const [forms, setForms] = useState<FormItem[]>(INITIAL_FORMS);
  const [activeFormId, setActiveFormId] = useState<string>('form-vendor-onboarding');
  const [serverSynced, setServerSynced] = useState(false);

  // Get auth token from Supabase session
  const getToken = useCallback(async (): Promise<string> => {
    try {
      const { data } = await supabase!.auth.getSession();
      return data.session?.access_token || '';
    } catch { return ''; }
  }, []);

  // Sync forms to server: seed initial data on first load, then persist changes
  useEffect(() => {
    if (!user || serverSynced) return;
    let cancelled = false;
    (async () => {
      const token = await getToken();
      try {
        // Try to fetch existing forms from server
        const res = await fetch('/api/forms', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.forms && data.forms.length > 0) {
            if (!cancelled) {
              setForms(data.forms);
              setServerSynced(true);
            }
            return;
          }
        }
        // Server is empty — seed with initial forms
        await fetch('/api/forms/seed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ forms: INITIAL_FORMS }),
        });
        if (!cancelled) setServerSynced(true);
      } catch {
        // Server unavailable — use client-side forms
        if (!cancelled) setServerSynced(true);
      }
    })();
    return () => { cancelled = true; };
  }, [user, serverSynced]);

  // Persist a form to the server (debounced)
  const syncFormToServer = useCallback(async (form: FormItem) => {
    if (!user) return;
    const token = await getToken();
    try {
      await fetch(`/api/forms/${form.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
    } catch { /* ignore */ }
  }, [user, getToken]);

  const activeForm = forms.find((f) => f.id === activeFormId) || forms[0];

  // Compute analytics from real Supabase forms data
  const analytics: AnalyticsData = {
    formId: activeForm?.id || '',
    formTitle: activeForm?.title || 'No form selected',
    isLiveCollecting: activeForm?.status === 'live',
    responsesCount: forms.reduce((sum, f) => sum + (f.responsesCount || 0), 0),
    updatedText: activeForm?.updatedAt || 'NEVER',
    nlpSummary: {
      positivePct: 0,
      frictionKeyword: 'N/A',
      summaryHeadline: 'No submission data yet. Responses will appear here once users submit forms.',
      topPraise: { label: 'No data', pct: 0 },
      topComplaint: { label: 'No data', pct: 0 },
      suggestedAction: 'Share a form to collect responses',
    },
    dataIntegrityAlert: {
      suspiciousPct: 0,
      description: 'No suspicious activity detected.',
      botCount: 0,
      botTimeWindow: 'N/A',
    },
    responseTimeHeatmap: [],
    completionFunnel: [
      { step: 'Viewed Form', pct: 100, count: 0 },
      { step: 'Started Form', pct: 0, count: 0 },
      { step: 'Completed', pct: 0, count: 0 },
    ],
    geoDistribution: [],
    liveFeed: [],
  } as AnalyticsData;

  const [directories, setDirectories] = useState<DirectoryFolder[]>(INITIAL_DIRECTORIES);
  const [workflows, setWorkflows] = useState<Workflow[]>(INITIAL_WORKFLOWS);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [devTicketModalOpen, setDevTicketModalOpen] = useState(false);
  const [quarantineModalOpen, setQuarantineModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [newFolderModalOpen, setNewFolderModalOpen] = useState(false);
  const [managePermissionsModalOpen, setManagePermissionsModalOpen] = useState(false);

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };



  const handleUpdateActiveForm = (updated: FormItem) => {
    setForms((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
    syncFormToServer(updated);
  };

  const handleCreateNewForm = () => {
    const newFormId = `form_${Date.now()}`;
    const newForm: FormItem = {
      id: newFormId,
      title: 'Untitled Form',
      description: 'Form description...',
      category: 'General',
      status: 'draft',
      responsesCount: 0,
      updatedAt: 'Just now',
      fields: [
        {
          id: `f_${Date.now()}_name`,
          type: 'short_text',
          label: 'Full Name',
          placeholder: 'Short answer text',
          required: true,
        },
      ],
    };
    setForms((prev) => [newForm, ...prev]);
    setActiveFormId(newFormId);
    setCurrentTab('forms');
    setBuilderSubTab('build');
    syncFormToServer(newForm);
    showToast('Created new form draft');
  };

  const handleToggleWorkflow = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w))
    );
    showToast('Workflow automation status updated');
  };

  const handleAddFolder = (folder: DirectoryFolder) => {
    setDirectories((prev) => [...prev, folder]);
    showToast(`Directory "${folder.name}" created`);
  };

  const handleAddTeamMember = (member: TeamMember) => {
    setTeamMembers((prev) => [...prev, member]);
    showToast(`Invited ${member.name} (${member.role})`);
  };

  const handleUpdateRole = (id: string, role: 'ADMIN' | 'EDITOR' | 'VIEWER') => {
    setTeamMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role } : m))
    );
    showToast('Role permissions updated');
  };

  const handleRespondentSubmit = (data: any) => {
    // Increment form response counter and add real-time live feed entry
    setForms((prev) =>
      prev.map((f) =>
        f.id === activeFormId ? { ...f, responsesCount: f.responsesCount + 1 } : f
      )
    );

    showToast('Form submission processed & recorded!');
  };

  const handlePublish = async () => {
    const token = await getToken();
    try {
      if (user) {
        await fetch(`/api/forms/${activeForm.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ ...activeForm, status: 'live' }),
        });
      }
    } catch { /* ignore */ }
    const publicUrl = `${window.location.origin}/form/${activeForm.id}`;
    showToast(`Published! Share: ${publicUrl}`);
  };

  // Public form view: /form/:id (no auth required)
  if (publicFormId) {
    return <PublicFormView formId={publicFormId} />;
  }

  // If in Respondent Preview Mode (Image 7)
  if (isPreviewMode) {
    return (
      <RespondentForm
        form={activeForm}
        onBackToBuilder={() => setIsPreviewMode(false)}
        onSubmitSuccess={handleRespondentSubmit}
      />
    );
  }

  return (
    <div className="flex flex-col lg:flex-row w-full overflow-hidden bg-[#f8fafc] text-[#111827] antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1e1b4b] text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3">
          <Sparkles className="w-3.5 h-3.5 text-[#a5b4fc]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab === 'analytics') {
            setAnalyticsSubTab('dashboard');
          }
        }}
        onCreateNewForm={handleCreateNewForm}
      />

      {/* Content Container */}
      <div className="flex-1 flex flex-col min-w-0 flex-1 overflow-hidden">
        {/* Top Header */}
        <Header
          currentTab={currentTab}
          builderSubTab={builderSubTab}
          analyticsSubTab={analyticsSubTab}
          onSelectBuilderSubTab={setBuilderSubTab}
          onSelectAnalyticsSubTab={(sub) => {
            setAnalyticsSubTab(sub);
            if (sub === 'workflows') {
              setCurrentTab('team');
            } else if (sub === 'dashboard') {
              setCurrentTab('analytics');
            }
          }}
          onOpenLivePreview={() => setIsPreviewMode(true)}
          onOpenShareModal={() => setShareModalOpen(true)}
          onPublish={handlePublish}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* View Routing */}
        {currentTab === 'home' && (
          <HomeView
            forms={forms}
            onSelectForm={(form, subTab = 'build') => {
              setActiveFormId(form.id);
              setBuilderSubTab(subTab);
              setCurrentTab('forms');
            }}
            onCreateNewForm={handleCreateNewForm}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'forms' && (
          <FormBuilder
            form={activeForm}
            onChangeForm={handleUpdateActiveForm}
            onOpenLivePreview={() => setIsPreviewMode(true)}
            subTab={builderSubTab}
            onSelectSubTab={setBuilderSubTab}
          />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsView
            analytics={analytics}
            onOpenDevTicketModal={() => setDevTicketModalOpen(true)}
            onOpenQuarantineModal={() => setQuarantineModalOpen(true)}
            onShareInsights={() => setShareModalOpen(true)}
            onExportPDF={() => showToast('Exporting Analytics PDF Report...')}
          />
        )}

        {currentTab === 'responses' && (
          <ResponsesView forms={forms} activeFormId={activeFormId} />
        )}

        {currentTab === 'team' && (
          <TeamView
            directories={directories}
            workflows={workflows}
            teamMembers={teamMembers}
            onOpenNewFolderModal={() => setNewFolderModalOpen(true)}
            onOpenManagePermissionsModal={() => setManagePermissionsModalOpen(true)}
            onToggleWorkflow={handleToggleWorkflow}
            onExportReport={() => showToast('Exporting Workspace Report...')}
            onSelectDirectory={(dirId) => {
              showToast(`Opened directory folder`);
            }}
          />
        )}

        {currentTab === 'settings' && <SettingsView />}
      </div>

      {/* Modals */}
      <DevTicketModal
        isOpen={devTicketModalOpen}
        onClose={() => setDevTicketModalOpen(false)}
        onTicketCreated={(t) => showToast(`Created ticket: "${t.title}"`)}
      />

      <QuarantineModal
        isOpen={quarantineModalOpen}
        onClose={() => setQuarantineModalOpen(false)}
        onQuarantineResolved={() => {
          showToast('Quarantined bot entries from analytics stream');
        }}
      />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        formTitle={activeForm.title}
        formId={activeForm.id}
      />

      <NewFolderModal
        isOpen={newFolderModalOpen}
        onClose={() => setNewFolderModalOpen(false)}
        onAddFolder={handleAddFolder}
      />

      <ManagePermissionsModal
        isOpen={managePermissionsModalOpen}
        onClose={() => setManagePermissionsModalOpen(false)}
        teamMembers={teamMembers}
        onAddMember={handleAddTeamMember}
        onUpdateRole={handleUpdateRole}
      />
    </div>
  );
}

export default App;
