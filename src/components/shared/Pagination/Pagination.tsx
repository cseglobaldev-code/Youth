import { Pagination as AntPagination } from 'antd';
import { cn } from '@/lib/utils';

export interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
  className?: string;
}

export function Pagination({ current, total, pageSize, onChange, className }: PaginationProps) {
  if (total <= pageSize) return null;

  return (
    <div className={cn('you-pagination flex justify-center mt-8', className)}>
      <AntPagination
        current={current}
        total={total}
        pageSize={pageSize}
        onChange={onChange}
        showSizeChanger={false}
        itemRender={(_, type, originalElement) => {
          if (type === 'prev') return <span>Previous</span>;
          if (type === 'next') return <span>Next</span>;
          return originalElement;
        }}
      />
    </div>
  );
}
