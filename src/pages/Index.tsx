
import React from 'react';
import SurebetCalculator from '@/components/SurebetCalculator';
import SharinganLogo from '@/components/SharinganLogo';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  return (
    <div className="min-h-screen bg-uchiha-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-center items-center mb-8">
          <SharinganLogo className="mr-4" />
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Madara <span className="text-uchiha-red">Surebet</span>
            </h1>
          </div>
        </div>
        
        <Separator className="bg-uchiha-gray mb-8" />
        
        {/* Main Calculator */}
        <SurebetCalculator />
        
        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Desenvolvido com o poder do Sharingan para cálculos precisos de apostas.</p>
          <p className="mt-2">&copy; 2025 Uchiha Systems</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
