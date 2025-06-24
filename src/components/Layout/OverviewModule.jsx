import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';
import Card from '../ui/card';
import CardContent from '../ui/CardContent';
import SummaryCard from '../ui/summarycard';
import api from '../../api/api';

export default function DashboardPage() {
  const [surveyStats, setSurveyStats] = useState({ totalSurveys: 0, totalResponses: 0 });
  const [barData, setBarData ] = useState([]);
  const [pieData, setPieData ] = useState([]);
  const [startDate, setStartDate] = useState(() => format(new Date(), 'yyyy-MM-01'));
  const [endDate, setEndDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [selectedOrg, setSelectedOrg] = useState('All');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/survey/dashboard', {
          params: { start: startDate, end: endDate }
        });
        setSurveyStats({
          totalSurveys: res.data.totalSurveys,
          totalResponses: res.data.totalResponses
        });
        setBarData(res.data.barData);
        setPieData([
          { name: 'Completed', value: res.data.completedCount || 0 },
          { name: 'Pending', value: res.data.activeCount || 0 },
        ]);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      }
    };

    fetchStats();
  }, [startDate, endDate]);

  // Extract unique organizations
  const organizations = ['All', ...new Set(barData.map(b => b.organization))];

  // Filter by selected organization
  const filteredData = selectedOrg === 'All'
    ? barData
    : barData.filter(b => b.organization === selectedOrg);

  // Group by organization for summary
  // const groupedByOrg = Object.values(
  //   barData.reduce((acc, curr) => {
  //     if (!acc[curr.organization]) {
  //       acc[curr.organization] = { name: curr.organization, responses: 0 };
  //     }
  //     acc[curr.organization].responses += curr.responses;
  //     return acc;
  //   }, {})
  // );


  return (
    <div className="px-4 py-6 space-y-6">
      {/* Date Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-sm">
          <CardContent className="flex flex-col gap-2">
            <label className="text-base font-medium text-gray-700">Start Date</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="ml-4 border p-2 rounded-md" />
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">End Date</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="ml-4 border p-2 rounded-md" />
          </CardContent>
        </Card>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard title="Total Surveys" value={surveyStats.totalSurveys} />
        <SummaryCard title="Total Responses" value={surveyStats.totalResponses} />
        <SummaryCard title="Completed" value={pieData[0]?.value || 0} />
        <SummaryCard title="Pending" value={pieData[1]?.value || 0} />
      </div>

      {/* Org Chart Selector */}
      <Card className="shadow-sm">
        <CardContent className="flex flex-col gap-2">
          <label className="text-base font-medium text-gray-700">Filter by Organization</label>
          <select value={selectedOrg} onChange={e => setSelectedOrg(e.target.value)} className="ml-4 border p-2 rounded-md w-full max-w-sm">
            {organizations.map(org => (
              <option key={org} value={org}>{org}</option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="shadow-md">
          <CardContent>
            <h2 className="text-lg font-semibold mb-4">Response Breakdown</h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={["#4ade80", "#f87171"][index % 2]} />
                  ))}
                </Pie>
                <Tooltip 
                    formatter={(value, name) => {
                      const total = pieData.reduce((sum, entry) => sum + entry.value, 0);
                      const percent = ((value / total) * 100).toFixed(1);
                      return [`${value} (${percent}%)`, name];
                    }}
                />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />              
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent>
            <h2 className="text-lg font-semibold mb-4">Responses per Survey ({selectedOrg})</h2>
            <div className="overflow-x-auto">
              <div style={{ width: Math.max(filteredData.length * 100, 600), height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="responses" fill="#60a5fa" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

