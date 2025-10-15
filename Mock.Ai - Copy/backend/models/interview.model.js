import mongoose from "mongoose";
import { Schema } from "mongoose";

const interviewSchema = new Schema(
  {
    interviewId: {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'CompanyInterviewData'
    },
    participant: {
      type: String, // Supabase user ID is a string
      required: false // Made optional to handle anonymous users
    },
    questions: {
      type: [
        {
          question: {
            type: String,
            required: true
          },
          time: {
            type: Number,
            required: true
          }
        },
      ],
      required: true,
    },
    answers: {
      type: [String],
      required: true,
    },

    reviews : [
      {
        review : {
          type : String,
        },
        score : {
          type : Number
        }
      }
    ],

    totalScore : {
      type: Number,
    },

    overAllReview : {
      type: String,
    }

  },
  {
    timestamps: true,
  }
);

const InterviewData = mongoose.model("InterviewData", interviewSchema);

export default InterviewData;