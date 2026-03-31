# 🚀 WorkflowHub Frontend – Real-Time Task Management UI

WorkflowHub Frontend is a **modern, scalable SaaS frontend** built with:

* **Next.js (App Router)**
* **Redux Toolkit + RTK Query**
* **Tailwind CSS**
* **WebSockets (Real-time updates)**

It connects with a Django backend to provide a **fully real-time collaborative experience**.

---

# 🔥 Key Highlights

* ⚡ Real-time UI updates (WebSockets)
* 🧠 Advanced permission-based UI rendering
* 🔄 Smart caching with RTK Query
* 🔐 Secure authentication with auto-refresh tokens
* 📊 Kanban-style task management

---

# ✨ Features

## 🔐 Authentication

* JWT authentication
* Auto refresh token system
* Persistent login state
* Protected routes

---

## 🧑‍💼 Workspace Management

* Create & manage workspaces
* Invite members
* Role-based UI controls

---

## 📁 Project Management

* Multiple projects per workspace
* Role-based member assignment
* Permission-based actions

---

## ✅ Task Management

* Kanban board:

  * To Do
  * In Progress
  * Completed
  * Failed
* Task detail page
* Status updates (real-time)

---

## 💬 Comments & Reactions (Real-Time)

* Add comments
* Nested replies
* 👍 Like / 👎 Dislike
* 🔄 Live updates across all users

---

# ⚡ Real-Time System

## 🏗️ Flow

```id="n8kz4f"
User Action
   ↓
API Call (RTK Query)
   ↓
Backend Save
   ↓
Django Signal
   ↓
WebSocket Event
   ↓
Frontend Listener
   ↓
Redux State Update
   ↓
UI Re-render (instant)
```

---

## 🔌 WebSocket Usage

* Connects to:

```id="t08xpy"
ws://localhost:8000/ws/tasks/<project_slug>/
```

---

## 📡 Events Handled

* task_created
* task_updated
* comment_created
* comment_updated
* comment_reaction_created
* comment_reaction_updated
* comment_reaction_deleted

---

## 🧠 State Management

### Redux Toolkit

* Global state for auth
* RTK Query for API caching

---

### RTK Query

* Auto caching
* Tag invalidation
* Optimistic updates
* Manual cache updates using:

```ts id="q5v1dh"
updateQueryData
```

---

## 🧠 Permission System

Custom hook:

```ts id="2xr7vp"
usePermission(workspace_slug, project_slug)
```

Used to:

* Hide UI buttons
* Restrict actions
* Control access dynamically

---

## 📂 Project Structure

```id="0g4f3k"
app/
 ├── dashboard/
 ├── workspaces/
 ├── login/
 ├── register/

components/
 ├── layouts/
 ├── features/
 ├── ui/

store/
 ├── services/
 ├── api/
 ├── slices/

context/
 └── WorkspaceContext

hooks/
 ├── usePermission
 ├── useWorkspaceRole
 ├── useProjectRole
```

---

## 🔄 Token Refresh System

* Custom baseQuery
* Auto refresh on 401
* Retry original request
* Logout fallback

---

## ⚙️ Installation

```bash id="ib5y3h"
git clone <repo>
cd frontend

npm install
npm run dev
```

---

## 🌐 Backend Requirement

Make sure backend is running:

```id="ptgbml"
http://localhost:8000/api/
```

---

## 🚀 Future Improvements

* Drag & Drop (Kanban)
* Notifications (real-time)
* Activity feed
* File attachments

---

# 💬 Final Note

This frontend demonstrates:

* Real-time UI synchronization
* Advanced state management
* Scalable frontend architecture
* Clean integration with backend APIs & WebSockets

---

## 👨‍💻 Author

Built with ❤️ using Next.js & Redux Toolkit
