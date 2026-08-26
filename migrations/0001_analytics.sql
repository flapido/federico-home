CREATE TABLE IF NOT EXISTS analytics_event_totals (
  day TEXT NOT NULL,
  event_type TEXT NOT NULL,
  path TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT '',
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, event_type, path, source)
);

CREATE INDEX IF NOT EXISTS analytics_event_totals_event_day
  ON analytics_event_totals (event_type, day);

CREATE INDEX IF NOT EXISTS analytics_event_totals_path_day
  ON analytics_event_totals (path, day);
