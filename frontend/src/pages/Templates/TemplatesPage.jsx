import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  MdSearch as SearchIcon,
  MdFilterList as FilterIcon,
  MdInfo as InfoIcon,
  MdCode as CodeIcon,
  MdPlayCircleFilled as UseTemplateIcon,
  MdStar as StarIcon,
  MdStarBorder as StarBorderIcon
} from 'react-icons/md';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';



const TemplatesPage = () => {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    difficulty: 'all'
  });
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Fetch templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get('/api/templates');
        setTemplates(response.data);
        setFilteredTemplates(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching templates:', error);
        setError('Failed to load templates');
        setLoading(false);
      }
    };
    fetchTemplates();

    // Load favorites from localStorage
    const savedFavorites = JSON.parse(localStorage.getItem('templateFavorites')) || [];
    setFavorites(savedFavorites);
  }, []);

  // Apply search and filters
  useEffect(() => {
    let results = templates;
    
    // Apply search
    if (searchTerm) {
      results = results.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply category filter
    if (filters.category !== 'all') {
      results = results.filter(template => template.category === filters.category);
    }
    
    // Apply difficulty filter
    if (filters.difficulty !== 'all') {
      results = results.filter(template => template.difficulty === filters.difficulty);
    }
    
    setFilteredTemplates(results);
  }, [searchTerm, filters, templates]);

  const toggleFavorite = (templateId) => {
    const newFavorites = favorites.includes(templateId)
      ? favorites.filter(id => id !== templateId)
      : [...favorites, templateId];
    
    setFavorites(newFavorites);
    localStorage.setItem('templateFavorites', JSON.stringify(newFavorites));
  };

  const useTemplate = (templateId) => {
    // Logic to implement template in playground
    console.log('Using template:', templateId);
    // This would typically redirect to playground with template pre-loaded
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (selectedTemplate) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <button 
              onClick={() => setSelectedTemplate(null)}
              className="mb-6 flex items-center text-primary-600 hover:text-primary-800"
            >
              ← Back to all templates
            </button>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{selectedTemplate.name}</h2>
                    <div className="flex items-center mt-2 space-x-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedTemplate.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                        selectedTemplate.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedTemplate.difficulty}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {selectedTemplate.category}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFavorite(selectedTemplate.id)}
                    className="text-yellow-500 hover:text-yellow-600"
                  >
                    {favorites.includes(selectedTemplate.id) ? (
                      <StarIcon size={24} />
                    ) : (
                      <StarBorderIcon size={24} />
                    )}
                  </button>
                </div>
                
                <p className="mt-4 text-gray-600">{selectedTemplate.description}</p>
                
                <div className="mt-6">
                  <h3 className="font-medium text-gray-900">Features</h3>
                  <ul className="mt-2 list-disc list-inside space-y-1">
                    {selectedTemplate.features.map((feature, index) => (
                      <li key={index} className="text-gray-600">{feature}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium text-gray-900">Recommended For</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedTemplate.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => useTemplate(selectedTemplate.id)}
                    className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    <UseTemplateIcon className="mr-2" />
                    Use This Template
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ML Templates</h1>
            <p className="text-lg text-gray-600">
              Jumpstart your projects with our pre-built machine learning templates
            </p>
          </div>
          
          <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search templates..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-4">
              <div className="relative">
                <select
                  className="appearance-none bg-white pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                >
                  <option value="all">All Categories</option>
                  <option value="classification">Classification</option>
                  <option value="regression">Regression</option>
                  <option value="clustering">Clustering</option>
                  <option value="nlp">NLP</option>
                  <option value="computer-vision">Computer Vision</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <FilterIcon className="text-gray-400" />
                </div>
              </div>
              
              <div className="relative">
                <select
                  className="appearance-none bg-white pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={filters.difficulty}
                  onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <FilterIcon className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          
          {filteredTemplates.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                <InfoIcon className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No templates found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map(template => (
                <div 
                  key={template.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                        <p className="mt-1 text-sm text-gray-500">{template.short_description}</p>
                      </div>
                      <button
                        onClick={() => toggleFavorite(template.id)}
                        className="text-yellow-500 hover:text-yellow-600"
                      >
                        {favorites.includes(template.id) ? (
                          <StarIcon />
                        ) : (
                          <StarBorderIcon />
                        )}
                      </button>
                    </div>
                    
                    <div className="mt-4 flex items-center space-x-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        template.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                        template.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {template.difficulty}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {template.category}
                      </span>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      {template.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                      {template.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                          +{template.tags.length - 3}
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-6 flex justify-between items-center">
                      <button
                        onClick={() => setSelectedTemplate(template)}
                        className="flex items-center text-primary-600 hover:text-primary-800 text-sm"
                      >
                        <InfoIcon className="mr-1" /> Details
                      </button>
                      <button
                        onClick={() => useTemplate(template.id)}
                        className="flex items-center px-3 py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm"
                      >
                        <UseTemplateIcon className="mr-1" /> Use
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TemplatesPage;