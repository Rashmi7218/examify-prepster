
import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

type AnswerExplanationProps = {
  isCorrect: boolean;
  explanation: string;
  learnMoreLink?: { text: string; url: string };
};

const AnswerExplanation: React.FC<AnswerExplanationProps> = ({
  isCorrect,
  explanation,
  learnMoreLink,
}) => {
  return (
    <div className={`explanation-card p-6 mt-6 rounded-md border ${isCorrect ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
      <div className="flex items-center gap-2 mb-4">
        {isCorrect ? (
          <>
            <CheckCircle className="text-green-600" size={24} />
            <h4 className="font-medium text-green-700 text-lg">Correct</h4>
          </>
        ) : (
          <>
            <XCircle className="text-red-600" size={24} />
            <h4 className="font-medium text-red-700 text-lg">Incorrect</h4>
          </>
        )}
      </div>
      <div className="text-gray-800 space-y-3">
        <p className="text-base">{explanation}</p>
        
        {learnMoreLink && (
          <div className="mt-4">
            <p>Learn more about <a href={learnMoreLink.url} className="text-blue-600 hover:underline">{learnMoreLink.text}</a>.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnswerExplanation;
