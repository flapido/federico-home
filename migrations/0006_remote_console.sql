CREATE TABLE IF NOT EXISTS console_heartbeats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts INTEGER NOT NULL,
  pc_id TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'unknown',
  django TEXT NOT NULL DEFAULT 'unknown',
  agent_console TEXT NOT NULL DEFAULT 'unknown',
  bridge TEXT NOT NULL DEFAULT 'unknown',
  received_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS console_heartbeats_pc_recent
  ON console_heartbeats (pc_id, received_at DESC);

CREATE TABLE IF NOT EXISTS console_otp_codes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  used_at INTEGER
);

CREATE INDEX IF NOT EXISTS console_otp_active
  ON console_otp_codes (used_at, expires_at, created_at);

CREATE TABLE IF NOT EXISTS console_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token_hash TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  revoked_at INTEGER
);

CREATE INDEX IF NOT EXISTS console_sessions_active
  ON console_sessions (token_hash, revoked_at, expires_at);
