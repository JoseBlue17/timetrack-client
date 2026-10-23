# ⏱️ ClockLedger

🌐 **Language:** English | [Español](./README.es.md)

### Time Tracking, Reports, and USDT Payment Management

ClockLedger is a web application designed to track working hours by project, generate monthly reports, and monitor USDT payments. It provides role-specific features for employees, supervisors, and administrators.

> This repository contains the web client. The API is developed separately in `payment-system`.

## 📸 Preview

### Dashboard

<img width="1855" height="969" alt="image" src="https://github.com/user-attachments/assets/63d50e01-e415-416d-ab63-5cd5b0903184" />

### Time Tracking

<img width="1911" height="958" alt="Captura de pantalla 2026-10-23 a la(s) 9 07 25 a m" src="https://github.com/user-attachments/assets/e20b1d74-53fd-483e-9e07-3f3d2f5a9a8d" />

## ✨ Features

- 📊 **Dashboard:** overview of worked hours, recent reports, and payment history.
- 🕒 **Time Tracking:** create, edit, and delete time entries by date and project, with filtering and daily grouping.
- 📄 **Monthly Reports:** generate, view, approve, and reject PDF reports.
- 📂 **Historical Reports:** upload and view previously generated PDF reports.
- 💸 **USDT Payments:** view payments, filter by status, and request transaction verification.
- 👛 **Wallets:** manage wallet addresses and select a default wallet.
- ⚙️ **Settings:** manage user profiles, digital signatures, hourly rates, and projects based on permissions.
- 🔐 **Access Control:** role-based navigation and features for employees, supervisors, and administrators. Operation authorization is enforced by the API.

## 🛠️ Tech Stack

| Category | Technology |
| --- | --- |
| Frontend | React 19 and TypeScript |
| Development and Build | Vite |
| UI Components and Styling | Ant Design and Tailwind CSS |
| Routing | React Router |
| Server State and Caching | TanStack Query |
| API Communication | Axios |
| Forms and Validation | Ant Design Form and Yup |
| Dates and Notifications | Day.js and Sonner |
| Internationalization | i18next and react-i18next |

## 🚀 Getting Started

### Prerequisites

- A Node.js version compatible with the project's Vite version.
- Yarn Classic `1.22.22`.
- Access to a running TimeTrack API instance.

### 1. Install Dependencies

Clone the repository and run:

```bash
yarn install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```dotenv
VITE_API_URL=https://your-api.example.com
```

Replace the example URL with your API endpoint.

> Environment variables prefixed with `VITE_` are exposed to the browser. Never store credentials or sensitive information in them.

### 3. Start the Development Server

```bash
yarn dev
```

Open the local URL displayed by Vite in your terminal.

The API must be running and configured to allow requests from the frontend origin.

## 📦 Available Scripts

| Command | Description |
| --- | --- |
| `yarn dev` | Starts the development server. |
| `yarn build` | Checks TypeScript and generates the production build. |
| `yarn preview` | Previews the production build locally. |
| `yarn lint` | Runs ESLint. |
| `yarn format` | Formats code using Prettier. |

## 🌐 Deployment

The ClockLedger frontend is deployed using **Cloudflare Workers**.

**Live Application:** [ClockLedger]()

The API, built with NestJS and MongoDB, is maintained and deployed independently.

## 🤝 Contributions and Collaborators

### Collaborators

- **Backend:** [Samuel Ramírez (@SamuelR099)](https://github.com/SamuelR099) — API development using NestJS and MongoDB.

### Contribution Guidelines

- Reuse existing components, hooks, and utilities.
- Follow the project's established coding conventions.
- Use commit messages following Conventional Commits.
- Refer to [ARCHITECTURE.md](./ARCHITECTURE.md) for technical conventions and project guidelines.

---
