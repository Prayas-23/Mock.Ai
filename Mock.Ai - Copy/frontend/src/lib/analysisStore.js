// Simple client-side persistence for quiz and interview analyses
// Uses localStorage to store arrays under keys: 'quizResults' and 'interviewAnalyses'

// Utility function to ensure question is a string
function normalizeQuestion(question) {
  if (typeof question === 'string') {
    return question;
  }
  if (typeof question === 'object' && question !== null) {
    return question.question || question.text || String(question);
  }
  return String(question || 'Question not available');
}

export function saveQuizResult(record) {
  try {
    const key = 'quizResults';
    const prev = JSON.parse(localStorage.getItem(key) || '[]');
    
    // Normalize the record to ensure questions are strings
    const normalizedRecord = {
      ...record,
      details: record.details ? record.details.map(detail => ({
        ...detail,
        question: normalizeQuestion(detail.question)
      })) : []
    };
    
    prev.unshift({ ...normalizedRecord, id: crypto.randomUUID?.() || String(Date.now()) });
    localStorage.setItem(key, JSON.stringify(prev.slice(0, 50))); // cap to last 50
    return true;
  } catch (e) {
    console.error('Failed to save quiz result', e);
    return false;
  }
}

export function getQuizResults() {
  try {
    return JSON.parse(localStorage.getItem('quizResults') || '[]');
  } catch {
    return [];
  }
}

export function saveInterviewAnalysis(record) {
  try {
    const key = 'interviewAnalyses';
    const prev = JSON.parse(localStorage.getItem(key) || '[]');
    
    // Normalize the record to ensure questions are strings
    const normalizedRecord = {
      ...record,
      details: record.details ? record.details.map(detail => ({
        ...detail,
        question: normalizeQuestion(detail.question)
      })) : []
    };
    
    prev.unshift({ ...normalizedRecord, id: crypto.randomUUID?.() || String(Date.now()) });
    localStorage.setItem(key, JSON.stringify(prev.slice(0, 50)));
    return true;
  } catch (e) {
    console.error('Failed to save interview analysis', e);
    return false;
  }
}

export function getInterviewAnalyses() {
  try {
    return JSON.parse(localStorage.getItem('interviewAnalyses') || '[]');
  } catch {
    return [];
  }
}
