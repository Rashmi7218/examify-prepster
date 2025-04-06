
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
    } else if (q.type === "type-3") {
      // For multiple choice questions with multiple correct answers
      const options = q.options.map((opt: string, optIndex: number) => ({
        id: optIndex.toString(),
        text: opt
      }));

      // Find all correct option ids
      const correctOptionIds = q.answer.map((answer: string) => {
        const foundOption = options.find(opt => opt.text === answer);
        return foundOption ? foundOption.id : null;
      }).filter(Boolean);

      return {
        id: `q${index + 1}`,
        text: q.question,
        options,
        correctOptionIds,
        explanation: q.explanation,
        type: "type-3" as const,
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

// Updated questions with all the examples
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
    "explanation": "The image describes Amazon OpenSearch Service as a managed full-text search service.",
    "type": "type-1"
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
    "explanation": "According to the image, AWS Glue Data Catalog is a fully managed, Apache Hive Metastore-compatible catalog service.",
    "type": "type-1"
  },
  {
    "question": "Which of the following is NOT a supported SerDe (Serializer/Deserializer) in Athena?",
    "options": [
      "org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe",
      "com.amazon.tonhiveeserde.ToHiveSerDe",
      "org.apache.hadoop.hive.serde2.RegexSerde",
      "com.databricks.spark.csv.CsvSerde"
    ],
    "answer": "com.databricks.spark.csv.CsvSerde",
    "explanation": "The image shows a list of built-in SerDe supported by Athena. 'com.databricks.spark.csv.CsvSerde' is not on the list.",
    "type": "type-1"
  },
  {
    "question": "What is SerDe used for in Athena?",
    "options": [
      "Defining the table schema.",
      "Parsing data from different data formats.",
      "Defining DDL configuration",
      "Specifying the location of data"
    ],
    "answer": "Parsing data from different data formats.",
    "explanation": "According to the image, SerDe is a serialization and deserialization library for parsing data from different data formats, such as CSV, JSON, Parquet, and ORC.",
    "type": "type-1"
  },
  {
    "question": "Which of the following is a visual data preparation tool that enables users to clean and normalize data without writing any code?",
    "options": [
      "AWS Glue Data Catalog",
      "AWS Glue Data Brew",
      "AWS Glue Studio",
      "AWS Lake Formation"
    ],
    "answer": ["AWS Glue Data Brew", "AWS Glue Data Catalog"],
    "explanation": "The image describes AWS Glue Data Brew as a visual data preparation tool enabling users to clean and normalize data without coding.",
    "type": "type-3"
  },
  {
    "type": "type-2",
    "question": "Select the correct AWS service or feature from the following list for each task. Each AWS service or feature should be selected one or more times. (Select FIVE.)",
    "options": [
      "Guardrails for Amazon Bedrock",
      "AWS Identity and Access Management (IAM)"
    ],
    "answer": {
      "Implement identity verification and resource-level access control.": "AWS Identity and Access Management (IAM)",
      "Set policies to avoid specific topics in a generative AI application.": "Guardrails for Amazon Bedrock",
      "Filter harmful content based on defined thresholds for categories.": "Guardrails for Amazon Bedrock",
      "Define user roles and permissions to access Amazon Bedrock.": "AWS Identity and Access Management (IAM)",
      "Monitor and analyze user inputs to ensure compliance with safety policies.": "Guardrails for Amazon Bedrock"
    },
    "explanation": "Amazon Bedrock guardrails help control AI-generated content, ensuring alignment with safety and compliance policies. They are used to filter harmful content, avoid specific topics, and monitor user inputs. AWS IAM is used for access control, identity management, defining user roles, and setting permissions in AWS environments, including Amazon Bedrock."
  }
];

// Convert the JSON data to QuestionType
export const athenaQuestions = convertJsonToQuestions(athenaJsonQuestions);

// Using the same questions for the AI practitioner questions for now
export const awsAIPractitionerQuestions: QuestionType[] = athenaQuestions;
