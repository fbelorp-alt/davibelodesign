# Giobelo — site + sistema unificado (por fases)

Objetivo: **um único produto** no Cursor/GitHub (site público + painel + dados), construído do zero em **modelo novo**, importando tudo do que existe hoje na Hostinger **sem apagar nada** até a troca final.

## Hoje na Hostinger (dois sites)

| Hostinger | Stack | Papel |
|-----------|--------|--------|
| **giobelo.com.br** | WordPress + Elementor | Site, blog, landings de procedimentos |
| **admin.giobelo.com.br** | Node (Express) + SPA React | Painel “Gio Belo”, MySQL |

Produção **continua igual** até a **Fase 5**.

---

## Modelo novo (alvo)

Um repositório, uma aplicação:

- **Público:** páginas, procedimentos, blog, WhatsApp, SEO.
- **Admin:** login, cadastros, históricos, o que o painel atual já faz (a detalhar quando o código Replit/GitHub estiver aqui).
- **Banco:** MySQL na Hostinger (mesmo servidor; pode ser schema novo + import, ou evolução do banco “Gio Belo”).
- **Deploy:** Node na Hostinger (como o admin hoje) ou build estático + API — decidimos na Fase 1.

Código novo em **`giobelo/platform/`** (a partir da Fase 1). A pasta **`giobelo/`** na raiz (espelho WP) vira referência visual até o site novo cobrir tudo.

---

## Fases

### Fase 0 — Inventário e backups (agora)

**Entrega:** saber o que migrar; arquivos de export no repo; backups na Hostinger.

| Fonte | Ação | Quem |
|-------|------|------|
| WordPress | Export JSON via script (`migration/export-wordpress.py`) + backup hPanel | Cursor + você (backup) |
| MySQL “Gio Belo” | Dump `.sql` no hPanel → arquivo **fora do Git** | Você |
| Replit | Conectar GitHub → repo `giobelo-platform` (ou nome que escolher) | Você |
| Admin Express | Listar tabelas e rotas quando o repo estiver no GitHub | Cursor |

**Critério para Fase 1:** inventário WP commitado + dump MySQL guardado + código do Replit no GitHub.

---

### Fase 1 — Fundação

- Repo dedicado (recomendado) ou `giobelo/platform/` neste monorepo.
- Schema de dados (usuários, pacientes/clientes, procedimentos, agendamentos, posts, logs de auditoria).
- Auth do admin, ambiente local, `MYSQL_DATABASE_URL` só em secrets.
- Subdomínio de **staging** (ex.: site temporário Hostinger ou `preview.giobelo.com.br`).

---

### Fase 2 — Site público novo

- Home, procedimentos, sobre, contato, políticas — **conteúdo importado do WP**, layout **novo** (não clonar Elementor).
- Blog: migrar os **9 posts** + mídia.
- URLs antigas: mapa de redirects (`/limpeza-de-pele` → nova rota).

---

### Fase 3 — Painel unificado

- Recriar fluxos do admin atual (React) integrados ao mesmo backend.
- Scripts de import MySQL antigo → schema novo (IDs preservados ou tabela `legacy_id` para rastreio).
- Relatório: “X registros importados / Y divergências”.

---

### Fase 4 — Rodar em paralelo

- Staging completo; você e a Dra. Giovanna testam.
- Comparar contagens (posts, clientes, histórico).
- Ajustes até bater confiança.

---

### Fase 5 — Cutover (substituir)

1. Backup final WP + MySQL + arquivos Node atuais.
2. Apontar **giobelo.com.br** para o app novo.
3. Admin em **`/admin`** no mesmo domínio **ou** manter `admin.` — definimos na Fase 1.
4. Manter WP e app antigos **somente leitura** por 30 dias; depois arquivar.

---

### Fase 6 — Arquivo

- ZIP + dump SQL guardados (Drive/Hostinger).
- Documento “onde estava cada coisa”.

---

## Inventário WordPress (API pública, out/2026)

| Tipo | Quantidade |
|------|------------|
| Posts (blog) | 9 |
| Páginas WP (API) | 5 |
| Landings de procedimentos | 10 rotas em `migration/inventory/procedure-paths.txt` |
| Mídia | 92 |

Detalhes atualizados em `migration/inventory/` após rodar o export.

---

## O que preciso de você na Fase 0

1. **hPanel → giobelo.com.br → Backups** — backup completo WordPress.
2. **hPanel → admin.giobelo.com.br → Bancos de dados** — export SQL do banco Gio Belo (não colar senha no chat).
3. **Replit → GitHub** — push do `file-analyzer-tool-fbelorp` e me manda o link do repo.

Quando isso estiver feito, seguimos Fase 1 no código com você.
