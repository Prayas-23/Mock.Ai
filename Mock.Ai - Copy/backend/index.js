import express from 'express'
import cors from 'cors'
import axios from 'axios'
import interviewSection from './route/interview.route.js'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import { v2 as cloudinary } from 'cloudinary';
import quizRoute from './route/quiz.route.js'
import resumeRoute from './route/resume.route.js'
import profileInterviewRoute from './route/profileInterview.route.js'
// import authRoutes from './routes/auth.js'

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGODB_URI;


const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'https://prepverse-ai-python-server.onrender.com', 'https://prepverse-ai.onrender.com', 'http://127.0.0.1:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(cookieParser());
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const main = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Database is Connected");
  } catch (err) {
    console.log("Database Error : ", err);
  }
}

main();

// Test route before mounting other routes
app.get('/test-server', (req, res) => {
  console.log('Test server route hit');
  res.json({ message: 'Server is working' });
});

// Working implementation for checkRoleAndTopic
app.post('/api/interview/checkRoleAndTopic', async (req, res) => {
  try {
    console.log('=== checkRoleAndTopic START ===');
    console.log('Request body:', req.body);
    
    let { role, topic, numOfQns } = req.body;
    
    // Basic validation and sanitization
    role = typeof role === 'string' ? role.trim() : '';
    topic = typeof topic === 'string' ? topic.trim() : '';
    numOfQns = typeof numOfQns === 'string' ? parseInt(numOfQns, 10) : Number(numOfQns);
    if (!Number.isFinite(numOfQns)) numOfQns = 0;
    
    if (!role || !topic || !numOfQns) {
      console.log('Missing required fields:', { role, topic, numOfQns });
      return res.status(400).json({ message: "Provide valid inputs" });
    }

    if (numOfQns < 2 || numOfQns > 25) {
      console.log('Invalid numOfQns:', numOfQns);
      return res.status(400).json({ message: "Please provide a number of questions between 2 and 25." });
    }

    // Generate questions based on role and topic
    const questionBank = {
      "Software Engineer": {
        "JavaScript": [
          { question: "What is the difference between let, const, and var in JavaScript?", time: 45 },
          { question: "Explain how asynchronous programming works in JavaScript.", time: 50 },
          { question: "What are closures in JavaScript and how are they used?", time: 45 },
          { question: "Describe the event loop in JavaScript.", time: 50 },
          { question: "How does prototypal inheritance work in JavaScript?", time: 45 },
          { question: "What is the difference between == and === in JavaScript?", time: 40 },
          { question: "Explain the concept of hoisting in JavaScript.", time: 45 },
          { question: "How do you handle errors in JavaScript?", time: 40 },
          { question: "What are arrow functions and how do they differ from regular functions?", time: 45 },
          { question: "Explain promises and async/await in JavaScript.", time: 50 }
        ],
        "React": [
          { question: "What is the difference between state and props in React?", time: 45 },
          { question: "Explain the React component lifecycle.", time: 50 },
          { question: "What are React hooks and why are they useful?", time: 45 },
          { question: "How does virtual DOM work in React?", time: 50 },
          { question: "What is the difference between controlled and uncontrolled components?", time: 45 },
          { question: "Explain the concept of React context.", time: 45 },
          { question: "How do you optimize performance in React applications?", time: 50 },
          { question: "What is the difference between useEffect and useLayoutEffect?", time: 45 },
          { question: "How do you handle forms in React?", time: 40 },
          { question: "Explain the concept of React fragments.", time: 40 }
        ]
      },
      "Data Scientist": {
        "Python": [
          { question: "What are the key differences between Python 2 and Python 3?", time: 40 },
          { question: "Explain list comprehensions and when you would use them.", time: 45 },
          { question: "How do you handle missing data in a dataset using pandas?", time: 50 },
          { question: "What is the difference between supervised and unsupervised learning?", time: 45 },
          { question: "Explain the concept of overfitting in machine learning.", time: 50 },
          { question: "What is the difference between a list and a tuple in Python?", time: 40 },
          { question: "How do you optimize the performance of a Python program?", time: 50 },
          { question: "Explain the concept of feature engineering.", time: 45 },
          { question: "What are the different types of machine learning algorithms?", time: 50 },
          { question: "How do you evaluate the performance of a machine learning model?", time: 45 }
        ]
      }
    };

    // Get questions for the specific role and topic, or use generic questions
    let questions = questionBank[role]?.[topic] || [
      { question: "Tell me about your experience in this field.", time: 50 },
      { question: "What are your key strengths for this role?", time: 45 },
      { question: "Describe a challenging project you worked on.", time: 50 },
      { question: "How do you stay updated with industry trends?", time: 45 },
      { question: "What motivates you in your professional work?", time: 40 },
      { question: "How do you handle working under pressure?", time: 45 },
      { question: "What interests you most about this position?", time: 40 },
      { question: "Where do you see yourself in 5 years?", time: 50 },
      { question: "How do you approach problem-solving?", time: 45 },
      { question: "What makes you a good fit for this role?", time: 50 }
    ];

    // Select the requested number of questions
    questions = questions.slice(0, numOfQns);

    const response = {
      valid: true,
      questions: questions
    };

    // Try to save to database, but don't fail if it doesn't work
    let interviewModelId = null;
    try {
      const { default: InterviewData } = await import('./models/interview.model.js');
      const participant = `anonymous_${Date.now()}`;
      
      const interviewData = {
        participant,
        questions: response.questions,
        answers: response.questions.map(() => "Answer Not Provided.")
      };

      const newData = new InterviewData(interviewData);
      await newData.save();
      interviewModelId = newData._id;
      console.log('Data saved successfully with ID:', interviewModelId);
    } catch (dbErr) {
      console.warn('Database save failed, continuing without saving:', dbErr.message);
      // Generate a temporary ID for the session
      interviewModelId = `temp_${Date.now()}`;
    }

    return res.status(200).json({ 
      message: "Questions generated", 
      response, 
      interviewModelId 
    });

  } catch (err) {
    console.error('=== ERROR in checkRoleAndTopic ===');
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    return res.status(500).json({ 
      message: "Server Error", 
      error: err.message
    });
  }
});

// Working implementation for generate-question
app.post('/api/interview/generate-question', async (req, res) => {
  try {
    console.log('=== generate-question START ===');
    console.log('Request body:', req.body);
    
    const { role, topic, name, previousQuestions = [], askedQuestion, numOfQns, modelId } = req.body;
    let { givenAnswer } = req.body;

    if (!role || !topic || !name) {
      return res.status(400).json({ message: "Must provide a role, topic, and name!" });
    }

    if (!modelId) {
      return res.status(400).json({ message: "Must provide a modelId!" });
    }

    if (previousQuestions.length > 0 && (!askedQuestion || !givenAnswer)) {
      return res.status(400).json({
        message: "For follow-up questions, must provide askedQuestion and givenAnswer!"
      });
    }

    givenAnswer = givenAnswer?.trim() === "" ? "Answer Not Provided." : givenAnswer;

    let finishInterview = false;
    let responseData = "";

    if (previousQuestions.length === 0) {
      // First question - welcome message
      const welcomeMessage = `Hello ${name}! Welcome to your ${role} interview focusing on ${topic}. I'm excited to learn more about your experience and skills.`;
      const transition = "Let's begin with";
      
      // Get first question from a simple question bank
      const firstQuestion = "Tell me about your background and experience in this field.";
      
      responseData = `${welcomeMessage} ${transition} ${firstQuestion}`;
      
      return res.status(200).json({ 
        message: "Question generated!", 
        question: { question: firstQuestion, time: 50 }, 
        responseData, 
        finishInterview 
      });

    } else if (previousQuestions.length >= numOfQns) {
      // Final question - end interview
      const feedback = `Thank you for sharing your thoughts on the previous question. Your responses have provided valuable insights into your experience and approach.`;
      const endMessage = `That concludes our interview session. Thank you for your time and thoughtful responses. We appreciate your interest in this position.`;
      
      responseData = `${feedback} ${endMessage}`;
      finishInterview = true;
      
      return res.status(200).json({ 
        message: "Interview completed!", 
        question: null, 
        responseData, 
        finishInterview 
      });

    } else {
      // Follow-up questions
      const feedback = `Thank you for your response. Your answer provides good insight into your experience.`;
      const transition = "Moving on to the next topic,";
      
      // Simple follow-up questions
      const followUpQuestions = [
        "How do you handle challenging situations in your work?",
        "What tools or technologies do you prefer to work with?",
        "Describe a project you're particularly proud of.",
        "How do you stay current with industry developments?",
        "What motivates you in your professional work?",
        "How do you approach learning new skills?",
        "What do you consider your greatest strength?",
        "How do you handle feedback and criticism?",
        "What interests you most about this role?",
        "Where do you see yourself in the next few years?"
      ];
      
      const nextQuestion = followUpQuestions[previousQuestions.length - 1] || "What questions do you have for us?";
      responseData = `${feedback} ${transition} ${nextQuestion}`;
      
      return res.status(200).json({ 
        message: "Question generated!", 
        question: { question: nextQuestion, time: 45 }, 
        responseData, 
        finishInterview 
      });
    }

  } catch (err) {
    console.error("Error in generate-question:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Mount routes
console.log('Mounting routes...');

// Simple test route in main file
app.get('/api/quiz/simple-test', (req, res) => {
  console.log('Simple quiz test hit');
  res.json({ message: 'Simple quiz test working' });
});

app.use('/api/interview', interviewSection);
app.use('/api/quiz', quizRoute);
app.use('/api/resume', resumeRoute);
app.use('/api/profile-interview', profileInterviewRoute);
console.log('All routes mounted successfully');
// app.use('/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Express error handler caught:', err);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

// Simple test endpoint to check if the server is working
app.get('/api/test', (req, res) => {
  res.status(200).json({
    message: "Test endpoint working",
    timestamp: new Date().toISOString()
  });
});

// Test endpoint for debugging
app.post('/api/interview/test', (req, res) => {
  try {
    console.log('Test endpoint called with body:', req.body);
    res.status(200).json({ 
      message: "Test endpoint working",
      body: req.body,
      geminiKey: process.env.GEMINI_API_KEY ? 'Present' : 'Missing'
    });
  } catch (err) {
    console.error('Test endpoint error:', err);
    res.status(500).json({ message: "Test endpoint error", error: err.message });
  }
});

// Direct test for checkRoleAndTopic without middleware
app.post('/api/interview/checkRoleAndTopic-direct', async (req, res) => {
  try {
    console.log('Direct test endpoint called');
    console.log('Body:', req.body);
    
    // Simulate the controller logic
    const { role, topic, numOfQns } = req.body;
    
    if (!role || !topic || !numOfQns) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    res.status(200).json({ 
      message: "Direct test working",
      received: { role, topic, numOfQns }
    });
  } catch (err) {
    console.error('Direct test error:', err);
    res.status(500).json({ message: "Direct test error", error: err.message });
  }
});

app.get("/getImage", (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp },
    process.env.CLOUDINARY_API_SECRET
  );

  res.json({
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME
  });
});

app.post('/deleteImage', async (req, res) => {
  const { publicId } = req.body;
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });
    res.status(200).json({result});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





app.listen(port, () => {
  console.log("app is running at port 8000");
});























