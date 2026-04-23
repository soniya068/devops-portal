# Fundamental of DevOps – Student Portal

A full-stack web application replicating the **My DevOps Status** dashboard for students in AIML / IT1 / IT2 branches.

---

## 📁 Project Structure

```
devops-portal/
├── frontend/
│   ├── index.html        ← Login page
│   ├── dashboard.html    ← Dashboard page
│   ├── style.css         ← All styles (responsive)
│   ├── app.js            ← Login / Registration logic
│   └── dashboard.js      ← Dashboard rendering
│
├── backend/
│   ├── server.js         ← Express REST API
│   ├── students.json     ← JSON database (sample records)
│   └── package.json      ← Node.js dependencies
│
├── docs/
│   └── report.docx       ← Project report
│
└── README.md
```

---

## 🧪 Sample Login Credentials

| Name          | Email                        | Password |
|---------------|------------------------------|----------|
| Soniya Rani   | soniya.rani@college.edu      | pass123  |
| Rahul Kumar   | rahul.kumar@college.edu      | pass123  |
| Priya Sharma  | priya.sharma@college.edu     | pass123  |
| Arjun Singh   | arjun.singh@college.edu      | pass123  |
| Neha Verma    | neha.verma@college.edu       | pass123  |
| Amit Patel    | amit.patel@college.edu       | pass123  |

**Registration code (for new users):** `DEVOPS2024`

---

## 🚀 Run Locally (VS Code)

### Prerequisites
- [Node.js](https://nodejs.org/) v14 or higher
- A modern web browser

### Step 1 – Clone / download the project
```bash
git clone https://github.com/<your-username>/devops-portal.git
cd devops-portal
```

### Step 2 – Install backend dependencies
```bash
cd backend
npm install
```

### Step 3 – Start the backend server
```bash
node server.js
# ✅  DevOps Portal backend running at http://localhost:3000
```

### Step 4 – Open the app
Open your browser and navigate to:
```
http://localhost:3000
```

The Express server serves both the API and the frontend files automatically.

> **No backend? No problem.**  
> You can also open `frontend/index.html` directly in a browser.  
> The app will automatically fall back to its built-in mock database.

---

## 🌐 Deploy on GitHub Pages (Frontend Only)

1. Push the project to a GitHub repository.
2. Go to **Settings → Pages**.
3. Set **Source** to `main` branch and folder to `/frontend`.
4. Click **Save** – GitHub will give you a public URL like:
   ```
   https://<your-username>.github.io/devops-portal/
   ```
5. The frontend works standalone using its offline mock database.

---

## 🌐 Deploy Backend on Render / Railway

1. Create an account on [Render](https://render.com) or [Railway](https://railway.app).
2. Create a new **Web Service** pointing to the `/backend` folder.
3. Set the start command to `node server.js`.
4. Update `API_BASE` in `frontend/app.js` to your deployed backend URL.

---

## 🔌 API Endpoints

| Method | Endpoint        | Description                  |
|--------|-----------------|------------------------------|
| POST   | `/api/login`    | Authenticate a student       |
| POST   | `/api/register` | Register a new student       |
| GET    | `/api/students` | List all students (demo)     |

### POST `/api/login`
```json
// Request
{ "email": "soniya.rani@college.edu", "password": "pass123" }

// Response (200)
{ "success": true, "student": { "name": "Soniya Rani", "enrollment": "...", ... } }
```

### POST `/api/register`
```json
// Request
{ "name": "Jane Doe", "email": "jane@college.edu", "password": "secret", "regCode": "DEVOPS2024" }

// Response (201)
{ "success": true, "message": "Registered successfully!" }
```

---

## 🛠 Technologies

| Layer     | Technology                      |
|-----------|---------------------------------|
| Frontend  | HTML5, CSS3 (custom, no framework), Vanilla JS |
| Backend   | Node.js + Express               |
| Database  | JSON flat-file (`students.json`) |
| Hosting   | GitHub Pages (frontend) / Render (backend) |

---

## 📝 Notes

- Passwords are stored in plain text in `students.json` for demo purposes only.  
  In production, use `bcrypt` for hashing.
- The registration code `DEVOPS2024` controls who can self-register.
- The app is fully responsive (mobile, tablet, desktop).
