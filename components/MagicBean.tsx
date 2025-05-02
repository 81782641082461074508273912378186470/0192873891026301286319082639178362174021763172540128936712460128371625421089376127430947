'use client';

import type React from 'react';
import { forwardRef, useRef } from 'react';

import { cn } from '@/lib/utils';
import { AnimatedBeam } from './ui/AnimatedBean';
import Image from 'next/image';
import shopee from '@/assets/icons/shopee.svg';
import akulaku from '@/assets/icons/akulakuLogo.webp';
import cloudinary from '@/assets/icons/cloudinary.png';
import grok from '@/assets/icons/grok.png';

const Circle = forwardRef<HTMLDivElement, { className?: string; children?: React.ReactNode }>(
  ({ className, children }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'z-10 flex size-12 items-center justify-center rounded-full border-[1px] border-neutral-800  bg-dark-800 p-3',
          className
        )}>
        {children}
      </div>
    );
  }
);

Circle.displayName = 'Circle';

export default function MagicBean() {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className="relative flex h-[500px] w-full items-center justify-center overflow-hidden rounded-lg bg-background p-10 md:shadow-xl"
      ref={containerRef}>
      <div className="flex size-full max-h-[200px] max-w-lg flex-col items-stretch justify-between gap-10">
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div1Ref}>
            <Icons.cloudinary />
          </Circle>
          <Circle ref={div5Ref}>
            <Icons.grok />
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div2Ref}>
            <Icons.openai />
          </Circle>
          <Circle ref={div4Ref} className="size-16">
            <Icons.autolaku />
          </Circle>
          <Circle ref={div6Ref}>
            <Icons.xai />
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div3Ref}>
            <Icons.akulaku />
          </Circle>
          <Circle ref={div7Ref}>
            <Icons.shopee />
          </Circle>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div4Ref}
        curvature={-75}
        endYOffset={-10}
      />
      <AnimatedBeam containerRef={containerRef} fromRef={div2Ref} toRef={div4Ref} />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div4Ref}
        curvature={75}
        endYOffset={10}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div4Ref}
        curvature={-75}
        endYOffset={-10}
        reverse
      />
      <AnimatedBeam containerRef={containerRef} fromRef={div6Ref} toRef={div4Ref} reverse />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div7Ref}
        toRef={div4Ref}
        curvature={75}
        endYOffset={10}
        reverse
      />
    </div>
  );
}

const Icons = {
  openai: () => (
    <svg width="100" height="100" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="#fff"
        d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"
      />
    </svg>
  ),
  cloudinary: () => (
    <>
      <Image src={cloudinary} alt="Cloudinary Logo | Autolaku" />
    </>
  ),
  akulaku: () => (
    <>
      <Image src={akulaku} alt="Akulaku Logo | Autolaku" />
    </>
  ),
  grok: () => (
    <>
      <Image src={grok} alt="Grok Logo | Autolaku" />
    </>
  ),
  xai: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="size-8">
      <path
        d="M2.30047 8.77631L12.0474 23H16.3799L6.63183 8.77631H2.30047ZM6.6285 16.6762L2.29492 23H6.63072L8.79584 19.8387L6.6285 16.6762ZM17.3709 1L9.88007 11.9308L12.0474 15.0944L21.7067 1H17.3709ZM18.1555 7.76374V23H21.7067V2.5818L18.1555 7.76374Z"
        fill="currentColor"></path>
    </svg>
  ),
  autolaku: () => (
    <svg
      id="A"
      data-name="A"
      fill="#fff"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 4389.67 5000"
      className="h-auto w-5 lg:w-7">
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
  ),
  shopee: () => (
    <>
      <Image src={shopee} alt="Shopee Logo | Autolaku" />
    </>
  ),
};
