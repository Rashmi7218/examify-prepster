import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { BookOpen, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { awsExams, type AWSExam } from "@/data/awsExams";

type ExamType = {
  id: string;
  name: string;
  description: string;
  price: string;
  details: string[];
};

const examTypes: ExamType[] = [
  {
    id: "practice",
    name: "Practice Test",
    description: "Quick drill with fundamentals.",
    price: "$10",
    details: ["60 questions", "Timed practice", "Basic explanations"],
  },
  {
    id: "mock",
    name: "Full Mock",
    description: "Exam-like experience with deeper insights.",
    price: "$15",
    details: ["120 questions", "Detailed explanations", "Performance summary"],
  },
  {
    id: "pro",
    name: "Pro Pack",
    description: "Extended practice plus study material.",
    price: "$25",
    details: [
      "180 questions",
      "In-depth explanations",
      "Downloadable study material",
      "Advanced analytics",
    ],
  },
];

const Subscribe: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCertId, setSelectedCertId] = useState<string>(
    awsExams[0]?.id ?? ""
  );
  const [selectedExamType, setSelectedExamType] = useState<ExamType>(
    examTypes[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedCert = useMemo<AWSExam | undefined>(() => {
    return awsExams.find((cert) => cert.id === selectedCertId) || awsExams[0];
  }, [selectedCertId]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!selectedCert) {
    return null;
  }

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
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Subscribe</h1>
            <p className="text-gray-600">
              Choose a certification and exam type to continue.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select an AWS certification</CardTitle>
                <CardDescription>
                  Pick a certification to see a preview and available exam
                  types.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  Certification
                </label>
                <select
                  value={selectedCertId}
                  onChange={(e) => setSelectedCertId(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                >
                  {awsExams.map((cert) => (
                    <option key={cert.id} value={cert.id}>
                      {cert.title}
                    </option>
                  ))}
                </select>
                {selectedCert && (
                  <p className="text-sm text-gray-600">
                    {selectedCert.description}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Select exam type</CardTitle>
                <CardDescription>
                  Choose how you want to practice for this certification.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {examTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedExamType(type)}
                    className={`text-left border rounded-lg p-4 transition-colors ${
                      selectedExamType.id === type.id
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">{type.name}</div>
                      <div className="text-indigo-700 font-bold">
                        {type.price}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {type.description}
                    </p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      {type.details.map((detail) => (
                        <li key={detail} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                className="flex items-center gap-2"
                onClick={async () => {
                  if (!selectedCert || !selectedCertId) return;
                  setIsSubmitting(true);
                  setError(null);
                  try {
                    const resp = await fetch("/api/checkout-link", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        cert_id: selectedCertId,
                        tier_id: selectedExamType.id,
                        customer_email: user?.email,
                        metadata: {
                          cert: selectedCertId,
                          tier: selectedExamType.id,
                        },
                      }),
                    });
                    if (!resp.ok) {
                      const msg = await resp.text();
                      throw new Error(msg || "Failed to create checkout link");
                    }
                    const data = await resp.json();
                    if (data?.url) {
                      window.location.href = data.url;
                    } else {
                      throw new Error("No checkout URL returned");
                    }
                  } catch (err: any) {
                    setError(err?.message || "Checkout failed");
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Redirecting..." : "Continue to payment"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            {error && (
              <p className="text-sm text-red-600 text-right">{error}</p>
            )}
          </div>

          <div className="space-y-4">
            <Card className="sticky top-6">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-lg ${selectedCert.color} text-white`}
                    >
                      {selectedCert.icon}
                    </div>
                    <div>
                      <CardTitle>{selectedCert.title}</CardTitle>
                      <Badge
                        className={getDifficultyColor(selectedCert.difficulty)}
                      >
                        {selectedCert.difficulty}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700 mb-4">
                  {selectedCert.description}
                </CardDescription>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Clock className="h-4 w-4" />
                    {selectedCert.duration}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <BookOpen className="h-4 w-4" />
                    {selectedCert.questions} questions
                  </div>
                </div>
                <div className="border rounded-lg p-4 bg-indigo-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600">Selected type</div>
                      <div className="font-semibold">
                        {selectedExamType.name}
                      </div>
                    </div>
                    <div className="text-xl font-bold text-indigo-700">
                      {selectedExamType.price}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {selectedExamType.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
