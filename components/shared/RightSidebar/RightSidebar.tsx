import Image from 'next/image';
import Link from 'next/link';
import RenderTag from './RenderTag';
import { getTopQuestions } from '@/lib/actions/question.action';

const popularTags = [
  { _id: '1', name: 'javascript', totalQuestions: 5 },
  { _id: '2', name: 'react', totalQuestions: 5 },
  { _id: '3', name: 'next', totalQuestions: 5 },
  { _id: '4', name: 'vue', totalQuestions: 2 },
  { _id: '5', name: 'redux', totalQuestions: 10 }
];

const RightSidebar = async () => {
  const topQuestions = await getTopQuestions();
  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex flex-col gap-[30px]">
          {topQuestions.map((question) => (
            <Link
              href={`/question/${question._id}`}
              key={question._id}
              className="flex cursor-pointer items-center justify-between gap-7"
            >
              <p className="body-medium text-dark500_light700">
                {question.title}
              </p>
              <Image
                src={'/assets/icons/chevron-right.svg'}
                alt="chevron right"
                width={20}
                height={20}
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
        <div className="mt-7 flex flex-col gap-[30px]">
          {popularTags.map((tag) => (
            <RenderTag
              key={tag._id}
              _id={tag._id}
              name={tag.name}
              totalQuestions={tag.totalQuestions}
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  );
};
export default RightSidebar;
