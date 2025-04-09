
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResultsHeader from "@/components/results/ResultsHeader";
import ResultStats from "@/components/results/ResultStats";
import QuestionsList from "@/components/results/QuestionsList";
import DomainPerformance from "@/components/results/DomainPerformance";

type ExamResult = {
  examType: string;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  date: string;
  percentage: number;
  avgCorrectTime: number;
  avgIncorrectTime: number;
  avgAnswerTime: number;
  domainPerformance?: {
    name: string;
    correct: number;
    incorrect: number;
  }[];
  questions: {
    id: string;
    text: string;
    correctOption: string | string[];
    userAnswer: string | string[] | Record<string, string> | null;
    isCorrect: boolean;
    timeTaken?: number;
    type?: string;
  }[];
};

const Results = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [results, setResults] = useState<ExamResult | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    const storedResults = localStorage.getItem("examify-results");
    if (!storedResults) {
      navigate("/dashboard");
      return;
    }
    
    setResults(JSON.parse(storedResults));
  }, [user, navigate]);

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading results...</h1>
          <p>If you're not redirected, <Button variant="link" onClick={() => navigate("/dashboard")}>go to dashboard</Button></p>
        </div>
      </div>
    );
  }

  const getExamName = (examType: string) => {
    switch(examType) {
      case 'athena':
        return 'Amazon Athena';
      case 'ai-practitioner':
      default:
        return 'AWS Certified AI Practitioner Official Practice Question Set (AIF-C01)';
    }
  };

  const uniqueQuestions = results.questions.reduce((acc, current) => {
    const x = acc.find(item => item.id === current.id);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, [] as ExamResult['questions']);

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        <ResultsHeader 
          examName={getExamName(results.examType)} 
          percentage={results.percentage} 
        />
        
        <ResultStats 
          percentage={results.percentage}
          totalQuestions={results.totalQuestions}
          correctAnswers={results.correctAnswers}
          timeSpent={results.timeSpent}
          date={results.date}
          avgAnswerTime={results.avgAnswerTime}
          avgCorrectTime={results.avgCorrectTime}
          avgIncorrectTime={results.avgIncorrectTime}
        />
        
        <Tabs defaultValue="review" className="w-full mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="review">Question Review</TabsTrigger>
            <TabsTrigger value="domains">Domain Scores</TabsTrigger>
          </TabsList>
          
          <TabsContent value="review">
            <QuestionsList questions={uniqueQuestions} />
          </TabsContent>
          
          <TabsContent value="domains">
            <DomainPerformance domainPerformance={results.domainPerformance} />
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between">
          <Button 
            onClick={() => navigate("/dashboard")} 
            variant="outline"
            className="border-indigo-800 text-indigo-800 hover:bg-indigo-50"
          >
            Go to Dashboard
          </Button>
          
          <Button 
            onClick={() => navigate("/exam")} 
            className="bg-indigo-800 hover:bg-indigo-700"
          >
            Take Another Exam
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;
