import { describe, it, expect } from 'vitest'
import { convertToBaseCurrency, convertFromBaseCurrency } from './utils'

describe('Currency Conversion', () => {
  const mockRates = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    JPY: 110.0
  }

  describe('convertToBaseCurrency', () => {
    it('should return same amount for USD', () => {
      expect(convertToBaseCurrency(100, 'USD', mockRates)).toBe(100)
    })

    it('should convert EUR to USD correctly', () => {
      const result = convertToBaseCurrency(85, 'EUR', mockRates)
      expect(result).toBe(100)
    })

    it('should convert GBP to USD correctly', () => {
      const result = convertToBaseCurrency(73, 'GBP', mockRates)
      expect(result).toBe(100)
    })

    it('should handle zero amounts', () => {
      expect(convertToBaseCurrency(0, 'EUR', mockRates)).toBe(0)
    })
  })

  describe('convertFromBaseCurrency', () => {
    it('should return same amount for USD', () => {
      expect(convertFromBaseCurrency(100, 'USD', mockRates)).toBe(100)
    })

    it('should convert USD to EUR correctly', () => {
      const result = convertFromBaseCurrency(100, 'EUR', mockRates)
      expect(result).toBe(85)
    })

    it('should convert USD to JPY correctly', () => {
      const result = convertFromBaseCurrency(100, 'JPY', mockRates)
      expect(result).toBe(11000)
    })
  })
})
