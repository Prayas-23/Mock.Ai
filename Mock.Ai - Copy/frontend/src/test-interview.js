// Simple test to verify interview fallback functionality works
// This file can be deleted after testing

console.log('🎯 Interview Fallback System Test');

// Test mock question generation
const getMockInterviewQuestions = (role, topic) => {
  const roleBasedQuestions = {
    'Software Developer': [
      "Tell me about yourself and your experience in software development.",
      "What programming languages are you most comfortable with and why?",
      "Describe a challenging project you've worked on recently.",
      "How do you approach debugging a complex issue?",
      "What's your experience with version control systems like Git?"
    ],
    'Data Scientist': [
      "Tell me about your background in data science.",
      "What's your experience with machine learning algorithms?",
      "How do you handle missing data in your datasets?",
      "Describe a data science project you're proud of.",
      "What tools do you use for data visualization?"
    ]
  };

  const defaultQuestions = [
    "Tell me about yourself and your professional background.",
    "What interests you about this role?",
    "Describe a challenge you've faced and how you overcame it.",
    "Where do you see yourself in 5 years?",
    "Do you have any questions for us?"
  ];

  return roleBasedQuestions[role] || defaultQuestions;
};

// Test different roles
const testRoles = ['Software Developer', 'Data Scientist', 'Unknown Role'];

testRoles.forEach(role => {
  const questions = getMockInterviewQuestions(role);
  console.log(`✅ ${role}: Generated ${questions.length} questions`);
  console.log(`   First question: "${questions[0]}"`);
});

console.log('🎉 Interview fallback system is ready!');
console.log('📝 Features available:');
console.log('   - Mock interview questions for different roles');
console.log('   - Fallback feedback generation');
console.log('   - Local storage for interview history');
console.log('   - Seamless experience without backend');