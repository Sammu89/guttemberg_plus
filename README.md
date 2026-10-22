# Guttemberg Plus

Plugin de WordPress que acrescenta ao editor de blocos (Gutenberg) três blocos personalizáveis: **Acordeão**, **Separadores (tabs)** e **Índice (TOC)**, com um sistema de temas partilhado.

## Blocos incluídos

| Bloco | Nome interno | O que faz |
| --- | --- | --- |
| Accordion | `custom/accordion` | Painel de conteúdo expansível/recolhível. |
| Tabs | `custom/tabs` (com `custom/tab-panel`) | Interface de separadores, em orientação horizontal ou vertical; cada separador é um bloco "Tab Panel". |
| Table of Contents | `custom/toc` | Gera automaticamente um índice navegável a partir dos títulos do artigo. |

## Temas e personalização

Os três blocos usam um sistema de temas: o utilizador escolhe um tema e pode ajustar valores por bloco. Os temas são guardados no servidor e geridos através de uma API REST (`server/api/themes.php`), com geração de CSS própria (`server/api/css.php`, valores por omissão em `server/css-defaults/`).

## Requisitos

- WordPress 6.3 ou superior
- PHP 7.4 ou superior
- Node.js 18+ e npm 8+ (apenas para compilar)

## Instalação

1. Copie a pasta do repositório para `wp-content/plugins/` (o ficheiro principal é `guttemberg-plus.php`).
2. Ative o plugin em **Plugins** no painel de administração.
3. Os blocos ficam disponíveis no editor de blocos. A pasta `build/` já está versionada, pelo que não é preciso compilar para usar o plugin.

## Estrutura das pastas

- `dev/` - código-fonte (blocos, componentes partilhados, esquemas, estilos SCSS, ferramentas de compilação, testes e documentação técnica em `dev/docs/`).
- `build/` - código compilado, carregado pelo WordPress.
- `blocks/` - definições `block.json` dos blocos (accordion, tabs, toc).
- `server/` - todo o PHP do servidor: `init.php`, `security.php`, `api/` (temas e CSS), `storage/` e `css-defaults/`.
- `docs/` - notas do repositório; `docs/merge-2026-10-23/` explica que o mapeamento CSS antigo perdia 18 entradas e foi guardado como `.php.txt`.
- `guttemberg-plus.php` - ficheiro principal do plugin; `uninstall.php` - limpeza na desinstalação.

## Como compilar

A partir da pasta `dev/` (`npm install` primeiro):

```
npm run build        # compila com wp-scripts (corre antes a geração de esquemas e as validações)
npm start            # modo de desenvolvimento (watch)
npm run schema:build # gera os esquemas/atributos a partir de dev/schemas
npm run validate:all # validações de consistência
npm run lint:js
```

Em Windows, `dev/RUN.bat` oferece um menu de ferramentas de desenvolvimento (`dev/RUN.sh` em Linux/macOS).

## Estado do projeto

Versão 1.0.0, em desenvolvimento ativo (histórico de commits até janeiro de 2026). Os metadados do autor e do URL do plugin ainda são marcadores de posição ("Your Name", "yourusername").

## Licença

GPL v2 ou posterior (ver `LICENSE`).
