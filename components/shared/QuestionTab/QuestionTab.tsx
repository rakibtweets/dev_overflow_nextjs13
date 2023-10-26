import QuestionCard from '@/components/cards/QuestionCard';
import { getUserQuestions } from '@/lib/actions/user.action';
import { SearchParamsProps } from '@/types';

interface QuestionTabProps extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const QuestionTab = async ({
  searchProps,
  userId,
  clerkId
}: QuestionTabProps) => {
  const { userQuestions } = await getUserQuestions({
    userId,
    page: 1
  });

  return (
    <>
      {userQuestions.map((question) => (
        <QuestionCard
          key={question._id}
          _id={question._id}
          clerkId={clerkId}
          title={question.title}
          tags={question.tags}
          author={question.author}
          upvotes={question.upvotes.length}
          views={question.views}
          answers={question.answers}
          createdAt={question.createdAt}
        />
      ))}
    </>
  );
};
export default QuestionTab;
