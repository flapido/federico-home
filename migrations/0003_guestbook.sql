CREATE TABLE IF NOT EXISTS guestbook_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL CHECK(type IN ('guestbook', 'professional_reference')),
  name TEXT NOT NULL,
  relationship TEXT,
  company TEXT,
  linkedin_url TEXT,
  message TEXT NOT NULL,
  publication_consent INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'private', 'rejected')),
  created_at INTEGER NOT NULL,
  approved_at INTEGER,
  published_at INTEGER
);
CREATE INDEX IF NOT EXISTS guestbook_public_entries ON guestbook_entries (status, publication_consent, type, published_at);
CREATE INDEX IF NOT EXISTS guestbook_admin_entries ON guestbook_entries (status, created_at);
