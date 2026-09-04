CREATE TABLE IF NOT EXISTS console_task_notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task_id TEXT NOT NULL,
  status TEXT NOT NULL,
  sent_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS console_task_notifications_task
  ON console_task_notifications (task_id, sent_at DESC);
