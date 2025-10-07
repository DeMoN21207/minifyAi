import type { CurrencyCode, MoneyAmount } from '@types/index';

const currencyMap: Record<CurrencyCode, string> = {
  RUB: '₽',
  USD: '$',
  EUR: '€'
};

export const formatMoney = ({ currency, amount }: MoneyAmount, fractionDigits = 2) => {
  return `${amount.toLocaleString('ru-RU', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  })} ${currencyMap[currency]}`;
};

export const formatDate = (iso: string) => new Date(iso).toLocaleDateString('ru-RU');
