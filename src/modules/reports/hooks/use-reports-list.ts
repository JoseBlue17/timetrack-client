import { useGetReportsInfinite } from './use-get-reports-infinite';
import { useScrollLoadMore } from '@/hooks/use-scroll-load-more';

export function useReportsList() {
  const {
    reports = [],
    isLoading,
    isError,
    error,
    invalidate,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetReportsInfinite();

  useScrollLoadMore({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  return {
    reports,
    isLoading,
    isError,
    error,
    invalidate,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  };
}
