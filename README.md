# 🚀 WorkflowHub – Task & Workspace Management System

WorkflowHub is a modern, scalable **Task Management SaaS application** built with **Next.js, Redux Toolkit, and Tailwind CSS**.
It allows teams to manage **workspaces, projects, tasks, members, and permissions** efficiently.

---

## ✨ Features

### 🔐 Authentication & Security

* JWT-based authentication with refresh token support
* Auto token refresh system (silent login)
* Protected routes with redirect support
* Persistent login state using Redux

---

### 🧑‍💼 Workspace Management

* Create, update, and delete workspaces
* Invite members via email
* View all workspace members
* Role-based access control for workspace actions

---

### 📁 Project Management

* Create and manage multiple projects inside a workspace
* Assign members with roles (Manager, Leader, Developer, etc.)
* Update or delete projects (permission-based)

---

### ✅ Task Management

* Kanban-style task board (To Do, In Progress, Failed, Completed)
* Create tasks with:

  * Title
  * Description
  * Assigned user
  * Status
  * Due date
* Update task status dynamically
* Task detail page with full metadata

---

### 💬 Comments System

* Add comments on tasks
* Nested replies (threaded comments)
* Like / Dislike reactions on comments
* Dedicated comments page

---

### 📊 Dashboard

* Overview of:

  * Workspaces
  * Recent tasks
  * Assigned tasks
* Quick navigation into workspaces

---

### 🧠 Permission System (Advanced 🔥)

* Role-based permission handling
* Separate permissions for:

  * Workspace
  * Project

Example permissions:

* Create project
* Add members
* Update/delete workspace
* Update/delete project

All UI actions are conditionally rendered based on permissions.

---

### 🎨 UI & UX

* Fully responsive layout (mobile + desktop)
* Sidebar navigation
* Dynamic topbars (workspace & project level)
* Custom design system with Tailwind CSS
* Reusable UI components (Button, Select, Cards)

---

## 🏗️ Architecture

### 🔹 Frontend

* **Next.js (App Router)**
* **React (Client Components)**
* **TypeScript**

### 🔹 State Management

* Redux Toolkit
* RTK Query (API layer)
* Context API (for workspace/project UI state)

---

## 📂 Project Structure

```
app/
 ├── dashboard/
 ├── workspaces/
 │    ├── [slug]/
 │    │    ├── project/
 │    │    │    ├── [project_slug]/
 │    │    │    │    ├── tasks/
 │    │    │    │    └── ...
 │    │    └── ...
 ├── login/
 ├── register/

components/
 ├── layouts/
 ├── ui/
 ├── features/

store/
 ├── api/
 ├── services/
 ├── slices/

context/
 └── WorkspaceContext

hooks/
 ├── usePermission
 ├── useWorkspaceRole
 └── useProjectRole
```

---

## 🔌 API Layer (RTK Query)

* Centralized API using `createApi` 
* Auto caching with tags:

  * Workspaces
  * Projects
  * Tasks
  * Members
* Auto refetch after mutations

---

## 🔄 Token Refresh System

* Custom `baseQueryWithReauth` handles:

  * Expired tokens
  * Automatic refresh
  * Retry original request
* Logout fallback on failure 

---

## 🧠 State Management

### Auth Slice

* Stores:

  * User
  * Token
  * Initialization state
* Handles login, logout, loading states 

---

### Workspace Context

* Manages:

  * Selected tab (Projects / Members / Settings)
  * Selected project
* Used for UI state across pages 

---

## 🔐 Permission System (Core Feature)

Custom hook:

```ts
usePermission(workspace_slug, project_slug)
```

Returns:

* Workspace permissions:

  * canCreateProject
  * canUpdateWorkspace
  * canDeleteWorkspace
  * canAddWorkspaceMembers

* Project permissions:

  * canUpdateProject
  * canDeleteProject
  * canAddProjectMembers

👉 Used across UI to:

* Hide buttons
* Restrict actions
* Control access

---

## 📦 Key Components

### Dashboard

* Workspace cards
* Recent tasks
* Assigned tasks  

---

### Workspace

* Projects list
* Members management
* Settings panel   

---

### Project

* Task board (Kanban)
* Members
* Settings   

---

### Task

* Detail view
* Status update
* Comments system

---

## ⚙️ Installation

```bash
git clone https://github.com/your-username/workflowhub.git
cd workflowhub

npm install

npm run dev
```

---

## 🌐 Environment

Make sure backend API is running at:

```
http://localhost:8000/api/
```

---

## 🚀 Future Improvements

* Notifications system
* Real-time updates (WebSockets)
* Drag & drop tasks
* File attachments
* Activity logs

---

## 👨‍💻 Author

Developed by [Your Name]

---

## ⭐ Final Note

This project demonstrates:

* Scalable frontend architecture
* Real-world SaaS features
* Advanced state + permission handling

👉 Perfect for portfolio & production-level applications.
