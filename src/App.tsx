import { useState, useMemo, useEffect, useCallback, memo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, DollarSign, AlertTriangle, BarChart3, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { cn } from './utils/cn';

// Types & Mock Data
import { ScenarioParameters, RevenuePoint, ExpensePoint } from './types/financial';
import { baseRevenueData, baseExpenseData } from './data/mockData';

// Calculations
import { calculateRevenueForecast, calculateExpenses, calculateKPIs } from './utils/calculations';

// Custom Components
import KPICard from './components/KPICard';
import DataQualityScore from './components/DataQualityScore';
import ScenarioAnalysis from './components/ScenarioAnalysis';
import AICopilot from './components/AICopilot';
import CanvasDashboard from './components/CanvasDashboard';

// ─── Memoized Chart Components ───

const tooltipStyle = {
  backgroundColor: 'rgba(15, 23, 42, 0.96)',
  borderColor: 'rgba(99, 102, 241, 0.2)',
  borderRadius: '12px',
  fontSize: '12px',
  color: '#e2e8f0',
  padding: '10px 14px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
};

const formatCurrency = (value: number | string) => typeof value === 'number' ? `$${value.toLocaleString()}` : String(value);

const RevenueForecastChart = memo(function RevenueForecastChart({ data }: { data: RevenuePoint[] }) {
  return (
    <div className="bg-white dark:bg-gray-800/60 dark:backdrop-blur-md rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700/50 transition-all duration-300 hover:shadow-xl">
      <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-5 flex items-center gap-2">
        <div className="p-1.5 bg-indigo-500/10 rounded-lg">
          <TrendingUp className="w-4 h-4 text-indigo-500" />
        </div>
        Revenue Forecast with Uncertainty Bands
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 10 }}>
          <defs>
            <linearGradient id="color80" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.12}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.01}/>
            </linearGradient>
            <linearGradient id="color50" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#818cf8" stopOpacity={0.22}/>
              <stop offset="95%" stopColor="#818cf8" stopOpacity={0.03}/>
            </linearGradient>
            <linearGradient id="forecastLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1"/>
              <stop offset="100%" stopColor="#a78bfa"/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.08)" />
          <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} width={52} />
          <Tooltip contentStyle={tooltipStyle} formatter={formatCurrency} />
          <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '12px', opacity: 0.8 }} />
          <Area type="monotone" dataKey="high80" stroke="none" fill="url(#color80)" name="80% CI Upper" />
          <Area type="monotone" dataKey="low80" stroke="none" fill="url(#color80)" name="80% CI Lower" />
          <Area type="monotone" dataKey="high50" stroke="none" fill="url(#color50)" name="50% CI Upper" />
          <Area type="monotone" dataKey="low50" stroke="none" fill="url(#color50)" name="50% CI Lower" />
          <Line type="monotone" dataKey="forecast" stroke="url(#forecastLine)" strokeWidth={2.5} name="Forecast" dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#312e81' }} activeDot={{ r: 6, stroke: '#6366f1', strokeWidth: 2 }} />
          <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2.5} name="Actual" dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#064e3b' }} activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }} connectNulls={false} />
        </AreaChart>
      </ResponsiveContainer>
      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-3 leading-normal">
        * Bayesian credible intervals at 50% and 80%. Wider bands = higher uncertainty. Jan–Mar show actuals.
      </p>
    </div>
  );
});

const ExpenseChart = memo(function ExpenseChart({ data }: { data: ExpensePoint[] }) {
  return (
    <div className="bg-white dark:bg-gray-800/60 dark:backdrop-blur-md rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700/50 transition-all duration-300 hover:shadow-xl">
      <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
        <div className="p-1.5 bg-rose-500/10 rounded-lg">
          <BarChart3 className="w-4 h-4 text-rose-500" />
        </div>
        Operating Expense Trends
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.08)" />
          <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} width={48} />
          <Tooltip contentStyle={tooltipStyle} formatter={formatCurrency} />
          <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '8px', opacity: 0.8 }} />
          <Line type="monotone" dataKey="amount" stroke="#f43f5e" strokeWidth={2.5} name="Expenses" dot={{ r: 4, fill: '#f43f5e', strokeWidth: 2, stroke: '#881337' }} activeDot={{ r: 6, stroke: '#f43f5e', strokeWidth: 2 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

// ─── Constants ───

const DEFAULT_PARAMS: ScenarioParameters = {
  growthRate: 10,
  expenseReduction: 5,
  volatility: 5
};

// ─── Main App ───

function App() {
  const [activeView, setActiveView] = useState<'dashboard' | 'canvas'>('dashboard');
  const [darkMode, setDarkMode] = useState(true);
  const [parameters, setParameters] = useState<ScenarioParameters>(DEFAULT_PARAMS);

  // Apply dark mode theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Recalculate financial projections on parameter changes (memoized)
  const calculatedRevenue = useMemo(() => calculateRevenueForecast(baseRevenueData, parameters), [parameters]);
  const calculatedExpenses = useMemo(() => calculateExpenses(baseExpenseData, parameters), [parameters]);
  const kpis = useMemo(() => calculateKPIs(calculatedRevenue, calculatedExpenses), [calculatedRevenue, calculatedExpenses]);

  const confidenceRating = useMemo((): 'High' | 'Medium' | 'Low' => {
    if (parameters.volatility < 4) return 'High';
    if (parameters.volatility <= 7) return 'Medium';
    return 'Low';
  }, [parameters.volatility]);

  // Stable callback refs for child components (prevents re-renders)
  const handleResetSliders = useCallback(() => setParameters(DEFAULT_PARAMS), []);
  const handleSetParameters = useCallback((p: ScenarioParameters) => setParameters(p), []);
  const handleSetDashboard = useCallback(() => setActiveView('dashboard'), []);
  const handleSetCanvas = useCallback(() => setActiveView('canvas'), []);
  const handleToggleDarkMode = useCallback(() => setDarkMode(prev => !prev), []);

  // June Forecast context for AI copilot
  const juneForecast = calculatedRevenue[5].forecast;
  const juneLow80 = calculatedRevenue[5].low80;
  const juneHigh80 = calculatedRevenue[5].high80;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* ─── Header ─── */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-30 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25 animate-glow-pulse">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">UFO</h1>
                <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Ultimate Financial Operations</p>
              </div>
            </div>
            <nav className="flex items-center gap-1.5">
              <button
                onClick={handleSetDashboard}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200",
                  activeView === 'dashboard' 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                Dashboard
              </button>
              <button
                onClick={handleSetCanvas}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200",
                  activeView === 'canvas' 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                Canvas
              </button>
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
              <button 
                onClick={handleToggleDarkMode}
                className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {darkMode ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-indigo-500" />}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'dashboard' ? (
          <div className="space-y-6">
            {/* KPI Cards Row — staggered entrance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="animate-slide-up stagger-1">
                <KPICard title="Projected June Revenue" value={kpis.revenue.value} change={kpis.revenue.change} trend={kpis.revenue.trend} icon={<DollarSign className="w-5 h-5" />} />
              </div>
              <div className="animate-slide-up stagger-2">
                <KPICard title="Projected June Expenses" value={kpis.expenses.value} change={kpis.expenses.change} trend={kpis.expenses.trend} icon={<BarChart3 className="w-5 h-5" />} />
              </div>
              <div className="animate-slide-up stagger-3">
                <KPICard title="Projected Net Margin" value={kpis.profitMargin.value} change={kpis.profitMargin.change} trend={kpis.profitMargin.trend} icon={<TrendingUp className="w-5 h-5" />} />
              </div>
              <div className="animate-slide-up stagger-4">
                <KPICard title="Projected Cash Runway" value={kpis.runway.value} change={kpis.runway.change} trend={kpis.runway.trend} icon={<AlertTriangle className="w-5 h-5" />} />
              </div>
            </div>

            {/* Charts and Gauge Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
              <div className="lg:col-span-2">
                <RevenueForecastChart data={calculatedRevenue} />
              </div>
              <div className="space-y-6">
                <DataQualityScore dataPoints={12} completeness={85} confidence={confidenceRating} />
                <ExpenseChart data={calculatedExpenses} />
              </div>
            </div>

            {/* What-If Scenario Section */}
            <div className="animate-fade-in">
              <ScenarioAnalysis parameters={parameters} onChange={handleSetParameters} onReset={handleResetSliders} />
            </div>
          </div>
        ) : (
          <CanvasDashboard
            kpis={{
              revenue:      <KPICard title="Projected June Revenue"  value={kpis.revenue.value}       change={kpis.revenue.change}       trend={kpis.revenue.trend}       icon={<DollarSign className="w-5 h-5" />} />,
              expenses:     <KPICard title="Projected June Expenses" value={kpis.expenses.value}      change={kpis.expenses.change}      trend={kpis.expenses.trend}      icon={<BarChart3 className="w-5 h-5" />} />,
              profitMargin: <KPICard title="Projected Net Margin"    value={kpis.profitMargin.value}  change={kpis.profitMargin.change}  trend={kpis.profitMargin.trend}  icon={<TrendingUp className="w-5 h-5" />} />,
              runway:       <KPICard title="Projected Cash Runway"   value={kpis.runway.value}        change={kpis.runway.change}        trend={kpis.runway.trend}        icon={<AlertTriangle className="w-5 h-5" />} />,
            }}
            charts={{
              revenueForecast: <RevenueForecastChart data={calculatedRevenue} />,
              expenseTrend: <ExpenseChart data={calculatedExpenses} />,
            }}
            widgets={{
              dataQuality: <DataQualityScore dataPoints={12} completeness={85} confidence={confidenceRating} />,
              whatIfSliders: <ScenarioAnalysis parameters={parameters} onChange={handleSetParameters} onReset={handleResetSliders} />,
            }}
          />
        )}
      </main>

      {/* Floating AI Financial Advisor Copilot */}
      <AICopilot
        growthRate={parameters.growthRate}
        expenseReduction={parameters.expenseReduction}
        volatility={parameters.volatility}
        revenueKPI={kpis.revenue}
        expenseKPI={kpis.expenses}
        profitKPI={kpis.profitMargin}
        runwayKPI={kpis.runway}
        juneForecast={juneForecast}
        low80={juneLow80}
        high80={juneHigh80}
      />

      {/* ─── Footer ─── */}
      <footer className="border-t border-slate-200/50 dark:border-slate-800/40 mt-16 py-6">
        <p className="text-center text-xs text-slate-400 dark:text-slate-500 max-w-7xl mx-auto px-4">
          UFO — Ultimate Financial Operations v1.1.0 · Bayesian forecasting · Dynamic scenario analysis · Gemini AI Copilot
        </p>
      </footer>
    </div>
  );
}

export default App;
