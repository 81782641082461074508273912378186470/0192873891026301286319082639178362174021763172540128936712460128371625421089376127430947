'use client';

interface BadgeProps {
  text: string; // Text inside the badge
  className?: string; // Optional additional classes for custom styling
  color?: string; // Dynamic text color (default: white/70)
  bgColor?: string; // Dynamic background color (default: white/20)
}

export default function Badge({
  text,
  className = '',
  color = 'text-white/70',
  bgColor = 'bg-white/20',
}: BadgeProps) {
  return (
    <span
      className={`text-xs font-bold rounded px-2 py-1 ${color} ${bgColor} ${className}`}
    >
      {text}
    </span>
  );
}
