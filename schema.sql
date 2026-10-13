-- Already applied to the D1 database "ladakh-2k26".
CREATE TABLE IF NOT EXISTS checks (
  id TEXT PRIMARY KEY,
  checked INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL
);

-- Return flight is already booked
INSERT OR IGNORE INTO checks (id, checked, updated_at) VALUES ('b2', 1, 0);
