import { QuestionType } from "@/components/QuestionCard";

// Function to convert raw JSON questions to QuestionType format
export const convertJsonToQuestions = (
  jsonQuestions: any[]
): QuestionType[] => {
  console.log("jsonQuestions:", jsonQuestions);
  return jsonQuestions.map((q, index) => {
    // console.log("q:", q)
    // console.log("index:", index)
    if (q.type === "type-2") {
      // For matching type questions
      const tasks = Object.keys(q.answer).map((task, taskIndex) => ({
        id: `task-${taskIndex}`,
        text: task,
        correctId: q.answer[task],
      }));
      // console.log("task:", tasks)

      // Create options from unique answer values
      const uniqueOptions = [...new Set(Object.values(q.answer))];
      const options = uniqueOptions.map((opt, optIndex) => ({
        id: opt.toString(),
        text: opt.toString(),
      }));

      return {
        id: `q${index + 1}`,
        text: q.question,
        options,
        tasks,
        explanation: q.explanation,
        type: "type-2" as const,
        learnMoreLink: q.learnMoreLink,
      };
    } else if (q.type === "type-3") {
      // For multiple choice questions with multiple correct answers
      const options = q.options.map((opt: string, optIndex: number) => ({
        id: optIndex.toString(),
        text: opt,
      }));

      // Find all correct option ids
      const correctOptionIds = q.answer
        .map((answer: string) => {
          const foundOption = options.find((opt) => opt.text === answer);
          return foundOption ? foundOption.id : null;
        })
        .filter(Boolean);

      return {
        id: `q${index + 1}`,
        text: q.question,
        options,
        correctOptionIds,
        explanation: q.explanation,
        type: "type-3" as const,
        learnMoreLink: q.learnMoreLink,
      };
    } else {
      // For single-select questions (type-1 or default)
      // Create options array with id and text properties
      const options = q.options.map((opt: string, optIndex: number) => ({
        id: optIndex.toString(),
        text: opt,
      }));

      // Find correct option id
      const correctOptionId = options
        .findIndex((opt: { text: string }) => opt.text === q.answer)
        .toString();

      return {
        id: `q${index + 1}`,
        text: q.question,
        options,
        correctOptionId,
        explanation: q.explanation,
        type: q.type || ("single" as const),
        learnMoreLink: q.learnMoreLink,
      };
    }
  });
};

// Updated questions with all the examples
const athenaJsonQuestions = [
  {
    question:
      "Which of the following services is a managed full-text search service?",
    options: [
      "Amazon Athena",
      "Amazon OpenSearch Service",
      "Amazon Redshift",
      "AWS Glue",
    ],
    answer: "Amazon OpenSearch Service",
    explanation:
      "The image describes Amazon OpenSearch Service as a managed full-text search service.",
    type: "type-1",
  },
  {
    question: "Which of the following is true about AWS Glue Data Catalog?",
    options: [
      "It is a serverless data integration service.",
      "It is a data lake to centrally govern, secure, and globally share data for analytics and machine learning",
      "It is a fully managed, Apache Hive Metastore-compatible catalog service.",
      "It allows you to measure and monitor the quality of your data",
    ],
    answer:
      "It is a fully managed, Apache Hive Metastore-compatible catalog service.",
    explanation:
      "According to the image, AWS Glue Data Catalog is a fully managed, Apache Hive Metastore-compatible catalog service.",
    type: "type-1",
  },
  {
    question:
      "Which of the following is NOT a supported SerDe (Serializer/Deserializer) in Athena?",
    options: [
      "org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe",
      "com.amazon.tonhiveeserde.ToHiveSerDe",
      "org.apache.hadoop.hive.serde2.RegexSerde",
      "com.databricks.spark.csv.CsvSerde",
    ],
    answer: "com.databricks.spark.csv.CsvSerde",
    explanation:
      "The image shows a list of built-in SerDe supported by Athena. 'com.databricks.spark.csv.CsvSerde' is not on the list.",
    type: "type-1",
  },
  {
    question: "What is SerDe used for in Athena?",
    options: [
      "Defining the table schema.",
      "Parsing data from different data formats.",
      "Defining DDL configuration",
      "Specifying the location of data",
    ],
    answer: "Parsing data from different data formats.",
    explanation:
      "According to the image, SerDe is a serialization and deserialization library for parsing data from different data formats, such as CSV, JSON, Parquet, and ORC.",
    type: "type-1",
  },
  {
    question:
      "Which of the following is a visual data preparation tool that enables users to clean and normalize data without writing any code?",
    options: [
      "AWS Glue Data Catalog",
      "AWS Glue Data Brew",
      "AWS Glue Studio",
      "AWS Lake Formation",
    ],
    answer: ["AWS Glue Data Brew", "AWS Glue Data Catalog"],
    explanation:
      "The image describes AWS Glue Data Brew as a visual data preparation tool enabling users to clean and normalize data without coding.",
    type: "type-3",
  },
  {
    type: "type-2",
    question:
      "Select the correct AWS service or feature from the following list for each task. Each AWS service or feature should be selected one or more times. (Select FIVE.)",
    options: [
      "Guardrails for Amazon Bedrock",
      "AWS Identity and Access Management (IAM)",
    ],
    answer: {
      "Implement identity verification and resource-level access control.":
        "AWS Identity and Access Management (IAM)",
      "Set policies to avoid specific topics in a generative AI application.":
        "Guardrails for Amazon Bedrock",
      "Filter harmful content based on defined thresholds for categories.":
        "Guardrails for Amazon Bedrock",
      "Define user roles and permissions to access Amazon Bedrock.":
        "AWS Identity and Access Management (IAM)",
      "Monitor and analyze user inputs to ensure compliance with safety policies.":
        "Guardrails for Amazon Bedrock",
    },
    explanation:
      "Amazon Bedrock guardrails help control AI-generated content, ensuring alignment with safety and compliance policies. They are used to filter harmful content, avoid specific topics, and monitor user inputs. AWS IAM is used for access control, identity management, defining user roles, and setting permissions in AWS environments, including Amazon Bedrock.",
  },
];

// Convert the JSON data to QuestionType
export const athenaQuestions = convertJsonToQuestions(athenaJsonQuestions);

// AWS Cloud Practitioner Questions
const cloudPractitionerJsonQuestions = [
  {
    question:
      "Which AWS service provides a global content delivery network (CDN)?",
    options: [
      "Amazon CloudFront",
      "AWS Direct Connect",
      "Amazon Route 53",
      "AWS Global Accelerator",
    ],
    answer: "Amazon CloudFront",
    explanation:
      "Amazon CloudFront is AWS's global content delivery network (CDN) service that delivers content to users with low latency.",
    type: "type-1",
  },
  {
    question: "What is the AWS Free Tier?",
    options: [
      "A paid subscription service",
      "A free service for 12 months with usage limits",
      "A premium support plan",
      "A dedicated hosting service",
    ],
    answer: "A free service for 12 months with usage limits",
    explanation:
      "The AWS Free Tier provides free access to certain AWS services for 12 months with specific usage limits.",
    type: "type-1",
  },
  {
    question: "Which AWS service is used for storing files and objects?",
    options: ["Amazon EBS", "Amazon S3", "Amazon EFS", "Amazon FSx"],
    answer: "Amazon S3",
    explanation:
      "Amazon S3 (Simple Storage Service) is AWS's object storage service for storing files and objects.",
    type: "type-1",
  },
  {
    question: "What does AWS IAM stand for?",
    options: [
      "Internet Access Management",
      "Identity and Access Management",
      "Infrastructure and Application Management",
      "Integrated Asset Management",
    ],
    answer: "Identity and Access Management",
    explanation:
      "AWS IAM stands for Identity and Access Management, which helps securely control access to AWS services and resources.",
    type: "type-1",
  },
  {
    question: "Which of the following are benefits of cloud computing?",
    options: [
      "Trade capital expense for variable expense",
      "Benefit from massive economies of scale",
      "Stop guessing capacity",
      "All of the above",
    ],
    answer: "All of the above",
    explanation:
      "All of these are key benefits of cloud computing: trading capital expense for variable expense, benefiting from economies of scale, and stopping capacity guessing.",
    type: "type-1",
  },
];

// AWS Solutions Architect Questions
const solutionsArchitectJsonQuestions = [
  {
    question: "Which AWS service provides a managed relational database?",
    options: [
      "Amazon DynamoDB",
      "Amazon RDS",
      "Amazon Redshift",
      "Amazon ElastiCache",
    ],
    answer: "Amazon RDS",
    explanation:
      "Amazon RDS (Relational Database Service) provides managed relational databases including MySQL, PostgreSQL, Oracle, and SQL Server.",
    type: "type-1",
  },
  {
    question:
      "What is the recommended approach for handling database failover?",
    options: [
      "Use Multi-AZ deployment",
      "Use Read Replicas",
      "Use both Multi-AZ and Read Replicas",
      "Use only single-AZ deployment",
    ],
    answer: "Use both Multi-AZ and Read Replicas",
    explanation:
      "For high availability, use Multi-AZ for automatic failover and Read Replicas for read scaling and disaster recovery.",
    type: "type-1",
  },
  {
    question: "Which AWS service provides auto-scaling capabilities?",
    options: [
      "AWS Auto Scaling",
      "Amazon EC2 Auto Scaling",
      "Both AWS Auto Scaling and EC2 Auto Scaling",
      "Amazon ECS",
    ],
    answer: "Both AWS Auto Scaling and EC2 Auto Scaling",
    explanation:
      "Both AWS Auto Scaling (for multiple services) and EC2 Auto Scaling (for EC2 instances) provide auto-scaling capabilities.",
    type: "type-1",
  },
  {
    question: "What is the best practice for securing data in transit?",
    options: [
      "Use SSL/TLS encryption",
      "Use AWS KMS",
      "Use both SSL/TLS and AWS KMS",
      "Use only IAM policies",
    ],
    answer: "Use both SSL/TLS and AWS KMS",
    explanation:
      "For data in transit, use SSL/TLS encryption for transport security and AWS KMS for key management.",
    type: "type-1",
  },
  {
    question:
      "Which AWS service provides a managed container orchestration service?",
    options: ["Amazon ECS", "Amazon EKS", "AWS Fargate", "All of the above"],
    answer: "All of the above",
    explanation:
      "Amazon ECS, EKS, and Fargate all provide managed container orchestration services with different approaches.",
    type: "type-1",
  },
];

// Convert JSON data to QuestionType
export const awsAIPractitionerQuestions: QuestionType[] =
  convertJsonToQuestions(athenaJsonQuestions);
export const cloudPractitionerQuestions: QuestionType[] =
  convertJsonToQuestions(cloudPractitionerJsonQuestions);
export const solutionsArchitectQuestions: QuestionType[] =
  convertJsonToQuestions(solutionsArchitectJsonQuestions);
