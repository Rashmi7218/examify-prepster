
import React, { useState } from "react";
import MatchingQuestion from "./MatchingQuestion";
import { Button } from "@/components/ui/button";
import { QuestionType } from "./QuestionCard";

type MatchingQuestionWrapperProps = {
  questionText: string;
  tasks: { id: string; text: string; correctId: string }[];
  options: { id: string; text: string }[];
  onComplete: () => void;
  isLastQuestion: boolean;
  onNextQuestion: () => void;
  onCompleteExam: () => void;
};

const MatchingQuestionWrapper: React.FC<MatchingQuestionWrapperProps> = ({
  questionText,
  tasks,
  options,
  onComplete,
  isLastQuestion,
  onNextQuestion,
  onCompleteExam
}) => {
  const [isAnswered, setIsAnswered] = useState(false);

  const handleComplete = () => {
    onComplete();
    setIsAnswered(true);
  };

  return (
    <div>
      <MatchingQuestion 
        questionText={questionText}
        tasks={tasks}
        options={options}
        onComplete={handleComplete}
      />
      
      {isAnswered && (
        <div className="mt-8 flex justify-end">
          <Button 
            onClick={isLastQuestion ? onCompleteExam : onNextQuestion}
            className="bg-indigo-900 hover:bg-indigo-800 text-white"
          >
            {isLastQuestion ? "Complete Exam" : "Continue"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default MatchingQuestionWrapper;
