
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import AnswerExplanation from "./AnswerExplanation";
import { CheckCircle, XCircle } from "lucide-react";

export type QuestionType = {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
  type: "single" | "multiple" | "truefalse";
};

type QuestionCardProps = {
  question: QuestionType;
  onNext: () => void;
  isLastQuestion: boolean;
  onComplete: () => void;
};

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onNext,
  isLastQuestion,
  onComplete,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleOptionSelect = (optionId: string) => {
    if (!isAnswered) {
      setSelectedOptionId(optionId);
    }
  };

  const handleSubmit = () => {
    if (selectedOptionId) {
      setIsAnswered(true);
      setShowExplanation(true);
    }
  };

  const handleNext = () => {
    setSelectedOptionId(null);
    setShowExplanation(false);
    setIsAnswered(false);
    onNext();
  };

  const handleComplete = () => {
    onComplete();
  };

  const isCorrect = selectedOptionId === question.correctOptionId;

  return (
    <div className="question-card">
      <h3 className="text-xl font-medium mb-4">{question.text}</h3>
      
      <div className="space-y-2 mb-6">
        {question.options.map((option) => (
          <button
            key={option.id}
            className={`option-btn ${
              selectedOptionId === option.id
                ? "selected"
                : ""
            } ${
              isAnswered && option.id === question.correctOptionId
                ? "correct"
                : ""
            } ${
              isAnswered && selectedOptionId === option.id && !isCorrect
                ? "incorrect"
                : ""
            }`}
            onClick={() => handleOptionSelect(option.id)}
            disabled={isAnswered}
          >
            <div className="flex items-center justify-between">
              <span>{option.text}</span>
              {isAnswered && option.id === question.correctOptionId && (
                <CheckCircle className="text-green-500" size={20} />
              )}
              {isAnswered && selectedOptionId === option.id && !isCorrect && (
                <XCircle className="text-red-500" size={20} />
              )}
            </div>
          </button>
        ))}
      </div>

      {showExplanation && selectedOptionId && (
        <AnswerExplanation
          isCorrect={isCorrect}
          explanation={question.explanation}
        />
      )}

      <div className="mt-6 flex justify-between">
        {!isAnswered ? (
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedOptionId}
            className="bg-examify-blue hover:bg-blue-600"
          >
            Submit Answer
          </Button>
        ) : (
          isLastQuestion ? (
            <Button 
              onClick={handleComplete}
              className="bg-examify-teal hover:bg-teal-600"
            >
              Complete Exam
            </Button>
          ) : (
            <Button 
              onClick={handleNext}
              className="bg-examify-blue hover:bg-blue-600"
            >
              Next Question
            </Button>
          )
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
