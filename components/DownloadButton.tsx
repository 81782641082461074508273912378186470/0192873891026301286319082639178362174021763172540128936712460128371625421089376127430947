'use client';

import React, { useState, MouseEvent } from 'react';

// Define the props interface for the DownloadButton
interface DownloadButtonProps {
  downloadUrl: string;
  buttonText: React.ReactNode;
  downloadingText?: string; // Optional, for custom text during download
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  downloadUrl,
  buttonText,
  downloadingText = 'Downloading...',
}) => {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // Function to handle the download process
  const handleDownload = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDownloading(true);

    // Simulate a delay for demonstration; in real scenarios, this would be the actual download time
    setTimeout(() => {
      // Redirect to the provided download URL
      window.location.href = downloadUrl;
      // Reset state after initiating download (this might not be necessary if the page reloads)
      setIsDownloading(false);
    }, 2000); // 2 seconds delay for demonstration
  };

  return (
    <button
      onClick={handleDownload}
      className={`no-underline rounded-button w-fit gap-2 flex justify-center items-center px-2 py-1 ${
        isDownloading ? 'cursor-wait' : ''
      }`}
      disabled={isDownloading}>
      {isDownloading ? downloadingText : buttonText}
    </button>
  );
};

export default DownloadButton;
