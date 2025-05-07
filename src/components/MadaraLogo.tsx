
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
        src="https://26c9857c-af7f-4b54-a80a-96b68c4199bf.lovableproject.com/lovable-uploads/480e7dd3-b54e-415a-9b33-254a84f7f3a6.png" 
        alt="Madara Logo" 
        className="w-full h-full object-contain"
        onError={(e) => {
          // Fallback to local path if the absolute URL fails
          const target = e.target as HTMLImageElement;
          target.src = "/lovable-uploads/480e7dd3-b54e-415a-9b33-254a84f7f3a6.png";
        }}
      />
    </div>
  );
};

export default MadaraLogo;
