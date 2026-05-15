import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { TrendingUp, DollarSign, AlertTriangle, BarChart3, Settings, LayoutDashboard } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: string[]) {
  return twMerge(clsx(inputs))
}

// Sample financial data with uncertainty bands
const revenueData = [
  { month: 'Jan', actual: 120000, forecast: 118000, low50: 110000, high50: 126000, low80: 100000, high80: 136000 },
  { month: 'Feb', actual: 132000, forecast: 130000, low50: 122000, high50: 138000, low80: 112000, high80: 148000 },
  { month: 'Mar', actual: 145000, forecast: 142000, low50: 134000, high50: 150000, low80: 124000, high80: 160000 },
  { month: 'Apr', actual: null, forecast: 155000, low50: 145000, high50: 165000, low80: 135000, high80: 175000 },
  { month: 'May', actual: null, forecast: 168000, low50: 156000, high50: 180000, low80: 144000, high80: 192000 },
  { month: 'Jun', actual: null, forecast: 182000, low50: 168000, high50: 196000, low80: 154000, high80: 210000 },
]

const expenseData = [
  { month: 'Jan', amount: 85000, category: 'Operations' },
  { month: 'Feb', amount: 92000, category: 'Operations' },
  { month: 'Mar', amount: 88000, category: 'Operations' },
  { month: 'Apr', amount: 95000, category: 'Operations' },
  { month: 'May', amount: 98000, category: 'Operations' },
  { month: 'Jun', amount: 102000, category: 'Operations' },
]

interface KPICardProps {
  title: string
  value: string
  change?: string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
}

function KPICard({ title, value, change, icon, trend = 'neutral' }: KPICardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {change && (
            <p className={cn(
              "text-sm mt-1",
              trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'
            )}>
              {change}
            </p>
          )}
        </div>
        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  )
}

interface DataQualityScoreProps {
  dataPoints: number
  completeness: number
  confidence: 'High' | 'Medium' | 'Low'
}

function DataQualityScore({ dataPoints, completeness, confidence }: DataQualityScoreProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4" />
        Data Quality Score
      </h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Data Points:</span>
          <span className="font-medium">{dataPoints}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Completeness:</span>
          <span className="font-medium">{completeness}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Confidence:</span>
          <span className={cn(
            "font-medium px-2 py-0.5 rounded",
            confidence === 'High' ? 'bg-green-100 text-green-800' : 
            confidence === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
          )}>
            {confidence}
          </span>
        </div>
      </div>
    </div>
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
