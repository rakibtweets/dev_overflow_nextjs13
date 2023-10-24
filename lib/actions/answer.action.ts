'use server';

import Answer from '@/database/answer.model';
import { connectToDatabase } from '../db/mongoose';
import {
  AnswerVoteParams,
  CreateAnswerParams,
  GetAnswersParams
} from './shared.types';
import Question from '@/database/question.model';
import { revalidatePath } from 'next/cache';

export const createAnswer = async (params: CreateAnswerParams) => {
  try {
    connectToDatabase();
    const { author, content, path, question } = params;

    const newAnswer = await Answer.create({
      author,
      content,
      question
    });

    // add the answer to the question answers array
    await Question.findByIdAndUpdate(question, {
      $push: {
        answers: newAnswer._id
      }
    });

    // Todo: add interaction

    revalidatePath(path);

    return newAnswer;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAnswers = async (params: GetAnswersParams) => {
  try {
    connectToDatabase();
    const { questionId } = params;
    const answers = await Answer.find({ question: questionId })
      .populate('author', '_id clerkId name picture')
      .sort({ createdAt: -1 });
    return { answers };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const upvoteAnswer = async (params: AnswerVoteParams) => {
  try {
    connectToDatabase();

    const { answerId, userId, hasupVoted, path, hasdownVoted } = params;

    let updateQuery = {};
    if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId }
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true
    });
    if (!answer) {
      throw new Error('No Answer found');
    }

    // Todo: increment author's reputation

    revalidatePath(path);

    // get user by id
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const downVoteAnswer = async (params: AnswerVoteParams) => {
  try {
    connectToDatabase();

    const { answerId, userId, hasupVoted, path, hasdownVoted } = params;

    let updateQuery = {};
    if (hasdownVoted) {
      updateQuery = { $pull: { downvotes: userId } };
    } else if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId }
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true
    });
    if (!answer) {
      throw new Error('No answer found');
    }

    // Todo: increment author's reputation

    revalidatePath(path);

    // get user by id
  } catch (error) {
    console.log(error);
    throw error;
  }
};
