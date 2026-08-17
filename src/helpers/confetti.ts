import confetti from 'canvas-confetti';

export function triggerConfetti() {
  const defaults = {
    origin: { y: 0.7 },
    spread: 360,
    ticks: 100,
    gravity: 0.8,
    decay: 0.94,
    startVelocity: 30,
    colors: ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#4f46e5'],
  };

  void confetti({
    ...defaults,
    particleCount: 80,
    scalar: 1.2,
    shapes: ['circle', 'square'],
  });

  void confetti({
    ...defaults,
    particleCount: 40,
    scalar: 0.75,
    shapes: ['circle'],
  });
}
