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
