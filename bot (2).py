import os
import logging
from aiohttp import web
from telegram import (
    Update, InlineKeyboardButton, InlineKeyboardMarkup
)
from telegram.ext import (
    Application, CommandHandler, MessageHandler, CallbackQueryHandler,
    ContextTypes, filters, ConversationHandler
)
from google import generativeai as genai

# ─── Logging ────────────────────────────────────────────────────────────────
logging.basicConfig(
    format="%(asctime)s | %(levelname)s | %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger(__name__)

# ─── Config ─────────────────────────────────────────────────────────────────
BOT_TOKEN  = os.getenv("BOT_TOKEN",      "8394384310:AAH8WhOnesqgjK9vXig5battHKvnEDGZxrI")
GEMINI_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyBGhV5h-pJi9qCSv3m67EcCYC_C0WH1OOU")
WEBHOOK_URL = os.getenv("WEBHOOK_URL", "")   # Render'da to'ldirish shart!
PORT        = int(os.getenv("PORT", "10000"))

genai.configure(api_key=GEMINI_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

# ─── States ─────────────────────────────────────────────────────────────────
(
    MAIN_MENU,
    ASK_TOPIC,
    ASK_PAGES,
    ASK_SLIDES,
    ASK_COUNT,      # test uchun savollar soni
    GENERATING,
) = range(6)

WORK_TYPE = "work_type"  # context.user_data key


# ─── Keyboards ──────────────────────────────────────────────────────────────
def main_keyboard():
    buttons = [
        [
            InlineKeyboardButton("📄 Referat",        callback_data="referat"),
            InlineKeyboardButton("🖥 Slayt",           callback_data="slayt"),
        ],
        [
            InlineKeyboardButton("📝 Test",            callback_data="test"),
            InlineKeyboardButton("📚 Mustaqil ish",    callback_data="mustaqil"),
        ],
        [
            InlineKeyboardButton("👥 Do'st taklif qilish", callback_data="invite"),
        ],
    ]
    return InlineKeyboardMarkup(buttons)


def pages_keyboard(work_type: str):
    """Sahifalar / slaydlar soni tugmalari."""
    if work_type in ("referat", "mustaqil"):
        options = ["5", "10", "15", "20", "25", "30"]
        label = "sahifa"
    else:
        options = ["5", "10", "15", "20", "25", "30"]
        label = "slayd"
    buttons = [
        [InlineKeyboardButton(f"{o} {label}", callback_data=f"pages_{o}") for o in options[i:i+3]]
        for i in range(0, len(options), 3)
    ]
    buttons.append([InlineKeyboardButton("🔙 Orqaga", callback_data="back_main")])
    return InlineKeyboardMarkup(buttons)


def test_count_keyboard():
    options = ["10", "15", "20", "25", "30", "50"]
    buttons = [
        [InlineKeyboardButton(f"{o} ta savol", callback_data=f"count_{o}") for o in options[i:i+3]]
        for i in range(0, len(options), 3)
    ]
    buttons.append([InlineKeyboardButton("🔙 Orqaga", callback_data="back_main")])
    return InlineKeyboardMarkup(buttons)


# ─── Gemini helper ───────────────────────────────────────────────────────────
async def generate_content(prompt: str) -> str:
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        logger.error(f"Gemini xatosi: {e}")
        return "⚠️ AI javob berishda xatolik yuz berdi. Iltimos qaytadan urinib ko'ring."


# ─── Prompts ─────────────────────────────────────────────────────────────────
def build_prompt(work_type: str, topic: str, count: int) -> str:
    if work_type == "referat":
        return (
            f"O'zbek tilida '{topic}' mavzusida {count} sahifalik akademik referat yoz. "
            f"Kirish, asosiy qism (kamida 3 bo'lim), xulosa va foydalanilgan adabiyotlar bo'limi bo'lsin. "
            f"Har bo'lim sarlavhali, mazmunli va to'liq bo'lsin."
        )
    elif work_type == "slayt":
        return (
            f"O'zbek tilida '{topic}' mavzusida {count} ta slayd uchun tarkib tayyorla. "
            f"Har slayd: [SLAYD N - Sarlavha] ko'rinishida boshlansin va qisqa, aniq nuqtalar bo'lsin. "
            f"Birinchi slayd kirish, oxirgi slayd xulosa bo'lsin."
        )
    elif work_type == "test":
        return (
            f"O'zbek tilida '{topic}' mavzusida {count} ta test savoli tuzib ber. "
            f"Har savol: raqam, savol matni, A/B/C/D variantlar va to'g'ri javob belgisi bo'lsin. "
            f"Format: \n1. Savol matni?\nA) ...\nB) ...\nC) ...\nD) ...\n✅ To'g'ri javob: A) ...\n"
        )
    elif work_type == "mustaqil":
        return (
            f"O'zbek tilida '{topic}' mavzusida {count} sahifalik mustaqil ish yoz. "
            f"Reja: Kirish, mavzuning dolzarbligi, asosiy tahlil (3-4 bo'lim), xulosa, tavsiyalar, adabiyotlar. "
            f"Akademik uslubda, ilmiy jihatdan to'liq bo'lsin."
        )
    return f"'{topic}' haqida ma'lumot ber."


# ─── Handlers ────────────────────────────────────────────────────────────────
async def start(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    text = (
        f"👋 Assalomu alaykum, <b>{user.first_name}</b>!\n\n"
        "🎓 <b>Talabalar yordamchisi botiga xush kelibsiz!</b>\n\n"
        "Men sizga quyidagilarni tayyorlab beraman:\n"
        "📄 Referat  |  🖥 Slayt  |  📝 Test  |  📚 Mustaqil ish\n\n"
        "Quyidagi tugmalardan birini tanlang 👇"
    )
    await update.message.reply_text(text, parse_mode="HTML", reply_markup=main_keyboard())
    return MAIN_MENU


async def main_menu_callback(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    data = query.data

    if data == "back_main":
        await query.edit_message_text(
            "🏠 Asosiy menyu — quyidan tanlang:",
            reply_markup=main_keyboard()
        )
        return MAIN_MENU

    if data == "invite":
        bot_username = (await ctx.bot.get_me()).username
        link = f"https://t.me/{bot_username}"
        await query.edit_message_text(
            f"👥 <b>Do'stlaringizni taklif qiling!</b>\n\n"
            f"Havolani ulashing:\n{link}\n\n"
            f"Botni ular ham ishlatib ko'rsin 🎓",
            parse_mode="HTML",
            reply_markup=InlineKeyboardMarkup([
                [InlineKeyboardButton("🔙 Orqaga", callback_data="back_main")]
            ])
        )
        return MAIN_MENU

    # Ish turi tanlandi
    work_labels = {
        "referat": "📄 Referat",
        "slayt": "🖥 Slayt",
        "test": "📝 Test",
        "mustaqil": "📚 Mustaqil ish",
    }
    ctx.user_data[WORK_TYPE] = data

    await query.edit_message_text(
        f"{work_labels[data]} tanlandi!\n\n"
        f"✏️ <b>Mavzu nomini kiriting:</b>\n"
        f"(Masalan: Iqtisodiyotda raqamlashtirish, Fotosintez, Sun'iy intellekt...)",
        parse_mode="HTML",
        reply_markup=InlineKeyboardMarkup([
            [InlineKeyboardButton("🔙 Orqaga", callback_data="back_main")]
        ])
    )
    return ASK_TOPIC


async def got_topic(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    topic = update.message.text.strip()
    if len(topic) < 3:
        await update.message.reply_text("⚠️ Mavzu juda qisqa. Iltimos to'liqroq yozing.")
        return ASK_TOPIC

    ctx.user_data["topic"] = topic
    work_type = ctx.user_data.get(WORK_TYPE, "referat")

    if work_type == "test":
        await update.message.reply_text(
            f"📝 Mavzu: <b>{topic}</b>\n\n"
            f"Nechta savol kerak?",
            parse_mode="HTML",
            reply_markup=test_count_keyboard()
        )
        return ASK_COUNT
    else:
        label = "slayd" if work_type == "slayt" else "sahifa"
        await update.message.reply_text(
            f"📌 Mavzu: <b>{topic}</b>\n\n"
            f"Nechta {label} kerak?",
            parse_mode="HTML",
            reply_markup=pages_keyboard(work_type)
        )
        return ASK_PAGES


async def got_pages(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    data = query.data

    if data == "back_main":
        await query.edit_message_text("🏠 Asosiy menyu:", reply_markup=main_keyboard())
        return MAIN_MENU

    count = int(data.split("_")[1])
    ctx.user_data["count"] = count

    await _generate_and_send(query, ctx)
    return MAIN_MENU


async def got_test_count(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    data = query.data

    if data == "back_main":
        await query.edit_message_text("🏠 Asosiy menyu:", reply_markup=main_keyboard())
        return MAIN_MENU

    count = int(data.split("_")[1])
    ctx.user_data["count"] = count

    await _generate_and_send(query, ctx)
    return MAIN_MENU


async def _generate_and_send(query, ctx: ContextTypes.DEFAULT_TYPE):
    work_type = ctx.user_data.get(WORK_TYPE, "referat")
    topic = ctx.user_data.get("topic", "")
    count = ctx.user_data.get("count", 10)

    labels = {
        "referat": "📄 Referat",
        "slayt": "🖥 Slayt",
        "test": "📝 Test",
        "mustaqil": "📚 Mustaqil ish",
    }

    await query.edit_message_text(
        f"⏳ <b>{labels[work_type]} tayyorlanmoqda...</b>\n\n"
        f"📌 Mavzu: {topic}\n"
        f"📊 Hajm: {count}\n\n"
        f"Bu biroz vaqt olishi mumkin, kuting...",
        parse_mode="HTML"
    )

    prompt = build_prompt(work_type, topic, count)
    result = await generate_content(prompt)

    # Telegram 4096 belgi limiti — bo'lib yuborish
    chunks = [result[i:i+4000] for i in range(0, len(result), 4000)]

    back_btn = InlineKeyboardMarkup([
        [InlineKeyboardButton("🏠 Asosiy menyu", callback_data="back_main_msg")]
    ])

    await query.message.reply_text(
        f"✅ <b>{labels[work_type]} tayyor!</b>\n"
        f"📌 Mavzu: <b>{topic}</b>  |  Hajm: {count}\n"
        f"{'─'*30}",
        parse_mode="HTML"
    )

    for i, chunk in enumerate(chunks):
        if i == len(chunks) - 1:
            await query.message.reply_text(chunk, reply_markup=back_btn)
        else:
            await query.message.reply_text(chunk)


async def back_main_msg(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    await query.message.reply_text(
        "🏠 Asosiy menyu — yangi ish tanlang:",
        reply_markup=main_keyboard()
    )
    return MAIN_MENU


async def help_cmd(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "ℹ️ <b>Botdan foydalanish:</b>\n\n"
        "1️⃣ /start — boshlash\n"
        "2️⃣ Ish turini tanlang (Referat, Slayt, Test, Mustaqil)\n"
        "3️⃣ Mavzu nomini yozing\n"
        "4️⃣ Hajmni tanlang\n"
        "5️⃣ AI tayyorlaydi ✅\n\n"
        "🔁 Yangi ish: /start",
        parse_mode="HTML"
    )


# ─── Main ────────────────────────────────────────────────────────────────────
def build_app() -> Application:
    app = Application.builder().token(BOT_TOKEN).build()

    conv = ConversationHandler(
        entry_points=[CommandHandler("start", start)],
        states={
            MAIN_MENU: [
                CallbackQueryHandler(main_menu_callback),
                CallbackQueryHandler(back_main_msg, pattern="^back_main_msg$"),
            ],
            ASK_TOPIC: [
                MessageHandler(filters.TEXT & ~filters.COMMAND, got_topic),
                CallbackQueryHandler(main_menu_callback, pattern="^back_main$"),
            ],
            ASK_PAGES: [
                CallbackQueryHandler(got_pages),
            ],
            ASK_COUNT: [
                CallbackQueryHandler(got_test_count),
            ],
        },
        fallbacks=[
            CommandHandler("start", start),
            CommandHandler("help", help_cmd),
        ],
        per_message=False,
    )

    app.add_handler(conv)
    app.add_handler(CommandHandler("help", help_cmd))
    app.add_handler(CallbackQueryHandler(back_main_msg, pattern="^back_main_msg$"))
    return app


async def main():
    application = build_app()

    if WEBHOOK_URL:
        # ── WEBHOOK rejimi (Render uchun) ──────────────────────────────────
        webhook_path = f"/webhook/{BOT_TOKEN}"
        full_webhook = f"{WEBHOOK_URL}{webhook_path}"

        await application.initialize()
        await application.bot.set_webhook(full_webhook)
        await application.start()

        # aiohttp bilan oddiy HTTP server
        async def handle_update(request: web.Request) -> web.Response:
            data = await request.json()
            update = Update.de_json(data, application.bot)
            await application.process_update(update)
            return web.Response(text="OK")

        async def health(request: web.Request) -> web.Response:
            return web.Response(text="Bot ishlayapti ✅")

        web_app = web.Application()
        web_app.router.add_post(webhook_path, handle_update)
        web_app.router.add_get("/", health)

        runner = web.AppRunner(web_app)
        await runner.setup()
        site = web.TCPSite(runner, "0.0.0.0", PORT)
        await site.start()

        logger.info(f"Webhook rejimi: {full_webhook}  |  Port: {PORT} ✅")

        # To'xtatilgunga qadar ishlaydi
        import asyncio
        await asyncio.Event().wait()
    else:
        # ── POLLING rejimi (lokal test uchun) ─────────────────────────────
        logger.info("Polling rejimi (lokal) ✅")
        await application.run_polling(drop_pending_updates=True)


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
