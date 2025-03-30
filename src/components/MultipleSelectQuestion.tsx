
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { XCircle, CheckCircle } from "lucide-react";

export type MultipleSelectOptionType = {
  id: string;
  text: string;
};

type MultipleSelectQuestionProps = {
  questionText: string;
  options: MultipleSelectOptionType[];
  correctOptionIds: string[];
  onConfirm: (selectedIds: string[]) => void;
};

const MultipleSelectQuestion: React.FC<MultipleSelectQuestionProps> = ({
  questionText,
  options,
  correctOptionIds,
  onConfirm,
}) => {
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [answered, setAnswered] = useState(false);

  const handleOptionToggle = (optionId: string) => {
    if (answered) return;

    setSelectedOptionIds((prev) => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };

  const handleConfirm = () => {
    setAnswered(true);
    onConfirm(selectedOptionIds);
  };

  const isOptionCorrect = (optionId: string) => {
    return correctOptionIds.includes(optionId);
  };

  const isOptionIncorrect = (optionId: string) => {
    return answered && selectedOptionIds.includes(optionId) && !correctOptionIds.includes(optionId);
  };

  return (
    <div className="question-container">
      <h3 className="text-lg font-medium mb-4">{questionText}</h3>
      <p className="mb-4 text-gray-700">Select the correct AWS service or feature from the following list for each task. Each AWS service or feature should be selected one or more times. (Select FIVE.)</p>
      
      <ul className="space-y-3">
        {options.map((option) => (
          <li key={option.id} className="flex items-start">
            <div 
              onClick={() => handleOptionToggle(option.id)}
              className={`
                flex items-start px-4 py-3 rounded-md border cursor-pointer select-none
                ${selectedOptionIds.includes(option.id) ? "border-examify-blue" : "border-gray-300"}
                ${isOptionCorrect(option.id) && answered ? "bg-green-50 border-green-500" : ""}
                ${isOptionIncorrect(option.id) ? "bg-red-50 border-red-500" : ""}
                ${answered ? "cursor-default" : "hover:bg-gray-50"}
              `}
            >
              <div className="flex items-center h-6 mr-3">
                <Checkbox 
                  id={`checkbox-${option.id}`}
                  checked={selectedOptionIds.includes(option.id)}
                  disabled={answered}
                  className="border-gray-400"
                  onCheckedChange={() => handleOptionToggle(option.id)}
                />
              </div>
              <label 
                htmlFor={`checkbox-${option.id}`}
                className="flex-1 cursor-pointer text-base"
              >
                {option.text}
              </label>
              {answered && isOptionCorrect(option.id) && (
                <CheckCircle className="text-green-500 flex-shrink-0 ml-2" size={20} />
              )}
              {isOptionIncorrect(option.id) && (
                <XCircle className="text-red-500 flex-shrink-0 ml-2" size={20} />
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-end mt-6">
        <Button 
          onClick={handleConfirm}
          disabled={selectedOptionIds.length === 0 || answered}
          className="bg-indigo-900 hover:bg-indigo-800 text-white"
        >
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default MultipleSelectQuestion;
