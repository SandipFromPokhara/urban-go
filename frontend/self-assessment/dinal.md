# Self-Assessment  

- **Member name:** *Dinal Maha Vidanelage*  
- **Contribution area:** *Implemented eventlist page and eventdetails page*

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
  - [N] Are there comments explaining complex logic?  
  - [N] Is there documentation for how to use your code unit?  

---

### 3. Performance
- **Efficiency**
  - [N] Are there any unnecessary operations or performance bottlenecks?  
  - [ ] Is the code optimized for larger datasets or high traffic (if applicable)?  

---

### 4. Overall Assessment
- **Strengths**  
  - Successfully implemented a fully responsive Events List page with a visually appealing hero section.
  - Developed a modular component structure with reusable components (EventCard, EventsGrid, SearchBar, Pagination).
  - Implemented real-time search with filtering capabilities across multiple event properties. 

- **Areas for Improvement**  
  - Some styling logic is repeated across components like dark mode conditional classes 
  - Current search implementation filters on every keystroke without debouncing, which could impact performance with larger datasets.
  - Error states are minimal.

- **Action Plan**  
  - Implement React Context for theme management.
  - Add debouncing to search functionality.

---

### 5. Additional Notes
- I chose to use inline styles for dynamic hover effects due to limitations with Tailwind's JIT compiler.
- I resolved event routing issue where clicking on events displayed incorrect event details due to ID type mismatch. 
- Worked with the team to understand the API and make sure the frontend mock data matched the backend models correctly.