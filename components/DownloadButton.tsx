'use client';

import React, { useState, MouseEvent } from 'react';

// Define the props interface for the DownloadButton
interface DownloadButtonProps {
  downloadUrl: string;
  className?: string;
  buttonText: React.ReactNode;
  downloadingText?: string; // Optional, for custom text during download
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  downloadUrl,
  buttonText,
  className,
  downloadingText = 'Downloading...',
}) => {
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
      className={`${className} no-underline rounded-button w-fit gap-2 flex justify-center items-center px-2 py-1 ${
        isDownloading ? 'cursor-wait' : ''
      }`}
      disabled={isDownloading}>
      {isDownloading ? downloadingText : buttonText}
    </button>
  );
};

export default DownloadButton;
