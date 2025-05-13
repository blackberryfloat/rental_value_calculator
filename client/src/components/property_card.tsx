import React, { useState } from 'react';
import { PropertyModel } from "../state/property_model";
import {
    Card,
    CardContent,
    Collapse,
    Typography,
    IconButton,
    Grid,
    TextField,
    CardHeader,
    Chip,
} from "@mui/material";
import { Close } from "@mui/icons-material";

interface PropertyCardProps {
    property: PropertyModel,
    remove: () => void,
    update: (property: PropertyModel) => void,
}

const PropertyCard: React.FC<PropertyCardProps> = React.memo(({ property, remove, update }) => {
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        console.debug("handleExpandClick");
        setExpanded(!expanded);
    };

    let {
        address,
        propertyPrice,
    } = property.getInputData();

    return (
        <Card sx={{ color: property.getNetProfitColor(), width: "100%" }}>
            <CardHeader
                avatar={
                    <Chip
                        label={`${property.annualROI().toFixed(2)}%`}
                        color={property.getNetProfitColor() as 
                              "error" | "warning" | "info" | "success" | "primary" | "secondary"}
                        variant="outlined"
                        size="small"
                        aria-label="roi"
                    />
                }
                action={
                    <IconButton aria-label="settings" onClick={remove}>
                        <Close />
                    </IconButton>
                }
                title={address}
                subheader={propertyPrice.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                })}
                slotProps={
                    {
                        avatar: {
                            onClick: handleExpandClick,
                        },
                        title: {
                            onClick: handleExpandClick,
                            sx: {
                                textAlign: "left",
                            },
                        },
                        subheader: {
                            onClick: handleExpandClick,
                            sx: {
                                textAlign: "left",
                            },
                        },
                    }
                }
            />
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    TBD
                </CardContent>
            </Collapse>
        </Card>
    );
});

export default PropertyCard;