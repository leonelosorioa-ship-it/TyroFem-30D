import React from 'react';
import colshopiPrimaryLogo from '../assets/images/regenerated_image_1787510860976.jpg';

interface ColshopiLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showGlow?: boolean;
  className?: string;
}

export const ColshopiLogo: React.FC<ColshopiLogoProps> = ({
  size = 'md',
  showGlow = true,
  className = '',
}) => {
  const sizeMap = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32',
  };

  const dim = sizeMap[size];

  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 ${dim} ${className}`}
      title="ColShopi Tienda By Leps Digital"
    >
      {showGlow && (
        <div className="absolute inset-0 bg-cyan-400/30 rounded-full blur-md animate-pulse pointer-events-none" />
      )}
      <img
        src={colshopiPrimaryLogo}
        alt="ColShopi Tienda By Leps Digital"
        className="w-full h-full rounded-full object-contain relative z-10 drop-shadow-sm transition-transform duration-300 hover:scale-105"
        style={{ imageRendering: 'auto' }}
        loading="eager"
        referrerPolicy="no-referrer"
        onError={(e) => {
          const target = e.currentTarget;
          target.src = '/colshopi-logo.png';
        }}
      />
    </div>
  );
};
