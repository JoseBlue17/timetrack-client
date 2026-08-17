import { useState } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface IParticle {
  id: string;
  angle: number;
  distance: number;
  color: string;
  size: number;
  duration: number;
}

interface IExplosionOrigin {
  x: number;
  y: number;
}

interface IUseExplosionResult {
  triggerExplosion: (element: HTMLElement) => void;
  Explosion: () => ReactNode;
}

const PARTICLE_COLORS = [
  '#6366f1',
  '#818cf8',
  '#a5b4fc',
  '#f87171',
  '#fbbf24',
  '#34d399',
  '#60a5fa',
];

const PARTICLE_COUNT = 32;

function generateParticles(): IParticle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, index) => ({
    id: `${Date.now()}-${index}`,
    angle: Math.random() * Math.PI * 2,
    distance: 60 + Math.random() * 100,
    color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)] ?? '#6366f1',
    size: 4 + Math.random() * 6,
    duration: 0.4 + Math.random() * 0.3,
  }));
}

export function useExplosion(): IUseExplosionResult {
  const [particles, setParticles] = useState<IParticle[]>([]);
  const [origin, setOrigin] = useState<IExplosionOrigin>({ x: 0, y: 0 });

  const triggerExplosion = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    setOrigin({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    setParticles(generateParticles());
  };

  const Explosion = () => {
    return (
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: origin.x,
              y: origin.y,
              opacity: 1,
              scale: 1,
            }}
            animate={{
              x: origin.x + Math.cos(particle.angle) * particle.distance,
              y: origin.y + Math.sin(particle.angle) * particle.distance,
              opacity: 0,
              scale: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: particle.duration,
              ease: 'easeOut',
            }}
            onAnimationComplete={() =>
              setParticles((previous) => previous.filter((p) => p.id !== particle.id))
            }
            style={{
              position: 'fixed',
              left: 0,
              top: 0,
              width: particle.size,
              height: particle.size,
              borderRadius: '50%',
              backgroundColor: particle.color,
              pointerEvents: 'none',
              zIndex: 9999,
            }}
          />
        ))}
      </AnimatePresence>
    );
  };

  return { triggerExplosion, Explosion };
}
