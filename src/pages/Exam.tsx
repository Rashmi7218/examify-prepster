
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { QuestionType } from "@/components/QuestionCard";
import { awsAIPractitionerQuestions, athenaQuestions } from "@/utils/examData";
import ExamProgress from "@/components/exam/ExamProgress";
import ExamIntro from "@/components/exam/ExamIntro";
import QuestionRenderer from "@/components/exam/QuestionRenderer";

const EXAM_TIME = 20 * 60; // 20 minutes in seconds
const QUESTION_TIME = 3 * 60; // 3 minutes per question

const Exam = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { type } = useParams();
  const [searchParams] = useSearchParams();
  const examType = type || searchParams.get('type') || 'ai-practitioner';
  
  // Get questions based on the exam type from URL
  const getExamQuestions = (): QuestionType[] => {
    switch(examType) {
      case 'athena':
        return athenaQuestions;
      case 'ai-practitioner':
      default:
        return awsAIPractitionerQuestions;
    }
  };
  
  const mockExamQuestions = getExamQuestions();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(QUESTION_TIME);
  const [totalTimeRemaining, setTotalTimeRemaining] = useState(EXAM_TIME);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string | string[]>>({});
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
    if (!examStarted || totalTimeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
      setTotalTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          completeExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [examStarted, totalTimeRemaining]);

  const startExam = () => {
    setExamStarted(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < mockExamQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeRemaining(QUESTION_TIME); // Reset question timer for new question
    }
  };

  const handleMultipleSelectSubmit = (selectedIds: string[]) => {
    const question = mockExamQuestions[currentQuestionIndex];
    setSelectedAnswers((prev) => ({
      ...prev,
      [question.id]: selectedIds
    }));
  };

  const pauseExam = () => {
    // Could implement pause functionality here
    toast.info("Exam paused");
  };

  const completeExam = () => {
    // Calculate results
    let correctAnswers = 0;
    
    mockExamQuestions.forEach((question) => {
      if (question.type === 'multiple') {
        // For multiple select questions
        const selectedIds = selectedAnswers[question.id] as string[] || [];
        const correctIds = question.correctOptionIds || [];
        if (arraysEqual(selectedIds.sort(), correctIds.sort())) {
          correctAnswers++;
        }
      } else if (question.type === 'type-2') {
        // For matching type questions
        // We'll count this as a single question for now, but could be more granular
        const tasks = question.tasks || [];
        let allTasksCorrect = true;
        
        tasks.forEach(task => {
          // Need to handle this as Record<string, string> not string[]
          const questionAnswer = selectedAnswers[question.id];
          const matchingAnswers = typeof questionAnswer === 'object' && !Array.isArray(questionAnswer) 
            ? questionAnswer 
            : {};
            
          if (matchingAnswers[task.id] !== task.correctId) {
            allTasksCorrect = false;
          }
        });
        
        if (allTasksCorrect) {
          correctAnswers++;
        }
      } else {
        // For single select questions
        if (selectedAnswers[question.id] === question.correctOptionId) {
          correctAnswers++;
        }
      }
    });
    
    // Store results in local storage for the dashboard
    const results = {
      examType,
      totalQuestions: mockExamQuestions.length,
      correctAnswers,
      timeSpent: EXAM_TIME - totalTimeRemaining,
      date: new Date().toISOString(),
      percentage: Math.round((correctAnswers / mockExamQuestions.length) * 100),
      questions: mockExamQuestions.map((q) => {
        if (q.type === 'multiple') {
          const selectedIds = selectedAnswers[q.id] as string[] || [];
          const correctIds = q.correctOptionIds || [];
          return {
            id: q.id,
            text: q.text,
            correctOption: correctIds,
            userAnswer: selectedIds,
            isCorrect: arraysEqual(selectedIds.sort(), correctIds.sort()),
          };
        } else if (q.type === 'type-2') {
          // For matching type questions
          return {
            id: q.id,
            text: q.text,
            type: 'type-2',
            // We'll just note it was completed for now
            isCorrect: !!selectedAnswers[q.id],
          };
        } else {
          return {
            id: q.id,
            text: q.text,
            correctOption: q.correctOptionId,
            userAnswer: selectedAnswers[q.id] || null,
            isCorrect: selectedAnswers[q.id] === q.correctOptionId,
          };
        }
      }),
    };
    
    localStorage.setItem("examify-results", JSON.stringify(results));
    
    // Navigate to results dashboard
    navigate("/dashboard");
  };

  // Helper function to compare arrays
  const arraysEqual = (a: any[], b: any[]) => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  // If not yet started, show intro screen
  if (!examStarted) {
    return <ExamIntro 
      examType={examType} 
      onStart={startExam} 
      onReturn={() => navigate("/")} 
    />;
  }

  const currentQuestion = mockExamQuestions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <ExamProgress
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={mockExamQuestions.length}
            timeRemaining={timeRemaining}
            totalTime={totalTimeRemaining}
            pauseExam={pauseExam}
          />
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <QuestionRenderer
              question={currentQuestion}
              onNext={handleNextQuestion}
              onComplete={completeExam}
              isLastQuestion={currentQuestionIndex === mockExamQuestions.length - 1}
              onMultipleSelectSubmit={handleMultipleSelectSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exam;
