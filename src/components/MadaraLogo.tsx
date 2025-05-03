
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
        src="/lovable-uploads/480e7dd3-b54e-415a-9b33-254a84f7f3a6.png" 
        alt="Madara Logo" 
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default MadaraLogo;
