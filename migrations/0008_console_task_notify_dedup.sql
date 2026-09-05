-- Do not apply remotely as part of local stabilization. Existing notification
-- rows are historical successful sends; only new opaque keys participate.
ALTER TABLE console_task_notifications ADD COLUMN idempotency_key TEXT;
ALTER TABLE console_task_notifications ADD COLUMN delivery_state TEXT NOT NULL DEFAULT 'sent';
ALTER TABLE console_task_notifications ADD COLUMN attempt_count INTEGER NOT NULL DEFAULT 1;

CREATE UNIQUE INDEX IF NOT EXISTS console_task_notifications_idempotency_key
  ON console_task_notifications (idempotency_key)
  WHERE idempotency_key IS NOT NULL;
