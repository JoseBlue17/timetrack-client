import { useEffect, type RefObject } from 'react';

interface UseInfiniteScrollProps {
  observerTarget: RefObject<HTMLDivElement | null>;
  onLoadMore: () => void;
  hasNextPage: boolean;
  isLoading: boolean;
  isFetchingNextPage: boolean;
}

export const useInfiniteScroll = ({
  observerTarget,
  onLoadMore,
  hasNextPage,
  isLoading,
  isFetchingNextPage,
}: UseInfiniteScrollProps) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 1.0 },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isLoading, isFetchingNextPage, onLoadMore, observerTarget]);
};
