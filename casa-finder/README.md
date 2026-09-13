# Casa Finder — Passo 1

Catálogo local de objetos da sua casa. Roda no PC, salva em SQLite, aceita foto e último cômodo conhecido.

## O que este passo faz

- Cadastrar cômodos
- Cadastrar objetos (nome, categoria, notas, foto, tag opcional)
- Buscar por texto ou filtrar por cômodo
- Atualizar “onde está agora”

## O que ainda NÃO faz

- Reconstrução 3D da casa (Passo 2)
- Localização automática por BLE/NFC (Passo 3)

## Como rodar

```bash
cd casa-finder
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8787
```

Abra: http://127.0.0.1:8787

## Estrutura

- `app/main.py` — API + páginas
- `app/db.py` — SQLite
- `templates/` — interface
- `static/uploads/` — fotos dos objetos
- `data/casa.db` — banco (criado na primeira execução)

## Próximo passo sugerido

1. Cadastrar 15–20 objetos que você mais perde
2. Sempre atualizar o cômodo quando guardar algo
3. Depois: importar scans 3D por cômodo no viewer
