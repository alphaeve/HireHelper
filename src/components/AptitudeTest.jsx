import { useState, useEffect } from "react";

const questions = [
  {
    question: "What is the next number in the series: 2, 4, 8, 16, ?",
    options: ["18", "24", "32", "64"],
    answer: "32",
  },
  {
    question: "If A = 1, B = 2, ..., what is the value of C + D?",
    options: ["5", "6", "7", "8"],
    answer: "7",
  },
  {
    question: "Find the odd one out: Apple, Banana, Carrot, Mango",
    options: ["Apple", "Banana", "Carrot", "Mango"],
    answer: "Carrot",
  },
];

function AptitudeTest() {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState("");
  const [showScore, setShowScore] = useState(false);

  // Save result only when test is finished
  useEffect(() => {
    if (showScore) {
      const aptitudeResult = {
        date: new Date().toLocaleString(),
        score,
        total: questions.length,
      };

      const prev = JSON.parse(localStorage.getItem("aptitudeResults")) || [];
      localStorage.setItem("aptitudeResults", JSON.stringify([...prev, aptitudeResult]));
    }
  }, [showScore]);

  const handleNext = () => {
    if (selected === questions[current].answer) {
      setScore(score + 1);
    }
    setSelected("");

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setShowScore(true);
    }
  };

  if (!started) {
    return (
      <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-xl text-center">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">📋 Aptitude Test Instructions</h2>
        <ul className="text-left mb-6 list-disc list-inside text-gray-700 space-y-2">
          <li>Total Questions: {questions.length}</li>
          <li>Only one option is correct for each question.</li>
          <li>Score will be shown at the end.</li>
          <li>No negative marking.</li>
          <li>Choose your answer and click "Next".</li>
        </ul>
        <button
          onClick={() => setStarted(true)}
          className="px-6 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700"
        >
          Start Test 🚀
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-xl text-center">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">🧠 Aptitude Test</h2>

      {showScore ? (
        <div className="text-xl font-semibold">
          🎉 Test Complete! Your Score: {score} / {questions.length}
        </div>
      ) : (
        <>
          <h3 className="text-lg font-medium mb-4">{questions[current].question}</h3>
          <div className="space-y-2">
            {questions[current].options.map((option) => (
              <button
                key={option}
                onClick={() => setSelected(option)}
                className={`w-full py-2 px-4 rounded-xl border transition ${
                  selected === option
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            onClick={handleNext}
            disabled={!selected}
            className="mt-6 px-6 py-2 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {current === questions.length - 1 ? "Finish" : "Next"}
          </button>
        </>
      )}
    </div>
  );
}

export default AptitudeTest;
