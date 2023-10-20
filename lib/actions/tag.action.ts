'use server';

import User from '@/database/user.model';
import { connectToDatabase } from '../db/mongoose';
import { GetTopInteractedTagsParams } from './shared.types';

export const getTopInteractedTags = async (
  params: GetTopInteractedTagsParams
) => {
  try {
    connectToDatabase();

    const { userId } = params;
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // todo: Find interactions for the user and group by tags

    // todo : Interdaction (save to database)

    return [
      { _id: '1', name: 'tag' },
      { _id: '2', name: 'tag2' },
      { _id: '3', name: 'tag3' }
    ];
  } catch (error) {
    console.log(error);
    throw error;
  }
};
