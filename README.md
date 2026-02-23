# 🎓 Talabalar Yordamchisi Bot

Telegram bot — referat, slayt, test va mustaqil ish tayyorlaydi.

## Imkoniyatlar
- 📄 **Referat** — tanlangan sahifalar sonida to'liq referat
- 🖥 **Slayt** — slayd matnlari (PowerPoint uchun tayyor)
- 📝 **Test** — A/B/C/D variantli test savollari
- 📚 **Mustaqil ish** — akademik mustaqil ish
- 👥 **Do'st taklif qilish** — referal havola

---

## GitHub + Render orqali deploy

### 1. GitHub'ga yuklash
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SIZNING_USERNAME/student-bot.git
git push -u origin main
```

### 2. Render.com'da deploy
1. [render.com](https://render.com) ga kiring
2. **New → Web Service** bosing
3. GitHub repo'ni ulang
4. Quyidagi sozlamalar:
   - **Environment:** Docker
   - **Region:** Frankfurt (EU)
5. **Environment Variables** bo'limiga qo'shing:
   ```
   BOT_TOKEN = 8394384310:AAH8Wh...
   GEMINI_API_KEY = AIzaSyBGh...
   ```
6. **Deploy** bosing ✅

---

## Lokal ishlatish (Docker bilan)

```bash
cp .env.example .env
# .env faylini to'ldiring

docker-compose up --build -d
```

## Lokal ishlatish (Docker'siz)

```bash
pip install -r requirements.txt
export BOT_TOKEN="..."
export GEMINI_API_KEY="..."
python bot.py
```
