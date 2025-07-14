// src/components/Button.tsx
'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
}

export default function Button({ children, className, variant = 'primary', ...props }: ButtonProps) {
  const baseClasses = "px-6 py-3 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-base";

  const variantClasses = {
    primary: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
    danger: 'bg-red-700 text-white hover:bg-red-800 focus:ring-red-600',
    // --- NUEVA VARIANTE 'OUTLINE' ---
    outline: 'bg-transparent border-2 border-current hover:bg-white hover:text-red-600 focus:ring-white',
  };

  // Se usa 'primary' como fallback si la variante no existe
  const appliedVariant = variantClasses[variant] || variantClasses.primary;

  return (
    <button
      className={`${baseClasses} ${appliedVariant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
