import json
import os
import random
import string
import requests
import psycopg2
from datetime import datetime, timedelta

def handler(event: dict, context) -> dict:
    """Отправляет код подтверждения в Telegram по username пользователя"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400'}, 'body': ''}

    raw_body = event.get('body') or '{}'
    body = json.loads(raw_body) if raw_body.strip() else {}
    username = body.get('username', '').strip().lstrip('@')

    if not username:
        return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Укажи username'})}

    bot_token = os.environ['TELEGRAM_BOT_TOKEN']

    # Получаем chat_id по username через getUpdates или sendMessage
    # Пробуем отправить сообщение пользователю
    code = ''.join(random.choices(string.digits, k=6))

    # Сначала узнаём chat_id через поиск в updates
    updates_url = f"https://api.telegram.org/bot{bot_token}/getUpdates"
    updates_resp = requests.get(updates_url, timeout=10)
    updates_data = updates_resp.json()

    telegram_id = None
    if updates_data.get('ok'):
        for update in updates_data.get('result', []):
            msg = update.get('message') or update.get('callback_query', {}).get('message')
            if msg:
                user = msg.get('from', {})
                uname = user.get('username', '')
                if uname and uname.lower() == username.lower():
                    telegram_id = user['id']
                    break

    if not telegram_id:
        return {'statusCode': 404, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Пользователь не найден. Сначала напиши /start боту @sategg_bot'})}

    # Отправляем код
    send_url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    send_resp = requests.post(send_url, json={
        'chat_id': telegram_id,
        'text': f'🔐 Твой код для входа на сайт: <b>{code}</b>\n\nКод действителен 10 минут.',
        'parse_mode': 'HTML'
    }, timeout=10)

    if not send_resp.json().get('ok'):
        return {'statusCode': 500, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Не удалось отправить код'})}

    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    expires_at = datetime.utcnow() + timedelta(minutes=10)
    cur.execute(f"DELETE FROM {schema}.auth_codes WHERE telegram_id = {telegram_id}")
    cur.execute(f"INSERT INTO {schema}.auth_codes (telegram_id, code, expires_at) VALUES ({telegram_id}, '{code}', '{expires_at}')")
    conn.commit()
    cur.close()
    conn.close()

    return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'ok': True, 'telegram_id': telegram_id})}