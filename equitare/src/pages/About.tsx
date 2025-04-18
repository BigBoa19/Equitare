import React from 'react';

const About: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-primary-dark">About RideSplit</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary-dark">Our Mission</h2>
        <p className="mb-4">
          RideSplit was created with a simple mission: to help university students save money on 
          transportation costs when traveling to airports during breaks and holidays.
        </p>
        <p>
          We understand that college students are often on tight budgets, and 
          transportation to airports can be expensive. By connecting students who are 
          traveling to the same airport at similar times, we help create an affordable 
          and community-oriented solution.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary-dark">How We Started</h2>
        <p>
          The idea for RideSplit was born when a group of university students realized 
          how many of their peers were separately ordering rides to the same airport 
          during holiday breaks. They recognized that coordinating these trips could save 
          everyone money while also reducing the number of vehicles on the road.
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
              RideSplit helps students connect with peers from their university, 
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
      
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-primary-dark">Contact Us</h2>
        <p className="mb-4">
          Have questions, suggestions, or feedback? We'd love to hear from you!
        </p>
        <p>
          Email us at: <a href="mailto:support@ridesplit.com" className="text-primary hover:text-primary-dark hover:underline">support@ridesplit.com</a>
        </p>
      </section>
    </div>
  );
};

export default About; 