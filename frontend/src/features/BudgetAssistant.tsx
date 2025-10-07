import { Sparkles, Upload, X } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useDashboardStore } from '@store/dashboardStore';
import { formatDate } from '@utils/format';

export const BudgetAssistant = () => {
  const { chatHistory, sendChatPrompt } = useDashboardStore((state) => ({
    chatHistory: state.chatHistory,
    sendChatPrompt: state.sendChatPrompt
  }));
  const [prompt, setPrompt] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }, [chatHistory, isOpen]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed) return;
    sendChatPrompt(trimmed);
    setPrompt('');
  };

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div
          id="ai-assistant-widget"
          className="pointer-events-auto glass-panel flex h-[28rem] w-[min(420px,calc(100vw-3rem))] flex-col overflow-hidden shadow-2xl"
        >
          <header className="flex items-center justify-between border-b border-white/40 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600">
                <Sparkles size={20} />
              </span>
              <div className="text-left">
                <p className="text-xs uppercase tracking-widest text-slate-500">AI ассистент</p>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Чат по бюджету</h2>
              </div>
            </div>
            <button
              type="button"
              className="rounded-full p-2 text-slate-500 transition hover:bg-white/60 hover:text-slate-700"
              onClick={() => setIsOpen(false)}
              aria-label="Закрыть чат ассистента"
            >
              <X size={18} />
            </button>
          </header>
          <div ref={scrollContainerRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4 text-sm scrollbar">
            {chatHistory.length === 0 && (
              <p className="rounded-2xl bg-white/60 px-4 py-3 text-sm text-slate-500">
                Задайте вопрос, и ассистент поможет оптимизировать бюджет и подскажет, где можно сэкономить.
              </p>
            )}
            {chatHistory.map((message) => (
              <article
                key={message.id}
                className={
                  message.role === 'assistant'
                    ? 'self-start rounded-3xl bg-brand-500/10 px-4 py-3 text-brand-700 dark:text-brand-200'
                    : 'self-end rounded-3xl bg-slate-900 px-4 py-3 text-white'
                }
              >
                <p className="text-xs text-slate-400">
                  {message.role === 'assistant' ? 'MinifyAI' : 'Вы'} · {formatDate(message.createdAt)}
                </p>
                <p className="mt-1 whitespace-pre-line text-sm leading-relaxed">{message.content}</p>
              </article>
            ))}
          </div>
          <form
            onSubmit={handleSubmit}
            className="border-t border-white/40 bg-white/70 px-5 py-4 dark:border-white/10 dark:bg-slate-900/60"
          >
            <div className="flex items-center gap-3 rounded-3xl bg-white/90 px-4 py-3 shadow-inner dark:bg-white/10">
              <input
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Спроси у ИИ: куда можно сократить расходы?"
                className="flex-1 border-none bg-transparent text-sm focus:outline-none"
              />
              <button
                type="button"
                className="hidden items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow md:inline-flex"
              >
                <Upload size={14} /> История
              </button>
              <button
                type="submit"
                className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition enabled:hover:bg-brand-600 disabled:opacity-40"
                disabled={!prompt.trim()}
              >
                Отправить
              </button>
            </div>
          </form>
        </div>
      )}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-xl transition hover:bg-brand-600"
        aria-expanded={isOpen}
        aria-controls="ai-assistant-widget"
      >
        <Sparkles size={18} /> AI ассистент
      </button>
    </div>
  );
};
