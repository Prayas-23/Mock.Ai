import React, { useMemo } from 'react';
import { getQuizResults, getInterviewAnalyses } from '../lib/analysisStore.js';

function SectionCard({ title, children }) {
  return (
    <div className="w-full max-w-5xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 backdrop-blur-xl">
      <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Empty({ text }) {
  return (
    <div className="text-sm text-white/60 py-6">
      {text}
    </div>
  );
}

export default function History() {
  const quiz = useMemo(() => {
    const results = getQuizResults();
    console.log('📚 Quiz results loaded:', results.length);
    return results;
  }, []);
  
  const interviews = useMemo(() => {
    const results = getInterviewAnalyses();
    console.log('🎤 Interview analyses loaded:', results.length);
    return results;
  }, []);

  console.log('📄 History component rendered');

  return (
    <div className="min-h-screen w-full pt-28 pb-16 px-4 bg-gradient-to-b from-[#0a0a0a] via-[#0b0f19] to-[#000000] text-white">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">History</h1>

        {/* Quiz History */}
        <SectionCard title="Quiz History">
          {quiz.length === 0 ? (
            <Empty text="No saved quizzes yet." />
          ) : (
            <ul className="space-y-3">
              {quiz.map((q) => (
                <li key={q.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <p className="font-medium">{q.name || 'Quiz'}{q.subject ? ` - ${q.subject}` : ''}{q.level ? ` (${q.level})` : ''}</p>
                      <p className="text-xs text-white/60">{new Date(q.when).toLocaleString()}</p>
                    </div>
                    <div className="text-sm">
                      <span className="px-2 py-1 rounded-md bg-emerald-600/80">{q.score}/{q.total}</span>
                    </div>
                  </div>
                  {Array.isArray(q.details) && q.details.length > 0 && (
                    <details className="mt-3">
                      <summary className="cursor-pointer text-white/80">Review</summary>
                      <ul className="mt-2 space-y-2 text-sm">
                        {q.details.map((d, i) => (
                          <li key={i} className={`p-3 rounded-lg ${d.isCorrect ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
                            <div className="flex items-center justify-between gap-3">
                              <span>Q{i + 1}. {typeof d.question === 'string' ? d.question : d.question?.question || 'Question not available'}</span>
                              <span className={`text-xs px-2 py-1 rounded ${d.isCorrect ? 'bg-green-600' : 'bg-red-600'}`}>{d.isCorrect ? 'Correct' : 'Wrong'}</span>
                            </div>
                            <div className="mt-1 text-xs text-white/80">Your: {String(d.selectedAnswer ?? '—')} | Correct: {String(d.correctAnswer ?? '—')}</div>
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        {/* Interview Analyses */}
        <SectionCard title="Mock Interview Analyses">
          {interviews.length === 0 ? (
            <Empty text="No saved interview analyses yet." />
          ) : (
            <ul className="space-y-3">
              {interviews.map((it) => (
                <li key={it.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <p className="font-medium">{it.role || 'Interview'}{it.topics ? ` - ${it.topics}` : ''}</p>
                      <p className="text-xs text-white/60">{new Date(it.when).toLocaleString()}</p>
                    </div>
                    {(typeof it.totalScore === 'number') && (
                      <div className="text-sm"><span className="px-2 py-1 rounded-md bg-sky-600/80">Score: {it.totalScore}</span></div>
                    )}
                  </div>
                  {Array.isArray(it.details) && it.details.length > 0 && (
                    <details className="mt-3">
                      <summary className="cursor-pointer text-white/80">Details</summary>
                      <ul className="mt-2 space-y-2 text-sm">
                        {it.details.map((d, i) => (
                          <li key={i} className="p-3 rounded-lg bg-white/5">
                            <p className="font-medium">Q{i + 1}. {typeof d.question === 'string' ? d.question : d.question?.question || 'Question not available'}</p>
                            <p className="text-white/80 text-xs mt-1">Your answer: {d.answer}</p>
                            {d.suggestions && (
                              <p className="text-white/80 text-xs mt-1">Suggestions: {d.suggestions}</p>
                            )}
                            {typeof d.score === 'number' && (
                              <p className="text-white/80 text-xs mt-1">Score: {d.score}/10</p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
