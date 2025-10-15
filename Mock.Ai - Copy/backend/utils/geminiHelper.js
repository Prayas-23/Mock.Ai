import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Fallback questions for when Gemini API is not available
const FALLBACK_QUESTIONS = {
  "Software Engineer:JavaScript": [
    {
      question:
        "What is the difference between let, const, and var in JavaScript?",
      time: 45,
    },
    {
      question: "Explain how asynchronous programming works in JavaScript.",
      time: 50,
    },
    {
      question: "What are closures in JavaScript and how are they used?",
      time: 45,
    },
    { question: "Describe the event loop in JavaScript.", time: 50 },
    {
      question: "How does prototypal inheritance work in JavaScript?",
      time: 45,
    },
    {
      question: "What is the difference between == and === in JavaScript?",
      time: 40,
    },
    { question: "Explain the concept of hoisting in JavaScript.", time: 45 },
    { question: "How do you handle errors in JavaScript?", time: 40 },
    {
      question:
        "What are arrow functions and how do they differ from regular functions?",
      time: 45,
    },
    { question: "Explain the concept of promises and async/await.", time: 50 },
  ],
  "Data Scientist:Python": [
    {
      question: "What are the key differences between Python 2 and Python 3?",
      time: 40,
    },
    {
      question: "Explain list comprehensions and when you would use them.",
      time: 45,
    },
    {
      question: "How do you handle missing data in a dataset using pandas?",
      time: 50,
    },
    {
      question:
        "What is the difference between supervised and unsupervised learning?",
      time: 45,
    },
    {
      question: "Explain the concept of overfitting in machine learning.",
      time: 50,
    },
    {
      question: "What is the difference between a list and a tuple in Python?",
      time: 40,
    },
    {
      question: "How do you optimize the performance of a Python program?",
      time: 50,
    },
    { question: "Explain the concept of feature engineering.", time: 45 },
    {
      question: "What are the different types of machine learning algorithms?",
      time: 50,
    },
    {
      question:
        "How do you evaluate the performance of a machine learning model?",
      time: 45,
    },
  ],
  "Product Manager:Strategy": [
    {
      question: "How do you prioritize features when developing a new product?",
      time: 50,
    },
    {
      question:
        "Describe a time when you had to make a difficult product decision.",
      time: 45,
    },
    { question: "How do you measure the success of a product?", time: 45 },
    {
      question:
        "Explain how you would conduct market research for a new product.",
      time: 50,
    },
    {
      question:
        "How do you handle conflicting priorities from different stakeholders?",
      time: 45,
    },
    {
      question: "What is your approach to user feedback and feature requests?",
      time: 45,
    },
    {
      question: "How do you work with engineering teams to deliver products?",
      time: 50,
    },
    { question: "Describe your experience with A/B testing.", time: 45 },
    {
      question: "How do you define and track key performance indicators?",
      time: 45,
    },
    { question: "What is your approach to competitive analysis?", time: 40 },
  ],
  // Generic fallback for any role/topic combination
  default: [
    { question: "Tell me about your experience in this field.", time: 50 },
    { question: "What are your key strengths for this role?", time: 45 },
    { question: "Describe a challenging project you worked on.", time: 50 },
    { question: "How do you stay updated with industry trends?", time: 45 },
    { question: "What motivates you in your professional work?", time: 40 },
    { question: "How do you handle tight deadlines and pressure?", time: 45 },
    {
      question: "Describe a time when you had to learn something new quickly.",
      time: 50,
    },
    { question: "What is your approach to problem-solving?", time: 45 },
    {
      question: "How do you work effectively in a team environment?",
      time: 45,
    },
    { question: "Where do you see yourself in the next few years?", time: 40 },
  ],
};

// Helper function to get fallback questions
const getFallbackQuestions = (role, topic, numOfQns) => {
  const key = `${role}:${topic}`;
  let questions = FALLBACK_QUESTIONS[key] || FALLBACK_QUESTIONS["default"];

  // If we need more questions than available, repeat some questions with slight variations
  if (numOfQns > questions.length) {
    const additionalQuestions = [];
    const baseQuestions = [...questions];

    for (let i = questions.length; i < numOfQns; i++) {
      const baseQuestion = baseQuestions[i % baseQuestions.length];
      additionalQuestions.push({
        question: `Follow-up: ${baseQuestion.question}`,
        time: baseQuestion.time,
      });
    }
    questions = [...questions, ...additionalQuestions];
  }

  return {
    valid: true,
    questions: questions.slice(0, numOfQns),
  };
};

export const callGeminiFlash = async (prompt, role, topic, numOfQns = 5) => {
  try {
    console.log("=== callGeminiFlash START ===");
    console.log("Role:", role, "Topic:", topic);

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.warn(
        "GEMINI_API_KEY is not configured, using fallback questions"
      );
      throw new Error(
        "GEMINI_API_KEY is not configured in environment variables"
      );
    }

    console.log(
      "Using Gemini API key:",
      process.env.GEMINI_API_KEY.substring(0, 10) + "..."
    );

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    const text = result.response.text();
    console.log("Raw Gemini response:", text);

    // Try to find JSON in the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn("No JSON found in Gemini output:", text);
      throw new Error(
        `No valid JSON found in Gemini response. Raw response: ${text.substring(
          0,
          200
        )}...`
      );
    }

    try {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed;
    } catch (parseError) {
      console.error("JSON parsing failed:", parseError.message);
      console.error("Attempted to parse:", jsonMatch[0]);
      throw new Error(
        `Failed to parse JSON from Gemini response: ${
          parseError.message
        }. Raw response: ${text.substring(0, 200)}...`
      );
    }
  } catch (err) {
    console.error("=== Gemini Flash Error ===");
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);

    // Handle specific Gemini API errors - use fallback instead of throwing error
    if (
      err.message.includes("429") ||
      err.message.includes("quota") ||
      err.message.includes("limit") ||
      err.message.includes("rate") ||
      err.message.includes("exceeded")
    ) {
      console.warn("API quota/rate limit exceeded, using fallback questions");
      return getFallbackQuestions(role, topic, numOfQns);
    }

    // Use fallback questions when API fails for any reason
    console.warn("Using fallback questions due to API error:", err.message);
    return getFallbackQuestions(role, topic, numOfQns);
  }
};
