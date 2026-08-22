# revup-dev 🚀

> A modern, interactive CLI to scaffold React 19 + Vite projects with clean folder architecture, TypeScript/JavaScript support, Tailwind CSS v4, dynamic path aliases, and curated library presets.

---

## ⚡ Quickstart

Run any of the following commands in your terminal to bootstrap a new project:

```bash
# Using npm
npm create revup-dev

# Or using npx directly
npx revup-dev

# Or using pnpm
pnpm create revup-dev

# Or using bun
bun create revup-dev
```

---

## 🌟 Key Features

- **⚡ React 19 & Vite 6 Ready**: Uses Vite's latest templates out of the box.
- **🔷 TypeScript & JavaScript**: Prompt-driven choice between **React + TypeScript (`react-ts`)** and **React + JavaScript (`react`)**.
- **🎨 Tailwind CSS v4**: Zero-friction setup with `@import "tailwindcss";` in `src/index.css` and `@tailwindcss/vite`.
- **📁 Structured Directory Architecture**: Creates organized directories inside `src/` (`api`, `components/ui`, `handlers`, `hooks`, `middleware`, `pages`, `routes`, `services`, `styles`, `utils`).
- **🔗 Automatic Path Aliases**: Configures path resolution via `vite-tsconfig-paths` / `vite-jsconfig-paths`.
- **🔄 Dynamic Alias Syncing**: Built-in `npm run update-aliases` script keeps your path aliases updated whenever you create new folders under `src/`.
- **📦 Curated Preset Libraries**:
  - **State & Data**: TanStack Query, Zustand, Redux Toolkit
  - **UI & Icons**: Lucide Icons, React Icons, Motion (Framer Motion), GSAP
  - **Forms & Validation**: React Hook Form + Zod
  - **Testing**: Vitest + React Testing Library + jsdom
  - **Build & Apps**: Vite PWA, Electron
  - **HTTP & Utils**: Axios, React Helmet Async
- **🛠 Multi-Package Manager**: Fully compatible with `npm`, `pnpm`, `yarn`, and `bun`.

---

## 📂 Generated Directory Structure

When you create a project, `revup-dev` sets up a clean, scalable folder layout:

```text
my-app/
├── scripts/
│   └── update-aliases.js
├── src/
│   ├── api/             # API client configurations & endpoints
│   ├── components/      # Reusable UI components
│   │   └── ui/          # Core primitives (buttons, inputs, modals)
│   ├── handlers/        # Event handlers & business logic handlers
│   ├── hooks/           # Custom React hooks
│   ├── middleware/      # Application middleware
│   ├── pages/           # Page view components
│   ├── routes/          # Router configuration
│   ├── services/        # Business services & data mappers
│   ├── store/           # Redux / Zustand state stores (optional)
│   ├── styles/          # Global styles & theme configuration
│   ├── test/            # Vitest setup & testing utilities (optional)
│   ├── utils/           # Utility functions & helpers
│   ├── App.tsx          # Main Application component
│   └── index.css        # Tailwind CSS v4 entry point
├── vite.config.ts       # Vite config with alias plugins
├── tsconfig.json        # TypeScript configuration & path aliases
└── package.json
```

---

## 🔗 Default Path Aliases

Import components cleanly without nested relative imports (`../../../../components`):

| Alias | Target Path | Description |
| :--- | :--- | :--- |
| `@api/*` | `./src/api/*` | API endpoints & clients |
| `@components/*` | `./src/components/*` | Feature components |
| `@ui/*` | `./src/components/ui/*` | Reusable UI primitives |
| `@handlers/*` | `./src/handlers/*` | Logic handlers |
| `@hooks/*` | `./src/hooks/*` | Custom hooks |
| `@middleware/*` | `./src/middleware/*` | Middleware logic |
| `@pages/*` | `./src/pages/*` | Page routes |
| `@routes/*` | `./src/routes/*` | Routing definitions |
| `@services/*` | `./src/services/*` | External services |
| `@styles/*` | `./src/styles/*` | CSS & style files |
| `@utils/*` | `./src/utils/*` | Helper utilities |
| `@store/*` | `./src/store/*` | State stores (if selected) |

---

## 🔄 Syncing Path Aliases

Whenever you add new subdirectories to `src/`, keep your TypeScript / JavaScript path configuration synced by running:

```bash
npm run update-aliases
# or pnpm run update-aliases / bun run update-aliases
```

---

## 📄 License

Distributed under the [MIT License](./LICENSE).

---

## 👨‍💻 Author

Created with ❤️ by **Abdallah Sayed** ([@abdallah-say](https://github.com/abdallah-say))
