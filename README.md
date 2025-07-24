<h1 align="center">🧠 ML Playground</h1>

<p align="center">
  <strong>ML Playground</strong> is an intuitive, full-stack web application that empowers users to <strong>build, train, evaluate, visualize, and download machine learning models</strong> — all through an interactive UI and <strong>without writing a single line of code</strong>.
</p>

<p align="center">
  <a href="https://ml-playground-bice.vercel.app/" target="_blank">🔗 Live Demo</a><br>
</p>

<hr />

<h2>🚀 Tech Stack</h2>
<ul>
  <li><strong>Backend:</strong> Django, Django REST Framework, PostgreSQL</li>
  <li><strong>Frontend:</strong> React (Vite)</li>
  <li><strong>Storage:</strong> Backblaze B2</li>
  <li><strong>ML Libraries:</strong> scikit-learn, pandas, numpy, joblib</li>
</ul>

<h2>🎯 Purpose</h2>
<p>
  The goal of <strong>ML Playground</strong> is to simplify the learning and experimentation process in machine learning.
  It serves as an educational tool where users can explore how different preprocessing techniques, algorithms, and parameter combinations influence model accuracy and performance — all visually and hands-on.
</p>

<hr />

<h2>🧠 Key Features</h2>
<ul>
  <li><strong>No Code ML</strong>: Upload CSV datasets and configure training pipelines with scalers, encoders, features, targets, and models via forms</li>
  <li><strong>Data Preprocessing</strong>: Auto-handles missing values, outliers, and encoding internally</li>
  <li><strong>Model Training</strong>: Select algorithm, adjust parameters, train the model, and view results instantly</li>
  <li><strong>Model Management</strong>: Save, download (as .zip with all components), or delete trained models</li>
  <li><strong>Live Predictions</strong>: Make real-time predictions with custom input on saved models</li>
  <li><strong>Dashboard</strong>: Track models created, accuracy trends, and frequently used algorithms</li>
  <li><strong>Learn Page</strong>: Embedded documentation to help beginners understand core ML concepts</li>
</ul>

<h2>🧪 Planned Enhancements</h2>
<ul>
  <li>AutoML recommendations based on dataset heuristics</li>
  <li>Team collaboration support</li>
  <li>Model version tracking and rollback</li>
  <li>Export to Jupyter notebooks</li>
  <li>Pipeline comparison charts</li>
</ul>

<hr />

<h2>🗂️ Project Structure</h2>

<h3>Backend (<code>backend/</code>)</h3>
<pre>
backend/
├── backend/                   # Django project configuration
│   ├── settings.py
│   └── urls.py
├── backend_app/
│   ├── users/
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── serializers.py
│   ├── files/
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── serializers.py
│   ├── models.py
│   └── admin.py
└── media/
    ├── uploads/
    ├── saved_models/
    ├── saved_encoders/
    ├── saved_scalers/
    └── saved_target_encoders/
</pre>

<h3>Frontend (<code>frontend/</code>)</h3>
<pre>
frontend/
└── src/
    ├── assets/
    ├── modals/
    ├── components/
    ├── pages/
    ├── styles/
    ├── App.jsx
    └── ProtectedRoute.jsx
</pre>

<hr />

<h2>📦 Backend Setup</h2>
<ol>
  <li>Clone the repository:
    <pre><code>git clone &lt;your-repo-url&gt;
cd backend</code></pre>
  </li>
  <li>Create a virtual environment:
    <pre><code>python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate</code></pre>
  </li>
  <li>Install dependencies:
    <pre><code>pip install -r requirements.txt</code></pre>
  </li>
  <li>Run migrations and create a superuser:
    <pre><code>python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser</code></pre>
  </li>
  <li>Start the server:
    <pre><code>python manage.py runserver</code></pre>
  </li>
</ol>

<h2>💻 Frontend Setup</h2>
<ol>
  <li>Navigate to frontend:
    <pre><code>cd frontend</code></pre>
  </li>
  <li>Install dependencies:
    <pre><code>npm install</code></pre>
  </li>
  <li>Run the app locally:
    <pre><code>npm run dev</code></pre>
  </li>
</ol>

<hr />

<h2>🔐 Authentication Endpoints</h2>
<table>
  <thead>
    <tr><th>Method</th><th>Endpoint</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td>POST</td><td><code>/api/token/</code></td><td>Get access & refresh token</td></tr>
    <tr><td>POST</td><td><code>/api/token/refresh/</code></td><td>Refresh access token</td></tr>
    <tr><td>POST</td><td><code>/login/</code></td><td>Custom login view</td></tr>
    <tr><td>POST</td><td><code>/logout/</code></td><td>Logout</td></tr>
    <tr><td>POST</td><td><code>/register/</code></td><td>User registration</td></tr>
    <tr><td>GET</td><td><code>/profile/</code></td><td>Get user profile</td></tr>
    <tr><td>GET</td><td><code>/secret-questions/</code></td><td>List of secret questions</td></tr>
    <tr><td>POST</td><td><code>/verify-secret-answer/&lt;username&gt;/</code></td><td>Verify answer</td></tr>
    <tr><td>POST</td><td><code>/password-reset-request/</code></td><td>Request password reset</td></tr>
    <tr><td>POST</td><td><code>/reset-password/&lt;username&gt;/</code></td><td>Set new password</td></tr>
    <tr><td>POST</td><td><code>/change-password/</code></td><td>Change password</td></tr>
    <tr><td>GET</td><td><code>/user-secret-question/&lt;username&gt;/</code></td><td>Get user's secret question</td></tr>
  </tbody>
</table>

<h2>📊 ML & Dataset Endpoints</h2>
<table>
  <thead>
    <tr><th>Method</th><th>Endpoint</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td>POST</td><td><code>/upload/</code></td><td>Upload dataset</td></tr>
    <tr><td>GET</td><td><code>/dataset-preview/</code></td><td>Preview dataset structure</td></tr>
    <tr><td>POST</td><td><code>/train/</code></td><td>Train a model</td></tr>
    <tr><td>POST</td><td><code>/save/</code></td><td>Save trained model</td></tr>
    <tr><td>GET</td><td><code>/saved-model/&lt;pk&gt;/</code></td><td>Get model details</td></tr>
    <tr><td>GET</td><td><code>/download-model/&lt;pk&gt;/</code></td><td>Download model ZIP</td></tr>
    <tr><td>POST</td><td><code>/predict/&lt;pk&gt;/</code></td><td>Make prediction</td></tr>
    <tr><td>GET</td><td><code>/dashboard-stats/</code></td><td>User dashboard data</td></tr>
  </tbody>
</table>

<hr />

<h2>👤 Author</h2>
<ul>
  <li><strong>Name:</strong> Md Javed</li>
  <li><strong>Email:</strong> <a href="mailto:your.email@example.com">mdjav077@gmail.com</a></li>
  <li><strong>LinkedIn:</strong> <a href="https://linkedin.com/in/your-profile" target="_blank">www.linkedin.com/in/mdjaved077/</a></li>
</ul>

<h2>📄 License</h2>
<p>
  This project is <strong>currently not licensed</strong>. You may use and modify it for educational or personal projects, but commercial use is not permitted unless granted explicit permission by the author.
</p>

<hr />

<p align="center">✨ Built with passion to make Machine Learning accessible and intuitive ✨</p>
