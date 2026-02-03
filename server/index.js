// EcoTrack Backend Server - Firebase Firestore Database
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'ecotrack-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// ============ FIREBASE INITIALIZATION ============

// Initialize Firebase Admin SDK
// You need to download serviceAccountKey.json from Firebase Console
// Project Settings > Service Accounts > Generate New Private Key
let db;

try {
  const serviceAccount = require('./serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  db = admin.firestore();
  console.log('✅ Connected to Firebase Firestore');
} catch (error) {
  console.error('❌ Firebase initialization error:', error.message);
  console.log('\n📋 To fix this:');
  console.log('   1. Go to Firebase Console: https://console.firebase.google.com');
  console.log('   2. Create a project or select existing one');
  console.log('   3. Go to Project Settings > Service Accounts');
  console.log('   4. Click "Generate new private key"');
  console.log('   5. Save the file as "serviceAccountKey.json" in the server/ folder\n');
  process.exit(1);
}

// ============ AUTH MIDDLEWARE ============

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ============ EMISSION FACTORS ============

const EMISSION_FACTORS = {
  car_petrol: 0.12,
  car_diesel: 0.14,
  car_electric: 0.05,
  bus: 0.05,
  train: 0.03,
  flight_short: 0.255,
  flight_long: 0.195,
  bicycle: 0,
  walking: 0,
  electricity: 0.5,
  natural_gas: 0.2,
  heating_oil: 0.27,
  beef: 6.0,
  pork: 3.5,
  chicken: 2.5,
  fish: 2.0,
  vegetarian: 1.5,
  vegan: 0.9,
};

const calculateEmission = (type, value) => {
  const factor = EMISSION_FACTORS[type] || 0;
  return Math.round(factor * value * 100) / 100;
};

// ============ AUTH ROUTES ============

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    if (!email || !password || !displayName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user exists
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();
    
    if (!snapshot.empty) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const userDoc = await usersRef.add({
      email,
      password: hashedPassword,
      displayName,
      monthlyGoal: 500,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    const user = {
      id: userDoc.id,
      email,
      displayName,
      monthlyGoal: 500,
      createdAt: new Date().toISOString()
    };

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();
    
    if (snapshot.empty) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    // Check password
    const validPassword = await bcrypt.compare(password, userData.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = {
      id: userDoc.id,
      email: userData.email,
      displayName: userData.displayName,
      monthlyGoal: userData.monthlyGoal,
      createdAt: userData.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
    };

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ user, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.id).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    res.json({
      id: userDoc.id,
      email: userData.email,
      displayName: userData.displayName,
      monthlyGoal: userData.monthlyGoal,
      createdAt: userData.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { displayName, monthlyGoal } = req.body;

    await db.collection('users').doc(req.user.id).update({
      displayName,
      monthlyGoal
    });

    const userDoc = await db.collection('users').doc(req.user.id).get();
    const userData = userDoc.data();

    res.json({
      id: userDoc.id,
      email: userData.email,
      displayName: userData.displayName,
      monthlyGoal: userData.monthlyGoal,
      createdAt: userData.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============ ACTIVITY ROUTES ============

// Get all activities for user
app.get('/api/activities', authenticateToken, async (req, res) => {
  try {
    const snapshot = await db.collection('activities')
      .where('userId', '==', req.user.id)
      .orderBy('date', 'desc')
      .get();

    const activities = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
    }));

    res.json(activities);
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create activity
app.post('/api/activities', authenticateToken, async (req, res) => {
  try {
    const { category, type, value, unit, date, notes } = req.body;

    if (!category || !type || !value || !unit || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const emission = calculateEmission(type, value);

    const activityDoc = await db.collection('activities').add({
      userId: req.user.id,
      category,
      type,
      value,
      unit,
      emission,
      date,
      notes: notes || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({
      id: activityDoc.id,
      userId: req.user.id,
      category,
      type,
      value,
      unit,
      emission,
      date,
      notes: notes || '',
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update activity
app.put('/api/activities/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { category, type, value, unit, date, notes } = req.body;

    const emission = calculateEmission(type, value);

    const activityRef = db.collection('activities').doc(id);
    const activityDoc = await activityRef.get();

    if (!activityDoc.exists || activityDoc.data().userId !== req.user.id) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    await activityRef.update({
      category,
      type,
      value,
      unit,
      emission,
      date,
      notes: notes || ''
    });

    res.json({
      id,
      userId: req.user.id,
      category,
      type,
      value,
      unit,
      emission,
      date,
      notes: notes || '',
      createdAt: activityDoc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
    });
  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete activity
app.delete('/api/activities/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const activityRef = db.collection('activities').doc(id);
    const activityDoc = await activityRef.get();

    if (!activityDoc.exists || activityDoc.data().userId !== req.user.id) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    await activityRef.delete();
    res.json({ message: 'Activity deleted' });
  } catch (error) {
    console.error('Delete activity error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============ STATS ROUTES ============

// Get emission stats
app.get('/api/stats', authenticateToken, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Get start of week (Monday)
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const startOfWeek = new Date(now.setDate(diff)).toISOString().split('T')[0];

    // Get start of month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

    // Get all user activities
    const snapshot = await db.collection('activities')
      .where('userId', '==', req.user.id)
      .get();

    let daily = 0, weekly = 0, monthly = 0;
    const categoryStats = { transport: 0, energy: 0, diet: 0, other: 0 };

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      const actDate = data.date;

      if (actDate === today) {
        daily += data.emission;
      }
      if (actDate >= startOfWeek) {
        weekly += data.emission;
      }
      if (actDate >= startOfMonth) {
        monthly += data.emission;
        categoryStats[data.category] = (categoryStats[data.category] || 0) + data.emission;
      }
    });

    res.json({
      daily: Math.round(daily * 100) / 100,
      weekly: Math.round(weekly * 100) / 100,
      monthly: Math.round(monthly * 100) / 100,
      byCategory: categoryStats,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get daily trend data
app.get('/api/stats/trend', authenticateToken, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 14;
    
    // Get all user activities
    const snapshot = await db.collection('activities')
      .where('userId', '==', req.user.id)
      .get();

    // Create emission map by date
    const emissionByDate = {};
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      emissionByDate[data.date] = (emissionByDate[data.date] || 0) + data.emission;
    });

    // Build trend array
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      result.push({
        date: dateStr,
        emission: Math.round((emissionByDate[dateStr] || 0) * 100) / 100,
      });
    }

    res.json(result);
  } catch (error) {
    console.error('Get trend error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============ START SERVER ============

app.listen(PORT, () => {
  console.log(`🌍 EcoTrack server running on http://localhost:${PORT}`);
  console.log(`📦 Database: Firebase Firestore`);
});
