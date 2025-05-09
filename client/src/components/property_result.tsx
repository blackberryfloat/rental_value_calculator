import { Card, CardContent, Chip, Typography } from "@mui/material";
import { PropertyFinancials } from "../state/property_financials";


interface PropertyResultProps {
    propertyFinancials: PropertyFinancials
}

export function PropertyResult({propertyFinancials}: PropertyResultProps) {
  return (
    <Card sx={{ borderColor: propertyFinancials.getNetProfitColor(), borderWidth: 2, borderStyle: 'solid' }}>
        <CardContent>
            <Typography variant="h5" gutterBottom>
            Results
            </Typography>
            <Typography variant="body1">
            <strong>Gross Monthly Income:</strong> ${propertyFinancials.monthlyRevenue().toFixed(2)}
            </Typography>
            <Typography variant="body1">
            <strong>Monthly Expenses:</strong> ${propertyFinancials.monthlyCost().toFixed(2)}
            </Typography>
            <Typography variant="body1">
            <strong>Management Cost:</strong> ${propertyFinancials.monthlyManagementCost().toFixed(2)}
            </Typography>
            <Typography variant="body1">
            <strong>Net Profit:</strong> ${propertyFinancials.monthlyNetProfit().toFixed(2)}
            </Typography>
            <Chip
            label={`Net Profit: ${propertyFinancials.monthlyNetProfit() < 0 ? 'Negative' : 'Positive'}`}
            sx={{ marginTop: 2 }}
            />
        </CardContent>
    </Card>
  );
}