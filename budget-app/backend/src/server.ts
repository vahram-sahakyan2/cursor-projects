import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Budget App API' });
});

// Test route for budget data
app.get('/api/budget', (req, res) => {
  res.json({
    categories: [
      { id: 1, name: 'Food', budget: 500 },
      { id: 2, name: 'Transportation', budget: 200 },
      { id: 3, name: 'Entertainment', budget: 150 }
    ]
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 