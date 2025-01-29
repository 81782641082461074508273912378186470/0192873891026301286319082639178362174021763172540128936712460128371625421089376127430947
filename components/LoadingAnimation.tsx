/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from 'next/image';
import ALogo from '@/assets/icons/Auto.png';

const LoadingAnimation = ({ text }: { text?: string }) => {
  return (
    <div className="fixed top-0 left-0 z-[100] w-screen h-screen flex flex-col justify-center items-center bg-dark-800">
      <div className="relative flex flex-col items-center justify-center gap-3">
        <div className="w-20 h-20 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              id="A"
              data-name="A"
              fill="#fff"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 4389.67 5000"
              className="h-auto w-10">
              <polygon
                className="cls-1"
                points="2304.85 2826.47 1426.69 5000 0 5000 1813.03 512.61 2304.85 2826.47"
              />
              <polygon
                className="cls-1"
                points="3967.92 3015.8 2615.57 3015.8 2513.7 3015.8 1979.25 4338.6 2896.73 4338.6 3037.32 5000 4389.67 5000 3967.92 3015.8"
              />
              <polygon
                className="cls-1"
                points="3911.69 2751.24 2559.33 2751.24 1990.26 73.96 2020.14 0 3326.9 0 3911.69 2751.24"
              />
            </svg>
          </div>
          {/* Spinning border */}
          <div className="w-20 h-20 border-y-[1px] border-y-white/30 border-x-2 border-x-white rounded-full animate-spin"></div>
        </div>
      </div>
      <p className="mt-2">{text}</p>
    </div>
  );
};

export default LoadingAnimation;
