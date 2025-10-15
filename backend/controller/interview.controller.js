import axios from 'axios';
import InterviewData from '../models/interview.model.js';
import { callGeminiFlash } from '../utils/geminiHelper.js';

export const generateQuestions = async (req, res) => {
  const { role, topic, name, previousQuestions = [], askedQuestion, numOfQns, modelId } = req.body;
  let { givenAnswer } = req.body;
  const email = req.user?.email;

  if (!role || !topic || !name) {
    return res.status(500).json({ message: "Must provide a role, topic, and name!" });
  }

  if (!modelId) {
    return res.status(500).json({ message: "Must provide a modelId!" });
  }

  if (previousQuestions.length > 0 && (!askedQuestion || !givenAnswer)) {
    console.error('Missing fields for follow-up:', { askedQuestion, givenAnswer });
    return res.status(400).json({
      message: "For follow-up questions, must provide askedQuestion and givenAnswer!",
      received: { askedQuestion, givenAnswer }
    });
  }

  givenAnswer = givenAnswer?.trim() === "" ? "Answer Not Provided." : givenAnswer;

  try {
    let prompt;
    let aiResponse;
    let response;
    let finishInterview = false;

    if (previousQuestions.length === 0) {
      const prompt = `You are conducting a professional interview for a ${role} position, focusing on ${topic}.

      Your task is to generate:

      1. A warm, professional **welcome message** for the candidate **${name}**, written as **three short parts in a single line** (no line breaks or \\n).
        - The entire message must be **under 200 words**.
        - Structure it as three logically separated parts (e.g., greeting + purpose + encouragement), but keep it in one continuous line.
        - Mention the job title clearly and naturally (e.g., “as a frontend developer” instead of “for this role”).
        - Use a professional but friendly tone.
        - Do **not** mention AI, mock interviews, or simulations.
        - Avoid line breaks, bullet points, and numbered lists.

      2. A **standalone transition phrase** to smoothly begin the first question.
        - It must be a **phrase or sentence fragment**, not a complete sentence or question.
        - It must **not** include any background, resume hints, or job-related content.
        - It must be **professional and slightly varied**, like “Let’s begin with” or “To get things started,”.
        - It must **not** contain a question mark.

      Return STRICT JSON only in this format:
      {
        "addressing": "single-line welcome message",
        "transition": "transition phrase"
      }`;

      response = await callGeminiFlash(prompt);

      const { addressing, transition } = response;

      if (!addressing || !transition) {
        return res.status(500).json({ message: "Failed to generate question!" });
      }

      const data = await InterviewData.findById(modelId);
      const question = data.questions[0];

      let transitionData = transition.trim();
      if (transitionData.endsWith(".")) {
        transitionData = transitionData.slice(0, -1) + ",";
      } else if (!transitionData.endsWith(",")) {
        transitionData += ",";
      }

      let responseData = addressing + " " + transitionData + " " + question.question;

      return res.status(200).json({ message: "Question generated!", question, responseData, finishInterview });

    } else {

      if (previousQuestions.length == numOfQns) {

        prompt = `You are conducting a professional interview for ${role} focusing on ${topic}.

        Previous Question: "${askedQuestion}"
        Candidate Answer: "${(givenAnswer || '').trim() || '[No answer provided]'}"

        Generate:

        1. FEEDBACK (STRICT RULES):
          - Exactly 2 professional sentences
          - Use "you/your" to address the candidate directly
          - Only assess the answer — no suggestions, tips, or ratings
          - The tone must be objective and professional — avoid encouraging or consoling language
          - Only assess the answer — do not offer suggestions, praise, tips, or requests to try again
          - If the answer is incorrect, missing, or incomplete, state that directly and factually
          - Do not ask the candidate to answer the question again while giving feedback
          - If no answer was given, indicate that clearly and professionally
          - Example (if no answer): "You did not provide a response to the question. This may reflect a gap in your understanding of the topic."
          - Example: (normal): "Your explanation covered X well. You might clarify Y."


        2. END MESSAGE (STRICT RULES):
          - Generate a professional, warm, and slightly longer thank-you message (2–3 sentences)
          - Express appreciation for the candidate’s time, effort, and responses
          - Each time, use **different wording** — avoid repeating any previously used thank-you messages
          - Match the tone of this example, but do not copy it:  
            "Thank you for participating in this interview. Your insights were valuable and demonstrated thoughtful engagement. We appreciate the time and effort you invested."

        Return STRICT JSON:
        {
          "feedback": "your 2-sentence feedback",
          "transition": "a 2–3 sentence thank-you message to end the interview"
        }
        ONLY return this JSON with no other text.`;

        finishInterview = true;

      } else {

        prompt = `You are conducting a professional interview for ${role} focusing on ${topic}.

        Previous Question: "${askedQuestion}"
        Candidate Answer: "${(givenAnswer || '').trim() || '[No answer provided]'}"

        Generate:

        1. FEEDBACK (STRICT RULES):
          - Exactly 2 professional sentences
          - Use "you/your" to address the candidate directly
          - Only assess the answer — no suggestions, tips, or ratings
          - The tone must be objective and professional — avoid encouraging or consoling language
          - Only assess the answer — do not offer suggestions, praise, tips, or requests to try again
          - If the answer is incorrect, missing, or incomplete, state that directly and factually
          - Do not ask the candidate to answer the question again while giving feedback
          - If no answer was given, indicate that clearly and professionally
          - Example (if no answer): "You did not provide a response to the question. This may reflect a gap in your understanding of the topic."
          - Example: (normal): "Your explanation covered X well. You might clarify Y."

        2. TRANSITION (STRICT RULES):
          - Use one of these openings:
            "Next, let's discuss,", "Moving on to,", "Now, consider,"
          - Do NOT include a question — just a natural lead-in to a new topic
          - End with a colon or ellipsis, not a full sentence or question
          - Do NOT include a specific topic name

        Return STRICT JSON:
        {
          "feedback": "your 2-sentence feedback",
          "transition": "transition phrase only (no question)"
        }
        ONLY return this JSON with no other text.`;
      }

      response = await callGeminiFlash(prompt);
      const { feedback, transition } = response;

      const data = await InterviewData.findById(modelId);
      const question = data.questions[previousQuestions.length];

      let transitionData = transition.trim();


      if (!question) {
        if (transitionData.endsWith(",")) {
          transitionData = transitionData.slice(0, -1) + ".";
        } else if (!transitionData.endsWith(".")) {
          transitionData += ".";
        }
      } else {
        if (transitionData.endsWith(".")) {
          transitionData = transitionData.slice(0, -1) + ",";
        } else if (!transitionData.endsWith(",")) {
          transitionData += ",";
        }
      }

      data.answers[previousQuestions.length - 1] = givenAnswer;
      await data.save();

      let responseData = "";

      if (!question) {
        responseData = feedback + " " + transitionData;
      } else {
        responseData = feedback + " " + transitionData + " " + question.question;
      }

      return res.status(200).json({ message: "Question generated!", question, responseData, finishInterview });
    }

  } catch (err) {
    console.error("Error in generateQuestions:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};




export const checkRoleAndTopic = async (req, res) => {
  try {
    console.log('=== checkRoleAndTopic START ===');
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);
    console.log('User from middleware:', req.user);
    
    let { role, topic, numOfQns } = req.body;
    // Basic sanitization and coercion
    role = typeof role === 'string' ? role.trim() : '';
    topic = typeof topic === 'string' ? topic.trim() : '';
    numOfQns = typeof numOfQns === 'string' ? parseInt(numOfQns, 10) : Number(numOfQns);
    if (!Number.isFinite(numOfQns)) numOfQns = 0;
    
    // Use user ID as participant (Supabase or local auth)
    const participant = req.user?.id || `anonymous_${Date.now()}`;

    if (!role || !topic || !numOfQns) {
      console.log('Missing required fields:', { role, topic, numOfQns });
      return res.status(400).json({ message: "Provide valid inputs" });
    }

    if (numOfQns < 2 || numOfQns > 25) {
      console.log('Invalid numOfQns:', numOfQns);
      return res.status(400).json({ message: "Please provide a number of questions between 2 and 25." });
    }

    console.log('Participant ID:', participant);

    // Generate fallback questions directly
    console.log('Generating fallback questions directly');
    const questions = [
      { question: "Tell me about your experience in this field.", time: 50 },
      { question: "What are your key strengths for this role?", time: 45 },
      { question: "Describe a challenging project you worked on.", time: 50 },
      { question: "How do you stay updated with industry trends?", time: 45 },
      { question: "What motivates you in your professional work?", time: 40 },
      { question: "How do you handle working under pressure?", time: 45 },
      { question: "What interests you most about this position?", time: 40 },
      { question: "Where do you see yourself in 5 years?", time: 50 },
      { question: "How do you approach problem-solving?", time: 45 },
      { question: "What makes you a good fit for our company?", time: 50 },
      { question: "Describe a time you had to work in a team.", time: 50 },
      { question: "How do you prioritize your work tasks?", time: 40 },
      { question: "What is your greatest professional achievement?", time: 50 },
      { question: "How do you handle constructive criticism?", time: 45 },
      { question: "What tools or technologies are you most proficient in?", time: 45 },
      { question: "How do you ensure the quality of your work?", time: 40 },
      { question: "Describe a situation where you had to adapt to change.", time: 50 },
      { question: "What do you know about our company?", time: 45 },
      { question: "How do you manage your time and meet deadlines?", time: 45 },
      { question: "What would you do if you disagreed with your supervisor?", time: 50 },
      { question: "How do you continue learning in your field?", time: 40 },
      { question: "Tell me about a time you showed leadership.", time: 50 },
      { question: "What are your salary expectations?", time: 40 },
      { question: "Do you have any questions for us?", time: 60 },
      { question: "Is there anything else you'd like to add?", time: 45 }
    ].slice(0, numOfQns);

    const response = {
      valid: true,
      questions: questions
    };

    console.log('Using generated response:', response);
    
    if (response.valid && response.questions && response.questions.length > 0) {
      console.log('Questions are valid, proceeding with database save...');
      
      // Save to database
      try {
        const interviewData = {
          participant,
          questions: response.questions,
          answers: response.questions.map(() => "Answer Not Provided.")
        };

        console.log('About to create new InterviewData with:', interviewData);
        const newData = new InterviewData(interviewData);
        console.log('InterviewData created, about to save...');
        
        await newData.save();
        console.log('Data saved successfully');
        
        const interviewModelId = newData._id;
        console.log('Interview model ID:', interviewModelId);

        return res.status(200).json({ 
          message: "Questions generated", 
          response, 
          interviewModelId 
        });
      } catch (saveErr) {
        console.error('Database save error:', saveErr);
        return res.status(500).json({
          message: 'Database save failed',
          error: saveErr.message,
        });
      }
    }

    return res.status(200).json({ 
      message: "Questions generated", 
      response 
    });

  } catch (err) {
    console.error('=== ERROR in checkRoleAndTopic ===');
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    console.error('Request body was:', req.body);
    return res.status(500).json({ 
      message: "Server Error", 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
}
