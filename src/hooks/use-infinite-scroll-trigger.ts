import { useCallback, useRef } from 'react';
import type { UIEvent } from 'react';

const DEFAULT_SCROLL_THRESHOLD_PX = 200;

export interface UseInfiniteScrollTriggerArgs {
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  threshold?: number;
}

export function useInfiniteScrollTrigger({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  threshold = DEFAULT_SCROLL_THRESHOLD_PX,
}: UseInfiniteScrollTriggerArgs) {
  const scheduledScrollRef = useRef(false);

  const handleScroll = useCallback(
    (event: UIEvent<HTMLElement>) => {
      if (scheduledScrollRef.current) return;
      if (!hasNextPage || isFetchingNextPage) return;

      const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
      const distanceToBottom = scrollHeight - (scrollTop + clientHeight);
      if (distanceToBottom > threshold) return;

      scheduledScrollRef.current = true;
      requestAnimationFrame(() => {
        fetchNextPage();
        scheduledScrollRef.current = false;
      });
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage, threshold],
  );

  return handleScroll;
}
