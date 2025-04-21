import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Define interface for Ride type
interface Ride {
  _id: string;
  user: string | {
    _id: string;
    name: string;
    email: string;
  };
  creatorName: string;
  university: string;
  airport: string;
  departureDate: string;
  departureTime: string;
  maxPassengers: number;
  currentPassengers: string[];
  status: 'open' | 'full' | 'completed' | 'cancelled';
  createdAt: string;
}

const FindRides: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Create Ride state
  const [createFormData, setCreateFormData] = useState({
    university: user?.university || '',
    departureDate: '',
    departureTime: '',
    airport: ''
  });
  
  // Search filters state
  const [searchFilters, setSearchFilters] = useState({
    university: '',
    airport: '',
    departureDate: '',
    departureTime: ''
  });
  
  const [rides, setRides] = useState<Ride[]>([]);
  const [filteredRides, setFilteredRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeSection, setActiveSection] = useState('search'); // 'search' or 'create'

  // Fetch all rides on component mount
  useEffect(() => {
    fetchRides();
  }, []);
  
  // Apply filters when rides or filters change
  useEffect(() => {
    applyFilters();
  }, [rides, searchFilters]);
  
  // Clear success message after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('');
      }, 5000);
      
      // Clean up the timer if the component unmounts or success changes
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Handle changes in create ride form
  const handleCreateFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCreateFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle changes in search filters
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Fetch all rides from API
  const fetchRides = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/rides', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const result = await response.json();
      setRides(result);
      setFilteredRides(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch rides');
    } finally {
      setLoading(false);
    }
  };
  
  // Apply filters to rides
  const applyFilters = () => {
    let filtered = [...rides];
    
    // Filter by university
    if (searchFilters.university) {
      filtered = filtered.filter(ride => 
        ride.university.toLowerCase() === searchFilters.university.toLowerCase()
      );
    }
    
    // Filter by airport
    if (searchFilters.airport) {
      filtered = filtered.filter(ride => 
        ride.airport.toLowerCase() === searchFilters.airport.toLowerCase()
      );
    }
    
    // Filter by date
    if (searchFilters.departureDate) {
      const filterDate = new Date(searchFilters.departureDate).toDateString();
      filtered = filtered.filter(ride => {
        const rideDate = new Date(ride.departureDate).toDateString();
        return rideDate === filterDate;
      });
    }
    
    // Filter by time (approximate match within 1 hour)
    if (searchFilters.departureTime) {
      const [filterHours, filterMinutes] = searchFilters.departureTime.split(':').map(Number);
      const filterTimeInMinutes = filterHours * 60 + filterMinutes;
      
      filtered = filtered.filter(ride => {
        const [rideHours, rideMinutes] = ride.departureTime.split(':').map(Number);
        const rideTimeInMinutes = rideHours * 60 + rideMinutes;
        
        // Within 1 hour (60 minutes)
        return Math.abs(rideTimeInMinutes - filterTimeInMinutes) <= 60;
      });
    }
    
    setFilteredRides(filtered);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchFilters({
      university: '',
      airport: '',
      departureDate: '',
      departureTime: ''
    });
  };

  // Handle creating a new ride
  const handleCreateRide = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Validate form data
      if (!createFormData.university || !createFormData.airport || !createFormData.departureDate || !createFormData.departureTime) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }
      
      // Make API call to create ride
      const response = await fetch('http://localhost:3001/api/rides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          university: createFormData.university,
          airport: createFormData.airport,
          departureDate: createFormData.departureDate,
          departureTime: createFormData.departureTime,
          maxPassengers: 3
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }
    
      setSuccess('Your ride has been successfully created!');
      
      // Reset form after successful creation
      setCreateFormData({
        university: user?.university || '',
        departureDate: '',
        departureTime: '',
        airport: ''
      });
      
      // Refresh the rides list
      fetchRides();
      
      // Switch to search mode to see the new ride
      setActiveSection('search');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle messaging a ride creator
  const handleMessageUser = (ride: Ride) => {
    // We need to handle both cases:
    // 1. When user is populated as an object (from server)
    // 2. When user is just the ID string (from our interface)
    const userId = typeof ride.user === 'object' ? ride.user._id : ride.user;
    navigate(`/messages/${userId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-primary-dark">Equitare Rides</h1>
      
      <div className="mb-6">
        <div className="flex space-x-4 mb-4">
          <button 
            onClick={() => setActiveSection('search')}
            className={`px-4 py-2 rounded transition-colors ${
              activeSection === 'search' 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Search for Rides
          </button>
          <button 
            onClick={() => setActiveSection('create')}
            className={`px-4 py-2 rounded transition-colors ${
              activeSection === 'create' 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Create a Ride
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      {/* SEARCH SECTION */}
      {activeSection === 'search' && (
        <>
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary-dark">Filter Rides</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">University</label>
                <select 
                  name="university" 
                  value={searchFilters.university} 
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-secondary rounded focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Any University</option>
                  <option value="Carnegie Mellon University">Carnegie Mellon University</option>
                  <option value="Stanford University">Stanford University</option>
                  <option value="UC Berkeley">UC Berkeley</option>
                  <option value="UCLA">UCLA</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Airport</label>
                <select 
                  name="airport" 
                  value={searchFilters.airport} 
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-secondary rounded focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Any Airport</option>
                  <option value="PIT">Pittsburgh International (PIT)</option>
                  <option value="JFK">New York JFK International (JFK)</option>
                  <option value="LAX">Los Angeles International (LAX)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Departure Date</label>
                <input 
                  type="date" 
                  name="departureDate" 
                  value={searchFilters.departureDate} 
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-secondary rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Approximate Time</label>
                <input 
                  type="time" 
                  name="departureTime" 
                  value={searchFilters.departureTime} 
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-secondary rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button 
                onClick={clearFilters}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded mr-2"
              >
                Clear Filters
              </button>
              <button 
                onClick={fetchRides}
                className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded"
              >
                Refresh Results
              </button>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary-dark">Available Rides</h2>
            
            {loading ? (
              <div className="text-center py-4">Loading rides...</div>
            ) : filteredRides.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No rides found matching your criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="py-3 px-4 text-left">Student</th>
                      <th className="py-3 px-4 text-left">University</th>
                      <th className="py-3 px-4 text-left">Date</th>
                      <th className="py-3 px-4 text-left">Time</th>
                      <th className="py-3 px-4 text-left">Airport</th>
                      <th className="py-3 px-4 text-left">Spots</th>
                      <th className="py-3 px-4 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRides.map((ride: Ride) => (
                      <tr key={ride._id} className="border-b hover:bg-secondary-light">
                        <td className="py-3 px-4">{ride.creatorName}</td>
                        <td className="py-3 px-4">{ride.university}</td>
                        <td className="py-3 px-4">{new Date(ride.departureDate).toLocaleDateString()}</td>
                        <td className="py-3 px-4">{ride.departureTime}</td>
                        <td className="py-3 px-4">{ride.airport}</td>
                        <td className="py-3 px-4">
                          {ride.currentPassengers?.length || 0}/{ride.maxPassengers}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleMessageUser(ride)}
                              className="bg-primary text-white py-1 px-3 rounded text-sm transition duration-200"
                            >
                              Message
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <p className="mt-4 text-gray-600">
              Note: Times shown are approximate departure times.
            </p>
          </div>
        </>
      )}
      
      {/* CREATE SECTION */}
      {activeSection === 'create' && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-primary-dark">Create a New Ride</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">University</label>
              <select 
                name="university" 
                value={createFormData.university} 
                onChange={handleCreateFormChange}
                className="w-full p-2 border border-secondary rounded focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select your university</option>
                <option value="Carnegie Mellon University">Carnegie Mellon University</option>
                <option value="Stanford University">Stanford University</option>
                <option value="UC Berkeley">UC Berkeley</option>
                <option value="UCLA">UCLA</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Airport</label>
              <select 
                name="airport" 
                value={createFormData.airport} 
                onChange={handleCreateFormChange}
                className="w-full p-2 border border-secondary rounded focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select airport</option>
                <option value="PIT">Pittsburgh International (PIT)</option>
                <option value="JFK">New York JFK International (JFK)</option>
                <option value="LAX">Los Angeles International (LAX)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Departure Date</label>
              <input 
                type="date" 
                name="departureDate" 
                value={createFormData.departureDate} 
                onChange={handleCreateFormChange}
                className="w-full p-2 border border-secondary rounded focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Approximate Departure Time</label>
              <input 
                type="time" 
                name="departureTime" 
                value={createFormData.departureTime} 
                onChange={handleCreateFormChange}
                className="w-full p-2 border border-secondary rounded focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>
          
          <div className="mt-6">
            <button 
              type="button"
              onClick={handleCreateRide}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Ride'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindRides; 