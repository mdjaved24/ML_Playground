"""
Machine Learning Utility Functions

This module provides core functionality for:
- Reading and preprocessing datasets
- Training machine learning models
- Evaluating model performance
- Making predictions with trained models
"""

import pandas as pd
import numpy as np
from sklearn import preprocessing, model_selection, linear_model, neighbors, tree, ensemble, svm, metrics
import joblib
import traceback
import time


def read_file(file):
    """
    Read a dataset file (CSV or Excel) into a pandas DataFrame.
    
    Args:
        file: File object to read
        
    Returns:
        pd.DataFrame: Loaded dataset
        
    Raises:
        ValueError: If file type is unsupported
    """
    import os
    ext = os.path.splitext(file.name)[1].lower()
    file.seek(0)
    if ext == '.csv':
        return pd.read_csv(file)
    elif ext == '.xlsx':
        return pd.read_excel(file)
    else:
        raise ValueError("Unsupported file type")


def preprocess_and_train(df, config):
    """
    Complete machine learning pipeline from preprocessing to model training.
    
    Args:
        df: Input DataFrame containing the dataset
        config: Dictionary containing training configuration with keys:
            - features: List of feature columns
            - target: Target column name
            - encoder: Type of encoder to use ('LabelEncoder' or 'OneHotEncoder')
            - scaler: Type of scaler to use ('StandardScaler' or 'MinMaxScaler')
            - test_size: Fraction of data to use for testing
            - random_state: Random seed for reproducibility
            - model_type: Type of model to train
            - problem_type: 'classification' or 'regression'
            - parameters: Dictionary of model hyperparameters
            
    Returns:
        tuple: (feature_types, categorical_values, training_time, model, 
               feature_encoder, scaler, target_encoder, accuracy)
               
    Raises:
        ValueError: If training fails or invalid configuration
    """
    try:
        df_processed = df.copy()
        features = config['features']
        target = config['target']
        
        # Initialize feature type tracking
        feature_types = {}
        categorical_values = {}

        start_time = time.time()

        # Determine feature types and categorical values
        for col in features:
            if df[col].dtype == 'O' or df[col].nunique() <= 5:
                feature_types[col] = 'categorical'
                unique_vals = [x for x in df[col].dropna().unique() 
                            if not (isinstance(x, str)) or x.strip() != '']
                categorical_values[col] = unique_vals if unique_vals else None
            else:
                feature_types[col] = 'numerical'

        # Initialize preprocessing objects
        feature_encoder = None
        if config['encoder'] == 'LabelEncoder':
            feature_encoder = preprocessing.LabelEncoder()
        elif config['encoder'] == 'OneHotEncoder':
            feature_encoder = preprocessing.OneHotEncoder(handle_unknown='ignore', sparse_output=False)

        scaler = None
        if config['scaler'] == 'StandardScaler':
            scaler = preprocessing.StandardScaler()
        elif config['scaler'] == 'MinMaxScaler':
            scaler = preprocessing.MinMaxScaler()

        # Handle missing values
        for col in df_processed.select_dtypes(exclude=['object']):
            df_processed[col] = df_processed[col].fillna(df_processed[col].mean())
        for col in df_processed.select_dtypes(include=['object']):
            df_processed[col] = df_processed[col].fillna(df_processed[col].mode()[0])

        # Remove outliers from numerical features
        numerical_cols = df_processed.select_dtypes(exclude=['object']).columns
        df_processed = safe_remove_outliers(df_processed, numerical_cols, target_col=config['target'])

        # Split data into features and target
        X = df_processed.loc[:,features]
        y = df_processed[target]

        # Encode target if categorical
        target_encoder = None
        if y.dtype == 'O':
            target_encoder = preprocessing.LabelEncoder()
            y = target_encoder.fit_transform(y)

        # Validate target class count
        unique_classes = np.unique(y)
        if len(unique_classes) < 2:
            raise ValueError("Target column must contain at least two unique classes for classification.")

        # Apply stratified split if requested and possible
        stratify = y if config.get('stratify', False) and len(unique_classes) > 1 else None

        # Train-test split
        X_train, X_test, y_train, y_test = model_selection.train_test_split(
            X, y,
            test_size=config['test_size'],
            random_state=config['random_state'],
            stratify=stratify
        )

        # Process categorical features
        categorical_cols = X_train.select_dtypes(include=['object']).columns
        
        if feature_encoder is not None:
            if isinstance(feature_encoder, preprocessing.LabelEncoder):
                label_encoders = {}
                for col in categorical_cols:
                    le = preprocessing.LabelEncoder()
                    X_train[col] = le.fit_transform(X_train[col])
                    X_test[col] = X_test[col].map(
                        lambda x: le.transform([x])[0] if x in le.classes_ else len(le.classes_)
                    )
                    label_encoders[col] = le
                feature_encoder = label_encoders
            else:
                X_train_cat = feature_encoder.fit_transform(X_train[categorical_cols])
                X_test_cat = feature_encoder.transform(X_test[categorical_cols])
                num_cols = X_train.select_dtypes(exclude=['object']).columns
                X_train = np.hstack([X_train[num_cols].values, X_train_cat])
                X_test = np.hstack([X_test[num_cols].values, X_test_cat])

        # Scale features
        if scaler is not None:
            X_train = scaler.fit_transform(X_train)
            X_test = scaler.transform(X_test)

        # Model training
        model_map = {
            'LinearRegression': linear_model.LinearRegression,
            'LogisticRegression': linear_model.LogisticRegression,
            'KNeighborsRegressor': neighbors.KNeighborsRegressor,
            'KNeighborsClassifier': neighbors.KNeighborsClassifier,
            'DecisionTreeRegressor': tree.DecisionTreeRegressor,
            'DecisionTreeClassifier': tree.DecisionTreeClassifier,
            'RandomForestRegressor': ensemble.RandomForestRegressor,
            'RandomForestClassifier': ensemble.RandomForestClassifier,
            'SVC': svm.SVC,
            'Ridge': linear_model.Ridge
        }

        model = model_map[config['model_type']](**config.get('parameters', {}))
        model.fit(X_train, y_train)

        # Evaluation
        predictions = model.predict(X_test)
        end_time = time.time()
        training_time = round(end_time - start_time, 2)

        accuracy = evaluate_model(y_test, predictions, config['problem_type'], features, model)

        return (feature_types, categorical_values, training_time, model, 
                feature_encoder, scaler, target_encoder, accuracy)

    except Exception as e:
        traceback.print_exc()
        raise ValueError(f"Model training failed: {str(e)}")


def evaluate_model(y_test, prediction, problem_type, features, model):
    """
    Evaluate model performance and generate metrics.
    
    Args:
        y_test: True target values
        prediction: Model predictions
        problem_type: 'classification' or 'regression'
        features: List of feature names
        model: Trained model object
        
    Returns:
        dict: Dictionary containing evaluation metrics and feature importance
    """
    accuracy = {}
    
    if problem_type == 'classification':
        accuracy['accuracy_score'] = metrics.accuracy_score(y_test, prediction)
        accuracy['precision'] = metrics.precision_score(y_test, prediction, average='weighted')
        accuracy['recall'] = metrics.recall_score(y_test, prediction, average='weighted')
        accuracy['f1_score'] = metrics.f1_score(y_test, prediction, average='weighted')
        
        # Confusion matrix with labels
        unique_classes = sorted(np.unique(y_test))
        accuracy['confusion_matrix'] = {
            'matrix': metrics.confusion_matrix(y_test, prediction, labels=unique_classes).tolist(),
            'labels': [str(cls) for cls in unique_classes]
        }
        accuracy['classification_report'] = metrics.classification_report(
            y_test, prediction, output_dict=True)
    else:
        accuracy['r2_score'] = metrics.r2_score(y_test, prediction)
        accuracy['mean_squared_error'] = metrics.mean_squared_error(y_test, prediction)
        accuracy['mean_absolute_error'] = metrics.mean_absolute_error(y_test, prediction)
        accuracy['root_mean_squared_error'] = np.sqrt(metrics.mean_squared_error(y_test, prediction))

    # Feature importance
    feature_importance = {
        'labels': features,
        'values': [0]*len(features)  # Default to zeros
    }

    try:
        if hasattr(model, 'feature_importances_'):
            feature_importance['values'] = model.feature_importances_.tolist()
        elif hasattr(model, 'coef_'):
            feature_importance['values'] = np.abs(model.coef_).tolist()
    except Exception as e:
        print(f"Couldn't get feature importance: {str(e)}")

    accuracy['feature_importance'] = feature_importance
    
    return accuracy


def safe_remove_outliers(df, cols, target_col=None):
    """
    Remove outliers from numerical columns while maintaining data alignment.
    
    Args:
        df: Input DataFrame
        cols: List of columns to process
        target_col: (Optional) Target column to exclude from processing
        
    Returns:
        pd.DataFrame: DataFrame with outliers removed
    """
    if target_col is not None and target_col in cols:
        cols = [col for col in cols if col != target_col]
        
    for col in cols:
        q1 = df[col].quantile(0.25)
        q3 = df[col].quantile(0.75)
        iqr = q3 - q1
        lower_bound = q1 - (1.5 * iqr)
        upper_bound = q3 + (1.5 * iqr)
        df = df[(df[col] >= lower_bound) & (df[col] <= upper_bound)]
    return df


def load_model_and_predict(model_path, features, columns, encoder=None, scaler=None, target_encoder=None):
    """
    Load a trained model and make predictions on new data.
    
    Args:
        model_path: Path to saved model file
        features: List of feature values for prediction
        columns: List of column names corresponding to features
        encoder: (Optional) Feature encoder object
        scaler: (Optional) Feature scaler object
        target_encoder: (Optional) Target encoder for classification
        
    Returns:
        Prediction result (type depends on model)
        
    Raises:
        ValueError: If prediction fails or inputs are invalid
    """
    try:
            # Load models and preprocessing objects
            model = joblib.load(model_path)
            
            # Load encoder if path is provided
            if encoder and isinstance(encoder, str):
                encoder = joblib.load(encoder)
            
            # Load scaler if path is provided
            if scaler and isinstance(scaler, str):
                scaler = joblib.load(scaler)
                
            # Load target encoder if path is provided
            if target_encoder and isinstance(target_encoder, str):
                target_encoder = joblib.load(target_encoder)

            # Rest of your prediction logic...
            input_df = pd.DataFrame([features], columns=columns)
            processed_df = input_df.copy()

            # Handle missing values
            for col in processed_df.select_dtypes(include=['float64', 'int64']):
                processed_df[col] = processed_df[col].fillna(processed_df[col].mean())

            for col in processed_df.select_dtypes(include=['object']):
                processed_df[col] = processed_df[col].fillna(processed_df[col].mode()[0])

            # Encoding categorical variables
            if encoder is not None:
                if isinstance(encoder, dict):
                    # Handle label encoders stored in a dictionary
                    for col in processed_df.select_dtypes(include=['object']):
                        if col in encoder:
                            le = encoder[col]
                            processed_df[col] = processed_df[col].map(
                                lambda x: le.transform([x])[0] if x in le.classes_ else len(le.classes_)
                            )
                else:
                    # Handle other encoder types (like OneHotEncoder)
                    for col in processed_df.select_dtypes(include=['object']):
                        if col in columns:
                            processed_df[col] = encoder.transform(processed_df[[col]])

            # Scaling numerical features
            if scaler is not None:
                if hasattr(scaler, 'feature_names_in_'):
                    numeric_cols = scaler.feature_names_in_
                else:
                    numeric_cols = processed_df.select_dtypes(include=['float64', 'int64']).columns

                scaled_array = scaler.transform(processed_df[numeric_cols])
                processed_df[numeric_cols] = pd.DataFrame(scaled_array, columns=numeric_cols)

            # Prepare final features
            final_features = processed_df.values
            if final_features.ndim == 1:
                final_features = final_features.reshape(1, -1)

            # Make prediction
            prediction = model.predict(final_features)

            # Inverse transform for classification
            if target_encoder is not None:
                prediction = target_encoder.inverse_transform(prediction)

            # Round float predictions
            if isinstance(prediction, (list, np.ndarray)):
                if np.issubdtype(np.array(prediction).dtype, np.floating):
                    prediction = np.round(prediction, 2)
            elif isinstance(prediction, float):
                prediction = round(prediction, 2)

            return prediction

    except Exception as e:
        raise ValueError(f"Prediction failed: {str(e)}")