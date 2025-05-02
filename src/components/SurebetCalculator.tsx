import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Calculator, Plus, Minus, ArrowRight } from 'lucide-react';
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
  const [odds, setOdds] = useState<number[]>([2.0, 2.0]);
  const [totalStake, setTotalStake] = useState<number>(100);
  const [roundingValue, setRoundingValue] = useState<number>(1);
  const [customStake, setCustomStake] = useState<number>(100);
  const [stakes, setStakes] = useState<number[]>([50, 50]);
  const [profit, setProfit] = useState<number>(0);
  const [profitPercentage, setProfitPercentage] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Update calculations when inputs change
  useEffect(() => {
    calculateResults();
  }, [odds, totalStake, roundingValue]);

  const calculateResults = () => {
    if (!odds.every(odd => odd > 1)) {
      toast.error("Todas as odds devem ser maiores que 1");
      return;
    }

    if (totalStake <= 0) {
      toast.error("Valor total da aposta deve ser maior que 0");
      return;
    }

    const calculatedStakes = calculateStakes(odds, totalStake);
    const roundedStakes = roundStakes(calculatedStakes, roundingValue, totalStake);
    
    const calculatedProfit = calculateTotalProfit(roundedStakes, odds, totalStake);
    const calculatedProfitPercentage = calculateProfitPercentage(calculatedProfit, totalStake);
    
    setStakes(roundedStakes);
    setCustomStake(totalStake);
    setProfit(calculatedProfit);
    setProfitPercentage(calculatedProfitPercentage);

    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const handleAddOdd = () => {
    if (odds.length >= 5) {
      toast.warning("Máximo de 5 odds permitido");
      return;
    }
    setOdds([...odds, 2.0]);
  };

  const handleRemoveOdd = (index: number) => {
    if (odds.length <= 2) {
      toast.warning("Mínimo de 2 odds necessário");
      return;
    }
    const newOdds = [...odds];
    newOdds.splice(index, 1);
    setOdds(newOdds);
  };

  const updateOdd = (index: number, value: number) => {
    const newOdds = [...odds];
    newOdds[index] = value;
    setOdds(newOdds);
  };

  const handleCustomStakeChange = (value: number) => {
    setCustomStake(value);
    const customCalculatedStakes = recalculateStakesForCustomTotal(stakes, value);
    
    const calculatedProfit = calculateTotalProfit(customCalculatedStakes, odds, value);
    const calculatedProfitPercentage = calculateProfitPercentage(calculatedProfit, value);
    
    setStakes(customCalculatedStakes);
    setProfit(calculatedProfit);
    setProfitPercentage(calculatedProfitPercentage);
  };

  const handleSpecificStakeChange = (index: number, value: number) => {
    const newStakes = recalculateStakesForSpecificBet(stakes, odds, index, value);
    const newTotalStake = newStakes.reduce((sum, stake) => sum + stake, 0);
    
    setStakes(newStakes);
    setCustomStake(newTotalStake);
    
    const calculatedProfit = calculateTotalProfit(newStakes, odds, newTotalStake);
    const calculatedProfitPercentage = calculateProfitPercentage(calculatedProfit, newTotalStake);
    
    setProfit(calculatedProfit);
    setProfitPercentage(calculatedProfitPercentage);
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Inputs Section */}
        <Card className="uchiha-card md:col-span-2">
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
                  value={totalStake}
                  onChange={(e) => setTotalStake(parseFloat(e.target.value) || 0)}
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
                  value={roundingValue}
                  onChange={(e) => setRoundingValue(parseFloat(e.target.value) || 0)}
                  className="bg-uchiha-gray text-white"
                />
              </div>

              {/* Calculate Button */}
              <Button 
                onClick={calculateResults}
                className={cn(
                  "w-full sharingan-button",
                  isAnimating && "sharingan-pulse"
                )}
                variant="outline"
              >
                Calcular Surebet <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="uchiha-card">
          <CardHeader>
            <CardTitle className="text-xl">Resultados</CardTitle>
            <div>
              <div className={cn(
                "text-sm font-medium", 
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
                  className="h-1 mt-2 bg-uchiha-gray" 
                />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <ResultsDisplay 
              stakes={stakes}
              odds={odds}
              profit={profit}
              profitPercentage={profitPercentage}
              customStake={customStake}
              onCustomStakeChange={handleCustomStakeChange}
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
    </div>
  );
};

export default SurebetCalculator;
