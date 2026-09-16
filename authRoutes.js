const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('./db');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretcapstonejwtkey12345';

// 1. User registration
router.post('/register', async (req, res) => {
    try {
        const { email, firstName, lastName, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const db = await connectToDatabase();
        const collection = db.collection("users");

        const existingEmail = await collection.findOne({ email });

        if (existingEmail) {
            console.error('Email already exists');
            return res.status(400).json({ error: 'Email already exists' });
        }

        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(password, salt);

        const newUser = await collection.insertOne({
            email,
            firstName: firstName || '',
            lastName: lastName || '',
            password: hash,
            createdAt: new Date(),
        });

        const payload = {
            user: {
                id: newUser.insertedId.toString(),
                email: email
            },
        };

        const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

        console.log('User registered successfully');
        return res.status(200).json({ authtoken, email, firstName, lastName });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// 2. User login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const db = await connectToDatabase();
        const collection = db.collection("users");

        const theUser = await collection.findOne({ email });

        if (!theUser) {
            console.error('User not found');
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcryptjs.compare(password, theUser.password);

        if (!isMatch) {
            console.error('Passwords do not match');
            return res.status(401).json({ error: 'Wrong password' });
        }

        const payload = {
            user: {
                id: theUser._id.toString(),
                email: theUser.email
            },
        };

        const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
        const userName = theUser.firstName || theUser.email;
        const userEmail = theUser.email;

        console.log('User logged in successfully');
        return res.status(200).json({
            authtoken,
            userName,
            userEmail
        });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'Internal server error', details: e.message });
    }
});

// 3. Updating user information
router.put('/update', async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.error('Validation errors in update request', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let email = req.headers.email;
        const authHeader = req.headers.authorization;

        if (!email && authHeader) {
            try {
                const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
                const decoded = jwt.verify(token, JWT_SECRET);
                if (decoded && decoded.user && decoded.user.email) {
                    email = decoded.user.email;
                }
            } catch (err) {
                // Token parse failed
            }
        }

        if (!email) {
            console.error('Email not found in the request headers or token');
            return res.status(400).json({ error: 'Email not found in the request headers' });
        }

        const db = await connectToDatabase();
        const collection = db.collection("users");

        const existingUser = await collection.findOne({ email });

        if (!existingUser) {
            console.error('User not found');
            return res.status(404).json({ error: 'User not found' });
        }

        const updateFields = {};
        if (req.body.name) {
            updateFields.firstName = req.body.name;
        }
        if (req.body.firstName) {
            updateFields.firstName = req.body.firstName;
        }
        if (req.body.lastName) {
            updateFields.lastName = req.body.lastName;
        }
        updateFields.updatedAt = new Date();

        await collection.updateOne(
            { email },
            { $set: updateFields }
        );

        const payload = {
            user: {
                id: existingUser._id.toString(),
                email: email
            },
        };

        const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

        console.log('User updated successfully');
        return res.status(200).json({ authtoken, message: 'User updated successfully' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
