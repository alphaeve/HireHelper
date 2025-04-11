import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// 👇 Mock data injection (only if not already present)
const mockData = [
  {
    date: "2025-04-10",
    totalScore: 7,
    totalQuestions: 10,
    timeTaken: 150,
    categories: {
      technical: 5,
      behavioral: 2,
    },
  },
  {
    date: "2025-04-09",
    totalScore: 9,
    totalQuestions: 10,
    timeTaken: 120,
    categories: {
      technical: 6,
      behavioral: 3,
    },
  },
];

if (!localStorage.getItem("interviewResults")) {
  localStorage.setItem("interviewResults", JSON.stringify(mockData));
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
