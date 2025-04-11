import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("interviewResults")) || [];
    setResults(stored);
  }, []);

  // Line chart data (score over time)
  const scoreData = results.map((res, index) => ({
    name: `#${index + 1}`,
    score: res.totalScore,
  }));

  // Pie chart data (category performance)
  const totalCategories = results.reduce(
    (acc, session) => {
      Object.entries(session.categories || {}).forEach(([key, value]) => {
        acc[key] = (acc[key] || 0) + value;
      });
      return acc;
    },
    {}
  );

  const pieData = Object.entries(totalCategories).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📊 Interview Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white shadow p-4 rounded-2xl">
          <h2 className="text-lg font-semibold mb-2">Score Over Time</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={scoreData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white shadow p-4 rounded-2xl">
          <h2 className="text-lg font-semibold mb-2">Category Breakdown</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
