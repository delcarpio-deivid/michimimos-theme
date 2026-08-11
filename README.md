# Michimimos Theme

Tema Shopify **Online Store 2.0** custom para [michimimos.com](https://michimimos.com) — tienda de bienestar para gatos de interior.

**Marca:** Cálido · Experto · Cercano  
**Stack:** Liquid + JSON templates + CSS/JS magro (sin Dawn como skin)

## Estado

Documentación y plan de implementación en curso. El código del tema se desarrolla en la rama `dev` y en feature branches; `main` se mantiene limpia como candidata a publicación.

| Rama | Uso |
|------|-----|
| `main` | Estable / candidata a tema publicado en Shopify |
| `dev` | Integración y preview de desarrollo |
| `feat/*` | Trabajo acotado (una fase o feature) |

## Documentación

| Archivo | Contenido |
|---------|-----------|
| [PLAN-IMPLEMENTACION-tema.md](PLAN-IMPLEMENTACION-tema.md) | Fases F0–F9 |
| [plan-ejecucion-tienda-gatos.md](plan-ejecucion-tienda-gatos.md) | Plan de negocio / SEO |
| [PRD-michimimos-tienda.md](PRD-michimimos-tienda.md) | Requisitos |
| [UXTD-michimimos-tienda.md](UXTD-michimimos-tienda.md) | UX/UI |
| [TRD-michimimos-tienda.md](TRD-michimimos-tienda.md) | Arquitectura + paridad SEO vs Dawn (§3.1) |
| [AGENT-STACK-michimimos.md](AGENT-STACK-michimimos.md) | Skills y herramientas de agentes |
| [AGENTS.md](AGENTS.md) | Reglas cortas para agentes IA |

## Desarrollo local (cuando exista el scaffold)

```bash
# Requiere Shopify CLI + acceso a la tienda
shopify theme dev
shopify theme check
```

## Contribución

1. Partir de `dev` (no de `main`).
2. Crear `feat/<nombre>` o `chore/<nombre>`.
3. Abrir PR hacia `dev`.
4. La publicación del tema en Shopify es **manual** y humana — los agentes no publican.

## Licencia

Uso privado del proyecto Michimimos salvo que se indique otra licencia más adelante.
