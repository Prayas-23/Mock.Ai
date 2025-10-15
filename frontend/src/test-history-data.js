// Test data for History page
// This file can be deleted after testing

import { saveQuizResult, saveInterviewAnalysis } from './lib/analysisStore.js';

console.log('📚 Creating test data for History page');

// Create test quiz results
const testQuizResults = [
  {
    name: 'JavaScript Fundamentals',
    subject: 'Programming',
    level: 'Beginner',
    when: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    score: 8,
    total: 10,
    details: [
      {
        question: 'What is a variable in JavaScript?',
        selectedAnswer: 'A container for storing data',
        correctAnswer: 'A container for storing data',
        isCorrect: true
      },
      {
        question: 'Which keyword is used to declare a constant?',
        selectedAnswer: 'const',
        correctAnswer: 'const',
        isCorrect: true
      },
      {
        question: 'What does DOM stand for?',
        selectedAnswer: 'Document Object Model',
        correctAnswer: 'Document Object Model',
        isCorrect: true
      }
    ]
  },
  {
    name: 'React Basics',
    subject: 'Frontend',
    level: 'Intermediate',
    when: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    score: 7,
    total: 10,
    details: [
      {
        question: 'What is JSX?',
        selectedAnswer: 'JavaScript XML',
        correctAnswer: 'JavaScript XML',
        isCorrect: true
      },
      {
        question: 'Which hook is used for state management?',
        selectedAnswer: 'useState',
        correctAnswer: 'useState',
        isCorrect: true
      }
    ]
  }
];

// Create test interview analyses
const testInterviewAnalyses = [
  {
    role: 'Software Developer',
    topics: 'JavaScript, React, Node.js',
    when: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    totalScore: 42,
    overall: 'Good performance overall. Strong technical knowledge with room for improvement in communication.',
    details: [
      {
        question: 'Tell me about yourself and your experience in software development.',
        answer: 'I have 3 years of experience working with JavaScript and React...',
        suggestions: 'Great introduction! Consider mentioning specific projects or achievements.',
        score: 8
      },
      {
        question: 'What programming languages are you most comfortable with?',
        answer: 'I am most comfortable with JavaScript, TypeScript, and Python...',
        suggestions: 'Excellent technical knowledge. Good explanation of language preferences.',
        score: 9
      },
      {
        question: 'Describe a challenging project you\'ve worked on recently.',
        answer: 'Recently I worked on a real-time chat application using Socket.io...',
        suggestions: 'Good project example. Could provide more details about challenges faced.',
        score: 7
      }
    ]
  },
  {
    role: 'Frontend Developer',
    topics: 'HTML, CSS, JavaScript, React',
    when: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    totalScore: 38,
    overall: 'Solid frontend knowledge with good understanding of modern frameworks.',
    details: [
      {
        question: 'How do you ensure your websites are responsive?',
        answer: 'I use CSS Grid and Flexbox along with media queries...',
        suggestions: 'Great approach! Consider mentioning mobile-first design principles.',
        score: 8
      },
      {
        question: 'What is your experience with React hooks?',
        answer: 'I have extensive experience with useState, useEffect, and custom hooks...',
        suggestions: 'Excellent knowledge of React hooks. Well explained.',
        score: 9
      }
    ]
  }
];

// Save test data
console.log('💾 Saving test quiz results...');
testQuizResults.forEach(quiz => {
  saveQuizResult(quiz);
});

console.log('💾 Saving test interview analyses...');
testInterviewAnalyses.forEach(interview => {
  saveInterviewAnalysis(interview);
});

console.log('✅ Test data created successfully!');
console.log('📊 Created:');
console.log(`   - ${testQuizResults.length} quiz results`);
console.log(`   - ${testInterviewAnalyses.length} interview analyses`);
console.log('🎯 You can now visit the History page to see the test data!');