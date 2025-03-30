
import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

type AnswerExplanationProps = {
  isCorrect: boolean;
  explanation: string;
};

const AnswerExplanation: React.FC<AnswerExplanationProps> = ({
  isCorrect,
  explanation,
}) => {
  return (
    <div className={`explanation-card ${isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
      <div className="flex items-center gap-2 mb-2">
        {isCorrect ? (
          <>
            <CheckCircle className="text-green-500" size={20} />
            <h4 className="font-medium text-green-700">Correct!</h4>
          </>
        ) : (
          <>
            <XCircle className="text-red-500" size={20} />
            <h4 className="font-medium text-red-700">Incorrect</h4>
          </>
        )}
      </div>
      <div className="text-gray-700">
        <p><span className="font-medium">Explanation:</span> {explanation}</p>
      </div>
    </div>
  );
};

export default AnswerExplanation;
