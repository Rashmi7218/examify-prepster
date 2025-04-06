
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, XCircle } from "lucide-react";
import AnswerExplanation from "./AnswerExplanation";

type MultipleSelectQuestionProps = {
  questionText: string;
  options: { id: string; text: string }[];
  correctOptionIds: string[];
  onConfirm: (selectedIds: string[]) => void;
  isReviewMode?: boolean;
  preSelectedIds?: string[];
  forceShowExplanation?: boolean;
  isCorrectOverride?: boolean;
  explanation?: string;
  learnMoreLink?: { text: string; url: string };
};

const MultipleSelectQuestion: React.FC<MultipleSelectQuestionProps> = ({
  questionText,
  options,
  correctOptionIds,
  onConfirm,
  isReviewMode = false,
  preSelectedIds = [],
  forceShowExplanation = false,
  isCorrectOverride,
  explanation = "",
  learnMoreLink
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Helper function to compare arrays
  const arraysEqual = (a: string[], b: string[]) => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  // Initialize with preselected IDs if in review mode
  useEffect(() => {
    if (isReviewMode && preSelectedIds && preSelectedIds.length > 0) {
      setSelectedIds(preSelectedIds);
      setIsSubmitted(true);
      setShowExplanation(true);
    }
    
    // Force explanation to show if needed
    if (forceShowExplanation) {
      setShowExplanation(true);
      setIsSubmitted(true);
    }
  }, [isReviewMode, preSelectedIds, forceShowExplanation]);

  const toggleOption = (id: string) => {
    if (isSubmitted) return;
    
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setShowExplanation(true);
    onConfirm(selectedIds);
  };

  // Check if the answer is correct
  const isCorrect = isCorrectOverride !== undefined 
    ? isCorrectOverride 
    : arraysEqual(selectedIds.sort(), correctOptionIds.sort());

  const renderOption = (option: { id: string; text: string }, index: number) => {
    const isSelected = selectedIds.includes(option.id);
    const isCorrectOption = correctOptionIds.includes(option.id);
    const showCorrectIndicator = isSubmitted && isCorrectOption;
    const showIncorrectIndicator = isSubmitted && isSelected && !isCorrectOption;

    return (
      <div 
        key={option.id} 
        className={`
          flex items-start p-4 border rounded-md mb-3 cursor-pointer
          ${isSelected ? "bg-blue-50 border-blue-300" : "border-gray-200"}
          ${showCorrectIndicator ? "bg-green-50 border-green-300" : ""}
          ${showIncorrectIndicator ? "bg-red-50 border-red-300" : ""}
        `}
        onClick={() => toggleOption(option.id)}
      >
        <Checkbox 
          id={`option-${option.id}`}
          checked={isSelected}
          onCheckedChange={() => toggleOption(option.id)}
          disabled={isSubmitted}
          className="mt-1 mr-3"
        />
        <div className="flex-1">
          <label 
            htmlFor={`option-${option.id}`}
            className="text-base cursor-pointer"
          >
            {option.text}
          </label>
        </div>
        {showCorrectIndicator && (
          <CheckCircle className="text-green-500 ml-2 flex-shrink-0" size={20} />
        )}
        {showIncorrectIndicator && (
          <XCircle className="text-red-500 ml-2 flex-shrink-0" size={20} />
        )}
      </div>
    );
  };

  return (
    <div className="multiple-select-question">
      <h3 className="text-xl font-medium mb-6">{questionText}</h3>
      
      <div className="text-sm text-gray-500 mb-4">
        Select all that apply. Choose at least one option.
      </div>
      
      <div className="space-y-2 mb-6">
        {options.map((option, index) => renderOption(option, index))}
      </div>

      {(showExplanation || forceShowExplanation) && explanation && (
        <AnswerExplanation
          isCorrect={isCorrect}
          explanation={explanation}
          learnMoreLink={learnMoreLink}
        />
      )}

      {!isSubmitted && !isReviewMode && (
        <div className="mt-8 flex justify-end">
          <Button 
            onClick={handleSubmit} 
            disabled={selectedIds.length === 0}
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
