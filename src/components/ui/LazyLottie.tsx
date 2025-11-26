import React, { useEffect, useRef, useState } from 'react';

interface LazyLottieProps {
  src: string;
  style?: React.CSSProperties;
  className?: string;
  title?: string;
  threshold?: number;
}

/**
 * LazyLottie - Composant optimisé pour charger les Lotties uniquement lorsqu'ils sont visibles
 * Utilise IntersectionObserver pour détecter la visibilité
 */
export const LazyLottie: React.FC<LazyLottieProps> = ({ 
  src, 
  style = {}, 
  className = '',
  title = 'Lottie Animation',
  threshold = 0.1 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Charger le script dotlottie-wc une seule fois
  useEffect(() => {
    if (typeof window !== 'undefined' && !document.querySelector('script[src*="dotlottie-wc"]')) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@lottiefiles/dotlottie-wc@0.8.5/dist/dotlottie-wc.js';
      script.type = 'module';
      script.async = true;
      script.onload = () => setScriptLoaded(true);
      document.head.appendChild(script);
    } else {
      setScriptLoaded(true);
    }
  }, []);

  // Intersection Observer pour lazy loading
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { 
        threshold,
        rootMargin: '50px' // Commence à charger 50px avant d'être visible
      }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div 
      ref={containerRef} 
      className={className}
      style={style}
    >
      {isVisible && scriptLoaded ? (
        <dotlottie-wc
          src={src}
          autoplay
          loop
          style={{ width: '100%', height: '100%' }}
        />
      ) : (
        // Placeholder pendant le chargement
        <div 
          className="w-full h-full flex items-center justify-center bg-gray-100/50 animate-pulse rounded-lg"
          style={{ minHeight: '200px' }}
        >
          <div className="text-gray-400 text-sm">Chargement...</div>
        </div>
      )}
    </div>
  );
};

// Déclaration TypeScript pour dotlottie-wc
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'dotlottie-wc': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src: string;
          autoplay?: boolean;
          loop?: boolean;
          style?: React.CSSProperties;
        },
        HTMLElement
      >;
    }
  }
}

export default LazyLottie;
  