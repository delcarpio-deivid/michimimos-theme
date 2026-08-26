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

## Marca (assets)

Logo público en `brand/` (fuente) y copias de trabajo en `assets/` para el tema: mark SVG, wordmark, lockup, mono, PNG @1x/@2x/@3x, `favicon.ico`, `apple-touch-icon.png`.

## Documentación

La documentación de negocio, producto y arquitectura **no se publica** en este repositorio (es local al equipo). El único markdown versionado en remoto es este `README.md`.

## Navegación (Admin)

El header puede usar la **navegación canónica** del tema (activa por defecto en preview) o un **linklist** de Shopify (`main-menu`).

Cuando Admin esté listo, desmarca “Usar navegación canónica Michimimos” en el editor del tema y configura **Admin → Tienda online → Navegación → main-menu** en este orden:

Inicio · **Productos** (Rascadores · Camas · Fuentes de agua · Comederos · Juguetes interactivos) · Blog · **Sobre nosotros**

Handles de colección: `rascadores`, `camas`, `fuentes-de-agua` (o `fuentes`), `comederos`, `juguetes` (o `juguetes-interactivos`). Página: `sobre-nosotros`. No uses la colección “Página de inicio” en el menú.

El pie puede usar enlaces canónicos (Sobre nosotros · Blog) o un menú `footer`.

## Desarrollo local

```bash
# Requiere Shopify CLI + acceso a la tienda
shopify theme check
shopify theme push --theme 164432838877
# Preview Dev (unpublished) — nunca --live desde agentes
```

## Contribución

1. Partir de `dev` (no de `main`).
2. Crear `feat/<nombre>` o `chore/<nombre>`.
3. Abrir PR hacia `dev`.
4. No commitear archivos `*.md` de documentación de proyecto (están en `.gitignore`).
5. La publicación del tema en Shopify es **manual** y humana — los agentes no publican.

## Licencia

Uso privado del proyecto Michimimos salvo que se indique otra licencia más adelante.
