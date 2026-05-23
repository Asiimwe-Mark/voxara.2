import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatUGX(amount: number): string {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-UG', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

export function generateReceiptNumber(schoolCode: string, sequence: number): string {
  const now = new Date()
  const yearMonth = now.toISOString().slice(0, 7).replace('-', '')
  const seq = String(sequence).padStart(4, '0')
  return `SKULI-${schoolCode}-${yearMonth}-${seq}`
}
