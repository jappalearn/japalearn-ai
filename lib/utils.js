import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatNaira(val) {
  if (!val || val === '-' || typeof val !== 'string' && typeof val !== 'number') return val;
  const s = String(val);
  if (s === 'Thinking...') return s;

  return s.replace(/₦?\s*([\d,]+(\.\d+)?)/g, (match, p1) => {
    const num = parseFloat(p1.replace(/,/g, ''));
    if (isNaN(num)) return match;
    let formatted = num;
    if (num >= 1000000) {
      formatted = (num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1) + 'M';
    } else if (num >= 1000) {
      formatted = (num / 1000).toFixed(0) + 'K';
    }
    return `₦${formatted}`;
  }).replace(/\s*-\s*/g, ' – '); // Use en-dash for ranges
}
