import LocalSearchBar from '@/components/shared/search/LocalSearchBar';
import { QuestionFilters } from '@/constants/filters';
import Filter from '@/components/shared/Filter/Filter';
import NoResult from '@/components/shared/NoResult/NoResult';
import QuestionCard from '@/components/cards/QuestionCard';
import { getSavedQuestions } from '@/lib/actions/user.action';
import { auth } from '@clerk/nextjs';
import { SearchParamsProps } from '@/types';
import Pagination from '@/components/shared/Pagination/Pagination';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Collections | Dev Overflow',
  description: 'Collections page of Dev Overflow'
};

export default async function Collection({ searchParams }: SearchParamsProps) {
  const { userId } = auth();
  if (!userId) return null;
  const { questions, isNext } = await getSavedQuestions({
    clerkId: userId,
    searchQuery: searchParams?.q,
    filter: searchParams?.filter,
    page: searchParams?.page ? +searchParams?.page : 1
  });

  const pageNumber = searchParams?.page ? +searchParams?.page : 1;

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />

        <Filter
          filters={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      {/* Card section */}
      <div className="mt-10 flex flex-col gap-6">
        {/*  // ? looping through questions */}
        {questions.length > 0 ? (
          questions?.map((question: any) => (
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
            title="There is no saved quesiton to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
      <div className="mt-10">
        <Pagination pageNumber={pageNumber} isNext={isNext} />
      </div>
    </>
  );
}
