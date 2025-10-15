import CompanyInterviewData from "../models/companyInterview.model.js";
import axios from 'axios'
import { validateRoleAndTopic } from '../utils/validateRoleAndTopic.js'
import { generateQuestions } from '../utils/generateQuestions.js'
import InterviewData from "../models/interview.model.js";
import { evaluateResult } from "../utils/evaluateResult.js";

export const createCompanyInterview = async (req, res) => {
  const userId = req.user.id; // Supabase user id
  const { role, numOfQns, topics } = req.body;

  if (!userId || !role || !numOfQns || !topics || topics.length === 0) {
    return res.status(400).json({ message: 'Please provide valid data' });
  }

  try {

    const { valid } = await validateRoleAndTopic({ role, topics });

    if (!valid) {
      return res.status(500).json({ message: 'Role and Topic are not valid!' });
    }

    const newData = new CompanyInterviewData({
      userId,
      interview: {
        role,
        numOfQns,
        topics
      }
    });

    await newData.save();

    return res.status(200).json({ message: 'Interview Data Created', newData });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Server error' });
  }
}


export const sendAllInterviews = async (req, res) => {
  const userId = req.user.id; // Supabase user id

  if (!userId) {
    return res.status(400).json({ message: 'Please provide valid data' });
  }

  try {
    const interviews = await CompanyInterviewData.find({ userId });
    return res.status(200).json({ message: 'Interview Data Fetched', interviews });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Server error' });
  }
}



export const searchInterviews = async (req, res) => {
  const { username } = req.body;
  const currentUserId = req.user.id; // Supabase user id

  try {
    if (!username || username.trim() === '') {
      return res.status(400).json({ message: 'Username is required' });
    }

    // For now, return all interviews since we don't have MongoDB user collection
    // In a full implementation, you would search through Supabase profiles
    const interviews = await CompanyInterviewData.find({
      userId: { $ne: currentUserId }
    });

    return res.status(200).json({ interviews });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};


export const generateInterviewQuestions = async (req, res) => {
  const { role, numOfQns, topic, interviewId } = req.body;

  const participant = req.user.id; // Supabase user id

  if (!interviewId || !role || !numOfQns || !topic) {
    return res.status(400).json({ message: 'Please provide valid data' });
  }

  try {

    const existing = await InterviewData.findOne({ interviewId, participant });
    if (existing) {
      return res.status(409).json({
        message: 'Already attended the Interview!'
      });
    }

    const questions = await generateQuestions({ role, topic, numOfQns });

    const interviewData = new InterviewData({
      interviewId,
      participant,
      questions,
      answers: questions.map(() => "Answer Not Provided.")
    });

    await interviewData.save();

    return res.status(200).json({ interviewData });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Server error' });
  }
}


export const evaluateInterviewResult = async (req, res) => {

  const { interviewId } = req.body;

  if (!interviewId) {
    return res.status(501).json({ message: "Missing interviewId" });
  }

  try {

    // Don't populate participant since User model doesn't exist in current setup
    const interviewData = await InterviewData.findById(interviewId);
    
    if (!interviewData) {
      return res.status(404).json({ message: "Interview not found" });
    }

    const { questions, answers } = interviewData;

    const result = await evaluateResult({ questions, answers });

    const { reviews, totalScore, overAllReview } = result;

    interviewData.reviews = reviews;
    interviewData.totalScore = totalScore;
    interviewData.overAllReview = overAllReview;

    await interviewData.save();

    res.status(200).json({ message: "Interview data saved!", interviewData });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Server error' });
  }
}


export const getAllCandidates = async (req, res) => {

  const {interviewId} = req.body;

  if(!interviewId){
    return res.status(501).json({ message: "Missing interviewId" });
  }

  try{
    
    // Don't populate participant since User model doesn't exist in current setup
    const candidates = await InterviewData.find({interviewId});

    return res.status(200).json({candidates});

  }catch(err){
    console.log(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

















