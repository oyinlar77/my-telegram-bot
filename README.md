# 🎓 Student Helper Bot

Talabalar uchun AI yordamchi Telegram bot. Referat, test va slaydlarni avtomatik yaratadi.

## ✨ Funksiyalar

- 📝 **Referat/Mustaqil ish** — AI yordamida PDF formatda
- 📋 **Test savollari** — AI yordamida PDF formatda  
- 🎞️ **Slayd kontent** — Prezentatsiya matni
- 💰 **Balans tizimi** — To'ldirish, sarflash
- 👥 **Referal tizimi** — Har 10 ta do'st = +4,000 so'm bonus
- 🎁 **Yangi foydalanuvchi bonusi** — 5,000 so'm
- ⚙️ **Admin panel** — Statistika, narx boshqaruvi, balans to'ldirish
- 🌐 **Web App** — Inline interfeys

## 🚀 O'rnatish

### Talab qilinadigan dasturlar
- Node.js 18+
- npm yoki yarn

### 1. Loyihani yuklab oling
```bash
git clone <repo-url>
cd telegram-bot
```

### 2. Kutubxonalarni o'rnating
```bash
npm install
```

### 3. .env faylini sozlang
```bash
cp .env.example .env
nano .env
```

`.env` faylida quyidagilarni to'ldiring:
```env
BOT_TOKEN=8083341635:AAHNFcam9UUO6RZXJQ4AyeKlKkDSuGA7DiM
GEMINI_API_KEY=AIzaSyBGhV5h-pJi9qCSv3m67EcCYC_C0WH1OOU
PORT=3000
WEB_APP_URL=https://sizning-domeningiz.com
ADMIN_IDS=sizning_telegram_id
```

### 4. TypeScript build
```bash
npm run build
```

### 5. Ishga tushirish
```bash
npm start
```

## 🐳 Docker orqali ishga tushirish

```bash
docker-compose up -d
```

## ⚙️ Bot sozlamalari

### @BotFather orqali Web App ulash
1. `/mybots` → Botingizni tanlang → `Bot Settings` → `Menu Button`
2. URL: `https://sizning-domeningiz.com`
3. Title: `🎓 Web App`

### Webhook sozlash (ixtiyoriy)
```env
WEBHOOK_URL=https://sizning-domeningiz.com/webhook
```

## 💰 Narxlar tizimi

| Xizmat | Hajm | Narx |
|--------|------|------|
| 📝 Referat | 1-10 sahifa | 5,000 so'm |
| 📝 Referat | 11-20 sahifa | 8,000 so'm |
| 📝 Referat | 21-25 sahifa | 10,000 so'm |
| 📋 Test | 10-20 savol | 3,000 so'm |
| 📋 Test | 21-30 savol | 5,000 so'm |
| 📋 Test | 31-40 savol | 7,000 so'm |
| 🎞️ Slayd | 1-10 ta | 5,000 so'm |
| 🎞️ Slayd | 11-15 ta | 7,000 so'm |

## 👥 Referal tizimi

- Har bir yangi foydalanuvchi **5,000 so'm** bonus oladi
- Har 10 ta do'st taklif qilgan foydalanuvchiga **+4,000 so'm** bonus
- Referal havola: `https://t.me/BotUsername?start=USER_ID`

## 🔑 Admin buyruqlari

```
/admin — Admin panelini ochish
```

Admin panelida:
- 📊 Statistika ko'rish
- 💰 Foydalanuvchi balansini to'ldirish
- ⚙️ Narxlarni o'zgartirish

## 📁 Loyiha tuzilmasi

```
telegram-bot/
├── src/
│   ├── index.ts        # Asosiy bot va server
│   ├── database.ts     # SQLite ma'lumotlar bazasi
│   ├── gemini.ts       # Gemini AI integratsiya
│   ├── pdfGenerator.ts # PDF yaratish
│   └── webapp/
│       └── index.html  # Web App interfeysi
├── data/               # SQLite DB fayli
├── temp/               # Vaqtinchalik PDF fayllar
├── .env                # Sozlamalar
├── package.json
├── tsconfig.json
├── Dockerfile
└── docker-compose.yml
```

## 🛠️ Texnik ma'lumotlar

- **Bot framework**: Telegraf v4
- **AI**: Google Gemini 1.5 Flash
- **Database**: SQLite (better-sqlite3)
- **PDF**: pdfkit
- **Server**: Express.js
- **Language**: TypeScript/Node.js

## 🔧 24/7 Ishlash uchun

### PM2 bilan (tavsiya etiladi)
```bash
npm install -g pm2
npm run build
pm2 start dist/index.js --name "student-bot"
pm2 save
pm2 startup
```

### Keep-alive sozlash
`.env` faylida:
```env
KEEP_ALIVE_URL=https://sizning-domeningiz.com
```

## 🆘 Muammolar

**Bot javob bermayapti?**
- Bot token to'g'riligini tekshiring
- Internet ulanishini tekshiring

**AI xato bermoqda?**
- Gemini API kalitini tekshiring
- API limitini tekshiring

**PDF yuklanmayapti?**
- `temp/` papkasi mavjudligini tekshiring
- pdfkit o'rnatilganini tekshiring
