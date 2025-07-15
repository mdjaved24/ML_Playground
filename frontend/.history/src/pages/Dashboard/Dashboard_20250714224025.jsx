// src/pages/Dashboard.jsx
import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { FiActivity, FiDatabase, FiTrendingUp, FiBarChart2, FiClock, FiLayers } from 'react-icons/fi';

function Dashboard() {
  // Mock data - replace with real API calls later
  const stats = [
    { 
      title: "Saved Models", 
      value: 15, 
      icon: <FiDatabase className="text-2xl text-purple-500" />, 
      trend: "+2 this week",
      trendPositive: true 
    },
    { 
      title: "Avg. Accuracy", 
      value: "87.5%", 
      icon: <FiTrendingUp className="text-2xl text-green-500" />, 
      trend: "+2.1% from last month",
      trendPositive: true 
    },
    { 
      title: "Active Models", 
      value: 8, 
      icon: <FiActivity className="text-2xl text-blue-500" />, 
      trend: "3 in use now",
      trendPositive: null 
    },
    { 
      title: "Datasets", 
      value: 12, 
      icon: <FiLayers className="text-2xl text-orange-500" />, 
      trend: "4 used today",
      trendPositive: null 
    }
  ];

  const savedModels = [
    { 
      id: 29,
      name: "iris",
      algorithm: "RandomForestClassifier",
      accuracy: 91.89,
      created_at: "Jul 12, 2025",
      features: 4,
      target: "species",
      problem_type: "Classification",
      last_used: "2 hours ago"
    },
    { 
      id: 28,
      name: "house_price_regression_dataset",
      algorithm: "DecisionTreeRegressor",
      accuracy: 98.60,
      created_at: "Jul 12, 2025",
      features: 7,
      target: "House_Price",
      problem_type: "Regression",
      last_used: "1 day ago"
    },
    { 
      id: 27,
      name: "Flavor",
      algorithm: "LogisticRegression",
      accuracy: 58.40,
      created_at: "Jul 12, 2025",
      features: 5,
      target: "preferred_taste",
      problem_type: "Classification",
      last_used: "3 days ago"
    }
  ];

  const recentActivity = [
    { action: "Model trained", model: "iris", time: "2 hours ago", user: "You" },
    { action: "Prediction made", model: "house_price", time: "5 hours ago", user: "Team Member" },
    { action: "Model deleted", model: "old_classifier", time: "1 day ago", user: "You" },
    { action: "Dataset uploaded", name: "customer_data.csv", time: "2 days ago", user: "You" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Dashboard Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Model Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              View and manage your trained machine learning models
            </p>
          </div>
          <button className="btn-primary px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition">
            + New Model
          </button>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">{stat.title}</p>
                    <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                  </div>
                  <div className="p-2 bg-gray-100 rounded-full">
                    {stat.icon}
                  </div>
                </div>
                <p className={`text-xs mt-3 ${stat.trendPositive ? 'text-green-500' : stat.trendPositive === false ? 'text-red-500' : 'text-gray-500'}`}>
                  {stat.trend}
                </p>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Saved Models */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 lg:col-span-2">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-semibold text-lg text-gray-900">
                  Your Saved Models
                </h2>
                <button className="text-sm text-purple-600 hover:text-purple-800">
                  View All
                </button>
              </div>
              <div className="divide-y divide-gray-200">
                {savedModels.map((model, index) => (
                  <div key={index} className="p-6 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-medium text-gray-900 text-lg">{model.name}</h3>
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            {model.problem_type}
                          </span>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Algorithm</p>
                            <p className="font-medium">{model.algorithm}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Accuracy</p>
                            <p className={`font-medium ${model.accuracy > 80 ? 'text-green-600' : model.accuracy > 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                              {model.accuracy}%
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Features</p>
                            <p className="font-medium">{model.features}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Target</p>
                            <p className="font-medium">{model.target}</p>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col items-end">
                        <p className="text-xs text-gray-500 mb-2">Created: {model.created_at}</p>
                        <div className="flex space-x-2">
                          <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200">
                            Predict
                          </button>
                          <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">
                            Download
                          </button>
                          <button className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200">
                            Delete
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Model ID: {model.id}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="font-semibold text-lg text-gray-900">
                  Recent Activity
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50 transition">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <FiClock className="text-gray-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.action}: <span className="text-purple-600">{activity.model || activity.name}</span>
                        </p>
                        <div className="flex text-xs text-gray-500 mt-1">
                          <span>{activity.time}</span>
                          <span className="mx-1">•</span>
                          <span>{activity.user}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Model Performance */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-semibold text-lg text-gray-900">
                Model Performance Overview
              </h2>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">
                  Last 7 days
                </button>
                <button className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700">
                  Last 30 days
                </button>
              </div>
            </div>
            
            {/* Performance chart placeholder */}
            <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
              <p className="text-gray-500">Model accuracy and usage metrics chart</p>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded">
                <p className="text-sm text-blue-800">Most Accurate Model</p>
                <p className="font-medium text-lg">house_price_regression_dataset</p>
                <p className="text-blue-600">98.60% accuracy</p>
              </div>
              <div className="p-4 bg-purple-50 rounded">
                <p className="text-sm text-purple-800">Most Used Model</p>
                <p className="font-medium text-lg">iris</p>
                <p className="text-purple-600">24 predictions this week</p>
              </div>
              <div className="p-4 bg-green-50 rounded">
                <p className="text-sm text-green-800">Recently Improved</p>
                <p className="font-medium text-lg">customer_churn</p>
                <p className="text-green-600">+5.2% accuracy</p>
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