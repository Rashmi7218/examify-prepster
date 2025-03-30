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
  learnMoreLink?: { text: string; url: string };
  tasks?: { id: string; text: string; correctId: string }[];
  correctOptionIds?: string[];
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

  const renderOption = (option: { id: string; text: string }, letter: string) => {
    const isSelected = selectedOptionId === option.id;
    const isCorrectOption = option.id === question.correctOptionId;
    const showCorrectIndicator = isAnswered && isCorrectOption;
    const showIncorrectIndicator = isAnswered && isSelected && !isCorrect;

    return (
      <button
        key={option.id}
        className={`
          w-full text-left p-4 mb-3 border rounded-md transition-all
          ${isSelected ? "border-examify-blue" : "border-gray-200"}
          ${showCorrectIndicator ? "bg-green-50 border-green-500" : ""}
          ${showIncorrectIndicator ? "bg-red-50 border-red-500" : ""}
          ${!isAnswered ? "hover:bg-gray-50" : ""}
        `}
        onClick={() => handleOptionSelect(option.id)}
        disabled={isAnswered}
      >
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center mr-3 flex-shrink-0">
            {letter}
          </div>
          <span className="flex-1">{option.text}</span>
          {showCorrectIndicator && (
            <CheckCircle className="text-green-500 ml-2 flex-shrink-0" size={20} />
          )}
          {showIncorrectIndicator && (
            <XCircle className="text-red-500 ml-2 flex-shrink-0" size={20} />
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="question-card">
      <h3 className="text-xl font-medium mb-6">{question.text}</h3>
      
      <div className="space-y-2 mb-6">
        {question.options.map((option, index) => 
          renderOption(option, String.fromCharCode(65 + index)) // A, B, C, D, etc.
        )}
      </div>

      {showExplanation && selectedOptionId && (
        <AnswerExplanation
          isCorrect={isCorrect}
          explanation={question.explanation}
          learnMoreLink={question.learnMoreLink}
        />
      )}

      <div className="mt-8 flex justify-end">
        {!isAnswered ? (
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedOptionId}
            className="bg-indigo-900 hover:bg-indigo-800 text-white"
          >
            Confirm
          </Button>
        ) : (
          <Button 
            onClick={isLastQuestion ? handleComplete : handleNext}
            className="bg-indigo-900 hover:bg-indigo-800 text-white"
          >
            Continue
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
