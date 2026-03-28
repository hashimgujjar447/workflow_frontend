# 🚀 Workflow Frontend

A modern workflow management frontend built with **Next.js App Router**, **Redux Toolkit**, and **RTK Query**.
This project provides a structured dashboard experience for managing workspaces, projects, and tasks.

---

## 📌 Overview

* Users are automatically redirected to `/dashboard` from the root.
* Global layout includes:

  * Redux Provider
  * Authentication bootstrap
  * Sidebar + Topbar layout
* Fully protected routing system for authenticated users.

---

## ⚙️ Tech Stack

* **Next.js (App Router)**
* **Redux Toolkit**
* **RTK Query**
* **TypeScript**
* **Tailwind CSS (UI styling)**

---

## 🚀 Getting Started

### 1️⃣ Install dependencies

```bash
pnpm install
```

### 2️⃣ Setup backend

Make sure your backend is running at:

```
http://localhost:8000/api/
```

This is required for:

* Authentication
* Token refresh flow
* API requests

### 3️⃣ Run development server

```bash
pnpm dev
```

---

## 📜 Available Scripts

| Command    | Description              |
| ---------- | ------------------------ |
| pnpm dev   | Start development server |
| pnpm build | Build for production     |
| pnpm lint  | Run ESLint               |

---

## 🧠 Architecture

### 🔐 Authentication Flow

* `AuthInitializer`:

  * Refreshes tokens on app load
  * Fetches user profile
  * Hydrates Redux state

* `ProtectedRoute`:

  * Blocks unauthenticated access
  * Redirects to `/login`

---

### 📦 State Management

* Redux Store contains:

  * `auth` slice
  * `api` slice (RTK Query)

* APIs:

  * `authApi` → login & auth
  * `workspaceApi` → workspaces, tasks, projects, etc.

---

## 🔗 Features

* ✅ Authentication (Login + Register UI)
* ✅ Protected Routes
* ✅ Workspace Management
* ✅ Task Dashboard
* ✅ Sidebar Navigation
* ✅ Global State Management
* ✅ API Integration with Auto Re-auth

---

## 🖥️ UI Experience

* 📊 Dashboard:

  * Workspaces overview
  * Tasks (All + Assigned)

* 📁 Sidebar:

  * Navigation across sections
  * Mobile responsive toggle

* 🔝 TopBar:

  * Workspace selector
  * Search
  * Notifications

---

## 📂 Project Structure

```
app/
 ├── (auth)/         # Login & Register
 ├── (protected)/    # Dashboard & app pages

components/
 ├── layouts/        # Layout & TopBar
 ├── ui/             # Reusable UI components

store/
 ├── services/       # RTK Query APIs
 ├── store.ts        # Redux store

context/             # Workspace context
hooks/               # Custom hooks
types/               # TypeScript types
```

---

## 🔄 API & Auth Behavior

* Login returns access token → stored in Redux
* Token refresh handled automatically
* Backend must support:

  * `/token/refresh/`
  * HttpOnly cookies

---

## ⚠️ Important Notes

* Backend **must** support refresh tokens via cookies
* Registration is currently UI-only (not connected to API)
* Extend features easily using:

  * `workspaceApi`
  * `(protected)` routes

---

## 🛠️ Future Improvements

* 🔹 Complete registration API integration
* 🔹 Notifications system
* 🔹 Role-based access control
* 🔹 Real-time updates (WebSockets)

---

## 🤝 Contributing

Feel free to fork this repo and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 💡 Author

Developed by **Hashim Gujjar**
