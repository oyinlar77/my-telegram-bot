FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY bot.py .

ENV BOT_TOKEN=""
ENV GEMINI_API_KEY=""

CMD ["python", "bot.py"]
