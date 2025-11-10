# 🌆 UrbanGo – City Events & Transport Companion

UrbanGo is a **smart city companion web application** designed to help users **discover events happening across Finland's capital region — Helsinki, Espoo, Kauniainen, and Vantaa** — and plan **convenient public transport routes** using **real-time HSL API data**.  

Built with **Node.js, JavaScript, React, HTML, CSS/Tailwind**, and future integrations for external event APIs.

---

## 🚀 Project Overview

UrbanGo connects users with everything happening in their city — concerts, festivals, exhibitions, and more — while helping them navigate there efficiently using public transport data.  

The platform aims to enhance city life by combining **event discovery** with **live transit information**, all in one place.

---

## 👥 Target Users

| User Type | Description | Primary Goals |
|------------|-------------|----------------|
| **Tourists & Visitors** | Short-term travelers exploring Helsinki region | **Discover** attractions, events, and nearby activities easily |
| **Local Residents** | City residents seeking new experiences | **Find** events, or venues tailored to interests |
| **Moderators** | UrbanGo staff | **Manage** listings, monitor usage, and highlight key cultural events |

---

## 🧩 Core Features

- 🖥️ **Responsive UI** – Built with React and Tailwind for seamless UX  
- 👤 **User Authentication** – Secure login using JWT tokens  
- 🔍 **Event Discovery** – Browse upcoming city events with filters  
- 🗺️ **Transport Planner** – Get real-time routes 
- ⭐ **Favorites** – Save events to revisit later (Sprint 2+)
- 🔔 **Subscribe** – Follow categories or venues to get personalized updates  
- ⚡ **Modular Structure** – Scalable Node.js and REST API-based architecture  

---

## 🏗️ Tech Stack

| Layer               | Technologies |
|:--------------------|:--------------|
| **Frontend**        | HTML, CSS, Tailwind CSS, JavaScript, React |
| **Backend**         | Node.js, Express.js     |
| **Database**        | MongoDB (Mongoose ORM)  |
| **API Integration** | HSL API (public transport data), Linked Events API (event data), OpenWeather API |
| **Version Control** | Git & GitHub |
| **Design Tools**    | Figma (for prototype and presentation) |

---

## 🧩 System Components / Scope

The **Minimum Viable Product (MVP)** will include:
1. **User Panel (Frontend – React)**  
   - Registration, login, and authentication  
   - Browse and search events from Linked Events API  
   - Save and manage favorite events  
   - View personalized event recommendations (basic logic-based version)  

2. **Admin Panel (Backend + React Dashboard)**  
   - Admin authentication and role-based access  
   - Manage user accounts and moderate reviews   
   - View analytics and user activity summary
   - Admins have read-only access to Linked Events data (cannot edit or delete external events) 

3. **Backend (Node.js + Express)**  
   - RESTful API handling for CRUD operations  
   - MongoDB integration for persistent data storage  
   - Secure JWT authentication and role management  
   - Integration with Linked Events, HSL and OpenWeather APIs  

4. **Database (MongoDB)**  
   - Collections: `users`, `favorites`, `events`, `reviews`  
   - Data persistence for user profiles, saved items, and admin data  

5. **Future Extension (AI Component)**  
   - Smart Recommendation Engine using user behavior and event metadata  

---

## 💡 Why UrbanGo?
Finland’s capital region offers extensive open data through city APIs, yet this information is often fragmented across multiple platforms.  
UrbanGo unifies these data sources into a single, intuitive application that encourages **local engagement**, supports **sustainable mobility**, and showcases the potential of **open data and AI** in urban life.

---

### 🔮 Long-Term Vision
In the future, UrbanGo aims to evolve into a **fully intelligent digital city companion**, offering predictive recommendations, smart routing through HSL integration, and AI-driven personalization — creating a seamless connection between people and the dynamic life of Finland's capital region.

---

## 🌆 UrbanGo – System Process Diagram
```
┌────────────────────────────────────────────────────────────┐
│                       USER / VISITOR                       │
│                                                            │
│ - A tourist or local resident exploring Helsinki region    │
│ - Can browse events                                        |
│ - Can save favorite events, plan itineraries               │
│ - Interacts with the app via User Panel (React)            │
└──────────────────────────────┬─────────────────────────────┘
                               │
                               │ 1️⃣ User clicks buttons, searches events, or saves favorites
                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND (UI)                                      │
│                                                                             │
│ - Renders pages: Home, Events, Favorites, Transportation, Admin Dashboard   │
│ - Handles user interactions (clicks, forms, filters)                        │
│ - Sends HTTP requests to the backend (CRUD operations)                      │
│ - Receives JSON responses and updates the UI dynamically                    │
└──────────────────────────────┬──────────────────────────────────────────────┘
                               │
                               │ 2️⃣ HTTP request (GET/POST/PATCH/DELETE)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  NODE.JS + EXPRESS BACKEND                  |
│                                                             │
│ - Receives requests from frontend                           │
│ - Authenticates users (JWT tokens)                          │
│ - Checks user roles (regular user vs admin)                 │
│ - Performs CRUD operations on database                      │
│ - Calls external APIs if needed (Linked Events, MyHelsinki) │
│ - Combines local + external data                            │
└───────────────┬─────────────────────────────┬───────────────┘
                │                             │
                │                             │
                ▼                             ▼
    ┌────────────────────────┐       ┌────────────────────────┐
    │       MONGODB          |       │   EXTERNAL APIs        │
    │ (Persistent Database)  |       │ (Real-time City Data)  │
    │                        │       │                        │
    │ - Stores user profiles │       │ - Linked Events API:   │
    │ - Saves favorites      │       │   City events          │
    │ - Stores custom events │       │ - OpenWeather API:     │
    │ - Keeps reviews        │       │   Weather info         │
    │                        │       │ - HSL API:             │
    │                        │       │   Public transit info  │
    └───────────────┬────────┘       └───────────────┬────────┘
                    │                                │
                    └───────────────┬────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────┐
│                 DATA AGGREGATION & RESPONSE                 │
│                                                             │
│ - Backend combines MongoDB + external API data              │
│ - Prepares JSON response for frontend                       │
│ - Includes event details, location info, weather, favorites │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               │ 3️⃣ Backend sends JSON response
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                REACT FRONTEND UPDATES UI                    │
│                                                             │
│ - Receives data from backend                                │
│ - Updates pages: shows events, favorites, maps, weather     │
│ - Provides interactive experience (click, save, filter)     │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                       USER SEES RESULT                       │
│                                                              │
│ - User can view saved favorites, upcoming events             │
│ - User can explore city map with attractions & routes        │
│ - Admin can see dashboard with user stats & event management |
| - Admin can view all users, favorites, reviews, and          |
|   subscriptions (read/update/delete only local data)         |
| - Linked Events API data is read-only                        │
└──────────────────────────────────────────────────────────────┘

```

## 🌆 UrbanGo – User Interaction Flow
```
👤 User / Visitor
──────────────────────────────────────────────
- Opens UrbanGo app
- Browses events and categories
- Clicks "Login" to access personalized features
          │
          ▼
🖥️ React Frontend
──────────────────────────────────────────────
- Displays login form (email + password)
- Sends POST /api/auth/login to backend
- Stores JWT token after successful login
- Allows user interactions:
    • Save favorites
    • Review on events
    • Subscribe to categories, venues, or events
          │
          ▼
⚡ Node.js + Express Backend
──────────────────────────────────────────────
- Receives login request
- Verifies credentials in MongoDB `users` collection
- If valid:
    • Creates JWT token (userId, role, expiration)
    • Returns token to frontend
- Protects all CRUD routes using JWT middleware
          │
          ▼
🔑 JWT Token (Frontend)
──────────────────────────────────────────────
- Stored in localStorage or memory
- Sent in Authorization header for all protected requests:
  Authorization: Bearer <JWT_TOKEN>
          │
          ▼
🖥️ React Frontend (Authenticated Requests)
──────────────────────────────────────────────
Favorites Flow:
- User clicks "Heart Icon" → POST /api/favorites
- Backend checks JWT → creates document in MongoDB
- GET /api/favorites lists all favorites
- DELETE /api/favorites/:id removes a favorite

Review Flow:
- User types review → POST /api/reviews
- Backend verifies JWT → saves in MongoDB
- GET /api/reviews?eventId=12345 fetches all reviews
- PATCH/DELETE allowed only for review owner

Subscribe Flow:
- User clicks "Subscribe" → POST /api/subscriptions
- Backend verifies JWT → saves subscription in MongoDB
- GET /api/subscriptions lists all subscriptions
- DELETE /api/subscriptions/:id unsubscribes

External APIs:
- Linked Events API: city events
- OpenWeather API: weather info
- HSL API: public transport info
          │
          ▼
💾 MongoDB & Data Aggregation
──────────────────────────────────────────────
- MongoDB collections:
    • users
    • favorites
    • reviews
    • subscriptions
    • events
- Backend aggregates MongoDB + API data
- Sends structured JSON responses to frontend
          │
          ▼
🖥️ React Frontend Updates UI
──────────────────────────────────────────────
- Updates pages dynamically:
    • Favorites list
    • Reviews section
    • Subscriptions status
    • Event details, maps, weather
- Ensures only authenticated users can perform actions
          │
          ▼
👤 User Sees Result
──────────────────────────────────────────────
- Favorites appear instantly
- Reviews appear in real time
- Subscribed categories/events show as active
- Admin sees dashboard with user stats, subscriptions, and event management
```
---

## 📁 Repository Structure
```
urban-go/
│
├── frontend/
│ ├── index.html
│ ├── events.jsx
│ ├── transport.jsx
│ ├── login.jsx
│ ├── signup.jsx
│ └── styles/
│ ├── main.css
│ └── tailwind.config.js
│
├── backend/
│ ├── app.js
│ ├── routes/
│ ├── controllers/
│ └── services/
│
├── assets/
│ └── images/
│
├── README.md
└── package.json
```

---

## 🧠 Development Plan

| Sprint | Focus | Deliverables |
|:--------|:-------|:-------------|
| **Sprint 1** | Design & Planning | Figma prototype, Trello backlog, presentation |
| **Sprint 2** | Frontend & Backend Development | Static pages with navigation and basic interactivity |
| **Sprint 3** | Frontend, Backend & Integration | HSL API setup, user login system, database, and final presentation |

---

## 👥 Team

| Member | Role |
|:--------|:------|
| **Sandip** | Product Owner + Frontend + Backend Developer|
| **Sailesh** | Scrum Master + Frontend + Backend Developer |
| **Olga** | Frontend + Backend Developer |
| **Gam** | Frontend + Backend Developer | 
| **Dinal** | Frontend + Backend Developer |

---

## 🌐 Related Repositories

- 📁 [UrbanGo – Sprint Deliverables](https://github.com/SandipFromPokhara/urban-go-sprints)  
  Contains Figma prototype, Trello links, presentation slides, and Scrum documentation.

---

## 🎯 Project Value

UrbanGo enhances the cultural experience of Finland’s capital region by providing a unified platform for discovering events, planning routes, and personalizing city exploration.  
It benefits both users (by offering convenience and personalization) and city stakeholders (by showcasing open data and promoting local engagement).

---

## 🧭 Future Enhancements

- AI-driven personalized event recommendations 🎯  
- Multi-language interface (Finnish/English) 

---

## ⚙️ Setup Instructions (for developers)

```bash
# Clone the repository
git clone https://github.com/SandipFromPokhara/urban-go

# Navigate into the folder
cd urban-go

# Install dependencies
npm install

# Run the project
npm start
Then open http://localhost:3000 in your browser.

📜 License
This project is developed for academic purposes as part of Metropolia University of Applied Science course on Web Development.

© 2025 UrbanGo Team