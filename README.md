# ExamifyPrep

## 📘 Project Overview

**Exam Preparation Website** is a web-based platform designed to help candidates effectively prepare for AWS certification exams. The platform provides a seamless and interactive experience, guiding users through the entire exam flow — from login to review.

### 🎯 Objectives

* Enable candidates to practice AWS certification questions.
* Offer real-time feedback and performance insights across exam domains.

### 🧩 Key Features

* **User Authentication**: Registration and login system for personalized access.
* **Exam Interface**: Dynamic question-and-answer environment mimicking real test conditions.
* **Result Review**: Post-exam summary showing overall and domain-specific scores to help candidates identify strengths and weaknesses.

### 🧠 AI-Powered Question Generation

* Integrated **Retrieval-Augmented Generation (RAG)** pipeline to generate relevant, diverse questions.
* The knowledge base is built from multiple sources including exam notes (PDF), PowerPoint slides, and text documents.
* Utilizes **Google Gemini 2.0 Flash** for question-answer generation.
* **Google Gemini Embeddings** are used for document embedding and stored in **Pinecone** for efficient semantic retrieval.

> 🔧 *Note: The RAG pipeline is currently used to generate content, but its full integration into the website backend is planned for a future release.*

### 🚀 Current Status

* Initial release includes one AWS exam preparation set.
* More certifications and advanced features (like RAG integration) will be added in upcoming versions.

---

## What technologies are used for this project?

This project is built with .

-  **Backend**
    - FastAPI

-  **Frontend**
    - TypeScript
    - Tailwind CSS
    - Vite
    - shadcn-ui

-  **Database**
    - Supabase
    - Pinecone

- **AI**
    - Google Gemini 2.0 Flash
    - Google Gemini Embeddings
    - Langchain
    - Pinecone
    - Lovable (for low-code UI generation)
---

## UI Design

### Landing page
![landing page](https://github.com/Rashmi7218/examify-prepster/blob/main/example/landing%20page.png)

### Login page
![login page](https://github.com/Rashmi7218/examify-prepster/blob/main/example/loginpage.png)

### Exam start page
![exam start page](https://github.com/Rashmi7218/examify-prepster/blob/main/example/exam-start-page.png)

### Correct answer example
![correct answer example](https://github.com/Rashmi7218/examify-prepster/blob/main/example/examui-1.png)

### Incorrect answer example
![incorrect answer example](https://github.com/Rashmi7218/examify-prepster/blob/main/example/examui-2.png)

### Match question example
![match question example](https://github.com/Rashmi7218/examify-prepster/blob/main/example/examui-3.png)

### Result page
![review page](https://github.com/Rashmi7218/examify-prepster/blob/main/example/review-page.png)


## Supabase Authentication Setup

1. Create a project at [Supabase](https://supabase.com/).
2. Go to Project Settings > API and copy your `Project URL` and `anon` public key.
3. In your project root, create a `.env` file (or use your Vite env file, e.g., `.env.local`) and add:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Restart your dev server after adding environment variables.

5. The login form now uses Supabase authentication.

