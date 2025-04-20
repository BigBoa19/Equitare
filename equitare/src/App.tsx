import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import FindRides from './pages/FindRides';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route 
                path="/find-rides" 
                element={
                  <ProtectedRoute>
                    <FindRides />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <div className="container mx-auto px-4 py-8">
                      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
                      <p>This is a protected page that only logged-in users can see.</p>
                    </div>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-rides" 
                element={
                  <ProtectedRoute>
                    <div className="container mx-auto px-4 py-8">
                      <h1 className="text-2xl font-bold mb-4">My Rides</h1>
                      <p>This is a protected page that only logged-in users can see.</p>
                    </div>
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
