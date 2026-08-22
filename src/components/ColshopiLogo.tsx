import React from 'react';

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
        src="/colshopi-logo.png"
        alt="ColShopi Tienda By Leps Digital"
        className="w-full h-full rounded-full object-contain relative z-10"
        loading="eager"
        referrerPolicy="no-referrer"
        onError={(e) => {
          const target = e.currentTarget;
          target.src = '/colshopi-logo.svg';
        }}
      />
    </div>
  );
};
