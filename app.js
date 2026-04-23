/**
 * app.js – Frontend logic for DevOps Portal
 * Handles login, registration, and dashboard rendering.
 *
 * For demo purposes: talks to the Node.js backend running on localhost:3000
 * Falls back to a client-side mock DB if backend is unavailable (offline demo).
 */

/* ─── Configuration ─────────────────────────────────────────── */
const API_BASE = 'https://devops-portal-euh5.onrender.com/api';

/* ─── Mock client-side DB (fallback / standalone demo) ──────── */
const MOCK_STUDENTS = [
  { email: 'soniya.rani@college.edu',  password: 'pass123', name: 'Soniya Rani',    enrollment: '06801192024', branch: 'AIML', sem: 4 },
  { email: 'rahul.kumar@college.edu',  password: 'pass123', name: 'Rahul Kumar',    enrollment: '06801192025', branch: 'IT1',  sem: 4 },
  { email: 'priya.sharma@college.edu', password: 'pass123', name: 'Priya Sharma',   enrollment: '06801192026', branch: 'IT2',  sem: 4 },
  { email: 'arjun.singh@college.edu',  password: 'pass123', name: 'Arjun Singh',    enrollment: '06801192027', branch: 'AIML', sem: 4 },
  { email: 'neha.verma@college.edu',   password: 'pass123', name: 'Neha Verma',     enrollment: '06801192028', branch: 'IT1',  sem: 4 },
  { email: 'amit.patel@college.edu',   password: 'pass123', name: 'Amit Patel',     enrollment: '06801192029', branch: 'IT2',  sem: 4 },
];

/* Load extra registered users from localStorage */
function getMockStudents() {
  const extra = JSON.parse(localStorage.getItem('registeredStudents') || '[]');
  return [...MOCK_STUDENTS, ...extra];
}

/* ─── Utility Helpers ───────────────────────────────────────── */
function showError(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
}

function hideError(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

/* ─── Login Flow ────────────────────────────────────────────── */
async function handleLogin() {
  const email    = document.getElementById('emailInput').value.trim();
  const password = document.getElementById('passwordInput').value;

  hideError('errorMsg');

  if (!email || !password) {
    showError('errorMsg', 'Please enter both Email ID and Password.');
    return;
  }

  // Show spinner
  document.getElementById('loginBtnText').style.display = 'none';
  document.getElementById('loginSpinner').style.display = 'inline-block';
  document.getElementById('loginBtn').disabled = true;

  try {
    let student = null;

    /* Try backend first */
    try {
      const res  = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        student = data.student;
      } else {
        throw new Error(data.message || 'Invalid credentials');
      }
    } catch (networkErr) {
      /* Backend unavailable – fall back to mock DB */
      console.warn('Backend not reachable, using offline mock DB.');
      const found = getMockStudents().find(
        s => s.email.toLowerCase() === email.toLowerCase() && s.password === password
      );
      if (!found) throw new Error('Invalid Email ID or Password. (Hint: use pass123)');
      student = { name: found.name, enrollment: found.enrollment, branch: found.branch, sem: found.sem, email: found.email };
    }

    /* Store session & redirect */
    sessionStorage.setItem('currentStudent', JSON.stringify(student));
    window.location.href = 'dashboard.html';

  } catch (err) {
    showError('errorMsg', err.message);
  } finally {
    document.getElementById('loginBtnText').style.display = 'inline';
    document.getElementById('loginSpinner').style.display = 'none';
    document.getElementById('loginBtn').disabled = false;
  }
}

/* Allow Enter key on login page */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && document.getElementById('loginCard')) handleLogin();
});

/* ─── Registration Flow ─────────────────────────────────────── */
const REGISTER_CODE = 'DEVOPS2024'; // Demo code

function handleRegister() {
  const code = document.getElementById('registerCode').value.trim().toUpperCase();
  if (!code) { alert('Please enter a registration code first.'); return; }
  if (code !== REGISTER_CODE) { alert('Invalid registration code. Ask your professor.'); return; }
  document.getElementById('registerModal').style.display = 'flex';
}

function closeRegister() {
  document.getElementById('registerModal').style.display = 'none';
  hideError('modalError');
}

async function submitRegister() {
  const name     = document.getElementById('regName').value.trim();
  const email    = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const code     = document.getElementById('regCode').value.trim().toUpperCase();

  hideError('modalError');

  if (!name || !email || !password || !code) {
    showError('modalError', 'All fields are required.'); return;
  }
  if (code !== REGISTER_CODE) {
    showError('modalError', 'Invalid registration code.'); return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('modalError', 'Please enter a valid email address.'); return;
  }

  // Derive enrollment from name (demo logic)
  const enrollment = '0680119' + Math.floor(2030 + Math.random() * 100);

  const newStudent = { email, password, name, enrollment, branch: 'AIML', sem: 4 };

  /* Try backend */
  try {
    const res  = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStudent),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
  } catch {
    /* Offline: persist to localStorage */
    const existing = JSON.parse(localStorage.getItem('registeredStudents') || '[]');
    if (existing.find(s => s.email.toLowerCase() === email.toLowerCase())) {
      showError('modalError', 'Email already registered.'); return;
    }
    existing.push(newStudent);
    localStorage.setItem('registeredStudents', JSON.stringify(existing));
  }

  alert(`Registered successfully! You can now login with:\nEmail: ${email}\nPassword: ${password}`);
  closeRegister();
}
