import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-10">
        <h1 className="text-4xl font-bold mb-4 text-primary-dark">RideSplit</h1>
        <p className="text-xl mb-6">
          Connect with other university students to share rides to the airport and save money!
        </p>
        <div className="bg-primary-light p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-3 text-primary-dark">How It Works</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Create an account with your university email</li>
            <li>Search for students traveling to the same airport on similar dates</li>
            <li>Connect and coordinate ride details</li>
            <li>Split the cost and save money!</li>
          </ol>
        </div>
      </section>
      
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-primary-dark">Find Students Traveling Soon</h2>
        <div className="bg-secondary p-6 rounded-lg shadow-md">
          <p className="text-center text-lg font-medium">
            Ready to find ride partners for your next trip?
          </p>
          <div className="mt-4 text-center">
            <Link to="/find-rides">
              <button className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded transition duration-200">
                Find Rides Now
              </button>
            </Link>
          </div>
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-primary-dark">Why Choose RideSplit?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-secondary-light p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200">
            <h3 className="text-xl font-medium mb-2 text-primary-dark">Save Money</h3>
            <p>Split ride costs and save up to 75% on your trips to the airport</p>
          </div>
          <div className="bg-secondary-light p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200">
            <h3 className="text-xl font-medium mb-2 text-primary-dark">Meet Students</h3>
            <p>Connect with other students from your university</p>
          </div>
          <div className="bg-secondary-light p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200">
            <h3 className="text-xl font-medium mb-2 text-primary-dark">Travel Safely</h3>
            <p>All users are verified with university emails for added security</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 