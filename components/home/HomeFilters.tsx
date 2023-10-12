'use client';

import { HomePageFilters } from '@/constants/filters';
import { Button } from '../ui/button';

const HomeFilters = () => {
  const active = 'recommended';
  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((item) => (
        <Button
          className={`${
            active === item.value
              ? 'bg-primary-100 text-primary-500'
              : 'bg-light-800 text-light-500'
          } body-medium rounded-lg px-6 py-3 capitalize shadow-none`}
          key={item.value}
          onClick={() => {}}
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
};
export default HomeFilters;
