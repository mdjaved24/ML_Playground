// src/pages/Home.jsx
import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';


function Homepage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="gradient-bg py-20 full-width">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-gray-900)] mb-6">
                Welcome to Your <span className="gradient-text">ML Playground</span>
              </h1>
              <p className="text-lg text-[var(--color-gray-600)] mb-8 max-w-lg">
                The easiest way to build, train, and deploy machine learning models - no coding required. 
                Perfect for data exploration, quick prototypes, and educational purposes.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href='/playground' className="btn-primary px-6 py-3 rounded-lg hover:cursor-pointer transition glow-effect">
                  Launch Playground
                </a>
                <button className="border border-[var(--color-primary-600)] text-[var(--color-primary-600)] px-6 py-3 rounded-lg hover:bg-[var(--color-primary-50)] transition hover:cursor-pointer">
                  Take a Tour
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-[var(--color-gray-800)] p-1 rounded-xl shadow-2xl">
                <div className="h-64 bg-gradient-to-br from-[var(--color-primary-800)] to-[var(--color-accent-500)] rounded-lg flex items-center justify-center">
                  <div className="text-center p-4 text-white">
                    <div className="text-5xl mb-4">📊</div>
                    <p className="font-medium">Your Data + Our Tools = Insights</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 bg-white full-width">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Start New Project",
                desc: "Create a new machine learning model from scratch",
                icon: "➕",
                action: "Create",
                link: "/playground"
              },
              {
                title: "Learn ML Concepts",
                desc: "Enhance your machine learning skills with our curated learning resources.",
                icon: "📋",
                action: "Explore Documentation ",
                link: "/learn"
              },
              {
                title: "Explore Your Models",
                desc: "View and manage your previously trained models",
                icon: "🧠",
                action: "View Models",
                link: "/models"
              }
            ].map((card, index) => (
              <div key={index} className="bg-[var(--color-gray-50)] p-6 rounded-xl border border-[var(--color-gray-200)] hover:shadow-md transition">
                <div className="text-3xl mb-4">{card.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-[var(--color-gray-900)]">{card.title}</h3>
                <p className="text-[var(--color-gray-600)] mb-4">{card.desc}</p>
                <a href={card.link} className="inline-block text-[var(--color-primary-600)] font-medium hover:text-[var(--color-primary-700)] transition">
                  {card.action} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="gradient-header text-white py-16 full-width">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Ready to Build Your First Model?</h2>
            <p className="text-xl text-[var(--color-primary-200)] mb-8">
              Join thousands of professionals using ML Playground to turn data into insights.
            </p>
            <a href='/playground' className="btn-secondary px-8 py-4 rounded-lg hover:cursor-pointer font-bold hover:shadow-lg transition">
              Start Creating Now
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Homepage;