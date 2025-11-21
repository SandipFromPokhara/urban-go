# Self-Assessment  

- **Member name:** *Dinal Maha Vidanelage*  
- **Contribution area:** *implemented the Express.js REST API server structure with MongoDB integration, including routes, controllers, and models for Events, Transports, and Users resources*

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
  - [N] Is there documentation for how to use your code unit?  

---

### 3. Performance
- **Efficiency**
  - [N] Are there any unnecessary operations or performance bottlenecks?  
  - [ ] Is the code optimized for larger datasets or high traffic (if applicable)?  

---

### 4. Overall Assessment
- **Strengths**  
  - Successfully implemented a well-organized Model-View-Controller pattern with clear separation of concerns, making the code easier to maintain.
  - Developed comprehensive Create, Read, Update, and Delete operations for all three resource types (Events, Transports, Users).
  - Created separate router files for each resource, improving reusability and keeping the main server file clean and easy to extend.
  - Added key Express middleware like CORS, JSON parsing, and dotenv to keep the API secure and running smoothly.

- **Areas for Improvement**  
  - Currently using only Mongoose schema validation.
  - Error handling is repetitive across controllers with similar try-catch blocks.
  - Current schemas work independently and don’t use MongoDB’s referencing features.

- **Action Plan**  
  - Add strong input validation using express-validator for all POST and PATCH routes.
  - Create a centralized error-handling system with custom error classes for more consistent responses.
  - update the schemas to use references, use populate() to pull related data, add indexes for faster queries, and adjust the controllers to support the changes.

---

### 5. Additional Notes
- I chose Express.js because it’s simple, familiar to the team. Its middleware system makes it easy to add features like authentication, validation, and logging. 
- Chose Mongoose instead of the native MongoDB driver because it provides schema validation, easier queries, and helpful features like timestamps and virtuals.
- I worked with the team to match API responses with their expected data and updated the mock data to fit the real backend schema.