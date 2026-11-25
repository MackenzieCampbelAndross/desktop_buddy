import React, { useEffect, useRef } from 'react';
import { BuddySpecies, BuddyMood, AccessoryType, HabitatTheme } from '../types';

interface BuddyCanvasProps {
  species: BuddySpecies;
  mood: BuddyMood;
  primaryColor: string;
  accessory: AccessoryType;
  habitat: HabitatTheme;
  className?: string;
  width?: number;
  height?: number;
  onClick?: () => void;
}

export const BuddyCanvas: React.FC<BuddyCanvasProps> = ({
  species,
  mood,
  primaryColor,
  accessory,
  habitat,
  className = '',
  width = 300,
  height = 300,
  onClick
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Habitat Backdrop
      drawHabitat(ctx, habitat, width, height, tick);

      // 2. Character Dynamics (bounce / breath based on mood)
      const bounce = mood === 'SLEEPY'
        ? Math.sin(tick * 0.03) * 3
        : mood === 'EXCITED' || mood === 'PLAYFUL'
        ? Math.abs(Math.sin(tick * 0.15)) * 12
        : Math.sin(tick * 0.06) * 6;

      const centerX = width / 2;
      const centerY = height / 2 + 20 - bounce;

      // 3. Draw Species Body
      drawSpecies(ctx, species, centerX, centerY, primaryColor, mood, tick);

      // 4. Draw Accessory
      drawAccessory(ctx, accessory, centerX, centerY - 55);

      // 5. Mood Effects (e.g. Zzz for sleepy, hearts for happy, sparkles for excited)
      drawMoodParticles(ctx, mood, centerX, centerY, tick);

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [species, mood, primaryColor, accessory, habitat, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onClick={onClick}
      className={`rounded-2xl cursor-pointer select-none shadow-2xl transition-transform active:scale-95 ${className}`}
      title="Click to interact with your buddy!"
    />
  );
};

function drawHabitat(
  ctx: CanvasRenderingContext2D,
  habitat: HabitatTheme,
  w: number,
  h: number,
  tick: number
) {
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  switch (habitat) {
    case 'CYBER_ROOM':
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(1, '#1e1b4b');
      break;
    case 'COZY_CAFE':
      grad.addColorStop(0, '#3e2723');
      grad.addColorStop(1, '#1a0c02');
      break;
    case 'STARLIT_MEADOW':
      grad.addColorStop(0, '#05051a');
      grad.addColorStop(1, '#0f2027');
      break;
    case 'ZEN_GARDEN':
      grad.addColorStop(0, '#064e3b');
      grad.addColorStop(1, '#022c22');
      break;
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Soft grid or stars
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  for (let i = 0; i < 15; i++) {
    const x = (i * 27 + (tick * 0.2)) % w;
    const y = (i * 19) % h;
    ctx.beginPath();
    ctx.arc(x, y, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawSpecies(
  ctx: CanvasRenderingContext2D,
  species: BuddySpecies,
  cx: number,
  cy: number,
  color: string,
  mood: BuddyMood,
  tick: number
) {
  ctx.save();

  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 65, 55, 15, 0, 0, Math.PI * 2);
  ctx.fill();

  // Main Body
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, 55, 0, Math.PI * 2);
  ctx.fill();

  // Ears / Details per species
  if (species === 'CYBER_CAT') {
    ctx.fillStyle = color;
    // Left ear
    ctx.beginPath();
    ctx.moveTo(cx - 45, cy - 30);
    ctx.lineTo(cx - 25, cy - 75);
    ctx.lineTo(cx - 5, cy - 45);
    ctx.fill();
    // Right ear
    ctx.beginPath();
    ctx.moveTo(cx + 5, cy - 45);
    ctx.lineTo(cx + 25, cy - 75);
    ctx.lineTo(cx + 45, cy - 30);
    ctx.fill();
  } else if (species === 'COSMIC_OWL') {
    // Owl ear tufts & belly
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 15, 30, 35, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (species === 'ROBO_PUP') {
    // Floppy ears
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.ellipse(cx - 50, cy - 10, 16, 35, Math.PI / 6, 0, Math.PI * 2);
    ctx.ellipse(cx + 50, cy - 10, 16, 35, -Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();
  } else if (species === 'STAR_SPRITE') {
    // Glowing halo
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, 65 + Math.sin(tick * 0.1) * 3, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Eyes based on mood
  drawEyes(ctx, cx, cy, mood);

  // Mouth / Snout
  ctx.strokeStyle = '#1e1b4b';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  if (mood === 'HAPPY' || mood === 'EXCITED' || mood === 'PLAYFUL') {
    ctx.arc(cx, cy + 18, 10, 0.2, Math.PI - 0.2);
  } else if (mood === 'SLEEPY') {
    ctx.moveTo(cx - 6, cy + 20);
    ctx.lineTo(cx + 6, cy + 20);
  } else {
    ctx.arc(cx, cy + 25, 8, Math.PI + 0.3, -0.3);
  }
  ctx.stroke();

  // Cheeks (blush)
  ctx.fillStyle = 'rgba(244, 63, 94, 0.4)';
  ctx.beginPath();
  ctx.arc(cx - 30, cy + 12, 8, 0, Math.PI * 2);
  ctx.arc(cx + 30, cy + 12, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawEyes(ctx: CanvasRenderingContext2D, cx: number, cy: number, mood: BuddyMood) {
  const eyeOffset = 22;
  const eyeY = cy - 6;

  if (mood === 'SLEEPY') {
    // Closed happy curve eyes
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx - eyeOffset, eyeY, 8, Math.PI + 0.2, -0.2);
    ctx.arc(cx + eyeOffset, eyeY, 8, Math.PI + 0.2, -0.2);
    ctx.stroke();
    return;
  }

  // Open eyes
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx - eyeOffset, eyeY, 12, 0, Math.PI * 2);
  ctx.arc(cx + eyeOffset, eyeY, 12, 0, Math.PI * 2);
  ctx.fill();

  // Pupils
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(cx - eyeOffset, eyeY, 6, 0, Math.PI * 2);
  ctx.arc(cx + eyeOffset, eyeY, 6, 0, Math.PI * 2);
  ctx.fill();

  // Eye glints
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx - eyeOffset - 2, eyeY - 2, 2.5, 0, Math.PI * 2);
  ctx.arc(cx + eyeOffset - 2, eyeY - 2, 2.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawAccessory(ctx: CanvasRenderingContext2D, accessory: AccessoryType, cx: number, cy: number) {
  if (accessory === 'NONE') return;

  ctx.save();
  if (accessory === 'TOP_HAT') {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(cx - 35, cy + 10, 70, 8); // brim
    ctx.fillRect(cx - 20, cy - 25, 40, 35); // crown
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(cx - 20, cy + 5, 40, 5); // ribbon
  } else if (accessory === 'HEADPHONES') {
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(cx, cy + 40, 50, Math.PI, 0); // band
    ctx.stroke();
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(cx - 55, cy + 30, 14, 28);
    ctx.fillRect(cx + 41, cy + 30, 14, 28);
  } else if (accessory === 'SUNGLASSES') {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(cx - 38, cy + 40, 32, 18);
    ctx.fillRect(cx + 6, cy + 40, 32, 18);
    ctx.fillRect(cx - 6, cy + 45, 12, 4);
  } else if (accessory === 'BOWTIE') {
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.moveTo(cx, cy + 115);
    ctx.lineTo(cx - 20, cy + 105);
    ctx.lineTo(cx - 20, cy + 125);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx, cy + 115);
    ctx.lineTo(cx + 20, cy + 105);
    ctx.lineTo(cx + 20, cy + 125);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy + 115, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawMoodParticles(
  ctx: CanvasRenderingContext2D,
  mood: BuddyMood,
  cx: number,
  cy: number,
  tick: number
) {
  if (mood === 'SLEEPY') {
    ctx.fillStyle = '#93c5fd';
    ctx.font = 'bold 16px sans-serif';
    const offset = (tick * 0.8) % 60;
    ctx.fillText('Z', cx + 45 + offset * 0.3, cy - 40 - offset);
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('z', cx + 35 + offset * 0.2, cy - 25 - offset * 0.8);
  } else if (mood === 'HAPPY' || mood === 'EXCITED') {
    // Little floating hearts or sparkles
    ctx.fillStyle = '#f43f5e';
    ctx.font = '14px sans-serif';
    const float = (tick * 0.5) % 40;
    ctx.fillText('❤️', cx - 55, cy - 20 - float);
  }
}
