import { Suspense, lazy, useState, useEffect, useRef } from 'react'
import type { Application } from '@splinetool/runtime'
import { getDeviceCapabilities } from '@/utils/deviceCapabilities'

const Spline = lazy(() => import('@splinetool/react-spline'))

// Static fallback image for low-end mobile devices
const ROBOT_FALLBACK_IMAGE = 'https://i.postimg.cc/c4SvwL8B/Capture-d-ecran-2026-01-03-134631-min.webp';

export default function Robot() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [canRender3D, setCanRender3D] = useState<boolean | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check device capabilities on mount - ONCE only
  useEffect(() => {
    const capabilities = getDeviceCapabilities();
    setCanRender3D(capabilities.canHandle3D);
  }, []);

  // Handle Spline load - animation plays ONCE on load, that's it
  const onLoad = (splineApp: Application) => {
    // Ensure the robot appears at its final size without zoom animation
    splineApp.setZoom(1);

    // Delay the fade-in by 0.5s after complete loading
    setTimeout(() => {
      setIsLoaded(true);
    }, 500);
  };

  // Still determining device capabilities - show nothing (brief moment)
  if (canRender3D === null) {
    return <div ref={containerRef} className="w-full h-full bg-transparent"></div>;
  }

  // Low-end mobile device: Show static image fallback
  if (!canRender3D) {
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

  // Capable device (Desktop or high-end mobile): Show 3D Spline
  // Animation plays ONCE on page load - no restart on scroll
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