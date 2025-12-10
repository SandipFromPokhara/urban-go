# Self-Assessment  

- **Member name:** *Sailesh Karki*  
- **Contribution area:** *briefly describe what part of the project you worked on (e.g., frontend component, backend route, database schema, etc.)*
  - Backend user and auth features and related infrastructure: implemented userController and authController for signup/login using JWT, wired database connection, added Swagger‑UI API documentation; on the frontend, built user components such as useUserProfile hook and UserPanel page with user profile update and delete functionality.
---

### 1. Functionality
- **Does the code meet the requirements?**
  - [Y ] Does it implement all specified features you were responsible for?  
    - Implements signup and login with JWT, protected user routes, and profile update/delete as specified.
  - [ Y] Are edge cases handled (e.g., invalid data, duplicates)?  
    - Handles common edge cases such as invalid credentials, missing fields, and unauthorized access.
  - [N ] Are there any bugs or unexpected behaviors?  
  - No issue or bugs.

- **Integration**
  - [Y ] Does your code work correctly with other parts of the application?  
    - Auth and user routes integrate with the shared JWT middleware so other routes can use the same authentication mechanism.
  - [ Y] Are inputs and outputs managed appropriately?  
    - Frontend user panel and useUserProfile hook interact correctly with the backend APIs and reflect changes (update/delete) in the UI.
---

### 2. Code Quality
- **Readability**
  - [ Y] Is your code easy to understand for other developers?  
    - Controller functions and hooks are split into clear units with descriptive names (registerUser, loginUser, updateUserProfile, etc.).
  - [ Y] Are variable and function names descriptive and meaningful?  
    - The structure of auth and user controllers makes it easy for others to follow the request flow.

- **Reusability**
  - [ Y] Can your code or parts of it be reused elsewhere in the application?  
    - Shared JWT logic and validation are centralized in controllers/middleware so the pattern can be reused for future protected routes.
  - [ Y] Is logic modular and separated from unrelated concerns?  
    - The useUserProfile hook encapsulates fetching and updating user data, allowing multiple components to reuse it if needed.

- **Comments and Documentation**
  - [ Y] Are there comments explaining complex logic? 
    - Key parts of the auth and user logic are commented where behavior is non‑obvious.
  - [Y ] Is there documentation for how to use your code unit?  
    - Swagger‑UI documentation describes endpoints, parameters, and responses, helping teammates and testers use the APIs.


---

### 3. Performance
- **Efficiency**
  - [ Y] Are there any unnecessary operations or performance bottlenecks?  
    - Database operations for user signup, login, and profile updates are straightforward and avoid unnecessary queries.
  - [ Y] Is the code optimized for larger datasets or high traffic (if applicable)?  
    - Further optimization (indexes on frequently queried fields, more detailed logging for slow requests) could be explored if the user base grows. 

---

### 4. Overall Assessment
- **Strengths**  
  - List the strengths of your contribution.  
    - Delivered a complete user authentication and profile management flow, from database connection and controllers to frontend UI.
    - Used JWT and middleware to keep security logic consistent and reusable across routes.
    - Added Swagger‑UI docs, making the backend easier to understand, test, and extend.
- **Areas for Improvement**  
  - List areas where your code could be improved.  
    - Increase test coverage for auth and user routes (unit and integration tests).
    - Improve validation and error responses for edge cases like weak passwords or conflicting updates.
    - Refine the user panel UX, for example better feedback after profile changes or deletion.

- **Action Plan**  
  - Outline specific steps to address the areas for improvement.  
    - Add Jest or similar tests for authController and userController, including success and failure paths.
    - Introduce a shared validation layer for auth/user inputs and standardize error formats.
    - Iterate on the user panel UI based on user/tester feedback to make actions and states clearer.

---

### 5. Additional Notes
- Add any other relevant observations or feedback about your contribution.  
  - Helped ensure the database connection is reliable and configurable via environment variables.
  - Coordinated Swagger endpoint documentation so other team members could plug their features into the same API and test quickly.
  - Used Git branches and pull request consistently, so changes could be reviewed and merged into the shared sprint branches with minimal conflicts.