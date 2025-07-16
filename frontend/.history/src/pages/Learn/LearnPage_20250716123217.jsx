import { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const LearnPage = () => {
  const [expandedSections, setExpandedSections] = useState({
    introduction: true,
    lifecycle: true,
    data_preprocessing: true,
    model_training: true,
    evaluation: true,
    deployment: true,
    resources: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-gray-50)]">
      <Navbar />
      
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white border-r border-[var(--color-gray-200)] p-4 overflow-y-auto sticky top-0 h-[calc(100vh-64px)]">
          <h2 className="text-lg font-bold text-[var(--color-primary-700)] mb-4">ML Documentation</h2>
          
          <div className="space-y-1">
            {/* Introduction Section */}
            <button 
              onClick={() => toggleSection('introduction')}
              className="flex items-center w-full text-left py-2 px-3 rounded hover:bg-[var(--color-primary-50)] text-[var(--color-gray-700)]"
            >
              {expandedSections.introduction ? (
                <ChevronDownIcon className="h-4 w-4 mr-2" />
              ) : (
                <ChevronRightIcon className="h-4 w-4 mr-2" />
              )}
              Introduction to ML
            </button>
            {expandedSections.introduction && (
              <div className="ml-6 space-y-1">
                <a href="#what-is-ml" className="block py-1 px-3 text-sm rounded hover:bg-[var(--color-primary-50)] text-[var(--color-gray-600)]">
                  What is Machine Learning?
                </a>
                <a href="#types-of-ml" className="block py-1 px-3 text-sm rounded hover:bg-[var(--color-primary-50)] text-[var(--color-gray-600)]">
                  Types of ML
                </a>
                <a href="#applications" className="block py-1 px-3 text-sm rounded hover:bg-[var(--color-primary-50)] text-[var(--color-gray-600)]">
                  Applications
                </a>
              </div>
            )}

            {/* ML Lifecycle Section */}
            <button 
              onClick={() => toggleSection('lifecycle')}
              className="flex items-center w-full text-left py-2 px-3 rounded hover:bg-[var(--color-primary-50)] text-[var(--color-gray-700)]"
            >
              {expandedSections.lifecycle ? (
                <ChevronDownIcon className="h-4 w-4 mr-2" />
              ) : (
                <ChevronRightIcon className="h-4 w-4 mr-2" />
              )}
              ML Lifecycle
            </button>
            {expandedSections.lifecycle && (
              <div className="ml-6 space-y-1">
                <a href="#problem-definition" className="block py-1 px-3 text-sm rounded hover:bg-[var(--color-primary-50)] text-[var(--color-gray-600)]">
                  Problem Definition
                </a>
                <a href="#data-collection" className="block py-1 px-3 text-sm rounded hover:bg-[var(--color-primary-50)] text-[var(--color-gray-600)]">
                  Data Collection
                </a>
                <a href="#data-preparation" className="block py-1 px-3 text-sm rounded hover:bg-[var(--color-primary-50)] text-[var(--color-gray-600)]">
                  Data Preparation
                </a>
              </div>
            )}

            {/* Data Preprocessing Section */}
            <button 
              onClick={() => toggleSection('data_preprocessing')}
              className="flex items-center w-full text-left py-2 px-3 rounded hover:bg-[var(--color-primary-50)] text-[var(--color-gray-700)]"
            >
              {expandedSections.data_preprocessing ? (
                <ChevronDownIcon className="h-4 w-4 mr-2" />
              ) : (
                <ChevronRightIcon className="h-4 w-4 mr-2" />
              )}
              Data Preprocessing
            </button>
            {expandedSections.data_preprocessing && (
              <div className="ml-6 space-y-1">
                <a href="#data-cleaning" className="block py-1 px-3 text-sm rounded hover:bg-[var(--color-primary-50)] text-[var(--color-gray-600)]">
                  Data Cleaning
                </a>
                <a href="#feature-engineering" className="block py-1 px-3 text-sm rounded hover:bg-[var(--color-primary-50)] text-[var(--color-gray-600)]">
                  Feature Engineering
                </a>
                <a href="#scaling-normalization" className="block py-1 px-3 text-sm rounded hover:bg-[var(--color-primary-50)] text-[var(--color-gray-600)]">
                  Scaling & Normalization
                </a>
                <a href="#encoding" className="block py-1 px-3 text-sm rounded hover:bg-[var(--color-primary-50)] text-[var(--color-gray-600)]">
                  Encoding Categorical Data
                </a>
              </div>
            )}

            {/* Model Training Section */}
            <button 
              onClick={() => toggleSection('model_training')}
              className="flex items-center w-full text-left py-2 px-3 rounded hover:bg-[var(--color-primary-50)] text-[var(--color-gray-700)]"
            >
              {expandedSections.model_training ? (
                <ChevronDownIcon className="h-4 w-4 mr-2" />
              ) : (
                <ChevronRightIcon className="h-4 w-4 mr-2" />
              )}
              Model Training
            </button>
            {expandedSections.model_training && (
              <div className="ml-6 space-y-1">
                <a href="#train-test-split" className="block py-1 px-3 text-sm rounded hover:bg-[var(--color-primary-50)] text-[var(--color-gray-600)]">
                  Train-Test Split
                </a>
                <a href="#model-selection" className="block py-1 px-3 text-sm rounded hover:bg-[var(--color-primary-50)] text-[var(--color-gray-600)]">
                  Model Selection
                </a>
                <a href="#hyperparameter-tuning" className="block py-1 px-3 text-sm rounded hover:bg-[var(--color-primary-50)] text-[var(--color-gray-600)]">
                  Hyperparameter Tuning
                </a>
                <a href="#cross-validation" className="block py-1 px-3 text-sm rounded hover:bg-[var(--color-primary-50)] text-[var(--color-gray-600)]">
                  Cross-Validation
                </a>
              </div>
            )}

            {/* Evaluation Section */}
            <button 
              onClick={() => toggleSection('evaluation')}
              className="flex items-center w-full text-left py-2 px-3 rounded hover:bg-[var(--color-primary-50)] text-[var(--color-gray-700)]"
            >
              {expandedSections.evaluation ? (
                <ChevronDownIcon className="h-4 w-4 mr-2" />
              ) : (
                <ChevronRightIcon className="h-4 w-4 mr-2" />
              )}
              Evaluation Metrics
            </button>
            {expandedSections.evaluation && (
              <div className="ml-6 space-y-1">
                <a href="#classification-metrics" className="block py-1 px-3 text-sm rounded hover:bg-[var(--color-primary-50)] text-[var(--color-gray-600)]">
                  Classification Metrics
                </a>
                <a href="#regression-metrics" className="block py-1 px-3 text-sm rounded hover:bg-[var(--color-primary-50)] text-[var(--color-gray-600)]">
                  Regression Metrics
                </a>
                <a href="#bias-variance" className="block py-1 px-3 text-sm rounded hover:bg-[var(--color-primary-50)] text-[var(--color-gray-600)]">
                  Bias-Variance Tradeoff
                </a>
              </div>
            )}

            {/* Deployment Section */}
            <button 
              onClick={() => toggleSection('deployment')}
              className="flex items-center w-full text-left py-2 px-3 rounded hover:bg-[var(--color-primary-50)] text-[var(--color-gray-700)]"
            >
              {expandedSections.deployment ? (
                <ChevronDownIcon className="h-4 w-4 mr-2" />
              ) : (
                <ChevronRightIcon className="h-4 w-4 mr-2" />
              )}
              Deployment Strategies
            </button>
            {expandedSections.deployment && (
              <div className="ml-6 space-y-1">
                <a href="#model-persistence" className="block py-1 px-3 text-sm rounded hover:bg-[var(--color-primary-50)] text-[var(--color-gray-600)]">
                  Model Persistence
                </a>
                <a href="#api-deployment" className="block py-1 px-3 text-sm rounded hover:bg-[var(--color-primary-50)] text-[var(--color-gray-600)]">
                  API Deployment
                </a>
                <a href="#monitoring" className="block py-1 px-3 text-sm rounded hover:bg-[var(--color-primary-50)] text-[var(--color-gray-600)]">
                  Model Monitoring
                </a>
              </div>
            )}

            {/* Resources Section */}
            <button 
              onClick={() => toggleSection('resources')}
              className="flex items-center w-full text-left py-2 px-3 rounded hover:bg-[var(--color-primary-50)] text-[var(--color-gray-700)]"
            >
              {expandedSections.resources ? (
                <ChevronDownIcon className="h-4 w-4 mr-2" />
              ) : (
                <ChevronRightIcon className="h-4 w-4 mr-2" />
              )}
              Resources
            </button>
            {expandedSections.resources && (
              <div className="ml-6 space-y-1">
                <a href="#further-reading" className="block py-1 px-3 text-sm rounded hover:bg-[var(--color-primary-50)] text-[var(--color-gray-600)]">
                  Further Reading
                </a>
                <a href="#datasets" className="block py-1 px-3 text-sm rounded hover:bg-[var(--color-primary-50)] text-[var(--color-gray-600)]">
                  Public Datasets
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          {/* Introduction Section */}
          <section id="what-is-ml" className="mb-12">
            <h1 className="text-3xl font-bold text-[var(--color-gray-900)] mb-6">Introduction to Machine Learning</h1>
            
            <h2 className="text-2xl font-semibold text-[var(--color-primary-700)] mb-4">What is Machine Learning?</h2>
            <div className="prose max-w-none">
              <p className="mb-4">
                Machine Learning (ML) is a subset of artificial intelligence (AI) that focuses on building systems that can learn from and make decisions based on data. Rather than explicitly programming rules, ML algorithms build mathematical models based on sample data (known as "training data") to make predictions or decisions without being explicitly programmed to perform the task.
              </p>
              <p className="mb-4">
                At its core, machine learning is about creating algorithms that can receive input data and use statistical analysis to predict an output while updating outputs as new data becomes available. The process of learning begins with observations or data, such as examples, direct experience, or instruction, in order to look for patterns in data and make better decisions in the future based on the examples that we provide.
              </p>
              <div className="bg-[var(--color-primary-50)] p-4 rounded-lg mb-4 border-l-4 border-[var(--color-primary-400)]">
                <p className="font-medium text-[var(--color-primary-800)]">Key Concept:</p>
                <p>The primary aim is to allow computers to learn automatically without human intervention or assistance and adjust actions accordingly.</p>
              </div>
              <div className="my-6 p-4 bg-[var(--color-gray-100)] rounded-lg">
                <h4 className="font-medium mb-2">ML Workflow Diagram:</h4>
                <img src="src\assets\Images\Machine Learning Workflow.webp" alt="Machine Learning Workflow" className="w-full max-w-2xl mx-auto rounded border border-[var(--color-gray-200)]" />
                <p className="text-sm text-center mt-2 text-[var(--color-gray-600)]">Typical machine learning workflow from data collection to deployment</p>
              </div>
            </div>
          </section>

          <section id="types-of-ml" className="mb-12">
            <h2 className="text-2xl font-semibold text-[var(--color-primary-700)] mb-4">Types of Machine Learning</h2>
            <div className="prose max-w-none">
              <p className="mb-4">
                Machine learning algorithms can be categorized into three main types based on their learning style:
              </p>

              <h3 className="text-xl font-medium text-[var(--color-gray-800)] mb-2">1. Supervised Learning</h3>
              <p className="mb-4">
                Supervised learning involves learning a function that maps an input to an output based on example input-output pairs. The algorithm learns from labeled training data, and makes predictions based on that data. Common supervised learning algorithms include:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Linear Regression</li>
                <li>Logistic Regression</li>
                <li>Decision Trees</li>
                <li>Random Forest</li>
                <li>Support Vector Machines (SVM)</li>
                <li>Neural Networks</li>
              </ul>
              <div className="my-4 p-4 bg-[var(--color-gray-100)] rounded-lg">
                <h4 className="font-medium mb-2">Supervised Learning Example:</h4>
                <pre className="bg-[var(--color-gray-800)] text-[var(--color-gray-100)] p-3 rounded overflow-x-auto">
                  <code>
{`# Example: Linear Regression in Python
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split

# Load dataset
X, y = load_dataset()

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Create and train model
model = LinearRegression()
model.fit(X_train, y_train)

# Make predictions
predictions = model.predict(X_test)`}
                  </code>
                </pre>
              </div>

              <h3 className="text-xl font-medium text-[var(--color-gray-800)] mb-2">2. Unsupervised Learning</h3>
              <p className="mb-4">
                Unsupervised learning is used when the training data is neither classified nor labeled. The system tries to learn the patterns and structure from the data without any supervision. Common unsupervised learning algorithms include:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>K-means Clustering</li>
                <li>Hierarchical Clustering</li>
                <li>Principal Component Analysis (PCA)</li>
                <li>Association Rule Learning</li>
              </ul>

              <h3 className="text-xl font-medium text-[var(--color-gray-800)] mb-2">3. Reinforcement Learning</h3>
              <p className="mb-4">
                Reinforcement learning is about taking suitable action to maximize reward in a particular situation. The algorithm learns by interacting with an environment and receiving rewards or penalties for actions. Examples include:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Q-Learning</li>
                <li>Deep Q Network (DQN)</li>
                <li>Policy Gradient Methods</li>
              </ul>
            </div>
          </section>

          <section id="applications" className="mb-12">
            <h2 className="text-2xl font-semibold text-[var(--color-primary-700)] mb-4">Applications of Machine Learning</h2>
            <div className="prose max-w-none">
              <p className="mb-4">
                Machine learning has found applications across numerous industries and domains:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="border border-[var(--color-gray-200)] rounded-lg p-4">
                  <h4 className="font-medium mb-2">Healthcare</h4>
                  <ul className="list-disc pl-5">
                    <li>Disease diagnosis and prediction</li>
                    <li>Drug discovery</li>
                    <li>Medical image analysis</li>
                    <li>Personalized treatment plans</li>
                  </ul>
                </div>
                <div className="border border-[var(--color-gray-200)] rounded-lg p-4">
                  <h4 className="font-medium mb-2">Finance</h4>
                  <ul className="list-disc pl-5">
                    <li>Fraud detection</li>
                    <li>Algorithmic trading</li>
                    <li>Credit scoring</li>
                    <li>Risk assessment</li>
                  </ul>
                </div>
                <div className="border border-[var(--color-gray-200)] rounded-lg p-4">
                  <h4 className="font-medium mb-2">Retail</h4>
                  <ul className="list-disc pl-5">
                    <li>Recommendation systems</li>
                    <li>Demand forecasting</li>
                    <li>Inventory management</li>
                    <li>Customer segmentation</li>
                  </ul>
                </div>
                <div className="border border-[var(--color-gray-200)] rounded-lg p-4">
                  <h4 className="font-medium mb-2">Technology</h4>
                  <ul className="list-disc pl-5">
                    <li>Natural language processing</li>
                    <li>Computer vision</li>
                    <li>Speech recognition</li>
                    <li>Autonomous vehicles</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* ML Lifecycle Section */}
          <section id="problem-definition" className="mb-12">
            <h1 className="text-3xl font-bold text-[var(--color-gray-900)] mb-6">Machine Learning Lifecycle</h1>
            
            <h2 className="text-2xl font-semibold text-[var(--color-primary-700)] mb-4">1. Problem Definition</h2>
            <div className="prose max-w-none">
              <p className="mb-4">
                The first and most crucial step in any machine learning project is to clearly define the problem you're trying to solve. This involves:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Understanding the business problem or research question</li>
                <li>Defining success metrics (how will you measure the model's performance?)</li>
                <li>Determining the type of machine learning problem (classification, regression, clustering, etc.)</li>
                <li>Identifying available data sources</li>
                <li>Assessing feasibility and potential impact</li>
              </ul>
              <p className="mb-4">
                A well-defined problem statement helps guide all subsequent steps in the machine learning process. It's important to spend adequate time on this phase to avoid wasted effort later.
              </p>
            </div>
          </section>

          <section id="data-collection" className="mb-12">
            <h2 className="text-2xl font-semibold text-[var(--color-primary-700)] mb-4">2. Data Collection</h2>
            <div className="prose max-w-none">
              <p className="mb-4">
                Data collection involves gathering the raw data needed for your machine learning project. This can come from various sources:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Internal databases and data warehouses</li>
                <li>APIs from third-party services</li>
                <li>Public datasets (Kaggle, UCI Machine Learning Repository, government data)</li>
                <li>Web scraping (when ethically and legally appropriate)</li>
                <li>Manual data collection (surveys, experiments)</li>
              </ul>
              <p className="mb-4">
                Key considerations during data collection:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Data quality (accuracy, completeness, consistency)</li>
                <li>Data quantity (enough samples for meaningful patterns)</li>
                <li>Data diversity (representative of real-world scenarios)</li>
                <li>Ethical considerations (privacy, bias, fairness)</li>
              </ul>
            </div>
          </section>

          <section id="data-preparation" className="mb-12">
            <h2 className="text-2xl font-semibold text-[var(--color-primary-700)] mb-4">3. Data Preparation</h2>
            <div className="prose max-w-none">
              <p className="mb-4">
                Raw data is rarely in the perfect format for machine learning algorithms. Data preparation involves transforming raw data into a format that can be effectively used for training models. This stage typically consumes the majority of time in a machine learning project.
              </p>
              <p className="mb-4">
                The data preparation pipeline generally includes:
              </p>
              <ol className="list-decimal pl-6 mb-4">
                <li>Data cleaning (handling missing values, outliers)</li>
                <li>Data transformation (normalization, scaling)</li>
                <li>Feature engineering (creating new features)</li>
                <li>Feature selection (choosing the most relevant features)</li>
                <li>Data splitting (train/validation/test sets)</li>
              </ol>
            </div>
          </section>

          {/* Data Preprocessing Section */}
          <section id="data-cleaning" className="mb-12">
            <h1 className="text-3xl font-bold text-[var(--color-gray-900)] mb-6">Data Preprocessing</h1>
            
            <h2 className="text-2xl font-semibold text-[var(--color-primary-700)] mb-4">Data Cleaning</h2>
            <div className="prose max-w-none">
              <p className="mb-4">
                Data cleaning is the process of detecting and correcting (or removing) corrupt or inaccurate records from a dataset. Common data cleaning tasks include:
              </p>
              
              <h3 className="text-xl font-medium text-[var(--color-gray-800)] mb-2">Handling Missing Data</h3>
              <p className="mb-4">
                Missing data is a common issue in real-world datasets. There are several strategies to handle missing values:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Deletion:</strong> Remove rows or columns with missing values (simple but can lose information)</li>
                <li><strong>Mean/Median/Mode Imputation:</strong> Replace missing values with the mean, median, or mode of the feature</li>
                <li><strong>Predictive Imputation:</strong> Use other features to predict missing values</li>
                <li><strong>Indicator Variables:</strong> Add a binary feature indicating whether the value was missing</li>
              </ul>
              
              <div className="my-4 p-4 bg-[var(--color-gray-100)] rounded-lg">
                <h4 className="font-medium mb-2">Example: Handling Missing Values in Python</h4>
                <pre className="bg-[var(--color-gray-800)] text-[var(--color-gray-100)] p-3 rounded overflow-x-auto">
                  <code>
{`import pandas as pd
from sklearn.impute import SimpleImputer

# Load data
data = pd.read_csv('dataset.csv')

# Option 1: Drop missing values
data_dropped = data.dropna()

# Option 2: Impute with mean
imputer = SimpleImputer(strategy='mean')
data_imputed = pd.DataFrame(imputer.fit_transform(data), columns=data.columns)`}
                  </code>
                </pre>
              </div>

              <h3 className="text-xl font-medium text-[var(--color-gray-800)] mb-2">Handling Outliers</h3>
              <p className="mb-4">
                Outliers are data points that are significantly different from other observations. They can be handled by:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Removal:</strong> Delete outlier records</li>
                <li><strong>Capping:</strong> Replace outliers with threshold values</li>
                <li><strong>Transformation:</strong> Apply mathematical transformations (log, square root)</li>
                <li><strong>Separate Treatment:</strong> Model outliers separately</li>
              </ul>
            </div>
          </section>

          <section id="feature-engineering" className="mb-12">
            <h2 className="text-2xl font-semibold text-[var(--color-primary-700)] mb-4">Feature Engineering</h2>
            <div className="prose max-w-none">
              <p className="mb-4">
                Feature engineering is the process of creating new features or modifying existing ones to improve model performance. Good features can dramatically improve model accuracy, while bad features can lead to poor performance.
              </p>
              
              <h3 className="text-xl font-medium text-[var(--color-gray-800)] mb-2">Common Feature Engineering Techniques</h3>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Binning:</strong> Converting continuous features into discrete bins</li>
                <li><strong>Interaction Features:</strong> Creating new features by combining existing ones</li>
                <li><strong>Polynomial Features:</strong> Creating higher-order terms for linear models</li>
                <li><strong>Date/Time Features:</strong> Extracting day of week, month, hour, etc.</li>
                <li><strong>Text Features:</strong> TF-IDF, word counts, sentiment scores</li>
              </ul>
              
              <div className="my-4 p-4 bg-[var(--color-gray-100)] rounded-lg">
                <h4 className="font-medium mb-2">Example: Feature Engineering in Python</h4>
                <pre className="bg-[var(--color-gray-800)] text-[var(--color-gray-100)] p-3 rounded overflow-x-auto">
                  <code>
{`from sklearn.preprocessing import PolynomialFeatures
import pandas as pd

# Create interaction features
poly = PolynomialFeatures(degree=2, interaction_only=True, include_bias=False)
interaction_features = poly.fit_transform(X[['feature1', 'feature2']])

# Create datetime features
df['date'] = pd.to_datetime(df['timestamp'])
df['day_of_week'] = df['date'].dt.dayofweek
df['hour'] = df['date'].dt.hour`}
                  </code>
                </pre>
              </div>
            </div>
          </section>

          <section id="scaling-normalization" className="mb-12">
            <h2 className="text-2xl font-semibold text-[var(--color-primary-700)] mb-4">Scaling & Normalization</h2>
            <div className="prose max-w-none">
              <p className="mb-4">
                Many machine learning algorithms perform better when numerical input variables are scaled to a standard range. This is especially important for:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Distance-based algorithms (KNN, SVM, K-means)</li>
                <li>Neural networks</li>
                <li>Regularized models (Lasso, Ridge)</li>
                <li>Principal Component Analysis</li>
              </ul>
              
              <h3 className="text-xl font-medium text-[var(--color-gray-800)] mb-2">Common Scaling Techniques</h3>
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full border border-[var(--color-gray-200)]">
                  <thead className="bg-[var(--color-gray-100)]">
                    <tr>
                      <th className="border border-[var(--color-gray-200)] px-4 py-2">Method</th>
                      <th className="border border-[var(--color-gray-200)] px-4 py-2">Description</th>
                      <th className="border border-[var(--color-gray-200)] px-4 py-2">When to Use</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-[var(--color-gray-200)] px-4 py-2">Standardization</td>
                      <td className="border border-[var(--color-gray-200)] px-4 py-2">(x - mean) / std</td>
                      <td className="border border-[var(--color-gray-200)] px-4 py-2">Most cases, especially for algorithms that assume centered data</td>
                    </tr>
                    <tr>
                      <td className="border border-[var(--color-gray-200)] px-4 py-2">Min-Max Scaling</td>
                      <td className="border border-[var(--color-gray-200)] px-4 py-2">(x - min) / (max - min)</td>
                      <td className="border border-[var(--color-gray-200)] px-4 py-2">When you know the bounds of your data (e.g., images 0-255)</td>
                    </tr>
                    <tr>
                      <td className="border border-[var(--color-gray-200)] px-4 py-2">Robust Scaling</td>
                      <td className="border border-[var(--color-gray-200)] px-4 py-2">(x - median) / IQR</td>
                      <td className="border border-[var(--color-gray-200)] px-4 py-2">When data contains outliers</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="my-4 p-4 bg-[var(--color-gray-100)] rounded-lg">
                <h4 className="font-medium mb-2">Example: Feature Scaling in Python</h4>
                <pre className="bg-[var(--color-gray-800)] text-[var(--color-gray-100)] p-3 rounded overflow-x-auto">
                  <code>
{`from sklearn.preprocessing import StandardScaler, MinMaxScaler

# Standardization
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Min-Max Scaling
minmax = MinMaxScaler()
X_minmax = minmax.fit_transform(X)`}
                  </code>
                </pre>
              </div>
            </div>
          </section>

          <section id="encoding" className="mb-12">
            <h2 className="text-2xl font-semibold text-[var(--color-primary-700)] mb-4">Encoding Categorical Data</h2>
            <div className="prose max-w-none">
              <p className="mb-4">
                Most machine learning algorithms require numerical input, so categorical data (text labels) must be converted to numerical form. There are several encoding techniques:
              </p>
              
              <h3 className="text-xl font-medium text-[var(--color-gray-800)] mb-2">Common Encoding Methods</h3>
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full border border-[var(--color-gray-200)]">
                  <thead className="bg-[var(--color-gray-100)]">
                    <tr>
                      <th className="border border-[var(--color-gray-200)] px-4 py-2">Method</th>
                      <th className="border border-[var(--color-gray-200)] px-4 py-2">Description</th>
                      <th className="border border-[var(--color-gray-200)] px-4 py-2">When to Use</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-[var(--color-gray-200)] px-4 py-2">Label Encoding</td>
                      <td className="border border-[var(--color-gray-200)] px-4 py-2">Assign each category a unique integer</td>
                      <td className="border border-[var(--color-gray-200)] px-4 py-2">Ordinal categories with inherent order</td>
                    </tr>
                    <tr>
                      <td className="border border-[var(--color-gray-200)] px-4 py-2">One-Hot Encoding</td>
                      <td className="border border-[var(--color-gray-200)] px-4 py-2">Create binary columns for each category</td>
                      <td className="border border-[var(--color-gray-200)] px-4 py-2">Nominal categories without order</td>
                    </tr>
                    <tr>
                      <td className="border border-[var(--color-gray-200)] px-4 py-2">Target Encoding</td>
                      <td className="border border-[var(--color-gray-200)] px-4 py-2">Replace categories with mean target value</td>
                      <td className="border border-[var(--color-gray-200)] px-4 py-2">High cardinality features</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="my-4 p-4 bg-[var(--color-gray-100)] rounded-lg">
                <h4 className="font-medium mb-2">Example: Encoding in Python</h4>
                <pre className="bg-[var(--color-gray-800)] text-[var(--color-gray-100)] p-3 rounded overflow-x-auto">
                  <code>
{`import pandas as pd
from sklearn.preprocessing import OneHotEncoder, LabelEncoder

# One-Hot Encoding
ohe = OneHotEncoder()
encoded = ohe.fit_transform(df[['category']]).toarray()

# Label Encoding
le = LabelEncoder()
df['category_encoded'] = le.fit_transform(df['category'])

# Target Encoding (using category_encoders library)
from category_encoders import TargetEncoder
encoder = TargetEncoder()
df['category_encoded'] = encoder.fit_transform(df['category'], df['target'])`}
                  </code>
                </pre>
              </div>
            </div>
          </section>

          {/* Model Training Section */}
          <section id="train-test-split" className="mb-12">
            <h1 className="text-3xl font-bold text-[var(--color-gray-900)] mb-6">Model Training</h1>
            
            <h2 className="text-2xl font-semibold text-[var(--color-primary-700)] mb-4">Train-Test Split</h2>
            <div className="prose max-w-none">
              <p className="mb-4">
                Before training a model, it's essential to split your data into training and test sets. This allows you to evaluate your model's performance on unseen data.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-xl font-medium text-[var(--color-gray-800)] mb-2">Typical Splits</h3>
                  <ul className="list-disc pl-6 mb-4">
                    <li><strong>70-30:</strong> 70% training, 30% testing</li>
                    <li><strong>80-20:</strong> 80% training, 20% testing</li>
                    <li><strong>Stratified:</strong> Maintains class distribution in splits</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-[var(--color-gray-800)] mb-2">Best Practices</h3>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Shuffle data before splitting</li>
                    <li>Use stratification for imbalanced datasets</li>
                    <li>Consider time-based splits for time-series data</li>
                    <li>Never let test data influence preprocessing</li>
                  </ul>
                </div>
              </div>
              
              <div className="my-4 p-4 bg-[var(--color-gray-100)] rounded-lg">
                <h4 className="font-medium mb-2">Example: Train-Test Split in Python</h4>
                <pre className="bg-[var(--color-gray-800)] text-[var(--color-gray-100)] p-3 rounded overflow-x-auto">
                  <code>
{`from sklearn.model_selection import train_test_split

# Simple random split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

# Stratified split (for classification)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42)`}
                  </code>
                </pre>
              </div>
            </div>
          </section>

          <section id="model-selection" className="mb-12">
            <h2 className="text-2xl font-semibold text-[var(--color-primary-700)] mb-4">Model Selection</h2>
            <div className="prose max-w-none">
              <p className="mb-4">
                Choosing the right algorithm is crucial for building effective machine learning models. The choice depends on:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>The type of problem (classification, regression, clustering)</li>
                <li>The size and nature of your dataset</li>
                <li>Computational resources available</li>
                <li>Interpretability requirements</li>
                <li>Performance requirements</li>
              </ul>
              
              <div className="my-6">
                <h3 className="text-xl font-medium text-[var(--color-gray-800)] mb-2">Algorithm Selection Guide</h3>
                <img src="src\assets\Images\algorithm-selection.png" alt="Machine Learning Algorithm Selection Guide" className="w-full max-w-2xl mx-auto rounded border border-[var(--color-gray-200)]" />
                <p className="text-sm text-center mt-2 text-[var(--color-gray-600)]">Flowchart for selecting appropriate machine learning algorithms</p>
              </div>
              
              <div className="my-4 p-4 bg-[var(--color-gray-100)] rounded-lg">
                <h4 className="font-medium mb-2">Example: Model Training in Python</h4>
                <pre className="bg-[var(--color-gray-800)] text-[var(--color-gray-100)] p-3 rounded overflow-x-auto">
                  <code>
{`from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC

# Initialize models
models = {
    'Random Forest': RandomForestClassifier(),
    'Logistic Regression': LogisticRegression(),
    'SVM': SVC()
}

# Train and evaluate each model
for name, model in models.items():
    model.fit(X_train, y_train)
    score = model.score(X_test, y_test)
    print(f"{name}: {score:.2f}")`}
                  </code>
                </pre>
              </div>
            </div>
          </section>

          <section id="hyperparameter-tuning" className="mb-12">
            <h2 className="text-2xl font-semibold text-[var(--color-primary-700)] mb-4">Hyperparameter Tuning</h2>
            <div className="prose max-w-none">
              <p className="mb-4">
                Hyperparameters are parameters that are not learned from data but set prior to training. Tuning them can significantly improve model performance.
              </p>
              
              <h3 className="text-xl font-medium text-[var(--color-gray-800)] mb-2">Common Tuning Methods</h3>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium mb-2">Grid Search</h4>
                  <p>Exhaustively searches through a specified subset of hyperparameters</p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Tests all combinations</li>
                    <li>Computationally expensive</li>
                    <li>Good for small parameter spaces</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Random Search</h4>
                  <p>Samples hyperparameters randomly from specified distributions</p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>More efficient than grid search</li>
                    <li>Better for large parameter spaces</li>
                    <li>Can find good combinations faster</li>
                  </ul>
                </div>
              </div>
              
              <div className="my-4 p-4 bg-[var(--color-gray-100)] rounded-lg">
                <h4 className="font-medium mb-2">Example: Hyperparameter Tuning in Python</h4>
                <pre className="bg-[var(--color-gray-800)] text-[var(--color-gray-100)] p-3 rounded overflow-x-auto">
                  <code>
{`from sklearn.model_selection import GridSearchCV
from sklearn.ensemble import RandomForestClassifier

# Define parameter grid
param_grid = {
    'n_estimators': [100, 200, 300],
    'max_depth': [None, 5, 10],
    'min_samples_split': [2, 5, 10]
}

# Initialize grid search
grid_search = GridSearchCV(
    estimator=RandomForestClassifier(),
    param_grid=param_grid,
    cv=5,
    n_jobs=-1
)

# Fit grid search
grid_search.fit(X_train, y_train)

# Best parameters
print("Best parameters:", grid_search.best_params_)`}
                  </code>
                </pre>
              </div>
            </div>
          </section>

          <section id="cross-validation" className="mb-12">
            <h2 className="text-2xl font-semibold text-[var(--color-primary-700)] mb-4">Cross-Validation</h2>
            <div className="prose max-w-none">
              <p className="mb-4">
                Cross-validation is a technique for assessing how the results of a statistical analysis will generalize to an independent dataset. It's essential for:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Getting more reliable performance estimates</li>
                <li>Making better use of limited data</li>
                <li>Detecting overfitting</li>
              </ul>
              
              <div className="my-6">
                <h3 className="text-xl font-medium text-[var(--color-gray-800)] mb-2">Common Cross-Validation Strategies</h3>
                <img src="src\assets\Images\cross-validation.png" alt="Cross-Validation Techniques" className="w-full max-w-2xl mx-auto rounded border border-[var(--color-gray-200)]" />
                <p className="text-sm text-center mt-2 text-[var(--color-gray-600)]">Visualization of different cross-validation techniques</p>
              </div>
              
              <div className="my-4 p-4 bg-[var(--color-gray-100)] rounded-lg">
                <h4 className="font-medium mb-2">Example: Cross-Validation in Python</h4>
                <pre className="bg-[var(--color-gray-800)] text-[var(--color-gray-100)] p-3 rounded overflow-x-auto">
                  <code>
{`from sklearn.model_selection import cross_val_score, KFold, StratifiedKFold
from sklearn.ensemble import RandomForestClassifier

# Simple cross-validation
scores = cross_val_score(
    RandomForestClassifier(),
    X, y,
    cv=5  # 5-fold CV
)

# More control with KFold
kf = KFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(
    RandomForestClassifier(),
    X, y,
    cv=kf
)

# Stratified KFold for classification
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(
    RandomForestClassifier(),
    X, y,
    cv=skf
)`}
                  </code>
                </pre>
              </div>
            </div>
          </section>

          {/* Evaluation Metrics Section */}
          <section id="classification-metrics" className="mb-12">
            <h1 className="text-3xl font-bold text-[var(--color-gray-900)] mb-6">Evaluation Metrics</h1>
            
            <h2 className="text-2xl font-semibold text-[var(--color-primary-700)] mb-4">Classification Metrics</h2>
            <div className="prose max-w-none">
              <p className="mb-4">
                For classification problems, there are several metrics to evaluate model performance:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-xl font-medium text-[var(--color-gray-800)] mb-2">Basic Metrics</h3>
                  <ul className="list-disc pl-6 mb-4">
                    <li><strong>Accuracy:</strong> (TP + TN) / (TP + TN + FP + FN)</li>
                    <li><strong>Precision:</strong> TP / (TP + FP)</li>
                    <li><strong>Recall (Sensitivity):</strong> TP / (TP + FN)</li>
                    <li><strong>F1 Score:</strong> 2 * (Precision * Recall) / (Precision + Recall)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-[var(--color-gray-800)] mb-2">Advanced Metrics</h3>
                  <ul className="list-disc pl-6 mb-4">
                    <li><strong>ROC-AUC:</strong> Area under the ROC curve</li>
                    <li><strong>PR-AUC:</strong> Area under the Precision-Recall curve</li>
                    <li><strong>Log Loss:</strong> Logarithmic loss metric</li>
                    <li><strong>Cohen's Kappa:</strong> Agreement between predictions and actuals</li>
                  </ul>
                </div>
              </div>
              
              <div className="my-6">
                <h3 className="text-xl font-medium text-[var(--color-gray-800)] mb-2">Confusion Matrix</h3>
                <img src="src\assets\Images\confusion-matrix.png" alt="Confusion Matrix" className="w-full max-w-md mx-auto rounded border border-[var(--color-gray-200)]" />
                <p className="text-sm text-center mt-2 text-[var(--color-gray-600)]">Visual representation of classification performance</p>
              </div>
              
              <div className="my-4 p-4 bg-[var(--color-gray-100)] rounded-lg">
                <h4 className="font-medium mb-2">Example: Classification Metrics in Python</h4>
                <pre className="bg-[var(--color-gray-800)] text-[var(--color-gray-100)] p-3 rounded overflow-x-auto">
                  <code>
{`from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, 
    f1_score, roc_auc_score, confusion_matrix,
    classification_report
)

# Calculate metrics
accuracy = accuracy_score(y_true, y_pred)
precision = precision_score(y_true, y_pred)
recall = recall_score(y_true, y_pred)
f1 = f1_score(y_true, y_pred)
roc_auc = roc_auc_score(y_true, y_pred_proba)

# Confusion matrix
cm = confusion_matrix(y_true, y_pred)

# Classification report
print(classification_report(y_true, y_pred))`}
                  </code>
                </pre>
              </div>
            </div>
          </section>

          <section id="regression-metrics" className="mb-12">
            <h2 className="text-2xl font-semibold text-[var(--color-primary-700)] mb-4">Regression Metrics</h2>
            <div className="prose max-w-none">
              <p className="mb-4">
                For regression problems, different metrics are used to evaluate performance:
              </p>
              
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full border border-[var(--color-gray-200)]">
                  <thead className="bg-[var(--color-gray-100)]">
                    <tr>
                      <th className="border border-[var(--color-gray-200)] px-4 py-2">Metric</th>
                      <th className="border border-[var(--color-gray-200)] px-4 py-2">Formula</th>
                      <th className="border border-[var(--color-gray-200)] px-4 py-2">Interpretation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-[var(--color-gray-200)] px-4 py-2">Mean Absolute Error (MAE)</td>
                      <td className="border border-[var(--color-gray-200)] px-4 py-2">Σ|y_true - y_pred| / n</td>
                      <td className="border border-[var(--color-gray-200)] px-4 py-2">Average absolute difference</td>
                    </tr>
                    <tr>
                      <td className="border border-[var(--color-gray-200)] px-4 py-2">Mean Squared Error (MSE)</td>
                      <td className="border border-[var(--color-gray-200)] px-4 py-2">Σ(y_true - y_pred)² / n</td>
                      <td className="border border-[var(--color-gray-200)] px-4 py-2">Average squared difference (punishes large errors)</td>
                    </tr>
                    <tr>
                      <td className="border border-[var(--color-gray-200)] px-4 py-2">Root Mean Squared Error (RMSE)</td>
                      <td className="border border-[var(--color-gray-200)] px-4 py-2">√MSE</td>
                      <td className="border border-[var(--color-gray-200)] px-4 py-2">In original units (more interpretable)</td>
                    </tr>
                    <tr>
                      <td className="border border-[var(--color-gray-200)] px-4 py-2">R² (R-squared)</td>
                      <td className="border border-[var(--color-gray-200)] px-4 py-2">1 - (Σ(y_true - y_pred)² / Σ(y_true - y_mean)²)</td>
                      <td className="border border-[var(--color-gray-200)] px-4 py-2">Proportion of variance explained (0-1, higher is better)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="my-4 p-4 bg-[var(--color-gray-100)] rounded-lg">
                <h4 className="font-medium mb-2">Example: Regression Metrics in Python</h4>
                <pre className="bg-[var(--color-gray-800)] text-[var(--color-gray-100)] p-3 rounded overflow-x-auto">
                  <code>
{`from sklearn.metrics import (
    mean_absolute_error, mean_squared_error, 
    r2_score
)

# Calculate metrics
mae = mean_absolute_error(y_true, y_pred)
mse = mean_squared_error(y_true, y_pred)
rmse = mean_squared_error(y_true, y_pred, squared=False)
r2 = r2_score(y_true, y_pred)

print(f"MAE: {mae:.2f}")
print(f"MSE: {mse:.2f}")
print(f"RMSE: {rmse:.2f}")
print(f"R²: {r2:.2f}")`}
                  </code>
                </pre>
              </div>
            </div>
          </section>

          <section id="bias-variance" className="mb-12">
            <h2 className="text-2xl font-semibold text-[var(--color-primary-700)] mb-4">Bias-Variance Tradeoff</h2>
            <div className="prose max-w-none">
              <p className="mb-4">
                The bias-variance tradeoff is a fundamental concept in machine learning that describes the tension between two sources of error:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-xl font-medium text-[var(--color-gray-800)] mb-2">Bias</h3>
                  <p>Error from overly simplistic assumptions in the learning algorithm</p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>High bias can cause underfitting</li>
                    <li>Model is too simple to capture patterns</li>
                    <li>Poor performance on both training and test data</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-[var(--color-gray-800)] mb-2">Variance</h3>
                  <p>Error from sensitivity to small fluctuations in the training set</p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>High variance can cause overfitting</li>
                    <li>Model is too complex and captures noise</li>
                    <li>Good on training data but poor on test data</li>
                  </ul>
                </div>
              </div>
              
              <div className="my-6">
                <h3 className="text-xl font-medium text-[var(--color-gray-800)] mb-2">Bias-Variance Tradeoff Visualization</h3>
                <img src="src\assets\Images\baise-variance.png" alt="Bias-Variance Tradeoff" className="w-full max-w-2xl mx-auto rounded border border-[var(--color-gray-200)]" />
                <p className="text-sm text-center mt-2 text-[var(--color-gray-600)]">The relationship between model complexity and error</p>
              </div>
              
              <div className="my-4 p-4 bg-[var(--color-gray-100)] rounded-lg">
                <h4 className="font-medium mb-2">Balancing Bias and Variance</h4>
                <ul className="list-disc pl-6">
                  <li><strong>Reduce bias:</strong> Use more complex models, add features, reduce regularization</li>
                  <li><strong>Reduce variance:</strong> Use simpler models, reduce features, add regularization, get more training data</li>
                  <li><strong>Ideal model:</strong> Balanced bias and variance that generalizes well to unseen data</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Deployment Strategies Section */}
          <section id="model-persistence" className="mb-12">
            <h1 className="text-3xl font-bold text-[var(--color-gray-900)] mb-6">Deployment Strategies</h1>
            
            <h2 className="text-2xl font-semibold text-[var(--color-primary-700)] mb-4">Model Persistence</h2>
            <div className="prose max-w-none">
              <p className="mb-4">
                After training a model, you need to save it for later use in production. This is called model persistence. Common formats and methods include:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-xl font-medium text-[var(--color-gray-800)] mb-2">Serialization Formats</h3>
                  <ul className="list-disc pl-6 mb-4">
                    <li><strong>Pickle:</strong> Python's native serialization format</li>
                    <li><strong>Joblib:</strong> More efficient for large numpy arrays</li>
                    <li><strong>ONNX:</strong> Open standard for model interoperability</li>
                    <li><strong>TensorFlow SavedModel:</strong> For TensorFlow models</li>
                    <li><strong>TorchScript:</strong> For PyTorch models</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-[var(--color-gray-800)] mb-2">Best Practices</h3>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Save the entire pipeline (preprocessing + model)</li>
                    <li>Include model metadata (version, training date)</li>
                    <li>Validate the saved model can be reloaded correctly</li>
                    <li>Consider model size for deployment constraints</li>
                  </ul>
                </div>
              </div>
              
              <div className="my-4 p-4 bg-[var(--color-gray-100)] rounded-lg">
                <h4 className="font-medium mb-2">Example: Model Persistence in Python</h4>
                <pre className="bg-[var(--color-gray-800)] text-[var(--color-gray-100)] p-3 rounded overflow-x-auto">
                  <code>
{`import pickle
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

# Create and train a pipeline
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('model', RandomForestClassifier())
])
pipeline.fit(X_train, y_train)

# Save with pickle
with open('model.pkl', 'wb') as f:
    pickle.dump(pipeline, f)

# Save with joblib (better for large models)
joblib.dump(pipeline, 'model.joblib')

# Load the model
with open('model.pkl', 'rb') as f:
    loaded_model = pickle.load(f)

# Or with joblib
loaded_model = joblib.load('model.joblib')`}
                  </code>
                </pre>
              </div>
            </div>
          </section>

          <section id="api-deployment" className="mb-12">
            <h2 className="text-2xl font-semibold text-[var(--color-primary-700)] mb-4">API Deployment</h2>
            <div className="prose max-w-none">
              <p className="mb-4">
                Exposing your model as an API (Application Programming Interface) is a common deployment pattern that allows other applications to consume your model's predictions.
              </p>
              
              <h3 className="text-xl font-medium text-[var(--color-gray-800)] mb-2">Common Deployment Options</h3>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium mb-2">Web Frameworks</h4>
                  <ul className="list-disc pl-6 mb-4">
                    <li><strong>Flask:</strong> Lightweight Python web framework</li>
                    <li><strong>FastAPI:</strong> Modern, fast Python framework with automatic docs</li>
                    <li><strong>Django:</strong> Full-featured Python framework</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Deployment Platforms</h4>
                  <ul className="list-disc pl-6 mb-4">
                    <li><strong>AWS SageMaker:</strong> Managed ML service</li>
                    <li><strong>Google Vertex AI:</strong> Google's ML platform</li>
                    <li><strong>Azure ML:</strong> Microsoft's ML service</li>
                    <li><strong>Heroku:</strong> Simple platform for small models</li>
                    <li><strong>Docker/Kubernetes:</strong> Containerized deployment</li>
                  </ul>
                </div>
              </div>
              
              <div className="my-4 p-4 bg-[var(--color-gray-100)] rounded-lg">
                <h4 className="font-medium mb-2">Example: Flask API for Model Deployment</h4>
                <pre className="bg-[var(--color-gray-800)] text-[var(--color-gray-100)] p-3 rounded overflow-x-auto">
                  <code>
{`from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

# Load the model
model = joblib.load('model.joblib')

@app.route('/predict', methods=['POST'])
def predict():
    # Get data from request
    data = request.get_json()
    
    # Make prediction
    prediction = model.predict([data['features']])
    
    # Return prediction
    return jsonify({'prediction': prediction.tolist()})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)`}
                  </code>
                </pre>
              </div>
              
              <div className="my-6">
                <h3 className="text-xl font-medium text-[var(--color-gray-800)] mb-2">API Deployment Architecture</h3>
                <img src="src\assets\Images\api-deployment.png" alt="API Deployment Architecture" className="w-full max-w-2xl mx-auto rounded border border-[var(--color-gray-200)]" />
                <p className="text-sm text-center mt-2 text-[var(--color-gray-600)]">Typical architecture for deploying ML models as APIs</p>
              </div>
            </div>
          </section>

          <section id="monitoring" className="mb-12">
            <h2 className="text-2xl font-semibold text-[var(--color-primary-700)] mb-4">Model Monitoring</h2>
            <div className="prose max-w-none">
              <p className="mb-4">
                After deployment, it's crucial to monitor your model to ensure it continues to perform well. Model performance can degrade over time due to:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Data drift:</strong> Changes in the distribution of input data</li>
                <li><strong>Concept drift:</strong> Changes in the relationship between inputs and outputs</li>
                <li><strong>Upstream changes:</strong> Changes in data collection or preprocessing</li>
              </ul>
              
              <h3 className="text-xl font-medium text-[var(--color-gray-800)] mb-2">Key Monitoring Metrics</h3>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium mb-2">Performance Metrics</h4>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Accuracy/Error rate over time</li>
                    <li>Prediction distribution changes</li>
                    <li>Latency and throughput</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Data Quality Metrics</h4>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Feature distribution changes</li>
                    <li>Missing value rates</li>
                    <li>Outlier detection</li>
                  </ul>
                </div>
              </div>
              
              <div className="my-4 p-4 bg-[var(--color-gray-100)] rounded-lg">
                <h4 className="font-medium mb-2">Example: Monitoring Implementation</h4>
                <pre className="bg-[var(--color-gray-800)] text-[var(--color-gray-100)] p-3 rounded overflow-x-auto">
                  <code>
{`import pandas as pd
from scipy.stats import ks_2samp
import numpy as np

def detect_data_drift(reference_data, current_data, feature, threshold=0.05):
    """
    Detect drift using Kolmogorov-Smirnov test
    """
    stat, p_value = ks_2samp(reference_data[feature], current_data[feature])
    return p_value < threshold

# Example usage
reference_data = pd.read_csv('reference_data.csv')
current_data = pd.read_csv('current_data.csv')

for feature in reference_data.columns:
    if detect_data_drift(reference_data, current_data, feature):
        print(f"Drift detected in feature: {feature}")`}
                  </code>
                </pre>
              </div>
              
              <div className="my-6">
                <h3 className="text-xl font-medium text-[var(--color-gray-800)] mb-2">Model Retraining Strategies</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li><strong>Scheduled retraining:</strong> Retrain model at fixed intervals</li>
                  <li><strong>Performance-based:</strong> Retrain when metrics degrade</li>
                  <li><strong>Online learning:</strong> Continuously update the model</li>
                  <li><strong>Shadow mode:</strong> Run new model alongside old before switching</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Resources Section */}
          <section id="further-reading" className="mb-12">
            <h1 className="text-3xl font-bold text-[var(--color-gray-900)] mb-6">Further Reading</h1>
            
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold text-[var(--color-primary-700)] mb-4">Books</h2>
              <ul className="list-disc pl-6 mb-6">
                <li>
                  <a href="https://www.deeplearningbook.org/" target='blank' className="text-[var(--color-primary-600)] hover:underline">
                    Deep Learning by Ian Goodfellow, Yoshua Bengio, and Aaron Courville
                  </a> - Comprehensive reference on deep learning
                </li>
                <li>
                  <a href="https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/" target='blank' className="text-[var(--color-primary-600)] hover:underline">
                    Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow by Aurélien Géron
                  </a> - Practical guide with code examples
                </li>
                <li>
                  <a href="https://www.amazon.com/Pattern-Recognition-Learning-Information-Statistics/dp/0387310738" target='blank' className="text-[var(--color-primary-600)] hover:underline">
                    Pattern Recognition and Machine Learning by Christopher Bishop
                  </a> - Theoretical foundations
                </li>
              </ul>

              <h2 className="text-2xl font-semibold text-[var(--color-primary-700)] mb-4">Online Courses</h2>
              <ul className="list-disc pl-6 mb-6">
                <li>
                  <a href="https://www.coursera.org/learn/machine-learning" target='blank' className="text-[var(--color-primary-600)] hover:underline">
                    Machine Learning by Andrew Ng (Coursera)
                  </a> - Classic introduction to ML
                </li>
                <li>
                  <a href="https://www.fast.ai/" target='blank' className="text-[var(--color-primary-600)] hover:underline">
                    Practical Deep Learning for Coders (fast.ai)
                  </a> - Hands-on deep learning course
                </li>
                <li>
                  <a href="https://developers.google.com/machine-learning/crash-course" target='blank' className="text-[var(--color-primary-600)] hover:underline">
                    Machine Learning Crash Course (Google)
                  </a> - Free course with TensorFlow
                </li>
              </ul>

              <h2 className="text-2xl font-semibold text-[var(--color-primary-700)] mb-4">Documentation & References</h2>
              <ul className="list-disc pl-6 mb-6">
                <li>
                  <a href="https://scikit-learn.org/stable/user_guide.html" target='blank' className="text-[var(--color-primary-600)] hover:underline">
                    scikit-learn Documentation
                  </a> - Excellent reference for traditional ML
                </li>
                <li>
                  <a href="https://www.tensorflow.org/guide" target='blank' className="text-[var(--color-primary-600)] hover:underline">
                    TensorFlow Guides
                  </a> - For deep learning implementations
                </li>
                <li>
                  <a href="https://pytorch.org/docs/stable/index.html" target='blank' className="text-[var(--color-primary-600)] hover:underline">
                    PyTorch Documentation
                  </a> - Another great deep learning framework
                </li>
              </ul>
            </div>
          </section>

          <section id="datasets" className="mb-12">
            <h2 className="text-2xl font-semibold text-[var(--color-primary-700)] mb-4">Public Datasets</h2>
            <div className="prose max-w-none">
              <p className="mb-4">
                Practicing with real datasets is essential for learning machine learning. Here are some great sources:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-xl font-medium text-[var(--color-gray-800)] mb-2">General Datasets</h3>
                  <ul className="list-disc pl-6 mb-4">
                    <li>
                      <a href="https://www.kaggle.com/datasets" target='blank' className="text-[var(--color-primary-600)] hover:underline">
                        Kaggle Datasets
                      </a> - Large collection of datasets for all purposes
                    </li>
                    <li>
                      <a href="https://archive.ics.uci.edu/ml/index.php" target='blank' className="text-[var(--color-primary-600)] hover:underline">
                        UCI Machine Learning Repository
                      </a> - Classic datasets for ML research
                    </li>
                    <li>
                      <a href="https://datasetsearch.research.google.com/" target='blank' className="text-[var(--color-primary-600)] hover:underline">
                        Google Dataset Search
                      </a> - Search engine for datasets
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-[var(--color-gray-800)] mb-2">Specialized Datasets</h3>
                  <ul className="list-disc pl-6 mb-4">
                    <li>
                      <a href="https://www.image-net.org/" target='blank' className="text-[var(--color-primary-600)] hover:underline">
                        ImageNet
                      </a> - Large image dataset for computer vision
                    </li>
                    <li>
                      <a href="https://commonvoice.mozilla.org/en/datasets" target='blank' className="text-[var(--color-primary-600)] hover:underline">
                        Common Voice
                      </a> - Multilingual speech dataset
                    </li>
                    <li>
                      <a href="https://www.kaggle.com/c/nyc-taxi-trip-duration" target='blank' className="text-[var(--color-primary-600)] hover:underline">
                        NYC Taxi Trip Data
                      </a> - Great for time series and geospatial analysis
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LearnPage;