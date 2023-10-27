import { formatAndDivideNumber, getTimeStamp } from '@/lib/utils';
import Metric from '../shared/Metric/Metric';
import Link from 'next/link';
import { SignedIn } from '@clerk/nextjs';
import EditDeleteAction from '../shared/EditDeleteAction/EditDeleteAction';

interface Props {
  clerkId?: string | null;
  _id: string;
  question: {
    _id: string;
    title: string;
  };
  author: {
    _id: string;
    clerkId: string;
    name: string;
    picture: string;
  };
  upvotes: number;
  createdAt: Date;
}
const AnswerCard = ({
  clerkId,
  _id,
  question,
  author,
  upvotes,
  createdAt
}: Props) => {
  const showActionButtons = clerkId && clerkId === author.clerkId;

  return (
    <div className="card-wrapper rounded-[10px] px-11 py-9">
      <Link href={`/question/${question._id}/#${_id}`}>
        <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
          <div>
            <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
              {getTimeStamp(createdAt)}
            </span>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {question.title}
            </h3>
          </div>
          <SignedIn>
            {showActionButtons && (
              <EditDeleteAction type="Answer" itemId={JSON.stringify(_id)} />
            )}
          </SignedIn>
        </div>

        <div className="flex-between mt-6 w-full flex-wrap gap-3">
          <Metric
            imgUrl={author.picture}
            alt="user avatar"
            value={author.name}
            title={` • asked ${getTimeStamp(createdAt)}`}
            href={`/profile/${author.clerkId}`}
            textStyles="body-medium text-dark400_light700"
            isAuthor
          />

          <div className="flex-center gap-3">
            <Metric
              imgUrl="/assets/icons/like.svg"
              alt="like icon"
              value={formatAndDivideNumber(upvotes)}
              title=" Votes"
              textStyles="small-medium text-dark400_light800"
            />
          </div>
        </div>
      </Link>
    </div>
  );
};
export default AnswerCard;
