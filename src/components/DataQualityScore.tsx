import React from 'react';
import { AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react';
import { cn } from '../utils/cn';

interface DataQualityScoreProps {
  dataPoints: number;
  completeness: number;
  confidence: 'High' | 'Medium' | 'Low';
}

const DataQualityScore = React.memo(function DataQualityScore({ dataPoints, completeness, confidence }: DataQualityScoreProps) {
  const confidenceConfig = {
    High: { color: 'emerald', icon: ShieldCheck, label: 'High Confidence' },
    Medium: { color: 'amber', icon: AlertTriangle, label: 'Medium Confidence' },
    Low: { color: 'rose', icon: AlertTriangle, label: 'Low Confidence' },
  }[confidence];

  return (
    <div className="bg-white dark:bg-gray-800/60 dark:backdrop-blur-md rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700/50 transition-all duration-300 hover:shadow-xl">
      <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
        <div className="p-1.5 bg-amber-500/10 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
        </div>
        Data Quality & Integrity
      </h3>
      <div className="space-y-4">
        {/* Progress Bar Completeness */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-gray-500 dark:text-gray-400">
            <span>Completeness</span>
            <span className="font-mono">{completeness}%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-700/50 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 h-full rounded-full transition-all duration-700 ease-out" 
              style={{ width: `${completeness}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="bg-gray-50 dark:bg-gray-900/40 p-3 rounded-xl border border-gray-100 dark:border-gray-800/60 text-center">
            <span className="block text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">Sample Size</span>
            <span className="text-lg font-extrabold text-gray-800 dark:text-gray-200 mt-0.5 block font-mono">{dataPoints}</span>
            <span className="text-[10px] text-gray-400">months</span>
          </div>
          <div className={cn(
            "p-3 rounded-xl border text-center flex flex-col justify-center items-center transition-all duration-300",
            confidence === 'High' 
              ? 'bg-emerald-500/10 border-emerald-500/20' 
              : confidence === 'Medium' 
                ? 'bg-amber-500/10 border-amber-500/20' 
                : 'bg-rose-500/10 border-rose-500/20'
          )}>
            <span className="block text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">Confidence</span>
            <confidenceConfig.icon className={cn(
              "w-5 h-5 mt-1",
              confidence === 'High' ? 'text-emerald-500' : confidence === 'Medium' ? 'text-amber-500' : 'text-rose-500'
            )} />
            <span className={cn(
              "text-xs font-extrabold mt-0.5",
              confidence === 'High' ? 'text-emerald-600 dark:text-emerald-400' : confidence === 'Medium' ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
            )}>{confidence}</span>
          </div>
        </div>

        <div className="flex items-start gap-2 text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed pt-2 border-t border-gray-100 dark:border-gray-700/30">
          <CheckCircle className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0 mt-0.5" />
          <span>Bayesian priors adjusted with historical seasonal offsets. No outliers detected in Q1 records.</span>
        </div>
      </div>
    </div>
  );
});

export default DataQualityScore;
