'use client';

import { Button } from '@/components/ui/button';
import { sidebarLinks } from '@/constants';
import { SignedOut, SignedIn, SignOutButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LeftSidebar = () => {
  const pathname = usePathname();
  return (
    <section className="background-light900_dark200 custom-scrollbar light-border sticky left-0 top-0 flex h-screen  flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
      <div className="flex flex-1 flex-col gap-8">
        {sidebarLinks.map((link) => {
          const isActive =
            pathname === link.route ||
            (pathname.includes(link.route) && link.route.length > 1);
          return (
            <Link
              key={link.label}
              href={link.route}
              className={`${
                isActive
                  ? 'primary-gradient rounded-lg text-light-900'
                  : 'text-dark300_light900'
              } flex-start cursor-pointer gap-4 bg-transparent p-4 `}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
                className={`${isActive ? '' : 'invert-colors'}`}
              />
              <p
                className={`${
                  isActive ? 'base-bold' : 'base-medium'
                } max-lg:hidden`}
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
              <span className="primary-text-gradient ">Log In</span>
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
              Sign Up
            </Button>
          </Link>
        </div>
      </SignedOut>
      <SignedIn>
        <Button className="text-dark300_light900 primary-gradient flex items-center  gap-4 rounded-lg  p-4 ">
          <Image
            src="/assets/icons/arrow-left.svg"
            alt="arrowLeft"
            width={24}
            height={24}
          />
          <SignOutButton />
        </Button>
      </SignedIn>
    </section>
  );
};
export default LeftSidebar;
