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
    """Возвращает видео авторов, на которых подписан пользователь. GET с заголовком X-Auth-Token"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token', 'Access-Control-Max-Age': '86400'}, 'body': ''}

    token = event.get('headers', {}).get('X-Auth-Token') or event.get('headers', {}).get('x-auth-token')
    if not token:
        return {'statusCode': 401, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Нужна авторизация'})}

    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    user_id = get_user_by_token(cur, schema, token)
    if not user_id:
        cur.close(); conn.close()
        return {'statusCode': 401, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Сессия истекла'})}

    cur.execute(f"""
        SELECT
            v.id, v.title, v.hashtags, v.preview_url, v.video_url, v.views, v.likes, v.created_at,
            u.id as author_id, u.username, u.first_name,
            EXISTS(
                SELECT 1 FROM {schema}.video_likes vl
                WHERE vl.video_id = v.id AND vl.user_id = {user_id}
            ) as is_liked
        FROM {schema}.videos v
        JOIN {schema}.users u ON u.id = v.user_id
        JOIN {schema}.subscriptions s ON s.author_id = v.user_id
        WHERE s.follower_id = {user_id} AND s.active = TRUE
        ORDER BY v.created_at DESC
        LIMIT 50
    """)

    rows = cur.fetchall()
    cur.close()
    conn.close()

    videos = []
    for row in rows:
        hashtags = row[2].split(',') if row[2] else []
        videos.append({
            'id': row[0],
            'title': row[1],
            'hashtags': hashtags,
            'preview_url': row[3],
            'video_url': row[4],
            'views': row[5],
            'likes': row[6],
            'created_at': row[7].isoformat() if row[7] else None,
            'author_id': row[8],
            'author_username': row[9],
            'author_name': row[10],
            'is_liked': row[11],
        })

    return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'videos': videos})}
