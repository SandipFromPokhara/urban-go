# Self-Assessment  

- **Member name:** *Sandip Ranjit*  
- **Contribution area:** Full-stack Development (Frontend & Backend)*

  **Frontend:**

  - Developed key components for Transport page, including:

    - Search area, autocomplete dropdowns, swap functionality, route timeline display, and right-panel widgets featuring live weather data of Helsinki and HSL ticket prices.

    - Add validations for route search inputs.

    - Map display and interactive features for route visualization, fetch public transport and service disruptions.

  - Developed the UrbanGo AI Assistant page (AIPage.jsx), including:

    - Chat interface, message handling, Markdown-rendered event lists, motion effects, and responsive UI/UX.

  **Backend:**

    - Implemented API endpoints for route search, autocomplete, ai, service alerts and weather data fetching.

    - Add validation middleware for user registration.

    - Developed reusable service files for key backend functionalities:

      - `geoCodeService.js` – for geocoding addresses and locations.

      - `transportRoutingService.js` – for fetching and formatting route information.

      - `weatherService.js` – for retrieving current and forecast weather data.

    - Integrated AI controller, config, service for event and route recommendations (`aiService.js`).

    - Structured data inference for messages, ensuring Capital Region-specific event responses.

    - Prepare `app.js` and `index.js` ready for deployment.

  **Full-stack Integration:**

    - Ensured seamless integration between frontend components and backend APIs for transportation route, autocomplete, weather, and AI assistant features.

    - Proper input/output handling, propagating selected locations and chat messages between components.

  **Version Control & Collaboration:**

    - Responsible for merging all project branches and resolving code conflicts, ensuring a smooth and consistent codebase across the team.

---

### 1. Functionality
- **Does the code meet the requirements?**
  - [Y] Does it implement all specified features you were responsible for?  
  - [Y] Are edge cases handled (e.g., invalid data, duplicates)?  
  - [Y] Are there any bugs or unexpected behaviors?  

  **Frontend:**

    - Handled edge cases such as invalid inputs, empty search fields, and missing API data.

    - Minor bug remains in initial refocusing of map based on routes; static location weather works correctly.

  **Backend:**

    - Fully functional AI mode chat, including Markdown-rendered event lists.

    - Backend parses user messages into structured intents and parameters.

    - Edge cases like empty inputs and API errors are handled gracefully.

- **Integration**
  - [Y] Does your code work correctly with other parts of the application?  
  - [Y] Are inputs and outputs managed appropriately?  

---

### 2. Code Quality
- **Readability**
  - [Y] Is your code easy to understand for other developers?  
  - [Y] Are variable and function names descriptive and meaningful?

    - Frontend React components, custom hooks, backend files and functions have clear, descriptive names. 

- **Reusability**
  - [Y] Can your code or parts of it be reused elsewhere in the application?  
  - [Y] Is logic modular and separated from unrelated concerns?  

    - Autocomplete, map display, weather, and AI service hooks/functions are reusable.

    - Route formatting and API fetching logic is modular and separated from unrelated concerns.

    - Frontend components such as chat card and message bubbles are reusable across different pages or features.

- **Comments and Documentation**
  - [Y] Are there comments explaining complex logic?  
  - [N] Is there documentation for how to use your code unit?  (Only API doc is available)

    - Inline comments exist for UI behavior, motion animations, and complex state updates; some components could use additional comments for clarity.

---

### 3. Performance
- **Efficiency**
  - [N] Are there any unnecessary operations or performance bottlenecks?  
  - [Y] Is the code optimized for larger datasets or high traffic (if applicable)?

    - API calls are optimized to fetch only necessary data.

    - Frontend React state is handled efficiently with minimal unnecessary re-renders.

    - Backend avoids redundant calls by structuring AI messages and fetching only required data.

    - Opportunities for further optimization:

    - Handling very large route datasets.

    - Caching or pagination for AI chat to improve performance with long conversations.  

---

### 4. Overall Assessment
- **Strengths**  
  - Strong full-stack integration between frontend and backend.

  - Clean, modular code with reusable hooks and components.

  - Successfully implemented key features for user interaction: autocomplete, swap, timeline, map, chat interface, and AI-driven event recommendations.

  - Improved user experience with smooth interactions, Markdown rendering, motion effects, and responsive design.

  - Maintained codebase integrity by handling branch merges and resolving conflicts efficiently.

  - Team management and communication.

- **Areas for Improvement**  
  - Fix dynamic weather fetching based on user selection.

  - Enhance error handling for backend failures.

  - Add more inline comments for complex functions.

  - Map is currently zoomed in to central Helsinki. Initial dynamic refocusing of map based on users route search would be better, as areas outside central Helsinki are currently invisible in map.

- **Action Plan**  
  -  Finalize weather fetching and display for dynamic user-selected locations.

  - Add robust error handling for all API failures.

  - Improve documentation and inline comments for easier maintenance and handoff.

  - Implement scroll-to-bottom auto-scroll for AI chat conversations.

  - Continue to maintain clean branch management and ensure conflict-free merges.

---

### 5. Additional Notes
- Contributions span full-stack development, demonstrating strong understanding of both frontend React and backend API work.

- Focused on improving user experience with smooth autocomplete handling, route visualization, and interactive AI chat features.

- Learned and applied AI response parsing, structured data inference, error handling, and Markdown rendering.

- Actively maintained the team codebase through branch merging and conflict resolution.

- Overall, the project show clear integration of multiple components and APIs, with opportunities for enhancement in auxiliary features like weather and CO₂ display.