// src/pages/Dashboard.jsx
import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
                      
function Dashboard() {
  // Mock data - replace with real API calls later
  const stats = [
    { title: "Models Trained", value: 24, icon: "🧠", trend: "+3 this week" },
    { title: "Saved Models", value: 15, icon: "💾", trend: "2 new today" },
    { title: "This Week Runs", value: 18, icon: "⚡", trend: "5 running now" },
    { title: "Avg. Accuracy", value: "87.5%", icon: "📊", trend: "+2.1%" }
  ];

  const recentProjects = [
    { name: "Churn Prediction", type: "Classification", accuracy: "89%", lastRun: "2 hours ago" },
    { name: "Sales Forecast", type: "Regression", accuracy: "92%", lastRun: "1 day ago" },
    { name: "Image Classifier", type: "CNN", accuracy: "85%", lastRun: "3 days ago" }
  ];

  // Mock chart data
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Models Trained',
        data: [3, 5, 2, 8, 6],
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        borderColor: 'rgba(139, 92, 246, 1)',
        tension: 0.1
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-gray-50)]">
      <Navbar />
      
      {/* Dashboard Header */}
      <header className="bg-white shadow-sm full-width">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[var(--color-gray-900)]">
            Model Dashboard
          </h1>
          <button className="btn-primary px-4 py-2 rounded-md glow-effect">
            + New Model
          </button>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-[var(--color-gray-200)]">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-[var(--color-gray-500)]">{stat.title}</p>
                    <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                  </div>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <p className="text-xs mt-3 text-[var(--color-gray-500)]">
                  {stat.trend}
                </p>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Projects */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-[var(--color-gray-200)] lg:col-span-2">
              <div className="px-6 py-4 border-b border-[var(--color-gray-200)]">
                <h2 className="font-semibold text-lg text-[var(--color-gray-900)]">
                  Recent Projects
                </h2>
              </div>
              <div className="divide-y divide-[var(--color-gray-200)]">
                {recentProjects.map((project, index) => (
                  <a 
                    key={index} 
                    href="#"
                    className="block px-6 py-4 hover:bg-[var(--color-gray-50)] transition"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-[var(--color-gray-900)]">{project.name}</h3>
                        <div className="flex mt-1 space-x-4">
                          <span className="text-sm text-[var(--color-gray-500)]">{project.type}</span>
                          <span className="text-sm text-[var(--color-gray-500)]">{project.accuracy} accuracy</span>
                        </div>
                      </div>
                      <div className="text-sm text-[var(--color-gray-500)]">
                        {project.lastRun}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Simple Chart */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-[var(--color-gray-200)]">
              <div className="px-6 py-4 border-b border-[var(--color-gray-200)]">
                <h2 className="font-semibold text-lg text-[var(--color-gray-900)]">
                  Monthly Activity
                </h2>
              </div>
              <div className="p-6">
                {/* Simple chart using HTML/CSS - no chart library needed */}
                <div className="relative h-48">
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between items-end h-full">
                    {chartData.datasets[0].data.map((value, i) => (
                      <div 
                        key={i}
                        className="flex-1 flex flex-col items-center mx-1"
                        style={{ height: `${(value / Math.max(...chartData.datasets[0].data)) * 100}%` }}
                      >
                        <div 
                          className="w-full bg-[var(--color-primary-200)] rounded-t hover:bg-[var(--color-primary-300)] transition"
                          style={{ height: '100%' }}
                        ></div>
                        <span className="text-xs mt-1 text-[var(--color-gray-500)]">
                          {chartData.labels[i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 text-center text-sm text-[var(--color-gray-600)]">
                  Models trained per month
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;