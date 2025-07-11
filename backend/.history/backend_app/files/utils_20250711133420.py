import pandas as pd
import numpy as np
from sklearn import preprocessing, model_selection, linear_model, neighbors, tree, ensemble, svm, metrics
import joblib
import traceback


def read_file(file):
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
    try:
        df_processed = df.copy()
        features = config['features']
        target = config['target']

        # Initialize feature type tracking
        feature_types = {}
        categorical_values = {}

        # Determine feature types
        for col in features:
            if df[col].dtype == 'O' or df[col].nunique() <= 5:
                feature_types[col] = 'categorical'
                categorical_values[col] = list(df[col].unique())
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
        df_processed = safe_remove_outliers(df_processed, numerical_cols)

        # Split data
        X = df_processed[features]
        y = df_processed[target]

        # Encode target if categorical
        target_encoder = None
        if y.dtype == 'O':
            target_encoder = preprocessing.LabelEncoder()
            y = target_encoder.fit_transform(y)

        # Train-test split
        stratify = y if config['stratify'] and target_encoder else None
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
        accuracy = evaluate_model(y_test, predictions, config['problem_type'], features, model)

        return (
            feature_types,
            categorical_values,
            model,
            feature_encoder,
            scaler,
            target_encoder,
            accuracy
        )

    except Exception as e:
        traceback.print_exc()
        raise ValueError(f"Model training failed: {str(e)}")


def evaluate_model(y_test, prediction, problem_type, features, model):
    accuracy = {}
    
    if problem_type == 'classification':
        accuracy['accuracy_score'] = metrics.accuracy_score(y_test, prediction)
        accuracy['precision'] = metrics.precision_score(y_test, prediction, average='weighted')
        accuracy['recall'] = metrics.recall_score(y_test, prediction, average='weighted')
        accuracy['f1_score'] = metrics.f1_score(y_test, prediction, average='weighted')
        
        # Confusion matrix with labels
        unique_classes = sorted(np.unique(y_test))
        accuracy['confusion_matrix'] = {
            'matrix': metrics.confusion_matrix(y_test, prediction).tolist(),
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


# Remove outliers while maintaining alignment
def safe_remove_outliers(df, cols):
    for col in cols:
        q1 = df[col].quantile(0.25)
        q3 = df[col].quantile(0.75)
        iqr = q3 - q1
        lower_bound = q1 - (1.5 * iqr)
        upper_bound = q3 + (1.5 * iqr)
        df = df[(df[col] >= lower_bound) & (df[col] <= upper_bound)]
    return df
    

def load_model_and_predict(model_path, features, columns, encoder_path=None, scaler_path=None):
    try:
        print("\n=== PREDICTION DEBUG START ===")
        print(f"Input features: {features}")
        print(f"Expected columns: {columns}")
        
        # Load model components
        model = joblib.load(model_path)
        print("Model loaded successfully")
        
        # Load preprocessing objects if they exist
        scaler = joblib.load(scaler_path) if scaler_path else None
        encoder = joblib.load(encoder_path) if encoder_path else None
        
        # Create DataFrame with features in correct order
        input_df = pd.DataFrame([features], columns=columns)
        print("\nRaw input DataFrame:")
        print(input_df)
        
        # Apply preprocessing EXACTLY as done during training
        processed_df = input_df.copy()
        
        # 1. Handle missing values (same as training)
        for col in processed_df.select_dtypes(include=['float64', 'int64']):
            processed_df[col] = processed_df[col].fillna(processed_df[col].mean())
        
        for col in processed_df.select_dtypes(include=['object']):
            processed_df[col] = processed_df[col].fillna(processed_df[col].mode()[0])
        
        # 2. Apply encoding (if encoder exists)
        if encoder is not None:
            print("\nBefore encoding:")
            print(processed_df.select_dtypes(include=['object']).columns)
            
            for col in processed_df.select_dtypes(include=['object']):
                if col in columns:  # Only encode columns that were encoded during training
                    processed_df[col] = encoder.transform(processed_df[col])
            
            print("After encoding:")
            print(processed_df.head())
        
        # 3. Apply scaling (if scaler exists)
        if scaler is not None:
            print("\nBefore scaling:")
            print(processed_df.select_dtypes(include=['float64', 'int64']).head())
            
            numeric_cols = processed_df.select_dtypes(include=['float64', 'int64']).columns
            processed_df[numeric_cols] = scaler.transform(processed_df[numeric_cols])
            
            print("After scaling:")
            print(processed_df.head())
        
        # Convert to numpy array for prediction
        final_features = processed_df.values
        print("\nFinal features for prediction:")
        print(final_features)
        
        # Make prediction
        prediction = model.predict(final_features)
        print(f"\nRaw prediction: {prediction}")
        
        print("=== PREDICTION DEBUG END ===")
        return prediction
        
    except Exception as e:
        print(f"\n=== PREDICTION ERROR ===")
        print(f"Error during prediction: {str(e)}")
        print("=== PREDICTION ERROR ===")
        raise ValueError(f"Prediction failed: {str(e)}")