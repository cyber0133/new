import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatNumber(num: number, digits: number = 2) {
  return num.toFixed(digits);
}

export function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleString();
}

export function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

// Simulation helpers
export function randomPriceChange(
currentPrice: number,
volatility: number = 0.0001)
{
  const change = currentPrice * volatility * (Math.random() - 0.5);
  return currentPrice + change;
}