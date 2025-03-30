
import { QuestionType } from "@/components/QuestionCard";

// Function to convert raw JSON questions to QuestionType format
export const convertJsonToQuestions = (jsonQuestions: any[]): QuestionType[] => {
  return jsonQuestions.map((q, index) => {
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
      type: "single" as const,
      // Optional: Add learn more link if available in your JSON
      learnMoreLink: q.learnMoreLink
    };
  });
};

// Using the new JSON data provided by the user
const athenaJsonQuestions = [
  {
    "question": "Which of the following services is a managed full-text search service?",
    "options": [
      "Amazon Athena",
      "Amazon OpenSearch Service",
      "Amazon Redshift",
      "AWS Glue"
    ],
    "answer": "Amazon OpenSearch Service",
    "explanation": "The image describes Amazon OpenSearch Service as a managed full-text search service."
  },
  {
    "question": "Which of the following is true about AWS Glue Data Catalog?",
    "options": [
      "It is a serverless data integration service.",
      "It is a data lake to centrally govern, secure, and globally share data for analytics and machine learning",
      "It is a fully managed, Apache Hive Metastore-compatible catalog service.",
      "It allows you to measure and monitor the quality of your data"
    ],
    "answer": "It is a fully managed, Apache Hive Metastore-compatible catalog service.",
    "explanation": "According to the image, AWS Glue Data Catalog is a fully managed, Apache Hive Metastore-compatible catalog service."
  }
];

// Convert the JSON data to QuestionType
export const athenaQuestions = convertJsonToQuestions(athenaJsonQuestions);

// Replacing the old AI practitioner questions with the same new questions for now
// This ensures we don't have any old questions as requested
export const awsAIPractitionerQuestions: QuestionType[] = convertJsonToQuestions(athenaJsonQuestions);
