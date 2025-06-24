import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { FaPlusCircle } from 'react-icons/fa';
import SurveyFormModal from '../../utils/Modals/SurveyFormModal';
import LibraryModal from '../../utils/Modals/LibraryModal';
import { useNavigate } from 'react-router-dom';

const API = 'https://your-backend-api.com'; // Replace with your backend base URL

export default function TemplateLibrary({ organizationId }) {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [cloning, setCloning] = useState(false);
  const [message, setMessage] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const navigate = useNavigate();
  
  

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const res = await api.get("/library");
        setTemplates(res.data);
      } catch (err) {
        console.error('Error loading templates', err);
      }
    }

    fetchTemplates();
  }, []);

  const cloneTemplate = async (templateId) => {
    setCloning(true);
    setMessage('');
    try {
      const res = await api.post(`/library/${templateId}/clone/${organizationId}`);
      setMessage(`Template cloned as survey: ${res.data.title}`);
    } catch (err) {
      console.error('Clone error', err);
      setMessage('Failed to clone template');
    } finally {
      setCloning(false);
    }
  };

 const handleView = (templateId) => {
    navigate(`/survey/${templateId}`);
  };


  const fetchDetails = async (templateId) => {
    try {
      const res = await api.get(`/library/${templateId}`);
      setSelectedTemplate(res.data);
    } catch (err) {
      console.error('Error fetching template details', err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Survey Templates</h2>
      <button
        onClick={() => setIsFormModalOpen(true)}
          className="bg-[#86BC24] text-white px-4 py-2 rounded font-medium"
      >
          Add New Surveys
        <FaPlusCircle className="ml-4 inline" />
    </button>


      {message && <p className="text-green-600 font-medium">{message}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div key={template.id} className="border p-4 rounded shadow">
            <h3 className="text-lg font-semibold">{template.title}</h3>
            <p className="text-sm text-gray-600">{template.description}</p>
            <div className="mt-2 space-x-2">
              <button
                onClick={() => handleView(template.id)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                View Details
              </button>
              <button
                onClick={() => cloneTemplate(template.id)}
                className="bg-green-600 text-white px-3 py-1 rounded"
                disabled={cloning}
              >
                {cloning ? 'Cloning...' : 'Use Template'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedTemplate && (
        <div className="mt-8 border p-4 rounded shadow">
          <h3 className="text-xl font-semibold">{selectedTemplate.title}</h3>
          <p className="mb-2 text-gray-600">{selectedTemplate.description}</p>
          <h4 className="text-lg font-medium mb-1">Questions:</h4>
          <ul className="list-disc ml-5 space-y-1">
            {selectedTemplate.questions.map((q, idx) => (
              <li key={q.id}>{idx + 1}. {q.question}</li>
            ))}
          </ul>
        </div>
      )}
      <LibraryModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
      />
    </div>
  );
}
