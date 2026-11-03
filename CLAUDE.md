# CLAUDE.md — umbralGrimorio (Gothica Bibliotheca)

Reglas compartidas entre el Project de claude.ai y Claude Code. Si una regla cambia, se cambia aquí primero.

@AGENTS.md

## Stack y comandos

- Next.js 16 (App Router, `cacheComponents: true`, `src/proxy.ts` en lugar de middleware), React 19, TypeScript estricto.
- Tailwind CSS v4 (tokens en CSS, sin `tailwind.config`), HeroUI v3, Zustand, React Hook Form + Zod, motion, R3F/drei.
- `npm run dev` · `npm run build` · `npm run lint`
- Typecheck: `npx next typegen && npx tsc --noEmit` (sin `typegen`, `LayoutProps`/`PageProps` no existen).
- Antes de dar una tarea por terminada: lint sin errores y `tsc` limpio.

## Estructura

```
src/
  app/                    rutas; componentes locales en `_components/`
    (public)/auth/...     flujo de autenticación
    api/...               route handlers BFF (proxy hacia el backend NestJS)
  core/
    components/           componentes compartidos de dominio visual
    components/ui/        primitivas de formulario y UI (envuelven HeroUI)
    hooks/                hooks compartidos (exportados desde index.ts)
    lib/schemas/          esquemas Zod por formulario
    lib/validation/       reglas y regex reutilizables
    server/               código solo de servidor (sesión, cookies, tipos de backend)
    stores/               stores Zustand (`*.store.ts`)
    utils/                helpers puros
```

- Archivos en kebab-case. Hooks `use-*.ts`. Un componente exportado por archivo.
- Un hook de formulario vive junto a su formulario (`form/login/use-login.ts`).
- Nada de archivos vacíos, duplicados ni hojas de estilo sin referenciar.

## Sistema de diseño (fuente única de verdad)

- `src/app/themes.css` define dos temas seleccionables: `oscuro` y `claro`, con tokens semánticos compartidos: `--background`, `--foreground`, `--surface`, `--surface-muted`, `--surface-elevated`, `--border`, `--primary`, `--primary-hover`, `--primary-foreground`, `--accent` y tokens de estado.
- `src/app/globals.css` expone esas variables como utilidades vía `@theme inline`. No se crean tokens en otro archivo.
- Solo existen los temas `oscuro` y `claro`; ambos comparten los mismos nombres de tokens y cada uno define sus valores.
- Las rutas públicas y privadas respetan el tema seleccionado. Las preferencias antiguas `gothic-*` y `lumina-*` se migran a `oscuro` y `claro` respectivamente.

### Colores permitidos

`background surface raised border foreground muted primary primary-dark primary-foreground accent glow ring` y los estados `status-{error|success|warning|info}[-text|-bg|-border|-icon]`.

Prohibido: hex en `.tsx/.ts` (salvo shaders/escenas 3D), `style={{ color/background }}`, y nombres heredados del sistema anterior. Equivalencias para migrar:

| Heredado | Usar |
|---|---|
| `muted-foreground` | `muted` |
| `card`, `card-foreground` | `surface`, `foreground` |
| `input` | `border` |
| `destructive` | `status-error` / `status-error-text` |
| `parchment` | `foreground` |
| `gold`, `gold-bright`, `gilded` | `accent` / `glow` |
| `link` | `primary` |

### Tipografía

- Títulos: `font-display` (Playfair). No usar `font-serif` (cae en la serif del sistema). Cuerpo: `font-sans` (Inter).
- Tamaños solo con la escala semántica: `text-display`, `text-page-title`, `text-section-title`, `text-card-title`, `text-body`, `text-body-sm`, `text-caption`, `text-overline`. Prohibido `text-[Npx]` y `text-xl/2xl/...` en títulos.
- Jerarquía: un `h1` por página. Misma etiqueta = mismo estilo en todas las vistas; si un título necesita verse distinto, es otro nivel semántico.
- Texto en versalitas: `text-overline uppercase` (el tracking ya viene en el token; no añadir `tracking-[...]`).

### Forma, espaciado y profundidad

- Radios: `rounded-control` (inputs, botones), `rounded-card`, `rounded-panel`, `rounded-dialog`, `rounded-pill`. Prohibido `rounded-[Npx]`.
- Bordes: `border-hairline` / `border-emphasis`. Sombras: `shadow-card`, `shadow-card-hover`, `shadow-overlay`, `shadow-glow`, `shadow-raised`.
- Espaciado en la escala de Tailwind (múltiplos de 4px); sin valores arbitrarios.
- Clases repetidas de controles viven en un componente de `core/components/ui`, no en strings sueltos en `utils/const.ts`.

### Accesibilidad

- Contraste mínimo WCAG AA (4.5:1 texto, 3:1 UI) en los dos temas; comprobar al tocar un token.
- Todo control interactivo es `<button>`/`<a>` con `type` explícito y nombre accesible. Iconos decorativos con `aria-hidden`.
- Animaciones respetan `prefers-reduced-motion`.
- El copy no afirma garantías que el sistema no cumple (cifrado, certificaciones).

## Datos, formularios y servidor

- Formularios: RHF + `zodResolver`, `noValidate`, esquema en `core/lib/schemas`, mensajes en español.
- El cliente solo llama a `/api/*` (BFF). Las URLs viven en `core/server/urls.ts`; el BFF habla con `NEXT_PUBLIC_API_URL` → renombrar a `API_URL` (solo servidor) cuando se migre.
- Una sola función de petición compartida (parseo de `BackendResponse<T>`, errores, toast). Los hooks no repiten `fetch` + `json().catch` + `submitFeedbackError`.
- Errores de servidor siempre con `submitFeedbackError`; nunca relanzar desde `onSubmit`.
- Estado global solo en Zustand y solo si lo comparten varias vistas; el estado de formulario se queda en RHF.

## Seguridad

- Sesión en cookie `httpOnly`, `secure` en producción. `src/proxy.ts` es solo una comprobación optimista; cada página/handler protegido verifica con `requireSession`/`requireRole`.
- Nunca secretos en variables `NEXT_PUBLIC_*`. Nada de "cifrado" en el cliente: las contraseñas viajan por HTTPS y se hashean en el backend.
- Redirecciones solo a rutas internas (ver `resolveRedirectPath`).
- Sin `console.*` en código de producción; usar un logger del servidor.

## Estilo de código

- Prettier del repo (comillas dobles, sin trailing comma, ancho 105). Imports con alias `@/`.
- Tipos de retorno explícitos en funciones exportadas. Sin `any`; preferir `unknown` + narrowing.
- Sin `setState` síncrono dentro de `useEffect` (regla `react-hooks/set-state-in-effect`).
- Comentarios explican el porqué, no el qué. Sin comentarios de tutorial ("4. Agregamos...").

## Git

- Ramas: `feat/…`, `fix/…`, `refactor/…`, `chore/…` desde `main`.
- Commits convencionales en español: `feat(auth): …`, `fix(theme): …`.
- PR pequeños y de un solo propósito; lint y `tsc` en verde antes de abrir.

## Deuda conocida (actualizar al cerrar cada punto)

1. Tokens heredados en el flujo de auth sin definir en `globals.css`; `@heroui/styles` no se importa → controles sin estilo.
2. Cifrado AES en cliente con `NEXT_PUBLIC_PLAIN_TEXT` (`core/utils/function.ts`).
3. No existen `src/app/api/**` ni `/altar`: el flujo de auth apunta a rutas inexistentes.
4. `src/app/globals11.css` sin uso y `form/reset-password/email-verification/use-email-verification.ts` vacío.
5. `{1 - 5}` hardcodeado en `iniciar-sesion/page.tsx` (muestra "-4").
6. 2 errores de lint (`set-state-in-effect` en `theme-provider.tsx` y `token-grid.tsx`).
7. Marca inconsistente: metadata "Lumen Codex" vs "Gothica Bibliotheca"; README por defecto de create-next-app.