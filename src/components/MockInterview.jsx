import { useState, useEffect } from "react";
import axios from "axios";

function MockInterview() {
  const [role, setRole] = useState("");
  const [level, setLevel] = useState("Intermediate");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [step, setStep] = useState("select");
  const [loading, setLoading] = useState(false);


  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = "en-US";

      recog.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setAnswer((prev) => prev + " " + transcript);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      setRecognition(recog);
    } else {
      console.error("SpeechRecognition not supported in this browser.");
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const askQuestion = async () => {
    try {
      setLoading(true);
      const res = await axios.post("https://hirehelper-backend.onrender.com/api/interview/ask-question", {
        role,
        level,
      });
      setQuestion(res.data.question);
      setAnswer("");
      setFeedback("");
      setStep("question");
    } catch (err) {
      console.error("Error asking question:", err);
    } finally {
      setLoading(false);
    }
  };

  const evaluateAnswer = async () => {
    try {
      const res = await axios.post("https://hirehelper-backend.onrender.com/api/interview/evaluate-answer", {
        question,
        answer,
      });
      setFeedback(res.data.feedback);
      setStep("feedback");
    } catch (err) {
      console.error("Error evaluating answer:", err);
      }
  };

  const exitInterview = () => {
    setStep("select");
    setRole("");
    setLevel("Intermediate");
    setQuestion("");
    setAnswer("");
    setFeedback("");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 rounded-xl backdrop-blur-md bg-white/60 shadow-xl transition-all">
      {step === "select" && (
        <div className="space-y-4">
          <h2 className="text-3xl font-extrabold text-gray-800">Select Role</h2>
          <div className="space-y-4">
  {/* Blinking error message */}
  <div className="text-red-600 font-semibold animate-pulse bg-red-50 border border-red-300 p-3 rounded-lg">
  ⚠️ Heads up! Our server might take a few seconds to respond. Please wait patiently — we're loading things for you!
</div>

  <h2 className="text-3xl font-extrabold text-gray-800">Select Role</h2>
  <div className="flex gap-2 flex-wrap">
    {["Frontend Developer", "Backend Developer", "Data Scientist", "DevOps Engineer"].map((r) => (
      <button
        key={r}
        onClick={() => setRole(r)}
        className={`px-4 py-2 rounded-full border font-medium transition-all duration-200 ${
          role === r
            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
            : "bg-gray-100 text-gray-800 hover:bg-blue-100"
        }`}
      >
        {r}
      </button>
    ))}
  </div>
</div>


          <p className="text-sm text-gray-500">Or type your own role:</p>
          <input
            className="border p-2 w-full rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g., AI Engineer"
          />

          <div className="mt-4">
            <h3 className="font-semibold mb-2 text-gray-700">Select Difficulty</h3>
            <div className="flex gap-2">
              {["Beginner", "Intermediate", "Advanced"].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  className={`px-3 py-1 rounded-full border font-medium transition-all ${
                    level === lvl
                      ? "bg-gradient-to-r from-green-400 to-emerald-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-800 hover:bg-green-100"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <button
  onClick={askQuestion}
  disabled={!role || loading}
  className={`mt-6 w-full px-6 py-3 text-lg font-bold rounded-xl transition-all duration-300 relative overflow-hidden group ${
    role && !loading
      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:scale-105 active:scale-95"
      : "bg-gray-300 text-gray-600 cursor-not-allowed"
  }`}
>
  {loading ? (
    <div className="flex items-center justify-center space-x-2">
      <div className="w-5 h-5 border-2 border-t-2 border-white rounded-full animate-spin"></div>
      <span className="z-10 relative">Starting...</span>
    </div>
  ) : (
    <span className="z-10 relative">🚀 Start Interview</span>
  )}
</button>

        </div>
      )}

      {step === "question" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">🧠 Question:</h2>
            <button onClick={exitInterview} className="text-sm text-red-500 hover:underline">
              Exit Interview
            </button>
          </div>
          <p className="bg-gray-100 p-4 rounded-lg text-gray-800">{question}</p>
          <textarea
            className="w-full border p-3 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer or use the mic below..."
          />
          <button
            onClick={toggleListening}
            className={`w-full px-4 py-2 rounded-xl font-semibold transition-all ${
              isListening
                ? "bg-red-500 text-white animate-pulse"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            🎙 {isListening ? "Listening... Click to Stop" : "Start Voice Answer"}
          </button>
          <button
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 active:scale-95 transition-all shadow-lg"
            onClick={evaluateAnswer}
          >
            ✅ Submit Answer
          </button>
        </div>
      )}

      {step === "feedback" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">💡 Feedback:</h2>
            <button onClick={exitInterview} className="text-sm text-red-500 hover:underline">
              Exit Interview
            </button>
          </div>
          {typeof feedback === "object" && feedback !== null && feedback.scores ? (
            <div className="bg-yellow-100 p-4 rounded-lg text-gray-900 space-y-2">
              <p className="font-semibold">💡 Improvement Tip:</p>
              <p>{feedback.improvement}</p>
              <div className="mt-4 space-y-1">
                <p>🎯 <strong>Scores (out of 10):</strong></p>
                <ul className="pl-4 list-disc">
                  <li>🧍‍♂️ Behavior: {feedback.scores.behavior}/10</li>
                  <li>📝 Grammar: {feedback.scores.grammar}/10</li>
                  <li>🛠 Technical: {feedback.scores.technical}/10</li>
                  <li>🎨 Creativity: {feedback.scores.creativity}/10</li>
                  <li>💡 Originality: {feedback.scores.originality}/10</li>
                </ul>
              </div>
            </div>
          ) : (
            <p className="bg-yellow-100 p-4 rounded whitespace-pre-wrap text-gray-900">
              {typeof feedback === "string" ? feedback : "Feedback not available."}
            </p>
          )}
          <button
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 active:scale-95 transition-all shadow-lg"
            onClick={askQuestion}
          >
            🔁 Next Question
          </button>
        </div>
      )}
    </div>
  );
}

export default MockInterview;
