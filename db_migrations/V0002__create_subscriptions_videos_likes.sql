CREATE TABLE IF NOT EXISTS t_p15159916_data_analysis_enhanc.subscriptions (
    id SERIAL PRIMARY KEY,
    follower_id INTEGER NOT NULL REFERENCES t_p15159916_data_analysis_enhanc.users(id),
    author_id INTEGER NOT NULL REFERENCES t_p15159916_data_analysis_enhanc.users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(follower_id, author_id)
);

CREATE TABLE IF NOT EXISTS t_p15159916_data_analysis_enhanc.videos (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES t_p15159916_data_analysis_enhanc.users(id),
    title VARCHAR(500) NOT NULL,
    hashtags TEXT,
    preview_url TEXT,
    video_url TEXT,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p15159916_data_analysis_enhanc.video_likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES t_p15159916_data_analysis_enhanc.users(id),
    video_id INTEGER NOT NULL REFERENCES t_p15159916_data_analysis_enhanc.videos(id),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, video_id)
);