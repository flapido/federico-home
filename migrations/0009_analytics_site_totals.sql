CREATE TABLE IF NOT EXISTS analytics_site_totals (
  key TEXT PRIMARY KEY,
  value INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL
);

-- Initialize visit_total from existing analytics_event_totals
INSERT INTO analytics_site_totals (key, value, updated_at)
SELECT 'visit_total', COALESCE(SUM(count), 0), datetime('now')
FROM analytics_event_totals
WHERE event_type = 'visit'
ON CONFLICT(key) DO UPDATE SET
  value = excluded.value,
  updated_at = excluded.updated_at;