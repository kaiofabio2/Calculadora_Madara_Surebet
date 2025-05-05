
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Calculator, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import OddInput from '@/components/OddInput';
import ResultsDisplay from '@/components/ResultsDisplay';
import { 
  isSurebet, 
  calculateMargin,
  calculateStakes,
  roundStakes,
  calculateTotalProfit,
  calculateProfitPercentage,
  recalculateStakesForCustomTotal,
  recalculateStakesForSpecificBet
} from '@/utils/surebetCalculator';

const SurebetCalculator = () => {
  const [odds, setOdds] = useState<number[]>([0, 0]);
  const [totalStake, setTotalStake] = useState<number | ''>();
  const [roundingValue, setRoundingValue] = useState<number | ''>();
  const [stakes, setStakes] = useState<number[]>([0, 0]);
  const [profit, setProfit] = useState<number>(0);
  const [profitPercentage, setProfitPercentage] = useState<number>(0);

  // Update calculations when inputs change
  useEffect(() => {
    if (typeof totalStake === 'number' && totalStake > 0 && odds.every(odd => odd > 1)) {
      calculateResults();
    }
  }, [odds, totalStake, roundingValue]);

  const calculateResults = () => {
    if (!odds.every(odd => odd > 1)) {
      toast.error("Todas as odds devem ser maiores que 1");
      return;
    }

    if (typeof totalStake !== 'number' || totalStake <= 0) {
      toast.error("Valor total da aposta deve ser maior que 0");
      return;
    }

    const calculatedStakes = calculateStakes(odds, totalStake);
    const roundedStakes = typeof roundingValue === 'number' && roundingValue > 0
      ? roundStakes(calculatedStakes, roundingValue, totalStake)
      : calculatedStakes;
    
    const calculatedProfit = calculateTotalProfit(roundedStakes, odds, totalStake);
    const calculatedProfitPercentage = calculateProfitPercentage(calculatedProfit, totalStake);
    
    setStakes(roundedStakes);
    setProfit(calculatedProfit);
    setProfitPercentage(calculatedProfitPercentage);
  };

  const handleAddOdd = () => {
    if (odds.length >= 5) {
      toast.warning("Máximo de 5 odds permitido");
      return;
    }
    setOdds([...odds, 0]);
    setStakes([...stakes, 0]); // Adicione um novo elemento ao stakes para manter sincronizado com as odds
  };

  const handleRemoveOdd = (index: number) => {
    if (odds.length <= 2) {
      toast.warning("Mínimo de 2 odds necessário");
      return;
    }
    const newOdds = [...odds];
    newOdds.splice(index, 1);
    setOdds(newOdds);
    
    // Também atualiza o array de stakes
    const newStakes = [...stakes];
    newStakes.splice(index, 1);
    setStakes(newStakes);
  };

  const updateOdd = (index: number, value: number) => {
    const newOdds = [...odds];
    newOdds[index] = value;
    setOdds(newOdds);
  };

  const handleSpecificStakeChange = (index: number, value: number | '') => {
    if (typeof value === 'number' && value >= 0) {
      const newStakes = recalculateStakesForSpecificBet(stakes, odds, index, value);
      const newTotalStake = newStakes.reduce((sum, stake) => sum + stake, 0);
      
      setStakes(newStakes);
      setTotalStake(newTotalStake);
      
      const calculatedProfit = calculateTotalProfit(newStakes, odds, newTotalStake);
      const calculatedProfitPercentage = calculateProfitPercentage(calculatedProfit, newTotalStake);
      
      setProfit(calculatedProfit);
      setProfitPercentage(calculatedProfitPercentage);
    } else if (value === '') {
      // Permite que o campo fique vazio
      const newStakes = [...stakes];
      newStakes[index] = 0;
      setStakes(newStakes);
    }
  };

  const isSurebetPossible = isSurebet(odds);
  const margin = calculateMargin(odds);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex justify-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-uchiha-red text-glow tracking-wider">
          CALCULADORA SUREBET
        </h1>
      </div>

      <Card className="uchiha-card mb-6">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Calculator className="w-5 h-5 mr-2 text-uchiha-red" />
            Odds & Apostas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Odds Input Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-400">Cotações de Apostas</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddOdd}
                  className="sharingan-button"
                >
                  <Plus className="w-4 h-4 mr-1" /> Adicionar Odd
                </Button>
              </div>
              
              <div className="space-y-3">
                {odds.map((odd, index) => (
                  <OddInput
                    key={index}
                    index={index}
                    value={odd}
                    onChange={updateOdd}
                    onRemove={handleRemoveOdd}
                    isRemovable={odds.length > 2}
                  />
                ))}
              </div>
            </div>

            <Separator className="bg-uchiha-gray" />

            {/* Total Stake Input */}
            <div className="space-y-2">
              <label htmlFor="totalStake" className="text-sm font-semibold text-gray-400">
                Valor Total da Aposta (R$)
              </label>
              <Input
                id="totalStake"
                type="number"
                min="0"
                step="10"
                value={totalStake ?? ''}
                onChange={(e) => {
                  const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                  setTotalStake(val);
                }}
                className="bg-uchiha-gray text-white"
              />
            </div>

            {/* Rounding Value Input */}
            <div className="space-y-2">
              <label htmlFor="roundingValue" className="text-sm font-semibold text-gray-400">
                Arredondar Apostas Para (R$)
              </label>
              <Input
                id="roundingValue"
                type="number"
                min="0"
                step="0.5"
                value={roundingValue ?? ''}
                onChange={(e) => {
                  const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                  setRoundingValue(val);
                }}
                className="bg-uchiha-gray text-white"
              />
            </div>
            
            {/* Surebet Results Summary */}
            <div className="mt-6">
              <div className="p-4 bg-uchiha-black/50 rounded-lg border border-uchiha-gray">
                <div className={cn(
                  "text-lg font-medium mb-2", 
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
                
                {/* Summary profit display */}
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-base">Lucro Garantido:</span>
                    <span className={`text-xl font-bold ${profit >= 0 ? 'text-green-500' : 'text-uchiha-red'}`}>
                      R$ {profit.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base">Percentual de Lucro:</span>
                    <span className={`text-xl font-bold ${profitPercentage >= 0 ? 'text-green-500' : 'text-uchiha-red'}`}>
                      {profitPercentage.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stake Distribution Results */}
      <Card className="uchiha-card">
        <CardHeader>
          <CardTitle className="text-xl">Distribuição das Apostas</CardTitle>
        </CardHeader>
        <CardContent>
          <ResultsDisplay 
            stakes={stakes}
            odds={odds}
            profit={profit}
            profitPercentage={profitPercentage}
            onSpecificStakeChange={handleSpecificStakeChange}
          />
          
          <div className="mt-6 text-center">
            <p className="text-sm italic text-gray-400">
              "Apostando com a precisão de Madara!"
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SurebetCalculator;
