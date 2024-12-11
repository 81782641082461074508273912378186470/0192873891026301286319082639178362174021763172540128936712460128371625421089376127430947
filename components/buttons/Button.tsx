// components/Button.tsx
import React from 'react';
import Link from 'next/link';

interface ButtonProps {
  label: string; // Text displayed on the button
  url?: string; // Optional: URL for navigation
  onClick?: () => void; // Optional: Callback for click events
  variant?: 'primary' | 'secondary' | 'outline'; // Button style type
  size?: 'small' | 'medium' | 'large'; // Button size
  fullWidth?: boolean; // Optional: Full width button
}

const Button: React.FC<ButtonProps> = ({
  label,
  url,
  onClick,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
}) => {
  // TailwindCSS classes for different styles
  const baseClass =
    'rounded whitespace-nowrap items-center font-medium focus:outline-none transition-all';
  const sizeClass = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-5 py-2 text-base',
    large: 'px-7 py-3 text-lg',
  };
  const variantClass = {
    primary: 'bg-black text-white hover:bg-light-800',
    secondary: 'bg-light-200 text-black hover:bg-light-300',
    outline: 'border border-white text-white hover:bg-white hover:text-black',
  };
  const fullWidthClass = fullWidth ? 'w-full' : 'inline-block';

  const buttonClass = `${baseClass} ${sizeClass[size]} ${variantClass[variant]} ${fullWidthClass}`;

  // Render as a Link if `url` is provided
  return url ? (
    <Link href={url} className={buttonClass}>
      {label}
    </Link>
  ) : (
    <button onClick={onClick} className={buttonClass}>
      {label}
    </button>
  );
};

export default Button;
