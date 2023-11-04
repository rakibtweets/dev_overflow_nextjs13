'use client';

import { toast } from '@/components/ui/use-toast';
import { downVoteAnswer, upvoteAnswer } from '@/lib/actions/answer.action';
import { viewQuestion } from '@/lib/actions/interaction.action';
import {
  downVoteQuestion,
  upvoteQuestion
} from '@/lib/actions/question.action';
import { toggleSaveQuestion } from '@/lib/actions/user.action';
import { formatAndDivideNumber } from '@/lib/utils';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface Props {
  type: string;
  itemId: string;
  userId: string;
  upvotes: number;
  hasupVoted: boolean;
  downvotes: number;
  hasdownVoted: boolean;
  hasSaved?: boolean;
}

const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  hasupVoted,
  downvotes,
  hasdownVoted,
  hasSaved
}: Props) => {
  const pathname = usePathname();
  const rounter = useRouter();
  const handleSave = async () => {
    await toggleSaveQuestion({
      questionId: JSON.parse(itemId),
      userId: JSON.parse(userId),
      path: pathname
    });

    return toast({
      title: `Question ${
        !hasSaved ? 'Saved in' : 'Removed from'
      } your collection`,
      variant: !hasSaved ? 'default' : 'destructive'
    });
  };
  const handleVote = async (action: string) => {
    if (!userId) {
      return toast({
        title: 'Please login first',
        description: 'You need to login to perform this action'
      });
    }
    if (action === 'upvote') {
      if (type === 'Question') {
        await upvoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted,
          hasdownVoted,
          path: pathname
        });
      } else if (type === 'Answer') {
        await upvoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted,
          hasdownVoted,
          path: pathname
        });
      }
      return toast({
        title: `Upvoted ${!hasupVoted ? 'Successful' : 'Removed'}`,
        variant: !hasupVoted ? 'default' : 'destructive'
      });
    }
    // Downvote action
    if (action === 'downvote') {
      if (type === 'Question') {
        await downVoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted,
          hasdownVoted,
          path: pathname
        });
      } else if (type === 'Answer') {
        await downVoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted,
          hasdownVoted,
          path: pathname
        });
      }
      return toast({
        title: `Downvoted ${!hasdownVoted ? 'Successful' : 'Removed'}`,
        variant: !hasdownVoted ? 'default' : 'destructive'
      });
    }
    // todo: show a toast message
  };

  // question view count
  useEffect(() => {
    viewQuestion({
      questionId: JSON.parse(itemId),
      userId: userId ? JSON.parse(userId) : undefined
    });
  }, [itemId, userId, pathname, rounter]);

  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center  gap-1.5">
          <Image
            src={
              hasupVoted
                ? '/assets/icons/upvoted.svg'
                : '/assets/icons/upvote.svg'
            }
            width={18}
            height={18}
            alt="upvote"
            className="cursor-pointer"
            onClick={() => handleVote('upvote')}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(upvotes)}
            </p>
          </div>
        </div>
        <div className="flex-center  gap-1.5">
          <Image
            src={
              hasdownVoted
                ? '/assets/icons/downvoted.svg'
                : '/assets/icons/downvote.svg'
            }
            width={18}
            height={18}
            alt="downvote"
            className="cursor-pointer"
            onClick={() => handleVote('downvote')}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(downvotes)}
            </p>
          </div>
        </div>
      </div>
      {type === 'Question' && (
        <Image
          src={
            hasSaved
              ? '/assets/icons/star-filled.svg'
              : '/assets/icons/star-red.svg'
          }
          width={18}
          height={18}
          alt="star"
          className="cursor-pointer"
          onClick={handleSave}
        />
      )}
    </div>
  );
};
export default Votes;
