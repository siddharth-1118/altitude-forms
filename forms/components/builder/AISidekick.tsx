import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  MoreVertical,
  Mic,
  MicOff,
  Send,
  Loader2,
  Bot,
  PlusCircle,
  Wand2,
} from 'lucide-react';
import { FormField, ChatMessage } from '../../types';

interface AISidekickProps {
  onAddFields: (fields: FormField[], suggestedTitle?: string, suggestedDescription?: string) => void;
  currentFormTitle: string;
  fieldsCount: number;
}

export const AISidekick: React.FC<AISidekickProps> = ({
  onAddFields,
  currentFormTitle,
  fieldsCount,
}) => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'Hi! I can help you build this form faster. What kind of information do you need to collect?',
      timestamp: 'Just now',
    },
  ]);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Voice recognition support
  const toggleSpeechRecognition = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your prompt.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputPrompt((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSendPrompt = async (promptToSend?: string) => {
    const text = promptToSend || inputPrompt;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/sidekick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          currentForm: {
            title: currentFormTitle,
            fieldsCount,
          },
        }),
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.message || 'I have added the requested fields to your form.',
        timestamp: 'Just now',
        appliedAction: data.fields?.length ? `Added ${data.fields.length} new fields` : undefined,
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (data.fields && data.fields.length > 0) {
        onAddFields(data.fields, data.suggestedTitle, data.suggestedDescription);
      }
    } catch (err) {
      console.error('Error invoking AI sidekick:', err);
      const errorMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: 'I added the recommended standard fields for you!',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestionChips = [
    'Add a contact section',
    'Generate feedback survey',
    'Add appointment booking',
    'Add digital signature block',
  ];

  return (
    <aside
      id="ai-sidekick-panel"
      className="w-full lg:w-84 bg-white border-t lg:border-t-0 lg:border-l border-[#e5e7eb] flex flex-col shrink-0 select-none h-80 lg:h-full"
    >
      {/* Header matching Image 1 */}
      <div className="px-5 py-4 border-b border-[#f3f4f6] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-[#ecfdf5] text-[#00a8b5] flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-[#111827]">AI Sidekick</h2>
        </div>
        <button
          id="btn-ai-menu"
          title="More options"
          className="text-[#9ca3af] hover:text-[#4b5563] p-1 rounded-md hover:bg-[#f3f4f6] cursor-pointer"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            {msg.sender === 'ai' && (
              <div className="w-7 h-7 rounded-full bg-[#ecfdf5] text-[#7c3aed] flex items-center justify-center shrink-0 border border-[#a7f3d0]">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#00a8b5] text-white rounded-tr-none shadow-sm'
                  : 'bg-[#f9fafb] text-[#1f2937] border border-[#e5e7eb] rounded-tl-none'
              }`}
            >
              <p>{msg.text}</p>
              {msg.appliedAction && (
                <div className="mt-2 pt-2 border-t border-[#e5e7eb] flex items-center gap-1.5 text-[11px] text-[#00a8b5] font-medium">
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>{msg.appliedAction}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#ecfdf5] text-[#7c3aed] flex items-center justify-center shrink-0 border border-[#a7f3d0]">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-2xl rounded-tl-none p-3.5 text-xs text-[#6b7280] flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00a8b5]" />
              <span>Generating schema & intelligence...</span>
            </div>
          </div>
        )}

        {/* Suggestion prompt chips (matching screenshot) */}
        {messages.length < 5 && (
          <div className="pt-2 flex flex-col items-start gap-2 pl-9">
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                id={`suggestion-chip-${idx}`}
                onClick={() => handleSendPrompt(chip)}
                className="bg-[#f3f4f8] hover:bg-[#e8ebf3] text-[#374151] hover:text-[#111827] text-xs font-medium px-3 py-1.5 rounded-full border border-[#e5e7eb] transition-all cursor-pointer text-left hover:scale-[1.02]"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input box matching Image 1 */}
      <div className="p-4 border-t border-[#f3f4f6] bg-white">
        <div className="border border-[#e5e7eb] rounded-2xl p-2.5 focus-within:border-[#00a8b5] focus-within:ring-1 focus-within:ring-[#00a8b5] transition-all bg-[#fafafa]">
          <textarea
            id="ai-prompt-textarea"
            rows={2}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendPrompt();
              }
            }}
            placeholder="e.g. Add a section for appointment booking..."
            className="w-full bg-transparent border-none text-xs text-[#1f2937] placeholder-[#9ca3af] resize-none focus:outline-none leading-relaxed"
          />
          <div className="flex items-center justify-between pt-1 border-t border-[#f0f1f4] mt-1">
            <button
              id="btn-ai-mic"
              type="button"
              onClick={toggleSpeechRecognition}
              title={isListening ? 'Stop listening' : 'Speak your prompt'}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isListening
                  ? 'bg-red-100 text-red-600 animate-pulse'
                  : 'text-[#9ca3af] hover:text-[#4b5563] hover:bg-[#ecfdf5]'
              }`}
            >
              {isListening ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>

            <button
              id="btn-ai-send"
              type="button"
              disabled={!inputPrompt.trim() || isLoading}
              onClick={() => handleSendPrompt()}
              className="w-7 h-7 bg-[#00a8b5] hover:bg-[#008894] disabled:opacity-40 text-white rounded-lg flex items-center justify-center transition-all cursor-pointer disabled:cursor-not-allowed shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
