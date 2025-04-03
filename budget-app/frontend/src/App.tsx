import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';
import InfoIcon from '@mui/icons-material/Info';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';

// Import Questrial font
import '@fontsource/questrial';

// Financial education quotes
const financialQuotes = [
  {
    text: "A budget is telling your money where to go instead of wondering where it went.",
    author: "Dave Ramsey"
  },
  {
    text: "The best investment you can make is in yourself.",
    author: "Warren Buffett"
  },
  {
    text: "Don't save what is left after spending; spend what is left after saving.",
    author: "Warren Buffett"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Financial freedom is available to those who learn about it and work for it.",
    author: "Robert Kiyosaki"
  },
  {
    text: "The more you learn, the more you earn.",
    author: "Warren Buffett"
  },
  {
    text: "It's not how much money you make, but how much money you keep.",
    author: "Robert Kiyosaki"
  },
  {
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb"
  },
  {
    text: "Your most valuable asset is your ability to earn.",
    author: "Ayn Rand"
  },
  {
    text: "The habit of saving is itself an education.",
    author: "Theodore Roosevelt"
  }
];

// Category descriptions
const categoryDescriptions = {
  needs: {
    title: "Needs (Essential Expenses)",
    description: "These are your essential expenses that you cannot live without. Examples include:\n\n" +
      "• Housing (rent/mortgage)\n" +
      "• Utilities (electricity, water, gas)\n" +
      "• Groceries and basic food items\n" +
      "• Healthcare and medications\n" +
      "• Basic transportation\n" +
      "• Insurance premiums\n" +
      "• Minimum debt payments"
  },
  wants: {
    title: "Wants (Non-Essential Expenses)",
    description: "These are expenses that enhance your lifestyle but aren't essential for survival. Examples include:\n\n" +
      "• Entertainment and dining out\n" +
      "• Hobbies and recreation\n" +
      "• Shopping for non-essential items\n" +
      "• Gym memberships\n" +
      "• Cable TV and streaming services\n" +
      "• Vacations and travel\n" +
      "• Designer clothes and accessories"
  },
  savings: {
    title: "Savings and Investments",
    description: "This portion should be set aside for your future financial security. Examples include:\n\n" +
      "• Emergency fund\n" +
      "• Retirement savings\n" +
      "• Investment accounts\n" +
      "• College savings\n" +
      "• Down payment for a house\n" +
      "• Debt repayment beyond minimum payments\n" +
      "• Business investments"
  }
};

interface Category {
  id: number;
  name: string;
  budget: number;
  percentage: number;
  color: string;
}

interface PercentageDistribution {
  needs: number;
  wants: number;
  savings: number;
}

const theme = createTheme({
  typography: {
    fontFamily: 'Questrial, sans-serif',
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'Questrial, sans-serif',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          fontFamily: 'Questrial, sans-serif',
        },
      },
    },
  },
});

function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [salary, setSalary] = useState<string>('');
  const [salaryType, setSalaryType] = useState<'net' | 'gross'>('net');
  const [calculated, setCalculated] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(() => 
    financialQuotes[Math.floor(Math.random() * financialQuotes.length)]
  );
  const [percentages, setPercentages] = useState<PercentageDistribution>({
    needs: 50,
    wants: 30,
    savings: 20
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof categoryDescriptions | null>(null);

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', {
      maximumFractionDigits: 0
    });
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove all non-digit characters
    const value = e.target.value.replace(/\D/g, '');
    
    // Convert to number and format with commas
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      setSalary(numValue.toLocaleString('en-US'));
    } else {
      setSalary('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      calculateBudget();
    }
  };

  const handlePercentageChange = (category: keyof PercentageDistribution, value: string) => {
    const newValue = parseInt(value) || 0;
    if (newValue < 0 || newValue > 100) return;

    // If changing needs or wants, automatically adjust savings
    if (category === 'needs' || category === 'wants') {
      const oldValue = percentages[category];
      const difference = newValue - oldValue;
      
      // Calculate new savings percentage
      const newSavings = percentages.savings - difference;
      
      // Only proceed if the new savings percentage is valid
      if (newSavings >= 0 && newSavings <= 100) {
        const newPercentages = {
          ...percentages,
          [category]: newValue,
          savings: newSavings
        };
        
        setPercentages(newPercentages);
        
        // Recalculate budget if already calculated
        if (calculated) {
          const salaryNum = parseFloat(salary.replace(/,/g, ''));
          if (!isNaN(salaryNum)) {
            const monthlySalary = salaryNum;
            const needs = Math.round(monthlySalary * (newPercentages.needs / 100));
            const wants = Math.round(monthlySalary * (newPercentages.wants / 100));
            const savings = Math.round(monthlySalary * (newPercentages.savings / 100));

            setCategories([
              { id: 1, name: `Needs (${newPercentages.needs}%)`, budget: needs, percentage: newPercentages.needs, color: '#2e7d32' },
              { id: 2, name: `Wants (${newPercentages.wants}%)`, budget: wants, percentage: newPercentages.wants, color: '#1976d2' },
              { id: 3, name: `Savings (${newPercentages.savings}%)`, budget: savings, percentage: newPercentages.savings, color: '#ed6c02' }
            ]);
          }
        }
      }
    } else {
      // If changing savings directly, ensure total doesn't exceed 100%
      const otherCategories = Object.keys(percentages).filter(k => k !== category) as Array<keyof PercentageDistribution>;
      const currentSum = otherCategories.reduce((sum, key) => sum + percentages[key], 0);
      
      if (newValue + currentSum > 100) return;

      const newPercentages = {
        ...percentages,
        [category]: newValue
      };
      
      setPercentages(newPercentages);
      
      // Recalculate budget if already calculated
      if (calculated) {
        const salaryNum = parseFloat(salary.replace(/,/g, ''));
        if (!isNaN(salaryNum)) {
          const monthlySalary = salaryNum;
          const needs = Math.round(monthlySalary * (newPercentages.needs / 100));
          const wants = Math.round(monthlySalary * (newPercentages.wants / 100));
          const savings = Math.round(monthlySalary * (newPercentages.savings / 100));

          setCategories([
            { id: 1, name: `Needs (${newPercentages.needs}%)`, budget: needs, percentage: newPercentages.needs, color: '#2e7d32' },
            { id: 2, name: `Wants (${newPercentages.wants}%)`, budget: wants, percentage: newPercentages.wants, color: '#1976d2' },
            { id: 3, name: `Savings (${newPercentages.savings}%)`, budget: savings, percentage: newPercentages.savings, color: '#ed6c02' }
          ]);
        }
      }
    }
  };

  const calculateBudget = () => {
    // Remove commas before parsing
    const salaryNum = parseFloat(salary.replace(/,/g, ''));
    if (isNaN(salaryNum)) return;

    // Use monthly salary directly
    const monthlySalary = salaryNum;

    // Calculate based on custom percentages
    const needs = Math.round(monthlySalary * (percentages.needs / 100));
    const wants = Math.round(monthlySalary * (percentages.wants / 100));
    const savings = Math.round(monthlySalary * (percentages.savings / 100));

    setCategories([
      { id: 1, name: `Needs (${percentages.needs}%)`, budget: needs, percentage: percentages.needs, color: '#2e7d32' },
      { id: 2, name: `Wants (${percentages.wants}%)`, budget: wants, percentage: percentages.wants, color: '#1976d2' },
      { id: 3, name: `Savings (${percentages.savings}%)`, budget: savings, percentage: percentages.savings, color: '#ed6c02' }
    ]);
    setCalculated(true);
  };

  const getNewQuote = () => {
    setCurrentQuote(financialQuotes[Math.floor(Math.random() * financialQuotes.length)]);
  };

  const handleOpenDialog = (category: keyof typeof categoryDescriptions) => {
    setSelectedCategory(category);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCategory(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Budget App
            </Typography>
          </Toolbar>
        </AppBar>
        <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Custom Budget Calculator
          </Typography>
          
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Monthly Salary (AMD)"
                  value={salary}
                  onChange={handleSalaryChange}
                  onKeyPress={handleKeyPress}
                  fullWidth
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>AMD</Typography>
                  }}
                />
                <FormControl>
                  <RadioGroup
                    row
                    value={salaryType}
                    onChange={(e) => setSalaryType(e.target.value as 'net' | 'gross')}
                  >
                    <FormControlLabel value="net" control={<Radio />} label="Net Income" />
                    <FormControlLabel value="gross" control={<Radio />} label="Gross Income" />
                  </RadioGroup>
                </FormControl>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Customize Distribution
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
                    <TextField
                      label="Needs (%)"
                      type="number"
                      value={percentages.needs}
                      onChange={(e) => handlePercentageChange('needs', e.target.value)}
                      InputProps={{
                        inputProps: { min: 0, max: 100 },
                        endAdornment: (
                          <IconButton 
                            size="small" 
                            onClick={() => handleOpenDialog('needs')}
                            sx={{ color: '#2e7d32' }}
                          >
                            <InfoIcon />
                          </IconButton>
                        )
                      }}
                    />
                    <TextField
                      label="Wants (%)"
                      type="number"
                      value={percentages.wants}
                      onChange={(e) => handlePercentageChange('wants', e.target.value)}
                      InputProps={{
                        inputProps: { min: 0, max: 100 },
                        endAdornment: (
                          <IconButton 
                            size="small" 
                            onClick={() => handleOpenDialog('wants')}
                            sx={{ color: '#1976d2' }}
                          >
                            <InfoIcon />
                          </IconButton>
                        )
                      }}
                    />
                    <TextField
                      label="Savings (%)"
                      type="number"
                      value={percentages.savings}
                      onChange={(e) => handlePercentageChange('savings', e.target.value)}
                      InputProps={{
                        inputProps: { min: 0, max: 100 },
                        endAdornment: (
                          <IconButton 
                            size="small" 
                            onClick={() => handleOpenDialog('savings')}
                            sx={{ color: '#ed6c02' }}
                          >
                            <InfoIcon />
                          </IconButton>
                        )
                      }}
                    />
                  </Box>
                </Box>

                <Button 
                  variant="contained" 
                  onClick={calculateBudget}
                  disabled={!salary || isNaN(parseFloat(salary.replace(/,/g, '')))}
                  color="success"
                >
                  Calculate Budget
                </Button>
              </Box>
            </CardContent>
          </Card>

          {calculated && (
            <>
              <Typography variant="h5" component="h2" gutterBottom>
                Monthly Budget Breakdown
              </Typography>
              <Box sx={{ 
                display: 'grid',
                gap: 3,
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: '1fr 1fr',
                  md: '1fr 1fr 1fr'
                }
              }}>
                {categories.map((category) => (
                  <Card 
                    key={category.id}
                    sx={{
                      borderTop: `4px solid ${category.color}`,
                      '&:hover': {
                        boxShadow: 6,
                        transform: 'translateY(-4px)',
                        transition: 'all 0.3s ease-in-out'
                      }
                    }}
                  >
                    <CardContent>
                      <Typography 
                        variant="h6" 
                        component="h2"
                        sx={{ color: category.color }}
                      >
                        {category.name}
                      </Typography>
                      <Typography 
                        variant="h4" 
                        component="p" 
                        sx={{ color: category.color }}
                      >
                        AMD {formatNumber(category.budget)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Monthly allocation
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </>
          )}
          
          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Card sx={{ maxWidth: 600, mx: 'auto', mb: 2 }}>
              <CardContent>
                <Typography variant="h6" component="p" sx={{ fontStyle: 'italic', mb: 1 }}>
                  "{currentQuote.text}"
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
                  — {currentQuote.author}
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={getNewQuote}
                  sx={{ mt: 1 }}
                >
                  New Quote
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedCategory && (
          <>
            <DialogTitle sx={{ 
              color: selectedCategory === 'needs' ? '#2e7d32' : 
                     selectedCategory === 'wants' ? '#1976d2' : '#ed6c02'
            }}>
              {categoryDescriptions[selectedCategory].title}
            </DialogTitle>
            <DialogContent>
              <Typography 
                component="pre" 
                sx={{ 
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'inherit',
                  fontSize: '1rem',
                  lineHeight: 1.5
                }}
              >
                {categoryDescriptions[selectedCategory].description}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </ThemeProvider>
  );
}

export default App;
