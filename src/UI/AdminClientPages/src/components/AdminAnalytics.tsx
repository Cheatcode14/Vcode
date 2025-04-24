import React from 'react';
import '../styles/AdminAnalytics.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import TopUsersTable from './TopUsersTable';

const AdminAnalytics: React.FC = () => {
  const topUsers = [
    { username: 'devDude42', submissions: 89 },
    { username: 'codeQueen', submissions: 75 },
    { username: 'algoSam', submissions: 66 },
    { username: 'debugDan', submissions: 61 },
    { username: 'uiNinja', submissions: 55 },
  ];

  const submissionTrends = [
    { date: 'Apr 1', submissions: 20 },
    { date: 'Apr 2', submissions: 45 },
    { date: 'Apr 3', submissions: 31 },
    { date: 'Apr 4', submissions: 50 },
    { date: 'Apr 5', submissions: 70 },
    { date: 'Apr 6', submissions: 40 },
    { date: 'Apr 7', submissions: 80 },
  ];

  const languageUsage = [
    { name: 'JavaScript', value: 400 },
    { name: 'Python', value: 300 },
    { name: 'C++', value: 200 },
    { name: 'Java', value: 100 },
  ];

  const pieColors = ['#00ff88', '#33ffaa', '#66ffcc', '#99ffee'];

  return (
    <div className="admin-analytics-container">
      <h1 className="admin-title">🛠️ Admin User Analytics</h1>

      {/* Top Users Section as a Separate Component */}
      <TopUsersTable users={topUsers} />

      {/* Submission Trends */}
      <section className="admin-section">
        <h2>📈 Submissions Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={submissionTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="date" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Line type="monotone" dataKey="submissions" stroke="#00ff88" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* Language Usage */}
      <section className="admin-section">
        <h2>💬 Language Usage</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={languageUsage}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label
            >
              {languageUsage.map((_, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
};

export default AdminAnalytics;
