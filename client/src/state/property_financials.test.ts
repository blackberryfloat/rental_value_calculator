import { describe, it, expect } from 'vitest'
import { PropertyFinancials } from './property_financials'
import type { InputDataType } from '../components/input_form'

const inputData: InputDataType = {
  propertyCost: 200_000,
  downPayment: 50_000,
  apr: 5,                     // percent
  termYears: 30,
  revenueStreams: [{ value: 2_000, count: 1 }],
  occupancyRatePercent: 95,   // percent
  propertyTax: 500,
  insuranceCost: 100,
  managementExpensePercent: 8 // percent
}

describe('PropertyFinancials', () => {
  const pf = new PropertyFinancials(inputData)

  it('converts percents to decimals in constructor', () => {
    const data = pf.getInputData()
    expect(data.apr).toBeCloseTo(0.05)
    expect(data.managementExpensePercent).toBeCloseTo(0.08)
    expect(data.occupancyRatePercent).toBeCloseTo(0.95)
  })

  it('calculates monthly loan payment', () => {
    const payment = pf.monthlyLoanPayment()
    // formula payment ≈ 805.23 for P=150k, r=0.05/12, n=360
    expect(payment).toBeCloseTo(805.23, 2)
  })

  it('calculates monthly revenue', () => {
    // 2000 * 1 * 0.95
    expect(pf.monthlyRevenue()).toBeCloseTo(1900)
  })

  it('calculates monthly management cost', () => {
    // revenue * 0.08
    expect(pf.monthlyManagementCost()).toBeCloseTo(1900 * 0.08)
  })

  it('calculates monthly maintenance cost', () => {
    // 1% annual of 200k / 12
    expect(pf.monthlyMaintenanceCost()).toBeCloseTo((200_000 * 0.01) / 12)
  })

  it('calculates total monthly cost', () => {
    const expected =
      500 + 100 +                   // tax + insurance
      (200_000 * 0.01) / 12 +       // maintenance
      1900 * 0.08 +                 // management
      pf.monthlyLoanPayment()       // loan
    expect(pf.monthlyCost()).toBeCloseTo(expected, 2)
  })

  it('calculates monthly net profit', () => {
    expect(pf.monthlyNetProfit()).toBeCloseTo(
      pf.monthlyRevenue() - pf.monthlyCost(),
      2
    )
  })

  it('returns correct net profit color', () => {
    // threshold = (200k/12)*0.05 ≈ 833.33
    // net profit ≈ 1900 - 1723.90 ≈ 176.10 → warning
    expect(pf.getNetProfitColor()).toBe('warning')
  })
})