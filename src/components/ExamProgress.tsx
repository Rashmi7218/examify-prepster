
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";

type ExamProgressProps = {
  currentQuestion: number;
  totalQuestions: number;
  timeRemaining: number;
  totalTime: number;
};

const ExamProgress: React.FC<ExamProgressProps> = ({
  currentQuestion,
  totalQuestions,
  timeRemaining,
  totalTime,
}) => {
  const progressPercentage = (currentQuestion / totalQuestions) * 100;
  const timePercentage = (timeRemaining / totalTime) * 100;
  
  // Format time remaining as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex justify-between items-center">
        <div className="font-medium">
          Question {currentQuestion} of {totalQuestions}
        </div>
        <div className="flex items-center space-x-2 text-examify-gray">
          <Clock size={18} />
          <span>{formatTime(timeRemaining)}</span>
        </div>
      </div>
      <Progress value={progressPercentage} className="h-2 bg-gray-200" />
    </div>
  );
};

export default ExamProgress;
