import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { FiActivity, FiDatabase, FiTrendingUp, FiClock } from 'react-icons/fi';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [performanceData, setPerformanceData] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;
  const accessToken = localStorage.getItem('access');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${API_URL}/file/dashboard-stats/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        setDashboardData(response.data);
        console.log(response.data);
        console.log(dashboardData);
          if (response.data?.performance_distribution) {
            
      const formattedData = response.data.performance_distribution.map(item => ({
        name: item.performance_range,
        value: item.count,
      }));
      setPerformanceData(formattedData); // You need to define this state
    }

        setError(null);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

    // Process data for display
 const metrics = useMemo(() => {
  if (!dashboardData) return [];

  const recent = dashboardData.recent_activity || [];
  const totalCount = dashboardData.total_models || 0;

  // Parse safely and fall back only if value is invalid
  const avgAccuracyRaw = dashboardData.avg_accuracy;
  const avgTrainingTime = parseFloat(dashboardData.avg_training_time || 0) || null;

  const avgAccuracy = !isNaN(parseFloat(avgAccuracyRaw))
    ? parseFloat(avgAccuracyRaw)
    : null;

  // const avgTrainingTime = !isNaN(parseFloat(avgTrainingTimeRaw))
  //   ? parseFloat(avgTrainingTimeRaw)
  //   : null;

  const activeModels = dashboardData.active_models ?? 0;

  const recentCount = recent.length;

  // ✅ Recent Avg Accuracy
  const recentAvgAcc = recentCount
    ? recent.reduce((sum, m) => sum + parseFloat(m.accuracy ?? 0), 0) / recentCount
    : null;

  const accTrend =
    avgAccuracy != null && recentAvgAcc != null
      ? ((recentAvgAcc - avgAccuracy) / avgAccuracy) * 100
      : null;
// ✅ Recent Avg Training Time (ignore 0s)
  const validRecentTimes = recent.filter(m => parseFloat(m.training_time || 0) > 0);
  const recentTrainTime = validRecentTimes.length
    ? validRecentTimes.reduce((sum, m) => sum + parseFloat(m.training_time), 0) / validRecentTimes.length
    : null;

  // ✅ Trend only if both values are valid
  const timeTrend =
    avgTrainingTime != null && recentTrainTime != null
      ? recentTrainTime - avgTrainingTime
      : null;
  // ✅ Active Model %
  const activePercent = totalCount ? (activeModels / totalCount) * 100 : 0;

  return [
    {
      title: "Trained Models",
      value: totalCount,
      icon: <FiDatabase className="text-2xl text-purple-500" />,
      description: "Total models trained",
      trend: `${recentCount} new`,
    },
    {
      title: "Avg Accuracy",
      value: avgAccuracy != null ? `${avgAccuracy.toFixed(2)}%` : '–',
      icon: <FiTrendingUp className="text-2xl text-green-500" />,
      description: "Across all models",
      trend:
        accTrend != null
          ? `${accTrend >= 0 ? '+' : ''}${accTrend.toFixed(2)}%`
          : '–',
    },
    {
      title: "Active Models",
      value: activeModels,
      icon: <FiActivity className="text-2xl text-blue-500" />,
      description: "Total models currently active",
      trend: `${activePercent.toFixed(2)}% active`,
    },
    {
      title: "Avg Training Time",
      value: avgTrainingTime != null ? `${avgTrainingTime.toFixed(2)}s` : '–',
      icon: <FiClock className="text-2xl text-orange-500" />,
      description: "Per model",
       trend: timeTrend != null ? `${timeTrend >= 0 ? '+' : ''}${timeTrend.toFixed(2)}s` : '–',
    },
  ];
}, [dashboardData]);



  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center p-6 bg-red-50 rounded-lg">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }


  const modelDistribution = {
    classification: dashboardData.model_types.classification || 0,
    regression: dashboardData.model_types.regression || 0,
    total: dashboardData.total_models
  };

 const recentActivity = dashboardData.recent_activity.map(model => {
  const pad = (n) => n.toString().padStart(2, '0');
  const date = new Date(model.created_at);
  const formattedDate = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;

  return {
    model: model.name,
    type: model.config__problem_type,
    accuracy: model.accuracy,
    status: "success",
    time: formattedDate
  };
});

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];


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
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 lg:col-span-2">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="font-semibold text-lg text-gray-900">
                    Model Performance Distribution
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Breakdown of models by accuracy ranges
                  </p>
                </div>
                <div className="p-6 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={performanceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={85}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={false}
                      >
                        {performanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
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
                    {modelDistribution.classification > modelDistribution.regression ? (
                      <>
                        <span className="text-blue-600">Classification</span> models are{" "}
                        {(modelDistribution.classification / modelDistribution.regression).toFixed(1)}x more common
                      </>
                    ) : (
                      <>
                        <span className="text-green-600">Regression</span> models are{" "}
                        {(modelDistribution.regression / modelDistribution.classification).toFixed(1)}x more common
                      </>
                    )}
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