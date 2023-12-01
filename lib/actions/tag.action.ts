'use server';

import User from '@/database/user.model';
import { connectToDatabase } from '../db/mongoose';
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams
} from './shared.types';
import Tag, { ITag } from '@/database/tag.model';
import { FilterQuery } from 'mongoose';
import Question from '@/database/question.model';
import Interaction from '@/database/interaction.model';

export const getTopInteractedTags = async (
  params: GetTopInteractedTagsParams
) => {
  try {
    connectToDatabase();

    const { userId, limit = 3 } = params;
    //
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // todo: Find interactions for the user and group by tags
    const tagCountMap = await Interaction.aggregate([
      { $match: { user: user._id, tags: { $exists: true, $ne: [] } } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit }
    ]);

    // topTags
    const topTags = tagCountMap.map((tagCount) => tagCount._id);

    // todo : find the tag documents for the top tags
    const topTagDocuments = await Tag.find({ _id: { $in: topTags } });

    return topTagDocuments;
  } catch (error) {
    console.error('Error fetching top interacted tags:', error);
    throw error;
  }
};

export const getAllTags = async (params: GetAllTagsParams) => {
  try {
    connectToDatabase();

    const { searchQuery, filter, page = 1, pageSize = 10 } = params;

    // pagination:
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Tag> = {};

    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, 'i') } }];
    }

    let sortOptions = {};

    switch (filter) {
      case 'popular':
        sortOptions = { questions: -1 };
        break;
      case 'old':
        sortOptions = { createdOn: 1 };
        break;
      case 'recent':
        sortOptions = { createdOn: -1 };
        break;
      case 'name':
        sortOptions = { name: 1 };
        break;

      default:
        break;
    }

    const tags = await Tag.find(query)
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);

    const totalTags = await Tag.countDocuments(query);

    const isNext = totalTags > skipAmount + tags.length;

    return { tags, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getQuestionsByTagId = async (
  params: GetQuestionsByTagIdParams
) => {
  try {
    connectToDatabase();
    const { tagId, searchQuery, page = 1, pageSize = 1 } = params;

    // paginaion:
    const skipAmount = (page - 1) * pageSize;

    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    if (searchQuery) {
      tagFilter.$or = [{ $regex: searchQuery, $options: 'i' }];
    }

    const tag = await Tag.findOne(tagFilter).populate({
      path: 'questions',
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: 'i' } }
        : {},
      options: {
        skip: skipAmount,
        limit: pageSize + 1,
        sort: { createdAt: -1 }
      },
      populate: [
        { path: 'tags', model: Tag, select: '_id name' },
        { path: 'author', model: User, select: '_id clerkId name picture' }
      ]
    });

    if (!tag) {
      throw new Error('Tag not found');
    }

    const questions = tag.questions;

    const isNext = questions.length > pageSize;

    return { tagTitle: tag.name, questions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getTopPopularTags = async () => {
  try {
    connectToDatabase();

    const popularTags = await Tag.aggregate([
      {
        $project: { name: 1, numberOfQuestions: { $size: '$questions' } }
      },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: 10 }
    ]);

    return popularTags;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
