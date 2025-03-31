
import React from "react";
import QuestionCard, { QuestionType } from "@/components/QuestionCard";
import MultipleSelectQuestion from "@/components/MultipleSelectQuestion";
import MatchingQuestion from "@/components/MatchingQuestion";

type QuestionRendererProps = {
  question: QuestionType;
  onNext: () => void;
  onComplete: () => void;
  isLastQuestion: boolean;
  onMultipleSelectSubmit: (selectedIds: string[]) => void;
  onAnswerSubmit: (questionId: string, isCorrect: boolean, timeTaken: number) => void;
  startTime: number;
};

const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  onNext,
  onComplete,
  isLastQuestion,
  onMultipleSelectSubmit,
  onAnswerSubmit,
  startTime
}) => {
  const handleQuestionComplete = (isCorrect: boolean) => {
    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - startTime) / 1000); // Time in seconds
    onAnswerSubmit(question.id, isCorrect, timeTaken);
    
    if (isLastQuestion) {
      onComplete();
    } else {
      onNext();
    }
  };

  const handleMultipleSelectSubmit = (selectedIds: string[]) => {
    onMultipleSelectSubmit(selectedIds);
    
    // Determine if answer is correct
    const correctIds = question.correctOptionIds || [];
    const isCorrect = arraysEqual(selectedIds.sort(), correctIds.sort());
    
    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - startTime) / 1000); // Time in seconds
    onAnswerSubmit(question.id, isCorrect, timeTaken);
  };

  // Helper function to compare arrays
  const arraysEqual = (a: any[], b: any[]) => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  switch (question.type) {
    case 'multiple':
      return (
        <MultipleSelectQuestion
          questionText={question.text}
          options={question.options}
          correctOptionIds={question.correctOptionIds || []}
          onConfirm={handleMultipleSelectSubmit}
        />
      );
    
    case 'type-2':
      return (
        <MatchingQuestion
          questionText={question.text}
          tasks={question.tasks || []}
          options={question.options}
          onComplete={() => handleQuestionComplete(true)} // For now, we'll assume matching questions are always correct
        />
      );
      
    case 'type-1':
    case 'single':
    default:
      return (
        <QuestionCard
          question={question}
          onNext={() => handleQuestionComplete(true)}
          isLastQuestion={isLastQuestion}
          onComplete={() => handleQuestionComplete(true)}
          onAnswerSelected={(isCorrect) => handleQuestionComplete(isCorrect)}
        />
      );
  }
};

export default QuestionRenderer;
