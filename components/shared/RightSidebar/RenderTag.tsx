// interface example

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface RenderTagProps {
  _id: string;
  name: string;
  totalQuestions?: number;
  showCount?: boolean;
}

const RenderTag = ({
  _id,
  name,
  totalQuestions,
  showCount
}: RenderTagProps) => {
  return (
    <Link href={`/tags/${_id}`} className="flex justify-between gap-3">
      <Badge className="subtle-medium background-light800_dark300 text-light400_light500  rounded-md border-none px-4 py-2 uppercase">
        {name}
      </Badge>
      {showCount && (
        <p className="small-medium text-dark500_light700">{totalQuestions}</p>
      )}
    </Link>
  );
};
export default RenderTag;
