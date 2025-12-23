# Guttemberg+ — Anti-Nulling (Low-Support Edition)

Este documento descreve as **alterações finais** ao sistema de licenciamento e anti-nulling do plugin **Guttemberg+**, com foco explícito em:

- Reduzir drasticamente problemas de suporte
- Manter enforcement forte no server-side
- Facilitar debug interno sem expor lógica sensível
- Evitar comportamentos imprevisíveis em ambientes WordPress reais

---

## Objetivos de Design

1. **Server-side é a única autoridade**
2. **Fail-closed previsível**
3. **Nenhum falso positivo crítico**
4. **Debug fácil para o autor, difícil para terceiros**
5. **UX simples para o utilizador final**

---

## Decisões Arquiteturais Confirmadas

### O que FOI adotado
- Central hook de enforcement no render (`pre_render_block`)
- Integrity check mínimo e focado
- Sanitização de atributos antes do render
- Grace limitada e previsível
- Admin UI simples com revalidação manual
- Mapa automático de pontos de ofuscação (build-time)

### O que FOI explicitamente rejeitado
- Soft watermark
- Plan-based degradation
- Ofuscação JS agressiva em runtime
- Regex pós-processamento de HTML
- Checks probabilísticos aleatórios

---

## 1. Central Render Enforcement

Todo o enforcement premium é centralizado num único ponto:

- Hook: `pre_render_block`
- Responsável por:
  - Identificar blocos Guttemberg+
  - Resolver capability atual
  - Sanitizar atributos premium antes do render
  - Garantir comportamento consistente em cache, REST e preview

---

## 2. Sanitização de Atributos

Regra absoluta:

> **Nunca sanitizar HTML final. Apenas dados.**

Fluxo:

```
Block attrs → Sanitização premium (PHP) → CSS vars / markup → Render
```

---

## 3. Integrity Check (Suporte-Friendly)

- Aplicado apenas a dois ficheiros críticos:
  - Capability resolver
  - Render sanitizer
- Falha resulta apenas em modo não-premium
- Plugin nunca é desativado

---

## 4. Licenciamento e UI

### Página de Settings
- Menu: **Opções**
- Nome: **Guttemberg+ Licence**

### Conteúdo
- Campo de licença
- Botão Guardar
- Botão Revalidar Licença
- Mensagem única de estado

Mensagem padrão:

> “As funcionalidades premium estão desativadas porque a licença não foi validada.
> Se acabou de inserir ou alterar a licença, clique em ‘Revalidar Licença’.”

---

## 5. Revalidação Manual

O botão **Revalidar Licença**:
- Limpa transients
- Limpa estado persistido
- Revalida imediatamente
- Atualiza a UI

Objetivo: eliminar tickets de cache e migração.

---

## 6. Grace Period

| Situação | Comportamento |
|--------|---------------|
| Cache válida | Até 24h |
| Servidor inacessível | Máx. 24h |
| Signature inválida | Zero grace |
| Domain/version mismatch | Zero grace |

---

## 7. Build-Time: Mapa de Ofuscação

Durante o build é gerado:

```
build/obfuscation-map.json
```

Conteúdo:
- Ficheiro
- Função/classe
- Papel real
- Tipo de ofuscação
- Hash curto

Nunca incluído no plugin distribuído.

---

## 8. Política de Ofuscação

Ofuscar:
- Nomes semânticos
- Fluxos internos

Não ofuscar:
- APIs WordPress
- Hooks
- UI de settings
- Logs internos

---

## Filosofia Final

Este sistema não tenta ser inquebrável.
Torna cracking mais caro do que comprar a licença,
sem penalizar utilizadores legítimos.

**Baseline oficial: Guttemberg+ Anti-Nulling — Low-Support Edition**
