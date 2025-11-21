# Self-Assessment  

- **Member name:** *Sandip Ranjit*  

- **Contribution area:** *I implemented Transport Page for frontend and AI integration for backend for event recommendation with mock datas. For the Ai integration purpose, I created a separate folder named **AI** that includes `aiController.js`, `aiRoutes.js`, `normalizeAiOutput.js`, `eventService.js`, `gemini.js` and `AIserver.js` files. The purpose for creating a separate folder was to isolate my tasks so as not to create conflicts during GitHub branch merging. `AIserver.js` also connects to MongoDB, and I tested AI endpoints with /api/gemini creating event recommendation and it was verified using Postman. As a responsible member of the group, I took the charge of merging branches, reviewing the codes and communicating frequently with the related member during merging process. This saved everyone's time and effort in the group, which in turn helped members to focus on debugging, and careful examination of their own tasks.*

---

### 1. Functionality
- **Does the code meet the requirements?**
  - [Y] Does it implement all specified features you were responsible for?  
  - [Y] Are edge cases handled (e.g., invalid data, duplicates)?  
  - [N] Are there any bugs or unexpected behaviors?  

- **Integration**
  - [Y] Does your code work correctly with other parts of the application?  
  - [Y] Are inputs and outputs managed appropriately?  

---

### 2. Code Quality
- **Readability**
  - [Y] Is your code easy to understand for other developers?  
  - [Y] Are variable and function names descriptive and meaningful?  

- **Reusability**
  - [Y] Can your code or parts of it be reused elsewhere in the application?  
  - [Y] Is logic modular and separated from unrelated concerns?  

- **Comments and Documentation**
  - [Y] Are there comments explaining complex logic?  
  - [Y] Is there documentation for how to use your code unit?  

---

### 3. Performance
- **Efficiency**
  - [N] Are there any unnecessary operations or performance bottlenecks?  
  - [Y] Is the code optimized for larger datasets or high traffic (if applicable)?  

---

### 4. Overall Assessment
- **Strengths**  
  - Successfully integrated an AI/LLM endpoint (POST /api/gemini) into the backend.

  - Clear modular structure — AI logic separated into AI/aiController.js.

  - Stable request → response workflow, tested and working in Postman.

  - Good use of mock data, allowing AI logic to function even without real DB records.

  - Environment-variable management using .env (secure API key handling).

  - Connected MongoDB and set up backend to support persistence for future sprints.

  - Consistent error handling (returns safe JSON errors instead of crashing).

- **Areas for Improvement**  
    - AI endpoint currently uses mock data, not live data from MongoDB.

    - No database CRUD operations yet for events, users, or recommendations.

    - Prompt template still basic — could be made more dynamic or personalized.

    - No unit tests or automated tests for backend routes.

    - No front-end UI integration yet (AI is backend-only at the moment).

- **Action Plan**  
  - Outline specific steps to address the areas for improvement. 

  - Add loading states and display recommendations on the front-end.

---

### 5. Additional Notes
- Integrate the AI endpoint with actual DB data instead of manual JSON strings.

- This sprint helped me understand how backend routing connects to AI services.

- I gained confidence working with Postman, API keys, and environment variables.

- Setting up the AI controller required troubleshooting, which improved my debugging skills.

---

# Sprint 2 – AI Integration Documentation (Backend)

## 1. Project Structure (Backend + AI)

```bash
urban-go/backend/
├─ AIserver.js
├─ AI/
│  ├─ aiController.js          (Handles AI prompt & response)
│  ├─ aiRoutes.js              (Handles AI routes)
│  ├─ normalizeAiOutput.js     (Contains functions for parsing JSON output)
├─ services/
│  ├─ eventService.js          (Contains prompt for AI generation)
├─ config/
│   ├─ gemini.js               (Contains model for Gemini AI)
├─ src/models/
│   ├─ userModel.js            (Contains userSchema)
├── .env                       (Contains API keys + MongoDB URI)
└── package.json              
```

---

## 2. AI Endpoint – How It Works

➡️ **Endpoint URL**
```bash
POST http://localhost:5000/api/gemini
```

➡️ **Purpose**

This endpoint sends a structured prompt to Google Gemini and receives 2–3 recommended events based on the user's preferences.

---

## 3. Request Body Format (What to send in Postman)
```json
{
  "city": "Helsinki",
  "user": {
    "preferences": {
      "categories": ["Music", "Art & Culture"],
      "tags": ["Outdoor"],
      "cities": ["Helsinki"]
    }
  },
  "eventListText": "JSON STRING OF EVENTS"
}
```

Example using our mock data:
```json
{
  "city": "Helsinki",
  "user": {
    "preferences": {
      "categories": ["Music"],
      "tags": ["Outdoor"],
      "cities": ["Helsinki"]
    }
  },
  "eventListText": "[{\"id\":1,\"title\":\"Helsinki Christmas Market\",\"description\":\"Oldest outdoor christmas market\",\"category\":\"Family\"},{\"id\":2,\"title\":\"World Village Festival\",\"description\":\"Multicultural festival\",\"category\":\"Art & Culture\"}]"
}
```

---

## 4. Example Response From AI

The AI controller parses output like this:
```json
{
  "recommended_events": [
    {
      "id": 2,
      "name": "World Village Festival",
      "description": "A multicultural outdoor festival in Helsinki.",
      "reasons_for_recommendation": "Matches user preference for Art & Culture and Outdoor events."
    }
  ]
}
```

---


## 5. How the System Works
### Front-End → Back-End → AI → Back-End → Front-End

1. Front-end sends user preferences + event list

2. Backend builds the AI prompt

3. aiController.js calls Gemini

4. Gemini returns structured recommendations

5. Backend sends JSON back to front-end

---


## 6. File: `AI/aiController.js`-  (What it does)

- Receives POST request

- Extracts:

    - `city`

    - `user.preferences`

    - `eventListText`

- Generates a prompt

- Sends it to Gemini

- Forces AI to respond in strict JSON

- Returns formatted event recommendations

---

## 7. File: `AIserver.js` (What it does)

- Loads environment variables (.env)

- Sets up Express server

- Connects to MongoDB

- Adds middleware (JSON + CORS)

- Registers AI route:
  ```arduino
  app.post("/api/gemini", generateText)
  ```

- Starts server on PORT

---

## 8. Postman Testing 

1. Successful POST request

- URL: POST `http://localhost:5000/api/gemini`

- Body (raw → JSON)

- Result (Event recommendations)