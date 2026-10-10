# Giovanna Belo — giobelo.com.br

Cópia estática do site publicado (WordPress/Elementor na Hostinger), versionada para editar no **Cursor** e publicar via GitHub — mesmo fluxo das outras páginas do estúdio.

## Rodar localmente

```bash
cd giobelo
python3 -m http.server 8080
```

Abra `http://localhost:8080/`.

## Estrutura

| Caminho | Página |
|---------|--------|
| `index.html` | Home |
| `procedimentos/` | Procedimentos |
| `privacy-policy/` | Políticas de privacidade |
| `wp-content/uploads/` | Imagens e CSS gerado pelo Elementor |

## Próximo passo (repo só do Giobelo)

O token do Cloud Agent **não pode criar** repositório novo no GitHub. No seu GitHub:

1. **New repository** → `giobelo` (público ou privado).
2. Copie só esta pasta para a raiz do repo (ou use `git subtree split`).
3. No Cursor: **Cloud Agents → Environment** → adicione `github.com/fbelorp-alt/giobelo` como repo do ambiente.

Assim você abre um agente só para a Giovanna, sem misturar com `davibelodesign`.

## Publicar no domínio (quando estiver pronto)

Hoje `giobelo.com.br` ainda aponta para **WordPress na Hostinger**. Para trocar por esta versão estática:

1. Faça backup do WordPress (Hostinger → Backups).
2. Envie o conteúdo da pasta `giobelo/` para `public_html` (FTP ou Gerenciador de arquivos).
3. Ajuste `.htaccess` se precisar de URLs limpas (opcional).

Enquanto isso, dá para testar em subpasta ou subdomínio (ex.: `preview.davibelodesign.com/giobelo/`).

## Reimportar do site no ar

Se alguém editar só no WordPress de novo:

```bash
# na raiz do monorepo, branch giobelo
wget -e robots=off -k -p -H -D giobelo.com.br \
  --reject-regex 'wp-admin|wp-json|xmlrpc|feed|comments' \
  -P /tmp/giobelo-import \
  "https://giobelo.com.br/" "https://giobelo.com.br/procedimentos/" \
  "https://giobelo.com.br/privacy-policy/"
# depois copiar e rodar o script de limpeza de ?ver= (ver histórico do PR)
```

Ideal: passar a editar **só aqui no Cursor** e publicar por GitHub/deploy, sem Replit/WordPress paralelo.
