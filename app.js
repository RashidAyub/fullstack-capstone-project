/*jshint esversion: 8 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectToDatabase = require('./db');

const app = express();
app.use(cors());
const port = process.env.PORT || 3060;

// Connect to MongoDB; we just do this one time
connectToDatabase().then(() => {
    console.log('Connected to DB');
}).catch((e) => console.error('Failed to connect to DB', e));

app.use(express.json());

// Route files
const giftRoutes = require('./giftRoutes');
const authRoutes = require('./authRoutes');

// Mount gift and auth routes
app.use('/api/gifts', giftRoutes);
app.use('/api/auth', authRoutes);

// Actual /api/search route implemented directly in root app.js
app.get('/api/search', async (req, res, next) => {
    try {
        // Connect to MongoDB using connectToDatabase database.
        const db = await connectToDatabase();
        const collection = db.collection("gifts");

        // Initialize the query object
        let query = {};

        // Add the name filter to the query if the name parameter is not empty
        if (req.query.name && req.query.name.trim() !== '') {
            query.name = { $regex: req.query.name, $options: "i" };
        }

        // Add category filter
        if (req.query.category) {
            query.category = req.query.category;
        }

        // Add condition filter
        if (req.query.condition) {
            query.condition = req.query.condition;
        }

        // Add age_years filter
        if (req.query.age_years) {
            query.age_years = { $lte: parseInt(req.query.age_years) };
        }

        // Fetch filtered gifts
        const gifts = await collection.find(query).toArray();

        res.json(gifts);
    } catch (e) {
        next(e);
    }
});

// Root welcome route
app.get("/", (req, res) => {
    res.send("Inside the server");
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;
