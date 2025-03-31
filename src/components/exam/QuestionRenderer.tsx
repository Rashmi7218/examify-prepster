
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
};

const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  onNext,
  onComplete,
  isLastQuestion,
  onMultipleSelectSubmit
}) => {
  switch (question.type) {
    case 'multiple':
      return (
        <MultipleSelectQuestion
          questionText={question.text}
          options={question.options}
          correctOptionIds={question.correctOptionIds || []}
          onConfirm={onMultipleSelectSubmit}
        />
      );
    
    case 'type-2':
      return (
        <MatchingQuestion
          questionText={question.text}
          tasks={question.tasks || []}
          options={question.options}
          onComplete={isLastQuestion ? onComplete : onNext}
        />
      );
      
    case 'type-1':
    case 'single':
    default:
      return (
        <QuestionCard
          question={question}
          onNext={onNext}
          isLastQuestion={isLastQuestion}
          onComplete={onComplete}
        />
      );
  }
};

export default QuestionRenderer;
