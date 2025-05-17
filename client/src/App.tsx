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
  const [undoer, setUndoer] = useAtom(undoerAtom);
  const updateUndoer = useSetAtom(updateUndoerAtom);

  useEffect(() => {
    // Load the model from local storage
    console.log('On Mount');
    setUndoer(new Undoer(AppModel.load()));
  }, []);

  const handleAddProperty = () => {
    if (!undoer?.current) return;
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
    undoer.current.addProperty(p);
    updateUndoer(undoer.current);
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
        {undoer?.current?.properties && undoer?.current?.properties.length > 0 ? (
          undoer.current.properties.map((property, idx) => {
            const handleRemove = () => {
              undoer.current.removeProperty(idx);
              updateUndoer(undoer.current);
            };
            const handleUpdate = (p: PropertyModel) => {
              undoer.current.updateProperty(idx, p);
              updateUndoer(undoer.current);
            };
            return (
              <PropertyCard
                key={property.getCreatedAt()}
                property={property}
                remove={handleRemove}
                update={handleUpdate}
              />
            );
          })
        ) : (
          <Box
            component="span"
            sx={(t) => ({
              display: 'block',
              width: '100%',
              py: 1,
              textAlign: 'center',
              bgcolor: 'inherit',
              color: t.palette.text.primary,
              borderRadius: 1,
            })}
          >
            No properties added yet.
          </Box>
        )}
      </Stack>
    </Page>
  );
}

export default App;
