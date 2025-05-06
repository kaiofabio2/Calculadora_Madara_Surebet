
import React from 'react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ArrowUp, Percent, DollarSign, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ResultsDisplayProps {
  stakes: number[];
  odds: number[];
  profit: number;
  profitPercentage: number;
  isSurebetPossible: boolean;
  margin: number;
  onSpecificStakeChange: (index: number, value: number | '') => void;
}

const ResultsDisplay = ({ 
  stakes, 
  odds,
  profit, 
  profitPercentage,
  isSurebetPossible,
  margin,
  onSpecificStakeChange
}: ResultsDisplayProps) => {
  // Calculate total stake
  const totalStake = stakes.reduce((sum, stake) => sum + (stake || 0), 0);
  
  // Calculate total return (assuming all odds have the same return value in a balanced surebet)
  const totalReturn = stakes.length > 0 && odds.length > 0 && stakes[0] && odds[0] 
    ? (stakes[0] * odds[0]) 
    : 0;

  // Function to format input value to have exactly 2 decimal places
  const formatCurrencyInput = (value: string): string => {
    if (value === '') return '';
    
    // Remove any non-numeric characters except the decimal point
    let cleanValue = value.replace(/[^\d.]/g, '');
    
    // Ensure there's only one decimal point
    const parts = cleanValue.split('.');
    if (parts.length > 2) {
      cleanValue = parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Handle more than 2 decimal places by shifting excess to the integer part
    if (parts.length === 2 && parts[1].length > 2) {
      const integerPart = parseInt(parts[0] || '0', 10);
      const decimalPart = parts[1];
      
      // Extract the first two decimal places
      const keepDecimal = decimalPart.substring(0, 2);
      
      // Convert the remaining decimal places to an integer to add to the integer part
      const moveToInt = parseInt(decimalPart.substring(2), 10) || 0;
      if (moveToInt > 0) {
        // Add the shifted value to the integer part (divide by appropriate power of 10)
        const shiftedValue = moveToInt / Math.pow(10, decimalPart.substring(2).length);
        const newInteger = integerPart + shiftedValue;
        return `${Math.floor(newInteger)}.${keepDecimal}`;
      }
      
      return `${integerPart}.${keepDecimal}`;
    }
    
    return cleanValue;
  };

  // Function to adjust value when losing focus (blur)
  const handleBlur = (value: string): number => {
    if (value === '') return 0;
    
    const numValue = parseFloat(value);
    
    // Format to exactly 2 decimal places
    return Math.round(numValue * 100) / 100;
  };

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
                  <div className="text-xs text-gray-400">
                    Retorno: R$ {stake ? (stake * odds[index]).toFixed(2) : '0.00'}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <Input
                type="text"
                inputMode="decimal"
                value={stake ? stake.toFixed(2) : ''}
                onChange={(e) => {
                  const formattedValue = formatCurrencyInput(e.target.value);
                  const val = formattedValue === '' ? '' : parseFloat(formattedValue);
                  onSpecificStakeChange(index, val);
                }}
                onBlur={(e) => {
                  const adjustedValue = handleBlur(e.target.value);
                  onSpecificStakeChange(index, adjustedValue);
                }}
                className="bg-uchiha-gray text-white"
                placeholder={`Valor para Odd ${String.fromCharCode(65 + index)}`}
              />
            </div>
          </div>
        ))}
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
        
        {/* Total return */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <RefreshCw className="w-5 h-5 mr-2 text-blue-400" />
            <span className="text-sm font-semibold">Retorno Total:</span>
          </div>
          <div className="font-bold text-blue-400">
            R$ {totalReturn.toFixed(2)}
          </div>
        </div>
        
        {/* Surebet Results Summary */}
        <div className="mt-3">
          <div className={cn(
            "text-xl font-medium mb-2", 
            isSurebetPossible ? "text-green-400" : "text-uchiha-red"
          )}>
            {isSurebetPossible 
              ? `Surebet Encontrada: ${margin.toFixed(2)}% de lucro`
              : "Não é uma Surebet"
            }
          </div>
          {isSurebetPossible && (
            <Progress 
              value={Math.min(margin * 2, 100)} 
              className="h-2 bg-uchiha-gray" 
            />
          )}
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
