import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Footer } from '@/components/ui/footer-section';
import { motion, AnimatePresence } from 'framer-motion';
import { BubbleMenu } from '@/components/ui/BubbleMenu';
import { DynamicNavigation } from '@/components/lightswind/dynamic-navigation';
import { BinkooChatbot } from '@/components/BinkooChatbot';

const Layout: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();
  
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const whatsappUrl = 'https://api.whatsapp.com/send?phone=22644323841';
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };
  
  const navigationItems = [{
    name: 'Accueil',
    path: '/'
  }, {
    name: 'Services',
    path: '/services'
  }, {
    name: 'Portfolio',
    path: '/realisations'
  }, {
    name: 'A Propos',
    path: '/a-propos'
  }, {
    name: 'Contact',
    path: '/contact'
  }];

  // Configuration pour BubbleMenu
  const bubbleMenuItems = [
    {
      label: 'accueil',
      href: '/',
      ariaLabel: 'Accueil',
      rotation: -8,
      hoverStyles: { bgColor: '#FF2B00', textColor: '#ffffff' }
    },
    {
      label: 'services',
      href: '/services',
      ariaLabel: 'Services',
      rotation: 8,
      hoverStyles: { bgColor: '#FF2B00', textColor: '#ffffff' }
    },
    {
      label: 'portfolio',
      href: '/realisations',
      ariaLabel: 'Portfolio',
      rotation: 8,
      hoverStyles: { bgColor: '#FF2B00', textColor: '#ffffff' }
    },
    {
      label: 'à propos',
      href: '/a-propos',
      ariaLabel: 'À Propos',
      rotation: -8,
      hoverStyles: { bgColor: '#FF2B00', textColor: '#ffffff' }
    },
    {
      label: 'contact',
      href: '/contact',
      ariaLabel: 'Contact',
      rotation: 8,
      hoverStyles: { bgColor: '#FF2B00', textColor: '#ffffff' }
    }
  ];
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Cache le menu dès qu'on scroll (après seulement 5px)
      if (currentScrollY > 5) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  return <div className="min-h-screen bg-background">
      {/* BubbleMenu for Tablet and Mobile only */}
      <div className="lg:hidden">
        <BubbleMenu
          logo={<span style={{ fontWeight: 700, fontSize: '0.75rem', whiteSpace: 'nowrap' }}>BinkoO Digital Lab</span>}
          items={bubbleMenuItems}
          menuAriaLabel="Toggle navigation"
          menuBg="#ffffff"
          menuContentColor="#111111"
          useFixedPosition={true}
          animationEase="back.out(1.5)"
          animationDuration={0.5}
          staggerDelay={0.12}
        />
      </div>

      {/* Desktop Navigation with DynamicNavigation */}
      <motion.div 
        className={`hidden lg:block fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border transition-all duration-200 ease-in-out ${
          isVisible ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container-fluid">
          <DynamicNavigation
            items={navigationItems}
            logo={
              <div className="font-bold text-xl lg:text-2xl xl:text-3xl tracking-tight hover:opacity-80 transition-opacity text-foreground -ml-2 lg:-ml-4">
                BinkoO Digital Lab
              </div>
            }
          />
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="pt-0">
        {children}
      </main>

      {/* Footer */}
      <Footer />

      {/* Chatbot - appears on all pages */}
      <BinkooChatbot />
    </div>;
};
export default Layout;