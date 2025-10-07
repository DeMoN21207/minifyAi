import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useMemo} from 'react';
import {LineChart, TrendingUp} from 'lucide-react';
import dayjs from 'dayjs';
import {useDashboardStore} from '@store/dashboardStore';

export const MultiCurrencyRates = () => {
  const {exchangeRates, selectedCurrency} = useDashboardStore((state) => ({
    exchangeRates: state.exchangeRates,
    selectedCurrency: state.selectedCurrency
  }));

  const pairs = useMemo(() => {
    const relevant = exchangeRates.filter((rate) => rate.base === selectedCurrency);
    if (relevant.length > 0) return relevant;
    return exchangeRates.filter((rate) => rate.quote === selectedCurrency);
  }, [exchangeRates, selectedCurrency]);

  return (
      <section className="glass-panel flex flex-col gap-4 p-6">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">Курсы валют</p>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Мультивалюта</h2>
          </div>
          <span
              className="flex items-center gap-2 rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600">
          <TrendingUp size={14}/> {dayjs().format('DD MMM YYYY')}
        </span>
        </header>
        <ul className="flex flex-col gap-3 text-sm">
          {pairs.length === 0 && (
              <li className="rounded-2xl bg-white/70 px-4 py-3 text-slate-400 shadow-inner">
                Нет актуальных курсов для выбранной валюты
              </li>
          )}
          {pairs.map((rate: { base: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; quote: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; date: string | number | dayjs.Dayjs | Date | null | undefined; rate: number; }) => (
          <li key={`${rate.base}-${rate.quote}-${rate.date}`} className="flex items-center justify-between rounded-2xl bg-white/80 px-4 py-3 shadow-inner dark:bg-white/5">
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">
                {rate.base} → {rate.quote}
              </p>
              <p className="text-xs text-slate-500">{dayjs(rate.date).format('DD MMM')}</p>
            </div>
            <div className="flex items-center gap-3 text-right">
              <span className="font-mono text-lg text-slate-800 dark:text-white">{rate.rate.toFixed(2)}</span>
              <LineChart size={18} className="text-brand-500" />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};
