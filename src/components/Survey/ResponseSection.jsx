import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaAngleDoubleRight, FaDownload } from 'react-icons/fa';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];
const OPTION_TYPES = ['multiple-choice', 'checkbox', 'radio', 'dropdown'];

const ResponseSection = ({ surveyId }) => {
  const [responses, setResponses] = useState([]);
  const [surveyTitle, setSurveyTitle] = useState('responses');
  const [section, setSection] = useState(1);
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [questionList, setQuestionList] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

  useEffect(() => {
    if (!surveyId) return;
    const fetchData = async () => {
      try {
        const [resResponses, resSurvey] = await Promise.all([
          api.get(`/response/${surveyId}`),
          api.get(`/survey/${surveyId}`)
        ]);
        setResponses(resResponses.data);
        setSurveyTitle(resSurvey.data.title.replace(/\s+/g, '_'));

        const uniqueStaff = Array.from(
          new Map(resResponses.data.map(item => [item.staff.id, item.staff])).values()
        );
        setStaffList(uniqueStaff);

        const uniqueQuestions = Array.from(
          new Map(resResponses.data.map(item => [item.question.id, item.question])).values()
        );
        setQuestionList(uniqueQuestions);
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };
    fetchData();
  }, [surveyId]);

  const exportAll = () => {
    if (!responses.length) return;
    const headers = ['Question', 'Answer', 'Staff Email', 'Join Code', 'Date'];
    const rows = responses.map(r => [
      r.question.question,
      r.answer,
      r.staff.email,
      r.staff.joinCode,
      new Date(r.createdAt).toLocaleString()
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].map(e => e.join(',')).join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `${surveyTitle}_all_responses.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportResponses = (items, name) => {
    const headers = ['Question', 'Answer', 'Date', 'Email'];
    const rows = items.map(r => [r.question.question, r.answer, new Date(r.createdAt).toLocaleString(), r.staff.email]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].map(e => e.join(',')).join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `${name.replace(/\s+/g, '_')}_responses.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openStaffModal = staff => { setSelectedStaff(staff); setIsStaffModalOpen(true); };
  const closeStaffModal = () => { setIsStaffModalOpen(false); setSelectedStaff(null); };

  const openQuestionModal = question => { setSelectedQuestion(question); setIsQuestionModalOpen(true); };
  const closeQuestionModal = () => { setIsQuestionModalOpen(false); setSelectedQuestion(null); };

  const renderPieChart = questionId => {
    const relevant = responses.filter(r => r.question.id === questionId && OPTION_TYPES.includes(r.question.type));
    if (!relevant.length) return null;
    const counts = {};
    relevant.forEach(r => { counts[r.answer] = (counts[r.answer] || 0) + 1; });
    const data = Object.entries(counts).map(([name, value]) => ({ name, value }));
    return (
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={80} label>
            {data.map((entry, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  return (
    <section className="px-4 py-6 bg-slate-50">
<div className="flex flex-auto sm:flex-row bg-slate-00 sm:items-center justify-between mb-6">
  <div className="flex flex-wrap gap-2 sm:gap-4">
    <button
      onClick={() => setSection(1)}
      className={`px-4 py-2 rounded font-medium hover:bg-[#86bc23]/50 ${
        section === 1 ? 'bg-[#86BC23] text-white' : 'bg-[#86BC23]/40'
      }`}
    >
      Questions
    </button>
    <button
      onClick={() => setSection(2)}
      className={`px-4 py-2 rounded font-medium hover:bg-[#86bc23]/50 ${
        section === 2 ? 'bg-[#86BC23] text-white' : 'bg-[#86BC23]/40'
      }`}
    >
      By Staff
    </button>
    <button
      onClick={() => setSection(3)}
      className={`px-3 py-2 rounded font-medium hover:bg-[#86bc23]/50 ${
        section === 3 ? 'bg-[#86BC23] text-white' : 'bg-[#86BC23]/40'
      }`}
    >
      Insights
    </button>
    <button
      onClick={exportAll}
      className="flex items-center justify-center gap-2 px-4 py-2 bg-[#86BC23]/40 font-medium hover:text-white rounded hover:bg-[#86BC23]"
      >
      <FaDownload /><span className='hidden sm:inline'>Download All</span>
    </button>
    </div>
    </div>
      {/* Section 1: Questions */}
      {section === 1 && (
        <div className="space-y-2 bg-white p-4 rounded shadow-md">
          {questionList.map(q => (
            <button
              key={q.id}
              onClick={() => openQuestionModal(q)}
              className="w-full text-left px-4 py-2 text-base font-medium bg-gray-100 rounded hover:bg-gray-200"
            >
              {q.question}
            </button>
          ))}

          {isQuestionModalOpen && selectedQuestion && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center ">
              <div className="bg-white rounded-lg p-6 shadow-xl max-w-lg w-full mx-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">{selectedQuestion.question}</h2>
                <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
                  {responses.filter(r => r.question.id === selectedQuestion.id).map((r, i) => (
                    <div key={i} className="border-b pb-2">
                      <p className="text-gray-800">{r.answer}</p>
                      <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleString()}</p>
                      <p className="text-xs text-gray-400">{r.staff.email}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => exportResponses(responses.filter(r => r.question.id === selectedQuestion.id), selectedQuestion.question)} className="flex items-center gap-2 px-3 py-1 bg-[#86BC23]/70 text-white rounded hover:bg-[#86BC23]">
                    <FaDownload /> Download
                  </button>
                  <button onClick={closeQuestionModal} className="px-3 py-1 bg-slate-300 text-white rounded hover:bg-[#86BC23]">Close</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Section 2: Staff */}
      {section === 2 && (
        <div className=''>
          <h3 className="font-bold mb-3">Staff Respondents</h3>
          <ul className="space-y-2">
            {staffList.map(staff => (
              <li key={staff.id}>
                <button
                  onClick={() => openStaffModal(staff)}
                  className="w-full flex items-center gap-4 text-left px-3 py-2 bg-gray-100 rounded hover:bg-gray-200"
                >
                  <FaAngleDoubleRight /> {staff.fullName || staff.email}
                </button>
              </li>
            ))}
          </ul>

          {isStaffModalOpen && selectedStaff && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 shadow-xl max-w-lg w-full mx-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Responses: {selectedStaff.fullName || selectedStaff.email}</h2>
                <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
                  {responses.filter(r => r.staff.id === selectedStaff.id).map((r, i) => (
                    <div key={i} className="border-b pb-2">
                      <p className="font-semibold">{r.question.question}</p>
                      <p>{r.answer}</p>
                      <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => exportResponses(responses.filter(r => r.staff.id === selectedStaff.id), selectedStaff.fullName || selectedStaff.email)} className="flex items-center gap-2 px-3 py-1 bg-[#86bc23]/40 text-white rounded hover:bg-[#86bc23]">
                    <FaDownload /> Download
                  </button>
                  <button onClick={closeStaffModal} className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500">Close</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Section 3: Insights */}
      {section === 3 && (
        <div className="space-y-6">
          {questionList.map((q, idx) => (
            <div key={idx} className="p-4 bg-white shadow rounded">
              <h4 className="font-semibold mb-2">{q.question}</h4>
              {OPTION_TYPES.includes(q.type)
                ? renderPieChart(q.id)
                : (
                  <ul className="space-y-1">
                    {responses.filter(r => r.question.id === q.id).map((r, j) => (
                      <li key={j} className="text-sm text-gray-600">{r.answer}</li>
                    ))}
                  </ul>
                )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ResponseSection;
