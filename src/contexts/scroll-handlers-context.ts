import { createContext, useContext } from 'react';
import type { UIEvent } from 'react';

export type ScrollHandler = (event: UIEvent<HTMLElement>) => void;

interface IScrollHandlersContext {
  handleScroll: ScrollHandler;
  registerScrollHandler: (handler: ScrollHandler) => () => void;
}

const initialContext: IScrollHandlersContext = {
  handleScroll: () => undefined,
  registerScrollHandler: () => () => undefined,
};

const ScrollHandlersContext = createContext<IScrollHandlersContext>(initialContext);

export function useScrollHandlers() {
  return useContext(ScrollHandlersContext);
}

export default ScrollHandlersContext;
