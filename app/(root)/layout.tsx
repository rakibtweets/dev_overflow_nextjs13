import Navbar from '@/components/shared/navbar/Navbar';
import React from 'react';
import LeftSidebar from '../../components/shared/LeftSidebar/LeftSidebar';
import RightSidebar from '@/components/shared/RightSidebar/RightSidebar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="background-light850_dark100 relative">
      <Navbar />
      <div className="flex">
        <LeftSidebar />
        <section className="flex min-h-screen flex-1 px-6 pt-36 max-md:pb-14 sm:px-14 ">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </section>
        <RightSidebar />
      </div>
      Toster component
    </main>
  );
};
export default Layout;
