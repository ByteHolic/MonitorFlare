CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  method TEXT NOT NULL DEFAULT 'GET',
  timeout INTEGER NOT NULL DEFAULT 10000,
  expected_status INTEGER NOT NULL DEFAULT 200,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS health_checks (
  id TEXT PRIMARY KEY,
  service_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('healthy', 'unhealthy')),
  response_time INTEGER NOT NULL,
  status_code INTEGER,
  error TEXT,
  timestamp INTEGER NOT NULL,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK(type IN ('telegram', 'slack')),
  enabled INTEGER NOT NULL DEFAULT 1 CHECK(enabled IN (0, 1)),
  config TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_health_checks_service_id ON health_checks(service_id);
CREATE INDEX IF NOT EXISTS idx_health_checks_timestamp ON health_checks(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_health_checks_status ON health_checks(status);
