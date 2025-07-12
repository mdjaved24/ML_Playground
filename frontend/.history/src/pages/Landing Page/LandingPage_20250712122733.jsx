// src/App.jsx
import React from 'react';
import '../../styles/colors.css';
import { Link } from 'react-router-dom';


function App() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {/* Navigation */}
      <nav className="gradient-header text-white shadow-lg sticky top-0 z-50 full-width">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center max-w-7xl mx-auto">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-md bg-white flex items-center justify-center glow-effect">
                <svg className="h-5 w-5 text-[var(--color-primary-600)]" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12,2L1,12H4V22H20V12H23M11,15V18H13V15M15,15V18H17V15M7,15V18H9V15Z" />
                </svg>
              </div>
              <span className="ml-2 text-xl font-bold">ML Playground</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="hover:text-[var(--color-secondary-300)] transition">Features</a>
              <a href="#how-it-works" className="hover:text-[var(--color-secondary-300)] transition">How it Works</a>
              <Link to='/login'><button className="btn-accent px-4 py-2 rounded-md transition glow-effect hover:cursor-pointer">
                Login
              </button></Link>
              <button className="btn-accent px-4 py-2 rounded-md transition glow-effect hover:cursor-pointer">
                Sign up
              </button>
            </div>
            <button className="md:hidden text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="gradient-bg py-20 full-width">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-gray-900)] mb-6">
                Your No-Code <span className="gradient-text">ML Playground</span>
              </h1>
              <p className="text-lg text-[var(--color-gray-600)] mb-8 max-w-lg">
                Train, evaluate, and deploy machine learning models without writing code. Perfect for data scientists, analysts, and ML enthusiasts.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to='/login'><button className="btn-primary px-6 py-3 rounded-lg transition glow-effect hover:cursor-pointer">
                  Play Now
                </button></Link>
                {/* <button className="border border-[var(--color-primary-600)] text-[var(--color-primary-600)] px-6 py-3 rounded-lg hover:bg-[var(--color-primary-50)] transition">
                  Watch Demo
                </button> */}
              </div>
              <div className="mt-8 flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((item) => (
                    <img 
                      key={item}
                      src={`https://i.pravatar.cc/150?img=${item}`}
                      alt="User"
                      className="h-10 w-10 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
                <p className="text-sm text-[var(--color-gray-600)]">
                  Used by <span className="font-semibold">500+</span> professionals
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-[var(--color-gray-800)] p-1 rounded-xl shadow-2xl">
                <div className="h-64 bg-gradient-to-br from-[var(--color-primary-800)] to-[var(--color-accent-500)] rounded-lg flex items-center justify-center">
                  <div className="text-center p-4 text-white">
                    <div className="text-5xl mb-4">📊</div>
                    <p className="font-medium">Visual ML Model Builder</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-3 rounded-lg shadow-md border border-[var(--color-gray-200)]">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full mr-2 bg-[var(--color-secondary-400)] animate-pulse"></div>
                  <span className="text-sm font-medium text-[var(--color-gray-700)]">Model Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     {/* Features Section */}
<section id="features" className="py-20 bg-white full-width">
  <div className="mx-auto px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-[var(--color-gray-900)] mb-4">
          Simple Yet Powerful <span className="gradient-text">Features</span>
        </h2>
        <p className="text-lg text-[var(--color-gray-600)]">
          Everything you need to start working with machine learning, no coding required
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8 hover:cursor-pointer">
        {[
          {
            icon: "📂",
            title: "Easy Data Upload",
            desc: "Simply drag and drop your Excel or CSV files to get started",
            color: "var(--color-primary-500)"
          },
          {
            icon: "🤖", 
            title: "Smart Model Suggestions",
            desc: "Get recommended model types based on your dataset characteristics",
            color: "var(--color-accent-500)"
          },
          {
            icon: "⚡",
            title: "One-Click Training",
            desc: "Train models with recommended settings based on your data",
            color: "var(--color-secondary-500)"
          },
          {
            icon: "📝",
            title: "Performance Reports",
            desc: "Check model accuracy and get clear insights about predictions",
            color: "var(--color-primary-400)"
          },
          {
            icon: "✔️",
            title: "Simple Model Comparison",
            desc: "Easily compare different models to find the best one",
            color: "var(--color-secondary-400)"
          },
          {
            icon: "💾",
            title: "Save & Share",
            desc: "Save your work and share results with teammates",
            color: "var(--color-accent-400)"
          }
        ].map((feature, index) => (
          <div key={index} className="bg-[var(--color-gray-50)] p-8 rounded-xl hover:shadow-lg transition border border-[var(--color-gray-200)] hover:border-[var(--color-primary-300)]">
            <div className="text-4xl mb-4" style={{ color: feature.color }}>{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-[var(--color-gray-900)]">{feature.title}</h3>
            <p className="text-[var(--color-gray-600)]">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

     {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-[var(--color-gray-800)] text-white full-width">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">
                How <span className="text-[var(--color-secondary-400)]">ML Playground</span> Works
              </h2>
              <p className="text-lg text-[var(--color-gray-400)]">
                Go from raw data to trained models in four simple steps
              </p>
            </div>

             <div className="grid md:grid-cols-4 gap-8 hover:cursor-pointer">
              {[
                {
                  title: "Upload Data",
                  desc: "Import your CSV, Excel, or connect to databases",
                  icon: "📤",
                  step: "1"
                },
                {
                  title: "Preprocess",
                  desc: "Clean, transform, and prepare your data",
                  icon: "🧹",
                  step: "2"
                },
                {
                  title: "Train Models",
                  desc: "Configure and train multiple ML models",
                  icon: "⚙️",
                  step: "3"
                },
                {
                  title: "Deploy & Use",
                  desc: "Download models or use them directly in the platform",
                  icon: "🚀",
                  step: "4"
                }
              ].map((step, index) => (
                <div key={index} className="relative group">
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 h-12 w-12 rounded-full flex items-center justify-center bg-[var(--color-accent-500)] text-white font-bold text-xl group-hover:bg-[var(--color-secondary-500)] transition glow-effect">
                    {step.icon}
                  </div>
                  <div className="bg-[var(--color-gray-700)] p-8 rounded-xl h-full border-t-4 border-[var(--color-accent-500)] group-hover:border-[var(--color-secondary-500)] transition">
                    <div className="text-sm font-mono text-[var(--color-secondary-400)] mb-2">STEP {step.step}</div>
                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-[var(--color-gray-300)]">{step.desc}</p>
                  </div>
                </div>
                 ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-header text-white full-width">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Building ML Models?</h2>
            <p className="text-xl text-[var(--color-primary-200)] mb-8">
              Understand the flow of Machine Learning by using ML Playground today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to='/login'><button className="btn-secondary px-8 py-4 rounded-lg font-bold hover:shadow-lg transition hover:cursor-pointer">
                Play Now
              </button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--color-gray-900)] text-[var(--color-gray-300)] full-width">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-5 gap-12">
              <div className="md:col-span-2">
                <h3 className="text-xl font-bold text-white mb-4">ML Playground</h3>
                <p className="mb-6">
                  The no-code platform for building and deploying machine learning models.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-[var(--color-primary-400)] hover:text-[var(--color-primary-300)]">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-[var(--color-primary-400)] hover:text-[var(--color-primary-300)]">
                    <span className="sr-only">GitHub</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-4">Product</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white transition">Features</a></li>
                  <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                  <li><a href="#" className="hover:text-white transition">Examples</a></li>
                  <li><a href="#" className="hover:text-white transition">Roadmap</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                  <li><a href="#" className="hover:text-white transition">Tutorials</a></li>
                  <li><a href="#" className="hover:text-white transition">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition">Community</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white transition">About</a></li>
                  <li><a href="#" className="hover:text-white transition">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                  <li><a href="#" className="hover:text-white transition">Terms</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-[var(--color-gray-800)] mt-12 pt-8 text-center">
              <p>© {new Date().getFullYear()} ML Playground. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;