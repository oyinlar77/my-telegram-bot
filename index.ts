<!DOCTYPE html>
<html lang="uz">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Student Helper Bot</title>
<script src="https://telegram.org/js/telegram-web-app.js"></script>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  :root {
    --primary: #1a73e8;
    --primary-dark: #1557b0;
    --success: #34a853;
    --success-dark: #2d7d46;
    --danger: #ea4335;
    --danger-dark: #c5221f;
    --bg: #f0f4f9;
    --card-bg: #ffffff;
    --text: #202124;
    --muted: #5f6368;
    --border: #dadce0;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    padding-bottom: 80px;
  }
  
  .header {
    background: linear-gradient(135deg, #1a73e8, #0d47a1);
    color: white;
    padding: 20px 16px;
    text-align: center;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }
  
  .header h1 { font-size: 20px; font-weight: 700; }
  .header p { font-size: 13px; opacity: 0.85; margin-top: 4px; }
  
  .tab-bar {
    display: flex;
    background: white;
    border-bottom: 2px solid var(--border);
    overflow-x: auto;
    scrollbar-width: none;
  }
  .tab-bar::-webkit-scrollbar { display: none; }
  
  .tab {
    flex: 1;
    padding: 14px 12px;
    border: none;
    background: none;
    font-size: 13px;
    font-weight: 500;
    color: var(--muted);
    cursor: pointer;
    white-space: nowrap;
    border-bottom: 3px solid transparent;
    transition: all 0.2s;
  }
  .tab.active { color: var(--primary); border-bottom-color: var(--primary); }
  
  .page { display: none; padding: 16px; }
  .page.active { display: block; }
  
  .card {
    background: var(--card-bg);
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  }
  
  .card-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: var(--muted);
    margin-bottom: 6px;
    margin-top: 12px;
  }
  
  input[type="text"], input[type="number"], select, textarea {
    width: 100%;
    padding: 12px 14px;
    border: 2px solid var(--border);
    border-radius: 10px;
    font-size: 14px;
    color: var(--text);
    background: white;
    transition: border-color 0.2s;
    outline: none;
  }
  
  input:focus, select:focus, textarea:focus { border-color: var(--primary); }
  textarea { resize: vertical; min-height: 90px; }
  
  .range-container {
    position: relative;
    padding: 8px 0;
  }
  
  input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: #dadce0;
    outline: none;
    border: none;
    padding: 0;
  }
  
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--primary);
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(26,115,232,0.4);
  }
  
  .count-display {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
  }
  
  .count-value {
    font-size: 28px;
    font-weight: 700;
    color: var(--primary);
  }
  
  .price-badge {
    background: linear-gradient(135deg, #34a853, #1e8e3e);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 16px;
    font-weight: 700;
  }
  
  .info-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
  }
  
  .chip {
    padding: 5px 12px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 500;
  }
  
  .chip-info { background: #e8f0fe; color: var(--primary); }
  .chip-success { background: #e6f4ea; color: var(--success); }
  .chip-warn { background: #fef7e0; color: #f29900; }
  
  .btn {
    display: block;
    width: 100%;
    padding: 15px;
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
    margin-top: 8px;
  }
  
  .btn-primary {
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    color: white;
    box-shadow: 0 4px 12px rgba(26,115,232,0.35);
  }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(26,115,232,0.4); }
  .btn-primary:active { transform: translateY(0); }
  
  .btn-success {
    background: linear-gradient(135deg, var(--success), var(--success-dark));
    color: white;
    box-shadow: 0 4px 12px rgba(52,168,83,0.35);
  }
  
  .btn-danger {
    background: linear-gradient(135deg, var(--danger), var(--danger-dark));
    color: white;
    box-shadow: 0 4px 12px rgba(234,67,53,0.35);
  }
  
  .btn-outline {
    background: white;
    color: var(--primary);
    border: 2px solid var(--primary);
  }
  
  .progress-bar {
    height: 8px;
    background: #e8f0fe;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 6px;
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--primary), #4285f4);
    border-radius: 4px;
    transition: width 0.3s ease;
  }
  
  .balance-card {
    background: linear-gradient(135deg, #1a73e8, #0d47a1);
    color: white;
    border-radius: 16px;
    padding: 24px;
    text-align: center;
    margin-bottom: 16px;
    box-shadow: 0 4px 16px rgba(26,115,232,0.3);
  }
  
  .balance-amount {
    font-size: 40px;
    font-weight: 700;
    margin: 8px 0;
  }
  
  .balance-label { opacity: 0.85; font-size: 14px; }
  
  .user-id {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.15);
    border-radius: 20px;
    padding: 6px 14px;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    cursor: pointer;
    margin-top: 10px;
    border: 1px solid rgba(255,255,255,0.3);
    transition: background 0.2s;
  }
  .user-id:hover { background: rgba(255,255,255,0.25); }
  .user-id .copy-icon { font-size: 16px; }
  
  .referral-card {
    background: linear-gradient(135deg, #34a853, #1e8e3e);
    color: white;
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 12px;
    text-align: center;
  }
  
  .referral-count { font-size: 36px; font-weight: 700; }
  .referral-link {
    background: rgba(255,255,255,0.15);
    border-radius: 10px;
    padding: 12px;
    margin-top: 12px;
    font-size: 13px;
    word-break: break-all;
    cursor: pointer;
    border: 1px solid rgba(255,255,255,0.3);
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 12px;
  }
  
  .stat-card {
    background: white;
    border-radius: 12px;
    padding: 16px;
    text-align: center;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  }
  
  .stat-value { font-size: 28px; font-weight: 700; color: var(--primary); }
  .stat-label { font-size: 12px; color: var(--muted); margin-top: 4px; }
  
  .price-table { width: 100%; border-collapse: collapse; }
  .price-table th {
    background: #e8f0fe;
    color: var(--primary);
    padding: 10px;
    text-align: left;
    font-size: 13px;
    font-weight: 600;
  }
  .price-table td { padding: 10px; font-size: 13px; border-bottom: 1px solid var(--border); }
  .price-table tr:last-child td { border-bottom: none; }
  
  .milestone-bar {
    margin: 16px 0;
  }
  
  .milestone-steps {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
  }
  
  .milestone-step {
    font-size: 11px;
    color: var(--muted);
    text-align: center;
    flex: 1;
  }
  
  .milestone-step.reached { color: var(--success); font-weight: 600; }
  
  .toast {
    position: fixed;
    bottom: 90px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: #333;
    color: white;
    padding: 10px 20px;
    border-radius: 20px;
    font-size: 13px;
    opacity: 0;
    transition: all 0.3s;
    z-index: 1000;
    white-space: nowrap;
  }
  
  .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
  
  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    color: var(--muted);
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #e8f0fe;
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 12px;
  }
  
  @keyframes spin { to { transform: rotate(360deg); } }
  
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    display: flex;
    border-top: 1px solid var(--border);
    padding: 6px 0;
    z-index: 100;
    box-shadow: 0 -2px 8px rgba(0,0,0,0.08);
  }
  
  .nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 6px;
    cursor: pointer;
    background: none;
    border: none;
    color: var(--muted);
    font-size: 11px;
    transition: color 0.2s;
  }
  
  .nav-item.active { color: var(--primary); }
  .nav-item span:first-child { font-size: 22px; margin-bottom: 2px; }

  .service-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
    margin-bottom: 16px;
  }
  
  .service-btn {
    padding: 16px 8px;
    border-radius: 12px;
    border: 2px solid transparent;
    background: white;
    cursor: pointer;
    text-align: center;
    transition: all 0.2s;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  }
  
  .service-btn .emoji { font-size: 28px; display: block; margin-bottom: 6px; }
  .service-btn .label { font-size: 12px; font-weight: 600; color: var(--text); }
  .service-btn.selected { border-color: var(--primary); background: #e8f0fe; }
  .service-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
</style>
</head>
<body>

<div class="header">
  <h1>🎓 Student Helper Bot</h1>
  <p>Talabalar uchun AI yordamchi</p>
</div>

<!-- Bottom Navigation -->
<nav class="bottom-nav">
  <button class="nav-item active" onclick="switchNav('home', this)">
    <span>🏠</span>
    <span>Bosh sahifa</span>
  </button>
  <button class="nav-item" onclick="switchNav('order', this)">
    <span>✍️</span>
    <span>Buyurtma</span>
  </button>
  <button class="nav-item" onclick="switchNav('referral', this)">
    <span>👥</span>
    <span>Referal</span>
  </button>
  <button class="nav-item" onclick="switchNav('balance', this)">
    <span>💰</span>
    <span>Balans</span>
  </button>
</nav>

<!-- HOME PAGE -->
<div id="page-home" class="page active">
  <div class="card" style="background: linear-gradient(135deg, #1a73e8, #0d47a1); color: white; margin-bottom: 12px;">
    <div style="font-size: 32px; margin-bottom: 8px;">🎓</div>
    <h2 style="font-size: 18px; margin-bottom: 8px;">Salom! Student Helper Bot</h2>
    <p style="font-size: 13px; opacity: 0.85;">AI yordamida referat, test va slaydlar yarating. Tez, sifatli va arzon!</p>
  </div>
  
  <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 16px;">
    <div class="card" style="text-align: center; cursor: pointer;" onclick="switchNav('order', null, 'referat')">
      <div style="font-size: 28px;">📝</div>
      <div style="font-size: 12px; font-weight: 600; margin-top: 6px;">Referat</div>
      <div style="font-size: 11px; color: var(--muted);">5k-10k so'm</div>
    </div>
    <div class="card" style="text-align: center; cursor: pointer;" onclick="switchNav('order', null, 'test')">
      <div style="font-size: 28px;">📋</div>
      <div style="font-size: 12px; font-weight: 600; margin-top: 6px;">Test</div>
      <div style="font-size: 11px; color: var(--muted);">3k-7k so'm</div>
    </div>
    <div class="card" style="text-align: center; cursor: pointer;" onclick="switchNav('order', null, 'slayd')">
      <div style="font-size: 28px;">🎞️</div>
      <div style="font-size: 12px; font-weight: 600; margin-top: 6px;">Slayd</div>
      <div style="font-size: 11px; color: var(--muted);">5k-7k so'm</div>
    </div>
  </div>
  
  <div class="card">
    <div class="card-title">⚡ Afzalliklar</div>
    <div class="info-chips">
      <span class="chip chip-info">🤖 AI yordamida</span>
      <span class="chip chip-success">📄 PDF format</span>
      <span class="chip chip-info">⚡ Tez tayyorlanadi</span>
      <span class="chip chip-success">💸 Arzon narx</span>
      <span class="chip chip-warn">🎁 5000 so'm bonus</span>
    </div>
  </div>
  
  <div class="card" id="price-table-card">
    <div class="card-title">💰 Narxlar</div>
    <table class="price-table" id="price-table">
      <tr><td colspan="3" style="text-align:center;color:var(--muted)">Yuklanmoqda...</td></tr>
    </table>
  </div>
</div>

<!-- ORDER PAGE -->
<div id="page-order" class="page">
  <div class="card">
    <div class="card-title">📦 Xizmat tanlang</div>
    <div class="service-grid">
      <button class="service-btn" id="btn-referat" onclick="selectService('referat')">
        <span class="emoji">📝</span>
        <span class="label">Referat</span>
      </button>
      <button class="service-btn" id="btn-test" onclick="selectService('test')">
        <span class="emoji">📋</span>
        <span class="label">Test</span>
      </button>
      <button class="service-btn" id="btn-slayd" onclick="selectService('slayd')">
        <span class="emoji">🎞️</span>
        <span class="label">Slayd</span>
      </button>
    </div>
  </div>
  
  <div class="card">
    <div class="card-title">✏️ Mavzu kiriting</div>
    <textarea id="topic-input" placeholder="Masalan: Informatika tarixi va rivojlanishi..."></textarea>
  </div>
  
  <div class="card" id="count-card">
    <div class="card-title" id="count-label">📊 Sahifa soni</div>
    <div class="range-container">
      <input type="range" id="count-range" min="1" max="25" value="10" oninput="updateCount(this.value)">
    </div>
    <div class="count-display">
      <div>
        <div class="count-value" id="count-display">10</div>
        <div style="font-size: 12px; color: var(--muted);" id="count-unit">sahifa</div>
      </div>
      <div class="price-badge" id="price-display">5 000 so'm</div>
    </div>
    <div class="progress-bar">
      <div class="progress-fill" id="count-progress" style="width: 40%"></div>
    </div>
    <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--muted); margin-top: 4px;">
      <span id="min-label">Min: 1</span>
      <span id="max-label">Max: 25</span>
    </div>
  </div>
  
  <div class="card" id="balance-info-card">
    <div class="card-title">💰 Balans ma'lumoti</div>
    <div style="display: flex; justify-content: space-between; font-size: 14px;">
      <span>Joriy balans:</span>
      <strong id="current-balance">Yuklanmoqda...</strong>
    </div>
    <div style="display: flex; justify-content: space-between; font-size: 14px; margin-top: 8px;">
      <span>Xizmat narxi:</span>
      <strong id="service-price">—</strong>
    </div>
    <div style="border-top: 1px solid var(--border); margin-top: 10px; padding-top: 10px; display: flex; justify-content: space-between; font-size: 14px;">
      <span>Qoldiq:</span>
      <strong id="remaining-balance" style="color: var(--success)">—</strong>
    </div>
  </div>
  
  <button class="btn btn-primary" onclick="placeOrder()">
    ✅ Buyurtma berish
  </button>
</div>

<!-- REFERRAL PAGE -->
<div id="page-referral" class="page">
  <div class="referral-card">
    <div style="font-size: 36px; margin-bottom: 8px;">👥</div>
    <div style="font-size: 14px; opacity: 0.85;">Do'stlarim soni</div>
    <div class="referral-count" id="ref-count">0</div>
    <div style="font-size: 12px; opacity: 0.75; margin-top: 4px;">10 ta do'st = +4,000 so'm bonus</div>
  </div>
  
  <div class="card">
    <div class="card-title">🎯 Referal havolangiz</div>
    <div class="referral-link" id="ref-link" onclick="copyRefLink()">
      Yuklanmoqda...
      <br><span style="font-size: 11px; opacity: 0.7; margin-top: 4px; display: block;">📋 Nusxalash uchun bosing</span>
    </div>
    <button class="btn btn-success" onclick="shareRefLink()" style="margin-top: 10px;">
      🚀 Do'stlaringizga ulashing
    </button>
  </div>
  
  <div class="card">
    <div class="card-title">🏆 Milestone progressi</div>
    <div class="milestone-bar">
      <div class="progress-bar" style="height: 12px;">
        <div class="progress-fill" id="milestone-progress" style="width: 0%"></div>
      </div>
      <div class="milestone-steps" style="margin-top: 8px;">
        <div class="milestone-step" id="m1">1</div>
        <div class="milestone-step" id="m5">5</div>
        <div class="milestone-step" id="m10">10 🎁</div>
        <div class="milestone-step" id="m20">20 🎁</div>
        <div class="milestone-step" id="m30">30 🎁</div>
      </div>
    </div>
    <div style="text-align: center; font-size: 13px; color: var(--muted);">
      <span id="next-milestone-text"></span>
    </div>
  </div>
  
  <div class="card">
    <div class="card-title">ℹ️ Qanday ishlaydi?</div>
    <div style="font-size: 13px; color: var(--muted); line-height: 1.7;">
      1️⃣ Havolangizni do'stlaringizga yuboring<br>
      2️⃣ Do'stingiz botga kiradi<br>
      3️⃣ Har 10 ta do'st uchun <strong style="color: var(--success)">+4,000 so'm</strong> bonus olasiz<br>
      4️⃣ Do'stingiz ham <strong style="color: var(--primary)">5,000 so'm</strong> bonus oladi
    </div>
  </div>
</div>

<!-- BALANCE PAGE -->
<div id="page-balance" class="page">
  <div class="balance-card">
    <div style="font-size: 14px; opacity: 0.85;">Hisobingiz</div>
    <div class="balance-amount" id="balance-amount">...</div>
    <div class="balance-label">so'm</div>
    <div class="user-id" id="user-id-badge" onclick="copyUserId()">
      <span class="copy-icon">📋</span>
      <span id="user-id-text">ID: ...</span>
    </div>
  </div>
  
  <div class="card">
    <div class="card-title">📊 Statistika</div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value" id="stat-refs">0</div>
        <div class="stat-label">👥 Do'stlar</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" id="stat-orders">0</div>
        <div class="stat-label">📦 Buyurtmalar</div>
      </div>
    </div>
  </div>
  
  <div class="card">
    <div class="card-title">💡 Balansni qanday ko'paytirish?</div>
    <div style="font-size: 13px; color: var(--muted); line-height: 1.8;">
      🎁 Yangi foydalanuvchi bonusi: <strong>5,000 so'm</strong><br>
      👥 Har 10 ta do'st taklif: <strong>+4,000 so'm</strong><br>
      💳 Admin orqali to'ldirish mumkin
    </div>
    <button class="btn btn-outline" onclick="switchNav('referral', null)" style="margin-top: 10px;">
      👥 Do'st taklif qilish
    </button>
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}

let userData = {
  id: tg?.initDataUnsafe?.user?.id || 0,
  firstName: tg?.initDataUnsafe?.user?.first_name || 'Foydalanuvchi',
  balance: 0,
  referralCount: 0
};

let currentService = 'referat';
let prices = {};

const serviceConfig = {
  referat: { label: 'Sahifalar soni', unit: 'sahifa', min: 1, max: 25, default: 10 },
  test: { label: 'Savollar soni', unit: 'ta savol', min: 10, max: 40, default: 20 },
  slayd: { label: 'Slaydlar soni', unit: 'ta slayd', min: 1, max: 15, default: 10 }
};

async function fetchPrices() {
  try {
    const res = await fetch('/api/prices');
    const data = await res.json();
    prices = {};
    data.forEach(p => {
      if (!prices[p.service]) prices[p.service] = [];
      prices[p.service].push(p);
    });
    updatePriceTable();
  } catch(e) { console.error('Prices fetch error:', e); }
}

async function fetchUserData() {
  if (!userData.id) return;
  try {
    const res = await fetch(`/api/user/${userData.id}`);
    if (res.ok) {
      const data = await res.json();
      userData.balance = data.balance;
      userData.referralCount = data.referral_count;
      updateUI();
    }
  } catch(e) { console.error('User fetch error:', e); }
}

function updateUI() {
  // Balance page
  const balEl = document.getElementById('balance-amount');
  if (balEl) balEl.textContent = userData.balance.toLocaleString('uz-UZ');
  
  const idEl = document.getElementById('user-id-text');
  if (idEl) idEl.textContent = `ID: ${userData.id}`;
  
  // Referral page  
  const refEl = document.getElementById('ref-count');
  if (refEl) refEl.textContent = userData.referralCount;
  
  const statRef = document.getElementById('stat-refs');
  if (statRef) statRef.textContent = userData.referralCount;
  
  const refLink = `https://t.me/StudentHelperUzBot?start=${userData.id}`;
  const linkEl = document.getElementById('ref-link');
  if (linkEl) linkEl.innerHTML = `🔗 ${refLink}<br><span style="font-size:11px;opacity:0.7;margin-top:4px;display:block">📋 Nusxalash uchun bosing</span>`;
  linkEl._link = refLink;
  
  // Milestone
  const progress = (userData.referralCount % 10) / 10 * 100;
  const mpEl = document.getElementById('milestone-progress');
  if (mpEl) mpEl.style.width = `${progress}%`;
  
  const nextEl = document.getElementById('next-milestone-text');
  if (nextEl) {
    const needed = 10 - (userData.referralCount % 10);
    if (needed === 10 && userData.referralCount > 0) {
      nextEl.textContent = '🎉 Milestone yutdingiz!';
    } else {
      nextEl.textContent = `Keyingi bonusgacha: ${needed} ta do'st`;
    }
  }
  
  // Current balance in order page
  const cbEl = document.getElementById('current-balance');
  if (cbEl) cbEl.textContent = `${userData.balance.toLocaleString()} so'm`;
  
  updateOrderBalance();
}

function updatePriceTable() {
  const table = document.getElementById('price-table');
  if (!table) return;
  
  let html = `<tr><th>Xizmat</th><th>Hajm</th><th>Narx</th></tr>`;
  
  const serviceNames = { referat: '📝 Referat', test: '📋 Test', slayd: '🎞️ Slayd' };
  
  for (const [service, tiers] of Object.entries(prices)) {
    tiers.forEach((t, i) => {
      html += `<tr>
        ${i === 0 ? `<td rowspan="${tiers.length}">${serviceNames[service] || service}</td>` : ''}
        <td>${t.min_count}-${t.max_count} ta/bet</td>
        <td><strong>${t.price.toLocaleString()} so'm</strong></td>
      </tr>`;
    });
  }
  
  table.innerHTML = html;
}

function switchNav(page, btn, service = null) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  
  document.getElementById(`page-${page}`).classList.add('active');
  
  if (btn) btn.classList.add('active');
  else {
    const navItems = document.querySelectorAll('.nav-item');
    const pageMap = { home: 0, order: 1, referral: 2, balance: 3 };
    if (pageMap[page] !== undefined) navItems[pageMap[page]].classList.add('active');
  }
  
  if (service) selectService(service);
}

function selectService(service) {
  currentService = service;
  
  document.querySelectorAll('.service-btn').forEach(b => b.classList.remove('selected'));
  document.getElementById(`btn-${service}`).classList.add('selected');
  
  const config = serviceConfig[service];
  document.getElementById('count-label').textContent = `📊 ${config.label}`;
  document.getElementById('count-unit').textContent = config.unit;
  
  const range = document.getElementById('count-range');
  range.min = config.min;
  range.max = config.max;
  range.value = config.default;
  
  document.getElementById('min-label').textContent = `Min: ${config.min}`;
  document.getElementById('max-label').textContent = `Max: ${config.max}`;
  
  updateCount(config.default);
}

function updateCount(val) {
  const count = parseInt(val);
  document.getElementById('count-display').textContent = count;
  
  const config = serviceConfig[currentService];
  const range = document.querySelector('#count-range');
  const max = parseInt(range.max);
  const min = parseInt(range.min);
  const pct = ((count - min) / (max - min)) * 100;
  document.getElementById('count-progress').style.width = `${pct}%`;
  
  const price = getPrice(currentService, count);
  document.getElementById('price-display').textContent = `${price.toLocaleString()} so'm`;
  document.getElementById('service-price').textContent = `${price.toLocaleString()} so'm`;
  
  updateOrderBalance();
}

function getPrice(service, count) {
  const tiers = prices[service] || [];
  for (const tier of tiers) {
    if (count >= tier.min_count && count <= tier.max_count) {
      return tier.price;
    }
  }
  // Fallback
  const fallbacks = {
    referat: count <= 10 ? 5000 : count <= 20 ? 8000 : 10000,
    test: count <= 20 ? 3000 : count <= 30 ? 5000 : 7000,
    slayd: count <= 10 ? 5000 : 7000
  };
  return fallbacks[service] || 5000;
}

function updateOrderBalance() {
  const count = parseInt(document.getElementById('count-display')?.textContent || '10');
  const price = getPrice(currentService, count);
  const remaining = userData.balance - price;
  
  const remEl = document.getElementById('remaining-balance');
  if (remEl) {
    remEl.textContent = `${remaining.toLocaleString()} so'm`;
    remEl.style.color = remaining >= 0 ? 'var(--success)' : 'var(--danger)';
  }
}

async function placeOrder() {
  const topic = document.getElementById('topic-input').value.trim();
  if (!topic) {
    showToast('⚠️ Mavzuni kiriting!');
    return;
  }
  
  const count = parseInt(document.getElementById('count-display').textContent);
  const price = getPrice(currentService, count);
  
  if (userData.balance < price) {
    showToast('❌ Balansingiz yetarli emas!');
    return;
  }
  
  if (!userData.id) {
    showToast('❌ Foydalanuvchi aniqlanmadi');
    return;
  }
  
  try {
    const res = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: userData.id, service: currentService, topic, count, price })
    });
    
    const data = await res.json();
    
    if (data.success) {
      userData.balance -= price;
      updateUI();
      showToast('✅ Buyurtma qabul qilindi! Bot orqali natijani oling.');
      document.getElementById('topic-input').value = '';
      
      if (tg) {
        tg.sendData(JSON.stringify({ action: 'order', service: currentService, topic, count, price }));
      }
    } else {
      showToast(`❌ ${data.error || 'Xatolik yuz berdi'}`);
    }
  } catch(e) {
    showToast('❌ Server bilan ulanishda xatolik');
  }
}

function copyUserId() {
  const id = userData.id.toString();
  copyToClipboard(`ID: ${id}`);
  showToast('✅ ID nusxalandi!');
}

function copyRefLink() {
  const link = document.getElementById('ref-link')._link;
  if (link) {
    copyToClipboard(link);
    showToast('✅ Havola nusxalandi!');
  }
}

function shareRefLink() {
  const link = document.getElementById('ref-link')._link;
  if (link && tg) {
    tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent('🎓 Student Helper Bot - AI yordamida referat, test va slayd yarating!')}`);
  } else if (link) {
    copyToClipboard(link);
    showToast('✅ Havola nusxalandi!');
  }
}

function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const el = document.createElement('textarea');
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// Initialize
selectService('referat');
fetchPrices();
fetchUserData();

// Refresh every 30 seconds
setInterval(fetchUserData, 30000);
</script>
</body>
</html>
