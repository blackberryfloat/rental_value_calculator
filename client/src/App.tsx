import React, { useEffect, useRef } from 'react';
import './App.css';
import { Stack, Box } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useMediaQuery } from '@mui/material';
import { AppModel } from './state/app_model';
import PropertyCard from './components/property_card';
import { PropertyModel } from './state/property_model';
import { Page } from './components/page';

import { useAtom, useSetAtom } from 'jotai';
import { undoerAtom, updateUndoerAtom } from './state/app.state';
import { Undoer } from './state/undoer';

function App() {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const modelRef = useRef<AppModel>(AppModel.load());
  const [undoer, setUndoer] = useAtom(undoerAtom);
  const updateUndoer = useSetAtom(updateUndoerAtom);

  useEffect(() => {
    // Load the model from local storage
    console.log('On Mount');
    const savedModel = AppModel.load();
    modelRef.current = savedModel;
    setUndoer(new Undoer(modelRef.current));
  }, []);

  const handleAddProperty = () => {
    console.log('Adding property');
    const p = new PropertyModel({
      address: 'UNKNOWN',
      propertyPrice: 0,
      downPayment: 0,
      apr: 0,
      termYears: 0,
      propertyTax: 0,
      insuranceCost: 0,
      managementExpensePercent: 0,
      occupancyRatePercent: 0,
      revenueStreams: [],
    });
    modelRef.current.addProperty(p);
    updateUndoer(modelRef.current);
  };

  return (
    <Page>
      <Stack
        spacing={2}
        sx={{
          flexGrow: 1,
          p: 2,
          m: isMobile ? '0 auto' : 2,
          width: '100%',
          height: '100%',
        }}
      >
        {modelRef.current.properties.map((property, idx) => {
          const handleRemove = () => {
            modelRef.current.removeProperty(idx);
            updateUndoer(modelRef.current);
          };
          const handleUpdate = (p: PropertyModel) => {
            modelRef.current.updateProperty(idx, p);
            updateUndoer(modelRef.current);
          };
          return (
            <PropertyCard
              key={property.getCreatedAt()}
              property={property}
              remove={handleRemove}
              update={handleUpdate}
            />
          );
        })}

        <Box
          component="span"
          onClick={handleAddProperty}
          sx={(t) => ({
            display: 'block',
            width: '100%',
            py: 1,
            textAlign: 'center',
            cursor: 'pointer',
            bgcolor: 'inherit',
            border: `2px solid ${t.palette.divider}`,
            color: t.palette.text.primary,
            borderRadius: 1,
          })}
        >
          <AddCircleIcon fontSize="large" />
        </Box>
      </Stack>
    </Page>
  );
}

export default App;
