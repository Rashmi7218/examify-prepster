
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { CheckCircle, XCircle, Clock, Award } from "lucide-react";

type ExamResult = {
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  date: string;
  questions: {
    id: string;
    text: string;
    correctOption: string;
    userAnswer: string | null;
    isCorrect: boolean;
  }[];
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [results, setResults] = useState<ExamResult | null>(null);

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

  // Calculate score percentage
  const scorePercentage = Math.round((results.correctAnswers / results.totalQuestions) * 100);
  
  // Format time spent
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Data for pie chart
  const pieData = [
    { name: "Correct", value: results.correctAnswers },
    { name: "Incorrect", value: results.totalQuestions - results.correctAnswers },
  ];
  const COLORS = ["#0d9488", "#f43f5e"];

  // Performance by question type (mock data for demo)
  const performanceData = [
    {
      name: "JavaScript",
      correct: 3,
      incorrect: 1,
    },
    {
      name: "CSS",
      correct: 2,
      incorrect: 0,
    },
    {
      name: "HTML",
      correct: 1,
      incorrect: 1,
    },
    {
      name: "General",
      correct: 1,
      incorrect: 1,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Exam Results</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Score</CardTitle>
              <Award className="h-4 w-4 text-examify-teal" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{scorePercentage}%</div>
              <p className="text-xs text-muted-foreground">
                {results.correctAnswers} out of {results.totalQuestions} correct
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
              <Clock className="h-4 w-4 text-examify-teal" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatTime(results.timeSpent)}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round(results.timeSpent / results.totalQuestions)}s per question
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Date Taken</CardTitle>
              <Clock className="h-4 w-4 text-examify-teal" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">
                {new Date(results.date).toLocaleDateString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(results.date).toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Score Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Performance by Topic</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={performanceData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="correct" fill="#0d9488" name="Correct" />
                    <Bar dataKey="incorrect" fill="#f43f5e" name="Incorrect" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Question Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {results.questions.map((question, index) => (
                <div key={question.id} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-2">
                    <div className="mt-1 flex-shrink-0">
                      {question.isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">
                        Question {index + 1}: {question.text}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {question.isCorrect 
                          ? "Correct" 
                          : `Incorrect (Your answer: ${question.userAnswer || "Not answered"})`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex justify-center">
              <Button onClick={handleTakeNewExam} className="bg-examify-blue hover:bg-blue-600">
                Take Another Exam
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
