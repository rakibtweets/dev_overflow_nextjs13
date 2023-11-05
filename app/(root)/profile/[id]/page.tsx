import AnswersTab from '@/components/shared/AnswersTab/AnswersTab';
import ProfileLink from '@/components/shared/ProfileLink/ProfileLink';
import QuestionTab from '@/components/shared/QuestionTab/QuestionTab';
import Stats from '@/components/shared/Stats/Stats';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { getUserInfo } from '@/lib/actions/user.action';
import { getJoinedDate } from '@/lib/utils';
import { URLProps } from '@/types';
import { SignedIn, auth } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile | Dev Overflow',
  description: 'Profile page of Dev Overflow'
};

const ProfileDetails = async ({ params, searchParams }: URLProps) => {
  const { userId: clerkId } = auth();
  const { user, totalQuestions, totalAnswers, badgeCounts, reputation } =
    await getUserInfo({
      userId: params.id
    });
  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Image
            src={user?.picture}
            alt="profile"
            width={140}
            height={140}
            className="rounded-full object-cover"
          />
          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">{user.name}</h2>
            <p className="paragraph-regular text-dark200_light800">
              @{user.username}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {user.portfoliowebsite && (
                <ProfileLink
                  imgUrl="/assets/icons/link.svg"
                  href={user.portfoliowebsite}
                  title="Portfolio"
                />
              )}
              {user.location && (
                <ProfileLink
                  imgUrl="/assets/icons/location.svg"
                  title={user.location}
                />
              )}
              <ProfileLink
                imgUrl="/assets/icons/calendar.svg"
                title={getJoinedDate(user.joinAt)}
              />
            </div>
            {user.bio && (
              <p className="paragraph-regular text-dark400_light800 mt-8">
                {user.bio}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          <SignedIn>
            {clerkId === user.clerkId && (
              <Link href="/profile/edit">
                <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3">
                  Edit profile
                </Button>
              </Link>
            )}
          </SignedIn>
        </div>
      </div>
      {/* User Stats */}
      <Stats
        reputation={reputation}
        totalQuestions={totalQuestions}
        totalAnswers={totalAnswers}
        badges={badgeCounts}
      />
      <div className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-1">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger className="tab" value="top-posts">
              Top Posts
            </TabsTrigger>
            <TabsTrigger className="tab" value="answers">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="top-posts"
            className="mt-5 flex w-full flex-col gap-6"
          >
            <QuestionTab
              searchProps={searchParams}
              userId={user._id}
              clerkId={clerkId}
            />
          </TabsContent>
          <TabsContent value="answers">
            <AnswersTab
              searchProps={searchParams}
              userId={user._id}
              clerkId={clerkId}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
export default ProfileDetails;
