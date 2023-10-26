import AnswerCard from '@/components/cards/AnswerCard';
import { getUserAnswers } from '@/lib/actions/user.action';
import { SearchParamsProps } from '@/types';

interface AnswersTabProps extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const AnswersTab = async ({
  searchProps,
  userId,
  clerkId
}: AnswersTabProps) => {
  const { userAnswers } = await getUserAnswers({
    userId,
    page: 1
  });
  return (
    <>
      {userAnswers.map((answer) => (
        <AnswerCard
          key={answer._id}
          clerkId={clerkId}
          _id={answer._id}
          question={answer.question}
          author={answer.author}
          upvotes={answer.upvotes.length}
          createdAt={answer.createdAt}
        />
      ))}
    </>
  );
};
export default AnswersTab;
