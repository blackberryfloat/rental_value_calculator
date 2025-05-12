import { useState } from 'react';
import './App.css';
import { CssBaseline, useMediaQuery, Stack } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import InputForm, { type InputDataType } from './components/input_form';
import { PropertyFinancials } from './state/property_financials';
import { PropertyResult } from './components/property_result';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const isMobile = useMediaQuery('(max-width: 600px)'); // Detect mobile devices

  const theme = createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif',
    },
  });

  const [propertyFinancials, setPropertyFinancials] = useState<PropertyFinancials | null>(null);

  // Function to handle input data changes
  const handleInputData = (data: InputDataType) => {
    const financials = new PropertyFinancials(data);
    financials.printSummary();
    setPropertyFinancials(financials);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {
        isMobile ? (
          <Stack spacing={2} justifyContent="center" alignItems="center">
            {propertyFinancials && <PropertyResult propertyFinancials={propertyFinancials} />}
            <InputForm
              onSubmit={(data) => {
                handleInputData(data);
              }}
            />
          </Stack>
        ) : (
          <Stack spacing={2} direction="row" justifyContent="center" alignItems="center">
            <InputForm
              onSubmit={(data) => {
                handleInputData(data);
              }}
            />
            {propertyFinancials && <PropertyResult propertyFinancials={propertyFinancials} />}
          </Stack>
        )
      }
    </ThemeProvider>
  );
}

export default App;
