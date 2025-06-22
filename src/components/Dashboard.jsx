import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [aptitudeResults, setAptitudeResults] = useState([]);

  useEffect(() => {
    const aptitudeData = JSON.parse(localStorage.getItem("aptitudeResults")) || [];
    setAptitudeResults(aptitudeData);
  }, []);

  const handleClear = () => {
    localStorage.removeItem("aptitudeResults");
    setAptitudeResults([]);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">🧠 Aptitude Test Dashboard</h1>

      <div className="bg-white shadow p-4 rounded-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Results</h2>
          {aptitudeResults.length > 0 && (
            <button
              onClick={handleClear}
              className="px-4 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium"
            >
              Clear Data 🗑️
            </button>
          )}
        </div>

        {aptitudeResults.length === 0 ? (
          <p className="text-gray-600">No aptitude tests taken yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="py-2 px-4 border">#</th>
                  <th className="py-2 px-4 border">Date</th>
                  <th className="py-2 px-4 border">Score</th>
                  <th className="py-2 px-4 border">Total</th>
                </tr>
              </thead>
              <tbody>
                {aptitudeResults.map((res, i) => (
                  <tr key={i} className="border-t">
                    <td className="py-2 px-4 border">{i + 1}</td>
                    <td className="py-2 px-4 border">{res.date}</td>
                    <td className="py-2 px-4 border font-semibold">{res.score}</td>
                    <td className="py-2 px-4 border">{res.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
