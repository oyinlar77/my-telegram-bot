const { Telegraf, Markup } = require('telegraf');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const express = require('express');

// 1. SOZLAMALAR
const bot = new Telegraf('8083341635:AAHNFcam9UUO6RZXJQ4AyeKlKkDSuGA7DiM');
const genAI = new GoogleGenerativeAI('AIzaSyBGhV5h-pJi9qCSv3m67EcCYC_C0WH1OOU');
const app = express();

// Vaqtinchalik fayllar uchun papka yaratish
const TEMP_DIR = path.join(__dirname, 'temp');
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

// 2. PDF YARATISH FUNKSIYASI (Siz yuborgan kod asosida)
async function generatePDF(content, title, service) {
    return new Promise((resolve, reject) => {
        const filename = `${service}_${Date.now()}.pdf`;
        const filepath = path.join(TEMP_DIR, filename);
        const doc = new PDFDocument({ size: 'A4', margin: 72 });
        const stream = fs.createWriteStream(filepath);
        doc.pipe(stream);

        // Dizayn (Header)
        doc.rect(0, 0, doc.page.width, 80).fill('#1a73e8');
        doc.fillColor('white').fontSize(20).text('Student Helper Bot', 40, 25, { align: 'center' });
        
        doc.moveDown(4);
        doc.fillColor('#1a73e8').fontSize(16).text(title, { align: 'center', underline: true });
        doc.moveDown(2);
        
        // Asosiy matn
        doc.fillColor('#222').fontSize(11).text(content, { align: 'justify', lineGap: 3 });
        
        doc.end();
        stream.on('finish', () => resolve(filepath));
        stream.on('error', reject);
    });
}

// 3. BOT MANTIQI
bot.start((ctx) => {
    ctx.replyWithHTML(`🎓 <b>Student Helper Botga xush kelibsiz!</b>\nID: <code>${ctx.from.id}</code>`, 
    Markup.inlineKeyboard([
        [Markup.button.webApp("🚀 Buyurtma berish", "https://" + process.env.RENDER_EXTERNAL_HOSTNAME)]
    ]));
});

// AI orqali Referat yaratish namunasi
bot.on('text', async (ctx) => {
    const userTopic = ctx.message.text;
    const waitMsg = await ctx.reply("⏳ AI ma'lumot qidirmoqda va PDF tayyorlamoqda...");

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(`${userTopic} haqida batafsil ma'lumot ber.`);
        const text = result.response.text();

        const pdfPath = await generatePDF(text, userTopic, 'referat');
        
        await ctx.replyWithDocument({ source: pdfPath, filename: `${userTopic}.pdf` });
        
        // Faylni o'chirish (tozalash)
        fs.unlinkSync(pdfPath);
    } catch (error) {
        ctx.reply("❌ Xatolik yuz berdi: " + error.message);
    }
});

// 4. RENDER UCHUN SERVER
app.get('/', (req, res) => res.send('Bot is running...'));
app.listen(process.env.PORT || 3000, () => {
    console.log("Server ishga tushdi");
    bot.launch();
});
