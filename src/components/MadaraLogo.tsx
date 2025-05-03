
import React from 'react';
import { cn } from '@/lib/utils';

interface MadaraLogoProps {
  className?: string;
  size?: number;
}

const MadaraLogo: React.FC<MadaraLogoProps> = ({ 
  className, 
  size = 60
}) => {
  return (
    <div 
      className={cn(
        "relative", 
        className
      )} 
      style={{ width: size, height: size }}
    >
      <img 
        src="/lovable-uploads/5cfa7573-4c6a-4a9b-b585-51601da36925.png" 
        alt="Madara Logo" 
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default MadaraLogo;
