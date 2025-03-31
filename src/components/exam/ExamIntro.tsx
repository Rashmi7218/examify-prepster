
import React from "react";
import { Button } from "@/components/ui/button";

type ExamIntroProps = {
  examType: string;
  onStart: () => void;
  onReturn: () => void;
};

const ExamIntro: React.FC<ExamIntroProps> = ({ examType, onStart, onReturn }) => {
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
              onClick={onReturn}
            >
              Return To Product Dashboard
            </Button>
            
            <Button 
              onClick={onStart} 
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Start
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamIntro;
