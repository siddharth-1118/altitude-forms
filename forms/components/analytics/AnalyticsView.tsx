import React, { useState } from 'react';
import {
  Sparkles,
  AlertTriangle,
  Share2,
  Download,
  ArrowRight,
  ShieldAlert,
  Info,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  RefreshCw,
} from 'lucide-react';
import { AnalyticsData, LiveFeedItem } from '../../types';

interface AnalyticsViewProps {
  analytics: AnalyticsData;
  onOpenDevTicketModal: () => void;
  onOpenQuarantineModal: () => void;
  onShareInsights: () => void;
  onExportPDF: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  analytics,
  onOpenDevTicketModal,
  onOpenQuarantineModal,
  onShareInsights,
  onExportPDF,
}) => {
  const [selectedFormTitle, setSelectedFormTitle] = useState(analytics.formTitle);

  return (
    <div id="analytics-view-container" className="flex-1 overflow-y-auto bg-[#fbfbfe] p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Main Survey Header matching Image 3 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black tracking-tight text-[#111827]">
                {selectedFormTitle}
              </h1>
            </div>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-[#6b7280] font-mono">
              <span className="flex items-center gap-1.5 text-[#00a8b5] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#00a8b5] animate-pulse" />
                LIVE COLLECTING
              </span>
              <span>•</span>
              <span className="font-semibold text-[#374151]">
                {analytics.responsesCount.toLocaleString()} RESPONSES
              </span>
              <span>•</span>
              <span>UPDATED {analytics.updatedText}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="btn-share-live-insights"
              onClick={onShareInsights}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#374151] hover:text-[#111827] bg-white hover:bg-[#f9fafb] border border-[#e5e7eb] rounded-xl shadow-2xs transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-[#6b7280]" />
              <span>Share Live Insights</span>
            </button>
            <button
              id="btn-export-pdf"
              onClick={onExportPDF}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-[#374151] hover:bg-[#1f2937] rounded-xl shadow-2xs transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Row 1: AI Insights Summary (Left) & Data Integrity Alert (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* AI Insights Summary Card (Left - 8 cols) */}
          <div
            id="ai-insights-card"
            className="lg:col-span-8 bg-gradient-to-br from-[#ecfdf5] via-[#faf8ff] to-[#f0fdfa] border border-[#a7f3d0] rounded-2xl p-6 shadow-2xs flex flex-col justify-between"
          >
            <div>
              {/* Header tag */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#7c3aed]">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Insights Summary</span>
                </div>
                <div className="px-2.5 py-1 bg-[#ede9fe] text-[#6d28d9] rounded-full text-[10px] font-bold tracking-wider uppercase font-mono">
                  PROCESSING 1,248 NLP ENTRIES
                </div>
              </div>

              {/* Big summary headline */}
              <h2 className="text-xl font-bold text-[#1e1b4b] leading-snug">
                Users are{' '}
                <span className="text-[#6d28d9]">
                  {analytics.nlpSummary.positivePct}% positive
                </span>{' '}
                about the new UI, but highlight{' '}
                <span className="text-[#dc2626]">
                  {analytics.nlpSummary.frictionKeyword}
                </span>{' '}
                as a critical friction point.
              </h2>
            </div>

            {/* 3 Summary Pill Boxes at bottom matching Image 3 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 pt-4 border-t border-[#e9d5ff]">
              <div className="bg-white/90 backdrop-blur-sm border border-[#e9d5ff] rounded-xl p-3 shadow-2xs">
                <div className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider">
                  TOP PRAISE
                </div>
                <div className="text-xs font-bold text-[#111827] mt-1">
                  {analytics.nlpSummary.topPraise.label} ({analytics.nlpSummary.topPraise.pct}%)
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm border border-[#e9d5ff] rounded-xl p-3 shadow-2xs">
                <div className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider">
                  TOP COMPLAINT
                </div>
                <div className="text-xs font-bold text-[#111827] mt-1">
                  {analytics.nlpSummary.topComplaint.label} ({analytics.nlpSummary.topComplaint.pct}%)
                </div>
              </div>

              <div
                id="btn-suggested-action"
                onClick={onOpenDevTicketModal}
                className="bg-white/90 backdrop-blur-sm border border-[#e9d5ff] hover:border-[#7c3aed] rounded-xl p-3 shadow-2xs flex flex-col justify-between cursor-pointer group transition-all"
              >
                <div className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider">
                  SUGGESTED ACTION
                </div>
                <div className="text-xs font-bold text-[#7c3aed] group-hover:text-[#6d28d9] flex items-center justify-between mt-1">
                  <span>{analytics.nlpSummary.suggestedAction}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          {/* Data Integrity Alert Card (Right - 4 cols) */}
          <div
            id="data-integrity-card"
            className="lg:col-span-4 bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-2xs flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-center gap-2 text-xs font-bold text-[#dc2626]">
                <AlertTriangle className="w-4 h-4" />
                <span>Data Integrity Alert</span>
              </div>

              {/* Big Metric */}
              <div className="mt-4">
                <div className="text-4xl font-black text-[#111827] tracking-tight">
                  {analytics.dataIntegrityAlert.suspiciousPct}%
                </div>
                <p className="text-xs text-[#4b5563] mt-1">
                  {analytics.dataIntegrityAlert.description}
                </p>
              </div>

              {/* Red warning box */}
              <div className="mt-4 bg-[#fef2f2] border border-[#fecaca] rounded-xl p-3 text-xs text-[#991b1b] flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#dc2626] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Bot Pattern Detected</span>
                  <p className="text-[11px] text-[#b91c1c] mt-0.5 leading-relaxed font-mono">
                    {analytics.dataIntegrityAlert.botCount} responses submitted in{' '}
                    {analytics.dataIntegrityAlert.botTimeWindow}
                  </p>
                </div>
              </div>
            </div>

            {/* Review Button */}
            <button
              id="btn-review-quarantine"
              onClick={onOpenQuarantineModal}
              className="mt-5 w-full py-2.5 bg-[#d1fae5] hover:bg-[#a7f3d0] text-[#3730a3] text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
            >
              Review & Quarantine
            </button>
          </div>
        </div>

        {/* Row 2: Response Time Heatmap (Left) & Completion Funnel (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Response Time Heatmap (6 cols) */}
          <div
            id="response-time-heatmap-card"
            className="lg:col-span-6 bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-2xs"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#111827]">
                Response Time Heatmap
              </h3>
              {/* Color legend pills */}
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-2.5 rounded-xs bg-[#a7f3d0]" />
                <span className="w-4 h-2.5 rounded-xs bg-[#6366f1]" />
                <span className="w-4 h-2.5 rounded-xs bg-[#312e81]" />
              </div>
            </div>

            {/* Custom Interactive Heatmap Bar Chart matching Image 3 */}
            <div className="relative border border-[#f0f2f5] rounded-xl p-4 bg-[#fafbfc]">
              {/* Horizontal grid lines */}
              <div className="absolute inset-x-4 top-4 bottom-10 flex flex-col justify-between pointer-events-none opacity-40">
                <div className="border-b border-[#e5e7eb] w-full" />
                <div className="border-b border-[#e5e7eb] w-full" />
                <div className="border-b border-[#e5e7eb] w-full" />
                <div className="border-b border-[#e5e7eb] w-full" />
              </div>

              {/* Bar columns */}
              <div className="h-44 flex items-end justify-around relative z-1 gap-3 pt-4">
                {/* Bar 1: < 10s */}
                <div className="flex-1 flex flex-col items-center group h-full justify-end">
                  <div className="w-full bg-[#a7f3d0] group-hover:bg-[#a5b4fc] rounded-t-md transition-all h-[35%]" />
                </div>
                {/* Bar 2: 30s light */}
                <div className="flex-1 flex flex-col items-center group h-full justify-end">
                  <div className="w-full bg-[#818cf8] group-hover:bg-[#6366f1] rounded-t-md transition-all h-[60%]" />
                </div>
                {/* Bar 3: 30s dark */}
                <div className="flex-1 flex flex-col items-center group h-full justify-end">
                  <div className="w-full bg-[#312e81] group-hover:bg-[#1e1b4b] rounded-t-md transition-all h-[95%]" />
                </div>
                {/* Bar 4: 1m */}
                <div className="flex-1 flex flex-col items-center group h-full justify-end">
                  <div className="w-full bg-[#6366f1] group-hover:bg-[#00a8b5] rounded-t-md transition-all h-[100%]" />
                </div>
                {/* Bar 5: 1m medium */}
                <div className="flex-1 flex flex-col items-center group h-full justify-end">
                  <div className="w-full bg-[#818cf8] group-hover:bg-[#6366f1] rounded-t-md transition-all h-[75%]" />
                </div>
                {/* Bar 6: > 2m light */}
                <div className="flex-1 flex flex-col items-center group h-full justify-end">
                  <div className="w-full bg-[#a7f3d0] group-hover:bg-[#a5b4fc] rounded-t-md transition-all h-[45%]" />
                </div>
                {/* Bar 7: > 2m pale */}
                <div className="flex-1 flex flex-col items-center group h-full justify-end">
                  <div className="w-full bg-[#d1fae5] group-hover:bg-[#a7f3d0] rounded-t-md transition-all h-[25%]" />
                </div>
              </div>

              {/* X-axis labels */}
              <div className="flex justify-between text-[10px] font-mono text-[#6b7280] pt-3 px-2 border-t border-[#e5e7eb] mt-2">
                <span>&lt; 10s</span>
                <span>30s</span>
                <span>1m</span>
                <span>&gt; 2m</span>
              </div>
            </div>
          </div>

          {/* Completion Funnel (6 cols) */}
          <div
            id="completion-funnel-card"
            className="lg:col-span-6 bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-2xs flex flex-col justify-between"
          >
            <h3 className="text-sm font-bold text-[#111827] mb-4">
              Completion Funnel
            </h3>

            <div className="space-y-4">
              {/* Step 1: Viewed Form */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-[#111827] mb-1.5">
                  <span>Viewed Form</span>
                  <span className="font-mono text-[#4b5563]">100% (4,520)</span>
                </div>
                <div className="w-full h-2.5 bg-[#f3f4f6] rounded-full overflow-hidden">
                  <div className="h-full bg-[#312e81] rounded-full w-full" />
                </div>
              </div>

              {/* Step 2: Started Form */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-[#111827] mb-1.5">
                  <span>Started Form</span>
                  <span className="font-mono text-[#4b5563]">78% (3,525)</span>
                </div>
                <div className="w-full h-2.5 bg-[#f3f4f6] rounded-full overflow-hidden">
                  <div className="h-full bg-[#00a8b5] rounded-full w-[78%]" />
                </div>
              </div>

              {/* Step 3: Reached Q5 (Friction point) */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-[#111827] mb-1.5">
                  <span>Reached Q5 (Friction point)</span>
                  <span className="font-mono text-[#4b5563]">42% (1,898)</span>
                </div>
                <div className="w-full h-2.5 bg-[#f3f4f6] rounded-full overflow-hidden">
                  <div className="h-full bg-[#dc2626] rounded-full w-[42%]" />
                </div>
                <div className="text-[11px] font-bold text-[#dc2626] mt-1 font-mono">
                  ↓ 36% drop-off here
                </div>
              </div>

              {/* Step 4: Completed */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-[#111827] mb-1.5">
                  <span>Completed</span>
                  <span className="font-mono text-[#4b5563]">27% (1,248)</span>
                </div>
                <div className="w-full h-2.5 bg-[#f3f4f6] rounded-full overflow-hidden">
                  <div className="h-full bg-[#374151] rounded-full w-[27%]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Geographic Distribution (Left) & Live Feed (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Geographic Distribution Card (Left - 6 cols) */}
          <div
            id="geographic-distribution-card"
            className="lg:col-span-6 bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-2xs flex flex-col justify-between"
          >
            <h3 className="text-sm font-bold text-[#111827] mb-3">
              Geographic Distribution
            </h3>

            {/* Visual map container with pulsing nodes matching Image 3 */}
            <div className="relative h-64 bg-[#ecfdf5] rounded-xl border border-[#d1fae5] overflow-hidden flex items-center justify-center p-4">
              {/* Map background icon / graphic */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <svg
                  className="w-full h-full text-[#818cf8]"
                  viewBox="0 0 400 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M50 80 Q100 60 140 90 T220 70 T320 100 T380 70"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                  <path
                    d="M40 120 Q120 140 180 110 T280 130 T360 110"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                </svg>
              </div>

              {/* Pulsing Regional Nodes */}
              {/* Node 1: North America */}
              <div className="absolute left-[35%] top-[30%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-[#00a8b5] animate-ping opacity-75" />
                <div className="absolute w-3 h-3 rounded-full bg-[#00a8b5] border-2 border-white shadow-xs" />
              </div>

              {/* Node 2: Europe */}
              <div className="absolute left-[48%] top-[65%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#00a8b5] border-2 border-white" />
              </div>

              {/* Node 3: Asia Pacific */}
              <div className="absolute right-[22%] top-[55%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-[#00a8b5] animate-ping opacity-75" />
                <div className="absolute w-3.5 h-3.5 rounded-full bg-[#00a8b5] border-2 border-white shadow-xs" />
              </div>

              {/* Center Map Icon overlay */}
              <div className="w-12 h-12 rounded-xl bg-white/80 backdrop-blur-sm border border-[#a7f3d0] text-[#00a8b5] flex items-center justify-center shadow-xs">
                <MapPin className="w-6 h-6" />
              </div>

              {/* Top Regions floating stats box matching Image 3 */}
              <div className="absolute left-4 bottom-4 bg-white/95 backdrop-blur-sm border border-[#e5e7eb] rounded-xl p-3 shadow-sm min-w-44">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280] mb-2">
                  TOP REGIONS
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-[#374151]">North America</span>
                    <span className="font-bold text-[#111827] font-mono">45%</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-[#374151]">Europe</span>
                    <span className="font-bold text-[#111827] font-mono">32%</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-[#374151]">Asia Pacific</span>
                    <span className="font-bold text-[#111827] font-mono">18%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Feed Card (Right - 6 cols) matching Image 3 */}
          <div
            id="live-feed-card"
            className="lg:col-span-6 bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-2xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-sm font-bold text-[#111827]">Live Feed</h3>
              </div>
              <span className="text-xs text-[#6b7280] font-mono">
                Updated real-time
              </span>
            </div>

            {/* List of live incoming feed responses matching Image 3 */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {analytics.liveFeed.map((item) => (
                <div
                  key={item.id}
                  id={`live-feed-item-${item.id.replace('#', '')}`}
                  className="border border-[#f0f2f5] rounded-xl p-3.5 hover:border-[#e5e7eb] transition-all bg-[#fafafa]"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-semibold text-[#6b7280]">
                      ID: {item.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md capitalize font-mono ${
                        item.sentiment === 'positive'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : item.sentiment === 'negative'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {item.sentiment}
                    </span>
                  </div>
                  <p className="text-xs text-[#1f2937] leading-relaxed font-normal">
                    "{item.comment}"
                  </p>
                  <div className="text-[10px] text-[#9ca3af] mt-2 font-mono">
                    {item.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
