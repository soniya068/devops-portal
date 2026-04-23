/**
 * server.js – Express backend for DevOps Portal
 *
 * Features:
 *  - POST /api/login     – authenticates student by email + password
 *  - POST /api/register  – registers a new student with a valid code
 *  - GET  /api/students  – lists all students (demo/admin endpoint)
 *
 * Database: students.json (JSON flat-file, no external DB required)
 *
 * Run: node server.js
 * Port: 3000  (configurable via PORT env var)
 */

const express  = require('express');
const cors     = require('cors');
const fs       = require('fs');
const path     = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ─── Paths ─────────────────────────────────────────────────── */
const DB_PATH = path.join(__dirname, 'students.json');

/* ─── Middleware ─────────────────────────────────────────────── */
app.use(cors());
app.use(express.json());

// Serve frontend from ../frontend (convenient for local dev)
app.use(express.static(path.join(__dirname, '..')));

/* ─── DB helpers ─────────────────────────────────────────────── */
function readDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  } catch {
    return { students: [] };
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

/* ─── Routes ─────────────────────────────────────────────────── */

/**
 * POST /api/login
 * Body: { email: string, password: string }
 * Returns: { success: true, student: { name, enrollment, branch, sem, email } }
 */
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const db      = readDB();
  const student = db.students.find(
    s => s.email.toLowerCase() === email.toLowerCase() && s.password === password
  );

  if (!student) {
    return res.status(401).json({ success: false, message: 'Invalid Email ID or Password.' });
  }

  // Return student info (never return password to client)
  const { password: _pw, ...safeStudent } = student;
  res.json({ success: true, student: safeStudent });
});

/**
 * POST /api/register
 * Body: { name, email, password, enrollment?, branch?, sem?, regCode }
 * Validates the registration code before creating account.
 */
const VALID_REG_CODE = 'DEVOPS2024';

app.post('/api/register', (req, res) => {
  const { name, email, password, regCode } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
  }

  if ((regCode || '').toUpperCase() !== VALID_REG_CODE) {
    return res.status(403).json({ success: false, message: 'Invalid registration code.' });
  }

  const db = readDB();

  // Check duplicate
  const exists = db.students.find(s => s.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(409).json({ success: false, message: 'Email already registered.' });
  }

  // Auto-generate enrollment number
  const enrollment = '0680119' + (2030 + db.students.length);

  const newStudent = {
    name,
    email,
    password,         // In production: hash with bcrypt
    enrollment,
    branch: req.body.branch || 'AIML',
    sem:    req.body.sem    || 4,
  };

  db.students.push(newStudent);
  writeDB(db);

  res.status(201).json({ success: true, message: 'Registered successfully!' });
});

/**
 * GET /api/students
 * Returns all students without passwords (admin/demo use only)
 */
app.get('/api/students', (req, res) => {
  const db = readDB();
  const safe = db.students.map(({ password: _pw, ...s }) => s);
  res.json({ success: true, students: safe });
});

/* ─── Catch-all: serve index.html for SPA navigation ─────────── */
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

/* ─── Start ──────────────────────────────────────────────────── */
app.listen(PORT, () => {
  console.log(`✅  DevOps Portal backend running at http://localhost:${PORT}`);
  console.log(`📂  Serving frontend from ../frontend`);
  console.log(`📦  Database: ${DB_PATH}`);
});
