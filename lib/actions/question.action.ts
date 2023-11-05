'use server';

import Question from '@/database/question.model';
import { connectToDatabase } from '../db/mongoose';
import Tag from '@/database/tag.model';
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams
} from './shared.types';
import User from '@/database/user.model';
import { revalidatePath } from 'next/cache';
import Answer from '@/database/answer.model';
import Interaction from '@/database/interaction.model';
import { FilterQuery } from 'mongoose';

export const getQuestions = async (params: GetQuestionsParams) => {
  try {
    connectToDatabase();
    const { searchQuery, filter, page = 1, pageSize = 10 } = params;

    // calculate the no of posts to skip based on page number and page size
    // pagination: skip = (page - 1) * pageSize

    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, 'i') } },
        { content: { $regex: new RegExp(searchQuery, 'i') } }
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;

      case 'frequent':
        sortOptions = { views: -1 };
        break;

      case 'unanswered':
        query.answers = { $size: 0 };
        break;

      default:
        break;
    }

    const questions = await Question.find(query)
      .populate({
        path: 'tags',
        model: Tag
      })
      .populate({ path: 'author', model: User })
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);

    const totalQuestions = await Question.countDocuments(query);

    const isNext = totalQuestions > skipAmount + questions.length;

    return { questions, isNext };
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
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );

      tagDocuments.push(existingTag._id);
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } }
    });

    // todo: create a interaction record for the user's ask question action

    await Interaction.create({
      user: author,
      question: question._id,
      action: 'ask-question',
      tags: tagDocuments
    });

    // todo: increament author reputation by +5 points for creating a question

    await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getQuestionById = async (params: GetQuestionByIdParams) => {
  try {
    connectToDatabase();
    const { questionId } = params;

    const question = await Question.findById(questionId)
      .populate({ path: 'tags', model: Tag, select: '_id name' })
      .populate({
        path: 'author',
        model: User,
        select: '_id clerkId name picture'
      });

    return { question };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const upvoteQuestion = async (params: QuestionVoteParams) => {
  try {
    connectToDatabase();

    const { questionId, userId, hasupVoted, path, hasdownVoted } = params;

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

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true
    });
    if (!question) {
      throw new Error('No question found');
    }

    // ? increment author's reputation by +1/-1 for upvoting/revoking an upvote to the question

    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasupVoted ? -1 : 1 }
    });

    // ? Increment user's reputation by +10/-10 for recieving and upvote/revoking an upvote to the question

    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasupVoted ? -10 : 10 }
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const downVoteQuestion = async (params: QuestionVoteParams) => {
  try {
    connectToDatabase();

    const { questionId, userId, hasupVoted, path, hasdownVoted } = params;

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

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true
    });
    if (!question) {
      throw new Error('No question found');
    }

    // ? decrement author's reputation
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasupVoted ? -2 : 2 }
    });

    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasupVoted ? -10 : 10 }
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteQuestion = async (params: DeleteQuestionParams) => {
  try {
    connectToDatabase();
    const { questionId, path } = params;

    await Question.deleteOne({ _id: questionId });
    await Answer.deleteMany({ question: questionId });
    await Interaction.deleteMany({ question: questionId });
    await Tag.updateMany(
      { question: questionId },
      { $pull: { questions: questionId } }
    );

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const editQuestion = async (params: EditQuestionParams) => {
  try {
    connectToDatabase();

    const { questionId, title, content, path } = params;

    const question = await Question.findById(questionId).populate('tags');

    if (!question) {
      throw new Error('No question found');
    }
    question.title = title;
    question.content = content;

    await question.save();
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getTopQuestions = async () => {
  try {
    connectToDatabase();
    const topQuestions = await Question.find({})
      .sort({ views: -1, upvotes: -1 })
      .limit(5);

    return topQuestions;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

interface RecommededParams {
  userId: string;
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}

export const getRecommendedQuestions = async (params: RecommededParams) => {
  try {
    connectToDatabase();
    const { userId, page = 1, pageSize = 10, searchQuery } = params;

    // find user
    const user = await User.findOne({ clerkId: userId });

    // if no user found

    if (!user) {
      throw new Error('No user found');
    }

    // pagination: skip = (page - 1) * pageSize
    const skipAmount = (page - 1) * pageSize;

    // find user's interactions
    const userInteractions = await Interaction.find({ user: user._id })
      .populate('tags')
      .exec();

    // extract tags from user's interactions

    const userTags = userInteractions.reduce((tags, interaction) => {
      if (interaction.tags) {
        tags = tags.concat(interaction.tags);
      }
      return tags;
    }, []);

    // get distinct tag Ids for user interactions

    const distinctUserTagIds = [
      ...new Set(userTags.map((tag: any) => tag._id))
    ];

    const query: FilterQuery<typeof Question> = {
      $and: [
        { tags: { $in: distinctUserTagIds } }, // question with user's tag
        { author: { $ne: user._id } } // exclude user's own questions
      ]
    };

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, 'i') } },
        { content: { $regex: new RegExp(searchQuery, 'i') } }
      ];
    }

    const totalQuestions = await Question.countDocuments(query);

    // recommended questions

    const recommendedQuestions = await Question.find(query)
      .populate({
        path: 'tags',
        model: Tag
      })
      .populate({
        path: 'author',
        model: User
      })
      .skip(skipAmount)
      .limit(pageSize);

    const isNext = totalQuestions > skipAmount + recommendedQuestions.length;

    return {
      questions: recommendedQuestions,
      isNext
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
