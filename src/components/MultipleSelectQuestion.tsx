
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import AnswerExplanation from "./AnswerExplanation";
import { CheckCircle, XCircle } from "lucide-react";

interface MultipleSelectQuestionProps {
  questionText: string;
  options: { id: string; text: string }[];
  correctOptionIds: string[];
  onConfirm: (selectedIds: string[]) => void;
  isReviewMode?: boolean;
  preSelectedIds?: string[];
}

const MultipleSelectQuestion: React.FC<MultipleSelectQuestionProps> = ({
  questionText,
  options,
  correctOptionIds,
  onConfirm,
  isReviewMode = false,
  preSelectedIds = []
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isReviewMode && preSelectedIds.length > 0) {
      setSelectedOptions(preSelectedIds);
      setIsSubmitted(true);
    }
  }, [isReviewMode, preSelectedIds]);

  const handleOptionToggle = (optionId: string) => {
    if (isSubmitted) return;
    
    setSelectedOptions((prev) => {
      if (prev.includes(optionId)) {
        return prev.filter((id) => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };

  const handleConfirm = () => {
    setIsSubmitted(true);
    onConfirm(selectedOptions);
  };

  const isOptionCorrect = (optionId: string) => correctOptionIds.includes(optionId);
  
  const isAnswerCorrect = () => {
    if (selectedOptions.length !== correctOptionIds.length) return false;
    
    for (const id of selectedOptions) {
      if (!correctOptionIds.includes(id)) return false;
    }
    
    return true;
  };

  return (
    <div className="multiple-select-question">
      <div className="mb-4">
        <h3 className="text-xl font-medium mb-2">{questionText}</h3>
        <p className="text-gray-500 text-sm mb-6">Select all that apply.</p>
      </div>
      
      <div className="space-y-4 mb-6">
        {options.map((option, index) => {
          const isSelected = selectedOptions.includes(option.id);
          const isCorrect = isOptionCorrect(option.id);
          const showCorrectIndicator = isSubmitted && isCorrect;
          const showIncorrectIndicator = isSubmitted && isSelected && !isCorrect;
          
          return (
            <div
              key={option.id}
              className={`
                p-4 border rounded-md flex items-center cursor-pointer transition-all
                ${isSelected ? "border-examify-blue" : "border-gray-200"}
                ${showCorrectIndicator ? "bg-green-50 border-green-500" : ""}
                ${showIncorrectIndicator ? "bg-red-50 border-red-500" : ""}
              `}
              onClick={() => handleOptionToggle(option.id)}
            >
              <Checkbox
                id={`option-${option.id}`}
                checked={isSelected}
                className="mr-3"
                disabled={isSubmitted}
              />
              <label
                htmlFor={`option-${option.id}`}
                className="flex-1 cursor-pointer"
              >
                {option.text}
              </label>
              {showCorrectIndicator && (
                <CheckCircle className="text-green-500 ml-2" size={20} />
              )}
              {showIncorrectIndicator && (
                <XCircle className="text-red-500 ml-2" size={20} />
              )}
            </div>
          );
        })}
      </div>
      
      {isSubmitted && (
        <AnswerExplanation
          isCorrect={isAnswerCorrect()}
          explanation={`The correct answers are: ${correctOptionIds.map(
            (id) => options.find((opt) => opt.id === id)?.text
          ).join(", ")}`}
        />
      )}
      
      {!isSubmitted && !isReviewMode && (
        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleConfirm}
            disabled={selectedOptions.length === 0}
            className="bg-indigo-900 hover:bg-indigo-800 text-white"
          >
            Confirm
          </Button>
        </div>
      )}
    </div>
  );
};

export default MultipleSelectQuestion;
