
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { BookOpen, Clock, Award, CheckCircle } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: <BookOpen className="h-6 w-6 text-examify-blue" />,
      title: "Comprehensive Question Bank",
      description: "Access thousands of carefully crafted MCQs covering all exam topics",
    },
    {
      icon: <Clock className="h-6 w-6 text-examify-blue" />,
      title: "Timed Practice Tests",
      description: "Prepare under exam-like conditions with our timed practice tests",
    },
    {
      icon: <Award className="h-6 w-6 text-examify-blue" />,
      title: "Detailed Performance Analytics",
      description: "Track your progress and identify areas for improvement",
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-examify-blue" />,
      title: "Detailed Explanations",
      description: "Learn from detailed explanations for each question",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-examify-dark">
            ExamifyPrep
            <span className="text-examify-blue">.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            The ultimate exam preparation platform to help you ace your tests with confidence
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Button 
                onClick={() => navigate("/exam")} 
                size="lg"
                className="bg-examify-blue hover:bg-blue-600"
              >
                Start Practice Exam
              </Button>
            ) : (
              <>
                <Button 
                  onClick={() => navigate("/login")} 
                  size="lg"
                  className="bg-examify-blue hover:bg-blue-600"
                >
                  Login to Start
                </Button>
                <Button 
                  onClick={() => navigate("/register")} 
                  variant="outline"
                  size="lg"
                  className="border-examify-blue text-examify-blue hover:bg-blue-50"
                >
                  Register Now
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              Why Choose ExamifyPrep?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-examify-teal">
                  Smart Learning Technology
                </h3>
                <p className="text-gray-600 mb-4">
                  Our platform uses advanced algorithms to identify your strengths and weaknesses, 
                  creating a personalized learning path that maximizes your study efficiency.
                </p>
                <h3 className="text-xl font-semibold mb-4 text-examify-teal">
                  Expert-Created Content
                </h3>
                <p className="text-gray-600">
                  All our questions and explanations are crafted by subject matter experts with years 
                  of experience in exam preparation.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-examify-teal">
                  Realistic Exam Simulation
                </h3>
                <p className="text-gray-600 mb-4">
                  Practice in an environment that mimics the actual exam, including timing, 
                  question formats, and difficulty levels.
                </p>
                <h3 className="text-xl font-semibold mb-4 text-examify-teal">
                  Comprehensive Performance Analytics
                </h3>
                <p className="text-gray-600">
                  Gain insights into your performance with detailed analytics that help you 
                  focus on areas that need improvement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
