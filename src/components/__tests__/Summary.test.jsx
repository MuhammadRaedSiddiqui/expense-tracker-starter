import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Summary from '../Summary'

describe('Summary Component', () => {
  const mockTransactions = [
    { id: 1, type: 'income', amount: 5000, description: 'Salary' },
    { id: 2, type: 'expense', amount: 1200, description: 'Rent' },
    { id: 3, type: 'expense', amount: 300, description: 'Groceries' },
    { id: 4, type: 'income', amount: 500, description: 'Freelance' }
  ]

  it('should render income, expenses, and balance', () => {
    render(<Summary transactions={mockTransactions} />)

    // Check that all three metrics are displayed
    expect(screen.getByText(/income/i)).toBeInTheDocument()
    expect(screen.getByText(/expenses/i)).toBeInTheDocument()
    expect(screen.getByText(/balance/i)).toBeInTheDocument()
  })

  it('should calculate total income correctly', () => {
    render(<Summary transactions={mockTransactions} />)

    // Total income: 5000 + 500 = 5500
    expect(screen.getByText('$5,500.00')).toBeInTheDocument()
  })

  it('should calculate total expenses correctly', () => {
    render(<Summary transactions={mockTransactions} />)

    // Total expenses: 1200 + 300 = 1500
    expect(screen.getByText('$1,500.00')).toBeInTheDocument()
  })

  it('should calculate balance correctly', () => {
    render(<Summary transactions={mockTransactions} />)

    // Balance: 5500 - 1500 = 4000
    expect(screen.getByText('$4,000.00')).toBeInTheDocument()
  })

  it('should handle empty transactions array', () => {
    render(<Summary transactions={[]} />)

    // All values should be $0.00
    const zeroValues = screen.getAllByText('$0.00')
    expect(zeroValues).toHaveLength(3) // income, expenses, balance
  })

  it('should handle negative balance', () => {
    const negativeTransactions = [
      { id: 1, type: 'income', amount: 1000 },
      { id: 2, type: 'expense', amount: 1500 }
    ]

    render(<Summary transactions={negativeTransactions} />)

    // Balance: 1000 - 1500 = -500
    expect(screen.getByText('$-500.00')).toBeInTheDocument()
  })
})
