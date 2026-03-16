import json
import os
import psycopg2

def get_user_by_token(cur, schema, token):
    cur.execute(f"""
        SELECT u.id FROM {schema}.sessions s
        JOIN {schema}.users u ON u.id = s.user_id
        WHERE s.token = '{token}' AND s.expires_at > NOW()
        LIMIT 1
    """)
    row = cur.fetchone()
    return row[0] if row else None

def handler(event: dict, context) -> dict:
    """Подписаться или отписаться от автора. POST body: {author_id, action: 'subscribe'|'unsubscribe'}"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token', 'Access-Control-Max-Age': '86400'}, 'body': ''}

    token = event.get('headers', {}).get('X-Auth-Token') or event.get('headers', {}).get('x-auth-token')
    if not token:
        return {'statusCode': 401, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Нужна авторизация'})}

    raw_body = event.get('body') or '{}'
    body = json.loads(raw_body) if raw_body.strip() else {}
    author_id = body.get('author_id')
    action = body.get('action', 'subscribe')

    if not author_id:
        return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Нет author_id'})}

    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    user_id = get_user_by_token(cur, schema, token)
    if not user_id:
        cur.close(); conn.close()
        return {'statusCode': 401, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Сессия истекла'})}

    if user_id == int(author_id):
        cur.close(); conn.close()
        return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Нельзя подписаться на себя'})}

    active = True if action == 'subscribe' else False

    cur.execute(f"""
        INSERT INTO {schema}.subscriptions (follower_id, author_id, active)
        VALUES ({user_id}, {author_id}, {active})
        ON CONFLICT (follower_id, author_id)
        DO UPDATE SET active = {active}, created_at = NOW()
    """)

    conn.commit()
    cur.close()
    conn.close()

    return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'ok': True, 'action': action, 'subscribed': active})}