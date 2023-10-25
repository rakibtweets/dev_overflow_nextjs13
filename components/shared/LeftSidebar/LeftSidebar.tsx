'use client';

import { Button } from '@/components/ui/button';
import { sidebarLinks } from '@/constants';
import { SignedOut, useAuth } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LeftSidebar = () => {
  const pathname = usePathname();
  const { userId } = useAuth();
  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
      <div className="flex flex-1 flex-col gap-6">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

          // TODO: profile/id
          if (link.route === '/profile') {
            if (userId) {
              link.route = `/profile/${userId}`;
            } else {
              return null;
            }
          }

          return (
            <Link
              key={link.label}
              href={link.route}
              className={`${
                isActive
                  ? 'primary-gradient rounded-lg text-light-900'
                  : 'text-dark300_light900'
              } flex items-center justify-start gap-4 bg-transparent p-4`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={20}
                height={20}
                className={`${isActive ? '' : 'invert-colors'}`}
              />
              <p
                className={`${
                  isActive ? 'base-bold' : 'base-medium'
                }  max-lg:hidden`}
              >
                {link.label}
              </p>
            </Link>
          );
        })}
      </div>
      <SignedOut>
        <div className="flex flex-col gap-3 pt-3">
          <Link href="/sign-in">
            <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
              <Image
                src="/assets/icons/account.svg"
                alt="login"
                width={20}
                height={20}
                className="invert-colors lg:hidden"
              />
              <span className="primary-text-gradient max-lg:hidden">
                Log In
              </span>
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
              <Image
                src="/assets/icons/sign-up.svg"
                alt="sign up"
                width={20}
                height={20}
                className="invert-colors lg:hidden"
              />
              <span className=" max-lg:hidden">Sign up</span>
            </Button>
          </Link>
        </div>
      </SignedOut>
      {/* <SignedIn>
        <Button className="text-dark300_light900 primary-gradient flex items-center  gap-4 rounded-lg  p-4 ">
          <Image
            src="/assets/icons/arrow-left.svg"
            alt="arrowLeft"
            width={20}
            height={20}
          />
          <div className="hidden sm:flex">
            <SignOutButton />
          </div>
        </Button>
      </SignedIn> */}
    </section>
  );
};
export default LeftSidebar;
