import { EXCHANGE_RATES, BASE_CURRENCY, CURRENCIES } from './constants';

export const convertToBaseCurrency = (amount, fromCurrency, exchangeRates = EXCHANGE_RATES) => {
  if (fromCurrency === BASE_CURRENCY) {
    return amount;
  }
  // Convert to USD: divide by the exchange rate
  return amount / exchangeRates[fromCurrency];
};

export const convertFromBaseCurrency = (amount, toCurrency, exchangeRates = EXCHANGE_RATES) => {
  if (toCurrency === BASE_CURRENCY) {
    return amount;
  }
  // Convert from USD: multiply by the exchange rate
  return amount * exchangeRates[toCurrency];
};

export const formatCurrency = (amount, currencyCode = BASE_CURRENCY) => {
  const currency = CURRENCIES.find(c => c.code === currencyCode);
  const symbol = currency ? currency.symbol : '$';

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount).replace(/^/, symbol);
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

