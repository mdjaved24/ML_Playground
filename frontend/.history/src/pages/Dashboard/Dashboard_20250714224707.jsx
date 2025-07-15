// src/pages/Dashboard.jsx
import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { FiActivity, FiDatabase, FiTrendingUp, FiBarChart2, FiClock, FiLayers, FiUsers, FiCpu } from 'react-icons/fi';

function Dashboard() {
  // Performance metrics
  const performanceStats = [
    { 
      title: "Avg. Model Accuracy", 
      value: "87.5%", 
      icon: <FiTrendingUp className="text-2xl text-green-500" />, 
      change: "+2.1% from last month",
      isPositive: true,
      description: "Across all your active models"
    },
    { 
      title: "Active Models", 
      value: 8, 
      icon: <FiCpu className="text-2xl text-blue-500" />, 
      change: "3 currently in use",
      isPositive: null,
      description: "Models used in the last 7 days"
    },
    { 
      title: "Weekly Predictions", 
      value: 42, 
      icon: <FiActivity className="text-2xl text-purple-500" />, 
      change: "+12 from last week",
      isPositive: true,
      description: "Total predictions made"
    },
    { 
      title: "Team Usage", 
      value: "5/10", 
      icon: <FiUsers className="text-2xl text-orange-500" />, 
      change: "2 active today",
      isPositive: null,
      description: "Team members using models"
    }
  ];

  // Model types distribution
  const modelTypes = [
    { type: "Classification", count: 9, color: "bg-blue-500" },
    { type: "Regression", count: 4, color: "bg-green-500" },
    { type: "Clustering", count: 2, color: "bg-purple-500" },
    { type: "Other", count: 1, color: "bg-gray-500" }
  ];

  // Recent predictions
  const recentPredictions = [
    { model: "Customer Churn Predictor", user: "You", time: "15 min ago", success: true },
    { model: "Sales Forecast", user: "Sarah K.", time: "1 hour ago", success: true },
    { model: "Image Classifier", user: "You", time: "3 hours ago", success: false },
    { model: "Price Optimizer", user: "Mark T.", time: "5 hours ago", success: true }
  ];

  // Accuracy trends data
  const accuracyTrends = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Highest Accuracy',
        data: [82, 85, 84, 88, 90, 91, 93],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)'
      },
      {
        label: 'Average Accuracy',
        data: [75, 76, 78, 80, 82, 85, 87],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)'
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Dashboard Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Model Performance Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Insights and analytics about your machine learning models
          </p>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {performanceStats.map((stat, index) => (
              <div key={index} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">{stat.title}</p>
                    <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                  </div>
                  <div className="p-2 bg-gray-100 rounded-full">
                    {stat.icon}
                  </div>
                </div>
                <p className={`text-xs mt-2 ${stat.isPositive ? 'text-green-500' : stat.isPositive === false ? 'text-red-500' : 'text-gray-500'}`}>
                  {stat.change}
                </p>
                <p className="text-xs text-gray-400 mt-2">{stat.description}</p>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Accuracy Trends */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 lg:col-span-2">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="font-semibold text-lg text-gray-900">
                  Model Accuracy Trends
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Monthly progression of your models' performance
                </p>
              </div>
              <div className="p-6">
                {/* Chart placeholder - replace with actual chart library */}
                <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-500">Accuracy trends chart would display here</p>
                    <p className="text-xs text-gray-400 mt-2">
                      Showing {accuracyTrends.labels.length} months of data
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span>Highest Accuracy</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span>Average Accuracy</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Model Type Distribution */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="font-semibold text-lg text-gray-900">
                  Model Types
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Distribution of your model categories
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {modelTypes.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-24 flex-shrink-0">
                        <span className="text-sm font-medium text-gray-700">{item.type}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div 
                            className={`h-4 ${item.color} rounded-full`} 
                            style={{ width: `${(item.count / Math.max(...modelTypes.map(m => m.count))) * 100}%` }}
                          ></div>
                          <span className="ml-2 text-xs text-gray-500">{item.count} models</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 bg-gray-50 p-3 rounded">
                  <p className="text-sm font-medium text-gray-700">
                    <span className="text-blue-500">Classification</span> models are your most common type
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Representing {Math.round((9/16)*100)}% of your total models
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Predictions */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 lg:col-span-2">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-semibold text-lg text-gray-900">
                  Recent Predictions
                </h2>
                <button className="text-sm text-purple-600 hover:text-purple-800">
                  View All
                </button>
              </div>
              <div className="divide-y divide-gray-200">
                {recentPredictions.map((prediction, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full ${prediction.success ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {prediction.success ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </div>
                        <div className="ml-4">
                          <p className="font-medium text-gray-900">{prediction.model}</p>
                          <p className="text-sm text-gray-500">{prediction.user}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {prediction.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="font-semibold text-lg text-gray-900">
                  Quick Actions
                </h2>
              </div>
              <div className="p-6">
                <button className="w-full mb-4 flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Train New Model
                </button>
                <button className="w-full mb-4 flex items-center justify-center px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload Dataset
                </button>
                <button className="w-full flex items-center justify-center px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Configure Settings
                </button>
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