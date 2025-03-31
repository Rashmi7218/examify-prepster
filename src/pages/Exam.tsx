import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import ExamProgress from "@/components/ExamProgress";
import QuestionCard, { QuestionType } from "@/components/QuestionCard";
import MultipleSelectQuestion from "@/components/MultipleSelectQuestion";
import MatchingQuestion from "@/components/MatchingQuestion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { awsAIPractitionerQuestions, athenaQuestions } from "@/utils/examData";

const EXAM_TIME = 20 * 60; // 20 minutes in seconds
const QUESTION_TIME = 3 * 60; // 3 minutes per question

const Exam = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { type } = useParams();
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
          const questionAnswers = selectedAnswers[question.id] as Record<string, string> || {};
          if (questionAnswers[task.id] !== task.correctId) {
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

  // Get the exam title based on type
  const getExamTitle = () => {
    switch(examType) {
      case 'athena':
        return 'AWS Athena SerDe Practice Questions';
      case 'ai-practitioner':
      default:
        return 'AWS Certified AI Practitioner Official Practice Question Set (AIF-C01 - English)';
    }
  };

  // If not yet started, show intro screen
  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border">
            <h1 className="text-2xl font-bold mb-2 text-center">{getExamTitle()}</h1>
            
            <div className="my-8">
              <h2 className="text-xl font-semibold mb-4">AWS Exam Preparation Official Question Sets Overview and Instructions</h2>
              <p className="mb-4">
                AWS Official Practice Question Sets feature questions developed by AWS that demonstrate the style of AWS certification exams.
                These exam-style questions include detailed feedback and recommended resources to help you prepare for your exam.
              </p>
              <p className="mb-6">
                Download a copy of the Official Practice Question Sets Overview and Instructions as a PDF document to refer to while you complete the Practice Exam below:
              </p>
              
              <div className="bg-blue-50 border border-blue-100 rounded-md p-4 flex items-center gap-3 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <a href="#" className="text-blue-600 hover:underline">AWS Exam Preparation Official Practice Question Sets Overview and Instructions.pdf</a>
              </div>
              
              <h2 className="text-xl font-semibold mb-4">Customer Support</h2>
              <p className="mb-4">
                If you need assistance, contact AWS Training and Certification Customer Service. Use the following information when you complete the form:
              </p>
              
              <ul className="list-disc pl-8 space-y-2 mb-6">
                <li><strong>Inquiry type dropdown menu:</strong> Choose Certification.</li>
                <li><strong>Additional details dropdown menu:</strong> Choose AWS Exam Preparation.</li>
                <li><strong>How can we help you? text box:</strong> Include the name of the Practice Exam and a detailed description of your issue.</li>
              </ul>
            </div>
            
            <div className="flex justify-between mt-8">
              <Button 
                variant="outline"
                className="border-gray-300"
                onClick={() => navigate("/")}
              >
                Return To Product Dashboard
              </Button>
              
              <Button 
                onClick={startExam} 
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Start
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = mockExamQuestions[currentQuestionIndex];

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'multiple':
        return (
          <MultipleSelectQuestion
            questionText={currentQuestion.text}
            options={currentQuestion.options}
            correctOptionIds={currentQuestion.correctOptionIds || []}
            onConfirm={handleMultipleSelectSubmit}
          />
        );
      
      case 'type-2':
        return (
          <MatchingQuestion
            questionText={currentQuestion.text}
            tasks={currentQuestion.tasks || []}
            options={currentQuestion.options}
            onComplete={
              currentQuestionIndex === mockExamQuestions.length - 1 
                ? completeExam 
                : handleNextQuestion
            }
          />
        );
        
      case 'type-1':
      case 'single':
      default:
        return (
          <QuestionCard
            question={currentQuestion}
            onNext={handleNextQuestion}
            isLastQuestion={currentQuestionIndex === mockExamQuestions.length - 1}
            onComplete={completeExam}
          />
        );
    }
  };

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
            {renderQuestion()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exam;
