import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { 
  MdKeyboardArrowDown as ChevronDownIcon,
  MdOutlineInsertDriveFile as DocumentTextIcon,
  MdClose as XMarkIcon,
  MdBarChart as ChartBarIcon,
  MdScatterPlot as ScatterPlotIcon,
  MdTableChart as TableIcon,
  MdPieChart as PieChartIcon,
  MdShowChart as LineChartIcon,
  MdGridOn as HeatmapIcon
} from 'react-icons/md';
import Select from "react-select";
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import Heatmap from 'react-heatmap-grid';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { toast } from 'sonner';

Chart.register(...registerables);

// Visualization options
const visualizationOptions = [
  { value: 'preview', label: 'Preview', icon: <TableIcon className="w-4 h-4 mr-2" /> },
  { value: 'stats', label: 'Statistics', icon: <TableIcon className="w-4 h-4 mr-2" /> },
  { value: 'histogram', label: 'Histogram', icon: <ChartBarIcon className="w-4 h-4 mr-2" /> },
  { value: 'bar', label: 'Bar Chart', icon: <ChartBarIcon className="w-4 h-4 mr-2" /> },
  { value: 'scatter', label: 'Scatter Plot', icon: <ScatterPlotIcon className="w-4 h-4 mr-2" /> },
  { value: 'pie', label: 'Pie Chart', icon: <PieChartIcon className="w-4 h-4 mr-2" /> },
  { value: 'line', label: 'Line Chart', icon: <LineChartIcon className="w-4 h-4 mr-2" /> },
  { value: 'heatmap', label: 'Heatmap', icon: <HeatmapIcon className="w-4 h-4 mr-2" /> }
];

// Row count options for preview
const rowCountOptions = [
  { value: 5, label: '5 rows' },
  { value: 10, label: '10 rows' },
  { value: 25, label: '25 rows' },
  { value: 50, label: '50 rows' },
  { value: 100, label: '100 rows' }
];

// Model options
const modelOptions = {
  classification: {
    'RandomForestClassifier': {
      displayName: 'Random Forest Classifier',
      parameters: {
        n_estimators: { type: 'number', value: 100, min: 1, max: 1000 },
        max_depth: { type: 'number', value: '', min: 1, max: 20, placeholder: 'None' },
        min_samples_split: { type: 'number', value: 2, min: 2, max: 20 },
        min_samples_leaf: { type: 'number', value: 1, min: 1, max: 20 },
        criterion: { type: 'select', value: 'gini', options: ['gini', 'entropy'] }
      },
    },
    'KNeighborsClassifier': {
      displayName: 'K-Nearest Neighbors Classifier',
      parameters: {
        n_neighbors: { type: 'number', value: 5, min: 1, max: 50 },
        weights: { type: 'select', value: 'uniform', options: ['uniform', 'distance'] },
        algorithm: { type: 'select', value: 'auto', options: ['auto', 'ball_tree', 'kd_tree', 'brute'] }
      },
    },
    'DecisionTreeClassifier': {
      displayName: 'Decision Tree Classifier',
      parameters: {
        max_depth: { type: 'number', value: '', min: 1, max: 20, placeholder: 'None' },
        min_samples_split: { type: 'number', value: 2, min: 2, max: 20 },
        min_samples_leaf: { type: 'number', value: 1, min: 1, max: 20 },
        criterion: { type: 'select', value: 'gini', options: ['gini', 'entropy'] }
      },
    },
    'LogisticRegression': {
      displayName: 'Logistic Regression',
      parameters: {
        C: { type: 'number', value: 1.0, min: 0.01, max: 10, step: 0.01 },
        penalty: { type: 'select', value: 'l2', options: ['l2', 'l1', 'elasticnet', 'none'] },
        solver: { type: 'select', value: 'lbfgs', options: ['lbfgs', 'liblinear', 'newton-cg', 'sag', 'saga'] },
        max_iter: { type: 'number', value: 100, min: 50, max: 1000 }
      },
    },
    'SVC': {
      displayName: 'Support Vector Classifier',
      parameters: {
        C: { type: 'number', value: 1.0, min: 0.01, max: 10, step: 0.01 },
        kernel: { type: 'select', value: 'rbf', options: ['linear', 'poly', 'rbf', 'sigmoid'] },
        gamma: { type: 'select', value: 'scale', options: ['scale', 'auto'] }
      },
    }
  },
  regression: {
    'RandomForestRegressor': {
      displayName: 'Random Forest Regressor',
      parameters: {
        n_estimators: { type: 'number', value: 100, min: 1, max: 1000 },
        max_depth: { type: 'number', value: '', min: 1, max: 20, placeholder: 'None' },
        min_samples_split: { type: 'number', value: 2, min: 2, max: 20 },
        min_samples_leaf: { type: 'number', value: 1, min: 1, max: 20 }
      },
    },
    'KNeighborsRegressor': {
      displayName: 'K-Nearest Neighbors Regressor',
      parameters: {
        n_neighbors: { type: 'number', value: 5, min: 1, max: 50 },
        weights: { type: 'select', value: 'uniform', options: ['uniform', 'distance'] },
        algorithm: { type: 'select', value: 'auto', options: ['auto', 'ball_tree', 'kd_tree', 'brute'] }
      },
    },
    'DecisionTreeRegressor': {
      displayName: 'Decision Tree Regressor',
      parameters: {
        max_depth: { type: 'number', value: '', min: 1, max: 20, placeholder: 'None' },
        min_samples_split: { type: 'number', value: 2, min: 2, max: 20 },
        min_samples_leaf: { type: 'number', value: 1, min: 1, max: 20 }
      },
    },
    'LinearRegression': {
      displayName: 'Linear Regression',
      parameters: {},
    },
    'Ridge': {
      displayName: 'Ridge Regression',
      parameters: {
        alpha: { type: 'number', value: 1.0, min: 0.01, max: 10, step: 0.01 }
      },
    },
    'SVR': {
      displayName: 'Support Vector Regressor',
      parameters: {
        C: { type: 'number', value: 1.0, min: 0.01, max: 10, step: 0.01 },
        kernel: { type: 'select', value: 'rbf', options: ['linear', 'poly', 'rbf', 'sigmoid'] },
        epsilon: { type: 'number', value: 0.1, min: 0.01, max: 1, step: 0.01 }
      },
    }
  }
};

// Custom Confusion Matrix Component
const ConfusionMatrix = ({ matrix, labels }) => {
  if (!matrix || !labels) return null;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2 bg-gray-100"></th>
            {labels.map((label, i) => (
              <th key={i} className="border border-gray-300 p-2 bg-gray-100 text-sm font-medium text-gray-700">
                Predicted {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={i}>
              <td className="border border-gray-300 p-2 bg-gray-100 text-sm font-medium text-gray-700">
                Actual {labels[i]}
              </td>
              {row.map((cell, j) => (
                <td 
                  key={j} 
                  className={`border border-gray-300 p-2 text-center text-sm ${
                    i === j ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Playground = () => {
  // State for uploaded file and parsed data
  const [dataset, setDataset] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileDisplayName, setFileDisplayName] = useState('');
  const [accuracyScore, setAccuracyScore] = useState({})
  const [columns, setColumns] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [previewRowCount, setPreviewRowCount] = useState(5);
  const [columnTypes, setColumnTypes] = useState({});
  const [targetType, setTargetType] = useState(null);
  const [datasetStats, setDatasetStats] = useState({});
  const [showVisualization, setShowVisualization] = useState('preview');
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [selectedColumn2, setSelectedColumn2] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [correlationMatrix, setCorrelationMatrix] = useState(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isLoadingCorrelation, setIsLoadingCorrelation] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const accessToken = localStorage.getItem('access');

  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    features: [],
    target_column: null,
    encoder: 'LabelEncoder',
    scaler: 'StandardScaler',
    test_size: 0.25,
    random_state: 42,
    stratify: false,
    model_type: null,
    parameters: {},
  });
  
  // Results
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [featureImportance, setFeatureImportance] = useState({});
  const [confusionMatrix, setConfusionMatrix] = useState(null);

  // Fetch preview data from backend
  const fetchPreviewData = async (rowCount) => {
    if (!dataset) return;
    
    setIsLoadingPreview(true);
    try {
      const formData = new FormData();
      formData.append('dataset', dataset);
      formData.append('row_count', rowCount);
      
      const response = await axios.post(`${API_URL}/file/dataset-preview/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('File data:',response.data);
      console.log('stats: ',response.data.stats);

      if (response.data.error) {
        throw new Error(response.data.error);
      }
      
      // Destructure and set state in one operation
      const { 
      data = [], 
      columns = [], 
      column_types = {}, 
      stats = {},
      corr = {}
    } = response.data;

    // Set all state at once to prevent stale closures
    setPreviewData(data);
    setColumns(columns);
    setColumnTypes(column_types);
    setDatasetStats(stats); // This will now contain your stats
    setCorrelationMatrix(corr);
    // Verify stats immediately
    console.log('Stats after set:', stats);
    } catch (err) {
      console.error('Error fetching preview data:', err);
      setError(`Failed to load preview: ${err.message}`);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  // // Fetch correlation matrix from backend
  // const fetchCorrelationMatrix = async () => {
  //   if (!dataset) return;
    
  //   setIsLoadingCorrelation(true);
  //   try {
  //     const formData = new FormData();
  //     formData.append('dataset', dataset);
      
  //     const response = await axios.post(`${API_URL}/file/dataset-correlation/`, formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       }
  //     });
      
  //     setCorrelationMatrix(response.data);
  //   } catch (err) {
  //     console.error('Error fetching correlation matrix:', err);
  //     setError(`Failed to load correlation matrix: ${err.message}`);
  //   } finally {
  //     setIsLoadingCorrelation(false);
  //   }
  // };

  // Handle row count change for preview
  const handleRowCountChange = (option) => {
    setPreviewRowCount(option.value);
    fetchPreviewData(option.value);
  };

  // Generate chart data based on selected visualization
  const generateChartData = (type, column, column2 = null) => {
    if (!column || !previewData.length) return null;
    
    // Check column types for the selected columns
    const col1Type = columnTypes[column];
    const col2Type = column2 ? columnTypes[column2] : null;

    // For pie chart, only allow categorical or mixed columns
    if (type === 'pie' && col1Type !== 'categorical' && col1Type !== 'numeric-categorical') {
      return null;
    }

    // For histogram, only allow numeric columns
    if (type === 'histogram' && col1Type !== 'numeric') {
      return null;
    }

    // For heatmap, return the correlation matrix data
    if (type === 'heatmap' && correlationMatrix) {
      const numericColumns = columns.filter(col => columnTypes[col] === 'numeric');
      if (numericColumns.length === 0) return null;
      
      return {
        xLabels: numericColumns,
        yLabels: numericColumns,
        data: numericColumns.map(col1 => 
          numericColumns.map(col2 => correlationMatrix[col1]?.[col2] || 0)
        )
      };
    }

    // For other chart types, handle data preparation
    const numericValues = previewData
      .map(row => parseFloat(row[column]))
      .filter(val => !isNaN(val));
    
    if (!numericValues.length) return null;

    // For pie chart, use actual values as labels
    if (type === 'pie') {
      const pieLabels = previewData.map(row => row[column]).slice(0, numericValues.length);
      const valueCounts = {};
      
      pieLabels.forEach(label => {
        valueCounts[label] = (valueCounts[label] || 0) + 1;
      });
      
      return {
        labels: Object.keys(valueCounts),
        datasets: [{
          data: Object.values(valueCounts),
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
          ],
          borderWidth: 1
        }]
      };
    }

    // For bar/scatter with two columns
    let numericValues2 = [];
    if (column2) {
      numericValues2 = previewData
        .map(row => parseFloat(row[column2]))
        .filter(val => !isNaN(val));
    }

    switch (type) {
      case 'histogram':
        return {
          labels: Array.from({ length: 10 }, (_, i) => `Bin ${i + 1}`),
          datasets: [{
            label: column,
            data: numericValues,
            backgroundColor: 'rgba(79, 70, 229, 0.7)',
            borderColor: 'rgba(79, 70, 229, 1)',
            borderWidth: 1
          }]
        };

      case 'bar':
        if (column2) {
          return {
            labels: previewData.map((_, i) => `Row ${i + 1}`).slice(0, Math.min(numericValues.length, numericValues2.length)),
            datasets: [
              {
                label: column,
                data: numericValues.slice(0, numericValues2.length),
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
              },
              {
                label: column2,
                data: numericValues2.slice(0, numericValues.length),
                backgroundColor: 'rgba(255, 99, 132, 0.7)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
              }
            ]
          };
        } else {
          return {
            labels: previewData.map((_, i) => `Row ${i + 1}`).slice(0, numericValues.length),
            datasets: [{
              label: column,
              data: numericValues,
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            }]
          };
        }

      case 'scatter':
        if (column2) {
          return {
            datasets: [{
              label: `${column} vs ${column2}`,
              data: numericValues.map((value, index) => ({
                x: value,
                y: numericValues2[index] || 0
              })),
              backgroundColor: 'rgba(255, 99, 132, 0.7)',
              pointRadius: 6
            }]
          };
        } else {
          return {
            datasets: [{
              label: column,
              data: numericValues.map((value, index) => ({
                x: index,
                y: value
              })),
              backgroundColor: 'rgba(255, 99, 132, 0.7)',
              pointRadius: 6
            }]
          };
        }

      case 'line':
        if (column2) {
          return {
            labels: previewData.map((_, i) => `Row ${i + 1}`).slice(0, Math.min(numericValues.length, numericValues2.length)),
            datasets: [
              {
                label: column,
                data: numericValues.slice(0, numericValues2.length),
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                tension: 0.1,
                fill: true
              },
              {
                label: column2,
                data: numericValues2.slice(0, numericValues.length),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                tension: 0.1,
                fill: true
              }
            ]
          };
        } else {
          return {
            labels: previewData.map((_, i) => `Row ${i + 1}`).slice(0, numericValues.length),
            datasets: [{
              label: column,
              data: numericValues,
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.1)',
              tension: 0.1,
              fill: true
            }]
          };
        }

      default:
        return null;
    }
  };

  // Handle column selection with type validation
  const handleColumnSelect = (column) => {
    const colType = columnTypes[column];
    
    // Validate based on visualization type
    switch (showVisualization) {
      case 'histogram':
        if (colType !== 'numeric') return;
        break;
      case 'pie':
        if (colType !== 'categorical' && colType !== 'numeric-categorical') return;
        break;
      case 'bar':
      case 'scatter':
      case 'line':
        // Allow any type for these visualizations
        break;
      default:
        break;
    }
    
    setSelectedColumn(column);
    setChartData(generateChartData(showVisualization, column, selectedColumn2));
  };

  // Handle second column selection for comparison charts
  const handleColumn2Select = (column) => {
    setSelectedColumn2(column);
    setChartData(generateChartData(showVisualization, selectedColumn, column));
  };

  // 2. Update your useEffect hooks like this:
    useEffect(() => {
      if (!dataset) {
        setDatasetStats({}); // Clear stats when dataset changes
        return;
      }

      // This will fetch data whenever dataset or previewRowCount changes
      fetchPreviewData(previewRowCount);
    }, [dataset, previewRowCount]);

  // Handle dataset upload
  const handleDatasetUpload = async (e) => {
    const uploadedDataset = e.target.files[0];
    if (!uploadedDataset) return;
    
    setDataset(uploadedDataset);
    setFileName(uploadedDataset.name);
    setFileDisplayName(uploadedDataset.name.replace(/\.[^/.]+$/, ""));
    setTargetType(null);
    setDatasetStats({});
    setAccuracyScore({});
    setFormData(prev => ({
      ...prev,
      target_column: '',
      features: []
    }));
    
    // Fetch initial preview data
    fetchPreviewData(previewRowCount);
  };

// Remove Dataset
const removeDataset = () => {
  setDataset(null);
  setFileName('');
  setFileDisplayName('');
  setColumns([]);
  setPreviewData([]);
  setColumnTypes({});
  setTargetType(null);
  // Reset all training-related states
  setDatasetStats(null);
  setResults(null);
  setAccuracyScore({});
  setFeatureImportance(null);
  setConfusionMatrix(null);
  setFormData(prev => ({
    ...prev,
    target_column: '',
    features: [],
    model_type: null,
    parameters: {}
  }));
};


const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  setFormData(prev => ({
    ...prev,
    [name]:
      type === 'checkbox'
        ? checked
        : name === 'test_size'
          ? parseFloat(value)
          : value
  }));
};


  // Handle feature selection
  const handleFeatureSelect = (selectedOptions) => {
    setFormData(prev => ({
      ...prev,
      features: selectedOptions.map(opt => opt.value)
    }));
  };

  // Handle target column selection
  const handleTargetSelect = (e) => {
    const target = e.target.value;
    setFormData(prev => ({
      ...prev,
      target_column: target
    }));
    
    // Determine target type based on column type
    if (columnTypes[target] === 'numeric') {
      setTargetType('regression');
    } else if (columnTypes[target] === 'categorical') {
      setTargetType('classification');
    } else if (columnTypes[target] === 'numeric-categorical') {
      setTargetType('both');
    }
    
    // Reset model type when target changes
    setFormData(prev => ({
      ...prev,
      model_type: '',
      parameters: {},
    }));
  };

  // Handle model parameter changes
  const handleParameterChange = (paramName, value) => {
    setFormData(prev => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [paramName]: value === '' ? null : value
      }
    }));
  };


  // When model type changes, reset parameters
  useEffect(() => {
    if (formData.model_type && targetType) {
      let paramsConfig = {};
      
      if (targetType === 'classification' && modelOptions.classification[formData.model_type]) {
        paramsConfig = modelOptions.classification[formData.model_type].parameters;
      } else if (targetType === 'regression' && modelOptions.regression[formData.model_type]) {
        paramsConfig = modelOptions.regression[formData.model_type].parameters;
      } else if (targetType === 'both') {
        // For columns that could be either, use the selected model type
        if (modelOptions.classification[formData.model_type]) {
          paramsConfig = modelOptions.classification[formData.model_type].parameters;
        } else if (modelOptions.regression[formData.model_type]) {
          paramsConfig = modelOptions.regression[formData.model_type].parameters;
        }
      }
      
      const initialParams = {};
      Object.entries(paramsConfig).forEach(([key, config]) => {
        initialParams[key] = config.value;
      });

      
      setFormData(prev => ({
        ...prev,
        parameters: initialParams,
      }));
    }
  }, [formData.model_type, targetType]);

  // Get appropriate models based on target type
  const getModelOptions = () => {
    if (!targetType) return [];
    
    if (targetType === 'classification') {
      return Object.entries(modelOptions.classification).map(([key, config]) => ({
        value: key,
        label: config.displayName
      }));
    } else if (targetType === 'regression') {
      return Object.entries(modelOptions.regression).map(([key, config]) => ({
        value: key,
        label: config.displayName
      }));
    } else if (targetType === 'both') {
      // Combine both classification and regression models
      const classificationModels = Object.entries(modelOptions.classification).map(([key, config]) => ({
        value: key,
        label: `${config.displayName} (Classification)`
      }));
      
      const regressionModels = Object.entries(modelOptions.regression).map(([key, config]) => ({
        value: key,
        label: `${config.displayName} (Regression)`
      }));
      
      return [...classificationModels, ...regressionModels];
    }
    
    return [];
  };

  // Get current model parameters config
  const getCurrentModelParameters = () => {
    if (!formData.model_type || !targetType) return {};
    
    if (targetType === 'classification') {
      return modelOptions.classification[formData.model_type]?.parameters || {};
    } else if (targetType === 'regression') {
      return modelOptions.regression[formData.model_type]?.parameters || {};
    } else if (targetType === 'both') {
      // Check both classification and regression models
      return modelOptions.classification[formData.model_type]?.parameters || 
             modelOptions.regression[formData.model_type]?.parameters || {};
    }
    
    return {};
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  // Reset all relevant states
  setError(null);
  setResults(null);
  setAccuracyScore({});
  setFeatureImportance(null);
  setConfusionMatrix(null);

  try {
    const formDataToSend = new FormData();
    formDataToSend.append('dataset', dataset);
    formDataToSend.append('name', fileDisplayName);
    
    const config = {
      ...formData,
      problem_type: targetType === 'both' ? 
        (formData.model_type in modelOptions.classification ? 'classification' : 'regression') : 
        targetType
    };
    formDataToSend.append('config', JSON.stringify(config));
    console.log('Training request data:',formDataToSend);
    
    const response = await axios.post(`${API_URL}/file/train/`, formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${accessToken}`,
      }
    });

    console.log('Training results:', response.data);

    // Set complete results first
    setResults(response.data);

    // Determine model type
    const isRegression = response.data.config?.problem_type === 'regression' || 
                        formData.model_type in modelOptions.regression;

    // Handle accuracy metrics with proper null checks
    const accuracyData = response.data.accuracy || {};
    setAccuracyScore({
      accuracy: isRegression ? 
        (accuracyData.r2_score || 0) : 
        (accuracyData.accuracy_score || 0),
      isRegression,
      mse: accuracyData.mean_squared_error,
      mae: accuracyData.mean_absolute_error,
      rmse: accuracyData.root_mean_squared_error,
      precision: accuracyData.precision,
      recall: accuracyData.recall,
      f1: accuracyData.f1_score
    });

    // Only set feature importance if values exist and aren't all zeros
    if (accuracyData.feature_importance?.values?.some(v => v !== 0)) {
      setFeatureImportance({
        labels: accuracyData.feature_importance.labels || response.data.config?.features || [],
        values: accuracyData.feature_importance.values
      });
    }

    // Handle confusion matrix if exists
    if (!isRegression && response.data.confusion_matrix) {
      setConfusionMatrix({
        matrix: response.data.confusion_matrix.matrix,
        labels: response.data.confusion_matrix.labels
      });
    }

  } catch (err) {
    console.error('Training error:', err);
    setError(err.response?.data?.error || 
            err.response?.data?.details || 
            err.response?.data?.message || 
            err.message || 
            'Error training model');
  } finally {
    setIsLoading(false);
  }
};

  // Save trained model
const handleSaveModel = async () => {
  try {
    // Prepare the config object with all required fields
    const saveConfig = {
      ...formData,
      accuracy: results.accuracy, // Make sure to include accuracy
      problem_type: targetType === 'both' ? 
        (formData.model_type in modelOptions.classification ? 'classification' : 'regression') : 
        targetType
    };

    const payload = {
      name: results.name,
      model_cache_key: results.model_cache_key,
      encoder_cache_key: results.encoder_cache_key,
      scaler_cache_key: results.scaler_cache_key,
      target_encoder_cache_key: results.target_encoder_cache_key,
      dataset: results.dataset,
      config: JSON.stringify(saveConfig) // Stringify the config object
    };

    const response = await axios.post(`${API_URL}/file/save/`, payload, {
      headers: {
        'Content-Type': 'application/json', // Correct content type
        'Authorization': `Bearer ${accessToken}`,
      }
    });

    // alert('Model saved successfully!');
    navigate('/models');
    toast.success('Model saved successfully');
    return response.data;

  } catch (err) {
    console.error('Save error:', err.response?.data);
    setError(err.response?.data?.error || err.message || 'Error saving model');
    toast.error(err.response?.data?.error || 'Error saving model');
    throw err;
  }
};

  // Column options for feature selection
  const featureOptions = columns.map(col => ({
    value: col,
    label: col,
    isDisabled: col === formData.target_column
  }));

  // Filter columns based on visualization type
  const getFilteredColumns = () => {
    switch (showVisualization) {
      case 'histogram':
        return columns.filter(col => columnTypes[col] === 'numeric');
      case 'pie':
        return columns.filter(col => columnTypes[col] === 'categorical' || columnTypes[col] === 'numeric-categorical');
      default:
        return columns;
    }
  };

  // Render the appropriate chart
  const renderVisualization = () => {
    if (!showVisualization) return null;

    if (showVisualization === 'heatmap') {
      if (!correlationMatrix || !chartData) {
        return <div className="text-center py-8 text-gray-500">Loading heatmap data or no numeric columns available</div>;
      }
    } else if (showVisualization !== 'preview' && showVisualization !== 'stats' && !chartData) {
      return <div className="text-center py-8 text-gray-500">Select a valid column for this visualization</div>;
    }

    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: showVisualization === 'heatmap' ? 'Correlation Heatmap' : 
                selectedColumn2 ? `${selectedColumn} vs ${selectedColumn2}` : 
                `${selectedColumn} ${showVisualization.charAt(0).toUpperCase() + showVisualization.slice(1)}`,
          font: { size: 16 }
        },
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== undefined) {
                label += context.parsed.y.toFixed(4);
              } else if (context.parsed !== undefined) {
                label += context.parsed.toFixed(4);
              }
              return label;
            }
          }
        }
      }
    };

    switch (showVisualization) {
      case 'histogram':
        return (
          <div className="h-96">
            <Bar
              data={chartData}
              options={{
                ...commonOptions,
                scales: { y: { beginAtZero: true } }
              }}
            />
          </div>
        );

      case 'bar':
        return (
          <div className="h-96">
            <Bar
              data={chartData}
              options={{
                ...commonOptions,
                scales: { y: { beginAtZero: true } }
              }}
            />
          </div>
        );

      case 'scatter':
        return (
          <div className="h-96">
            <Scatter
              data={chartData}
              options={{
                ...commonOptions,
                scales: {
                  x: { 
                    title: { display: true, text: selectedColumn2 ? selectedColumn : 'Index' },
                    beginAtZero: false 
                  },
                  y: { 
                    title: { display: true, text: selectedColumn2 ? selectedColumn2 : selectedColumn },
                    beginAtZero: false 
                  }
                }
              }}
            />
          </div>
        );

      case 'pie':
        return (
          <div className="h-96">
            <Pie
              data={chartData}
              options={commonOptions}
            />
          </div>
        );

      case 'line':
        return (
          <div className="h-96">
            <Line
              data={chartData}
              options={{
                ...commonOptions,
                scales: {
                  y: { beginAtZero: false }
                }
              }}
            />
          </div>
        );

        case 'heatmap':
          if (!chartData || !chartData.xLabels || !chartData.yLabels || !chartData.data) {
            return (
              <div className="h-96 flex items-center justify-center">
                {isLoadingPreview ? (
                  <div className="text-gray-500">Loading correlation data...</div>
                ) : (
                  <div className="text-gray-500">No correlation data available</div>
                )}
              </div>
            );
          }

          return (
            <div className="h-96 overflow-auto">
              <div className="min-w-full" style={{ width: `${Math.max(chartData.xLabels.length * 50, 300)}px` }}>
                <Heatmap
                  xLabels={chartData.xLabels}
                  yLabels={chartData.yLabels}
                  data={chartData.data}
                  xLabelWidth={100}
                  yLabelWidth={100}
                  squares
                  height={30}
                  onClick={(x, y) => {
                    if (chartData.data[y] && chartData.data[y][x] !== undefined) {
                      alert(`Correlation between ${chartData.xLabels[x]} and ${chartData.yLabels[y]}: ${chartData.data[y][x].toFixed(2)}`);
                    }
                  }}
                  cellStyle={(background, value, min, max, data, x, y) => ({
                    background: `rgb(79, 70, 229, ${1 - (max - value) / (max - min)})`,
                    fontSize: "11px",
                    color: "#444"
                  })}
                  cellRender={(value) => value?.toFixed(2) ?? ''}
                />
              </div>
            </div>
          );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-gray-50)]">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-[var(--color-gray-900)] mb-2">Advanced ML Playground</h1>
          <p className="text-[var(--color-gray-600)] mb-6">Upload your dataset and configure the machine learning pipeline with advanced options</p>
          
          {/* File Upload Section */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-[var(--color-gray-200)]">
            <h2 className="text-xl font-semibold text-[var(--color-gray-900)] mb-4 flex items-center">
              <span className="bg-[var(--color-primary-100)] text-[var(--color-primary-800)] rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">1</span>
              Upload Dataset
            </h2>
            
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                  Dataset Name
                </label>
                <input
                  type="text"
                  value={fileDisplayName}
                  onChange={(e) => setFileDisplayName(e.target.value)}
                  className="block w-full pl-3 pr-3 py-2 border border-[var(--color-gray-300)] focus:outline-none focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] sm:text-sm rounded-md"
                  placeholder="Enter a name for your dataset"
                />
              </div>
              
              <div className="flex items-center justify-center w-full">
                <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer 
                  ${dataset ? 'border-[var(--color-primary-300)] bg-[var(--color-primary-50)]' : 'border-[var(--color-gray-300)] hover:border-[var(--color-primary-300)]'}`}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <DocumentTextIcon className={`w-8 h-8 mb-3 ${dataset ? 'text-[var(--color-primary-600)]' : 'text-[var(--color-gray-400)]'}`} />
                    <p className={`mb-2 text-sm ${dataset ? 'text-[var(--color-primary-600)]' : 'text-[var(--color-gray-500)]'}`}>
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-[var(--color-gray-500)]">CSV or Excel files</p>
                  </div>
                  <input 
                    type="file" 
                    accept=".csv,.xlsx,.xls" 
                    onChange={handleDatasetUpload} 
                    className="hidden" 
                  />
                </label>
              </div>
              
              {dataset && (
                <div className="flex items-center justify-between p-3 bg-[var(--color-primary-50)] rounded-lg">
                  <div className="flex items-center">
                    <DocumentTextIcon className="w-5 h-5 text-[var(--color-primary-600)] mr-2" />
                    <span className="text-sm font-medium text-[var(--color-gray-700)] truncate max-w-xs">{fileName}</span>
                  </div>
                  <button 
                    onClick={removeDataset}
                    className="text-[var(--color-gray-400)] hover:text-[var(--color-gray-600)]"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              )}
              
              {dataset && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-700">Data Visualization</h3>
                    <div className="flex space-x-2">
                      {visualizationOptions.map(option => (
                        <button
                          key={option.value}
                          onClick={() => setShowVisualization(option.value)}
                          className={`flex items-center px-3 py-1 text-xs rounded-md ${
                            showVisualization === option.value 
                              ? 'bg-primary-100 text-primary-800' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {option.icon}
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {showVisualization !== 'preview' && showVisualization !== 'stats' && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        {showVisualization === 'heatmap' ? 'Heatmap will show all numeric columns' : 
                         `Select ${['bar', 'scatter', 'line'].includes(showVisualization) ? '1 or 2' : '1'} column(s) for ${showVisualization}:`}
                      </h4>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
                        {getFilteredColumns().map(col => (
                          <button
                            key={col}
                            onClick={() => handleColumnSelect(col)}
                            className={`px-3 py-1 text-xs rounded-md ${
                              selectedColumn === col
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {col}
                          </button>
                        ))}
                      </div>
                      
                      {['bar', 'scatter', 'line'].includes(showVisualization) && selectedColumn && (
                        <div className="mt-2">
                          <h5 className="text-xs font-medium text-gray-600 mb-1">Select second column (optional):</h5>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {getFilteredColumns().filter(col => col !== selectedColumn).map(col => (
                              <button
                                key={col}
                                onClick={() => handleColumn2Select(col)}
                                className={`px-3 py-1 text-xs rounded-md ${
                                  selectedColumn2 === col
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {col}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        {renderVisualization()}
                      </div>
                    </div>
                  )}

                  {showVisualization === 'preview' && (
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium text-gray-700">Data Preview</h3>
                        <Select
                          options={rowCountOptions}
                          value={rowCountOptions.find(opt => opt.value === previewRowCount)}
                          onChange={handleRowCountChange}
                          className="w-32"
                          classNamePrefix="select"
                          isSearchable={false}
                        />
                      </div>
                      
                      <div className="overflow-x-auto border border-[var(--color-gray-200)] rounded-lg max-h-96">
                        <table className="min-w-full divide-y divide-[var(--color-gray-200)]">
                          <thead className="bg-[var(--color-gray-50)] sticky top-0">
                            <tr>
                              {columns.map((col) => (
                                <th key={col} className="px-4 py-3 text-left text-xs font-medium text-[var(--color-gray-700)] uppercase tracking-wider">
                                  {col}
                                  <span className="block text-xs font-normal text-[var(--color-gray-500)] mt-1">
                                    {columnTypes[col] === 'numeric' ? 'Numeric' : 
                                     columnTypes[col] === 'categorical' ? 'Categorical' : 
                                     columnTypes[col] === 'numeric-categorical' ? 'Numeric-Categorical' : ''}
                                  </span>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-[var(--color-gray-200)]">
                            {isLoadingPreview ? (
                              <tr>
                                <td colSpan={columns.length} className="px-4 py-4 text-center text-sm text-gray-500">
                                  Loading preview data...
                                </td>
                              </tr>
                            ) : previewData.length > 0 ? (
                              previewData.map((row, i) => (
                                <tr key={i}>
                                  {columns.map((col) => (
                                    <td key={`${i}-${col}`} className="px-4 py-2 whitespace-nowrap text-sm text-[var(--color-gray-500)] max-w-xs truncate">
                                      {row[col]}
                                    </td>
                                  ))}
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={columns.length} className="px-4 py-4 text-center text-sm text-gray-500">
                                  No data available
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  {showVisualization === 'stats' && (
                    <div className="mb-4 bg-[var(--color-gray-50)] p-4 rounded-lg border border-[var(--color-gray-200)] overflow-x-auto">
                      <h4 className="text-sm font-medium text-[var(--color-gray-700)] mb-2">Dataset Statistics</h4>
                      {isLoadingStats ? (
                        <div className="text-center py-4 text-sm text-gray-500">Loading statistics...</div>
                      ) : datasetStats && Object.keys(datasetStats).length > 0 ? (
                        <>
                          <div className="grid grid-cols-2 gap-4 mb-2">
                            <div className="bg-white p-2 rounded border border-[var(--color-gray-200)]">
                              <p className="text-xs text-[var(--color-gray-500)]">Rows</p>
                              <p className="font-medium">
                                {/* Get count from first available property */}
                                {Object.values(datasetStats)[0]?.[0] ?? 'N/A'}
                              </p>
                            </div>
                            <div className="bg-white p-2 rounded border border-[var(--color-gray-200)]">
                              <p className="text-xs text-[var(--color-gray-500)]">Columns</p>
                              <p className="font-medium">{Object.keys(datasetStats).length}</p>
                            </div>
                          </div>

                          <table className="min-w-full divide-y divide-[var(--color-gray-200)]">
                            <thead className="bg-[var(--color-gray-100)]">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-[var(--color-gray-700)] uppercase tracking-wider">Statistic</th>
                                {Object.keys(datasetStats).map(col => (
                                  <th key={col} className="px-4 py-2 text-left text-xs font-medium text-[var(--color-gray-700)] uppercase tracking-wider">
                                    {col}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-[var(--color-gray-200)]">
                              {[
                                { name: "Count", index: 0 },
                                { name: "Mean", index: 1 },
                                { name: "Std Dev", index: 2 },
                                { name: "Min", index: 3 },
                                { name: "25%", index: 4 },
                                { name: "Median", index: 5 },
                                { name: "75%", index: 6 },
                                { name: "Max", index: 7 }
                              ].map(({ name, index }) => (
                                <tr key={name}>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-[var(--color-gray-700)]">{name}</td>
                                  {Object.entries(datasetStats).map(([col, values]) => (
                                    <td key={`${name}-${col}`} className="px-4 py-2 whitespace-nowrap text-sm text-[var(--color-gray-500)]">
                                      {values?.[index] !== undefined ? (
                                        typeof values[index] === 'number' ? (
                                          Number.isInteger(values[index]) ? 
                                            values[index].toLocaleString() :
                                            values[index].toFixed(4)
                                        ) : values[index]
                                      ) : '-'}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </>
                      ) : (
                        <div className="text-center py-4 text-sm text-gray-500">
                          {datasetStats ? "No statistics available" : "Upload data to see statistics"}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Model Configuration Form */}
          {columns.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-[var(--color-gray-200)]">
              <h2 className="text-xl font-semibold text-[var(--color-gray-900)] mb-4 flex items-center">
                <span className="bg-[var(--color-primary-100)] text-[var(--color-primary-800)] rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">2</span>
                Configure Model
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Features and Target Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                      Features (Select multiple)
                    </label>
                    <Select
                      isMulti
                      options={featureOptions}
                      value={featureOptions.filter(opt => formData.features.includes(opt.value))}
                      onChange={handleFeatureSelect}
                      className="basic-multi-select"
                      classNamePrefix="select"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                      Target Column
                    </label>
                    <select
                      name="target_column"
                      value={formData.target_column}
                      onChange={handleTargetSelect}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-[var(--color-gray-300)] focus:outline-none focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] sm:text-sm rounded-md"
                      required
                    >
                      <option value="">Select target column</option>
                      {columns.map((col) => (
                        <option key={col} value={col}>
                          {col} ({columnTypes[col] === 'numeric' ? 'Numeric' : 
                                 columnTypes[col] === 'categorical' ? 'Categorical' : 
                                 columnTypes[col] === 'numeric-categorical' ? 'Numeric-Categorical' : ''})
                        </option>
                      ))}
                    </select>
                    {targetType && (
                      <p className="mt-1 text-xs text-[var(--color-gray-500)]">
                        Problem type: {targetType === 'both' ? 'Classification or Regression' : targetType}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Divider */}
                <div className="border-t border-[var(--color-gray-200)] my-4"></div>
                
                {/* Preprocessing Options */}
                <h3 className="text-sm font-medium text-[var(--color-gray-700)] mb-2">Data Preprocessing</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                      Encoder
                    </label>
                    <select
                      name="encoder"
                      value={formData.encoder}
                      onChange={handleChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-[var(--color-gray-300)] focus:outline-none focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] sm:text-sm rounded-md"
                    >
                      <option value="LabelEncoder">Label Encoder</option>
                      <option value="OneHotEncoder">One Hot Encoder</option>
                      <option value="OrdinalEncoder">Ordinal Encoder</option>
                      <option value="None">None</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                      Scaler
                    </label>
                    <select
                      name="scaler"
                      value={formData.scaler}
                      onChange={handleChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-[var(--color-gray-300)] focus:outline-none focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] sm:text-sm rounded-md"
                    >
                      <option value="StandardScaler">Standard Scaler</option>
                      <option value="MinMaxScaler">MinMax Scaler</option>
                      <option value="RobustScaler">Robust Scaler</option>
                      <option value="None">None</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                      Test Size
                    </label>
                    <div className="flex items-center">
                      <input
                        type="range"
                        name="test_size"
                        min="0.1"
                        max="0.5"
                        step="0.05"
                        value={formData.test_size}
                        onChange={handleChange}
                        className="w-full h-2 bg-[var(--color-gray-200)] rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="ml-3 text-sm text-[var(--color-gray-700)] w-10">
                        {formData.test_size}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Random State and Stratify */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                      Random State
                    </label>
                    <input
                      type="number"
                      name="random_state"
                      value={formData.random_state}
                      onChange={handleChange}
                      className="block w-full pl-3 pr-3 py-2 border border-[var(--color-gray-300)] focus:outline-none focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] sm:text-sm rounded-md"
                    />
                  </div>
                  
                  {(targetType === 'classification' || targetType === 'both') && (
                    <div className="flex items-end">
                      <div className="flex items-center h-10">
                        <input
                          id="stratify"
                          name="stratify"
                          type="checkbox"
                          checked={formData.stratify}
                          onChange={handleChange}
                          className="h-4 w-4 text-[var(--color-primary-600)] focus:ring-[var(--color-primary-500)] border-[var(--color-gray-300)] rounded"
                        />
                        <label htmlFor="stratify" className="ml-2 block text-sm text-[var(--color-gray-700)]">
                          Stratify Split (for classification)
                        </label>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Divider */}
                <div className="border-t border-[var(--color-gray-200)] my-4"></div>
                
                {/* Model Selection */}
                {formData.target_column && (
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                      Model Type
                    </label>
                    <select
                      name="model_type"
                      value={formData.model_type}
                      onChange={handleChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-[var(--color-gray-300)] focus:outline-none focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] sm:text-sm rounded-md"
                      required
                    >
                      <option value="">Select a model</option>
                      {getModelOptions().map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                {/* Model Parameters */}
                {formData.model_type && (
                  <div className="bg-[var(--color-gray-50)] p-4 rounded-lg border border-[var(--color-gray-200)]">
                    <h3 className="text-sm font-medium text-[var(--color-gray-700)] mb-3">Model Parameters</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(getCurrentModelParameters()).map(([param, config]) => (
                        <div key={param}>
                          <label className="block text-xs font-medium text-[var(--color-gray-600)] mb-1 capitalize">
                            {param.replace(/_/g, ' ')}
                          </label>
                          {config.type === 'number' ? (
                            <input
                              type="number"
                              value={formData.parameters[param] ?? config.value}
                              onChange={(e) => handleParameterChange(param, e.target.value)}
                              min={config.min}
                              max={config.max}
                              step={config.step || 1}
                              placeholder={config.placeholder}
                              className="block w-full pl-3 pr-3 py-2 text-sm border border-[var(--color-gray-300)] focus:outline-none focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] rounded-md"
                            />
                          ) : config.type === 'select' ? (
                            <select
                              value={formData.parameters[param] ?? config.value}
                              onChange={(e) => handleParameterChange(param, e.target.value)}
                              className="block w-full pl-3 pr-10 py-2 text-sm border border-[var(--color-gray-300)] focus:outline-none focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] rounded-md"
                            >
                              {config.options.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading || !formData.target_column || formData.features.length === 0 || !formData.model_type}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-accent-500)] hover:from-[var(--color-primary-700)] hover:cursor-pointer hover:to-[var(--color-accent-600)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-500)] transition ${
                      isLoading || !formData.target_column || formData.features.length === 0 || !formData.model_type ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Training Model...
                      </>
                    ) : 'Train Model'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Results Section */}
          {results && (
            <div className="bg-white rounded-xl shadow-md p-6 border border-[var(--color-gray-200)]">
              <h2 className="text-xl font-semibold text-[var(--color-gray-900)] mb-4 flex items-center">
                <span className="bg-[var(--color-primary-100)] text-[var(--color-primary-800)] rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">3</span>
                Results
              </h2>
              
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="w-full m-2">
                <div className="bg-gradient-to-r from-[var(--color-primary-50)] to-[var(--color-primary-100)] p-4 rounded-lg border border-[var(--color-primary-200)]">
                  <h3 className="text-sm font-medium text-[var(--color-primary-800)] mb-2">
                    {accuracyScore.isRegression ? 'R² Score' : 'Accuracy Score'}
                  </h3>
                  <p className="text-3xl font-bold text-[var(--color-primary-600)]">
                    {accuracyScore.isRegression ? 
                      accuracyScore.accuracy.toFixed(4) : 
                      (accuracyScore.accuracy * 100).toFixed(2) + '%'}
                  </p>
                </div>
              </div>
              
                {/* Feature Importance - Only show if available */}
                {featureImportance ? (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-[var(--color-gray-700)] mb-2">Feature Importance</h3>
                    <div className="bg-[var(--color-gray-50)] p-4 rounded-lg border border-[var(--color-gray-200)]">
                      <Bar
                        data={{
                          labels: featureImportance.labels,
                          datasets: [{
                            label: 'Feature Importance',
                            data: featureImportance.values,
                            backgroundColor: 'rgba(79, 70, 229, 0.7)',
                            borderColor: 'rgba(79, 70, 229, 1)',
                            borderWidth: 1
                          }]
                        }}
                        options={{
                          indexAxis: 'y',
                          responsive: true,
                          plugins: {
                            legend: { display: false },
                            tooltip: {
                              callbacks: {
                                label: (context) => context.parsed.x.toFixed(4)
                              }
                            }
                          },
                          scales: { x: { beginAtZero: true } }
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          Feature importance not available for this model type.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              
              {confusionMatrix && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-[var(--color-gray-700)] mb-2">Confusion Matrix</h3>
                  <div className="bg-[var(--color-gray-50)] p-4 rounded-lg border border-[var(--color-gray-200)]">
                    <ConfusionMatrix 
                      matrix={confusionMatrix.matrix} 
                      labels={confusionMatrix.labels} 
                    />
                  </div>
                </div>
              )}
              
              {(targetType !== 'regression' && !(targetType === 'both' && formData.model_type in modelOptions.regression)) && 
                results.classification_report && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-[var(--color-gray-700)] mb-2">Classification Report</h3>
                  <div className="bg-[var(--color-gray-50)] p-4 rounded-lg border border-[var(--color-gray-200)] overflow-x-auto">
                    <pre className="text-sm font-mono text-[var(--color-gray-700)]">
                      {results.classification_report}
                    </pre>
                  </div>
                </div>
              )}
              
              {(targetType === 'regression' || (targetType === 'both' && formData.model_type in modelOptions.regression)) && 
                results.regression_metrics && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-[var(--color-gray-700)] mb-2">Regression Metrics</h3>
                  <div className="bg-[var(--color-gray-50)] p-4 rounded-lg border border-[var(--color-gray-200)] overflow-x-auto">
                    <pre className="text-sm font-mono text-[var(--color-gray-700)]">
                      {`Mean Absolute Error: ${results.regression_metrics.mae.toFixed(4)}
                      Mean Squared Error: ${results.regression_metrics.mse.toFixed(4)}
                      Root Mean Squared Error: ${results.regression_metrics.rmse.toFixed(4)}`}
                    </pre>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end">
                <button
                  onClick={handleSaveModel}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-[var(--color-accent-500)] to-[var(--color-accent-600)] hover:from-[var(--color-accent-600)] hover:to-[var(--color-accent-700)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent-500)] transition"
                >
                  Save Model
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Playground;