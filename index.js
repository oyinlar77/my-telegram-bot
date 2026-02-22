const { Telegraf, Markup } = require('telegraf');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const PDFDocument = require('pdfkit');
const express = require('express');
const fs = require('fs');
const path = require('path');

// 1. SOZLAMALAR
const BOT_TOKEN = '8083341635:AAHNFcam9UUO6RZXJQ4AyeKlKkDSuGA7DiM';
const GEMINI_KEY = 'AIzaSyBGhV5h-pJi9qCSv3m67EcCYC_C0WH1OOU';

const bot = new Telegraf(BOT_TOKEN);
const genAI = new GoogleGenerativeAI(GEMINI_KEY);
const app = express();

const TEMP_DIR = path.join(__dirname, 'temp');
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

// 2. MINI APP INTERFEYSI (HTML kodingizni shu yerga joyladim)
const miniAppHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Helper</title>
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
    <style>
        body { font-family: sans-serif; background: #f4f4f9; padding: 20px; text-align: center; }
        .card { background: white; padding: 20px; border-radius: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); margin-bottom: 20px; }
        .btn { padding: 12px 20px; border: none; border-radius: 8px; color: white; font-weight: bold; cursor: pointer; width: 100%; margin-top: 10px; }
        .btn-primary { background: #1a73e8; }
        .btn-success { background: #34a853; }
        .price-tag { font-size: 20px; color: #1a73e8; font-weight: bold; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="card">
        <h3>📝 Referat / Mustaqil ish</h3>
        <p>Mavzuni kiriting va AI sizga tayyorlab beradi.</p>
        <div class="price-tag" id="price">5,000 so'm</div>
        <input type="text" id="topic" placeholder="Mavzuni yozing..." style="width: 90%; padding: 10px; border-radius: 5px; border: 1px solid #ddd;">
        <button class="btn btn-primary" onclick="order()">Buyurtma berish</button>
    </div>
    <script>
        let tg = window.Telegram.WebApp;
        tg.expand();
        function order() {
            let topic = document.getElementById('topic').value;
            if(!topic) return alert('Mavzuni yozing!');
            tg.sendData(JSON.stringify({type: 'referat', topic: topic}));
            tg.close();
        }
    </script>
</body>
</html>
`;

// 3. PDF YARATISH FUNKSIYASI
async function createPDF(text, title) {
    const filePath = path.join(TEMP_DIR, `doc_${Date.now()}.pdf`);
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filePath));
    doc.fontSize(20).text(title, { align: 'center' }).moveDown();
    doc.fontSize(12).text(text, { align: 'justify' });
    doc.end();
    return filePath;
}

// 4. BOT MANTIQI
bot.start((ctx) => {
    ctx.replyWithHTML(`🎓 <b>Student Helper Botga xush kelibsiz!</b>\nID: <code>${ctx.from.id}</code>`, 
    Markup.inlineKeyboard([
        [Markup.button.webApp("🚀 Buyurtma berish", "https://" + process.env.RENDER_EXTERNAL_HOSTNAME)]
    ]));
});

// Mini Appdan ma'lumot kelganda
bot.on('web_app_data', async (ctx) => {
    const data = JSON.parse(ctx.webAppData.data());
    await ctx.reply(`⏳ "${data.topic}" mavzusida referat tayyorlanmoqda...`);

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(data.topic + " haqida o'zbek tilida referat yoz.");
        const text = result.response.text();

        const pdfFile = await createPDF(text, data.topic);
        await ctx.replyWithDocument({ source: pdfFile, filename: `${data.topic}.pdf` });
        fs.unlinkSync(pdfFile);
    } catch (e) {
        ctx.reply("Xatolik: " + e.message);
    }
});

// 5. SERVERNI ISHGA TUSHIRISH
app.get('/', (req, res) => res.send(miniAppHTML)); // Bu yerda endi interfeys ochiladi
app.listen(process.env.PORT || 3000, () => {
    console.log("Server Live!");
    bot.launch();
});
