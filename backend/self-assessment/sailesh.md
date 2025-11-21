# Self-Assessment  

- **Member name:** *Sailesh Karki*  
- **Contribution area:** *briefly describe what part of the project you worked on (e.g., frontend component, backend route, database schema, etc.)*

--- Backend user authentication, NodeJs/ Express API authroutes, Database setup and Trello work flow management and daily scrum facilitation.

### 1. Functionality
- **Does the code meet the requirements?**
  - [ Implemented user registration and login with JWT-based authentication, supporting both admin and user flows.] Does it implement all specified features you were responsible for?  
  - [Handeled key edge cases: missing/invalid input, duplicaate accounts, password validation ] Are edge cases handled (e.g., invalid data, duplicates)?  
  - [ Backend server issue after pulling from the devlopment branch, server crash and module not found issue and merge conflict.] Are there any bugs or unexpected behaviors?  

- **Integration**
  - [ Register and Login routes were tested using postman and successfully post for register and login and get jwt bearer token for protectroute route.] Does your code work correctly with other parts of the application?  
  - [ Authentication middleware is reusable with protected routes.] Are inputs and outputs managed appropriately?  

---

### 2. Code Quality
- **Readability**
  - [ Code is structured with descriptive variable and fucntion names (authController, authMiddleware and authRoutes.)] Is your code easy to understand for other developers?  
  - [ Main module separated logically (routes, controllers, models.)] Are variable and function names descriptive and meaningful?  

- **Reusability**
  - [ JWT authentication logic modular and can be reused for other protected API routes.] Can your code or parts of it be reused elsewhere in the application?  
  - [ MongoDB schema designed for extensibility (users, events)] Is logic modular and separated from unrelated concerns?  

- **Comments and Documentation**
  - [ Complex logic (token generation, error handling) explained in comments.)] Are there comments explaining complex logic?  
  - [ Documentation for usage is available, but end to end API usage can be clarified further for a new team members. ] Is there documentation for how to use your code unit?  

---

### 3. Performance
- **Efficiency**
  - [ API endpoints optimized for single document queries and indexing MongoDB.] Are there any unnecessary operations or performance bottlenecks?  
  - [ Futher optimization will be especially important and expand the favorities, reviews and comments features. These modules will likely require efficient quering and updating of user-specific and event specific data, and could involve frequent read/ write operations as user interacts with events. So anticipating scaling issues (e.g many favorities or reviews, rapid user activity.)] Is the code optimized for larger datasets or high traffic (if applicable)?  

---

### 4. Overall Assessment
- **Strengths**  
  - List the strengths of your contribution.  
    - Successfully implemented secure registration and login flow using best practice(bcrypt for passwords, JWT for sessions.)
    - Ensured modular code structure allowing team members to extend features.
    - Let daily scrum meeting, keep Trello workflow updated and blockers visible, improving team collaboration.

- **Areas for Improvement**  
  - List areas where your code could be improved.  
    - Code Review can be done frequently and resolve the merge conflicts.
    - Proper requirement fo clear understanding and task alignment.
    - Proper goal for the product development so as to plan the feature implemtation on time.

- **Action Plan**  
  - Outline specific steps to address the areas for improvement.  
    - Review backend validation logic and error handling and synchronizing with UI.
    - Prepare for Sprint 3 goals and plan early about any changes in made in the development and main branch.
    - Overcome merge conflict and server running issue and most important is code review and proper version control.

---

### 5. Additional Notes
- Add any other relevant observations or feedback about your contribution.  
  - Team accomplished all main Sprint 2 goals, collaboration and UI developement were robust.
  - Next sprint, I will suppost knowledge handover for new Scrum master and focus on implementing User Panel and Admin Panel features.
  - I appreciate the team's commitment to transparency and adaptability, which helped us overcome blockers efficiently.