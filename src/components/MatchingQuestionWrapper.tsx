
import React, { useState } from "react";
import MatchingQuestion from "./MatchingQuestion";
import { Button } from "@/components/ui/button";
import AnswerExplanation from "./AnswerExplanation";

type MatchingQuestionWrapperProps = {
  questionText: string;
  tasks: { id: string; text: string; correctId: string }[];
  options: { id: string; text: string }[];
  onComplete: () => void;
  isLastQuestion: boolean;
  onNextQuestion: () => void;
  onCompleteExam: () => void;
  isReviewMode?: boolean;
  forceShowExplanation?: boolean;
  isCorrectOverride?: boolean;
  explanation?: string;
  learnMoreLink?: { text: string; url: string };
  userAnswers?: Record<string, string>; // Add userAnswers prop
};

const MatchingQuestionWrapper: React.FC<MatchingQuestionWrapperProps> = ({
  questionText,
  tasks,
  options,
  onComplete,
  isLastQuestion,
  onNextQuestion,
  onCompleteExam,
  isReviewMode = false,
  forceShowExplanation = false,
  isCorrectOverride,
  explanation = "",
  learnMoreLink,
  userAnswers = {} // Default to empty object
}) => {
  const [isAnswered, setIsAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(forceShowExplanation);

  const handleComplete = () => {
    onComplete();
    setIsAnswered(true);
    setShowExplanation(true);
  };

  return (
    <div>
      <MatchingQuestion 
        questionText={questionText}
        tasks={tasks}
        options={options}
        onComplete={handleComplete}
        isReviewMode={isReviewMode}
        userAnswers={userAnswers}
      />
      
      {showExplanation && explanation && (
        <div className="mt-6">
          <AnswerExplanation
            isCorrect={isCorrectOverride !== undefined ? isCorrectOverride : true}
            explanation={explanation}
            learnMoreLink={learnMoreLink}
          />
        </div>
      )}
      
      {(isAnswered || isReviewMode) && (
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
