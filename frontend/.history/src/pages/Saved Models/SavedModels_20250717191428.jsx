import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { 
  MdRefresh as RetrainIcon,
  MdPlayArrow as PlayIcon,
  MdDownload as DownloadIcon,
  MdDelete as DeleteIcon,
  MdArrowBack as BackIcon
} from 'react-icons/md';
import { FiSearch, FiFilter } from 'react-icons/fi';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const SavedModels = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [predictionInputs, setPredictionInputs] = useState({});
  const [predictionResult, setPredictionResult] = useState(null);
  const [inputTypes, setInputTypes] = useState({});
  const [categoricalOptions, setCategoricalOptions] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProblemType, setFilterProblemType] = useState('all');

  const API_URL = import.meta.env.VITE_API_URL;
  const accessToken = localStorage.getItem('access');

  // Fetch saved models
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await axios.get(`${API_URL}/file/save/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          }
        });
        console.log(response.data);
        setModels(Array.isArray(response.data) ? response.data : []);
        setError(null);
      } catch (error) {
        console.error('Error fetching models:', error);
        setError('Failed to load models. Please try again later.');
        setModels([]);
      } finally {
        setLoading(false);
      }
    };
    fetchModels();
  }, []);

  // Filter and search models
  const filteredModels = models.filter(model => {
    // Search term matching
    const matchesSearch = 
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.algorithm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.problem_type?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Problem type filtering
    const matchesProblemType = 
      filterProblemType === 'all' || 
      (model.problem_type && model.problem_type.toLowerCase() === filterProblemType);
    
    return matchesSearch && matchesProblemType;
  });


  // Download model as joblib file
  const downloadModel = async (modelId) => {
  try {
    const model = models.find(model => model.id === modelId);
    if (!model) throw new Error('Model not found');
    
    let name = model.name;
    name = name.split(' ').join('-');
    console.log(name);

    const response = await axios.get(`${API_URL}/file/download-model/${modelId}/`, {
      responseType: 'blob',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    // Extract filename from Content-Disposition header
    // const contentDisposition = response.headers['content-disposition'];
    let filename = `${name}.zip`; // default fallback
    
    // if (contentDisposition) {
    //   // Try modern RFC 6266 format first
    //   const utf8FilenameMatch = contentDisposition.match(/filename\*=UTF-8''(.+?)(;|$)/i);
    //   if (utf8FilenameMatch && utf8FilenameMatch[1]) {
    //     filename = decodeURIComponent(utf8FilenameMatch[1]);
    //   } 
    //   // Fallback to legacy format
    //   else {
    //     const filenameMatch = contentDisposition.match(/filename="(.+?)"/i);
    //     if (filenameMatch && filenameMatch[1]) {
    //       filename = filenameMatch[1];
    //     }
    //   }
    // }

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
    
  } catch (error) {
    console.error('Error downloading model:', error);
    toast.error(error.response?.data?.error || 'Failed to download model. Please try again.');
  }
};


  // Delete Model
const deleteModel = async (modelId) => {
  if (typeof modelId !== 'number') {
    toast.error('Invalid model ID');
    return;
  }
  if (window.confirm('Are you sure you want to permanently delete this model?')) {
    try {
      const response = await axios.delete(`${API_URL}/file/saved-model/${modelId}/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (response.status === 204) {
        setModels(models.filter(model => model.id !== modelId));
        toast.success('Model deleted successfully');
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (error) {
      console.error('Error deleting model:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Failed to delete model. Please try again.';
      toast.error(errorMessage);
    }
  }
};


// Update getModelFeatures to initialize input types and categorical options
const getModelFeatures = async (modelId) => {
  try {
    const model = models.find(model => model.id === modelId);
    if (!model) throw new Error('Model not found');

    // Initialize inputs, types, and categorical options
    const inputs = {};
    const types = {};
    const categoricalOptions = {};
    console.log('Selected model:',model);
    console.log('Model config:',model.config);

    model.features.forEach(feature => {
      const featureName = typeof feature === 'string' ? feature : feature.name;
      inputs[featureName] = '';
      types[featureName] = model.feature_types?.[featureName] || 'float';
      
      // Store categorical options if they exist
      if (model.categorical_values?.[featureName]) {
        categoricalOptions[featureName] = model.categorical_values[featureName];
      }
    });

    setSelectedModel({
      ...model,
      features: Array.isArray(model.features) ? model.features : []
    });

    console.log(inputs);
    console.log(types);
    setPredictionInputs(inputs);
    setInputTypes(types);
    setCategoricalOptions(categoricalOptions); // Add this state
    setPredictionResult(null);

  } catch (error) {
    console.error('Error fetching model features:', error);
    toast.error('Failed to load model details');
  }
};

  // Handle prediction input change
  const handleInputChange = (featureName, value) => {
    setPredictionInputs(prev => ({
      ...prev,
      [featureName]: value
    }));
  };

const makePrediction = async () => {
  try {
    // 1. Prepare the input data in the exact order of model features
    const orderedInputs = {};
    const orderedColumns = [];
    const orderedValues = [];

    selectedModel.features.forEach(feature => {
      const featureName = typeof feature === 'string' ? feature : feature.name;
      orderedInputs[featureName] = predictionInputs[featureName];
      orderedColumns.push(featureName);
      orderedValues.push(predictionInputs[featureName]);
    });

    console.log('Request values:', orderedValues);
    console.log('Request columns:', orderedColumns);
    console.log('Request object:', orderedInputs);

    // 2. Send both formats to ensure backend compatibility
    const response = await axios.post(
      `${API_URL}/file/predict/${selectedModel.id}/`,
      { 
        inputs: orderedInputs,  // Send as dictionary (recommended)
        values: orderedValues,   // Alternative array format
        columns: orderedColumns  // Column names for array format
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      }
    );
    
    // 3. Handle response
    setPredictionResult(response.data.prediction);
    console.log('Prediction successful:', response.data);

  } catch (error) {
    // 4. Enhanced error handling
    let errorMessage = 'Failed to make prediction';
    
    if (error.response) {
      errorMessage = error.response.data?.error || 
                    error.response.data?.message || 
                    JSON.stringify(error.response.data);
    } else if (error.request) {
      errorMessage = "No response received from server";
    } else {
      errorMessage = error.message;
    }

    console.error('Prediction error details:', {
      error: error.message,
      response: error.response?.data,
      config: error.config
    });

    toast.error(`Prediction failed: ${errorMessage}`);
  }
};
  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen p-8 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your saved models...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen p-8 max-w-4xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 text-sm text-red-700 hover:text-red-600 font-medium"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Model detail view
  if (selectedModel) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <button 
              onClick={() => setSelectedModel(null)}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
              <BackIcon className="mr-1" /> Back to all models
            </button>
            
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">{selectedModel.name}</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {selectedModel.algorithm} • Created on {new Date(selectedModel.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {selectedModel.accuracy && (
                    <div className="bg-blue-50 px-3 py-1 rounded-full">
                      <span className="text-blue-800 font-medium">
                        Accuracy: {(selectedModel.accuracy)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="px-6 py-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Make Prediction</h3>
                
                <div className="space-y-5">
                  {selectedModel.features?.map(feature => {
                    const featureName = typeof feature === 'string' ? feature : feature.name;
                    const featureType = inputTypes[featureName];
                    const isCategorical = featureType === 'categorical' || featureType === 'object';
                    const isFloat = featureType === 'float';
                    const options = categoricalOptions[featureName] || [];

                    return (
                      <div key={featureName} className="grid grid-cols-1 gap-1 sm:grid-cols-3 mb-4">
                        <label className="block text-sm font-medium text-gray-700 sm:col-span-1">
                          {featureName}
                          <span className="text-gray-400 ml-1">({featureType})</span>
                        </label>
                        
                        <div className="sm:col-span-2">
                          {isCategorical && options.length > 0 ? (
                            <select
                              value={predictionInputs[featureName] || ''}
                              onChange={(e) => handleInputChange(featureName, e.target.value)}
                              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              required
                            >
                              <option value="">Select an option</option>
                              {options.map(option => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={isFloat ? "number" : "text"}
                              step={isFloat ? "0.01" : undefined}
                              value={predictionInputs[featureName] || ''}
                              onChange={(e) => handleInputChange(featureName, e.target.value)}
                              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder={`Enter ${featureName}`}
                              required
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                  
                  <div className="pt-2">
                    <button
                      onClick={makePrediction}
                      // disabled={Object.values(predictionInputs).some(val => val === '')}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
                    >
                      Predict
                    </button>
                  </div>
                  
                  {predictionResult !== null && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Prediction Result</h4>
                      <div className="text-xl font-semibold text-blue-600">
                        {predictionResult}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Main view with model cards
  return (
    <>
      <Toaster richColors position="top-right" />
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl font-semibold text-gray-900">Your Saved Models</h1>
              <p className="mt-1 text-sm text-gray-500">
                View and manage your trained machine learning models
              </p>
            </div>
            <Link 
              to="/playground" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create New Model
            </Link>
          </div>

          {/* Add Search and Filter UI */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, algorithm or type..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <FiFilter className="text-gray-400" />
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={filterProblemType}
                onChange={(e) => setFilterProblemType(e.target.value)}
              >
                <option value="all">All Problem Types</option>
                <option value="regression">Regression</option>
                <option value="classification">Classification</option>
              </select>
            </div>
          </div>

          {filteredModels.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No models found</h3>
              <p className="mt-1 text-gray-500">
                {models.length === 0 
                  ? "You haven't saved any machine learning models yet."
                  : "No models match your search criteria."}
              </p>
              {models.length === 0 && (
                <div className="mt-6">
                  <Link
                    to="/playground"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create your first model
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredModels.map(model => {
                const config = typeof model.config === 'string' 
                  ? JSON.parse(model.config) 
                  : model.config || {};
                
                return (
                  <div key={`model-${model.id}`} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-bold text-gray-900">
                              {config.name || model.name || 'Untitled Model'}
                            </h3>
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {model.algorithm}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="space-y-1">
                              <div className="text-gray-500">Accuracy</div>
                              <div className="flex items-center">
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                                  <div 
                                    className="bg-blue-600 h-2.5 rounded-full" 
                                    style={{ width: `${model.accuracy}%` }}
                                  />
                                </div>
                                <span className="font-medium text-gray-900">
                                  {(model.accuracy)}%
                                </span>
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="text-gray-500">Created</div>
                              <div className="font-medium text-gray-900">
                                {new Date(model.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="text-gray-500">Features</div>
                              <div className="font-medium text-gray-900">
                                {model.features?.length || 'N/A'}
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="text-gray-500">Target</div>
                              <div className="font-medium text-gray-900">
                                {model.target_column || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-2">
                          <button
                            onClick={() => getModelFeatures(model.id)}
                            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors gap-2 hover:cursor-pointer"
                          >
                            <PlayIcon className="w-4 h-4" />
                            <span>Predict</span>
                          </button>
                          <button
                            onClick={() => downloadModel(model.id)}
                            className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors gap-2 hover:cursor-pointer"
                          >
                            <DownloadIcon className="w-4 h-4" />
                            <span>Download</span>
                          </button>
                          <button
                            onClick={() => {
                              console.log("Model object:", model);
                              console.log("Model id:", model.id);
                              deleteModel(model.id);
                            }}
                            className="flex items-center justify-center px-4 py-2 bg-red-50 border border-red-100 text-red-600 rounded-lg hover:bg-red-100 transition-colors gap-2 hover:cursor-pointer"
                          >
                            <DeleteIcon className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm">
                        <div className="text-gray-500">
                          Model ID: <span className="font-mono text-gray-700">{model.id}</span>
                          {model.training_time && (
                            <span className="ml-3">
                              • Training Time: <span className="font-medium text-gray-700">{model.training_time}s</span>
                            </span>
                          )}
                        </div>
                        {model.problem_type && (
                          <div className="text-gray-500 mt-1 sm:mt-0">
                            Type: <span className="font-medium text-gray-700 capitalize">{model.problem_type}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SavedModels;