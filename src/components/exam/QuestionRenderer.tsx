import React from "react";
import QuestionCard, { QuestionType } from "@/components/QuestionCard";
import MultipleSelectQuestion from "@/components/MultipleSelectQuestion";
import MatchingQuestionWrapper from "@/components/MatchingQuestionWrapper";

type QuestionRendererProps = {
  question: QuestionType;
  onNext: () => void;
  onComplete: () => void;
  isLastQuestion: boolean;
  onMultipleSelectSubmit: (selectedIds: string[]) => void;
  onAnswerSubmit: (questionId: string, isCorrect: boolean, timeTaken: number) => void;
  startTime: number;
  isReviewMode?: boolean;
  preSelectedAnswer?: string | string[] | Record<string, string> | null;
  forceShowExplanation?: boolean;
  isCorrectOverride?: boolean;
};

const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  onNext,
  onComplete,
  isLastQuestion,
  onMultipleSelectSubmit,
  onAnswerSubmit,
  startTime,
  isReviewMode = false,
  preSelectedAnswer = null,
  forceShowExplanation = false,
  isCorrectOverride
}) => {
  const handleQuestionComplete = (isCorrect: boolean) => {
    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - startTime) / 1000); // Time in seconds
    onAnswerSubmit(question.id, isCorrect, timeTaken);
  };

  const handleMultipleSelectSubmit = (selectedIds: string[]) => {
    onMultipleSelectSubmit(selectedIds);
    
    const correctIds = question.correctOptionIds || [];
    const isCorrect = arraysEqual(selectedIds.sort(), correctIds.sort());
    
    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - startTime) / 1000); // Time in seconds
    onAnswerSubmit(question.id, isCorrect, timeTaken);
  };

  const arraysEqual = (a: any[], b: any[]) => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  let userAnswers = {};
  if (isReviewMode && question.type === 'type-2' && preSelectedAnswer && typeof preSelectedAnswer === 'object' && !Array.isArray(preSelectedAnswer)) {
    userAnswers = preSelectedAnswer as Record<string, string>;
  }

  const determineIsCorrect = () => {
    if (isCorrectOverride !== undefined) {
      return isCorrectOverride;
    }
    
    if (isReviewMode) {
      return true;
    }
    
    return false;
  };

  const isCorrect = determineIsCorrect();

  switch (question.type) {
    case 'multiple':
    case 'type-3':
      return (
        <MultipleSelectQuestion
          questionText={question.text}
          options={question.options}
          correctOptionIds={question.correctOptionIds || []}
          onConfirm={handleMultipleSelectSubmit}
          isReviewMode={isReviewMode}
          preSelectedIds={Array.isArray(preSelectedAnswer) ? preSelectedAnswer : []}
          forceShowExplanation={forceShowExplanation}
          isCorrectOverride={isCorrect}
          explanation={question.explanation}
          learnMoreLink={question.learnMoreLink}
          onNext={onNext}
          onComplete={onComplete}
          isLastQuestion={isLastQuestion}
        />
      );
    
    case 'type-2':
      return (
        <MatchingQuestionWrapper
          questionText={question.text}
          tasks={question.tasks || []}
          options={question.options}
          onComplete={() => {
            handleQuestionComplete(true);
          }}
          isLastQuestion={isLastQuestion}
          onNextQuestion={onNext}
          onCompleteExam={onComplete}
          isReviewMode={isReviewMode}
          forceShowExplanation={forceShowExplanation}
          isCorrectOverride={isCorrect}
          explanation={question.explanation}
          learnMoreLink={question.learnMoreLink}
          userAnswers={userAnswers}
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
          onAnswerSelected={handleQuestionComplete}
          isReviewMode={isReviewMode}
          preSelectedOptionId={typeof preSelectedAnswer === 'string' ? preSelectedAnswer : null}
          forceShowExplanation={forceShowExplanation}
          isCorrectOverride={isCorrect}
        />
      );
  }
};

export default QuestionRenderer;
