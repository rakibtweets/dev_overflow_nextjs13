import LocalSearchBar from '@/components/shared/search/LocalSearchBar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HomePageFilters } from '@/constants/filters';
import Filter from '@/components/shared/Filter/Filter';
import HomeFilters from '@/components/home/HomeFilters';
import NoResult from '@/components/shared/NoResult/NoResult';
import QuestionCard from '@/components/cards/QuestionCard';
import {
  getQuestions,
  getRecommendedQuestions
} from '@/lib/actions/question.action';
import { SearchParamsProps } from '@/types';
import Pagination from '@/components/shared/Pagination/Pagination';
import type { Metadata } from 'next';
import { auth } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'Home | Dev Overflow',
  description: 'Home page of Dev Overflow'
};

export default async function Home({ searchParams }: SearchParamsProps) {
  const { userId } = auth();
  let result;

  // ? fetch recomended questions

  if (searchParams?.filter === 'recommended') {
    if (userId) {
      result = await getRecommendedQuestions({
        userId,
        searchQuery: searchParams?.q,
        page: searchParams?.page ? +searchParams?.page : 1
      });
    } else {
      result = {
        questions: [],
        isNext: false
      };
    }
  } else {
    result = await getQuestions({
      searchQuery: searchParams?.q,
      filter: searchParams?.filter,
      page: searchParams?.page ? +searchParams?.page : 1
    });
  }

  const pageNumber = searchParams?.page ? +searchParams?.page : 1;

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href={'/ask-question'} className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[40px] rounded-lg px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />

        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>

      <HomeFilters />

      {/* Card section */}
      <div className="mt-10 flex flex-col gap-6">
        {/*  looping through questions */}
        {result.questions.length > 0 ? (
          result.questions?.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes.length}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There is no quesiton to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>

      <div className="mt-10">
        <Pagination pageNumber={pageNumber} isNext={result.isNext} />
      </div>
    </>
  );
}
