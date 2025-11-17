# Mock Event API

This is a mock backend API for managing **events**, **users**, and **transport types**. It is useful for testing frontend applications or prototyping.

**Base URL:**

```
http://localhost:5000/api
```

---

## Table of Contents

* [Users Endpoints](#users-endpoints)
* [Events Endpoints](#events-endpoints)
* [Transports Endpoints](#transports-endpoints)
* [Notes](#notes)

---

## Users Endpoints

### 1. GET `/users`

Retrieve all users.

**Request:**

```http
GET /users HTTP/1.1
Content-Type: application/json
```

**Sample Response (200 OK):**

```json
[
  {
    "_id": "6501a1e5f9c3b8a1d4c1e123",
    "name": "Alice Johnson",
    "email": "alice.johnson@example.com",
    "dateOfBirth": "1993-05-15",
    "favouriteEvents": [1, 3],
    "preferences": {
      "categories": ["Music"],
      "tags": ["Outdoor"],
      "cities": ["Helsinki"]
    },
    "createdAt": "2025-01-01T12:00:00.000Z",
    "updatedAt": "2025-01-01T12:00:00.000Z"
  }
]
```

---

### 2. POST `/users`

Create a new user.

**Request:**

```http
POST /users HTTP/1.1
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securepassword",
  "dateOfBirth": "1990-01-01",
  "favouriteEvents": [1, 2],
  "preferences": {
    "categories": ["Music", "Art & Culture"],
    "tags": ["Outdoor"],
    "cities": ["Helsinki"]
  }
}
```

**Sample Response (201 Created):**

```json
{
  "_id": "6502b2e6f9c3b8a1d4c1e124",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "dateOfBirth": "1990-01-01",
  "favouriteEvents": [1, 2],
  "preferences": {
    "categories": ["Music", "Art & Culture"],
    "tags": ["Outdoor"],
    "cities": ["Helsinki"]
  },
  "createdAt": "2025-01-02T12:00:00.000Z",
  "updatedAt": "2025-01-02T12:00:00.000Z"
}
```

---

### 3. GET `/users/:userId`

Retrieve a user by ID.

**Sample Response (200 OK):**

```json
{
  "_id": "6501a1e5f9c3b8a1d4c1e123",
  "name": "Alice Johnson",
  "email": "alice.johnson@example.com",
  "dateOfBirth": "1993-05-15",
  "favouriteEvents": [1, 3],
  "preferences": {
    "categories": ["Music"],
    "tags": ["Outdoor"],
    "cities": ["Helsinki"]
  },
  "createdAt": "2025-01-01T12:00:00.000Z",
  "updatedAt": "2025-01-01T12:00:00.000Z"
}
```

**Error Response (404 Not Found):**

```json
{
  "message": "User not found"
}
```

---

### 4. PUT `/users/:userId`

Update a user by ID.

**Request:**

```http
PUT /users/6501a1e5f9c3b8a1d4c1e123 HTTP/1.1
Content-Type: application/json

{
  "name": "Alice Johnson-Smith",
  "preferences": {
    "categories": ["Music", "Art & Culture"],
    "tags": ["Outdoor", "Indoor"],
    "cities": ["Helsinki", "Espoo"]
  }
}
```

**Sample Response (200 OK):**

```json
{
  "_id": "6501a1e5f9c3b8a1d4c1e123",
  "name": "Alice Johnson-Smith",
  "email": "alice.johnson@example.com",
  "dateOfBirth": "1993-05-15",
  "favouriteEvents": [1, 3],
  "preferences": {
    "categories": ["Music", "Art & Culture"],
    "tags": ["Outdoor", "Indoor"],
    "cities": ["Helsinki", "Espoo"]
  },
  "createdAt": "2025-01-01T12:00:00.000Z",
  "updatedAt": "2025-01-05T12:00:00.000Z"
}
```

---

### 5. DELETE `/users/:userId`

Delete a user by ID.

**Sample Response (200 OK):**

```json
{
  "message": "User deleted successfully"
}
```

**Error Response (404 Not Found):**

```json
{
  "message": "User not found"
}
```

---

## Events Endpoints

### 1. GET `/events`

Retrieve all events.

**Sample Response (200 OK):**

```json
[
  {
    "id": 1,
    "city": "Helsinki",
    "title": "Helsinki Christmas Market – Senate Square",
    "publisher": "Tuomaan Markkinat",
    "category": "Family",
    "description": "Finland’s oldest outdoor Christmas market with artisan stalls, festive food and a vintage carousel under Helsinki Cathedral.",
    "date": "1 Dec – 22 Dec 2025",
    "location": "Senate Square, Helsinki",
    "link": "https://en.wikipedia.org/wiki/Helsinki_Christmas_Market",
    "image": "https://tuomaanmarkkinat.fi/app/uploads/sites/2/2024/04/2023_Tuomaan_Markkinat_Print-78-1024x683.jpg",
    "tags": "Christmas, Outdoor"
  }
]
```

---

### 2. GET `/events/:eventId`

Retrieve an event by ID.

**Sample Response (200 OK):**

```json
{
  "id": 2,
  "city": "Helsinki",
  "title": "World Village Festival",
  "publisher": "World Village Festival",
  "category": "Art & Culture",
  "description": "A free, vibrant multicultural festival in Helsinki showcasing music, theatre, dance and food from around the world.",
  "date": "May 2026",
  "location": "Helsinki",
  "link": "https://www.helsinki.com/v/festivals/",
  "image": "https://www.helsinki.com/media/public/ketki/World%20Village%20Festival.jpg",
  "tags": "Multicultural, Outdoor"
}
```

---

## Transports Endpoints

### 1. GET `/transports`

Retrieve all transport types.

**Sample Response (200 OK):**

```json
[
  {
    "id": 1,
    "type": "Bus",
    "lines": ["200", "57", "554"]
  },
  {
    "id": 2,
    "type": "Tram",
    "lines": ["15", "13", "10"]
  },
  {
    "id": 3,
    "type": "Metro",
    "lines": ["M1", "M2"]
  },
  {
    "id": 4,
    "type": "Train",
    "lines": ["A", "U", "T"]
  }
]
```

---

## Notes

* All endpoints return **JSON**.
* POST/PUT endpoints require a **JSON body**.
* Error responses always include a `message` field.
* You can filter events or users using query parameters (e.g., `?city=Helsinki`).
