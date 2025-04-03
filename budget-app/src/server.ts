import express from 'express';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// In-memory storage for budget items (in a real app, this would be a database)
let budgetItems: BudgetItem[] = [];

interface BudgetItem {
    id: string;
    description: string;
    amount: number;
    category: string;
    date: string;
    type: 'income' | 'expense';
}

app.use(express.json());
app.use(express.static('public'));

// Add a specific route for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// API Routes
app.get('/api/budget-items', (req, res) => {
    res.json(budgetItems);
});

app.post('/api/budget-items', (req, res) => {
    const { description, amount, category, type } = req.body;
    
    if (!description || !amount || !category || !type) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const newItem: BudgetItem = {
        id: Date.now().toString(),
        description,
        amount: Number(amount),
        category,
        date: new Date().toISOString(),
        type
    };

    budgetItems.push(newItem);
    res.status(201).json(newItem);
});

app.delete('/api/budget-items/:id', (req, res) => {
    const { id } = req.params;
    budgetItems = budgetItems.filter(item => item.id !== id);
    res.status(204).send();
});

app.get('/api/summary', (req, res) => {
    const totalIncome = budgetItems
        .filter(item => item.type === 'income')
        .reduce((sum, item) => sum + item.amount, 0);
    
    const totalExpenses = budgetItems
        .filter(item => item.type === 'expense')
        .reduce((sum, item) => sum + item.amount, 0);
    
    const balance = totalIncome - totalExpenses;

    const categorySummary = budgetItems.reduce((summary: any, item) => {
        if (!summary[item.category]) {
            summary[item.category] = 0;
        }
        summary[item.category] += item.type === 'expense' ? -item.amount : item.amount;
        return summary;
    }, {});

    res.json({
        totalIncome,
        totalExpenses,
        balance,
        categorySummary
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 