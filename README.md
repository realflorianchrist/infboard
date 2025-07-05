
# Infboard

---

## 📦 PNPM Workspaces – Setup & Best Practices

This project uses [**pnpm**](https://pnpm.io/) as the package manager and **workspaces** to efficiently manage frontend, backend, and shared packages.

### 📁 Structure

```txt
apps/
  frontend/     → Next.js App
  backend/      → Express Backend

packages/       → Shared packages (e.g. types, ui)

pnpm-workspace.yaml
```

### 🚀 Installation

Install all dependencies for the entire monorepo:

```bash
pnpm install
```

> 🔒 If you see a warning about _"Ignored build scripts"_, run:

```bash
pnpm approve-builds
```

### 🧭 Working with Individual Workspaces

#### Install a package for a specific project:

```bash
pnpm add axios --filter frontend
pnpm add express --filter backend
```

#### Run backend and frontend in parallel

```bash
pnpm run dev
```

> Make sure the `dev` script is defined in the root `package.json`, e.g. using [turbo](https://turbo.build):

```json
"dev": "turbo run dev"
```

#### Run scripts in a specific workspace:

```bash
pnpm --filter frontend dev
pnpm --filter backend build
```

### 💡 Tips

- Always use `pnpm`, **not** `npm` or `yarn`
- Run `pnpm install` from the **root**, even if you're inside a subdirectory
- Use `--filter` to target specific workspaces
- Use `pnpm dlx` instead of `npx` for CLI tools (e.g. `shadcn-ui`, `create-next-app`)

---
