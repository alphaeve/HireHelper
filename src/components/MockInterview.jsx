import { useState, useEffect } from "react";
import axios from "axios";

function MockInterview() {
  const [role, setRole] = useState("");
  const [level, setLevel] = useState("Intermediate");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [step, setStep] = useState("select");

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
      const res = await axios.post("http://localhost:5000/api/interview/ask-question", {
        role,
        level,
      });
      setQuestion(res.data.question);
      setAnswer("");
      setFeedback("");
      setStep("question");
    } catch (err) {
      console.error("Error asking question:", err);
    }
  };

  const evaluateAnswer = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/interview/evaluate-answer", {
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
            disabled={!role}
            className={`mt-6 w-full px-6 py-3 text-lg font-bold rounded-xl transition-all duration-300 relative overflow-hidden group ${
              role
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:scale-105 active:scale-95"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            <span className="z-10 relative">🚀 Start Interview</span>
          </button>
        </div>
      )}

      {step === "question" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">🧠 Question:</h2>
            <button
              onClick={exitInterview}
              className="text-sm text-red-500 hover:underline"
            >
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
            <button
              onClick={exitInterview}
              className="text-sm text-red-500 hover:underline"
            >
              Exit Interview
            </button>
          </div>

          {feedback && feedback.scores ? (
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












// import { useState, useEffect } from "react";
// import axios from "axios";

// function MockInterview() {
//   const [role, setRole] = useState("");
//   const [level, setLevel] = useState("Intermediate");
//   const [question, setQuestion] = useState("");
//   const [answer, setAnswer] = useState("");
//   const [feedback, setFeedback] = useState("");
//   const [step, setStep] = useState("select"); // select | question | feedback
//   const [timer, setTimer] = useState(60); // 60 seconds for timer
//   const [isTimeUp, setIsTimeUp] = useState(false);

//   const askQuestion = async () => {
//     try {
//       const res = await axios.post("http://localhost:5000/api/interview/ask-question", {
//         role,
//         level,
//       });
//       setQuestion(res.data.question);
//       setAnswer("");
//       setFeedback("");
//       setStep("question");
//       setIsTimeUp(false);
//       setTimer(60); // Reset timer for the new question
//     } catch (err) {
//       console.error("Error asking question:", err);
//     }
//   };

//   const evaluateAnswer = async () => {
//     try {
//       const res = await axios.post("http://localhost:5000/api/interview/evaluate-answer", {
//         question,
//         answer,
//       });
//       setFeedback(res.data.feedback);
//       setStep("feedback");
//     } catch (err) {
//       console.error("Error evaluating answer:", err);
//     }
//   };

//   // Timer countdown logic
//   useEffect(() => {
//     let interval;
//     if (step === "question" && timer > 0 && !isTimeUp) {
//       interval = setInterval(() => {
//         setTimer((prev) => prev - 1);
//       }, 1000); // Decrease timer every second
//     } else if (timer === 0) {
//       setIsTimeUp(true);
//     }

//     // Cleanup interval on component unmount or when timer reaches zero
//     return () => clearInterval(interval);
//   }, [step, timer, isTimeUp]);

//   return (
//     <div className="p-6 max-w-2xl mx-auto space-y-6 rounded-xl transition-all backdrop-blur-md bg-white/30 shadow-xl">
//       {step === "select" && (
//         <div className="space-y-4">
//           <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white">Select Role</h2>

//           <div className="flex gap-2 flex-wrap">
//             {["Frontend Developer", "Backend Developer", "Data Scientist", "DevOps Engineer"].map((r) => (
//               <button
//                 key={r}
//                 onClick={() => setRole(r)}
//                 className={`px-4 py-2 rounded-full border font-medium transition-all duration-200 ${
//                   role === r
//                     ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
//                     : "bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-white hover:bg-blue-100 dark:hover:bg-zinc-700"
//                 }`}
//               >
//                 {r}
//               </button>
//             ))}
//           </div>

//           <p className="text-sm text-gray-500 dark:text-gray-400">Or type your own role:</p>
//           <input
//             className="border p-2 w-full rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={role}
//             onChange={(e) => setRole(e.target.value)}
//             placeholder="e.g., AI Engineer"
//           />

//           <div className="mt-4">
//             <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Select Difficulty</h3>
//             <div className="flex gap-2">
//               {["Beginner", "Intermediate", "Advanced"].map((lvl) => (
//                 <button
//                   key={lvl}
//                   onClick={() => setLevel(lvl)}
//                   className={`px-3 py-1 rounded-full border font-medium transition-all ${
//                     level === lvl
//                       ? "bg-gradient-to-r from-green-400 to-emerald-600 text-white shadow-md"
//                       : "bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-white hover:bg-green-100 dark:hover:bg-zinc-700"
//                   }`}
//                 >
//                   {lvl}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <button
//             onClick={askQuestion}
//             disabled={!role}
//             className={`mt-6 w-full px-6 py-3 text-lg font-bold rounded-xl transition-all duration-300 relative overflow-hidden group ${
//               role
//                 ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:scale-105 active:scale-95"
//                 : "bg-gray-300 text-gray-600 cursor-not-allowed"
//             }`}
//           >
//             <span className="z-10 relative">🚀 Start Interview</span>
//             {role && (
//               <span className="absolute inset-0 bg-white opacity-10 blur-sm group-hover:animate-ping"></span>
//             )}
//           </button>
//         </div>
//       )}

//       {step === "question" && (
//         <div className="space-y-4">
//           <h2 className="text-xl font-semibold text-gray-800 dark:text-white">🧠 Question:</h2>
//           <p className="bg-gray-100 dark:bg-zinc-800 p-4 rounded-lg text-gray-800 dark:text-white">{question}</p>
          
//           {/* Timer */}
//           <div className="w-full mt-4 h-2 bg-gray-300 rounded-full">
//             <div
//               className="h-full bg-gradient-to-r from-green-400 to-emerald-600 rounded-full"
//               style={{ width: `${(timer / 60) * 100}%` }}
//             />
//           </div>
//           <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">Time Remaining: {timer}s</p>
          
//           <textarea
//             className="w-full border p-3 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//             rows="4"
//             value={answer}
//             onChange={(e) => setAnswer(e.target.value)}
//             placeholder="Type your answer..."
//           />
//           <button
//             className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 active:scale-95 transition-all shadow-lg"
//             onClick={evaluateAnswer}
//             disabled={isTimeUp}
//           >
//             ✅ Submit Answer
//           </button>
//           {isTimeUp && (
//             <p className="text-red-600 text-center mt-2">Time's up! You didn't submit your answer.</p>
//           )}
//         </div>
//       )}

//       {step === "feedback" && (
//         <div className="space-y-4">
//           <h2 className="text-xl font-semibold text-gray-800 dark:text-white">💡 Feedback:</h2>
//           <p className="bg-yellow-100 dark:bg-yellow-800 p-4 rounded whitespace-pre-wrap text-gray-900 dark:text-white">
//             {feedback}
//           </p>
//           <button
//             className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 active:scale-95 transition-all shadow-lg"
//             onClick={askQuestion}
//           >
//             🔁 Next Question
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default MockInterview;
