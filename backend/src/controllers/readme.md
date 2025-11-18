# Mock Event API

This is a mock backend API for managing **events**, **users**, and **transport types**. It is useful for testing frontend applications or prototyping.

**Base URL:**

```
http://localhost:4000/api
```

---

## Table of Contents

- [Users Endpoints](#users-endpoints)
- [Events Endpoints](#events-endpoints)
- [Transports Endpoints](#transports-endpoints)
- [Notes](#notes)

---

## Users Endpoints

### 1. GET `/users`

Retrieve all users.

**Request:**

```http
GET http://localhost:4000/api/users
```

**Sample Response (200 OK):**

```json
[
  {
    "id": 1,
    "name": "Alice Johnson",
    "email": "alice.johnson@example.com",
    "password": "alicepassword",
    "dateOfBirth": "1993-05-15",
    "favouriteEvents": [1,3],
    "preferences": {
      "categories": ["Music"],
      "tags": ["Outdoor"],
      "cities": ["Helsinki"]
    }
  },
  {
    "id": 2,
    "name": "Bob Smith",
    "email": "bob.smith@example.com",
    "password": "bobpassword",
    "dateOfBirth": "1998-02-20",
    "favouriteEvents": [2],
    "preferences": {
      "categories": ["Art & Culture"],
      "tags": ["Indoor"],
      "cities": ["Helsinki"]
    }
  },
  {
    "id": 3,
    "name": "Charlie Brown",
    "email": "charlie.brown@example.com",
    "password": "charliepassword",
    "dateOfBirth": "1995-08-30",
    "favouriteEvents": [3],
    "preferences": {
      "categories": ["Music","Sports"],
      "tags": ["Outdoor"],
      "cities": ["Espoo"]
    }
  },
  {
    "id": 4,
    "name": "Diana Prince",
    "email": "diana.prince@example.com",
    "password": "dianapassword",
    "dateOfBirth": "1991-12-01",
    "favouriteEvents": [4],
    "preferences": {
      "categories": ["Art & Culture"],
      "tags": ["Indoor","classical music"],
      "cities": ["Helsinki"]
    }
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
    "name": "Brad Johnson",
    "email": "brad.johnson@example.com",
    "password": "bradpassword",
    "dateOfBirth": "1993-05-15",
    "favouriteEvents": [
        1,
        3
    ],
    "preferences": {
        "categories": [
            "Music"
        ],
        "tags": [
            "Outdoor"
        ],
        "cities": [
            "Helsinki"
        ]
    }
}
```

**Sample Response (201 Created):**

```json
{
    "id": 8,
    "name": "Brad Johnson",
    "email": "brad.johnson@example.com",
    "password": "bradpassword",
    "dateOfBirth": "1993-05-15",
    "favouriteEvents": [
        1,
        3
    ],
    "preferences": {
        "categories": [
            "Music"
        ],
        "tags": [
            "Outdoor"
        ],
        "cities": [
            "Helsinki"
        ]
    }
}
```

---

### 3. GET `/users/:userId`

Retrieve a user by ID.

**Sample Response (200 OK):**

```json
{
    "id": 8,
    "name": "Brad Johnson",
    "email": "brad.johnson@example.com",
    "password": "bradpassword",
    "dateOfBirth": "1993-05-15",
    "favouriteEvents": [
        1,
        3
    ],
    "preferences": {
        "categories": [
            "Music"
        ],
        "tags": [
            "Outdoor"
        ],
        "cities": [
            "Helsinki"
        ]
    }
}
```

**Error Response (404 Not Found):**

```json
{
    "error": "User not found"
}
```

---

### 4. PUT `/users/:userId`

Update a user by ID.

**Request:**

```http
PUT http://localhost:4000/api/users/:userid

{
  "name": "Brad Johnson-Smith",
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
    "id": 8,
    "name": "Brad Johnson-Smith",
    "preferences": {
        "categories": [
            "Music",
            "Art & Culture"
        ],
        "tags": [
            "Outdoor",
            "Indoor"
        ],
        "cities": [
            "Helsinki",
            "Espoo"
        ]
    }
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
    "error": "User not found"
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
        "name": "Helsinki Christmas Market – Senate Square",
        "category": "Family",
        "description": "Finland’s oldest outdoor Christmas market with artisan stalls, festive food and a vintage carousel under Helsinki Cathedral.",
        "date": "2025-12-01",
        "endDate": "2025-12-22",
        "location": "Senate Square, Helsinki",
        "image": "https://tuomaanmarkkinat.fi/app/uploads/sites/2/2024/04/2023_Tuomaan_Markkinat_Print-78-1024x683.jpg",
        "tags": [
            "Christmas",
            "Outdoor"
        ]
    },
    {
        "id": 2,
        "city": "Helsinki",
        "name": "World Village Festival",
        "category": "Art & Culture",
        "description": "A free, vibrant multicultural festival in Helsinki showcasing music, theatre, dance and food from around the world.",
        "date": "2026-05",
        "location": "Helsinki",
        "image": "https://www.helsinki.com/media/public/ketki/World%20Village%20Festival.jpg",
        "tags": [
            "Multicultural",
            "Outdoor"
        ]
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
    "name": "World Village Festival",
    "category": "Art & Culture",
    "description": "A free, vibrant multicultural festival in Helsinki showcasing music, theatre, dance and food from around the world.",
    "date": "2026-05",
    "location": "Helsinki",
    "image": "https://www.helsinki.com/media/public/ketki/World%20Village%20Festival.jpg",
    "tags": [
        "Multicultural",
        "Outdoor"
    ]
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
        "lines": [
            "200",
            "57",
            "554"
        ]
    },
    {
        "id": 2,
        "type": "Tram",
        "lines": [
            "15",
            "13",
            "10"
        ]
    },
    {
        "id": 3,
        "type": "Metro",
        "lines": [
            "M1",
            "M2"
        ]
    },
    {
        "id": 4,
        "type": "Train",
        "lines": [
            "A",
            "U",
            "T"
        ]
    }
]
```

---

## Notes

- All endpoints return **JSON**.
- POST/PUT endpoints require a **JSON body**.
- Error responses always include a `message/error` field.
- You can filter events or users using query parameters (e.g., `?city=Helsinki`).
