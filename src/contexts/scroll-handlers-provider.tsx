import { useCallback, useRef } from 'react';
import type { ReactNode, UIEvent } from 'react';
import ScrollHandlersContext from './scroll-handlers-context';
import type { ScrollHandler } from './scroll-handlers-context';

interface IScrollHandlersProviderProps {
  children: ReactNode;
}

export function ScrollHandlersProvider({ children }: IScrollHandlersProviderProps) {
  const scrollHandlersRef = useRef(new Set<ScrollHandler>());

  const registerScrollHandler = useCallback((handler: ScrollHandler) => {
    scrollHandlersRef.current.add(handler);
    return () => {
      scrollHandlersRef.current.delete(handler);
    };
  }, []);

  const handleScroll = useCallback((event: UIEvent<HTMLElement>) => {
    scrollHandlersRef.current.forEach((handler) => handler(event));
  }, []);

  return (
    <ScrollHandlersContext.Provider value={{ handleScroll, registerScrollHandler }}>
      {children}
    </ScrollHandlersContext.Provider>
  );
}
