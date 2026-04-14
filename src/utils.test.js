import { describe, it, expect } from 'vitest'
import { formatCurrency, formatDate } from './utils'

describe('formatCurrency', () => {
  it('should format USD currency correctly', () => {
    expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56')
  })

  it('should format EUR currency correctly', () => {
    expect(formatCurrency(1234.56, 'EUR')).toBe('€1,234.56')
  })

  it('should handle zero amount', () => {
    expect(formatCurrency(0, 'USD')).toBe('$0.00')
  })

  it('should handle negative amounts', () => {
    expect(formatCurrency(-500, 'USD')).toBe('$-500.00')
  })
})

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = '2024-03-15'
    const result = formatDate(date)
    expect(result).toMatch(/Mar 15, 2024/)
  })

  it('should handle Date objects', () => {
    const date = new Date('2024-03-15')
    const result = formatDate(date)
    expect(result).toBeTruthy()
  })
})
