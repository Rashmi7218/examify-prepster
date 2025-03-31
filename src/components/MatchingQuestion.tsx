
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { CheckCircle, XCircle } from "lucide-react";

type TaskItem = {
  id: string;
  text: string;
  correctId: string;
};

type MatchingQuestionProps = {
  questionText: string;
  tasks: TaskItem[];
  options: { id: string; text: string }[];
  onComplete: () => void;
};

const MatchingQuestion: React.FC<MatchingQuestionProps> = ({
  questionText,
  tasks,
  options,
  onComplete,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelectChange = (taskId: string, value: string) => {
    if (submitted) return;
    
    setSelectedAnswers((prev) => ({
      ...prev,
      [taskId]: value,
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const isAnswerCorrect = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    return task && selectedAnswers[taskId] === task.correctId;
  };

  const getCorrectAnswer = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    return task ? task.correctId : "";
  };

  const allQuestionsAnswered = tasks.every(task => selectedAnswers[task.id]);

  return (
    <div className="question-container">
      <h3 className="text-lg font-medium mb-4">{questionText}</h3>
      
      <div className="space-y-6 mb-6">
        <div className="flex flex-col space-y-2 mb-4">
          <ul className="mb-2">
            {options.map((option) => (
              <li key={option.id} className="flex items-center">
                <span className="text-sm font-medium">• {option.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {tasks.map((task) => (
          <div key={task.id} className="mb-4">
            <div className="flex items-start mb-2">
              <div className="flex-1">
                <p className="text-base">{task.text}</p>
              </div>
              
              <div className="ml-4 w-80">
                {!submitted ? (
                  <Select
                    onValueChange={(value) => handleSelectChange(task.id, value)}
                    value={selectedAnswers[task.id] || ""}
                    disabled={submitted}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.text}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className={`
                    flex items-center p-2 rounded-md border
                    ${isAnswerCorrect(task.id) ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"}
                  `}>
                    <span className="flex-1">
                      {options.find(o => o.id === selectedAnswers[task.id])?.text || 'Not selected'}
                    </span>
                    {isAnswerCorrect(task.id) ? (
                      <CheckCircle className="text-green-500 ml-2" size={20} />
                    ) : (
                      <XCircle className="text-red-500 ml-2" size={20} />
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {submitted && !isAnswerCorrect(task.id) && (
              <div className="ml-auto mr-0 w-80 text-right">
                <p className="text-sm text-green-600">
                  Correct: {options.find(o => o.id === getCorrectAnswer(task.id))?.text}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        {!submitted ? (
          <Button 
            onClick={handleSubmit}
            disabled={!allQuestionsAnswered}
            className="bg-indigo-900 hover:bg-indigo-800 text-white"
          >
            Confirm
          </Button>
        ) : (
          <Button 
            onClick={onComplete}
            className="bg-indigo-900 hover:bg-indigo-800 text-white"
          >
            Continue
          </Button>
        )}
      </div>
    </div>
  );
};

export default MatchingQuestion;
