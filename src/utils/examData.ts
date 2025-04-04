
import { QuestionType } from "@/components/QuestionCard";

// Function to convert raw JSON questions to QuestionType format
export const convertJsonToQuestions = (jsonQuestions: any[]): QuestionType[] => {
  return jsonQuestions.map((q, index) => {
    if (q.type === "type-2") {
      // For matching type questions
      const tasks = Object.keys(q.answer).map((task, taskIndex) => ({
        id: `task-${taskIndex}`,
        text: task,
        correctId: q.answer[task]
      }));

      // Create options from unique answer values
      const uniqueOptions = [...new Set(Object.values(q.answer))];
      const options = uniqueOptions.map((opt, optIndex) => ({
        id: opt.toString(),
        text: opt.toString()
      }));

      return {
        id: `q${index + 1}`,
        text: q.question,
        options,
        tasks,
        explanation: q.explanation,
        type: "type-2" as const,
        learnMoreLink: q.learnMoreLink
      };
    } else {
      // For single-select questions (type-1 or default)
      // Create options array with id and text properties
      const options = q.options.map((opt: string, optIndex: number) => ({
        id: optIndex.toString(),
        text: opt
      }));

      // Find correct option id
      const correctOptionId = options.findIndex(
        (opt: { text: string }) => opt.text === q.answer
      ).toString();

      return {
        id: `q${index + 1}`,
        text: q.question,
        options,
        correctOptionId,
        explanation: q.explanation,
        type: q.type || "single" as const,
        learnMoreLink: q.learnMoreLink
      };
    }
  });
};

// Temporary placeholder data for exam questions until database integration
export const athenaQuestions: QuestionType[] = [];
export const awsAIPractitionerQuestions: QuestionType[] = [];
