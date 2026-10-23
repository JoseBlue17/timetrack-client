# Referencia de arquitectura — ClockLedger Client

**Alcance:** repositorio `timetrack-client`. Aplicación SPA desarrollada con React 19, TypeScript estricto, Vite, React Router, TanStack Query, Axios, Ant Design y Tailwind CSS.

El backend, desarrollado en el repositorio independiente `payment-system`, queda fuera del alcance de esta documentación.

## Organización y ubicación de cada pieza

| Pieza                         | Ubicación y ejemplo existente                                                                                                                                                                                                                                                                                                                                                   |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Funcionalidad de negocio      | `src/modules/<módulo>/`: `dashboard`, `timesheets`, `reports`, `payments`, `settings`, `sign-in` y `sign-up`. Cada módulo expone su página desde `index.ts`, como `src/modules/timesheets/index.ts`.                                                                                                                                                                            |
| Página y composición          | `modules/<módulo>/pages/*.page.tsx`; `src/modules/timesheets/pages/timesheets.page.tsx` conecta el hook de pantalla con pestañas y modal.                                                                                                                                                                                                                                       |
| UI del módulo                 | `modules/<módulo>/components/`; por ejemplo, `src/modules/timesheets/components/timesheet-form-modal.tsx`. Las columnas complejas se separan en archivos como `timesheets-table.columns.tsx`.                                                                                                                                                                                   |
| UI compartida y layout        | `src/components/`: `empty-state.tsx`, `loading-box.tsx`, `status-tag.tsx`, `page-header/`, `user-avatar/` y `layout/app-layout/`.                                                                                                                                                                                                                                               |
| Lógica de pantalla            | `modules/<módulo>/hooks/`; `src/modules/payments/hooks/use-payments-table.ts` compone consultas, mutaciones, filtros y selección.                                                                                                                                                                                                                                               |
| Acceso a datos                | Hooks del módulo sobre `Http`/`PublicHttp` de `src/config/http/index.ts`; por ejemplo, `src/modules/payments/hooks/use-get-payments.ts`. No existe una capa general de servicios o repositorios.                                                                                                                                                                                |
| Hooks transversales           | `src/hooks/`: `use-auth.tsx`, `use-user-role.ts`, `use-form-error-handler.ts`, `use-scroll-load-more.ts` y `use-invalidate-queries.ts`.                                                                                                                                                                                                                                         |
| Contratos y tipos             | Dominio compartido en `src/interfaces/index.ts` (`IUser`, `IPayment`, `IWallet`, `IPaginatedResponse<T>`); contratos de módulo en `*.interface.ts`, como `src/modules/timesheets/timesheet.interface.ts`. Props y payloads locales se declaran junto al consumidor. `src/enums/index.ts` utiliza objetos `as const` y uniones; `src/types/` contiene declaraciones ambientales. |
| Transformaciones y utilidades | `src/helpers/`, como `group-timesheets-by-date.ts` y `timesheet-form.ts`. Las utilidades específicas pueden ubicarse dentro del módulo, como `src/modules/reports/helpers/map-monthly-report.ts`. `src/tools/` contiene `cn.ts` y conversiones de archivos.                                                                                                                     |
| Infraestructura               | Arranque en `src/main.tsx`; proveedores en `src/providers/`; sesión y coordinación de scroll en `src/contexts/`; rutas y permisos en `src/routes/`; claves de caché en `src/query-keys/index.ts`. Tema en `src/providers/antd-token.ts`, estilos en `src/index.css`, traducciones en `src/i18n/` y recursos visuales en `src/assets/` y `public/`.                              |

## Flujo y convenciones

La interfaz consume hooks de pantalla o de acceso a datos.

Las consultas utilizan `useQuery` y `useInfiniteQuery`, con claves de caché compartidas y parametrizadas. La paginación utiliza cursores y permite transformar o aplanar las páginas mediante `select`.

Las mutaciones utilizan `useMutation`, muestran notificaciones mediante `useShowError` y `useShowSuccess`, e invalidan las consultas afectadas para mantener los datos actualizados.

Axios centraliza la configuración de la URL base, el manejo de autenticación, los interceptores y la normalización de errores de la API. El archivo `src/config/http/error.ts` adapta los errores recibidos del servidor.

### Gestión del estado

- **TanStack Query:** administra el estado remoto, las consultas, mutaciones y caché.
- **React Context:** mantiene la sesión y la coordinación del scroll.
- **Hooks locales:** gestionan filtros, modales, formularios y estados de pantalla.

### Formularios y validaciones

Los formularios utilizan Ant Design y reglas reutilizables definidas en `src/constants/form-rules.ts`. También se emplea Yup para validaciones específicas, como las relacionadas con reportes.

### Convenciones de código

Se utilizan imports con el alias `@/`, nombres de archivo en kebab-case e imports explícitos de tipos.

La separación de responsabilidades es pragmática: los componentes pueden consumir hooks directamente y algunos hooks incluyen JSX o lógica de modales.

También existen tipos declarados junto a hooks y hooks ubicados en carpetas de componentes, como `use-timesheets-table.ts`.

Estas variantes forman parte de las convenciones actuales y no implican una arquitectura estrictamente basada en capas.

## Convenciones para nuevas implementaciones

Antes de desarrollar nuevas funcionalidades, se deben revisar y reutilizar los componentes, hooks, contratos, claves de caché y utilidades existentes.

Los cambios deben respetar la organización y las convenciones del proyecto, manteniendo la consistencia con las implementaciones actuales.

Cuando sea necesario introducir un patrón diferente, se debe justificar la decisión y evaluar su impacto en la mantenibilidad del código.

Se recomienda validar los cambios mediante pruebas, análisis estático y verificación de la compilación antes de integrarlos.
