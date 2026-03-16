CREATE TABLE IF NOT EXISTS t_p15159916_data_analysis_enhanc.users (
    id SERIAL PRIMARY KEY,
    telegram_id BIGINT UNIQUE,
    username VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p15159916_data_analysis_enhanc.auth_codes (
    id SERIAL PRIMARY KEY,
    telegram_id BIGINT NOT NULL,
    code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p15159916_data_analysis_enhanc.sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES t_p15159916_data_analysis_enhanc.users(id),
    token VARCHAR(64) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '30 days'
);