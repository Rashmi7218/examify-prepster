import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  LogOut,
  History,
} from "lucide-react";
import { awsExams, type AWSExam } from "@/data/awsExams";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [recentResults, setRecentResults] = useState<any[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "Beginner" | "Intermediate" | "Advanced"
  >("Beginner");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }

    // Load recent results from local storage
    const storedResults = localStorage.getItem("examify-results");
    if (storedResults) {
      setRecentResults([JSON.parse(storedResults)]);
    }
  }, [user, navigate]);

  const handleStartExam = (examId: string) => {
    navigate(`/exam/${examId}`);
  };

  const handleViewResults = () => {
    navigate("/results");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSubscribe = () => {
    navigate("/subscribe");
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ExamifyPrep</h1>
              <p className="text-gray-600">
                Welcome back, {user?.name || user?.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={handleSubscribe}
                className="flex items-center gap-2"
              >
                Subscribe
              </Button>
              {recentResults.length > 0 && (
                <Button
                  variant="outline"
                  onClick={handleViewResults}
                  className="flex items-center gap-2"
                >
                  <History className="h-4 w-4" />
                  View Results
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Exams
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {awsExams.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {recentResults.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg. Time</p>
                  <p className="text-2xl font-bold text-gray-900">18m</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Best Score
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {recentResults.length > 0
                      ? `${recentResults[0].percentage}%`
                      : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AWS Certifications */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            AWS Certifications
          </h2>
          <p className="text-gray-600 mb-6">
            Choose an AWS certification to start practicing. Each exam is
            designed to test your knowledge and prepare you for the real
            certification.
          </p>

          {/* Difficulty Tabs - sticky at top */}
          <div className="w-full sticky top-0 z-20">
            <div className="flex justify-center gap-2 bg-white/95 backdrop-blur border rounded-lg p-2 shadow-sm">
              {(["Beginner", "Intermediate", "Advanced"] as const).map(
                (lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSelectedDifficulty(lvl)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                      selectedDifficulty === lvl
                        ? "bg-indigo-600 text-white shadow"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {lvl}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Filtered Certificates: 2 columns, multiple rows */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {awsExams
              .filter((exam) => exam.difficulty === selectedDifficulty)
              .map((exam) => (
                <Card
                  key={exam.id}
                  className="hover:shadow-lg transition-shadow duration-200"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-lg ${exam.color} text-white`}
                        >
                          {exam.icon}
                        </div>
                        <div>
                          <CardTitle className="text-xl">
                            {exam.title}
                          </CardTitle>
                          <Badge
                            className={getDifficultyColor(exam.difficulty)}
                          >
                            {exam.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 mb-4">
                      {exam.description}
                    </CardDescription>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {exam.duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {exam.questions} questions
                        </span>
                      </div>
                    </div>
                    {/* Pricing Options */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border rounded-lg p-4">
                        <div className="text-sm font-medium text-gray-700 mb-1">
                          60 Questions
                        </div>
                        <div className="text-2xl font-bold mb-2">$10</div>
                        <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                          <li>Timed practice</li>
                          <li>Basic explanations</li>
                        </ul>
                      </div>
                      <div className="border rounded-lg p-4">
                        <div className="text-sm font-medium text-gray-700 mb-1">
                          120 Questions
                        </div>
                        <div className="text-2xl font-bold mb-2">$15</div>
                        <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                          <li>Timed practice</li>
                          <li>Detailed explanations</li>
                          <li>Performance summary</li>
                        </ul>
                      </div>
                      <div className="border rounded-lg p-4">
                        <div className="text-sm font-medium text-gray-700 mb-1">
                          180 Questions + Study Material
                        </div>
                        <div className="text-2xl font-bold mb-2">$25</div>
                        <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                          <li>Timed practice</li>
                          <li>In-depth explanations</li>
                          <li>Downloadable study material</li>
                          <li>Advanced analytics</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* Recent Activity */}
        {recentResults.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Recent Activity
            </h3>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {recentResults[0].examType === "athena"
                        ? "Amazon Athena"
                        : "AWS Certified AI Practitioner"}
                    </h4>
                    <p className="text-gray-600">
                      Completed on{" "}
                      {new Date(recentResults[0].date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      {recentResults[0].percentage}%
                    </p>
                    <p className="text-sm text-gray-600">
                      {recentResults[0].correctAnswers}/
                      {recentResults[0].totalQuestions} correct
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
