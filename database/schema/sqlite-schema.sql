CREATE TABLE IF NOT EXISTS "migrations"(
  "id" integer primary key autoincrement not null,
  "migration" varchar not null,
  "batch" integer not null
);
CREATE TABLE IF NOT EXISTS "users"(
  "id" integer primary key autoincrement not null,
  "name" varchar not null,
  "email" varchar not null,
  "avatar" varchar,
  "password" varchar,
  "provider_name" varchar,
  "provider_id" varchar,
  "receive_notifications" tinyint(1) not null default '0',
  "email_verified_at" datetime,
  "remember_token" varchar,
  "created_at" datetime,
  "updated_at" datetime
);
CREATE UNIQUE INDEX "users_email_unique" on "users"("email");
CREATE TABLE IF NOT EXISTS "password_reset_tokens"(
  "email" varchar not null,
  "token" varchar not null,
  "created_at" datetime,
  primary key("email")
);
CREATE TABLE IF NOT EXISTS "sessions"(
  "id" varchar not null,
  "user_id" integer,
  "ip_address" varchar,
  "user_agent" text,
  "payload" text not null,
  "last_activity" integer not null,
  primary key("id")
);
CREATE INDEX "sessions_user_id_index" on "sessions"("user_id");
CREATE INDEX "sessions_last_activity_index" on "sessions"("last_activity");
CREATE TABLE IF NOT EXISTS "cache"(
  "key" varchar not null,
  "value" text not null,
  "expiration" integer not null,
  primary key("key")
);
CREATE INDEX "cache_expiration_index" on "cache"("expiration");
CREATE TABLE IF NOT EXISTS "cache_locks"(
  "key" varchar not null,
  "owner" varchar not null,
  "expiration" integer not null,
  primary key("key")
);
CREATE INDEX "cache_locks_expiration_index" on "cache_locks"("expiration");
CREATE TABLE IF NOT EXISTS "jobs"(
  "id" integer primary key autoincrement not null,
  "queue" varchar not null,
  "payload" text not null,
  "attempts" integer not null,
  "reserved_at" integer,
  "available_at" integer not null,
  "created_at" integer not null
);
CREATE INDEX "jobs_queue_reserved_at_available_at_index" on "jobs"(
  "queue",
  "reserved_at",
  "available_at"
);
CREATE TABLE IF NOT EXISTS "job_batches"(
  "id" varchar not null,
  "name" varchar not null,
  "total_jobs" integer not null,
  "pending_jobs" integer not null,
  "failed_jobs" integer not null,
  "failed_job_ids" text not null,
  "options" text,
  "cancelled_at" integer,
  "created_at" integer not null,
  "finished_at" integer,
  primary key("id")
);
CREATE TABLE IF NOT EXISTS "failed_jobs"(
  "id" integer primary key autoincrement not null,
  "uuid" varchar not null,
  "connection" text not null,
  "queue" text not null,
  "payload" text not null,
  "exception" text not null,
  "failed_at" datetime not null default CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "failed_jobs_uuid_unique" on "failed_jobs"("uuid");
CREATE TABLE IF NOT EXISTS "tasks"(
  "id" integer primary key autoincrement not null,
  "title" varchar not null,
  "description" varchar,
  "user_id" integer not null,
  "priority" varchar check("priority" in('low', 'medium', 'high')) not null,
  "category" varchar check("category" in('general', 'work', 'personal', 'meeting', 'study', 'health', 'household', 'career', 'family', 'finance')) not null,
  "reminder" varchar check("reminder" in('no_reminder', 'fifteen_minutes_before', 'thirty_minutes_before', 'one_hour_before')) not null,
  "recurrence_type" varchar check("recurrence_type" in('daily', 'weekly', 'monthly')),
  "recurrence_value" varchar,
  "renew_date" date,
  "google_calendar_event_id" varchar,
  "created_at" datetime,
  "updated_at" datetime,
  foreign key("user_id") references "users"("id") on delete cascade
);
CREATE TABLE IF NOT EXISTS "recurrences"(
  "id" integer primary key autoincrement not null,
  "task_id" integer not null,
  "start_date" datetime not null,
  "end_date" datetime not null,
  "completed_at" datetime,
  "reminder_at" datetime,
  "created_at" datetime,
  "updated_at" datetime,
  foreign key("task_id") references "tasks"("id") on delete cascade
);
CREATE TABLE IF NOT EXISTS "notifications"(
  "id" varchar not null,
  "type" varchar not null,
  "notifiable_type" varchar not null,
  "notifiable_id" integer not null,
  "data" text not null,
  "read_at" datetime,
  "created_at" datetime,
  "updated_at" datetime,
  primary key("id")
);
CREATE INDEX "notifications_notifiable_type_notifiable_id_index" on "notifications"(
  "notifiable_type",
  "notifiable_id"
);
CREATE TABLE IF NOT EXISTS "push_subscriptions"(
  "id" integer primary key autoincrement not null,
  "subscribable_type" varchar not null,
  "subscribable_id" integer not null,
  "endpoint" varchar not null,
  "public_key" varchar,
  "auth_token" varchar,
  "content_encoding" varchar,
  "created_at" datetime,
  "updated_at" datetime
);
CREATE INDEX "push_subscriptions_subscribable_morph_idx" on "push_subscriptions"(
  "subscribable_type",
  "subscribable_id"
);
CREATE UNIQUE INDEX "push_subscriptions_endpoint_unique" on "push_subscriptions"(
  "endpoint"
);
CREATE TABLE IF NOT EXISTS "recurrence_checklist_items"(
  "id" integer primary key autoincrement not null,
  "recurrence_id" integer not null,
  "description" varchar not null,
  "completed" tinyint(1) not null default '0',
  "order" integer not null default '0',
  "created_at" datetime,
  "updated_at" datetime,
  foreign key("recurrence_id") references "recurrences"("id") on delete cascade
);
CREATE TABLE IF NOT EXISTS "achievements"(
  "id" integer primary key autoincrement not null,
  "slug" varchar not null,
  "title" varchar not null,
  "description" text,
  "image" varchar not null,
  "subtitle" varchar,
  "condition" text,
  "created_at" datetime,
  "updated_at" datetime
);
CREATE UNIQUE INDEX "achievements_slug_unique" on "achievements"("slug");
CREATE TABLE IF NOT EXISTS "user_achievements"(
  "id" integer primary key autoincrement not null,
  "user_id" integer not null,
  "achievement_id" integer not null,
  "earned_at" datetime not null default CURRENT_TIMESTAMP,
  "created_at" datetime,
  "updated_at" datetime,
  foreign key("user_id") references "users"("id") on delete cascade,
  foreign key("achievement_id") references "achievements"("id") on delete cascade
);

INSERT INTO migrations VALUES(1,'0001_01_01_000000_create_users_table',1);
INSERT INTO migrations VALUES(2,'0001_01_01_000001_create_cache_table',1);
INSERT INTO migrations VALUES(3,'0001_01_01_000002_create_jobs_table',1);
INSERT INTO migrations VALUES(4,'2026_03_19_013849_create_tasks_table',1);
INSERT INTO migrations VALUES(5,'2026_04_25_031639_create_recurrences_table',1);
INSERT INTO migrations VALUES(6,'2026_05_31_004802_create_notifications_table',1);
INSERT INTO migrations VALUES(7,'2026_05_31_194234_create_push_subscriptions_table',1);
INSERT INTO migrations VALUES(8,'2026_06_05_163331_create_recurrence_checklist_items_table',1);
INSERT INTO migrations VALUES(9,'2026_06_11_000001_create_achievements_table',1);
INSERT INTO migrations VALUES(10,'2026_06_11_000002_create_user_achievements_table',1);
