import json
import os
import secrets
import psycopg2
from datetime import datetime

def handler(event: dict, context) -> dict:
    """Проверяет код из Telegram и создаёт сессию пользователя"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400'}, 'body': ''}

    raw_body = event.get('body') or '{}'
    body = json.loads(raw_body) if raw_body.strip() else {}
    telegram_id = body.get('telegram_id')
    code = body.get('code', '').strip()

    if not telegram_id or not code:
        return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Нет telegram_id или кода'})}

    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    cur.execute(f"SELECT id, code, expires_at, used FROM {schema}.auth_codes WHERE telegram_id = {telegram_id} ORDER BY created_at DESC LIMIT 1")
    row = cur.fetchone()

    if not row:
        cur.close(); conn.close()
        return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Код не найден. Запроси новый'})}

    code_id, saved_code, expires_at, used = row

    if used:
        cur.close(); conn.close()
        return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Код уже использован'})}

    if datetime.utcnow() > expires_at:
        cur.close(); conn.close()
        return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Код устарел. Запроси новый'})}

    if code != saved_code:
        cur.close(); conn.close()
        return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Неверный код'})}

    cur.execute(f"UPDATE {schema}.auth_codes SET used = TRUE WHERE id = {code_id}")

    cur.execute(f"SELECT id, username, first_name FROM {schema}.users WHERE telegram_id = {telegram_id}")
    user_row = cur.fetchone()

    if not user_row:
        cur.execute(f"INSERT INTO {schema}.users (telegram_id) VALUES ({telegram_id}) RETURNING id, username, first_name")
        user_row = cur.fetchone()

    user_id, username, first_name = user_row
    session_token = secrets.token_hex(32)

    cur.execute(f"INSERT INTO {schema}.sessions (user_id, token) VALUES ({user_id}, '{session_token}')")
    conn.commit()
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'ok': True,
            'token': session_token,
            'user': {'id': user_id, 'username': username, 'first_name': first_name, 'telegram_id': telegram_id}
        })
    }