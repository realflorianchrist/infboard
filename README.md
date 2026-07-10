# Infboard

**Infboard** is a modern information platform developed for students of the FHNW.  
It centralizes relevant content such as old exams in one place – with a clean interface tailored to everyday student needs.

The application consists of:
- A **Next.js frontend** for users with modern UI
- An **Express backend** that provides a secure API layer
- A **MongoDB database** using replica sets to support transactions
- S3 integration for file storage (e.g. for project files or documents) (MiniIO for local dev)

The project is fully containerized using Docker and follows a clean monorepo structure powered by `pnpm` and `turbo`.

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

## 🧠 MongoDB Setup Notes for Local Development with Docker

This project uses a MongoDB container (`mongodb`) and a separate container for `mongo-express`.
To allow both your local backend and the `mongo-express` container to connect to the MongoDB instance, follow these steps:

---

### 📌 Step 1: Add Host Entry (on Host Machine)

Edit your `/etc/hosts` file and add:

```
127.0.0.1   mongodb
```

This allows local applications (like the backend running outside of Docker) to reach the MongoDB container using the hostname `mongodb`.

---

### ⚙️ Step 2: Set MongoDB Host in .env or Config

For the **local backend (outside container)**:

```
MONGO_HOST=mongodb:27017
```

For the **mongo-express container**, use:

```yaml
mongo-express:
  ...
  environment:
    ME_CONFIG_MONGODB_URL: mongodb://admin:password@127.0.0.1:27017/admin?replicaSet=rs0&authSource=admin
```

---

### 🧱 Step 3: Replica Set Hostname in MongoDB

In your MongoDB replica set config, ensure the host is set to:

```
mongodb:27017
```

You can set this using the Mongo shell (`mongosh`):

```js
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongodb:27017" }
  ]
})
```

> Mixing `localhost` and container names (like `mongodb`) is **not allowed** in replica set configurations.

---

### ✅ Result

- Your backend (on host) connects via `mongodb:27017` (thanks to `/etc/hosts`)
- `mongo-express` (in container) connects via `127.0.0.1:27017` using host networking
- Replica set is properly configured to use `mongodb:27017`