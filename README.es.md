# ⏱️ TimeTrack

**🌐 Idioma:** [English](./README.md) | Español

### Gestión de horas, reportes y seguimiento de pagos en USDT

TimeTrack es una aplicación web que permite registrar horas de trabajo por proyecto, generar reportes mensuales y realizar seguimiento de pagos en USDT. Ofrece funcionalidades específicas según el rol del usuario: empleado, supervisor o administrador.

> Este repositorio contiene el cliente web. La API se desarrolla por separado en `payment-system`.

## 📸 Vista previa

### Dashboard
<img width="1855" height="969" alt="image" src="https://github.com/user-attachments/assets/199d9a88-164e-4c0f-87f5-dcee2aff66b8" />

### Registro de horas
<img width="1911" height="958" alt="Captura de pantalla 2026-10-23 a la(s) 9 07 25 a m" src="https://github.com/user-attachments/assets/9b8a0c45-73e1-41b5-a32d-e1b05058f921" />

## ✨ Funcionalidades

- 📊 **Dashboard:** resumen de horas trabajadas, reportes recientes e historial de pagos.
- 🕒 **Registro de horas:** creación, edición y eliminación de registros por fecha y proyecto, con filtros y agrupación diaria.
- 📄 **Reportes mensuales:** generación, consulta, aprobación y rechazo de reportes en PDF.
- 📂 **Reportes históricos:** carga y consulta de reportes antiguos en PDF.
- 💸 **Pagos en USDT:** consulta de pagos, filtros por estado y solicitud de verificación de transacciones.
- 👛 **Wallets:** administración de direcciones de billeteras y selección de una wallet predeterminada.
- ⚙️ **Configuración:** administración del perfil, firma digital, tarifa por hora y proyectos según permisos.
- 🔐 **Control de acceso:** navegación y funcionalidades diferenciadas según el rol del usuario. La autorización de las operaciones corresponde a la API.

## 🛠️ Tecnologías

| Área | Tecnología |
| --- | --- |
| Interfaz | React 19 y TypeScript |
| Desarrollo y compilación | Vite |
| Componentes y estilos | Ant Design y Tailwind CSS |
| Navegación | React Router |
| Estado remoto y caché | TanStack Query |
| Comunicación con la API | Axios |
| Formularios y validación | Ant Design Form y Yup |
| Fechas y notificaciones | Day.js y Sonner |
| Internacionalización | i18next y react-i18next |

## 🚀 Inicio local

### Requisitos

- Node.js compatible con la versión de Vite utilizada en el proyecto.
- Yarn Classic `1.22.22`.
- Acceso a una instancia de la API de TimeTrack.

### 1. Instalar dependencias

Clona el repositorio y ejecuta:

```bash
yarn install
```

### 2. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```dotenv
VITE_API_URL=https://tu-api.example.com
```

Reemplaza la URL por la dirección de tu API.

> Las variables con prefijo `VITE_` son accesibles desde el navegador. No almacenes credenciales ni información sensible en ellas.

### 3. Iniciar el proyecto

```bash
yarn dev
```

Abre la dirección local indicada por Vite en la terminal.

La API debe estar disponible y configurada para permitir solicitudes desde el origen del frontend.

## 📦 Comandos disponibles

| Comando | Descripción |
| --- | --- |
| `yarn dev` | Inicia el servidor de desarrollo. |
| `yarn build` | Comprueba TypeScript y genera la compilación de producción. |
| `yarn preview` | Previsualiza la compilación de producción. |
| `yarn lint` | Ejecuta ESLint. |
| `yarn format` | Aplica formato con Prettier. |

## 🌐 Despliegue

El frontend de TimeTrack está desplegado mediante **Cloudflare Workers**.

**Aplicación web:** [TimeTrack]()

La API, desarrollada con NestJS y MongoDB, se administra y despliega de manera independiente.

## 🤝 Contribuciones y Colaboradores

- Backend: Samuel Ramírez (@SamuelR099) — Desarrollo de la API con NestJS y MongoDB.

Para mantener la consistencia del proyecto:

- Reutilizar componentes, hooks y utilidades existentes.
- Seguir las convenciones de código establecidas.
- Utilizar mensajes de commit basados en Conventional Commits.
- Consultar [ARCHITECTURE.md](./ARCHITECTURE.md) para conocer las convenciones técnicas del proyecto.

---

