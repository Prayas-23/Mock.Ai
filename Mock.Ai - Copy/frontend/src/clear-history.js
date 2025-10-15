// Clear localStorage history data to fix object rendering issues
// Run this once to clean up any problematic data

export const clearHistoryData = () => {
  console.log('🧹 Clearing history data...');

  // Clear quiz results
  localStorage.removeItem('quizResults');
  console.log('✅ Cleared quiz results');

  // Clear interview analyses  
  localStorage.removeItem('interviewAnalyses');
  console.log('✅ Cleared interview analyses');

  console.log('🎉 History data cleared! Refresh the page to see clean history.');
  console.log('💡 You can delete this file after running it once.');
};

// Auto-run when imported
clearHistoryData();