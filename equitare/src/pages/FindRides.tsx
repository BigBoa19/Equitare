import React, { useState } from 'react';

const FindRides: React.FC = () => {
  const [formData, setFormData] = useState({
    university: '',
    departureDate: '',
    departureTime: '',
    airport: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app, this would make an API call to search for matches
  };

  // Mock data for search results
  const mockRides = [
    { id: 1, name: 'Alex J.', university: 'Stanford University', date: '2023-05-15', time: '14:00', airport: 'SFO' },
    { id: 2, name: 'Taylor R.', university: 'Stanford University', date: '2023-05-15', time: '14:30', airport: 'SFO' },
    { id: 3, name: 'Jordan K.', university: 'Stanford University', date: '2023-05-15', time: '15:00', airport: 'SFO' },
    { id: 4, name: 'Morgan P.', university: 'Stanford University', date: '2023-05-16', time: '09:00', airport: 'SFO' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-primary-dark">Find Ride Matches</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary-dark">Enter Your Travel Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">University</label>
              <select 
                name="university" 
                value={formData.university} 
                onChange={handleChange}
                className="w-full p-2 border border-secondary rounded focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select your university</option>
                <option value="Carnegie Mellon University">Carnegie Mellon University</option>
                <option value="Stanford University">Stanford University</option>
                <option value="UC Berkeley">UC Berkeley</option>
                <option value="UCLA">UCLA</option>
                <option value="USC">USC</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Airport</label>
              <select 
                name="airport" 
                value={formData.airport} 
                onChange={handleChange}
                className="w-full p-2 border border-secondary rounded focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select airport</option>
                <option value="SFO">San Francisco International (SFO)</option>
                <option value="OAK">Oakland International (OAK)</option>
                <option value="SJC">San Jose International (SJC)</option>
                <option value="LAX">Los Angeles International (LAX)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Departure Date</label>
              <input 
                type="date" 
                name="departureDate" 
                value={formData.departureDate} 
                onChange={handleChange}
                className="w-full p-2 border border-secondary rounded focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Approximate Departure Time</label>
              <input 
                type="time" 
                name="departureTime" 
                value={formData.departureTime} 
                onChange={handleChange}
                className="w-full p-2 border border-secondary rounded focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>
          
          <div className="mt-6">
            <button 
              type="submit" 
              className="bg-primary hover:bg-primary-dark text-white py-2 px-6 rounded transition duration-200"
            >
              Search for Matches
            </button>
          </div>
        </form>
      </div>
      
      {submitted && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-primary-dark">Potential Matches</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-secondary">
                <tr>
                  <th className="py-3 px-4 text-left">Student</th>
                  <th className="py-3 px-4 text-left">University</th>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Time</th>
                  <th className="py-3 px-4 text-left">Airport</th>
                  <th className="py-3 px-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {mockRides.map(ride => (
                  <tr key={ride.id} className="border-b hover:bg-secondary-light">
                    <td className="py-3 px-4">{ride.name}</td>
                    <td className="py-3 px-4">{ride.university}</td>
                    <td className="py-3 px-4">{ride.date}</td>
                    <td className="py-3 px-4">{ride.time}</td>
                    <td className="py-3 px-4">{ride.airport}</td>
                    <td className="py-3 px-4">
                      <button className="bg-primary text-white py-1 px-3 rounded text-sm hover:bg-primary-dark transition duration-200">
                        Connect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <p className="mt-4 text-gray-600">
            Note: These are students planning to travel on or near your selected date.
            Times shown are approximate departure times.
          </p>
        </div>
      )}
    </div>
  );
};

export default FindRides; 