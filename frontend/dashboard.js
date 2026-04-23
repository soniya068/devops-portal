/**
 * dashboard.js – Renders the dashboard for a logged-in student.
 *
 * Reads student data from sessionStorage (set during login).
 * Mock attendance + marks data simulates what a real backend would return.
 */

/* ─── Guard: redirect to login if not authenticated ─────────── */
const studentRaw = sessionStorage.getItem('currentStudent');
if (!studentRaw) { window.location.href = 'index.html'; }
const student = JSON.parse(studentRaw);

/* ─── Mock data (replace with real API calls in production) ─── */
const ATTENDANCE_DATES = [
  { date: '16-04-2026', present: false },
  { date: '09-04-2026', present: false },
  { date: '02-04-2026', present: false },
  { date: '19-03-2026', present: false },
];

const TOTAL_CLASSES = 12;
const ATTENDED = ATTENDANCE_DATES.filter(d => d.present).length;
const ATTEND_PCT = ((ATTENDED / TOTAL_CLASSES) * 100).toFixed(1);

const ASSIGNMENTS = [
  { num: 1, title: 'Assignment 1', deadline: 'Deadline (27-Feb / 28-Feb)',   status: 'Pending' },
  { num: 2, title: 'Assignment 2', deadline: 'Deadline (19-March / 20-March)', status: 'Pending' },
  { num: 3, title: 'Assignment 3',
    deadline: 'Deadline (30-April), Create same App using Code Genr OR hack the App OR Your analysis of App as seen from Continous Development Phase viewpoint.',
    status: 'Pending' },
];

const MARKS = {
  midTerm:    { scored: 24, max: 30 },
  endSem:     { scored: null, max: 60 },
  practical:  { scored: null, max: 15 },
  cap:        { scored: null, max: 10 },
};

const TOTAL_MAX    = 115;
const TOTAL_SCORED = (MARKS.midTerm.scored || 0) + (MARKS.endSem.scored || 0)
                   + (MARKS.practical.scored || 0) + (MARKS.cap.scored || 0);

/* ─── SVG helpers ───────────────────────────────────────────── */
const svgCheck = `<svg class="status-icon" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1.293-6.293l5-5-1.414-1.414L10 12.586l-2.293-2.293-1.414 1.414 3.707 3.707z" clip-rule="evenodd"/></svg>`;
const svgCheckPresent = `<svg class="status-icon present" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1.293-6.293l5-5-1.414-1.414L10 12.586l-2.293-2.293-1.414 1.414 3.707 3.707z" clip-rule="evenodd"/></svg>`;

/* ─── Render ─────────────────────────────────────────────────── */
function render() {
  const now = new Date();
  const fmt = (d) => d.toLocaleString('en-IN', { year:'numeric', month:'2-digit', day:'2-digit',
    hour:'2-digit', minute:'2-digit', second:'2-digit' }).replace(',', '');

  document.getElementById('dashFooter').innerHTML =
    `Release: ${fmt(now)} +05:30`;

  /* Build attendance date rows */
  const dateRows = ATTENDANCE_DATES.map((d, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${d.date}</td>
      <td>${d.present ? svgCheckPresent : svgCheck}</td>
    </tr>
  `).join('');

  /* Build assignment rows */
  const assignRows = ASSIGNMENTS.map(a => `
    <div class="assign-item">
      <div class="assign-num">${a.num}</div>
      <div class="assign-info">
        <strong>${a.title}</strong>
        <span>${a.deadline}</span>
      </div>
      <div class="${a.status === 'Pending' ? 'badge-pending' : 'badge-submitted'}">${a.status}</div>
    </div>
  `).join('');

  /* Build marks rows */
  function markVal(m) {
    if (m.scored === null) return `<span class="marks-val">– / ${m.max}</span>`;
    return `<span class="marks-val highlight">${m.scored} / ${m.max}</span>`;
  }

  document.getElementById('dashContent').innerHTML = `

    <!-- Profile Card -->
    <div class="profile-card">
      <div class="avatar-circle">
        <svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 12a5 5 0 100-10 5 5 0 000 10zm-7 9a7 7 0 1114 0H5z" clip-rule="evenodd"/></svg>
      </div>
      <div class="profile-info">
        <h2>${escHtml(student.name)}</h2>
        <p>Enrollment: ${escHtml(student.enrollment)}</p>
        <p>Branch: ${escHtml(student.branch)} | Sem: ${escHtml(String(student.sem))}</p>
        <div class="proxy-row">
          <span>Proxy Flag:</span>
          <input type="checkbox" disabled />
        </div>
      </div>
    </div>

    <!-- Attendance Section -->
    <div class="section-card">
      <div class="section-header attendance-header">
        <svg viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
        Attendance Progress
      </div>
      <div class="attendance-body">
        <div class="attend-row">
          <span>Overall Attendance</span>
          <span class="attend-count">${ATTENDED} / ${TOTAL_CLASSES} Days</span>
        </div>
        <div class="progress-bar-wrap">
          <div class="progress-bar-fill" style="width:${ATTEND_PCT}%;"></div>
        </div>
        <div class="progress-percent">${ATTEND_PCT}%</div>
      </div>

      <!-- View Details Toggle -->
      <div class="view-details-toggle" onclick="toggleDetails()">
        <div class="view-details-label">
          <svg viewBox="0 0 24 24"><path d="M3 3h7v7H3zm0 11h7v7H3zM13 3h8v4h-8zm0 6h8v2h-8zm0 6h8v6h-8z"/></svg>
          <div>
            View Details
            <small>${ATTENDED} of ${TOTAL_CLASSES} classes attended</small>
          </div>
        </div>
        <svg class="chevron" id="chevronIcon" viewBox="0 0 20 20" width="20" height="20">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
        </svg>
      </div>

      <div class="attend-table-wrap" id="attendTableWrap">
        <table class="attend-table">
          <thead>
            <tr><th>#</th><th>Date</th><th>Status</th></tr>
          </thead>
          <tbody>${dateRows}</tbody>
        </table>
      </div>

      <div class="attend-disabled">
        🔒 &nbsp; ATTENDANCE DISABLED
      </div>
    </div>

    <!-- Assignment Submissions -->
    <div class="section-card">
      <div class="section-header assign-header">
        <svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
        Assignment Submissions
      </div>
      ${assignRows}
      <div class="assign-note">Hackers .. See this Note</div>
    </div>

    <!-- Mid / End Sem Marks -->
    <div class="section-card">
      <div class="section-header marks-header">
        <svg viewBox="0 0 24 24"><path d="M3 3v18h18V3H3zm16 16H5V5h14v14zM7 12h2v5H7zm4-3h2v8h-2zm4-3h2v11h-2z"/></svg>
        Mid / End Sem Marks
      </div>
      <div class="marks-row">
        <span>Mid Term Marks <em style="color:#6b7280;font-size:0.8rem;">(30 will be scale down to 15 so please ignore total that is coming as 115)</em></span>
        ${markVal(MARKS.midTerm)}
      </div>
      <div class="marks-row">
        <span>End Sem Marks</span>
        ${markVal(MARKS.endSem)}
      </div>
      <div class="marks-row">
        <span>Practical Marks</span>
        ${markVal(MARKS.practical)}
      </div>
      <div class="marks-row">
        <span>CAP Marks</span>
        ${markVal(MARKS.cap)}
      </div>
      <div class="total-row">
        <div class="total-label">
          <svg viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          Total Marks
        </div>
        <span class="total-val">${TOTAL_SCORED} / ${TOTAL_MAX}</span>
      </div>
    </div>

    <!-- Feedback -->
    <div class="feedback-section">
      <h3>Your Comments / Suggestion / Feedback</h3>
      <textarea id="feedbackText" maxlength="300" placeholder="Share your suggestion here. Max 50 words."></textarea>
      <p class="feedback-hint">Once message sent then it cannot be edited or resend again.</p>
      <div class="feedback-actions">
        <button class="share-btn" onclick="submitFeedback()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
          </svg>
          Share
        </button>
      </div>
    </div>
  `;
}

/* ─── Toggle attendance details ─────────────────────────────── */
function toggleDetails() {
  const wrap    = document.getElementById('attendTableWrap');
  const chevron = document.getElementById('chevronIcon');
  wrap.classList.toggle('open');
  chevron.classList.toggle('open');
}

/* ─── Feedback submit ───────────────────────────────────────── */
function submitFeedback() {
  const text = (document.getElementById('feedbackText') || {}).value || '';
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) { alert('Please write your feedback first.'); return; }
  if (words.length > 50)  { alert('Please limit your feedback to 50 words.'); return; }
  alert('Thank you! Your feedback has been submitted.');
  document.getElementById('feedbackText').disabled = true;
}

/* ─── Logout ────────────────────────────────────────────────── */
function logout() {
  sessionStorage.removeItem('currentStudent');
  window.location.href = 'index.html';
}

/* ─── XSS helper ────────────────────────────────────────────── */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ─── Init ──────────────────────────────────────────────────── */
render();
