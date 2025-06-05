import pandas as pd
import numpy as np
from sklearn import preprocessing
from sklearn import model_selection
from sklearn import linear_model
from sklearn import neighbors
from sklearn import tree
from sklearn import ensemble
from sklearn import metrics
import joblib


def read_file(file_path):
    extension = file_path.split('.')[-1]

    if extension == 'csv':
        df = pd.read_csv(file_path,nrows=3000)

    elif extension in ['xls', 'xlsx']:
        df = pd.read_excel(file_path,nrows=3000)
    else:
        raise ValueError("Unsupported file format. Only CSV, XLS, and XLSX files are allowed.")

    return df


def preprocess_and_train(df,config):

    global encoder, scaler, model 
    # global scaler
    if config['encoder'] == 'LabelEncoder':
        encoder = preprocessing.LabelEncoder()

    elif config['encoder'] == 'OneHotEncoder':
        encoder = preprocessing.OneHotEncoder()

    if config['scaler'] == 'StandardScaler':
        scaler = preprocessing.StandardScaler()

    if config['scaler'] == 'MinMaxScaler':
        scaler = preprocessing.MinMaxScaler()

    for i in df.select_dtypes(exclude=object):
        df[i] = df[i].fillna(value=(df[i].mean()))

    for i in df.select_dtypes(include=object):
        df[i] = df[i].fillna(value=(df[i].mode()[0]))
        # df[i] = encoder.fit_transform(df[i])

    df = remove_outliers(df)

    X = df.loc[:,config['features']]
    y = df[config['target']]

    #Encoding
    for i in X.select_dtypes(include=object):
        X[i] = encoder.fit_transform(X[i])
        
    # Scaling
    X_scaled = scaler.fit_transform(X)

    X_train,X_test,y_train,y_test = model_selection.train_test_split(X_scaled,y,test_size=config['test_size'],random_state=config['random_state'])
    
    if config['model_type'] == 'LinearRegression':
        model = linear_model.LinearRegression()

    if config['model_type'] == 'LogisticRegression':
        model = linear_model.LogisticRegression()

    if config['model_type'] == 'KNeighborsRegressor':
        model = neighbors.KNeighborsRegressor()
    
    if config['model_type'] == 'KNeighborsClassifier':
        model = neighbors.KNeighborsClassifier()

    if config['model_type'] == 'DecisionTreeRegressor':
        model = tree.DecisionTreeRegressor()

    if config['model_type'] == 'DecisionTreeClassifier':
        model = tree.DecisionTreeClassifier()
    
    if config['model_type'] == 'RandomForestRegressor':
        model = ensemble.RandomForestRegressor()

    if config['model_type'] == 'RandomForestClassifier':
        model = ensemble.RandomForestClassifier()

    model.fit(X_train,y_train)

    prediction = model.predict(X_test)
    accuracy = {}
    if str(y.dtypes) == 'object':
        accuracy['accuracy_score'] = metrics.accuracy_score(y_test, prediction)

    elif str(y.dtypes) != 'object':
        accuracy['mean_squared_error'] = metrics.mean_squared_error(y_test,prediction)

    return model, encoder, scaler, accuracy



# Remove outliers - 
def remove_outliers(df):
    for i in range(4):
        for i in df.select_dtypes(exclude=object):
                q1 = df[i].quantile(0.25)
                q3 = df[i].quantile(0.75)
                iqr = q3-q1
                lower = q1 - (1.5*iqr)
                upper = q3 + (1.5*iqr)
        
                outlier = df[(df[i]<lower) | (df[i]>upper)]
                df.loc[outlier.index, i] = df[i].mean()

    return df


def load_model_and_predict(model_file, features, columns, encoder_file, scaler_file):
    try:
        # Debug print inputs
        print("\n=== DEBUG START ===")
        print(f"Features received: {features}")
        print(f"Columns expected: {columns}")
        
        # Load all components with error handling
        try:
            with model_file.open('rb') as f:
                loaded_model = joblib.load(f)
            print("Model loaded successfully")
        except Exception as e:
            print(f"Model loading failed: {str(e)}")
            raise ValueError(f"Model loading error: {str(e)}")
        
        try:
            with scaler_file.open('rb') as f:
                loaded_scaler = joblib.load(f)
            print("Scaler loaded successfully")
            print(f"Scaler expects {loaded_scaler.n_features_in_} features")
        except Exception as e:
            print(f"Scaler loading failed: {str(e)}")
            raise ValueError(f"Scaler loading error: {str(e)}")
        
        try:
            with encoder_file.open('rb') as f:
                loaded_encoder = joblib.load(f)
            print("Encoder loaded successfully")
        except Exception as e:
            print(f"Encoder loading failed: {str(e)}")
            raise ValueError(f"Encoder loading error: {str(e)}")
        
        # Validate feature dimensions
        features_np = np.array(features).reshape(1, -1)
        print(f"Input features shape: {features_np.shape}")
        
        if features_np.shape[1] != loaded_scaler.n_features_in_:
            error_msg = f"Feature dimension mismatch. Scaler expects {loaded_scaler.n_features_in_}, got {features_np.shape[1]}"
            print(error_msg)
            raise ValueError(error_msg)
        
        # Scale features
        try:
            scaled_features = loaded_scaler.transform(features_np)
            print("Features scaled successfully")
        except Exception as e:
            print(f"Feature scaling failed: {str(e)}")
            raise ValueError(f"Scaling error: {str(e)}")
        
        # Make prediction
        try:
            prediction = loaded_model.predict(scaled_features)
            print(f"Raw prediction output: {prediction}")
            
            # Convert prediction to string output
            if isinstance(prediction, np.ndarray):
                prediction = prediction.tolist()
            
            if isinstance(prediction, list):
                if len(prediction) == 1:
                    return str(prediction[0])
                return ', '.join(map(str, prediction))
            return str(prediction)
            
        except Exception as e:
            print(f"Prediction failed: {str(e)}")
            raise ValueError(f"Prediction error: {str(e)}")
            
    except Exception as e:
        print("\n=== DEBUG END ===")
        raise  # Re-raise the exception with full context