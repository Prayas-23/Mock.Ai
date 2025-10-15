import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext.jsx';
import axios from 'axios';
import apiClient from '../lib/apiClient.js';
import toast from 'react-hot-toast';
import useConversation from '../stateManage/useConversation.js';
import server from '../environment.js';

const QuizForm = () => {
  const [formData, setFormData] = useState({
    jobRole: '',
    subject: '',
    level: 'easy',
    count: 5,
  });

  const { setConfig } = useQuiz(); 
  const navigate = useNavigate();  
  const [loading, setLoading] = useState(false);
  const {setQuizData} = useConversation();
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Mock quiz generation for fallback
  const generateMockQuiz = (role, topic, level, count) => {
    const difficulties = {
      easy: { timeLimit: 30, complexity: 'basic' },
      medium: { timeLimit: 45, complexity: 'intermediate' },
      hard: { timeLimit: 60, complexity: 'advanced' }
    };

    const questionTemplates = {
      'Software Developer': {
        'JavaScript': [
          { question: 'What is the difference between let and var in JavaScript?', options: ['Block scope vs function scope', 'No difference', 'Let is faster', 'Var is newer'], correct: 0 },
          { question: 'Which method is used to add an element to the end of an array?', options: ['push()', 'pop()', 'shift()', 'unshift()'], correct: 0 },
          { question: 'What does "this" keyword refer to in JavaScript?', options: ['Current object', 'Global object', 'Function', 'Variable'], correct: 0 },
          { question: 'How do you create a promise in JavaScript?', options: ['new Promise()', 'Promise.create()', 'createPromise()', 'Promise.new()'], correct: 0 },
          { question: 'What is closure in JavaScript?', options: ['Function with access to outer scope', 'Closed function', 'Private function', 'Anonymous function'], correct: 0 }
        ],
        'React': [
          { question: 'What is JSX in React?', options: ['JavaScript XML', 'Java Syntax Extension', 'JSON XML', 'JavaScript Extension'], correct: 0 },
          { question: 'Which hook is used for state management?', options: ['useState', 'useEffect', 'useContext', 'useReducer'], correct: 0 },
          { question: 'What is the virtual DOM?', options: ['JavaScript representation of DOM', 'Real DOM copy', 'Browser DOM', 'HTML DOM'], correct: 0 },
          { question: 'How do you pass data from parent to child?', options: ['Props', 'State', 'Context', 'Redux'], correct: 0 },
          { question: 'What is useEffect used for?', options: ['Side effects', 'State management', 'Event handling', 'Rendering'], correct: 0 }
        ],
        'Python': [
          { question: 'What is the difference between list and tuple?', options: ['List is mutable, tuple is immutable', 'No difference', 'Tuple is faster', 'List is newer'], correct: 0 },
          { question: 'How do you create a virtual environment?', options: ['python -m venv env', 'create venv', 'new env', 'venv create'], correct: 0 },
          { question: 'What is a decorator in Python?', options: ['Function that modifies another function', 'Class modifier', 'Variable decorator', 'Import statement'], correct: 0 },
          { question: 'How do you handle exceptions?', options: ['try/except', 'catch/throw', 'handle/error', 'exception/catch'], correct: 0 },
          { question: 'What is list comprehension?', options: ['Concise way to create lists', 'List method', 'List property', 'List function'], correct: 0 }
        ]
      },
      'Data Scientist': {
        'Python': [
          { question: 'Which library is used for data manipulation?', options: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn'], correct: 0 },
          { question: 'What is a DataFrame?', options: ['2D data structure', '1D array', 'Database', 'File format'], correct: 0 },
          { question: 'How do you handle missing data?', options: ['dropna() or fillna()', 'remove()', 'delete()', 'clean()'], correct: 0 },
          { question: 'What is machine learning?', options: ['AI that learns from data', 'Manual programming', 'Database query', 'Web development'], correct: 0 },
          { question: 'Which algorithm is used for classification?', options: ['Random Forest', 'Linear Regression', 'K-means', 'PCA'], correct: 0 }
        ],
        'Statistics': [
          { question: 'What is the mean?', options: ['Average of values', 'Middle value', 'Most frequent value', 'Range of values'], correct: 0 },
          { question: 'What is standard deviation?', options: ['Measure of spread', 'Average value', 'Maximum value', 'Minimum value'], correct: 0 },
          { question: 'What is correlation?', options: ['Relationship between variables', 'Causation', 'Regression', 'Classification'], correct: 0 },
          { question: 'What is p-value?', options: ['Probability of null hypothesis', 'Confidence level', 'Sample size', 'Effect size'], correct: 0 },
          { question: 'What is regression?', options: ['Predicting continuous values', 'Classification', 'Clustering', 'Dimensionality reduction'], correct: 0 }
        ]
      }
    };

    // Get questions for the specific role and topic, or use generic questions
    let questions = questionTemplates[role]?.[topic] || [
      { question: `What is a key concept in ${topic}?`, options: ['Fundamental principle', 'Advanced technique', 'Basic operation', 'Complex algorithm'], correct: 0 },
      { question: `How would you approach a ${topic} problem?`, options: ['Systematic analysis', 'Random approach', 'Ignore the problem', 'Ask someone else'], correct: 0 },
      { question: `What tool is commonly used in ${topic}?`, options: ['Industry standard tool', 'Outdated software', 'Personal preference', 'No tools needed'], correct: 0 },
      { question: `What is best practice in ${topic}?`, options: ['Follow established patterns', 'Make it up', 'Copy from others', 'Avoid documentation'], correct: 0 },
      { question: `How do you stay updated with ${topic}?`, options: ['Continuous learning', 'Never update', 'Only when forced', 'Ignore changes'], correct: 0 }
    ];

    // Shuffle and limit questions
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, Math.min(count, shuffled.length));

    return selectedQuestions.map((q, index) => ({
      id: index + 1,
      question: q.question,
      options: q.options,
      correct: q.correct,
      timeLimit: difficulties[level].timeLimit
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!formData || !formData.jobRole || !formData.subject || !formData.level || !formData.count){
      return;
    }

    console.log("Starting quiz generation...");
    setConfig(formData);    
    
    try {
      setLoading(true);
      const role = formData.jobRole;
      const topic = formData.subject;
      const level = formData.level;
      const numOfQns = parseInt(formData.count);

      try {
        // Try backend API first
        const { data } = await apiClient.post(
          `${server}/api/quiz/generate-quiz-questions`,
          {
            role, topic, numOfQns, level
          }
        );

        console.log('Backend response:', data.response);
        if (!data.response.valid) {
          throw new Error("Invalid role or topic");
        }

        const {questions} = data;
        setQuizData(questions);
        toast.success('Quiz generated successfully!');

      } catch (backendError) {
        console.log('Backend failed, using fallback:', backendError);
        
        // Generate mock quiz as fallback
        const mockQuestions = generateMockQuiz(role, topic, level, numOfQns);
        setQuizData(mockQuestions);
        
        toast.success(`Generated ${mockQuestions.length} questions for ${topic} (${level} level)`);
        console.log('Generated mock quiz:', mockQuestions);
      }

      setLoading(false);
      navigate('/quiz/start');

    } catch (err) {
      console.error('Quiz generation failed:', err);
      setLoading(false);
      toast.error('Failed to generate quiz. Please try again.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white p-8 rounded-2xl shadow-2xl space-y-6 transition-all duration-300 ease-in-out"
    >
      {/* <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
        🎯 Customize Your Quiz
      </h2> */}

      {/* Job Role */}
      <input
        type="text"
        name="jobRole"
        placeholder=" 🎯Target Job Role"
        className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={handleChange}
        required
      />

      {/* topic */}
      <input
        type="text"
        name="subject"
        placeholder=" 📝Topic For Quiz"
        className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={handleChange}
        required
      />

      {/* Difficulty */}
      <select
        name="level"
        className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={handleChange}
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      {/* Question Count */}
      <input
        type="number"
        name="count"
        min="1"
        max="20"
        placeholder="Number of Questions"
        className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={handleChange}
        required
      />

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-200 ease-in-out shadow-md hover:shadow-lg"
      >
        {loading ? '⏳ Generating Quiz...' : '🚀 Start Quiz'}
      </button>
    </form>
  );
};

export default QuizForm;
