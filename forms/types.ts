export type FieldType =
  | 'short_text'
  | 'long_text'
  | 'email'
  | 'multiple_choice'
  | 'digital_signature'
  | 'calendar_booking'
  | 'multi_language'
  | 'voice_input';

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  aiSuggested?: boolean;
  section?: string;
  helpText?: string;
}

export interface LogicRule {
  id: string;
  name: string;
  fieldId: string;
  condition: 'equals' | 'not_equals' | 'contains' | 'is_filled' | 'is_empty';
  value: string;
  action: 'show_field' | 'hide_field' | 'jump_to_section' | 'require_field' | 'send_email_alert';
  targetFieldId?: string;
  targetMessage?: string;
  enabled: boolean;
}

export interface FormSettings {
  submitButtonText?: string;
  confirmationMessage?: string;
  redirectUrl?: string;
  allowMultipleSubmissions?: boolean;
  limitOnePerIP?: boolean;
  passwordProtection?: boolean;
  password?: string;
  emailNotifications?: boolean;
  notificationEmail?: string;
  autoResponder?: boolean;
  brandColor?: string;
  offlineEnabled?: boolean;
  closeAfterDate?: string;
  maxResponses?: number;
}

export interface FormItem {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'live' | 'draft' | 'archived';
  fields: FormField[];
  responsesCount: number;
  updatedAt: string;
  folderId?: string;
  headerBadgeIcon?: string;
  bannerImage?: string;
  logicRules?: LogicRule[];
  settings?: FormSettings;
}

export interface WorkflowStep {
  id: string;
  label: string;
  type: 'trigger' | 'notification' | 'action' | 'ai';
  icon: string;
  description?: string;
}

export interface Workflow {
  id: string;
  name: string;
  trigger: string;
  triggerIcon: string;
  steps: WorkflowStep[];
  enabled: boolean;
  isAiActive?: boolean;
}

export interface DirectoryFolder {
  id: string;
  name: string;
  formsCount: number;
  updatedAt: string;
  isLocked?: boolean;
  color: string;
  iconType: 'folder' | 'briefcase' | 'lock';
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';
  avatarInitials: string;
  avatarBg: string;
}

export interface LiveFeedItem {
  id: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  comment: string;
  timestamp: string;
  rating?: number;
  user?: string;
}

export interface AnalyticsData {
  formId: string;
  formTitle: string;
  isLiveCollecting: boolean;
  responsesCount: number;
  updatedText: string;
  nlpSummary: {
    positivePct: number;
    frictionKeyword: string;
    summaryHeadline: string;
    topPraise: { label: string; pct: number };
    topComplaint: { label: string; pct: number };
    suggestedAction: string;
  };
  dataIntegrityAlert: {
    suspiciousPct: number;
    description: string;
    botCount: number;
    botTimeWindow: string;
  };
  responseTimeHeatmap: {
    interval: string;
    count: number;
    pct: number;
    colorLevel: 'light' | 'medium' | 'dark' | 'navy';
  }[];
  completionFunnel: {
    step: string;
    pct: number;
    count: number;
    isFrictionPoint?: boolean;
    dropOffText?: string;
  }[];
  geoDistribution: {
    region: string;
    pct: number;
  }[];
  liveFeed: LiveFeedItem[];
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  appliedAction?: string;
}
