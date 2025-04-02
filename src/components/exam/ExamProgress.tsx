
import React from "react";
import { Clock, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

type ExamProgressProps = {
  currentQuestion: number;
  totalQuestions: number;
  timeRemaining: number;
  totalTime: number;
  editQuestion?: () => void;
  pauseExam?: () => void;
  isPaused?: boolean;
};

const ExamProgress: React.FC<ExamProgressProps> = ({
  currentQuestion,
  totalQuestions,
  timeRemaining,
  totalTime,
  editQuestion,
  pauseExam,
  isPaused = false,
}) => {
  // Format time remaining as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center py-4 border-b">
        <div className="text-lg font-medium">
          AWS Certified AI Practitioner Official Practice Question Set (AIF-C01 - English)
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-gray-600" />
            <div className="text-sm">
              <span className="font-medium">This Question: </span>
              {formatTime(timeRemaining)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-gray-600" /> 
            <div className="text-sm">
              <span className="font-medium">Total: </span>
              {formatTime(totalTime)}
            </div>
          </div>
          {pauseExam && (
            <Button 
              onClick={pauseExam}
              variant="outline"
              className="flex items-center gap-1 px-3 py-1"
              size="sm"
            >
              {isPaused ? (
                <>
                  <Play size={14} /> Resume Exam
                </>
              ) : (
                <>
                  <Pause size={14} /> Pause Exam
                </>
              )}
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-3 mt-4">
        <div className="text-sm font-medium">{currentQuestion}/{totalQuestions}</div>
        <div className="flex-1 relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-full bg-indigo-800"
            style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
          ></div>
        </div>
        {editQuestion && (
          <button onClick={editQuestion} className="p-2 text-gray-600 hover:text-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              <path d="m15 5 4 4"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ExamProgress;
