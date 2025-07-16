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
                <button className="btn-primary px-6 py-3 rounded-lg transition glow-effect">
                  Launch Playground
                </button>
                <button className="border border-[var(--color-primary-600)] text-[var(--color-primary-600)] px-6 py-3 rounded-lg hover:bg-[var(--color-primary-50)] transition">
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

      {/* Recent Activity */}
      {/* <section className="py-16 bg-[var(--color-gray-50)] full-width">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-[var(--color-gray-900)] mb-8">Your Recent Activity</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-[var(--color-gray-200)]">
              <table className="min-w-full divide-y divide-[var(--color-gray-200)]">
                <thead className="bg-[var(--color-gray-50)]">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-gray-500)] uppercase tracking-wider">
                      Project
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-gray-500)] uppercase tracking-wider">
                      Last Modified
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-gray-500)] uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[var(--color-gray-200)]">
                  {[
                    {
                      name: "Customer Churn Prediction",
                      date: "2 hours ago",
                      status: "Ready",
                      statusColor: "text-[var(--color-accent-500)]"
                    },
                    {
                      name: "Sales Forecast",
                      date: "Yesterday",
                      status: "Training",
                      statusColor: "text-[var(--color-secondary-500)]"
                    },
                    {
                      name: "Image Classification",
                      date: "3 days ago",
                      status: "Needs Configuration",
                      statusColor: "text-[var(--color-primary-500)]"
                    }
                  ].map((project, index) => (
                    <tr key={index} className="hover:bg-[var(--color-gray-50)] transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-[var(--color-primary-100)] rounded-full flex items-center justify-center text-[var(--color-primary-600)]">
                            📈
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-[var(--color-gray-900)]">{project.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[var(--color-gray-500)]">{project.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${project.statusColor}`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href="#" className="text-[var(--color-primary-600)] hover:text-[var(--color-primary-800)] mr-4">
                          Open
                        </a>
                        <a href="#" className="text-[var(--color-gray-600)] hover:text-[var(--color-gray-800)]">
                          More
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section> */}

      {/* Learning Resources */}
      {/* <section className="py-16 bg-white full-width">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-[var(--color-gray-900)] mb-8">Learn Machine Learning</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Getting Started Guide",
                  desc: "Learn how to create your first ML model in 5 minutes",
                  icon: "🚀",
                  link: "/learn/getting-started"
                },
                {
                  title: "Video Tutorials",
                  desc: "Watch step-by-step tutorials for common use cases",
                  icon: "🎥",
                  link: "/learn/tutorials"
                },
                {
                  title: "ML Concepts Explained",
                  desc: "Understand the fundamentals of machine learning",
                  icon: "📚",
                  link: "/learn/concepts"
                }
              ].map((resource, index) => (
                <div key={index} className="group border border-[var(--color-gray-200)] rounded-xl overflow-hidden hover:shadow-md transition">
                  <div className="p-6">
                    <div className="text-3xl mb-4">{resource.icon}</div>
                    <h3 className="text-lg font-semibold text-[var(--color-gray-900)] mb-2">{resource.title}</h3>
                    <p className="text-[var(--color-gray-600)] mb-4">{resource.desc}</p>
                    <a href={resource.link} className="inline-flex items-center text-[var(--color-primary-600)] font-medium group-hover:text-[var(--color-primary-700)] transition">
                      Learn more
                      <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section> */}

      {/* Final CTA */}
      <section className="gradient-header text-white py-16 full-width">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Ready to Build Your First Model?</h2>
            <p className="text-xl text-[var(--color-primary-200)] mb-8">
              Join thousands of professionals using ML Playground to turn data into insights.
            </p>
            <button className="btn-secondary px-8 py-4 rounded-lg font-bold hover:shadow-lg transition">
              Start Creating Now
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Homepage;