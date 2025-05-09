import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, IconButton, Tooltip, Typography } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

interface RevenueStream {
    value: number;
    count: number;
}

export interface InputDataType {
    propertyCost: number;
    downPayment: number;
    apr: number;
    termYears: number;

    // Below is per month
    revenueStreams: RevenueStream[];
    occupancyRatePercent: number;
    propertyTax: number;
    insuranceCost: number;
    managementExpensePercent: number;
}

interface FormDataType {
    propertyCost: string;
    downPayment: string;
    apr: string;
    termYears: string;

    // Below is per month
    revenueStreams: {value: string, count: string}[];
    occupancyRatePercent: string;
    propertyTax: string;
    insuranceCost: string;
    managementExpensePercent: string;
}

interface InputFormProps {
    onSubmit: (data: InputDataType) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit }) => {
    let defaultDataStr = sessionStorage.getItem('input_data');
    let defaultData: FormDataType | undefined = defaultDataStr ? JSON.parse(defaultDataStr) : undefined;

    const [propertyCost, setPropertyCost] = useState<string>(defaultData?.propertyCost || "0");
    const [downPayment, setDownPayment] = useState<string>(defaultData?.downPayment || "0");
    const [apr, setApr] = useState<string>(defaultData?.apr || "0");
    const [termYears, setTermYears] = useState<string>(defaultData?.termYears || "0");
    const [revenueStreams, setRevenueStreams] = useState<{ value: string, count: string }[]>(
        defaultData?.revenueStreams || [{ value: "0", count: "1" }]
    );
    const [occupancyRatePercent, setOccupancyRatePercent] = useState<string>(defaultData?.occupancyRatePercent || "95");
    const [propertyTax, setPropertyTax] = useState<string>(defaultData?.propertyTax || "0");
    const [insuranceCost, setInsuranceCost] = useState<string>(defaultData?.insuranceCost || "0");
    const [managementExpensePercent, setManagementExpensePercent] = useState<string>(
        defaultData?.managementExpensePercent || "8"
    );

    const previousState = useRef<FormDataType>({
        propertyCost,
        downPayment,
        apr,
        termYears,
        revenueStreams,
        occupancyRatePercent,
        propertyTax,
        insuranceCost,
        managementExpensePercent,
    });

    const isFormComplete = () => {
        return (
            propertyCost !== "" &&
            parseFloat(propertyCost) > 0 && // Ensure propertyCost is greater than 0
            downPayment !== "" &&
            apr !== "" &&
            parseFloat(apr) > 0 && parseFloat(apr) <= 100 && // Ensure apr is between 0 and 100
            termYears !== "" &&
            parseInt(termYears, 10) > 0 && // Ensure termYears is greater than 0
            revenueStreams.every((stream) => stream.value !== "" && stream.count !== "") &&
            occupancyRatePercent !== "" &&
            parseFloat(occupancyRatePercent) >= 0 && parseFloat(occupancyRatePercent) <= 100 && // Ensure occupancyRate is between 0 and 100
            propertyTax !== "" &&
            insuranceCost !== "" &&
            managementExpensePercent !== "" &&
            parseFloat(managementExpensePercent) >= 0 && parseFloat(managementExpensePercent) <= 100 // Ensure managementCost is between 0 and 100
        );
    };

    useEffect(() => {
        const currentState: FormDataType = {
            propertyCost,
            downPayment,
            apr,
            termYears,
            revenueStreams,
            occupancyRatePercent,
            propertyTax,
            insuranceCost,
            managementExpensePercent,
        };

        // Always save form state to session storage
        sessionStorage.setItem('input_data', JSON.stringify(currentState));

        const hasStateChanged = JSON.stringify(previousState.current) !== JSON.stringify(currentState);
        console.log("hasStateChanged", hasStateChanged, "isComplete", isFormComplete());

        if (hasStateChanged && isFormComplete()) {
            onSubmit({
                propertyCost: parseFloat(propertyCost),
                downPayment: parseFloat(downPayment),
                apr: parseFloat(apr),
                termYears: parseInt(termYears, 10),
                revenueStreams: revenueStreams.map((stream) => ({
                    value: parseFloat(stream.value),
                    count: parseInt(stream.count, 10),
                })),
                occupancyRatePercent: parseFloat(occupancyRatePercent),
                propertyTax: parseFloat(propertyTax),
                insuranceCost: parseFloat(insuranceCost),
                managementExpensePercent: parseFloat(managementExpensePercent),
            });
        }

        previousState.current = currentState;
    }, [
        propertyCost,
        downPayment,
        apr,
        termYears,
        revenueStreams,
        occupancyRatePercent,
        propertyTax,
        insuranceCost,
        managementExpensePercent,
        onSubmit,
    ]);

    const handleAddRevenueStream = () => {
        setRevenueStreams([...revenueStreams, { value: "0", count: "1" }]);
    };

    const handleRemoveRevenueStream = (index: number) => {
        const updatedStreams = revenueStreams.filter((_, i) => i !== index);
        setRevenueStreams(updatedStreams);
    };

    const handleRevenueStreamChange = (index: number, field: 'value' | 'count', newValue: string) => {
        const updatedStreams = revenueStreams.map((stream, i) =>
            i === index ? { ...stream, [field]: newValue } : stream
        );
        setRevenueStreams(updatedStreams);
    };

    return (
        <Box sx={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Tooltip title="Total cost of the property">
                <TextField
                    label="Property Cost"
                    type="number"
                    value={propertyCost}
                    onChange={(e) => {
                        setPropertyCost(e.target.value);
                    }}
                    required
                    fullWidth
                />
            </Tooltip>
            <Tooltip title="Amount you are paying upfront">
                <TextField
                    label="Down Payment Amount"
                    type="number"
                    value={downPayment}
                    onChange={(e) => {
                        setDownPayment(e.target.value);
                    }}
                    required
                    fullWidth
                />
            </Tooltip>
            <Tooltip title="Annual Percentage Rate (APR) for the loan">
                <TextField
                    label="APR (%)"
                    type="number"
                    value={apr}
                    onChange={(e) => {
                        setApr(e.target.value);
                    }}
                    required
                    fullWidth
                />
            </Tooltip>
            <Tooltip title="Loan term in years">
                <TextField
                    label="Term (Years)"
                    type="number"
                    value={termYears}
                    onChange={(e) => {
                        setTermYears(e.target.value);
                    }}
                    required
                    fullWidth
                />
            </Tooltip>
            <Typography variant="h6">Revenue Streams (Monthly)</Typography>
            {revenueStreams.map((stream, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title="Monthly revenue amount">
                        <TextField
                            label="Value"
                            type="number"
                            value={stream.value}
                            onChange={(e) => handleRevenueStreamChange(index, 'value', e.target.value)}
                            fullWidth
                        />
                    </Tooltip>
                    <Tooltip title="Number of units contributing to this revenue">
                        <TextField
                            label="Count"
                            type="number"
                            value={stream.count}
                            onChange={(e) => handleRevenueStreamChange(index, 'count', e.target.value)}
                            fullWidth
                        />
                    </Tooltip>
                    <IconButton onClick={() => handleRemoveRevenueStream(index)} color="error">
                        <RemoveCircleIcon />
                    </IconButton>
                </Box>
            ))}
            <IconButton onClick={handleAddRevenueStream} color="primary">
                <AddCircleIcon />
            </IconButton>
            <Tooltip title="Percentage of time the property is occupied (default: 95%)">
                <TextField
                    label="Occupancy Rate (%)"
                    type="number"
                    value={occupancyRatePercent}
                    onChange={(e) => {
                        setOccupancyRatePercent(e.target.value);
                    }}
                    fullWidth
                />
            </Tooltip>
            <Tooltip title="Monthly property tax amount">
                <TextField
                    label="Monthly Property Tax"
                    type="number"
                    value={propertyTax}
                    onChange={(e) => {
                        setPropertyTax(e.target.value);
                    }}
                    fullWidth
                />
            </Tooltip>
            <Tooltip title="Monthly insurance cost">
                <TextField
                    label="Monthly Insurance Cost"
                    type="number"
                    value={insuranceCost}
                    onChange={(e) => {
                        setInsuranceCost(e.target.value);
                    }}
                    fullWidth
                />
            </Tooltip>
            <Tooltip title="Management cost as a percentage of gross income (default: 8%)">
                <TextField
                    label="Management Cost (%)"
                    type="number"
                    value={managementExpensePercent}
                    onChange={(e) => {
                        setManagementExpensePercent(e.target.value);
                    }}
                    fullWidth
                />
            </Tooltip>
        </Box>
    );
};

export default InputForm;