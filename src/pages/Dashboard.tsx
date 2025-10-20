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
  Users,
  Award,
  TrendingUp,
  ArrowRight,
  LogOut,
  History,
} from "lucide-react";

type AWSExam = {
  id: string;
  title: string;
  description: string;
  duration: string;
  questions: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  icon: React.ReactNode;
  color: string;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [recentResults, setRecentResults] = useState<any[]>([]);

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

  const awsExams: AWSExam[] = [
    {
      id: "ai-practitioner",
      title: "AWS Certified AI Practitioner",
      description: "Validate your ability to implement AI/ML solutions on AWS",
      duration: "20 minutes",
      questions: 15,
      difficulty: "Beginner",
      category: "AI/ML",
      icon: <BookOpen className="h-8 w-8" />,
      color: "bg-blue-500",
    },
    {
      id: "athena",
      title: "Amazon Athena",
      description:
        "Interactive query service for analyzing data in S3 using SQL",
      duration: "15 minutes",
      questions: 10,
      difficulty: "Intermediate",
      category: "Analytics",
      icon: <TrendingUp className="h-8 w-8" />,
      color: "bg-green-500",
    },
    {
      id: "cloud-practitioner",
      title: "AWS Cloud Practitioner",
      description: "Foundational understanding of AWS Cloud concepts",
      duration: "25 minutes",
      questions: 20,
      difficulty: "Beginner",
      category: "Foundational",
      icon: <Award className="h-8 w-8" />,
      color: "bg-purple-500",
    },
    {
      id: "solutions-architect",
      title: "AWS Solutions Architect",
      description: "Design distributed systems on AWS platform",
      duration: "30 minutes",
      questions: 25,
      difficulty: "Advanced",
      category: "Architecture",
      icon: <Users className="h-8 w-8" />,
      color: "bg-orange-500",
    },
  ];

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
          <p className="text-gray-600 mb-8">
            Choose an AWS certification to start practicing. Each exam is
            designed to test your knowledge and prepare you for the real
            certification.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {awsExams.map((exam) => (
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
                        <CardTitle className="text-xl">{exam.title}</CardTitle>
                        <Badge className={getDifficultyColor(exam.difficulty)}>
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

                  <Button
                    onClick={() => handleStartExam(exam.id)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Start Practice Exam
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
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
