from __future__ import annotations

import re
import uuid
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, File, Form, HTTPException, Request, UploadFile
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from PIL import Image

from app.db import ROOT, UPLOAD_DIR, get_conn, init_db

app = FastAPI(title="Casa Finder", description="Passo 1 — catálogo de objetos")
app.mount("/static", StaticFiles(directory=ROOT / "static"), name="static")
templates = Jinja2Templates(directory=str(ROOT / "templates"))

ALLOWED_EXT = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
MAX_UPLOAD_BYTES = 8 * 1024 * 1024


@app.on_event("startup")
def on_startup() -> None:
    init_db()


def slug_filename(original: str) -> str:
    stem = Path(original).stem
    ext = Path(original).suffix.lower()
    if ext not in ALLOWED_EXT:
        raise HTTPException(400, "Formato de imagem não suportado. Use JPG, PNG, WEBP ou GIF.")
    safe = re.sub(r"[^a-zA-Z0-9_-]+", "-", stem).strip("-")[:40] or "foto"
    return f"{safe}-{uuid.uuid4().hex[:8]}{ext}"


async def save_photo(upload: UploadFile | None) -> Optional[str]:
    if upload is None or not upload.filename:
        return None
    data = await upload.read()
    if not data:
        return None
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(400, "Imagem maior que 8 MB.")
    name = slug_filename(upload.filename)
    dest = UPLOAD_DIR / name
    dest.write_bytes(data)
    try:
        with Image.open(dest) as img:
            img.thumbnail((1200, 1200))
            img.save(dest, optimize=True)
    except Exception as exc:
        dest.unlink(missing_ok=True)
        raise HTTPException(400, "Arquivo de imagem inválido.") from exc
    return f"uploads/{name}"


def fetch_rooms(conn):
    return conn.execute("SELECT * FROM rooms ORDER BY name COLLATE NOCASE").fetchall()


def fetch_objects(conn, q: str = "", room_id: Optional[int] = None):
    sql = """
        SELECT o.*, r.name AS room_name
        FROM objects o
        LEFT JOIN rooms r ON r.id = o.room_id
        WHERE 1=1
    """
    params: list = []
    if q:
        sql += " AND (o.name LIKE ? OR o.category LIKE ? OR o.notes LIKE ? OR IFNULL(r.name,'') LIKE ?)"
        like = f"%{q}%"
        params.extend([like, like, like, like])
    if room_id:
        sql += " AND o.room_id = ?"
        params.append(room_id)
    sql += " ORDER BY o.updated_at DESC, o.name COLLATE NOCASE"
    return conn.execute(sql, params).fetchall()


@app.get("/", response_class=HTMLResponse)
def home(request: Request, q: str = "", room_id: Optional[int] = None):
    with get_conn() as conn:
        rooms = fetch_rooms(conn)
        objects = fetch_objects(conn, q=q.strip(), room_id=room_id)
        stats = {
            "objects": conn.execute("SELECT COUNT(*) AS c FROM objects").fetchone()["c"],
            "rooms": conn.execute("SELECT COUNT(*) AS c FROM rooms").fetchone()["c"],
            "tagged": conn.execute(
                "SELECT COUNT(*) AS c FROM objects WHERE tag_id IS NOT NULL AND tag_id != ''"
            ).fetchone()["c"],
        }
    return templates.TemplateResponse(
        request,
        "index.html",
        {
            "objects": objects,
            "rooms": rooms,
            "q": q,
            "room_id": room_id,
            "stats": stats,
        },
    )


@app.get("/objetos/novo", response_class=HTMLResponse)
def new_object_form(request: Request):
    with get_conn() as conn:
        rooms = fetch_rooms(conn)
    return templates.TemplateResponse(
        request,
        "object_form.html",
        {"rooms": rooms, "object": None, "title": "Novo objeto"},
    )


@app.post("/objetos")
async def create_object(
    name: str = Form(...),
    category: str = Form("geral"),
    notes: str = Form(""),
    room_id: Optional[str] = Form(None),
    tag_id: str = Form(""),
    photo: UploadFile = File(None),
):
    name = name.strip()
    if not name:
        raise HTTPException(400, "Nome é obrigatório.")
    photo_path = await save_photo(photo)
    rid = int(room_id) if room_id and room_id.isdigit() else None
    with get_conn() as conn:
        if rid is not None:
            exists = conn.execute("SELECT id FROM rooms WHERE id = ?", (rid,)).fetchone()
            if not exists:
                raise HTTPException(400, "Cômodo inválido.")
        conn.execute(
            """
            INSERT INTO objects (name, category, notes, photo_path, tag_id, room_id, last_seen_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, CASE WHEN ? IS NOT NULL THEN datetime('now') ELSE NULL END, datetime('now'))
            """,
            (
                name,
                category.strip() or "geral",
                notes.strip(),
                photo_path,
                tag_id.strip() or None,
                rid,
                rid,
            ),
        )
    return RedirectResponse("/", status_code=303)


@app.get("/objetos/{object_id}", response_class=HTMLResponse)
def object_detail(request: Request, object_id: int):
    with get_conn() as conn:
        obj = conn.execute(
            """
            SELECT o.*, r.name AS room_name
            FROM objects o
            LEFT JOIN rooms r ON r.id = o.room_id
            WHERE o.id = ?
            """,
            (object_id,),
        ).fetchone()
        if not obj:
            raise HTTPException(404, "Objeto não encontrado.")
        rooms = fetch_rooms(conn)
    return templates.TemplateResponse(
        request,
        "object_detail.html",
        {"object": obj, "rooms": rooms},
    )


@app.get("/objetos/{object_id}/editar", response_class=HTMLResponse)
def edit_object_form(request: Request, object_id: int):
    with get_conn() as conn:
        obj = conn.execute("SELECT * FROM objects WHERE id = ?", (object_id,)).fetchone()
        if not obj:
            raise HTTPException(404, "Objeto não encontrado.")
        rooms = fetch_rooms(conn)
    return templates.TemplateResponse(
        request,
        "object_form.html",
        {"rooms": rooms, "object": obj, "title": "Editar objeto"},
    )


@app.post("/objetos/{object_id}")
async def update_object(
    object_id: int,
    name: str = Form(...),
    category: str = Form("geral"),
    notes: str = Form(""),
    room_id: Optional[str] = Form(None),
    tag_id: str = Form(""),
    photo: UploadFile = File(None),
):
    name = name.strip()
    if not name:
        raise HTTPException(400, "Nome é obrigatório.")
    rid = int(room_id) if room_id and room_id.isdigit() else None
    photo_path = await save_photo(photo)
    with get_conn() as conn:
        obj = conn.execute("SELECT * FROM objects WHERE id = ?", (object_id,)).fetchone()
        if not obj:
            raise HTTPException(404, "Objeto não encontrado.")
        if rid is not None:
            exists = conn.execute("SELECT id FROM rooms WHERE id = ?", (rid,)).fetchone()
            if not exists:
                raise HTTPException(400, "Cômodo inválido.")
        final_photo = photo_path or obj["photo_path"]
        conn.execute(
            """
            UPDATE objects
            SET name = ?, category = ?, notes = ?, photo_path = ?, tag_id = ?,
                room_id = ?,
                last_seen_at = CASE
                    WHEN ? IS NOT NULL AND (? IS NULL OR ? != room_id OR last_seen_at IS NULL)
                    THEN datetime('now')
                    ELSE last_seen_at
                END,
                updated_at = datetime('now')
            WHERE id = ?
            """,
            (
                name,
                category.strip() or "geral",
                notes.strip(),
                final_photo,
                tag_id.strip() or None,
                rid,
                rid,
                obj["room_id"],
                rid,
                object_id,
            ),
        )
    return RedirectResponse(f"/objetos/{object_id}", status_code=303)


@app.post("/objetos/{object_id}/mover")
def move_object(object_id: int, room_id: Optional[str] = Form(None)):
    rid = int(room_id) if room_id and room_id.isdigit() else None
    with get_conn() as conn:
        obj = conn.execute("SELECT id FROM objects WHERE id = ?", (object_id,)).fetchone()
        if not obj:
            raise HTTPException(404, "Objeto não encontrado.")
        if rid is not None:
            exists = conn.execute("SELECT id FROM rooms WHERE id = ?", (rid,)).fetchone()
            if not exists:
                raise HTTPException(400, "Cômodo inválido.")
        conn.execute(
            """
            UPDATE objects
            SET room_id = ?,
                last_seen_at = CASE WHEN ? IS NOT NULL THEN datetime('now') ELSE last_seen_at END,
                updated_at = datetime('now')
            WHERE id = ?
            """,
            (rid, rid, object_id),
        )
    return RedirectResponse(f"/objetos/{object_id}", status_code=303)


@app.post("/objetos/{object_id}/excluir")
def delete_object(object_id: int):
    with get_conn() as conn:
        obj = conn.execute("SELECT photo_path FROM objects WHERE id = ?", (object_id,)).fetchone()
        if not obj:
            raise HTTPException(404, "Objeto não encontrado.")
        conn.execute("DELETE FROM objects WHERE id = ?", (object_id,))
        if obj["photo_path"]:
            path = ROOT / "static" / obj["photo_path"]
            if path.exists() and path.is_file():
                path.unlink()
    return RedirectResponse("/", status_code=303)


@app.get("/comodos", response_class=HTMLResponse)
def rooms_page(request: Request):
    with get_conn() as conn:
        rooms = conn.execute(
            """
            SELECT r.*,
                   (SELECT COUNT(*) FROM objects o WHERE o.room_id = r.id) AS object_count
            FROM rooms r
            ORDER BY r.name COLLATE NOCASE
            """
        ).fetchall()
    return templates.TemplateResponse(request, "rooms.html", {"rooms": rooms})


@app.post("/comodos")
def create_room(name: str = Form(...), notes: str = Form("")):
    name = name.strip()
    if not name:
        raise HTTPException(400, "Nome do cômodo é obrigatório.")
    with get_conn() as conn:
        try:
            conn.execute(
                "INSERT INTO rooms (name, notes) VALUES (?, ?)",
                (name, notes.strip()),
            )
        except Exception as exc:
            raise HTTPException(400, "Já existe um cômodo com esse nome.") from exc
    return RedirectResponse("/comodos", status_code=303)


@app.post("/comodos/{room_id}/excluir")
def delete_room(room_id: int):
    with get_conn() as conn:
        conn.execute("UPDATE objects SET room_id = NULL WHERE room_id = ?", (room_id,))
        conn.execute("DELETE FROM rooms WHERE id = ?", (room_id,))
    return RedirectResponse("/comodos", status_code=303)


@app.get("/api/health")
def health():
    return {"ok": True, "step": 1, "feature": "catalog"}
