'use server';

import Answer from '@/database/answer.model';
import { connectToDatabase } from '../db/mongoose';
import { CreateAnswerParams } from './shared.types';
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
