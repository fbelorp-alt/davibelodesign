#!/usr/bin/env python3
"""Export public WordPress content from giobelo.com.br via REST API (Fase 0)."""

from __future__ import annotations

import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

BASE = "https://giobelo.com.br/wp-json/wp/v2"
OUT = Path(__file__).resolve().parent / "inventory"


def fetch_all(endpoint: str) -> list[dict]:
    page = 1
    items: list[dict] = []
    while True:
        url = f"{BASE}/{endpoint}?per_page=100&page={page}"
        req = urllib.request.Request(url, headers={"User-Agent": "giobelo-migration/1.0"})
        with urllib.request.urlopen(req, timeout=60) as resp:
            batch = json.load(resp)
        if not batch:
            break
        items.extend(batch)
        total_pages = int(resp.headers.get("X-WP-TotalPages", "1"))
        if page >= total_pages:
            break
        page += 1
    return items


def slim_post(p: dict) -> dict:
    return {
        "id": p.get("id"),
        "slug": p.get("slug"),
        "link": p.get("link"),
        "date": p.get("date"),
        "modified": p.get("modified"),
        "title": (p.get("title") or {}).get("rendered"),
        "excerpt": (p.get("excerpt") or {}).get("rendered"),
        "content_html": (p.get("content") or {}).get("rendered"),
        "featured_media": p.get("featured_media"),
        "categories": p.get("categories"),
        "type": p.get("type"),
    }


def slim_media(m: dict) -> dict:
    details = m.get("media_details") or {}
    return {
        "id": m.get("id"),
        "slug": m.get("slug"),
        "link": m.get("link"),
        "source_url": m.get("source_url"),
        "date": m.get("date"),
        "title": (m.get("title") or {}).get("rendered"),
        "alt_text": m.get("alt_text"),
        "mime_type": m.get("mime_type"),
        "width": details.get("width"),
        "height": details.get("height"),
    }


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H%M%SZ")

    try:
        posts = fetch_all("posts")
        pages = fetch_all("pages")
        media = fetch_all("media")
    except urllib.error.URLError as e:
        print(f"Erro ao baixar WP: {e}", file=sys.stderr)
        return 1

    manifest = {
        "exported_at": stamp,
        "source": "https://giobelo.com.br",
        "counts": {"posts": len(posts), "pages": len(pages), "media": len(media)},
    }

    (OUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    (OUT / "posts.json").write_text(
        json.dumps([slim_post(p) for p in posts], ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (OUT / "pages.json").write_text(
        json.dumps([slim_post(p) for p in pages], ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (OUT / "media.json").write_text(
        json.dumps([slim_media(m) for m in media], ensure_ascii=False, indent=2), encoding="utf-8"
    )

    slugs = sorted({p["slug"] for p in posts + pages if p.get("slug")})
    (OUT / "urls-slugs.txt").write_text("\n".join(slugs) + "\n", encoding="utf-8")

    print(json.dumps(manifest, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
