import { useEffect } from 'react';
import { useInfiniteScrollTrigger } from './use-infinite-scroll-trigger';
import { useScrollHandlers } from '@/contexts/scroll-handlers-context';
import type { UseInfiniteScrollTriggerArgs } from './use-infinite-scroll-trigger';

export function useScrollLoadMore(args: UseInfiniteScrollTriggerArgs) {
  const handleScroll = useInfiniteScrollTrigger(args);
  const { registerScrollHandler } = useScrollHandlers();

  useEffect(() => registerScrollHandler(handleScroll), [registerScrollHandler, handleScroll]);
}
