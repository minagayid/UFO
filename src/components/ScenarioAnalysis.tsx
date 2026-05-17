import { Sliders, RefreshCw } from 'lucide-react';
import { ScenarioParameters } from '../types/financial';

interface ScenarioAnalysisProps {
  parameters: ScenarioParameters;
  onChange: (parameters: ScenarioParameters) => void;
  onReset: () => void;
}

export default function ScenarioAnalysis({ parameters, onChange, onReset }: ScenarioAnalysisProps) {
  const { growthRate, expenseReduction, volatility } = parameters;

  const updateParameter = (key: keyof ScenarioParameters, value: number) => {
    onChange({
      ...parameters,
      [key]: value,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800/60 dark:backdrop-blur-md rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-indigo-500" />
          What-If Scenario Simulation
        </h3>
        <button
          onClick={onReset}
          className="text-xs font-semibold px-3 py-1.5 bg-gray-50 hover:bg-gray-150 dark:bg-gray-900/60 dark:hover:bg-gray-900 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors flex items-center gap-1.5"
          title="Reset Sliders to Default"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Growth Rate Slider */}
        <div className="space-y-3 bg-gray-50/50 dark:bg-gray-900/20 p-4 rounded-xl border border-gray-100 dark:border-gray-800/40">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Revenue Growth Rate</label>
            <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
              {growthRate >= 0 ? '+' : ''}{growthRate}%
            </span>
          </div>
          <input
            type="range"
            min="-20"
            max="50"
            value={growthRate}
            onChange={(e) => updateParameter('growthRate', parseInt(e.target.value))}
            className="w-full h-1.5 bg-gray-250 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-[10px] text-gray-400 font-bold font-mono">
            <span>-20% (Recession)</span>
            <span>10% (Base)</span>
            <span>+50% (High Growth)</span>
          </div>
        </div>

        {/* Expense Reduction Slider */}
        <div className="space-y-3 bg-gray-50/50 dark:bg-gray-900/20 p-4 rounded-xl border border-gray-100 dark:border-gray-800/40">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Expense Reduction</label>
            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
              {expenseReduction}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            value={expenseReduction}
            onChange={(e) => updateParameter('expenseReduction', parseInt(e.target.value))}
            className="w-full h-1.5 bg-gray-250 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-[10px] text-gray-400 font-bold font-mono">
            <span>0% (As-is)</span>
            <span>5% (Optimized)</span>
            <span>30% (Aggressive Cut)</span>
          </div>
        </div>

        {/* Volatility Slider */}
        <div className="space-y-3 bg-gray-50/50 dark:bg-gray-900/20 p-4 rounded-xl border border-gray-100 dark:border-gray-800/40">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Market Volatility</label>
            <span className="text-sm font-extrabold text-rose-600 dark:text-rose-400 font-mono">
              {volatility === 1 ? 'Low' : volatility <= 4 ? 'Moderate' : volatility <= 7 ? 'High' : 'Extreme'} ({volatility}/10)
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={volatility}
            onChange={(e) => updateParameter('volatility', parseInt(e.target.value))}
            className="w-full h-1.5 bg-gray-250 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
          <div className="flex justify-between text-[10px] text-gray-400 font-bold font-mono">
            <span>Low (1)</span>
            <span>Medium (5)</span>
            <span>Extreme (10)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
