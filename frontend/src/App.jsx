import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import EventsList from './pages/EventsList'
import EventDetails from './pages/EventDetails'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold text-blue-600">UrbanGo</span>
              </Link>

              {/* Navigation Links */}
              <div className="hidden md:flex space-x-8">
                <Link 
                  to="/" 
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Home
                </Link>
                <Link 
                  to="/events" 
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Events
                </Link>
                <Link 
                  to="/transport" 
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Transport
                </Link>
                <Link 
                  to="/favorites" 
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Favorites
                </Link>
              </div>

              {/* Auth Buttons */}
              <div className="flex items-center space-x-4">
                <button 
                  className="px-6 py-2 rounded-lg transition-colors font-medium"
                  style={{ 
                    backgroundColor: '#374151',
                    color: '#ffffff'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#1f2937'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#374151'}
                >
                  Login
                </button>
                <button 
                  className="px-6 py-2 rounded-lg transition-colors font-medium"
                  style={{ 
                    backgroundColor: '#2563eb',
                    color: '#ffffff'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsList />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/transport" element={<ComingSoon page="Transport Planner" />} />
          <Route path="/favorites" element={<ComingSoon page="Favorites" />} />
        </Routes>
      </div>
    </Router>
  )
}

// Home Page Component
function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to UrbanGo
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Your City Events & Transport Companion
            </p>
            <p className="text-lg mb-10 text-blue-50 max-w-2xl mx-auto">
              Discover amazing events in Helsinki region and plan your journey with real-time public transport data
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/events"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#2563eb',
                  textDecoration: 'none'
                }}
                className="px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors"
              >
                Explore Events
              </Link>
              <Link 
                to="/transport"
                style={{
                  backgroundColor: 'transparent',
                  color: '#ffffff',
                  border: '2px solid #ffffff',
                  textDecoration: 'none'
                }}
                className="px-8 py-3 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                Plan Route
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose UrbanGo?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎭</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Discover Events</h3>
              <p className="text-gray-600">
                Find concerts, exhibitions, festivals, and more happening in Helsinki region
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚇</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Plan Your Journey</h3>
              <p className="text-gray-600">
                Get real-time public transport routes using HSL API data
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">❤️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Save Favorites</h3>
              <p className="text-gray-600">
                Bookmark your favorite events and get personalized recommendations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Explore?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start discovering amazing events and planning your perfect city experience
          </p>
          <Link 
            to="/events"
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              textDecoration: 'none',
              display: 'inline-block',
              border: 'none'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
            className="px-8 py-3 rounded-lg font-bold text-lg transition-colors"
          >
            <span style={{ color: '#ffffff' }}>Browse Events Now</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

// Coming Soon Placeholder Component
function ComingSoon({ page }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {page} Coming Soon!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          We're working hard to bring you this feature
        </p>
        <Link 
          to="/events"
          style={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            textDecoration: 'none',
            display: 'inline-block'
          }}
          className="px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Explore Events Instead
        </Link>
      </div>
    </div>
  )
}

export default App