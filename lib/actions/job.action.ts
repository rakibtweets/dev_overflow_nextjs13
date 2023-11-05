'use server';
import { JobFilterParams } from './shared.types';

export const fetchCountries = async () => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const fetchLocation = async () => {
  const response = await fetch('http://ip-api.com/json/?fields=country');
  const location = await response.json();
  return location.country;
};

export const fetchJobs = async (filters: JobFilterParams) => {
  const { page, query } = filters;
  console.log('fetchJobs  query:', query);

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPID_API_KEY ?? '',
      'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
    }
  };
  const url = `https://jsearch.p.rapidapi.com/search?query=${query}&page=${page}`;

  const response = await fetch(url, options);

  const result = await response.json();

  return result.data;
};
