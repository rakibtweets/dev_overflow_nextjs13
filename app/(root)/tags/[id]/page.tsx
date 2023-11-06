import QuestionCard from '@/components/cards/QuestionCard';
import NoResult from '@/components/shared/NoResult/NoResult';
import Pagination from '@/components/shared/Pagination/Pagination';
import LocalSearchBar from '@/components/shared/search/LocalSearchBar';
import { getQuestionsByTagId } from '@/lib/actions/tag.action';
import { URLProps } from '@/types';

const TagDetails = async ({ params, searchParams }: URLProps) => {
  const { tagTitle, questions, isNext } = await getQuestionsByTagId({
    tagId: params.id,
    page: searchParams?.page ? +searchParams.page : 1,
    searchQuery: searchParams?.q
  });

  const pageNumber = searchParams?.page ? +searchParams?.page : 1;

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">{tagTitle}</h1>

      <div className="mt-11 w-full">
        <LocalSearchBar
          route={`/tags/${params.id}`}
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search Tag questions"
          otherClasses="flex-1"
        />
      </div>

      {/* Card section */}
      <div className="mt-10 flex flex-col gap-6">
        {/*  //!Todo: looping through questions */}
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
            title="There is no tag quesiton to show"
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
};
export default TagDetails;
