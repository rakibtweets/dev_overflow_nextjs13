'use server';

import Question from '@/database/question.model';
import { connectToDatabase } from '../db/mongoose';
import Tag from '@/database/tag.model';
import { CreateQuestionParams, GetQuestionsParams } from './shared.types';
import User from '@/database/user.model';
import { revalidatePath } from 'next/cache';

export const getQuestions = async (params: GetQuestionsParams) => {
  try {
    connectToDatabase();

    const questions = await Question.find({})
      .populate({
        path: 'tags',
        model: Tag
      })
      .populate({ path: 'author', model: User })
      .sort({ createdAt: -1 });

    return { questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createQuestion = async (params: CreateQuestionParams) => {
  // eslint-disable-next-line no-empty
  try {
    // connect to DATABASE
    connectToDatabase();
    const { title, content, tags, author, path } = params;

    // create a new question
    const question = await Question.create({
      title,
      content,
      author
    });

    // tag documents array
    const tagDocuments = [];

    // create tags or get them if they already exist
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        {
          name: {
            $regex: new RegExp(`^${tag}$`, 'i')
          }
        },
        { $setOnInsert: { name: tag }, $push: { question: question._id } },
        { upsert: true, new: true }
      );

      tagDocuments.push(existingTag._id);
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } }
    });

    // create a interaction record for the user's ask question action

    // increament author reputation by +5 points for creating a question

    revalidatePath(path);
  } catch (error) {}
};
