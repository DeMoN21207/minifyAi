import { Sparkles, Upload } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useDashboardStore } from '@store/dashboardStore';
import { formatDate } from '@utils/format';

export const BudgetAssistant = () => {
  const { chatHistory, sendChatPrompt } = useDashboardStore((state) => ({
    chatHistory: state.chatHistory,
    sendChatPrompt: state.sendChatPrompt
  }));
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!prompt.trim()) return;
    sendChatPrompt(prompt);
    setPrompt('');
  };

  return (
    <section className="glass-panel flex h-full flex-col overflow-hidden p-6">
      <header className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600">
          <Sparkles size={20} />
        </span>
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500">AI ассистент</p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Чат по бюджету</h2>
        </div>
      </header>
      <div className="mt-4 flex flex-1 flex-col gap-3 overflow-y-auto pr-2 text-sm scrollbar">
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
      <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-3 rounded-3xl bg-white/80 px-4 py-3 shadow-inner dark:bg-white/5">
        <input
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Спроси у ИИ: куда можно сократить расходы?"
          className="flex-1 border-none bg-transparent text-sm focus:outline-none"
        />
        <button type="button" className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow">
          <Upload size={14} /> История
        </button>
        <button
          type="submit"
          className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-lg disabled:opacity-40"
          disabled={!prompt.trim()}
        >
          Отправить
        </button>
      </form>
    </section>
  );
};
