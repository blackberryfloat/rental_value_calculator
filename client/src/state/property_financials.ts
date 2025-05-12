import type { InputDataType } from "../components/input_form";

export class PropertyFinancials {
    private inputData: InputDataType;

    constructor(inputData: InputDataType) {
        this.inputData = { ...inputData };
        this.inputData.apr /= 100; // Convert APR to decimal
        this.inputData.managementExpensePercent /= 100; // Convert management cost to decimal
        this.inputData.occupancyRatePercent /= 100; // Convert occupancy rate to decimal
    }

    getInputData(): InputDataType {
        return {...this.inputData};
    }

    monthlyLoanPayment(): number {
        const principal = this.inputData.propertyCost - this.inputData.downPayment;
        const monthlyInterestRate = this.inputData.apr / 12;
        const numPayments = this.inputData.termYears * 12;
        const ter = Math.pow(1 + monthlyInterestRate, numPayments);
        return (principal * monthlyInterestRate * ter) / (ter - 1);
    }

    monthlyManagementCost(): number {
        return this.monthlyRevenue() * this.inputData.managementExpensePercent;
    }

    monthlyMaintenanceCost(): number {
        const { propertyCost } = this.inputData;
        return (propertyCost * 0.01) / 12; // 1% of property cost
    }

    monthlyCost(): number {
        const { propertyTax, insuranceCost } = this.inputData;
        return propertyTax +
            insuranceCost +
            this.monthlyMaintenanceCost() +
            this.monthlyManagementCost() +
            this.monthlyLoanPayment();
    }

    monthlyRevenue(): number {
        const { revenueStreams, occupancyRatePercent: occupancyRate } = this.inputData;
        return revenueStreams.reduce(
            (total: number, stream: any) => total + stream.value * stream.count, // eslint-disable-line @typescript-eslint/no-explicit-any
            0
        ) * occupancyRate;
    }

    monthlyNetProfit(): number {
        return this.monthlyRevenue() - this.monthlyCost();
    }

    getNetProfitColor(): string {
        const netProfitThreshold = (this.inputData.propertyCost / 12) * 0.05; // 5% of property cost divided by 12
        const netProfit = this.monthlyNetProfit();
        let result: string;
        if (netProfit < 0) result = "error"; // Red
        else if (netProfit < netProfitThreshold) result = "warning"; // Yellow
        else result = "success"; // Green
        return result;
    }

    printSummary(): void {
        console.debug("Property Financials Summary:");
        console.debug("----------------------------");
        console.debug("Monthly Loan Payment:", this.monthlyLoanPayment());
        console.debug("Monthly Management Cost:", this.monthlyManagementCost());
        console.debug("Monthly Maintenance Cost:", this.monthlyMaintenanceCost());
        console.debug("Monthly Property Tax:", this.inputData.propertyTax);
        console.debug("Monthly Insurance Cost:", this.inputData.insuranceCost);
        console.debug("Monthly Cost:", this.monthlyCost());
        console.debug("Monthly Revenue:", this.monthlyRevenue());
        console.debug("Monthly Net Profit:", this.monthlyNetProfit());
        console.debug("Net Profit Color:", this.getNetProfitColor());
    }
}