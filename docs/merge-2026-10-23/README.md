# Nota de merge (2026-10-23): css-mappings-generated.php

A cópia local deste plugin tinha `server/css-defaults/css-mappings-generated.php` com a versão **antiga** (gerada em 2026-01-07, 132 entradas) por cima da versão do GitHub (gerada em 2026-01-17, 150 entradas).
Usar a antiga **perderia 18 mapeamentos CSS** e regrediria o código, por isso o ficheiro principal ficou com a versão do GitHub (completa).

A versão local fica guardada, sem ser carregada pelo plugin, em `css-mappings-generated.plugin-version.php.txt` (esta pasta), caso seja preciso comparar.

## Mapeamentos que a versão local não tem

- blockBox (accordion-item)
- contentBox (accordion-contentInner)
- dividerBorder (accordion-content)
- headerBox (accordion-title)
- titleAlignment (accordion-title-alignment)
- titleDecorationColor (accordion-title-decoration-color)
- titleDecorationStyle (accordion-title-decoration-style)
- titleDecorationWidth (accordion-title-decoration-width)
- titleFontFamily (accordion-title-font-family)
- titleFontSize (accordion-title-font-size)
- titleFontWeight (accordion-title-font-weight)
- titleLetterSpacing (accordion-title-letter-spacing)
- titleLineHeight (accordion-title-line-height)
- titleNoLineBreak (accordion-title-white-space)
- titleOffsetX (accordion-title-offset-x)
- titleOffsetY (accordion-title-offset-y)
- titleTextDecoration (accordion-title-text-decoration-line)
- titleTextTransform (accordion-title-text-transform)

As restantes alterações da cópia local (remoção de `php/` e `includes/`, `css-defaults` movidos para `server/`, novo carregador, ficheiros de `build/`) foram enviadas sem cópia de segurança: as funções dos ficheiros removidos existem em `server/`.
