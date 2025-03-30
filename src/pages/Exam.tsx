
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import ExamProgress from "@/components/ExamProgress";
import QuestionCard, { QuestionType } from "@/components/QuestionCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Mock exam data
const mockExamQuestions: QuestionType[] = [
  {
    id: "q1",
    text: "Which of the following is NOT a primitive data type in JavaScript?",
    options: [
      { id: "a", text: "String" },
      { id: "b", text: "Number" },
      { id: "c", text: "Object" },
      { id: "d", text: "Boolean" },
    ],
    correctOptionId: "c",
    explanation: "In JavaScript, primitive data types include String, Number, Boolean, Undefined, Null, Symbol, and BigInt. Object is a non-primitive data type.",
    type: "single",
  },
  {
    id: "q2",
    text: "What does CSS stand for?",
    options: [
      { id: "a", text: "Creative Style Sheets" },
      { id: "b", text: "Cascading Style Sheets" },
      { id: "c", text: "Computer Style Sheets" },
      { id: "d", text: "Colorful Style Sheets" },
    ],
    correctOptionId: "b",
    explanation: "CSS stands for Cascading Style Sheets. It is a style sheet language used for describing the presentation of a document written in a markup language like HTML.",
    type: "single",
  },
  {
    id: "q3",
    text: "Is HTML a programming language?",
    options: [
      { id: "a", text: "True" },
      { id: "b", text: "False" },
    ],
    correctOptionId: "b",
    explanation: "HTML (Hypertext Markup Language) is not a programming language. It is a markup language used for creating the structure and content of web pages.",
    type: "truefalse",
  },
  {
    id: "q4",
    text: "Which HTTP method would you use to update an existing resource?",
    options: [
      { id: "a", text: "GET" },
      { id: "b", text: "POST" },
      { id: "c", text: "PUT" },
      { id: "d", text: "DELETE" },
    ],
    correctOptionId: "c",
    explanation: "PUT is the HTTP method used to update an existing resource. GET is used to retrieve data, POST is used to create a new resource, and DELETE is used to remove a resource.",
    type: "single",
  },
  {
    id: "q5",
    text: "Which of the following sorting algorithms has the best average time complexity?",
    options: [
      { id: "a", text: "Bubble Sort (O(n²))" },
      { id: "b", text: "Quick Sort (O(n log n))" },
      { id: "c", text: "Selection Sort (O(n²))" },
      { id: "d", text: "Insertion Sort (O(n²))" },
    ],
    correctOptionId: "b",
    explanation: "Quick Sort has an average time complexity of O(n log n), which is better than the O(n²) complexity of Bubble Sort, Selection Sort, and Insertion Sort.",
    type: "single",
  },
];

const EXAM_TIME = 10 * 60; // 10 minutes in seconds

const Exam = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(EXAM_TIME);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [examStarted, setExamStarted] = useState(false);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      toast.error("Please login to access exams");
      navigate("/login");
    }
  }, [user, navigate]);

  // Timer countdown
  useEffect(() => {
    if (!examStarted || timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          completeExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [examStarted, timeRemaining]);

  const startExam = () => {
    setExamStarted(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < mockExamQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const completeExam = () => {
    // Calculate results
    let correctAnswers = 0;
    
    mockExamQuestions.forEach((question) => {
      if (answers[question.id] === question.correctOptionId) {
        correctAnswers++;
      }
    });
    
    // Store results in local storage for the dashboard
    const results = {
      totalQuestions: mockExamQuestions.length,
      correctAnswers,
      timeSpent: EXAM_TIME - timeRemaining,
      date: new Date().toISOString(),
      questions: mockExamQuestions.map((q) => ({
        id: q.id,
        text: q.text,
        correctOption: q.correctOptionId,
        userAnswer: answers[q.id] || null,
        isCorrect: answers[q.id] === q.correctOptionId,
      })),
    };
    
    localStorage.setItem("examify-results", JSON.stringify(results));
    
    // Navigate to results dashboard
    navigate("/dashboard");
  };

  // If not yet started, show intro screen
  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="exam-container">
            <h1 className="text-3xl font-bold mb-6 text-center">Practice Exam</h1>
            <div className="bg-white p-8 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4">Exam Instructions</h2>
              <ul className="list-disc pl-5 space-y-2 mb-6 text-gray-700">
                <li>This exam contains {mockExamQuestions.length} questions.</li>
                <li>You have {EXAM_TIME / 60} minutes to complete the exam.</li>
                <li>Each question has only one correct answer.</li>
                <li>You will receive immediate feedback after answering each question.</li>
                <li>Your results will be available on the dashboard after completion.</li>
              </ul>
              <Button 
                onClick={startExam} 
                size="lg" 
                className="w-full bg-examify-blue hover:bg-blue-600"
              >
                Start Exam
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = mockExamQuestions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="exam-container">
          <ExamProgress
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={mockExamQuestions.length}
            timeRemaining={timeRemaining}
            totalTime={EXAM_TIME}
          />
          
          <QuestionCard
            question={currentQuestion}
            onNext={handleNextQuestion}
            isLastQuestion={currentQuestionIndex === mockExamQuestions.length - 1}
            onComplete={completeExam}
          />
        </div>
      </div>
    </div>
  );
};

export default Exam;
