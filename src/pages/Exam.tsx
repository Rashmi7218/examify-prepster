
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

type QuestionMetric = {
  id: string;
  isCorrect: boolean;
  timeTaken: number; // in seconds
  text: string;
};

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
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [questionMetrics, setQuestionMetrics] = useState<QuestionMetric[]>([]);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      toast.error("Please login to access exams");
      navigate("/login");
    }
  }, [user, navigate]);

  // Set question start time when starting the exam or moving to next question
  useEffect(() => {
    if (examStarted) {
      setQuestionStartTime(Date.now());
    }
  }, [examStarted, currentQuestionIndex]);

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
    setQuestionStartTime(Date.now());
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

  const handleAnswerSubmit = (questionId: string, isCorrect: boolean, timeTaken: number) => {
    const question = mockExamQuestions.find(q => q.id === questionId);
    
    if (question) {
      setQuestionMetrics(prev => [
        ...prev,
        {
          id: questionId,
          isCorrect,
          timeTaken,
          text: question.text
        }
      ]);
    }
  };

  const pauseExam = () => {
    // Could implement pause functionality here
    toast.info("Exam paused");
  };

  const completeExam = () => {
    // Calculate results
    let correctAnswers = 0;
    const totalTimeTaken = EXAM_TIME - totalTimeRemaining;
    
    // If there are questions without metrics (e.g., time ran out), calculate them now
    const answeredQuestionIds = questionMetrics.map(m => m.id);
    const unansweredQuestions = mockExamQuestions.filter(q => !answeredQuestionIds.includes(q.id));
    
    let updatedMetrics = [...questionMetrics];
    
    // Add metrics for unanswered questions (as incorrect)
    unansweredQuestions.forEach(q => {
      updatedMetrics.push({
        id: q.id,
        isCorrect: false,
        timeTaken: 0, // We don't know how long they spent
        text: q.text
      });
    });
    
    // Count correct answers
    correctAnswers = updatedMetrics.filter(m => m.isCorrect).length;
    
    // Analyze metrics by domain
    const domainData = analyzeDomainPerformance(mockExamQuestions, updatedMetrics);
    
    // Calculate average times
    const correctAnswerTimes = updatedMetrics.filter(m => m.isCorrect).map(m => m.timeTaken);
    const incorrectAnswerTimes = updatedMetrics.filter(m => !m.isCorrect).map(m => m.timeTaken);
    
    const avgCorrectTime = correctAnswerTimes.length 
      ? correctAnswerTimes.reduce((sum, time) => sum + time, 0) / correctAnswerTimes.length 
      : 0;
      
    const avgIncorrectTime = incorrectAnswerTimes.length 
      ? incorrectAnswerTimes.reduce((sum, time) => sum + time, 0) / incorrectAnswerTimes.length 
      : 0;
      
    const avgAnswerTime = updatedMetrics.length 
      ? updatedMetrics.reduce((sum, m) => sum + m.timeTaken, 0) / updatedMetrics.length 
      : 0;
    
    // Store results in local storage for the dashboard
    const results = {
      examType,
      totalQuestions: mockExamQuestions.length,
      correctAnswers,
      timeSpent: totalTimeTaken,
      date: new Date().toISOString(),
      percentage: Math.round((correctAnswers / mockExamQuestions.length) * 100),
      avgCorrectTime,
      avgIncorrectTime,
      avgAnswerTime,
      domainPerformance: domainData,
      questions: updatedMetrics.map(metric => {
        const q = mockExamQuestions.find(q => q.id === metric.id);
        
        return {
          id: metric.id,
          text: metric.text,
          correctOption: q?.correctOptionId || q?.correctOptionIds || [],
          userAnswer: selectedAnswers[metric.id] || null,
          isCorrect: metric.isCorrect,
          timeTaken: metric.timeTaken
        };
      }),
    };
    
    localStorage.setItem("examify-results", JSON.stringify(results));
    
    // Navigate to results dashboard
    navigate("/dashboard");
  };

  // Helper function to analyze domain performance (mock implementation)
  const analyzeDomainPerformance = (questions: QuestionType[], metrics: QuestionMetric[]) => {
    // In a real app, questions would have domain/topic metadata
    // For now, we'll create some sample domains
    const domains = ["AWS Services", "Machine Learning", "Data Storage", "Security"];
    
    // Create some mock domain mapping (in a real app, this would come from the question data)
    const domainMap: Record<string, string> = {};
    questions.forEach((q, index) => {
      domainMap[q.id] = domains[index % domains.length];
    });
    
    // Analyze performance by domain
    const domainPerformance: Record<string, {correct: number, incorrect: number}> = {};
    
    domains.forEach(domain => {
      domainPerformance[domain] = {correct: 0, incorrect: 0};
    });
    
    metrics.forEach(metric => {
      const domain = domainMap[metric.id] || "Other";
      if (metric.isCorrect) {
        domainPerformance[domain].correct += 1;
      } else {
        domainPerformance[domain].incorrect += 1;
      }
    });
    
    return Object.entries(domainPerformance).map(([name, data]) => ({
      name,
      correct: data.correct,
      incorrect: data.incorrect
    }));
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
              onAnswerSubmit={handleAnswerSubmit}
              startTime={questionStartTime}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exam;
