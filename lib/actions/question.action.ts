'use server';

import { connectToDatabase } from '../db/mongoose';

export const createQuestion = async (params: any) => {
  // eslint-disable-next-line no-empty
  try {
    // connect to DATABASE
    connectToDatabase();
  } catch (error) {}
};
