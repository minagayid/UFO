import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ComposedChart, Bar } from 'recharts'
import { 
  TrendingUp, DollarSign, AlertTriangle, BarChart3, Settings, LayoutDashboard, 
  Sparkles, Brain, Zap, Globe, Shield, ArrowUpRight, ArrowDownRight, 
  RefreshCw, Download, Share2, Maximize2, Minimize2, ChevronRight, Play,
  Cpu, Database, Activity, Target, Lightbulb, MessageSquare
} from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import toast, { Toaster } from 'react-hot-toast'

function cn(...inputs: string[]) {
  return twMerge(clsx(inputs))
}

// Types
interface FinancialDataPoint {
  month: string
  actual?: number | null
  forecast?: number | null
  low50?: number
  high50?: number
  low80?: number
  high80?: number
  amount?: number
  category?: string
}

interface KPIMetric {
  title: string
  value: string
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  confidence?: number
  aiInsight?: string
}

interface WidgetConfig {
  id: string
  type: 'kpi' | 'chart' | 'insight' | 'scenario' | 'data-quality'
  title: string
  data?: any
  config?: any
}

interface LLMSuggestion {
  type: 'forecast' | 'alert' | 'recommendation' | 'insight'
  message: string
  confidence: number
  action?: string
}

// Enhanced sample data with more metrics
const revenueData: FinancialDataPoint[] = [
  { month: 'Jan', actual: 120000, forecast: 118000, low50: 110000, high50: 126000, low80: 100000, high80: 136000 },
  { month: 'Feb', actual: 132000, forecast: 130000, low50: 122000, high50: 138000, low80: 112000, high80: 148000 },
  { month: 'Mar', actual: 145000, forecast: 142000, low50: 134000, high50: 150000, low80: 124000, high80: 160000 },
  { month: 'Apr', actual: null, forecast: 155000, low50: 145000, high50: 165000, low80: 135000, high80: 175000 },
  { month: 'May', actual: null, forecast: 168000, low50: 156000, high50: 180000, low80: 144000, high80: 192000 },
  { month: 'Jun', actual: null, forecast: 182000, low50: 168000, high50: 196000, low80: 154000, high80: 210000 },
]

const expenseData: FinancialDataPoint[] = [
  { month: 'Jan', amount: 85000, category: 'Operations' },
  { month: 'Feb', amount: 92000, category: 'Operations' },
  { month: 'Mar', amount: 88000, category: 'Operations' },
  { month: 'Apr', amount: 95000, category: 'Operations' },
  { month: 'May', amount: 98000, category: 'Operations' },
  { month: 'Jun', amount: 102000, category: 'Operations' },
]

const cashFlowData = [
  { month: 'Jan', operating: 35000, investing: -15000, financing: 10000, net: 30000 },
  { month: 'Feb', operating: 40000, investing: -20000, financing: 5000, net: 25000 },
  { month: 'Mar', operating: 57000, investing: -10000, financing: -5000, net: 42000 },
  { month: 'Apr', operating: 60000, investing: -25000, financing: 0, net: 35000 },
  { month: 'May', operating: 70000, investing: -15000, financing: 10000, net: 65000 },
  { month: 'Jun', operating: 80000, investing: -30000, financing: -10000, net: 40000 },
]

// Mock AI/LLM suggestions
const mockAISuggestions: LLMSuggestion[] = [
  {
    type: 'forecast',
    message: 'Revenue trajectory suggests 18% QoQ growth. Consider scaling infrastructure to meet demand.',
    confidence: 0.87,
    action: 'View Details'
  },
  {
    type: 'alert',
    message: 'Expense ratio trending above industry benchmark. Review operational efficiency.',
    confidence: 0.92,
    action: 'Analyze Expenses'
  },
  {
    type: 'recommendation',
    message: 'Cash runway optimal. Strategic investment opportunity identified in Q3.',
    confidence: 0.79,
    action: 'Explore Options'
  }
]

interface KPICardProps {
  title: string
  value: string
  change?: string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  confidence?: number
  aiInsight?: string
}

function KPICard({ title, value, change, icon, trend = 'neutral', confidence, aiInsight }: KPICardProps) {
  return (
    <motion.div 
      className={cn(
        "glass-panel rounded-xl p-6 cursor-pointer transition-all duration-300",
        "hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20"
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-400 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-bold mt-2 gradient-text">{value}</p>
          {change && (
            <div className="flex items-center gap-2 mt-2">
              <span className={cn(
                "flex items-center text-sm font-medium px-2 py-1 rounded-full",
                trend === 'up' ? 'bg-green-500/20 text-green-400' : 
                trend === 'down' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'
              )}>
                {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : 
                 trend === 'down' ? <ArrowDownRight className="w-3 h-3 mr-1" /> : null}
                {change}
              </span>
              {confidence && (
                <span className="text-xs text-gray-500 ml-2">
                  {(confidence * 100).toFixed(0)}% confidence
                </span>
              )}
            </div>
          )}
          {aiInsight && (
            <div className="mt-3 flex items-start gap-2 p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <Brain className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-purple-300">{aiInsight}</p>
            </div>
          )}
        </div>
        <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
          {icon}
        </div>
      </div>
    </motion.div>
  )
}

interface DataQualityScoreProps {
  dataPoints: number
  completeness: number
  confidence: 'High' | 'Medium' | 'Low'
}

function DataQualityScore({ dataPoints, completeness, confidence }: DataQualityScoreProps) {
  return (
    <motion.div 
      className="glass-panel rounded-xl p-5"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-cyan-400">
        <Database className="w-4 h-4" />
        <span className="gradient-text">Data Quality Score</span>
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Data Points:</span>
          <span className="font-bold text-white">{dataPoints}</span>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Completeness:</span>
            <span className="font-medium text-cyan-400">{completeness}%</span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${completeness}%` }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Confidence:</span>
          <span className={cn(
            "px-3 py-1 rounded-full text-sm font-medium",
            confidence === 'High' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
            confidence === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 
            'bg-red-500/20 text-red-400 border border-red-500/30'
          )}>
            {confidence}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

interface AISuggestionCardProps {
  suggestion: LLMSuggestion
  onAction?: () => void
}

function AISuggestionCard({ suggestion, onAction }: AISuggestionCardProps) {
  const getIcon = () => {
    switch (suggestion.type) {
      case 'forecast': return <TrendingUp className="w-5 h-5" />
      case 'alert': return <AlertTriangle className="w-5 h-5" />
      case 'recommendation': return <Lightbulb className="w-5 h-5" />
      default: return <Sparkles className="w-5 h-5" />
    }
  }

  const getColor = () => {
    switch (suggestion.type) {
      case 'forecast': return 'from-cyan-500 to-blue-500'
      case 'alert': return 'from-orange-500 to-red-500'
      case 'recommendation': return 'from-purple-500 to-pink-500'
      default: return 'from-green-500 to-emerald-500'
    }
  }

  return (
    <motion.div 
      className="glass-panel rounded-xl p-5 border-l-4 border-l-cyan-500"
      whileHover={{ x: 5 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-lg bg-gradient-to-br", getColor())}>
          {getIcon()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-medium text-purple-400 uppercase tracking-wider">AI Insight</span>
            <span className="text-xs text-gray-500 ml-auto">
              {(suggestion.confidence * 100).toFixed(0)}% confidence
            </span>
          </div>
          <p className="text-sm text-gray-300 mb-3">{suggestion.message}</p>
          {suggestion.action && (
            <button 
              onClick={onAction}
              className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              {suggestion.action} <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function RevenueForecastChart() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5" />
        Revenue Forecast with Uncertainty Bands
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={revenueData}>
          <defs>
            <linearGradient id="color80" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#93c5fd" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#93c5fd" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="color50" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.2}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="high80" stroke="none" fill="url(#color80)" name="80% CI" />
          <Area type="monotone" dataKey="low80" stroke="none" fill="url(#color80)" name="80% CI" />
          <Area type="monotone" dataKey="high50" stroke="none" fill="url(#color50)" name="50% CI" />
          <Area type="monotone" dataKey="low50" stroke="none" fill="url(#color50)" name="50% CI" />
          <Line type="monotone" dataKey="forecast" stroke="#2563eb" strokeWidth={2} name="Forecast" dot={{ r: 4 }} />
          <Line type="monotone" dataKey="actual" stroke="#16a34a" strokeWidth={2} name="Actual" dot={{ r: 4 }} />
        </AreaChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-500 mt-2">
        * Forecasts include 50%, 80% credible intervals. Wider bands indicate higher uncertainty due to limited data.
      </p>
    </div>
  )
}

function ExpenseChart() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5" />
        Expense Trends
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={expenseData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="amount" stroke="#dc2626" strokeWidth={2} name="Expenses" dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function App() {
  const [activeView, setActiveView] = useState<'dashboard' | 'canvas'>('dashboard')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">UFO</h1>
                <p className="text-xs text-gray-500">Ultimate Financial Operations</p>
              </div>
            </div>
            <nav className="flex gap-2">
              <button
                onClick={() => setActiveView('dashboard')}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  activeView === 'dashboard' 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                )}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveView('canvas')}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  activeView === 'canvas' 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                )}
              >
                Canvas
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-md">
                <Settings className="w-5 h-5" />
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'dashboard' ? (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                title="Monthly Revenue"
                value="$145,000"
                change="+12% vs last month"
                trend="up"
                icon={<DollarSign className="w-6 h-6 text-blue-600" />}
              />
              <KPICard
                title="Monthly Expenses"
                value="$88,000"
                change="-3% vs last month"
                trend="up"
                icon={<TrendingUp className="w-6 h-6 text-green-600" />}
              />
              <KPICard
                title="Net Profit Margin"
                value="39.3%"
                change="+5.2% vs last month"
                trend="up"
                icon={<BarChart3 className="w-6 h-6 text-purple-600" />}
              />
              <KPICard
                title="Cash Runway"
                value="18 months"
                change="Stable"
                trend="neutral"
                icon={<AlertTriangle className="w-6 h-6 text-orange-600" />}
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RevenueForecastChart />
              </div>
              <div className="space-y-6">
                <DataQualityScore 
                  dataPoints={12} 
                  completeness={85} 
                  confidence="Medium" 
                />
                <ExpenseChart />
              </div>
            </div>

            {/* What-If Scenario Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4">What-If Scenario Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Revenue Growth Rate</label>
                  <input 
                    type="range" 
                    min="-20" 
                    max="50" 
                    defaultValue="10"
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>-20%</span>
                    <span>10%</span>
                    <span>+50%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Expense Reduction</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="30" 
                    defaultValue="5"
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>5%</span>
                    <span>30%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Market Volatility</label>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    defaultValue="5"
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Customizable Canvas Dashboard</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Drag and drop widgets to create your custom financial dashboard. 
              Layout state is persisted as JSON for easy sharing between CEO/CFO views.
            </p>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center">
              <LayoutDashboard className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Canvas workspace - drag widgets here</p>
              <p className="text-sm text-gray-400 mt-2">
                (Full implementation requires react-grid-layout + dnd-kit)
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            UFO - Ultimate Financial Operations v0.1.0 | Built with Bayesian forecasting & explicit uncertainty quantification
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
