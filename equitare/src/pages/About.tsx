import React from 'react';

const About: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-primary-dark">About Equitare</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary-dark">Our Mission</h2>
        <p className="mb-4">
        Equitare's mission is to empower university students at Carnegie Mellon University in their
        travels by making airport transportation more affordable, convenient, and community-driven.        </p>
        <p>
          We understand that college students are often on tight budgets, and 
          transportation to airports can be expensive. By connecting students who are 
          traveling to the same airport at similar times, we help create an affordable 
          and community-oriented solution.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary-dark">Benefits of Ride Sharing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-secondary-light p-5 rounded-lg shadow-md">
            <h3 className="text-xl font-medium mb-2 text-primary-dark">Financial Savings</h3>
            <p>
              By splitting ride costs, students can save significant amounts on 
              transportation expenses, sometimes up to 75% of the original cost.
            </p>
          </div>
          <div className="bg-secondary-light p-5 rounded-lg shadow-md">
            <h3 className="text-xl font-medium mb-2 text-primary-dark">Environmental Impact</h3>
            <p>
              Sharing rides means fewer vehicles on the road, which reduces carbon 
              emissions and helps the environment.
            </p>
          </div>
          <div className="bg-secondary-light p-5 rounded-lg shadow-md">
            <h3 className="text-xl font-medium mb-2 text-primary-dark">Community Building</h3>
            <p>
              Equitare helps students connect with peers from their university, 
              fostering new friendships and strengthening the campus community.
            </p>
          </div>
          <div className="bg-secondary-light p-5 rounded-lg shadow-md">
            <h3 className="text-xl font-medium mb-2 text-primary-dark">Stress Reduction</h3>
            <p>
              Planning travel becomes less stressful when coordinated with others who 
              have similar plans and destinations.
            </p>
          </div>
        </div>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary-dark">Our Team</h2>
        <p className="mb-6">
          Meet the founding team behind Equitare - passionate students committed to making travel easier and more affordable.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-64 bg-gray-200 flex items-center justify-center">
              {/* Putt's image */}
              <div className="text-gray-400"><img 
  src="/public/Putt.png" 
  alt="Putt" 
  className="h-64 w-full object-cover"
/></div>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-medium mb-2 text-primary">Putt</h3>
              <p className="text-gray-700">
                Co-founder and chief financial officer. Putt leads the team in financial planning and analysis in planning the business.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-64 bg-gray-200 flex items-center justify-center">
              {/* Noah's image */}
              <div className="text-gray-400"><img 
  src="/public/noah.png" 
  alt="Putt" 
  className="h-64 w-full object-cover"
/></div>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-medium mb-2 text-primary">Noah</h3>
              <p className="text-gray-700">
                Co-founder and chief technology officer. Noah leads the team in software development, frontend and backend.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-64 bg-gray-200 flex items-center justify-center">
              {/* William's image */}
              <div className="text-gray-400"><img 
  src="/public/Will.png" 
  alt="Putt" 
  className="h-64 w-full object-cover"
/></div>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-medium mb-2 text-primary">William</h3>
              <p className="text-gray-700">
                Co-founder and lead designer. William leads the team in design and user experience, as well as creating wireframes and mockups.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-primary-dark">Contact Us</h2>
        <p className="mb-4">
          Have questions, suggestions, or feedback? We'd love to hear from you!
        </p>
        <a href="/pdf/BusinessPlan.pdf" target="_blank" rel="noopener noreferrer">Business Plan</a>
        <p>
          Email us at: <a href="mailto:support@equitare.com" className="text-primary hover:text-primary-dark hover:underline">support@equitare.com</a>
        </p>
      </section>
    </div>
  );
};

export default About; 