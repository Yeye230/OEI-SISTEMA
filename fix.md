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

## OEI-AUTH-001 — El formulario de inicio de sesión aún no autentica

- **Categoría:** Funcionalidad / Seguridad
- **Severidad:** Alta para puesta en producción
- **Estado:** Pendiente de integración
- **Evidencia:** `src/app/login/page.tsx`: `handleSubmit` valida el correo y la contraseña en cliente y muestra un mensaje; no realiza una solicitud al endpoint de autenticación.
- **Problema / causa raíz:** La pantalla es un prototipo visual, no un flujo de autenticación funcional.
- **Impacto:** Ningún usuario puede iniciar sesión desde este formulario; el diseño por sí solo no protege recursos.
- **Solución recomendada:** Integrar el endpoint de autenticación existente, manejar estados de carga/error y validar en servidor; nunca tratar la validación del navegador como autenticación.
- **Alternativa:** Si la autenticación ya se implementa en otra ruta, conectar el formulario al contrato real de esa ruta.
- **Verificación:** Pruebas de éxito, credenciales incorrectas, fallo de red, cookie segura, redirección y acceso denegado a recursos privados.
- **Alcance:** Se mantiene pendiente; esta tarea mejora interfaz y sistema de diseño, no cambia la autenticación backend.

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

## OEI-ENV-001 — Configuración de Turbopack referencia un cargador CSS inexistente

- **Categoría:** Configuración / Dependencias
- **Severidad:** Alta para desarrollo local
- **Estado:** Corrección aplicada; pendiente de verificación local
- **Evidencia:** En `next.config.ts`, la configuración de `turbopack.rules` declaraba `loaders: ["@tailwindcss/turbopack"]`, pero el paquete no aparece instalado en `npm ls`. El proyecto ya configura `@tailwindcss/postcss` en `postcss.config.mjs`.
- **Problema / causa raíz:** Next.js falla al compilar `src/app/globals.css` porque intenta resolver el cargador inexistente.
- **Impacto:** La aplicación no puede iniciar la compilación de la página de login en el entorno local.
- **Solución aplicada:** Se retiró la regla personalizada de CSS de Turbopack y se conservó la configuración PostCSS existente. No se añadió una dependencia nueva.
- **Alternativa:** Instalar y mantener un cargador personalizado solo si existe una necesidad técnica demostrada; no se recomienda para esta configuración.
- **Verificación:** Actualizar la rama local, reiniciar `npm run dev` y abrir `/login`; después ejecutar `npm run build`. Mantener este issue hasta observar resultados reales.

## OEI-UI-002 — El navegador muestra un segundo icono para revelar la contraseña

- **Categoría:** Diseño / Compatibilidad de navegador
- **Severidad:** Baja
- **Estado:** Corrección aplicada; pendiente de verificación visual
- **Evidencia:** En la captura de la prueba manual del login en Microsoft Edge aparecen dos iconos de ojo dentro del campo de contraseña. En `src/app/login/page.tsx` el formulario solo declara un botón de visibilidad con los iconos de `lucide-react`; el control adicional es consistente con el indicador nativo de revelar contraseña del navegador.
- **Problema / causa raíz:** El control nativo de Edge se presenta junto al botón de visibilidad propio del formulario, duplicando la affordance.
- **Impacto:** Confusión visual y funcional sobre qué control usar.
- **Solución aplicada:** Se añadió CSS para ocultar los pseudo-elementos `::-ms-reveal` y `::-ms-clear` dentro del control de contraseña, manteniendo el botón accesible propio del formulario.
- **Alternativa:** Retirar el botón propio y depender del control del navegador; no se recomienda porque su presentación y accesibilidad son menos consistentes entre navegadores.
- **Verificación:** Actualizar la rama local, recargar en Edge y confirmar que queda un solo ojo y que el botón sigue mostrando/ocultando la contraseña.

## OEI-ENV-002 — El año dinámico del pie de login bloquea el prerenderizado

- **Categoría:** Calidad / Compatibilidad con Next.js
- **Severidad:** Media
- **Estado:** Pendiente de corrección y verificación
- **Evidencia:** La salida local de `npm run dev` reporta `Route "/login": Next.js encountered the unstable value 'new Date()' in a Client Component` y señala `src/app/login/page.tsx:134`, en la expresión `new Date().getFullYear()`.
- **Problema / causa raíz:** El año se calcula directamente durante el renderizado de un Client Component con Cache Components habilitado.
- **Impacto:** Next.js reporta un error de prerenderizado/valor inestable en la ruta de login.
- **Solución recomendada:** Evitar evaluar `new Date()` durante el renderizado; para este texto de pie, inicializar el año tras el montaje con un efecto y mantener una salida inicial estable, o usar una constante estable si el requisito funcional lo permite.
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
