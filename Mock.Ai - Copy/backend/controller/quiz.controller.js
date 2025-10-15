import axios from 'axios'
import { callGeminiFlash } from '../utils/geminiHelper.js'

export const checkRoleAndTopicQuiz = async (req, res) => {
  try {
    const { role, topic, numOfQns, level } = req.body;
    const email = req.user?.email; // Supabase user email

  if (!role || !topic || !numOfQns || !level) {
    return res.status(500).json({ message: "Provide valid inputs" });
  }

  if (numOfQns < 2 || numOfQns > 25) {
    return res.status(400).json({ message: "Please provide a number of questions between 2 and 25." });
  }

  try {
    const prompt = `
      You are an expert AI interview assistant.

      Your task:
      - Validate whether the given role and topic are appropriate and related.
      - If valid, generate an array of unique, concise, and multiple-choice interview questions relevant to the role and topic.

      Constraints:
      1. Generate exactly ${numOfQns} unique and non-repetitive MCQ (Multiple Choice Questions).
      2. Each question should be focused, clear, and answerable within a 30–60 second context.
      3. Each question must have exactly 4 distinct options.
      4. Clearly mark the correct answer for each question.
      5. Difficulty of the questions should match this level: "${level}".
      6. Avoid redundancy — all questions should differ in wording and focus.
      7. Avoid overly technical or essay-type questions unless appropriate for the specified role and level.
      8. Return your response **strictly** in the following JSON format — without any explanation:

      If valid:
      {
        "valid": true,
        "questions": [
          {
            "question": "First unique MCQ?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "answer": "Correct Option"
          },
          {
            "question": "Second unique MCQ?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "answer": "Correct Option"
          }
          ...
        ]
      }

      If invalid (i.e., if the role and topic do not match or are inappropriate):
      {
        "valid": false,
        "questions": []
      }

      Now process this input:
      Role: ${role}
      Topic: ${topic}
      Difficulty Level: ${level}

      Only respond with the JSON object as described above.`;

    const response = await callGeminiFlash(prompt);

    let { valid, questions } = response;

    questions = questions.map(q => ({
      ...q,
      time: q.time ?? 50
    }));

    if (valid) {
      questions = questions.slice(0, numOfQns);
      return res.status(200).json({ message: "Questions generated", response, questions });
    }

    return res.status(200).json({ message: "Questions generated", response });

  } catch (err) {
    console.error('Quiz generation error:', err.message);
    return res.status(500).json({ message: "Server Error" });
  }
  } catch (err) {
    console.error('Outer quiz generation error:', err.message);
    return res.status(500).json({ message: "Server Error" });
  }
}














