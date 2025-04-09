
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { QuestionType } from "@/components/QuestionCard";
import { awsAIPractitionerQuestions, athenaQuestions } from "@/utils/examData";
import QuestionRenderer from "@/components/exam/QuestionRenderer";

type QuestionResult = {
  id: string;
  text: string;
  correctOption: string | string[];
  userAnswer: string | string[] | Record<string, string> | null;
  isCorrect: boolean;
  timeTaken?: number;
  type?: string;
};

type ExamResult = {
  examType: string;
  questions: QuestionResult[];
};

const QuestionReview = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { questionId } = useParams();
  const [results, setResults] = useState<ExamResult | null>(null);
  const [question, setQuestion] = useState<QuestionType | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string | string[] | Record<string, string> | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [isLastQuestion, setIsLastQuestion] = useState<boolean>(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    const storedResults = localStorage.getItem("examify-results");
    if (!storedResults || !questionId) {
      navigate("/results");
      return;
    }
    
    const parsedResults = JSON.parse(storedResults) as ExamResult;
    setResults(parsedResults);
    
    const questionIndex = parsedResults.questions.findIndex(q => q.id === questionId);
    if (questionIndex === -1) {
      navigate("/results");
      return;
    }
    setQuestionIndex(questionIndex);
    
    // Set last question flag
    setIsLastQuestion(questionIndex === parsedResults.questions.length - 1);
    
    const foundQuestionResult = parsedResults.questions.find(q => q.id === questionId);
    if (foundQuestionResult) {
      console.log("Found question result:", foundQuestionResult);
      setUserAnswer(foundQuestionResult.userAnswer || null);
      setIsCorrect(foundQuestionResult.isCorrect);
    }
    
    const allQuestions = parsedResults.examType === 'athena' 
      ? athenaQuestions 
      : awsAIPractitionerQuestions;
    
    const foundQuestion = allQuestions.find(q => q.id === questionId);
    if (foundQuestion) {
      setQuestion(foundQuestion);
    } else {
      navigate("/results");
    }
  }, [user, navigate, questionId]);

  // For debugging purposes
  useEffect(() => {
    if (question && userAnswer) {
      console.log("Question type:", question.type);
      console.log("User answer:", userAnswer);
      console.log("Is correct:", isCorrect);
    }
  }, [question, userAnswer, isCorrect]);

  if (!results || !question) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading question...</h1>
          <p>If you're not redirected, <Button variant="link" onClick={() => navigate("/results")}>go back to results</Button></p>
        </div>
      </div>
    );
  }

  // Dummy functions for review mode
  const dummyFunction = () => {};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            className="p-1" 
            onClick={() => navigate("/results")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Results
          </Button>
          <h1 className="text-xl font-medium">Question Review</h1>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border max-w-4xl mx-auto">
          <div className="mb-4 text-sm text-gray-500">
            Question {questionIndex + 1} of {results.questions.length}
          </div>
          
          <QuestionRenderer
            question={question}
            onNext={dummyFunction}
            onComplete={dummyFunction}
            isLastQuestion={isLastQuestion}
            onMultipleSelectSubmit={dummyFunction}
            onAnswerSubmit={dummyFunction}
            startTime={0}
            isReviewMode={true}
            preSelectedAnswer={userAnswer}
            forceShowExplanation={true}
            isCorrectOverride={isCorrect}
          />
          
          <div className="mt-8 flex justify-between">
            <Button 
              onClick={() => navigate("/results")} 
              className="bg-indigo-900 hover:bg-indigo-800 text-white"
            >
              Back to Results
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionReview;
