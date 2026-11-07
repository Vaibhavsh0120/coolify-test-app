const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Main page with modern Charcoal Glassmorphism design
app.get('/', (req, res) => {
  const currentTime = new Date().toISOString();
  
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Coolify Test App</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --charcoal-900: #0d0f12;
      --charcoal-800: #14171c;
      --charcoal-700: #1a1e24;
      --charcoal-glass: rgba(22, 26, 32, 0.72);
      --charcoal-border: rgba(255, 255, 255, 0.08);
      --charcoal-highlight: rgba(255, 255, 255, 0.04);
      --accent-cyan: #38bdf8;
      --accent-emerald: #10b981;
      --accent-purple: #a855f7;
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
      padding: 1.5rem;
      position: relative;
      overflow-x: hidden;
    }

    /* Ambient Charcoal & Aurora Glow Elements */
    .ambient-glow-1 {
      position: absolute;
      width: 500px;
      height: 500px;
      top: 15%;
      left: 20%;
      background: radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, rgba(13, 15, 18, 0) 70%);
      filter: blur(80px);
      border-radius: 50%;
      z-index: 0;
      pointer-events: none;
    }

    .ambient-glow-2 {
      position: absolute;
      width: 450px;
      height: 450px;
      bottom: 15%;
      right: 20%;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.07) 0%, rgba(13, 15, 18, 0) 70%);
      filter: blur(90px);
      border-radius: 50%;
      z-index: 0;
      pointer-events: none;
    }

    /* Charcoal Glass Card */
    .glass-card {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 540px;
      background: var(--charcoal-glass);
      backdrop-filter: blur(24px) saturate(160%);
      -webkit-backdrop-filter: blur(24px) saturate(160%);
      border: 1px solid var(--charcoal-border);
      border-radius: 24px;
      padding: 2.75rem 2.25rem;
      box-shadow: 
        0 30px 60px -15px rgba(0, 0, 0, 0.7),
        0 0 0 1px rgba(255, 255, 255, 0.05) inset;
      text-align: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .glass-card:hover {
      transform: translateY(-2px);
      box-shadow: 
        0 35px 70px -12px rgba(0, 0, 0, 0.8),
        0 0 0 1px rgba(255, 255, 255, 0.08) inset;
    }

    /* Header Badge */
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      padding: 0.45rem 1rem;
      border-radius: 9999px;
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.22);
      font-size: 0.825rem;
      font-weight: 600;
      color: #34d399;
      margin-bottom: 1.75rem;
      letter-spacing: 0.01em;
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
      animation: pulse 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
      0% {
        transform: scale(0.95);
        opacity: 0.8;
      }
      70% {
        transform: scale(2.4);
        opacity: 0;
      }
      100% {
        transform: scale(2.4);
        opacity: 0;
      }
    }

    /* Title & Description */
    h1 {
      font-size: 1.95rem;
      font-weight: 800;
      line-height: 1.25;
      margin-bottom: 0.75rem;
      letter-spacing: -0.03em;
      background: linear-gradient(135deg, #ffffff 40%, #cbd5e1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .subtitle {
      color: var(--text-secondary);
      font-size: 1.02rem;
      font-weight: 400;
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    /* Glass Info Inset Block */
    .glass-inset {
      background: rgba(13, 15, 18, 0.65);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      padding: 1.25rem 1.5rem;
      margin-bottom: 1.75rem;
      text-align: left;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
    }

    .info-row:not(:last-child) {
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    }

    .info-label {
      font-size: 0.825rem;
      color: var(--text-muted);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .info-value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.875rem;
      color: var(--accent-cyan);
      font-weight: 500;
    }

    .time-value {
      color: #38bdf8;
      font-weight: 600;
    }

    /* Action Links */
    .actions {
      display: flex;
      gap: 0.75rem;
      justify-content: center;
    }

    .action-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s ease;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: var(--text-primary);
    }

    .action-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.16);
      transform: translateY(-1px);
    }

    .action-btn.primary {
      background: linear-gradient(135deg, rgba(56, 189, 248, 0.18), rgba(168, 85, 247, 0.18));
      border: 1px solid rgba(56, 189, 248, 0.3);
      color: #7dd3fc;
    }

    .action-btn.primary:hover {
      background: linear-gradient(135deg, rgba(56, 189, 248, 0.28), rgba(168, 85, 247, 0.28));
      border-color: rgba(56, 189, 248, 0.5);
    }

    .footer {
      margin-top: 2rem;
      font-size: 0.775rem;
      color: var(--text-muted);
    }
  </style>
</head>
<body>
  <div class="ambient-glow-1"></div>
  <div class="ambient-glow-2"></div>

  <main class="glass-card">
    <div class="status-badge">
      <span class="pulse-indicator">
        <span class="pulse-ring"></span>
        <span class="pulse-dot"></span>
      </span>
      <span>Coolify Deployment Active</span>
    </div>

    <h1>Hello from Vaibhav on Coolify! 🚀</h1>
    <p class="subtitle">Your production container is live, optimized, and performing smoothly inside Docker.</p>

    <div class="glass-inset">
      <div class="info-row">
        <span class="info-label">Environment</span>
        <span class="info-value">Node.js 20 • Alpine Linux</span>
      </div>
      <div class="info-row">
        <span class="info-label">Live Clock</span>
        <span class="info-value time-value" id="clock-display">Syncing...</span>
      </div>
      <div class="info-row">
        <span class="info-label">ISO Timestamp</span>
        <span class="info-value" id="iso-display">${currentTime}</span>
      </div>
    </div>

    <div class="actions">
      <a href="/health" class="action-btn primary" target="_blank">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
        Health Check (/health)
      </a>
      <a href="https://coolify.io" class="action-btn" target="_blank" rel="noopener">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
        Coolify Docs
      </a>
    </div>

    <p class="footer">Exposed on Port ${PORT} • Ready for Production</p>
  </main>

  <script>
    // Live ticking client-side clock initialized with server timestamp
    let serverTime = new Date("${currentTime}");
    const clockEl = document.getElementById('clock-display');
    const isoEl = document.getElementById('iso-display');

    function updateClock() {
      serverTime.setSeconds(serverTime.getSeconds() + 1);
      clockEl.textContent = serverTime.toLocaleTimeString([], { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      isoEl.textContent = serverTime.toISOString();
    }

    updateClock();
    setInterval(updateClock, 1000);
  </script>
</body>
</html>
  `);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Test app running on http://0.0.0.0:${PORT}`);
});
