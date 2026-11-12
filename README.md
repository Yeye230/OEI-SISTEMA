# OEI · Gestión de Actas

Aplicación web para administrar actas de entrega de equipos institucionales, inventario, personas, proyectos y seguimiento territorial.

## Requisitos

- Node.js compatible con la versión definida por el proyecto.
- npm.

## Ejecución local

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Acceso de demostración

En entorno de desarrollo, la pantalla `/auth/iniciar-sesion` ofrece **Entrar en modo demostración**. Este acceso crea una cookie HttpOnly de demostración y permite navegar por los módulos sin conectar el backend.

El acceso de demostración se deshabilita cuando `NODE_ENV=production`. El formulario de acceso institucional requiere que el backend y sus endpoints estén disponibles.

## Módulos disponibles

- **Dashboard:** indicadores que se actualizan con los registros locales de actas, equipos, personas y proyectos. Los gráficos territoriales existentes contienen datos de muestra.
- **Nueva acta:** formulario para entregas de laptop, tablet y proyector.
- **Actas registradas:** listado, búsqueda, filtro por tipo y exportación CSV.
- **Equipos, personas y proyectos:** alta, consulta, edición, eliminación y búsqueda.
- **Mapa territorial:** captura de ubicaciones y visualización de puntos cuando se proporcionan coordenadas válidas.
- **Historial:** movimientos generados por las operaciones realizadas en los módulos locales.
- **Reportes:** exportación CSV del módulo y descarga de respaldo JSON de los datos locales.
- **Configuración:** registro local de preferencias institucionales.

## Persistencia y límites de la demostración

Los datos de los módulos se guardan en `localStorage` del navegador. Por lo tanto:

- No se guardan en PostgreSQL ni en otro servidor.
- No se comparten entre usuarios, equipos o navegadores.
- Se pueden perder al limpiar los datos del navegador.
- No se deben introducir datos personales reales ni información institucional sensible.
- El respaldo JSON permite conservar una copia, pero todavía no hay función de restauración.

Esta capa local está aislada para facilitar su sustitución por servicios/API cuando se autorice la integración con la base de datos.

## Verificación antes de integrar o desplegar

```bash
npm run lint
npx next typegen
npx tsc --noEmit
npm run build
```

Además, probar el acceso demo, navegación, CRUD de cada módulo, persistencia tras recarga, exportaciones y mapa con coordenadas. No considerar la demostración como autenticación institucional ni como sistema listo para producción hasta integrar y verificar backend, autorización, persistencia centralizada y controles de seguridad.

## Temas

El sistema conserva los temas institucionales `claro` y `oscuro`.
