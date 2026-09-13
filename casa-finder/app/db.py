from __future__ import annotations

import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
DB_PATH = DATA_DIR / "casa.db"
UPLOAD_DIR = ROOT / "static" / "uploads"


def get_conn() -> sqlite3.Connection:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db() -> None:
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    with get_conn() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS rooms (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                notes TEXT DEFAULT '',
                model_3d_path TEXT,
                created_at TEXT NOT NULL DEFAULT (datetime('now'))
            );

            CREATE TABLE IF NOT EXISTS objects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                category TEXT NOT NULL DEFAULT 'geral',
                notes TEXT DEFAULT '',
                photo_path TEXT,
                tag_id TEXT,
                room_id INTEGER REFERENCES rooms(id) ON DELETE SET NULL,
                last_seen_at TEXT,
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                updated_at TEXT NOT NULL DEFAULT (datetime('now'))
            );

            CREATE INDEX IF NOT EXISTS idx_objects_name ON objects(name);
            CREATE INDEX IF NOT EXISTS idx_objects_room ON objects(room_id);
            """
        )

        count = conn.execute("SELECT COUNT(*) AS c FROM rooms").fetchone()["c"]
        if count == 0:
            conn.executemany(
                "INSERT INTO rooms (name, notes) VALUES (?, ?)",
                [
                    ("Sala", "Estar e TV"),
                    ("Cozinha", "Armários e gavetas"),
                    ("Quarto", "Criado-mudo e guarda-roupa"),
                    ("Escritório", "Mesa e gavetas"),
                    ("Banheiro", "Armário de remédios"),
                ],
            )
