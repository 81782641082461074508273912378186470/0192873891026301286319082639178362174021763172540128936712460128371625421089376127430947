'use client';

import React, { useState, MouseEvent } from 'react';
interface DownloadButtonProps {
  downloadUrl: string;
  className?: string;
  buttonText: React.ReactNode;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ downloadUrl, buttonText, className }) => {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const handleDownload = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDownloading(true);

    setTimeout(() => {
      window.location.href = downloadUrl;
      setIsDownloading(false);
    }, 2000);
  };

  return (
    <button
      onClick={handleDownload}
      className={`${className} no-underline text-xs rounded-button w-fit gap-2 flex justify-center items-center px-2 py-1 ${
        isDownloading ? 'cursor-wait opacity-55' : ''
      }`}
      disabled={isDownloading}>
      {buttonText}
    </button>
  );
};

export default DownloadButton;
