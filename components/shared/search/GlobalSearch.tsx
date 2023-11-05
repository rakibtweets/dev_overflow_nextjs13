'use client';

import { Input } from '@/components/ui/input';
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import GlobarResult from './GlobarResult';

const GlobalSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchContainerRef = useRef(null);

  const query = searchParams.get('global');

  const [search, setSearch] = useState(query || '');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // close modal useEffect
  useEffect(() => {
    const handleOutsideClick = (e: any) => {
      if (
        searchContainerRef.current &&
        // @ts-ignore
        !searchContainerRef.current.contains(e.target)
      ) {
        setIsModalOpen(false);
        setSearch('');
      }
    };

    setIsModalOpen(false);

    document.addEventListener('click', handleOutsideClick);

    return () => document.removeEventListener('click', handleOutsideClick);
  }, [pathname]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'global',
          value: search
        });
        router.push(newUrl, { scroll: false });
      } else {
        if (query) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ['global', 'type']
          });

          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, search, router, pathname, searchParams]);

  return (
    <div
      className="relative w-full max-w-[600px] max-lg:hidden"
      ref={searchContainerRef}
    >
      <div className="background-light800_darkgradient relative flex min-h-[50px] grow items-center gap-1 rounded-xl px-4">
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          height={24}
          width={24}
          className="cursor-pointer"
        />
        <Input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isModalOpen) {
              setIsModalOpen(true);
            }
            if (e.target.value === '' && isModalOpen) {
              setIsModalOpen(false);
            }
          }}
          placeholder="Search globally"
          className="paragraph-regular text-dark400_light700 no-focus placeholder border-none bg-transparent shadow-none outline-none"
        />
      </div>
      {isModalOpen && <GlobarResult />}
    </div>
  );
};
export default GlobalSearch;
