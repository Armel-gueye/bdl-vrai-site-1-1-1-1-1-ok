import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './BubbleMenu.css';

interface BubbleMenuItem {
  label: string;
  href: string;
  ariaLabel: string;
  rotation: number;
  hoverStyles: {
    bgColor: string;
    textColor: string;
  };
}

interface BubbleMenuProps {
  logo: React.ReactNode;
  items: BubbleMenuItem[];
  menuAriaLabel?: string;
  menuBg?: string;
  menuContentColor?: string;
  useFixedPosition?: boolean;
  animationEase?: string;
  animationDuration?: number;
  staggerDelay?: number;
}

export const BubbleMenu: React.FC<BubbleMenuProps> = ({
  logo,
  items,
  menuAriaLabel = 'Toggle navigation',
  menuBg = '#ffffff',
  menuContentColor = '#111111',
  useFixedPosition = false,
  animationEase = 'back.out(1.5)',
  animationDuration = 0.5,
  staggerDelay = 0.12
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  // Используем gsap.context pour la gestion propre des animations
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null); // Ref for the menu items container
  const pillLinksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const ctx = useRef<gsap.Context | null>(null);

  // Refs cleanup on unmount or items change
  useEffect(() => {
    pillLinksRef.current = [];
    labelRefs.current = [];
  }, [items]);

  // Scroll lock removed to prevent layout thrashing on iOS with heavy Framer Motion pages
  // useEffect(() => {
  //   document.body.style.overflow = isOpen ? 'hidden' : '';
  //   return () => {
  //     document.body.style.overflow = '';
  //   };
  // }, [isOpen]);

  // Handle animation frame for opening/closing
  useEffect(() => {
    // If not open and not showing overlay, nothing to do
    if (!isOpen && !showOverlay) return;

    // Use gsap.context for scoping and easy cleanup
    ctx.current = gsap.context(() => {
      const backdrop = backdropRef.current;
      const overlay = overlayRef.current;
      const bubbles = pillLinksRef.current.filter(Boolean);
      const labels = labelRefs.current.filter(Boolean);

      if (isOpen && showOverlay) {
        // OPENING ANIMATION
        if (overlay) {
          gsap.set(overlay, { display: 'flex', visibility: 'visible' });
        }

        if (bubbles.length > 0) {
          gsap.set(bubbles, { scale: 0, opacity: 1, rotation: 0 }); // Ensure rotation reset if needed or handled by CSS
          gsap.set(labels, { y: 24, opacity: 0 });

          // Re-apply rotation for desktop if needed
          const isDesktop = window.innerWidth >= 900;
          bubbles.forEach((bubble, i) => {
            if (isDesktop && items[i]) {
              gsap.set(bubble, { rotation: items[i].rotation });
            }
          });
        }

        if (backdrop) {
          gsap.to(backdrop, {
            opacity: 1,
            visibility: 'visible',
            duration: 0.3,
            ease: 'power2.out'
          });
        }

        if (bubbles.length > 0) {
          bubbles.forEach((bubble, i) => {
            const delay = i * staggerDelay;
            gsap.to(bubble, {
              scale: 1,
              duration: animationDuration,
              ease: animationEase,
              delay: delay
            });

            if (labels[i]) {
              gsap.to(labels[i], {
                y: 0,
                opacity: 1,
                duration: animationDuration,
                ease: 'power3.out',
                delay: delay + animationDuration * 0.1
              });
            }
          });
        }

      } else if (!isOpen && showOverlay) {
        // CLOSING ANIMATION
        const bubbles = pillLinksRef.current.filter(Boolean);
        const labels = labelRefs.current.filter(Boolean);

        if (overlay) {
          // Wait for animations to finish then hide
          // We use a timeline or separate tweens, but we need to coordinate the 'onComplete'
        }

        // Hide Backdrop
        if (backdrop) {
          gsap.to(backdrop, {
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
              gsap.set(backdrop, { visibility: 'hidden' });
            }
          });
        }

        // Hide Labels
        if (labels.length > 0) {
          gsap.to(labels, {
            y: 24,
            opacity: 0,
            duration: 0.15,
            ease: 'power3.in',
          });
        }

        // Hide Bubbles
        if (bubbles.length > 0) {
          gsap.to(bubbles, {
            scale: 0,
            duration: 0.15,
            ease: 'power3.in',
            onComplete: () => {
              if (overlay) {
                gsap.set(overlay, { display: 'none', visibility: 'hidden' });
              }
              setShowOverlay(false); // Unmount content
            }
          });
        } else {
          // If no bubbles/labels found (rare error case), just close immediately
          if (overlay) gsap.set(overlay, { display: 'none', visibility: 'hidden' });
          setShowOverlay(false);
        }
      }
    }, menuContainerRef); // Scope to container

    return () => {
      ctx.current?.revert(); // Cleanup GSAP animations on effect cleanup
    };
  }, [isOpen, showOverlay, animationDuration, animationEase, staggerDelay, items]);


  const toggleMenu = () => {
    if (!isOpen) {
      // Opening
      setShowOverlay(true);
      // We set isOpen next tick to ensure render happened? 
      // Usually setState is batched. 
      // Simple state toggle fits the user's original logic best.
      setIsOpen(true);
    } else {
      // Closing
      setIsOpen(false);
      // We do NOT set showOverlay(false) here, we wait for animation to finish in useEffect
    }
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const positionClass = useFixedPosition ? 'fixed' : 'absolute';

  return (
    <div ref={menuContainerRef}>
      {/* Backdrop overlay - Restored */}
      <div
        ref={backdropRef}
        className="fixed inset-0 bg-slate-50/95"
        style={{
          opacity: 0,
          visibility: 'hidden',
          pointerEvents: isOpen ? 'auto' : 'none',
          zIndex: 40
        }}
        onClick={() => setIsOpen(false)}
      />

      <nav className={`bubble-menu ${positionClass}`} aria-label="Main navigation">
        <div
          className="bubble logo-bubble"
          style={{ background: menuBg, color: menuContentColor }}>
          <span className="logo-content">{logo}</span>
        </div>

        <div
          className="bubble toggle-bubble"
          style={{ background: menuBg }}>
          <button
            type="button"
            className={`menu-btn ${isOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            aria-label={menuAriaLabel}
            aria-pressed={isOpen}
            style={{ background: menuBg }}>
            <span className="menu-line" style={{ background: menuContentColor }}></span>
            <span className="menu-line" style={{ background: menuContentColor }}></span>
          </button>
        </div>
      </nav>

      {/* Menu items */}
      {showOverlay && (
        <div
          ref={overlayRef}
          className={`bubble-menu-items ${positionClass}`}
          style={{ display: 'none', visibility: 'hidden', pointerEvents: isOpen ? 'auto' : 'none' }}
          aria-hidden={!isOpen}>
          <ul className="pill-list" role="menu" aria-label="Menu links">
            {items.map((item, index) => {
              const isEven = items.length % 2 === 0;
              const needsSpacer = !isEven && index === Math.floor(items.length / 2);

              return (
                <React.Fragment key={`${item.label}-${index}`}>
                  {needsSpacer && <li className="pill-spacer" role="none" />}
                  <li className="pill-col" role="none">
                    <a
                      role="menuitem"
                      ref={(el) => {
                        if (el) pillLinksRef.current[index] = el;
                      }}
                      href={item.href}
                      className="pill-link"
                      aria-label={item.ariaLabel}
                      style={
                        {
                          '--item-rot': `${item.rotation}deg`,
                          '--pill-bg': menuBg,
                          '--pill-color': menuContentColor,
                          '--hover-bg': item.hoverStyles.bgColor,
                          '--hover-color': item.hoverStyles.textColor
                        } as React.CSSProperties
                      }
                      onClick={handleLinkClick}>
                      <span
                        className="pill-label"
                        ref={(el) => {
                          if (el) labelRefs.current[index] = el;
                        }}>
                        {item.label}
                      </span>
                    </a>
                  </li>
                </React.Fragment>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BubbleMenu;