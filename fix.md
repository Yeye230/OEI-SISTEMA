# fix.md — Issues pendientes de OEI Sistema

> Este archivo conserva únicamente issues pendientes o por verificar. Antes de cada nueva consulta técnica se revisarán estos puntos contra el código y las pruebas disponibles. Un issue solo se elimina cuando existe evidencia de que está resuelto; los hallazgos corregidos se documentan en el PR/commit que los soluciona.

## OEI-SEC-001 — El endpoint de sesión podría devolver el token en el cuerpo de respuesta

- **Categoría:** Seguridad
- **Severidad:** Alta
- **Estado:** Pendiente de corrección y verificación
- **Evidencia:** `src/core/server/route-response.ts`, función `toSessionSuccessResponse`: después de guardar el token con `setSessionCookie(token)`, retorna `toBackendRouterResponse(response, payload)`; esa función incluye `payload?.data` en el JSON de salida.
- **Problema / causa raíz:** Si el payload de autenticación contiene `data.token`, el token puede quedar expuesto también en el cuerpo JSON, aunque exista cookie de sesión.
- **Impacto:** El token puede quedar disponible para código cliente, registros o herramientas de diagnóstico que lean la respuesta.
- **Solución recomendada:** Construir una respuesta de éxito que excluya explícitamente `token` del objeto devuelto al cliente, manteniendo la cookie HttpOnly como mecanismo de sesión. Verificar también atributos de cookie y todos los endpoints de autenticación.
- **Alternativa:** Mantener el contrato backend y sanear el payload en una capa específica de respuesta de sesión.
- **Verificación:** Prueba de integración de login que confirme que la cookie se establece con atributos seguros y que el JSON de respuesta no contiene el token ni en campos anidados.
- **Alcance:** No se corrigió en esta tarea de diseño; requiere autorización/cambio de seguridad separado.

## OEI-SEC-002 — Cobertura de rutas protegidas y autorización por verificar

- **Categoría:** Seguridad / Arquitectura
- **Severidad:** Media
- **Estado:** Pendiente de revisión con el mapa real de rutas
- **Evidencia:** `src/proxy.ts` declara `PROTECTED_ROUTES = ["/dashboard"]` y `matcher` incluye `/admin/:path*`; las rutas desconocidas se redirigen, pero esta lógica no demuestra por sí sola que páginas, route handlers y APIs tengan autorización propia.
- **Problema / causa raíz:** La lista de rutas protegidas y el matcher no son equivalentes; falta verificar la autorización efectiva de cada página y endpoint del servidor.
- **Impacto:** Riesgo de regresiones de acceso si se incorporan rutas nuevas sin validación de sesión y permisos en servidor.
- **Solución recomendada:** Inventariar páginas, route handlers y APIs; centralizar la comprobación de sesión/roles en servidor y añadir pruebas negativas de acceso anónimo y de rol insuficiente. El proxy debe considerarse una barrera de navegación, no el control de autorización definitivo.
- **Alternativa:** Mantener controles por módulo si cada endpoint tiene pruebas y middleware explícitos.
- **Verificación:** Matriz de pruebas para cada ruta privada (sin cookie, cookie inválida, usuario autenticado sin permisos y usuario autorizado).
- **Nota:** No se afirma que exista un bypass confirmado; la autorización debe verificarse.
- **Actualización 2026-11-09 (feat/user):** Se agregó `src/app/(protected)/layout.tsx`, que ejecuta `requireSession()` en servidor antes de renderizar las páginas del grupo. La ruta `/dashboard` queda protegida por esta validación además de la comprobación optimista del proxy. La incidencia permanece abierta para inventariar y verificar el resto de páginas privadas, route handlers y APIs.

## OEI-AUTH-001 — El formulario de inicio de sesión aún no autentica

- **Categoría:** Funcionalidad / Seguridad
- **Severidad:** Alta para puesta en producción
- **Estado:** Validación de interfaz implementada en modo demostración; autenticación real pendiente
- **Evidencia:** La rama `feat/login-validations` implementa React Hook Form y Zod en el formulario. Al enviar datos válidos muestra una alerta de demostración; no realiza solicitudes de red ni crea una sesión.
- **Problema / causa raíz:** La pantalla es un prototipo visual, no un flujo de autenticación funcional.
- **Impacto:** El formulario permite comprobar que las validaciones funcionan, pero ningún usuario puede autenticarse todavía. La alerta no representa una sesión iniciada ni protege recursos.
- **Solución recomendada:** En una tarea posterior, integrar el contrato real del backend, manejar respuestas y errores del servidor y validar credenciales en servidor. No tratar esta alerta ni la validación del navegador como autenticación.
- **Alternativa:** Si la autenticación ya se implementa en otra ruta, conectar el formulario al contrato real de esa ruta.
- **Verificación pendiente:** Probar correo vacío, formato inválido, contraseña vacía y datos válidos; confirmar que la alerta indica claramente que es una simulación. Las pruebas de credenciales, red, cookie y redirección quedan pendientes hasta integrar backend.
- **Alcance:** Se implementa únicamente la validación cliente y una alerta de demostración. No se conecta backend, no se envían credenciales y no se modifica el flujo de sesión.

## OEI-ARCH-001 — Archivo de página con nombre temporal y responsabilidad dudosa

- **Categoría:** Mantenibilidad / Arquitectura
- **Severidad:** Baja
- **Estado:** Pendiente de inspección
- **Evidencia:** Existe `src/app/aspageasdasdasd.tsx` con un componente exportado como `DashboardPage` y datos de demostración.
- **Problema / causa raíz:** El nombre del archivo no expresa su responsabilidad y el contenido parece ser una pantalla de demostración; aún debe comprobarse si está referenciado o forma parte de una ruta deliberada.
- **Impacto:** Dificulta la navegación del código y puede generar confusión sobre cuál es el dashboard real.
- **Solución recomendada:** Confirmar referencias, revisar el árbol de rutas y decidir si se mueve a una ruta con nombre explícito o se elimina mediante un cambio autorizado separado.
- **Alternativa:** Mantenerlo si es una maqueta intencional, documentando su propósito y evitando que se confunda con la pantalla funcional.
- **Verificación:** Revisar referencias/importaciones y ejecutar build/rutas una vez decidido el tratamiento.

- **Categoría:** Configuración / Dependencias
- **Severidad:** Alta para desarrollo local
- **Estado:** Corrección aplicada; pendiente de verificación local
- **Evidencia:** En `next.config.ts`, la configuración de `turbopack.rules` declaraba `loaders: ["@tailwindcss/turbopack"]`, pero el paquete no aparece instalado en `npm ls`. El proyecto ya configura `@tailwindcss/postcss` en `postcss.config.mjs`.
- **Problema / causa raíz:** Next.js falla al compilar `src/app/globals.css` porque intenta resolver el cargador inexistente.
- **Impacto:** La aplicación no puede iniciar la compilación de la página de login en el entorno local.
- **Solución aplicada:** Se retiró la regla personalizada de CSS de Turbopack y se conservó la configuración PostCSS existente. No se añadió una dependencia nueva.
- **Alternativa:** Instalar y mantener un cargador personalizado solo si existe una necesidad técnica demostrada; no se recomienda para esta configuración.
- **Verificación:** Actualizar la rama local, reiniciar `npm run dev` y abrir `/login`; después ejecutar `npm run build`. Mantener este issue hasta observar resultados reales.

- **Categoría:** Diseño / Compatibilidad de navegador
- **Severidad:** Baja
- **Estado:** Corrección aplicada; pendiente de verificación visual
- **Evidencia:** En la captura de la prueba manual del login en Microsoft Edge aparecen dos iconos de ojo dentro del campo de contraseña. En `src/app/login/page.tsx` el formulario solo declara un botón de visibilidad con los iconos de `lucide-react`; el control adicional es consistente con el indicador nativo de revelar contraseña del navegador.
- **Problema / causa raíz:** El control nativo de Edge se presenta junto al botón de visibilidad propio del formulario, duplicando la affordance.
- **Impacto:** Confusión visual y funcional sobre qué control usar.
- **Solución aplicada:** Se añadió CSS para ocultar los pseudo-elementos `::-ms-reveal` y `::-ms-clear` dentro del control de contraseña, manteniendo el botón accesible propio del formulario.
- **Alternativa:** Retirar el botón propio y depender del control del navegador; no se recomienda porque su presentación y accesibilidad son menos consistentes entre navegadores.
- **Verificación:** Actualizar la rama local, recargar en Edge y confirmar que queda un solo ojo y que el botón sigue mostrando/ocultando la contraseña.

- **Categoría:** Calidad / Compatibilidad con Next.js
- **Severidad:** Media
- **Estado:** Corrección aplicada; pendiente de verificación local
- **Evidencia:** La salida local de `npm run dev` reporta `Route "/login": Next.js encountered the unstable value 'new Date()' in a Client Component` y señala `src/app/login/page.tsx:134`, en la expresión `new Date().getFullYear()`.
- **Problema / causa raíz:** El año se calcula directamente durante el renderizado de un Client Component con Cache Components habilitado.
- **Impacto:** Next.js reporta un error de prerenderizado/valor inestable en la ruta de login.
- **Solución aplicada:** El año ahora se inicializa en un `useEffect`, y el renderizado inicial usa una cadena vacía estable; así se evita evaluar `new Date()` durante el renderizado.
- **Alternativa:** Retirar Cache Components solo si una revisión de arquitectura demuestra que no corresponde al diseño del proyecto; no se recomienda cambiarlo para ocultar este error puntual.
- **Verificación:** Reiniciar el servidor, abrir `/login`, comprobar que el error no vuelve a aparecer y ejecutar `npm run build`.

## OEI-CONFIG-001 — Cache Components está habilitado sin configurar Partial Prefetching

- **Categoría:** Configuración / Mantenibilidad
- **Severidad:** Baja
- **Estado:** Pendiente de decisión
- **Evidencia:** La salida local de Next.js muestra la advertencia `cacheComponents is enabled without a corresponding partialPrefetching option`.
- **Problema / causa raíz:** `next.config.ts` activa `cacheComponents: true` sin declarar `partialPrefetching`.
- **Impacto:** Advertencia de configuración y posible cambio de comportamiento por defecto en una versión futura de Next.js.
- **Solución recomendada:** Revisar la intención de usar Cache Components y configurar explícitamente `partialPrefetching` según las necesidades y compatibilidad del proyecto.
- **Alternativa:** Mantener la configuración temporalmente mientras se valida el comportamiento, aceptando la advertencia.
- **Verificación:** Ejecutar el servidor y build después de una decisión autorizada y comprobar que la advertencia desaparece.

- **Categoría:** Calidad / Build
- **Severidad:** Alta
- **Estado:** Corrección aplicada; pendiente de verificación local
- **Evidencia:** La salida local de `npm run build` compila el bundle, pero falla durante TypeScript con TS2307: `src/core/components/form/input-field.tsx` no encuentra `@/utils/const` (línea 7) ni `@/utils/function` (línea 8); `src/core/components/form/submit-button.tsx` tampoco encuentra `@/utils/const` (línea 3). `tsconfig.json` define el alias `@/*` como `./src/*`.
- **Problema / causa raíz:** Los imports apuntan a módulos que TypeScript no logra resolver con la configuración actual. Aún debe verificarse si faltan los archivos bajo `src/utils/`, si sus nombres/capitalización difieren o si hay otra discrepancia de rutas.
- **Impacto:** `npm run build` falla; el estado actual no puede considerarse listo para producción.
- **Solución aplicada:** Se actualizaron los imports de `input-field.tsx` y `submit-button.tsx` a `@/core/utils/const` y `@/core/utils/function`, donde existen las definiciones correspondientes.
- **Alternativa:** Si los utilitarios se movieron intencionalmente, actualizar los imports a sus ubicaciones canónicas y comprobar que no se duplique lógica.
- **Verificación:** Ejecutar `npm run build` y confirmar que TypeScript termina sin TS2307; luego ejecutar las pruebas pertinentes.


## OEI-DS-001 — Página visual del Design System pendiente de validación

- **Categoría:** Diseño / Accesibilidad
- **Severidad:** Media
- **Estado:** Implementación aplicada en rama; pendiente de prueba visual y de compilación
- **Evidencia:** Se creó la ruta `src/app/design-system/page.tsx` para mostrar temas, tokens semánticos, tipografía, botones, campos y estados; los estilos se aislaron bajo el prefijo `.ds-` en `src/app/globals.css`. En esta tarea el selector se redujo a `oscuro` y `claro`, y las paletas numeradas se retiraron.
- **Problema / causa raíz:** El repositorio tenía tokens y estilos base, pero no una página central para inspeccionar visualmente la biblioteca.
- **Impacto:** El equipo no disponía de una vista única para revisar y presentar los fundamentos visuales.
- **Solución aplicada:** Se agregó una página de catálogo con selector de dos temas (Oscuro y Claro), muestras de tokens, tipografía, componentes y estados semánticos. No modifica autenticación ni lógica de negocio.
- **Alternativa:** Usar una herramienta de documentación de componentes externa; por rapidez y menor dependencia, se implementó una ruta interna.
- **Verificación:** Actualizar la rama, ejecutar `npm run build`, abrir `/design-system`, probar selector/búsqueda y revisar responsive y navegación por teclado.

## OEI-AUTH-RESP-001 — Diseño responsive del formulario de inicio de sesión

- **Categoría:** Diseño / Experiencia de usuario / Compatibilidad
- **Severidad:** Media
- **Estado:** Ajustes responsive aplicados en rama; pendiente de comprobación visual en dispositivos y anchos reales
- **Evidencia:** La pantalla de login utiliza una sola columna y contaba con reglas generales para pantallas menores de 54rem, pero no diferenciaba suficientemente móviles pequeños, tablets y ventanas de poca altura.
- **Problema / causa raíz:** El formulario podía conservar espacios y tamaños propios de escritorio en móviles estrechos, y los campos no declaraban un tamaño de fuente mínimo para evitar el zoom automático de Safari en iOS.
- **Impacto:** Posible exceso de desplazamiento, textos ajustados, controles estrechos y una experiencia desigual según el tamaño de pantalla.
- **Solución aplicada:** Se añadieron reglas específicas para tablets y móviles, ajustes para anchos de hasta 360px, controles táctiles más cómodos, fuente de 16px en campos móviles, manejo de ventanas de poca altura y respeto a la preferencia de movimiento reducido. No se alteró la lógica de validación ni el diseño de escritorio.
- **Verificación pendiente:** Revisar la ruta de login en anchos aproximados de 360px, 390px, 768px, 1024px y 1440px; comprobar que no exista desplazamiento horizontal, que los campos y el botón sean utilizables, que los mensajes de error no rompan el diseño y que el teclado móvil no tape los controles.
- **Alcance:** Cambios de CSS únicamente. No se conectó backend ni se modificó la autenticación.

## OEI-DS-002 — Icono Search utilizado sin importación en la página del Design System

- **Categoría:** Calidad / Build
- **Severidad:** Alta
- **Estado:** Corrección aplicada en main; pendiente de verificación local
- **Fecha de detección:** 2026-11-03 (America/El_Salvador)
- **Evidencia de detección:** La captura inicial del 2026-11-03 mostraba `ReferenceError: Search is not defined` en `src/app/design-system/page.tsx:64`; la inspección de esa versión confirmó que `Search` se usaba sin importarse. El archivo actual en `main` ya incluye la importación.
- **Problema / causa conocida:** El identificador `Search` se referencia sin estar declarado ni importado en el módulo.
- **Impacto:** TypeScript puede detener la compilación con un error de identificador no encontrado; por tanto, el build no debe considerarse validado.
- **Solución aplicada:** Se añadió `Search` a la importación desde `lucide-react` en `src/app/design-system/page.tsx`.
- **Verificación:** La captura aportada el 2026-11-03 confirma el error de runtime `ReferenceError: Search is not defined` en la línea 64. La importación ya está aplicada en `main`; pendiente volver a abrir `/design-system` y ejecutar `npm run lint` y `npm run build`.

## OEI-DOC-001 — Falta el historial permanente LOG.md

- **Categoría:** Documentación / Trazabilidad
- **Severidad:** Baja
- **Estado:** Pendiente de creación
- **Fecha de detección:** 2026-11-03 (America/El_Salvador)
- **Evidencia:** La consulta de `LOG.md` en la rama `main` devolvió HTTP 404 (NOT_FOUND); `CLAUDE.md` y `AGENTS.md` sí existen.
- **Problema / causa conocida:** El repositorio no contiene el archivo de historial permanente solicitado por las reglas del proyecto.
- **Impacto:** Se pierde un registro acumulativo y verificable de cambios, decisiones y pruebas realizadas.
- **Solución recomendada:** Crear `LOG.md` con una entrada inicial que registre cambios históricos solo cuando estén respaldados por commits/PR y diferencie claramente las verificaciones pendientes.
- **Verificación:** Confirmar que el archivo exista en `main` y que las entradas incluyan fecha/hora con zona horaria, motivo, rutas, decisión y pruebas realmente ejecutadas. No se creó en esta tarea porque la autorización recibida cubre la actualización de `fix.md`, no la creación de un archivo adicional.

## OEI-VERIFY-001 — Lint y build de main pendientes de ejecución

- **Categoría:** Calidad / Integración
- **Severidad:** Media
- **Estado:** Pendiente de ejecución
- **Fecha de detección:** 2026-11-03 (America/El_Salvador)
- **Evidencia:** `package.json` define `lint` como `eslint` y `build` como `next build`. Esta sesión permite inspeccionar y actualizar archivos mediante GitHub, pero no dispone de un checkout local ni terminal para ejecutar scripts npm. No se encontró evidencia de una ejecución CI asociada a los archivos inspeccionados.
- **Problema / causa conocida:** No hay resultados actuales verificables de `npm run lint` ni `npm run build` para la punta de `main`.
- **Impacto:** No puede afirmarse que el estado actual de la rama pase lint o compile correctamente.
- **Solución recomendada:** En un checkout actualizado de `main`, ejecutar ambos comandos y registrar la salida íntegra; corregir los errores resultantes mediante una autorización de cambio de código.
- **Verificación:** Issue cerrable únicamente cuando existan logs de ambos comandos ejecutados sobre el commit correspondiente y ambos finalicen correctamente.

## OEI-DS-003 — ThemeInitScript renderiza un elemento script directamente desde React

- **Categoría:** Compatibilidad React / Next.js
- **Severidad:** Alta
- **Estado:** Corrección aplicada en main; pendiente de verificación local
- **Fecha de detección:** 2026-11-03 (America/El_Salvador)
- **Evidencia de detección:** La captura aportada desde `http://localhost:3000/design-system` muestra `Encountered a script tag while rendering React component`, con referencia a `src/core/components/theme/theme-init-script.tsx:28`. La versión inspeccionada entonces devolvía un `<script>` HTML crudo; el código actual reemplaza ese patrón por `next/script`.
- **Problema / causa conocida:** El componente React renderiza un elemento `script` crudo. React indica que los scripts dentro de componentes React no se ejecutan durante el renderizado cliente y reporta el uso de este elemento como error.
- **Impacto:** La ruta `/design-system` no renderiza correctamente. Además, el script destinado a establecer el tema antes del primer pintado no tiene una integración compatible confirmada.
- **Solución aplicada:** `ThemeInitScript` ahora utiliza `Script` de `next/script` con `strategy="beforeInteractive"` e identificador estable. Se monta desde el layout raíz dentro de `<body>`; Next.js documenta que esta estrategia se inyecta en `<head>` y se ejecuta antes de la hidratación.
- **Alternativa considerada:** Mantener un `<script>` HTML crudo; descartada porque React reportó el error mostrado en la captura.
- **Verificación pendiente:** Reiniciar el servidor, abrir `/design-system`, comprobar que desaparece el error de script, confirmar que el tema guardado se aplica antes de la hidratación y probar migración de preferencias heredadas. Ejecutar además `npm run lint` y `npm run build`. La documentación oficial de Next.js describe `beforeInteractive` para scripts globales en el layout raíz.


## OEI-USER-001 — El dashboard utiliza datos de demostración

- **Categoría:** Integridad de datos / Funcionalidad
- **Severidad:** Media
- **Estado:** Pendiente de conexión con fuentes reales
- **Fecha de detección:** 2026-11-09 (America/El_Salvador)
- **Evidencia:** src/core/utils/demo-data.ts define estadísticas, actividad reciente y valores mensuales como arreglos estáticos. El nuevo dashboard calcula sus indicadores a partir de esas mismas colecciones.
- **Problema / causa conocida:** Los indicadores, el mapa, el ranking, la gráfica y la actividad representan datos de ejemplo, no consultas a la base de datos ni respuestas del backend.
- **Impacto:** Si se interpretan como información institucional real, pueden inducir a decisiones incorrectas.
- **Solución aplicada:** El dashboard muestra una identificación visible de “Datos de demostración” y los textos de sus componentes mantienen esa aclaración.
- **Solución pendiente:** Definir contratos y endpoints reales del backend para cada indicador; reemplazar las colecciones estáticas por datos validados del servidor.
- **Verificación:** Comparar cada indicador con una fuente real y probar estados vacíos, errores y permisos cuando se conecte el backend.

## OEI-USER-002 — Componentes visuales heredados no están alineados completamente con los tokens del sistema de diseño

- **Categoría:** UI/UX / Mantenibilidad
- **Severidad:** Media
- **Estado:** Pendiente de refactorización visual
- **Fecha de detección:** 2026-11-09 (America/El_Salvador)
- **Evidencia:** Los componentes reutilizados src/components/MetricCard.tsx, MonthlyChart.tsx, DepartmentMap.tsx, TerritorialRanking.tsx y RecentActivity.tsx contienen paletas fijas, valores hexadecimales y estilos inline; CLAUDE.md establece que los colores deben proceder de los tokens semánticos.
- **Problema / causa conocida:** Estos componentes provienen de una implementación visual anterior y no están completamente integrados con los temas oscuro y claro.
- **Impacto:** Puede haber inconsistencias visuales entre temas y mayor coste al mantener colores y estados.
- **Solución recomendada:** Migrar gradualmente colores y superficies a tokens semánticos, conservando el comportamiento del mapa, la selección, el ranking y los controles de periodo.
- **Verificación:** Revisar las cinco piezas en ambos temas, contraste WCAG AA, foco de teclado y responsive.

## OEI-USER-003 — Navegación del menú contiene destinos que no corresponden a las rutas actuales de autenticación

- **Categoría:** Funcionalidad / Navegación
- **Severidad:** Media
- **Estado:** Pendiente de revisión
- **Fecha de detección:** 2026-11-09 (America/El_Salvador)
- **Evidencia:** src/components/Sidebar.tsx enlaza “Cerrar sesión” a /login, mientras que la ruta de acceso inspeccionada es /auth/iniciar-sesion. El enlace de dashboard apunta a /, que redirige según la sesión.
- **Problema / causa conocida:** El menú conserva rutas de una maqueta anterior; el enlace de cerrar sesión no demuestra que se revoque la sesión del servidor.
- **Impacto:** El usuario puede llegar a una ruta inexistente y la acción etiquetada como cerrar sesión puede no cerrar realmente la sesión.
- **Solución recomendada:** Implementar o conectar una acción de logout que invoque el endpoint de cierre, elimine la cookie desde el servidor y redirija al inicio de sesión. Corregir los destinos del menú con rutas confirmadas.
- **Verificación:** Comprobar que el token se revoca, la cookie se elimina y el usuario no puede volver a /dashboard tras cerrar sesión.


## OEI-USER-004 — Validación automatizada del dashboard pendiente en feat/user

- **Categoría:** Calidad / Integración
- **Severidad:** Media
- **Estado:** Pendiente de ejecución
- **Fecha de detección:** 2026-11-09 (America/El_Salvador)
- **Evidencia:** Se añadieron las rutas y componentes del dashboard en la rama feat/user. Esta sesión permite inspeccionar y actualizar el repositorio mediante GitHub, pero no dispone de un checkout local ni de node_modules para ejecutar ESLint, TypeScript o Next.js.
- **Problema / causa conocida:** Los cambios todavía no cuentan con resultados de lint, typecheck, build ni pruebas manuales de navegación y sesión.
- **Impacto:** No puede afirmarse que la implementación compile o que la protección de sesión funcione en ejecución.
- **Solución recomendada:** Actualizar la rama local, ejecutar npm run lint, npx next typegen, npx tsc --noEmit y npm run build; después probar /dashboard con sesión ausente, válida e inválida.
- **Verificación:** Mantener pendiente hasta disponer de las salidas reales de los comandos y las pruebas de acceso.

## OEI-THEME-001 — ThemeProvider actualiza estado síncronamente dentro de un efecto

- **Categoría:** Calidad / React Hooks
- **Severidad:** Media
- **Estado:** Corrección aplicada en feat/user; pendiente de verificación local
- **Fecha de detección:** 2026-11-09 (America/El_Salvador)
- **Evidencia:** La ejecución local de `npm run lint` reportó un error `react-hooks/set-state-in-effect` en `src/core/components/theme/theme-provider.tsx:104`, en la llamada `setThemeState(next)` dentro del efecto de inicialización.
- **Problema / causa conocida:** El tema se mantenía como estado React duplicado respecto al atributo `data-theme` del documento, y el efecto sincronizaba ambos mediante una actualización síncrona de estado.
- **Impacto:** ESLint marca un error y la sincronización redundante puede provocar un render adicional.
- **Solución aplicada:** Se sustituyó el estado duplicado del tema por `useSyncExternalStore`, usando el atributo `data-theme` como snapshot externo y un evento propio para notificar cambios realizados por el proveedor. Se conservaron la lectura/migración de localStorage, el cambio de tema, la sincronización entre pestañas y el estado `mounted`.
- **Alternativa:** Diferir la llamada a `setState` con un temporizador; descartada porque solo aplaza el problema y no corrige el estado duplicado.
- **Verificación pendiente:** Ejecutar `npm run lint`, `npx next typegen`, `npx tsc --noEmit` y `npm run build`; probar tema oscuro/claro, persistencia tras recarga y sincronización entre pestañas. Esta sesión no dispone de terminal local ni de `node_modules`, por lo que no se afirma que las verificaciones hayan pasado.


## OEI-WORKSPACE-001 — Módulos de gestión implementados en modo local; integración y validación pendientes

- **Categoría:** Funcionalidad / Persistencia / Integración
- **Severidad:** Media para demostración; alta si se pretende usar como sistema institucional productivo
- **Estado:** Implementación aplicada en `feat/user`; pendiente de validación local y aceptación funcional
- **Fecha de actualización:** 2026-11-12 (America/El_Salvador)
- **Evidencia:** Se incorporaron vistas de gestión para equipos, personas, proyectos, ubicaciones, historial, reportes y configuración mediante una interfaz reutilizable; formulario de nueva acta para laptop, tablet y proyector; listado de actas con búsqueda, filtro y exportación CSV; mapa Leaflet que representa ubicaciones que tengan latitud y longitud; indicadores del dashboard que leen los conteos locales. Los registros se almacenan en `localStorage` bajo claves versionadas `oei-demo:*:v1`.
- **Problema / limitación conocida:** Estos registros existen únicamente en el navegador que los crea. No se sincronizan entre usuarios ni dispositivos, no llegan a PostgreSQL y pueden perderse al borrar los datos del navegador. El mapa solo puede colocar puntos si se capturan coordenadas válidas. El respaldo completo permite exportar un JSON local, pero todavía no implementa restauración.
- **Autenticación de demostración:** Se agregó una sesión local mediante cookie HttpOnly y endpoint `/api/demo/session`, habilitada exclusivamente cuando `NODE_ENV` no es `production`. El acceso institucional real sigue dependiendo del backend y no se considera implementado por esta demostración.
- **Solución aplicada:** Crear operaciones locales de alta, edición, eliminación, búsqueda y exportación; registrar movimientos de demostración; añadir el acceso de demostración en desarrollo y mantener la integración real de autenticación/BD separada.
- **Riesgos residuales:** No usar esta persistencia como registro oficial ni almacenar datos personales reales o información sensible. No habilitar el modo de demostración en producción. Revisar la seguridad de los endpoints de autenticación existentes antes de una publicación.
- **Verificación pendiente:** Ejecutar `npm run lint`, `npx next typegen`, `npx tsc --noEmit` y `npm run build`; probar el flujo completo de cada módulo, almacenamiento tras recarga, exportaciones, mapa con coordenadas y sesión demo en desarrollo. No se ejecutaron esas verificaciones desde esta sesión.


## OEI-AUTH-002 — El proxy no reconoce la cookie de sesión de demostración

- **Categoría:** Funcionalidad / Autenticación de demostración
- **Severidad:** Alta para la prueba funcional local
- **Estado:** Corrección aplicada en `feat/user`; pendiente de verificación local
- **Fecha de detección:** 2026-11-12 (America/El_Salvador)
- **Evidencia:** `src/app/api/demo/session/route.ts` establece la cookie HttpOnly `oei_demo_session=local-demo` en desarrollo y `src/core/server/auth/session.ts` la reconoce en `verifySession()` y `requireSession()`. Sin embargo, `src/proxy.ts` solo consultaba `SESSION_COOKIE_NAME` y protegía `/dashboard` usando exclusivamente esa cookie institucional.
- **Problema / causa raíz:** El flujo de demostración crea una sesión válida para el layout protegido, pero el proxy no reconoce esa cookie y redirige la navegación hacia el login antes de que el dashboard pueda renderizarse.
- **Impacto:** El botón «Entrar en modo demostración» puede parecer que no hace nada o devolver al usuario a la pantalla de acceso.
- **Solución aplicada:** El proxy ahora reconoce `oei_demo_session=local-demo` únicamente cuando `NODE_ENV !== "production"`. La cookie demo se considera para las redirecciones y el acceso a rutas protegidas; la validación definitiva sigue en `requireSession()`.
- **Alternativa:** Quitar la protección del proxy para `/dashboard`; descartada porque debilitaría la navegación protegida.
- **Verificación pendiente:** Actualizar `feat/user`, reiniciar el servidor de desarrollo y probar acceso demo, recarga de `/dashboard`, acceso anónimo y comportamiento en producción. No se ejecutaron pruebas ni build desde esta sesión.
