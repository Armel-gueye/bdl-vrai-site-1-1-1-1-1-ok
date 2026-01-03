import { Suspense, lazy, useState, useEffect, useRef } from 'react'
import type { Application } from '@splinetool/runtime'
import { getDeviceCapabilities } from '@/utils/deviceCapabilities'

const Spline = lazy(() => import('@splinetool/react-spline'))

// Static fallback image for low-end mobile devices ONLY
const ROBOT_FALLBACK_IMAGE = 'https://i.postimg.cc/c4SvwL8B/Capture-d-ecran-2026-01-03-134631-min.webp';

/**
 * Check if we're on a mobile device (Android or iOS)
 * Desktop ALWAYS gets 3D, no questions asked
 */
function isMobileDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return /Android/i.test(ua) || /iPhone|iPad|iPod/i.test(ua);
}

export default function Robot() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showStatic, setShowStatic] = useState<boolean | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Decide what to show on mount - ONCE only
  useEffect(() => {
    // DESKTOP = ALWAYS 3D (no detection needed)
    if (!isMobileDevice()) {
      setShowStatic(false); // false = show 3D
      return;
    }

    // MOBILE = use device capability detection
    const capabilities = getDeviceCapabilities();
    setShowStatic(!capabilities.canHandle3D); // true = show static
  }, []);

  // Handle Spline load - animation plays ONCE on load, that's it
  const onLoad = (splineApp: Application) => {
    splineApp.setZoom(1);
    setTimeout(() => {
      setIsLoaded(true);
    }, 500);
  };

  // Still determining - brief loading state
  if (showStatic === null) {
    return <div ref={containerRef} className="w-full h-full bg-transparent"></div>;
  }

  // Low-end mobile: Show static image
  if (showStatic) {
    return (
      <div ref={containerRef} className="w-full h-full relative">
        <img
          src={ROBOT_FALLBACK_IMAGE}
          alt="Robot BinkoO Digital Lab"
          className="w-full h-full object-cover object-center opacity-100"
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  // Desktop or capable mobile: Show 3D Spline
  return (
    <div ref={containerRef} className="w-full h-full">
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center bg-transparent">
            <div className="w-full h-full bg-transparent"></div>
          </div>
        }
      >
        <Spline
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className={`w-full h-full transition-opacity duration-[600ms] ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={onLoad}
        />
      </Suspense>
    </div>
  )
}