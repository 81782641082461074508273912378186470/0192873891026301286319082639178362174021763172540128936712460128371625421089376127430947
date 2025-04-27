'use client';
import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
/* eslint-disable @typescript-eslint/no-explicit-any */

const HideShowText = ({ text }: any) => {
  const [isHidden, setIsHidden] = useState(true);

  const toggleVisibility = () => {
    setIsHidden(!isHidden);
  };

  const placeholder = '●'.repeat(text.length);

  return (
    <div className="flex items-center gap-2">
      <p
        className={`text-sm font-medium text-white select-none ${
          isHidden && 'blur-sm line-through'
        }`}
        title="License Key">
        {isHidden ? placeholder : text}
      </p>
      <button
        onClick={toggleVisibility}
        className="text-white/20 hover:text-white/70 focus:outline-hidden"
        title={isHidden ? 'Show' : 'Hide'}>
        {isHidden ? <AiOutlineEyeInvisible size={16} /> : <AiOutlineEye size={16} />}
      </button>
    </div>
  );
};

export default HideShowText;
