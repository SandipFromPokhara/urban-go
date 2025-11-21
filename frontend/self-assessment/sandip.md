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
  - Developed a fully functional React frontend module for transport route planning.

  - Implemented responsive design with dynamic left/right panels and a Leaflet map.

  - Input validation ensures realistic addresses and disables the search button until valid.

  - Modular code structure with reusable components (FloatingInput, SwapButton, panels).

  - Clear separation of concerns: Search form, Map, Route List, Panels.

  - Easy to customize for mock/demo purposes.

- **Areas for Improvement**  
  - Currently using mock data only; real API integration will be added later.

  - Input validation is basic; more robust handling (e.g., geocoding verification) could improve realism.

  - Map styling and markers could be enhanced for accessibility and better UX.

  - Error handling for edge cases (e.g., geolocation denied) could be more graceful.

- **Action Plan**  
  - Integrate a real transit API to replace mock routes.

  - Enhance input validation with API-based address checks.

  - Improve map markers with icons, popups, and better route visualization.

  - Add fallback messages and user guidance for geolocation or map errors.

  - Refactor code slightly to increase reusability for future modules. 

---

### 5. Additional Notes
- The module demonstrates understanding of React state management, props, and component composition.

- Showcases ability to combine frontend frameworks (React, Framer Motion) with mapping libraries (Leaflet).

- Designed to be fully functional for a school submission demo, with room for future enhancements.

- The code is readable, well-commented, and follows a logical folder structure. 

---

# Documentation for using TransportPage Module

## Overview

`TransportPage` is a React component that provides a simple transit planning interface for a demo application. It includes:

- A **search** form for origin, destination, date, and time.
- A **map** showing routes with Leaflet.
- A **route list** showing mocked route details.
- **Left and right panels** for additional info or widgets.

Currently, it’s designed for **mock/demo data** usage and supports dark/light mode toggling.

## Folder Structure
```
urban-go/frontend/
src/
├─ assets/icons/.svgs              # All reusable SVG icons
├─ components/transport/           # Transport-related components
│  ├─ HeroSection.jsx              # Top hero section / banner
│  ├─ LeftPanel.jsx                # Left sidebar with extra info or popular routes
│  ├─ LocateButton.jsx             # Button to get user’s current location on map
│  ├─ MapControl.jsx               # Map style toggle buttons (default/satellite/dark)
│  ├─ MapSection.jsx               # Main map using Leaflet
│  ├─ RightPanel.jsx               # Right sidebar with alerts or info
│  ├─ RouteList.jsx                # Shows available routes with steps and info
│  ├─ SearchArea.jsx               # Route search form with input validation
│  ├─ ui/                          # Small reusable UI components
│     ├─ FloatingInput.jsx         # Floating label input fields
│     └─ SwapButton.jsx            # Button to swap origin/destination
├─ pages/
│  ├─ TransportPage.jsx            # Container page combining search, map, and panels
├─ styles/
│  ├─ transportation.css           # Custom styles for transport components
├─ App.jsx                          # Main App component
├─ main.jsx                         # Entry point of the React app

```
## Props

### TransportPage
```js
<TransportPage isDarkMode={true} />
```

- isDarkMode (boolean) – controls dark/light theme.

### SearchArea
```js
<SearchArea
  from={from} setFrom={setFrom}
  to={to} setTo={setTo}
  date={date} setDate={setDate}
  time={time} setTime={setTime}
  routes={routes} setRoutes={setRoutes}
  isDarkMode={isDarkMode}
  formInputRef={formInputRef}
  loading={loading} setLoading={setLoading}
  activeRouteIndex={activeRouteIndex} setActiveRouteIndex={setActiveRouteIndex}
  swapLocations={swapLocations}
  fillCurrentLocation={fillCurrentLocation}
/>
```

- Handles search inputs, validates, and triggers mock route fetch.

- Dynamically shows **route list** and **quick info** panels.

### MapSection
```js
<MapSection
  routes={routes}
  isDarkMode={isDarkMode}
  mapStyle={mapStyle}
  setMapStyle={setMapStyle}
  activeRouteIndex={activeRouteIndex}
  setActiveRouteIndex={setActiveRouteIndex}
/>
```

- Displays a Leaflet map with markers for routes.

- Centers on selected route.

- Supports multiple map styles (street, satellite, dark).

### LeftPanel / RightPanel
```js
<LeftPanel setFrom={setFrom} setTo={setTo} isDarkMode={isDarkMode} />
<RightPanel isDarkMode={isDarkMode} />
```

- Optional info panels for extra content (popular routes, alerts, icons, or images).

- Can be customized with static content or additional widgets.

---

## Features

**1. Search Validation**

    - Cannot be empty.

    - Minimum 3 characters.

    - Must contain letters and spaces.

    - Search button disabled until valid.

**2. Map Integration**

    - Leaflet map reacts to active route selection.

    - Toggle between default, satellite and dark view.

    - Markers indicate route start locations.

    - Polyline highlights the active route.

    - Visible on desktop (hidden on mobile).

**3. Responsive Design**

    - Left and right panels visible on desktop (hidden on mobile).

    - Main content stretches and adapts height when route list appears.

**4. Mock Routes**

    - For demo purposes only.

    - Routes include name, duration, modes, steps, CO₂, and distance.

## Usage Instructions

**1. Install dependencies:**
```bash
npm install react react-dom react-icons framer-motion leaflet react-leaflet
```

**2. Import component:**
```js
import TransportPage from './pages/TransportPage';
```

**3. Render in App:**
```js
function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <TransportPage isDarkMode={isDarkMode} />
  );
}
```

**4. Run project:**
```
npm start or npm run dev
```

---

## Customization

- Map styles: modify `mapStyle` in `MapSection`.

- Panels: edit `LeftPanel.jsx` / `RightPanel.jsx` to add icons, images, or widgets.

- Validation: `validateInput` in `SearchArea.jsx` controls what is considered valid input.

- Mock data: adjust `handleSearch` function to add/remove routes for demo.

### Notes

- This module is for mock/demo purposes; no real API calls.

- Works best with a modern browser supporting Leaflet.

- Designed for school submission and demonstration of React state, props, and layout.