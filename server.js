const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;

// Parse URL-encoded bodies (for HTML form submissions) and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Initialize PostgreSQL connection pool if DATABASE_URL is configured
let pool = null;
let databaseConnected = false;

if (DATABASE_URL) {
  pool = new Pool({
    connectionString: DATABASE_URL,
    // Enable SSL if running in production with external databases (e.g., Supabase/Neon/AWS RDS)
    ssl: process.env.NODE_ENV === 'production' && !DATABASE_URL.includes('localhost') && !DATABASE_URL.includes('127.0.0.1')
      ? { rejectUnauthorized: false }
      : false,
  });
}

// Ensure the 'messages' table exists on startup
async function initDatabase() {
  if (!pool) {
    console.log('Notice: DATABASE_URL is not set. Database features are currently disabled.');
    databaseConnected = false;
    return;
  }
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    client.release();
    databaseConnected = true;
    console.log('✓ Database connected and "messages" table verified.');
  } catch (err) {
    console.error('✗ Database connection error:', err.message);
    databaseConnected = false;
  }
}

// Utility function to escape HTML to prevent XSS injection
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// GET / - Charcoal Glassmorphism UI with form and message list
app.get('/', async (req, res) => {
  const currentTime = new Date().toISOString();
  let messages = [];

  // Fetch messages if database is available
  if (pool) {
    try {
      const result = await pool.query('SELECT id, content, created_at FROM messages ORDER BY created_at DESC LIMIT 25');
      messages = result.rows;
      databaseConnected = true;
    } catch (err) {
      console.error('Error querying messages:', err.message);
      databaseConnected = false;
    }
  }

  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Coolify Test App - Messages</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --charcoal-900: #0d0f12;
      --charcoal-800: #14171c;
      --charcoal-700: #1a1e24;
      --charcoal-glass: rgba(22, 26, 32, 0.75);
      --charcoal-border: rgba(255, 255, 255, 0.08);
      --accent-cyan: #38bdf8;
      --accent-emerald: #10b981;
      --accent-purple: #a855f7;
      --accent-amber: #f59e0b;
      --text-primary: #f8fafc;
      --text-secondary: #94a3b8;
      --text-muted: #64748b;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    }

    body {
      background-color: var(--charcoal-900);
      color: var(--text-primary);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2.5rem 1.25rem;
      position: relative;
      overflow-x: hidden;
    }

    /* Ambient Aurora Glow */
    .ambient-glow-cyan {
      position: fixed;
      width: 550px;
      height: 550px;
      top: 5%;
      left: 10%;
      background: radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, rgba(13, 15, 18, 0) 70%);
      filter: blur(90px);
      border-radius: 50%;
      z-index: 0;
      pointer-events: none;
    }

    .ambient-glow-purple {
      position: fixed;
      width: 500px;
      height: 500px;
      bottom: 5%;
      right: 10%;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.07) 0%, rgba(13, 15, 18, 0) 70%);
      filter: blur(100px);
      border-radius: 50%;
      z-index: 0;
      pointer-events: none;
    }

    /* Charcoal Glass Card */
    .glass-card {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 620px;
      background: var(--charcoal-glass);
      backdrop-filter: blur(24px) saturate(160%);
      -webkit-backdrop-filter: blur(24px) saturate(160%);
      border: 1px solid var(--charcoal-border);
      border-radius: 24px;
      padding: 2.5rem 2rem;
      box-shadow: 
        0 30px 60px -15px rgba(0, 0, 0, 0.75),
        0 0 0 1px rgba(255, 255, 255, 0.05) inset;
      text-align: center;
    }

    /* Status Badges Header */
    .badges-container {
      display: flex;
      gap: 0.6rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 1.5rem;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 0.95rem;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 0.01em;
    }

    .status-badge.coolify {
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.25);
      color: #34d399;
    }

    .status-badge.db-connected {
      background: rgba(56, 189, 248, 0.08);
      border: 1px solid rgba(56, 189, 248, 0.25);
      color: #38bdf8;
    }

    .status-badge.db-missing {
      background: rgba(245, 158, 11, 0.08);
      border: 1px solid rgba(245, 158, 11, 0.25);
      color: #fbbf24;
    }

    .pulse-indicator {
      position: relative;
      width: 8px;
      height: 8px;
    }

    .pulse-dot {
      width: 8px;
      height: 8px;
      background-color: var(--accent-emerald);
      border-radius: 50%;
      display: block;
    }

    .pulse-ring {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: var(--accent-emerald);
      animation: beacon-pulse 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes beacon-pulse {
      0% { transform: scale(0.95); opacity: 0.85; }
      70% { transform: scale(2.4); opacity: 0; }
      100% { transform: scale(2.4); opacity: 0; }
    }

    h1 {
      font-size: 1.85rem;
      font-weight: 800;
      line-height: 1.25;
      margin-bottom: 0.6rem;
      letter-spacing: -0.03em;
      background: linear-gradient(135deg, #ffffff 40%, #cbd5e1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .subtitle {
      color: var(--text-secondary);
      font-size: 0.95rem;
      margin-bottom: 1.75rem;
      line-height: 1.5;
    }

    /* Glass Inset Information Box */
    .glass-inset {
      background: rgba(13, 15, 18, 0.65);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      padding: 1rem 1.25rem;
      margin-bottom: 1.75rem;
      text-align: left;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.4rem 0;
    }

    .info-row:not(:last-child) {
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    }

    .info-label {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .info-value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.825rem;
      color: var(--accent-cyan);
      font-weight: 500;
    }

    /* Input Form */
    .form-container {
      margin-bottom: 2rem;
      text-align: left;
    }

    .form-title {
      font-size: 0.95rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
      color: var(--text-primary);
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .message-form {
      display: flex;
      gap: 0.6rem;
    }

    .message-input {
      flex: 1;
      background: rgba(13, 15, 18, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 0.75rem 1rem;
      color: var(--text-primary);
      font-size: 0.9rem;
      outline: none;
      transition: all 0.2s ease;
    }

    .message-input:focus {
      border-color: var(--accent-cyan);
      box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15);
      background: rgba(13, 15, 18, 0.9);
    }

    .message-input::placeholder {
      color: var(--text-muted);
    }

    /* Action Buttons */
    .action-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .action-btn.primary {
      background: linear-gradient(135deg, #0284c7, #2563eb);
      color: #ffffff;
      box-shadow: 0 4px 15px rgba(37, 99, 235, 0.25);
    }

    .action-btn.primary:hover {
      background: linear-gradient(135deg, #0369a1, #1d4ed8);
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(37, 99, 235, 0.35);
    }

    .action-btn.secondary {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: var(--text-primary);
    }

    .action-btn.secondary:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.16);
      transform: translateY(-1px);
    }

    /* Messages Section */
    .messages-container {
      text-align: left;
      margin-top: 1.75rem;
    }

    .messages-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.85rem;
    }

    .messages-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .messages-count {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      color: var(--text-muted);
      background: rgba(255, 255, 255, 0.04);
      padding: 0.2rem 0.55rem;
      border-radius: 6px;
    }

    .messages-list {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      max-height: 240px;
      overflow-y: auto;
      padding-right: 0.25rem;
    }

    .messages-list::-webkit-scrollbar {
      width: 5px;
    }
    .messages-list::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.12);
      border-radius: 10px;
    }

    .message-item {
      background: rgba(13, 15, 18, 0.55);
      border: 1px solid rgba(255, 255, 255, 0.04);
      border-radius: 12px;
      padding: 0.85rem 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      transition: border-color 0.2s ease;
    }

    .message-item:hover {
      border-color: rgba(56, 189, 248, 0.2);
    }

    .message-content {
      font-size: 0.875rem;
      color: #e2e8f0;
      word-break: break-word;
      font-weight: 500;
    }

    .message-time {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.725rem;
      color: var(--text-muted);
      white-space: nowrap;
    }

    .empty-state {
      background: rgba(13, 15, 18, 0.4);
      border: 1px dashed rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 1.5rem;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.85rem;
    }

    .quick-links {
      display: flex;
      gap: 0.75rem;
      justify-content: center;
      margin-top: 2rem;
    }

    .footer {
      margin-top: 1.75rem;
      font-size: 0.75rem;
      color: var(--text-muted);
    }
  </style>
</head>
<body>
  <div class="ambient-glow-cyan"></div>
  <div class="ambient-glow-purple"></div>

  <main class="glass-card">
    <!-- Badges Header -->
    <div class="badges-container">
      <div class="status-badge coolify">
        <span class="pulse-indicator">
          <span class="pulse-ring"></span>
          <span class="pulse-dot"></span>
        </span>
        <span>Coolify Active</span>
      </div>

      <div class="status-badge ${databaseConnected ? 'db-connected' : 'db-missing'}">
        <span>${databaseConnected ? '● PostgreSQL Connected' : '○ Database Offline'}</span>
      </div>
    </div>

    <h1>Hello from Vaibhav on Coolify! 🚀</h1>
    <p class="subtitle">Submit a message below to test real-time persistent database operations.</p>

    <!-- Inset Info Box -->
    <div class="glass-inset">
      <div class="info-row">
        <span class="info-label">Environment</span>
        <span class="info-value">Node.js 20 • Express • PostgreSQL</span>
      </div>
      <div class="info-row">
        <span class="info-label">Live Clock</span>
        <span class="info-value" id="clock-display">Syncing...</span>
      </div>
      <div class="info-row">
        <span class="info-label">Database Status</span>
        <span class="info-value" style="color: ${databaseConnected ? '#38bdf8' : '#fbbf24'};">
          ${databaseConnected ? 'Connected & Migrated' : (DATABASE_URL ? 'Connection Error' : 'DATABASE_URL Not Configured')}
        </span>
      </div>
    </div>

    <!-- Message Submission Form -->
    <div class="form-container">
      <div class="form-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        Save a New Message
      </div>
      <form action="/message" method="POST" class="message-form">
        <input 
          type="text" 
          name="content" 
          class="message-input" 
          placeholder="${databaseConnected ? 'Type your message (e.g. Hello Coolify!)...' : 'Connect PostgreSQL in Coolify to enable message saving'}" 
          required 
          autocomplete="off"
          ${!databaseConnected && !DATABASE_URL ? 'title="Configure DATABASE_URL to enable saving"' : ''}
        />
        <button type="submit" class="action-btn primary">
          Save Message
        </button>
      </form>
    </div>

    <!-- Stored Messages List -->
    <div class="messages-container">
      <div class="messages-header">
        <span class="messages-title">Database Records</span>
        <span class="messages-count">${messages.length} ${messages.length === 1 ? 'Message' : 'Messages'}</span>
      </div>

      <div class="messages-list">
        ${messages.length === 0 ? `
          <div class="empty-state">
            ${databaseConnected 
              ? 'No messages found in database. Submit the form above to add the first one!' 
              : 'Database is not yet connected. Add a PostgreSQL database in Coolify and attach DATABASE_URL.'}
          </div>
        ` : messages.map(msg => `
          <div class="message-item">
            <span class="message-content">${escapeHtml(msg.content)}</span>
            <span class="message-time">${new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Quick Links -->
    <div class="quick-links">
      <a href="/health" class="action-btn secondary" target="_blank">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
        Health Check (/health)
      </a>
      <a href="https://coolify.io" class="action-btn secondary" target="_blank" rel="noopener">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
        Coolify Docs
      </a>
    </div>

    <p class="footer">Port ${PORT} • PostgreSQL + Docker • Coolify Ready</p>
  </main>

  <script>
    let serverTime = new Date("${currentTime}");
    const clockEl = document.getElementById('clock-display');

    function updateClock() {
      serverTime.setSeconds(serverTime.getSeconds() + 1);
      clockEl.textContent = serverTime.toLocaleTimeString([], { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    updateClock();
    setInterval(updateClock, 1000);
  </script>
</body>
</html>
  `);
});

// POST /message - Insert message into PostgreSQL and redirect to /
app.post('/message', async (req, res) => {
  const content = req.body.content ? req.body.content.trim() : '';

  if (content && pool) {
    try {
      await pool.query('INSERT INTO messages (content) VALUES ($1)', [content]);
      console.log('Saved message to database:', content);
    } catch (err) {
      console.error('Error saving message:', err.message);
    }
  }

  res.redirect('/');
});

// GET /health - Returns health and real-time database connection status
app.get('/health', async (req, res) => {
  let isDbOk = false;

  if (pool) {
    try {
      await pool.query('SELECT 1');
      isDbOk = true;
      databaseConnected = true;
    } catch (err) {
      isDbOk = false;
      databaseConnected = false;
    }
  }

  res.status(200).json({
    status: 'healthy',
    databaseConnected: isDbOk
  });
});

// Start Express server and initialize DB connection
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
  await initDatabase();
});
