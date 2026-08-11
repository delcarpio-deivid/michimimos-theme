# Michimimos Theme

Tema Shopify **Online Store 2.0** custom para [michimimos.com](https://michimimos.com) — tienda de bienestar para gatos de interior.

**Marca:** Cálido · Experto · Cercano  
**Stack:** Liquid + JSON templates + CSS/JS magro (sin Dawn como skin)

## Estado

Desarrollo del tema en la rama `dev` y en feature branches. `main` se mantiene limpia como candidata a publicación.

| Rama | Uso |
|------|-----|
| `main` | Estable / candidata a tema publicado en Shopify |
| `dev` | Integración y preview de desarrollo |
| `feat/*` | Trabajo acotado (una fase o feature) |

## Documentación

La documentación de negocio, producto y arquitectura **no se publica** en este repositorio (es local al equipo). El único markdown versionado en remoto es este `README.md`.

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
4. No commitear archivos `*.md` de documentación de proyecto (están en `.gitignore`).
5. La publicación del tema en Shopify es **manual** y humana — los agentes no publican.

## Licencia

Uso privado del proyecto Michimimos salvo que se indique otra licencia más adelante.
