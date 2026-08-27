ALTER TABLE guestbook_entries ADD COLUMN moderation TEXT NOT NULL DEFAULT 'clean' CHECK(moderation IN ('clean','review','blocked'));
ALTER TABLE guestbook_entries ADD COLUMN moderation_reason TEXT;
