
import React from 'react';
import { Input } from '@/components/ui/input';

interface StakeConfigSectionProps {
  totalStake: number | '';
  roundingValue: number | '';
  setTotalStake: (value: number | '') => void;
  setRoundingValue: (value: number | '') => void;
}

const StakeConfigSection = ({
  totalStake,
  roundingValue,
  setTotalStake,
  setRoundingValue
}: StakeConfigSectionProps) => {
  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default StakeConfigSection;
