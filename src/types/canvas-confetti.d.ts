declare module 'canvas-confetti' {
  interface IConfettiOptions {
    particleCount?: number;
    angle?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    x?: number;
    y?: number;
    origin?: { x?: number; y?: number };
    colors?: string[];
    shapes?: Array<'square' | 'circle'>;
    scalar?: number;
    zIndex?: number;
    disableForReducedMotion?: boolean;
    useWorker?: boolean;
    resize?: boolean;
    canvas?: HTMLCanvasElement | null;
    [key: string]: unknown;
  }

  type ConfettiFunction = (options?: IConfettiOptions) => Promise<null>;

  const confetti: ConfettiFunction & {
    reset: () => void;
  };

  export default confetti;
}
