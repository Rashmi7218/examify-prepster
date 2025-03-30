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

// Sample JSON data (the one provided in the request)
export const sampleJsonQuestions = [
  {
    "question": "Which of the following is NOT a supported SerDe (Serializer/Deserializer) in Athena?",
    "options": [
      "org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe",
      "com.amazon.tonhiveeserde.ToHiveSerDe",
      "org.apache.hadoop.hive.serde2.RegexSerde",
      "com.databricks.spark.csv.CsvSerde"
    ],
    "answer": "com.databricks.spark.csv.CsvSerde",
    "explanation": "The image shows a list of built-in SerDe supported by Athena. 'com.databricks.spark.csv.CsvSerde' is not on the list."
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
    "explanation": "According to the image, SerDe is a serialization and deserialization library for parsing data from different data formats, such as CSV, JSON, Parquet, and ORC."
  }
];

// Convert sample JSON to QuestionType
export const athenaQuestions = convertJsonToQuestions(sampleJsonQuestions);

// Mock AWS exam data for AI Practitioner (keep this for backwards compatibility)
export const awsAIPractitionerQuestions: QuestionType[] = [
  {
    id: "q1",
    text: "What is a valid data format for instruction-based fine-tuning?",
    options: [
      { id: "a", text: "Images that are labeled with categories" },
      { id: "b", text: "Playlists that are curated with recommended music" },
      { id: "c", text: "Prompt-response text pairs" },
      { id: "d", text: "Audio files with transcriptions" },
    ],
    correctOptionId: "c",
    explanation: "Prompt-response text pairs are a valid data format for instruction-based fine-tuning. This format includes examples of prompts and their corresponding desired responses, allowing the model to learn the pattern between instructions and expected outputs.",
    type: "single",
    learnMoreLink: { text: "Amazon Bedrock fine-tuning", url: "https://docs.aws.amazon.com/bedrock/latest/userguide/fine-tuning.html" }
  },
  {
    id: "q2",
    text: "A travel company wants to use a pre-trained generative AI model to generate background images for marketing materials. The company does not have ML expertise. Additionally, the company does not want to customize and host the ML model.",
    options: [
      { id: "a", text: "Amazon Bedrock" },
      { id: "b", text: "Amazon SageMaker JumpStart" },
    ],
    correctOptionId: "a",
    explanation: "Correct. Amazon Bedrock is a fully managed service that provides a unified API to access popular foundation models (FMs). Amazon Bedrock supports image generation models from providers such as Stability AI or AWS. You can use Amazon Bedrock to consume FMs through a unified API without the need to train, host, or manage ML models. This is the most suitable solution for a company that does not want to train or manage ML models for image generation.",
    type: "single",
    learnMoreLink: { text: "Amazon Bedrock", url: "https://aws.amazon.com/bedrock/" }
  },
  {
    id: "q3",
    text: "Select the correct AWS service or feature from the following list for each task. Each AWS service or feature should be selected one or more times. (Select FIVE.)",
    options: [
      { id: "guardrails", text: "Guardrails for Amazon Bedrock" },
      { id: "iam", text: "AWS Identity and Access Management (IAM)" },
    ],
    tasks: [
      { id: "task1", text: "Implement identity verification and resource-level access control.", correctId: "iam" },
      { id: "task2", text: "Set policies to avoid specific topics in a generative AI application.", correctId: "guardrails" },
      { id: "task3", text: "Filter harmful content based on defined thresholds for categories.", correctId: "guardrails" },
      { id: "task4", text: "Define user roles and permissions to access Amazon Bedrock.", correctId: "iam" },
      { id: "task5", text: "Monitor and analyze user inputs to ensure compliance with safety policies.", correctId: "guardrails" },
    ],
    correctOptionIds: ["iam", "guardrails", "guardrails", "iam", "guardrails"],
    explanation: "You can use Amazon Bedrock guardrails to control the content that is generated by Amazon Bedrock. You can use Amazon Bedrock to ensure that the content aligns with safety and compliance policies. You can use Amazon Bedrock guardrails to avoid specific topics, filter harmful content, and monitor user inputs for violations. You can use Amazon Bedrock guardrails to maintain a safe and compliant environment for generative AI applications. Amazon Bedrock guardrails help implement safeguards that are customizable to your use cases and responsible AI policies.\n\nIAM is a service that you can use for access control and identity management in AWS environments, including Amazon Bedrock. You can use IAM to define user roles and to set permissions to access resources. IAM provides a secure method to manage who can use specific features.",
    type: "multiple",
    learnMoreLink: { text: "Amazon Bedrock guardrails", url: "https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html" }
  },
  {
    id: "q4",
    text: "A company wants to assess the performance of a foundation model (FM) for text generation. Which technique or metric will meet these requirements?",
    options: [
      { id: "a", text: "BLEU score" },
      { id: "b", text: "F1 score" },
      { id: "c", text: "Precision-recall curve" },
      { id: "d", text: "Confusion matrix" },
    ],
    correctOptionId: "a",
    explanation: "BLEU (Bilingual Evaluation Understudy) score is a metric commonly used to evaluate the quality of text that has been machine-generated. It is particularly useful for evaluating text generation tasks, such as those performed by foundation models, by comparing the generated text with reference texts. This makes BLEU score appropriate for assessing foundation model performance for text generation.",
    type: "single"
  },
  {
    id: "q5",
    text: "Which Amazon SageMaker feature should a data scientist use to understand model predictions?",
    options: [
      { id: "a", text: "Amazon SageMaker Ground Truth" },
      { id: "b", text: "Amazon SageMaker Clarify" },
      { id: "c", text: "Amazon SageMaker Model Monitor" },
      { id: "d", text: "Amazon SageMaker Feature Store" },
    ],
    correctOptionId: "b",
    explanation: "Amazon SageMaker Clarify helps improve model transparency by enabling developers to detect potential bias in machine learning models and explain how these models make predictions. It provides tools to generate model explainability reports that help data scientists understand feature importance and how individual features contribute to predictions.",
    type: "single",
    learnMoreLink: { text: "Amazon SageMaker Clarify", url: "https://aws.amazon.com/sagemaker/clarify/" }
  }
];
