
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ArrowUp, ArrowDown, Percent, DollarSign } from 'lucide-react';

interface ResultsDisplayProps {
  stakes: number[];
  odds: number[];
  profit: number;
  profitPercentage: number;
  customStake: number;
  onCustomStakeChange: (value: number) => void;
  onSpecificStakeChange: (index: number, value: number) => void;
}

const ResultsDisplay = ({ 
  stakes, 
  odds,
  profit, 
  profitPercentage, 
  customStake, 
  onCustomStakeChange,
  onSpecificStakeChange
}: ResultsDisplayProps) => {
  return (
    <div className="space-y-4">
      {/* Distribution of stakes */}
      <div className="space-y-3">
        <div className="text-sm font-semibold text-gray-400">Distribuição das Apostas</div>
        {stakes.map((stake, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="flex items-center justify-center bg-uchiha-red w-8 h-8 rounded-md mr-2">
                  <span className="text-white font-semibold">{String.fromCharCode(65 + index)}</span>
                </div>
                <div>
                  <div className="text-sm">Odd: {odds[index].toFixed(2)}</div>
                  <div className="text-xs text-gray-400">Retorno: R$ {(stake * odds[index]).toFixed(2)}</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <Input
                type="number"
                min="0"
                step="1"
                value={stake}
                onChange={(e) => onSpecificStakeChange(index, parseFloat(e.target.value) || 0)}
                className="bg-uchiha-gray text-white"
                placeholder={`Valor para Odd ${String.fromCharCode(65 + index)}`}
              />
            </div>
          </div>
        ))}
      </div>
      
      <Separator className="bg-uchiha-gray" />
      
      {/* Custom stake input */}
      <div className="space-y-2">
        <label htmlFor="customStake" className="text-sm font-semibold text-gray-400">
          Valor Total Personalizado (R$)
        </label>
        <Input
          id="customStake"
          type="number"
          min="0"
          step="10"
          value={customStake}
          onChange={(e) => onCustomStakeChange(parseFloat(e.target.value) || 0)}
          className="bg-uchiha-gray text-white"
        />
      </div>
      
      <Separator className="bg-uchiha-gray" />
      
      {/* Profit information */}
      <div className="space-y-3">
        {/* Guaranteed profit */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <ArrowUp className={`w-5 h-5 mr-2 ${profit >= 0 ? 'text-green-500' : 'text-uchiha-red'}`} />
            <span className="text-sm font-semibold">Lucro Garantido:</span>
          </div>
          <div className={`font-bold ${profit >= 0 ? 'text-green-500' : 'text-uchiha-red'}`}>
            R$ {profit.toFixed(2)}
          </div>
        </div>
        
        {/* Return on stake percentage */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Percent className={`w-5 h-5 mr-2 ${profitPercentage >= 0 ? 'text-green-500' : 'text-uchiha-red'}`} />
            <span className="text-sm font-semibold">Percentual de Lucro:</span>
          </div>
          <div className={`font-bold ${profitPercentage >= 0 ? 'text-green-500' : 'text-uchiha-red'}`}>
            {profitPercentage.toFixed(2)}%
          </div>
        </div>
      </div>
      
      {profit < 0 && (
        <div className="text-xs text-uchiha-red mt-2">
          Atenção: Isto não é uma surebet. Você pode perder dinheiro.
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;
