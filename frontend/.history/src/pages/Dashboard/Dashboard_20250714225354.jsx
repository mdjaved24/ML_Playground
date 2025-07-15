// src/pages/Dashboard.jsx
import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { FiActivity, FiDatabase, FiTrendingUp, FiBarChart2, FiClock } from 'react-icons/fi';

function Dashboard() {
  // Core metrics from backend
  const metrics = [
    { 
      title: "Trained Models", 
      value: 24, 
      icon: <FiDatabase className="text-2xl text-purple-500" />,
      description: "Total models trained",
      trend: "+3 this week"
    },
    { 
      title: "Avg Accuracy", 
      value: "87.5%", 
      icon: <FiTrendingUp className="text-2xl text-green-500" />,
      description: "Across all models",
      trend: "+2.1% from last month"
    },
    { 
      title: "Active Models", 
      value: 8, 
      icon: <FiActivity className="text-2xl text-blue-500" />,
      description: "Used in last 7 days",
      trend: "3 used today"
    },
    { 
      title: "Avg Training Time", 
      value: "4.2m", 
      icon: <FiClock className="text-2xl text-orange-500" />,
      description: "Per model",
      trend: "Faster by 1.1m"
    }
  ];

  // Model type distribution
  const modelDistribution = {
    classification: 16,
    regression: 8,
    total: 24
  };

  // Recent training activity
  const recentActivity = [
    { 
      model: "Customer Churn Predictor", 
      type: "Classification", 
      accuracy: 89.2,
      status: "success",
      time: "2 hours ago"
    },
    { 
      model: "House Price Prediction", 
      type: "Regression", 
      accuracy: 92.4,
      status: "success", 
      time: "1 day ago"
    },
    { 
      model: "Sales Forecast", 
      type: "Regression", 
      accuracy: 85.7,
      status: "success", 
      time: "2 days ago"
    }
  ];

  // Accuracy trends (mock data)
  const accuracyTrends = [
    { month: 'Jan', classification: 82, regression: 78 },
    { month: 'Feb', classification: 85, regression: 81 },
    { month: 'Mar', classification: 84, regression: 83 },
    { month: 'Apr', classification: 88, regression: 85 },
    { month: 'May', classification: 90, regression: 87 }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Dashboard Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Model Training Dashboard
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Monitor your machine learning model performance
              </p>
            </div>
            <a 
              href="/playground" 
              className="btn-primary px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Train New Model
            </a>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">{metric.title}</p>
                    <p className="text-2xl font-semibold mt-1">{metric.value}</p>
                  </div>
                  <div className="p-2 bg-gray-100 rounded-full">
                    {metric.icon}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  {metric.description} • <span className="text-purple-600">{metric.trend}</span>
                </p>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Accuracy Trends */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 lg:col-span-2">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="font-semibold text-lg text-gray-900">
                  Accuracy Trends
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Monthly performance by model type
                </p>
              </div>
              <div className="p-6">
                {/* Chart placeholder */}
                <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-500">Accuracy trends chart would display here</p>
                    <div className="mt-4 flex justify-center space-x-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                        <span className="text-xs">Classification</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-xs">Regression</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Model Distribution */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="font-semibold text-lg text-gray-900">
                  Model Types
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Distribution of your trained models
                </p>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-3xl font-bold">{modelDistribution.total}</span>
                    <span className="text-gray-500 ml-1">total models</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* Classification */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">Classification</span>
                      <span>{Math.round((modelDistribution.classification/modelDistribution.total)*100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${(modelDistribution.classification/modelDistribution.total)*100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {modelDistribution.classification} models
                    </div>
                  </div>
                  
                  {/* Regression */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">Regression</span>
                      <span>{Math.round((modelDistribution.regression/modelDistribution.total)*100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-green-600 h-2.5 rounded-full" 
                        style={{ width: `${(modelDistribution.regression/modelDistribution.total)*100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {modelDistribution.regression} models
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 bg-gray-50 p-3 rounded">
                  <p className="text-sm font-medium text-gray-700">
                    <span className="text-blue-600">Classification</span> models are {Math.round(modelDistribution.classification/modelDistribution.regression)}x more common
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-lg text-gray-900">
                Recent Training Activity
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Your most recent model training sessions
              </p>
            </div>
            <div className="divide-y divide-gray-200">
              {recentActivity.map((activity, index) => (
                <div key={index} className="p-4 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full ${
                        activity.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {activity.status === 'success' ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium text-gray-900">{activity.model}</h3>
                        <div className="flex mt-1 space-x-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            activity.type === 'Classification' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {activity.type}
                          </span>
                          <span className="text-xs text-gray-500">
                            {activity.accuracy}% accuracy
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;