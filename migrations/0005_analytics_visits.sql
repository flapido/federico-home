CREATE TABLE IF NOT EXISTS analytics_visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at INTEGER NOT NULL,
  day TEXT NOT NULL,
  event_type TEXT NOT NULL,
  path TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  region TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  referrer TEXT NOT NULL DEFAULT '',
  user_agent_hash TEXT NOT NULL DEFAULT '',
  visitor_hash TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS analytics_visits_day
  ON analytics_visits (day);

CREATE INDEX IF NOT EXISTS analytics_visits_visitor_day
  ON analytics_visits (visitor_hash, day);
