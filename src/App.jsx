import { useState } from "react";
import axios from "axios";
import MockInterview from "./components/MockInterview";
import Dashboard from "./components/Dashboard";

function App() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setReply("");

    try {
      const res = await axios.post("http://localhost:5000/api/ai/interview", {
        message,
      });

      setReply(res.data.reply);

      const result = {
        date: new Date().toISOString(),
        totalScore: Math.floor(Math.random() * 10) + 1,
        totalQuestions: 10,
        timeTaken: Math.floor(Math.random() * 200) + 60,
        categories: {
          technical: Math.floor(Math.random() * 7),
          behavioral: Math.floor(Math.random() * 4),
        },
      };

      const prevResults = JSON.parse(localStorage.getItem("interviewResults")) || [];
      localStorage.setItem("interviewResults", JSON.stringify([...prevResults, result]));
    } catch (err) {
      console.error(err);
      setReply("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 🫧 Bubble Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="bubble bubble1"></div>
        <div className="bubble bubble2"></div>
        <div className="bubble bubble3"></div>
        <div className="bubble bubble4"></div>
        <div className="bubble bubble5"></div>
      </div>

      {/* App UI */}
      <div className="flex justify-center mb-4">
  <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-blue-500 to-purple-500 animate-shine">
    HireHelper
  </h1>
</div>

      <div className="relative z-10 p-4">
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowDashboard(false)}
            className={`px-4 py-2 font-semibold rounded-l-xl shadow-md transition duration-300 ${
              !showDashboard ? "bg-blue-600 text-white" : "bg-white border"
            }`}
          >
            AI Assistant
          </button>
          <button
            onClick={() => setShowDashboard(true)}
            className={`px-4 py-2 font-semibold rounded-r-xl shadow-md transition duration-300 ${
              showDashboard ? "bg-blue-600 text-white" : "bg-white border"
            }`}
          >
            Dashboard
          </button>
        </div>

        {showDashboard ? (
          <Dashboard />
        ) : (
          <div className="flex items-center justify-center">
            <MockInterview />
          </div>
        )}
      </div>

      {/* 🧬 Bubble CSS */}
      <style>{`
        .bubble {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
          opacity: 0.3;
          animation: float 5s infinite ease-in-out;
          mix-blend-mode: screen;
        }

        .bubble1 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, #00f0ff, #0011ff);
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .bubble2 {
          width: 250px;
          height: 250px;
          background: radial-gradient(circle, #ff4c98, #ff0080);
          top: 30%;
          left: 70%;
          animation-delay: 5s;
        }

        .bubble3 {
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, #ffe600, #ffaa00);
          top: 60%;
          left: 20%;
          animation-delay: 10s;
        }

        .bubble4 {
          width: 180px;
          height: 180px;
          background: radial-gradient(circle, #8b5cf6, #4f46e5);
          top: 75%;
          left: 80%;
          animation-delay: 15s;
        }

        .bubble5 {
          width: 220px;
          height: 220px;
          background: radial-gradient(circle, #00ff9d, #00c76b);
          top: 50%;
          left: 45%;
          animation-delay: 2s;
        }

        @keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0) scale(1);
  }
  25% {
    transform: translateY(-20px) translateX(30px) scale(1.05);
  }
  50% {
    transform: translateY(-40px) translateX(60px) scale(1.1);
  }
  75% {
    transform: translateY(-20px) translateX(30px) scale(1.05);
  }
}

      `}</style>
    </div>
  );
}

export default App;
