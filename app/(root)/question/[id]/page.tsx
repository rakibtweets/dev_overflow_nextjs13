import Metric from '@/components/shared/Metric/Metric';
import ParseHTML from '@/components/shared/ParseHTML/ParseHTML';
import { getQuestionById } from '@/lib/actions/question.action';
import { formatAndDivideNumber, getTimeStamp } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

const QuestionDetails = async ({ params, searchParams }) => {
  console.log('QuestionDetails  params:', params);
  const { question } = await getQuestionById({ questionId: params.id });
  console.log('QuestionDetails  question:', question);
  return (
    <>
      <div className="flex-start w-full flex-col ">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${question.author.clerkId}`}
            className="flex items-center justify-start gap-2"
          >
            <Image
              src={question.author.picture}
              alt="profile picture"
              className="rounded-full"
              width={22}
              height={22}
            />
            <p className="paragraph-semibold text-dark300_light700">
              {question.author.name}
            </p>
          </Link>
          <div className="flex justify-end">VOTING</div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {question.title}
        </h2>
      </div>
      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="=clock icon"
          value={`- asked ${getTimeStamp(question.createdAt)}`}
          title="Votes"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={question.answers.length}
          title="Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatAndDivideNumber(question.views)}
          title="Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>

      <ParseHTML data={question.content} />
    </>
  );
};
export default QuestionDetails;
