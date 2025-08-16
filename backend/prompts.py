PROMPT_QUESTION_ANSWER_GENERATION = """You are an AWS certification expert integrated into an AI SaaS platform. Your role is to generate challenging and contextually accurate multiple-choice questions (MCQs) based on provided AWS-related content. Use the following a valid JSON schema to format each MCQ:

### Schema for type-1 MCQ
<schema>
{{
    "type": "type-1"
    "question": "Which of the following services is a managed full-text search service?",
    "options": [
      "Amazon Athena",
      "Amazon OpenSearch Service",
      "Amazon Redshift",
      "AWS Glue"
    ],
    "answer": "Amazon OpenSearch Service",
    "explanation": "The image describes Amazon OpenSearch Service as a managed full-text search service.",
}}

### Schema for type-2 MCQ
</schema>
{{
    "type": "type-2",
    "question": "Select the correct AWS service or feature from the following list for each task. Each AWS service or feature should be selected one or more times. (Select FIVE.)",
    "options": [
      "Guardrails for Amazon Bedrock",
      "AWS Identity and Access Management (IAM)"
    ],
    "answer": {{
      "Implement identity verification and resource-level access control.": "AWS Identity and Access Management (IAM)",
      "Set policies to avoid specific topics in a generative AI application.": "Guardrails for Amazon Bedrock",
      "Filter harmful content based on defined thresholds for categories.": "Guardrails for Amazon Bedrock",
      "Define user roles and permissions to access Amazon Bedrock.": "AWS Identity and Access Management (IAM)",
      "Monitor and analyze user inputs to ensure compliance with safety policies.": "Guardrails for Amazon Bedrock"
    }},
    "explanation": "Amazon Bedrock guardrails help control AI-generated content, ensuring alignment with safety and compliance policies. They are used to filter harmful content, avoid specific topics, and monitor user inputs. AWS IAM is used for access control, identity management, defining user roles, and setting permissions in AWS environments, including Amazon Bedrock."
    }}
  
</schema>


### Types of questions. 

Generate 3 types of questions

type-1: Only one out of four options is correct
type-2: This will have four options and each option will have two choices out of which one will be correct
type-3: Only two out of four options is correct

### Requirements:

Grounded Content: All questions must be strictly derived from the reference material. Avoid assumptions not supported by the source.
Certification Alignment: Match the question style and cognitive depth of AWS certification exams (Associate or Professional level). Include scenario-based and real-world operational questions where applicable.
Plausible Distractors: Each incorrect answer should be realistic, common misconceptions, or close alternatives to effectively test comprehension.
Technical Accuracy: Ensure AWS terminology, service limits, configuration options, and behavior are up-to-date and technically correct.
Non-Trivial Scenarios: Avoid rote definitions. Prioritize use-case analysis, architectural trade-offs, or operational best practices.
Explanation Quality: Provide a concise yet clear explanation that educates the user on why the correct answer is right and why others are wrong.
Topic Coverage: Ensure diversity in AWS services and topics when generating multiple questions. Use the <topic> tag for traceability and coverage tracking.
Difficulty Calibration: Match difficulty level to the complexity and ambiguity present in real AWS exams.
Avoid Redundancy: Do not repeat questions or use overly similar variations unless testing a different concept.
Security-First Bias: Where applicable, reflect AWS’s emphasis on security, fault tolerance, and cost optimization best practices.
If any information is missing or ambiguous in the source material, note it but do not invent answers. Default to AWS official documentation or best practices only if explicitly instructed.

Use this content for generating MCQs
{content}

Generate as many questions you can generate from given content, but do follow the above requirements and question type instructions.

"""

PROMPT_GET_AWS_CERTIFICATIONS = """List all the AWS certifications available for learners, categorized by level (Foundational, Associate, Professional, and Specialty), along with a brief description of each, do not add anything from yourself, keep the exact content as it appears on the web, and retrieve this information only from official aws website and also cite the content in response.
Add source as a dictionary item 
<output format>
{{
    
    "aws certification list" : {
        "Foundational" : {
            "certification-1": explaination,
            "certification-2": explaination
        },
        "Associate": {
            "certification-1": explaination,
            "certification-2": explaination
        },
        "Specialty": {
            "certification-1": explaination,
            "certification-2": explaination
        },
        "Professional": {
            "certification-1": explaination,
            "certification-2": explaination
        },  
    }
    "sources": [list of sources]
}}
**repeat the pattern for all different types of certificates**
</output format>

"""

PROMPT_GET_CERTIFICATE_DETIALS = """From the official {certificate} website get the 
- Exam Duration
- Exam format, for example: 20 questions; either multiple choice or multiple response
- Exam result information

<output format>
{{
    "exam duration": "time in minutes",
    "exam format": "str",
    "Exam result": "str",
}}
</output format>

**return exact output fromat, DONOT add any extra comments**
"""
PROMPT_GET_AWS_SERVICE_WEBPAGE_LINKS = """Get the official AWS URL for the list of {services}.
## Instructions
    - avoid 
        - FAQ sites
        - Pricing sites
        - docs sites
        - compliance pages
    - Include
        - only main page link

<output format>
{{
    "service_1": URL,
    "service_2":URL,
}}
</output format>
"""
# PROMPT_GET_AWS_SERVICE_WEBPAGE_LINKS = """Get the official AWS links for {service} only.
# ## Instructions
#     - avoid 
#         - FAQ sites
#         - Pricing sites
#         - docs sites
#         - compliance pages
#     - Include
#         - only main page link

# <output format>
# {{
#     website: link/string
# }}
# </output format>
# """

PROMPT_GET_RELEVANT_SERVICE_INFO_FROM_JINA_WEB = """You are an expert in aws services. From the given markdown text get the {service}
- benefits:  get content inside Benefits section, only if benefits section is present in markdown
- use cases: get content inside Use cases section, only if use case section is present in markdown, solutions and use cases are two different concepts, so do not add solution to use case section. Only list uses cases when, use cases section is clearly mentioned in the markdown text
- features https link and 
- {service} introduction

This is content for extraction: {markdown_text}
If features page has Page topics, keep the list of words in topcs as heading and then add its content below it
If feature link is not present in the markdown, output for the "features link" key should be Null

## Output Format
<output format>
{{
    "features link": "link/string",
    "introduction": "string(include introduction, explaination, definitions)"
    "use cases": "string"
    "benefits": "string"
}}
</output format>

## IMPORTANT
- Ensure no content is altered or created, keep content as it is
- Ensure all 4 keys are present in output
- Ignore all cookies, privacy and get started content, only focus on {service} content
"""

PROMPT_GET_SERVICE_FEATURE_INFO_FROM_JINA_WEB = """You are an expert in aws services. From the given markdown text get the {service}
- Overview:  get content from overview section
- features: get deatils of all the feature. It can be listed uder page topics. Keep the formatting same

This is content for extraction: {markdown_text}

## Output Format
<output format>
{{
    "Overview": "string",
    "features": "string"
}}
</output format>

## IMPORTANT
- Ensure no content is altered or created, keep content as it is
- Ensure 2 keys are present in output
- Ignore all cookies, privacy and get started content, only focus on {service} content
"""

ALTERNATE_PROMPT_TO_GET_FEATURE_LINK = """Get the link for {service} features, only if its is present in markdown else output should be null
<output format>
{{
    "features link" : "link/string"
}}
</output format>
"""

PROMPT_GET_AWS_CERTIFICATION_EXAM_GUIDE = """
You are an expert in finding AWS static URLs.

Task:
1. Find the official AWS static PDF URL for the {certificate} exam guide.
2. Locate the link from an official AWS domain (must be hosted on awsstatic.com).
3. Ensure the URL is publicly accessible without login.
4. Ensure the URL is an existing, working PDF link from AWS.
   - Do NOT make up or guess the link.
   - Only return links you can confirm from official AWS training or certification pages.
   - Do NOT use archived, outdated, or placeholder links.

Return ONLY in this JSON format (no explanation):
<output format>
{{
    "website": "string/link"
}}
</output format>
"""

PROMPT_GET_INSCOPE_SERVICES = """You are an expert in AWS Certifications, you have to identify the **In-scope AWS services and features**
for given certification from provided markdown text
markdown text: {markdown_text}
certification: {certification}

<output format>
{{
    "services": [List of In-scope aws services]
}}
</output format>
"""