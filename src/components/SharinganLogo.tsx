
import React from 'react';
import { cn } from '@/lib/utils';

interface SharinganLogoProps {
  className?: string;
  size?: number;
  spinning?: boolean;
}

const SharinganLogo: React.FC<SharinganLogoProps> = ({ 
  className, 
  size = 60,
  spinning = false
}) => {
  return (
    <div 
      className={cn(
        "relative", 
        spinning && "animate-sharingan-spin", 
        className
      )} 
      style={{ width: size, height: size }}
    >
      {/* Outer circle (red) */}
      <div className="absolute inset-0 rounded-full bg-uchiha-red" />
      
      {/* Inner circle (black) */}
      <div 
        className="absolute bg-black rounded-full" 
        style={{ 
          top: '10%', 
          left: '10%', 
          width: '80%', 
          height: '80%' 
        }}
      />
      
      {/* Tomoe patterns */}
      <div
        className="absolute bg-uchiha-red rounded-full"
        style={{
          width: '18%',
          height: '18%',
          top: '15%',
          left: '50%',
          transform: 'translate(-50%, 0)',
          boxShadow: '0 0 5px rgba(234, 56, 76, 0.8)'
        }}
      />
      <div
        className="absolute bg-uchiha-red rounded-full"
        style={{
          width: '18%',
          height: '18%',
          bottom: '25%',
          left: '25%',
          boxShadow: '0 0 5px rgba(234, 56, 76, 0.8)'
        }}
      />
      <div
        className="absolute bg-uchiha-red rounded-full"
        style={{
          width: '18%',
          height: '18%',
          bottom: '25%',
          right: '25%',
          boxShadow: '0 0 5px rgba(234, 56, 76, 0.8)'
        }}
      />
      
      {/* Center dot */}
      <div
        className="absolute bg-uchiha-red rounded-full"
        style={{
          width: '12%',
          height: '12%',
          top: '44%',
          left: '44%',
          boxShadow: '0 0 8px rgba(234, 56, 76, 1)'
        }}
      />
    </div>
  );
};

export default SharinganLogo;
