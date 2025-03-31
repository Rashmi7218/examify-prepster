
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { CheckCircle, XCircle, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";

type ExamResult = {
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
    userAnswer: string | string[] | null;
    isCorrect: boolean;
    timeTaken?: number;
  }[];
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [results, setResults] = useState<ExamResult | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    
    // Load results from local storage
    const storedResults = localStorage.getItem("examify-results");
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }
  }, [user, navigate]);

  const handleTakeNewExam = () => {
    navigate("/exam");
  };

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-6">Exam Dashboard</h1>
          <Card>
            <CardContent className="pt-6">
              <p className="mb-6">You haven't completed any exams yet.</p>
              <Button onClick={handleTakeNewExam} className="bg-examify-blue hover:bg-blue-600">
                Take an Exam
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Format time spent
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Data for pie chart
  const pieData = [
    { name: "Correct", value: results.correctAnswers },
    { name: "Incorrect", value: results.totalQuestions - results.correctAnswers },
  ];
  const COLORS = ["#4caf50", "#f44336"];

  // Calculate pagination for question review
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = results.questions.slice(indexOfFirstQuestion, indexOfLastQuestion);
  const totalPages = Math.ceil(results.questions.length / questionsPerPage);

  // Handle pagination changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            className="p-1" 
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-medium flex-1">AWS Certified AI Practitioner Official Practice Question Set (AIF-C01 - English)</h1>
          <Button 
            variant="outline" 
            className="text-red-500 border-red-500 hover:bg-red-50"
            onClick={() => navigate("/exam")}
          >
            Reset Product
          </Button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-indigo-100 h-2 rounded-full mb-6">
          <div 
            className="bg-indigo-800 h-2 rounded-full" 
            style={{width: `${results.percentage}%`}}
          ></div>
        </div>
        <div className="text-center text-sm text-gray-600 mb-8">
          {results.percentage}% Complete
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <div className="text-5xl font-bold text-center mb-2">{results.percentage}%</div>
            <div className="text-center">Correct</div>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm">
            <div className="text-lg font-bold text-center mb-2">{results.totalQuestions} of {results.totalQuestions}</div>
            <div className="text-center">Questions Taken</div>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm">
            <div className="text-lg font-bold text-center mb-2">{formatTime(Math.round(results.avgAnswerTime))}</div>
            <div className="text-center">Avg. Answer Time</div>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm">
            <div className="text-lg font-bold text-center mb-2">{formatTime(Math.round(results.avgCorrectTime))}</div>
            <div className="text-center">Avg. Correct Answer Time</div>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm">
            <div className="text-lg font-bold text-center mb-2">{formatTime(Math.round(results.avgIncorrectTime))}</div>
            <div className="text-center">Avg. Incorrect Answer Time</div>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm col-span-2">
            <div className="text-lg font-bold text-center mb-2">{formatTime(results.timeSpent)}</div>
            <div className="text-center">Time Elapsed</div>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm col-span-3">
            <div className="text-lg font-bold text-center mb-2">{new Date(results.date).toLocaleDateString()}</div>
            <div className="text-center">Attempt Date</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex">
            <button className="py-3 px-6 border-b-2 border-indigo-800 font-medium text-indigo-800">
              Question Review
            </button>
            <button className="py-3 px-6 text-gray-600">
              Domain Scores
            </button>
          </div>
        </div>
        
        {/* Question Review Section */}
        <div className="bg-white rounded-md shadow-sm mb-6">
          <div className="flex justify-between items-center p-3 border-b">
            <Button variant="ghost" size="sm">
              <span className="text-sm">Filter</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
            </Button>
            <div className="text-sm text-gray-600">Review All</div>
          </div>
          
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-1/2">Preview</TableHead>
                <TableHead className="text-right">Time</TableHead>
                <TableHead className="w-24 text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentQuestions.map((question, index) => (
                <TableRow key={question.id}>
                  <TableCell className="py-4">
                    <div className="flex items-start">
                      <div className="mt-1 mr-2">
                        {question.isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div className="line-clamp-2">{question.text}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      <Clock className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{question.timeTaken ? formatTime(question.timeTaken) : 'N/A'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-indigo-800">
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          <div className="p-3 border-t">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) handlePageChange(currentPage - 1);
                    }}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      href="#" 
                      isActive={currentPage === i + 1}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(i + 1);
                      }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) handlePageChange(currentPage + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
        
        <div className="mb-8 flex justify-center">
          <Button onClick={handleTakeNewExam} className="bg-indigo-800 hover:bg-indigo-700">
            Take Another Exam
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
