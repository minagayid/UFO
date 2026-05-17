import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Bot, Sparkles, Key, Terminal, Check, Info } from 'lucide-react';
import { cn } from '../utils/cn';
import { ChatMessage } from '../types/financial';

interface AICopilotProps {
  growthRate: number;
  expenseReduction: number;
  volatility: number;
  revenueKPI: { value: string; change: string; trend: 'up' | 'down' | 'neutral' };
  expenseKPI: { value: string; change: string; trend: 'up' | 'down' | 'neutral' };
  profitKPI: { value: string; change: string; trend: 'up' | 'down' | 'neutral' };
  runwayKPI: { value: string; change: string; trend: 'up' | 'down' | 'neutral' };
  juneForecast: number;
  low80: number;
  high80: number;
}

export default function AICopilot({
  growthRate,
  expenseReduction,
  volatility,
  revenueKPI,
  expenseKPI,
  profitKPI,
  runwayKPI,
  juneForecast,
  low80,
  high80,
}: AICopilotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState<string[]>([]);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('ufo_gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setIsSaved(true);
    }

    // Add initial system and welcoming messages
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: `👋 Hello! I am **UFO-AI**, your advanced Financial Intelligence Copilot. 

I have deep real-time context on your dashboard settings:
* **Growth rate**: ${growthRate}%
* **Expense reduction**: ${expenseReduction}%
* **Volatility level**: ${volatility}/10
* **Projected Cash Runway**: ${runwayKPI.value}

How can I help you analyze your operations today? Feel free to ask about runway sustainability, profit maximization, or select one of the quick audits below!`,
        timestamp: new Date(),
      },
    ]);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking, thinkingSteps]);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('ufo_gemini_api_key', apiKey.trim());
      setIsSaved(true);
      setShowConfig(false);
    } else {
      localStorage.removeItem('ufo_gemini_api_key');
      setIsSaved(false);
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem('ufo_gemini_api_key');
    setApiKey('');
    setIsSaved(false);
  };

  const generateSimulationResponse = (promptType: string, userText?: string): { content: string; steps: string[] } => {
    // Highly sophisticated simulation response based on current sliders
    const steps = [
      '🔍 Accessing dashboard financial state & database...',
      `📊 Analyzing what-if parameters: Growth Rate (${growthRate}%), Expense Cut (${expenseReduction}%), Volatility (${volatility}/10)...`,
      `🧮 Calculating June projections: Revenue ${revenueKPI.value}, Expenses ${expenseKPI.value}...`,
      `📈 Evaluating uncertainty ranges: 80% Confidence Interval ($${low80.toLocaleString()} - $${high80.toLocaleString()})...`,
      '💡 Compiling strategic advisory recommendations & scenario analysis...'
    ];

    let content = '';

    if (promptType === 'risk' || (userText && userText.toLowerCase().includes('risk'))) {
      const riskLevel = volatility > 7 ? 'HIGH' : volatility > 4 ? 'MEDIUM' : 'LOW';
      content = `### ⚠️ Risk & Volatility Assessment (Simulation Mode)

I have analyzed your operational model under **${volatility}/10 Market Volatility** (classified as **${riskLevel}** Risk).

#### **1. Bayesian Forecasting Range**
* **Projected June Revenue**: **${revenueKPI.value}**
* **80% Credible Range**: **$${low80.toLocaleString()} to $${high80.toLocaleString()}**
* **Statistical Spread**: The volatility slider stretches the margin of error. Under a high volatility level, the spread is **$${(high80 - low80).toLocaleString()}**, representing a significant downside danger of **$${low80.toLocaleString()}** if external headwinds materialize.

#### **2. Strategic Risk Breakdown**
${volatility > 6 
  ? `* **High Forecast Spread**: The widening confidence bands indicate that your revenue prediction is highly sensitive. Standard planning models should NOT rely on the base forecast.
* **Sensitivity Warning**: A cash runway of **${runwayKPI.value}** is vulnerable. If revenue falls to the 80% low band ($${low80.toLocaleString()}), your net margin will contract severely.` 
  : `* **Stable Outlook**: With low-to-moderate volatility, the forecast is highly reliable.
* **Resilience Profile**: Your financial runway of **${runwayKPI.value}** is structurally robust against minor fluctuations.`
}

#### **3. Actionable CFO Directives**
1. **Hedge Volatility**: Establish a dynamic cash buffer. With **${runwayKPI.value}** of runway, you have room to optimize.
2. **Stress-Testing**: Prepare a secondary baseline model set to the bottom 80% confidence bound ($${low80.toLocaleString()}) to ensure operational viability under extreme market stress.`;
    } 
    
    else if (promptType === 'runway' || (userText && userText.toLowerCase().includes('runway'))) {
      const runwayNum = parseFloat(runwayKPI.value);
      content = `### 📊 Capital Runway Audit (Simulation Mode)

Your current Projected Runway is **${runwayKPI.value}**, calculated with a base reserve of **$1,600,000** and projected monthly operational expenditures of **${expenseKPI.value}** (incorporating a **${expenseReduction}%** reduction).

#### **Key Metrics Audit**
* **Current Monthly Burn**: **${expenseKPI.value}** (${expenseKPI.change})
* **Gross Savings Rate**: You have successfully trimmed future expenditures by **${expenseReduction}%**, yielding an estimated monthly savings of **$${Math.round(88000 * expenseReduction / 100).toLocaleString()}**.
* **Financial Health**: ${runwayNum >= 18 
  ? '🟢 **EXCELLENT**. A runway of 18+ months grants high agility and provides sufficient buffer to pursue product-led growth without capital raise pressure.'
  : runwayNum >= 12 
    ? '🟡 **STABLE**. A 12-18 month runway is the standard safety band. Focus on stabilizing revenue growth.'
    : '🔴 **WARNING**. Capital exhaustion is less than 12 months away. High-priority cost containment is required.'
}

#### **Runway Extension Recommendations**
1. **Scale Expense Reduction**: Increasing your Expense Reduction slider to **${Math.min(30, expenseReduction + 10)}%** would lower monthly spend to **$${Math.round(88000 * (1 - Math.min(30, expenseReduction + 10) / 100)).toLocaleString()}** and extend your runway to **${(1600000 / (88000 * (1 - Math.min(30, expenseReduction + 10) / 100))).toFixed(1)} months**.
2. **Growth Coupling**: Ensure that your **${growthRate}%** revenue growth matches or exceeds your burn increase. Right now, your net profit margin is sitting at **${profitKPI.value}** (${profitKPI.change}).`;
    } 
    
    else if (promptType === 'growth' || (userText && userText.toLowerCase().includes('growth') || userText?.toLowerCase().includes('optimize'))) {
      content = `### 💡 Strategic Growth Optimization (Simulation Mode)

I have formulated a strategic growth scenario by cross-referencing your **${growthRate}% Revenue Growth** with your **${expenseReduction}% Expense Reduction**.

#### **Performance Matrix**
* **Projected June Revenue**: **${revenueKPI.value}**
* **Projected Monthly Expense**: **${expenseKPI.value}**
* **Net Profit Margin**: **${profitKPI.value}** (currently **${profitKPI.change}**)

#### **Dynamic Recommendations**
1. **Leverage the Efficiency Curve**: You are operating at a **${profitKPI.value}** profit margin. This is highly efficient. Your expense cuts of **${expenseReduction}%** have offset lower growth projections.
2. **Reinvest in High-ROI Channels**: Since your Cash Runway is **${runwayKPI.value}**, you can afford to re-allocate 5% of your cost savings directly into growth marketing, raising your growth projection slider to boost bottom-line forecasted revenue.
3. **Volatility Mitigation**: Given a volatility of **${volatility}/10**, lock in long-term contracts now to protect the projected revenue from seasonal dips.`;
    } 
    
    else {
      content = `### 🤖 Financial Intelligence Response (Simulation Mode)

Thank you for your question: *"_${userText || 'Analyze current operations'}_"*

I have processed this query using the real-time financial variables of the UFO system:

#### **Current Operating Blueprint**
* **Growth Rate**: \`${growthRate}%\` | **Expense Reduction**: \`${expenseReduction}%\` | **Market Volatility**: \`${volatility}/10\`
* **Target Projected Revenue**: **${revenueKPI.value}** (${revenueKPI.change})
* **Target Projected Expense**: **${expenseKPI.value}** (${expenseKPI.change})
* **Projected Margin**: **${profitKPI.value}**
* **Runway Projection**: **${runwayKPI.value}**

#### **Observations**
Based on these inputs, your financial health is **exceptionally strong**. The net margin shift (**${profitKPI.change}**) indicates a highly profitable trajectory. The Bayesian forecast model projects a June target of **${revenueKPI.value}**, with a lower-bound risk buffer of **$${low80.toLocaleString()}**.

*To see real, unstructured, state-of-the-art AI reasoning, click the **key icon** above to add a free Gemini API key from Google AI Studio. It takes under a minute!*`;
    }

    return { content, steps };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    if (!textToSend) {
      setInputMessage('');
    }

    const userMsgId = Date.now().toString();
    const newUserMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setIsThinking(true);
    setThinkingSteps([]);
    setActiveStepIndex(0);

    const isAction = ['risk', 'runway', 'growth'].includes(text);

    // If using the real API Key
    if (isSaved && apiKey) {
      try {
        const steps = [
          '🔍 Accessing dashboard financial state & database...',
          `📊 Compiling live dashboard context (Growth: ${growthRate}%, Cut: ${expenseReduction}%, Volatility: ${volatility}/10)...`,
          '📡 Initiating secure connection with Google Gemini 1.5 Flash Free-Tier...',
          '🧮 Running mathematical models & confidence intervals...',
          '💡 Generating strategic financial feedback...'
        ];

        // Animate thinking steps
        for (let i = 0; i < steps.length; i++) {
          setThinkingSteps((prev) => [...prev, steps[i]]);
          setActiveStepIndex(i);
          await new Promise((res) => setTimeout(res, 400));
        }

        const systemContext = `You are UFO-AI, an expert, elite, and proactive AI Financial Analyst and Strategic Advisor.
You are helping the CFO/CEO analyze their Ultimate Financial Operations (UFO) dashboard.

Here is the current real-time financial state from their live dashboard:
- Historical Actuals (Q1):
  * Jan Revenue: $120,000 | Jan Expenses: $85,000 (Operations)
  * Feb Revenue: $132,000 | Feb Expenses: $92,000 (Operations)
  * Mar Revenue: $145,000 | Mar Expenses: $88,000 (Operations)
- Current Projected June Metrics (based on What-If Scenario sliders):
  * Active Sliders:
    - Projected Revenue Growth Rate: ${growthRate}%
    - Projected Expense Reduction: ${expenseReduction}%
    - Market Volatility: ${volatility}/10
  * Live Projections (June):
    - Projected June Revenue: ${revenueKPI.value} (${revenueKPI.change})
    - Projected June Expenses: ${expenseKPI.value} (${expenseKPI.change})
    - Projected Net Profit Margin: ${profitKPI.value} (${profitKPI.change})
    - Projected Cash Runway: ${runwayKPI.value} (${runwayKPI.change})
  * Bayesian Uncertainty Range (June Forecast):
    - Base Forecast: $${juneForecast.toLocaleString()}
    - 80% Confidence Interval: $${low80.toLocaleString()} to $${high80.toLocaleString()}

Perform deep, highly professional, bayesian-informed financial reasoning, and provide structural, actionable insights. Use markdown tables, bold key metrics, and keep suggestions actionable and premium. Be concise but extremely thorough in reasoning. Explain calculations when appropriate.`;

        const userPrompt = isAction
          ? `Perform a specific analysis for the action: "${text}". Describe how the slider settings affect the forecasted values, list risks and opportunities, and provide CFO recommendations.`
          : text;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: `${systemContext}\n\nUser Question/Command: ${userPrompt}`
                    }
                  ]
                }
              ],
              generationConfig: {
                temperature: 0.6,
                maxOutputTokens: 1024,
              }
            })
          }
        );

        if (!response.ok) {
          throw new Error(`Gemini API Error: ${response.statusText} (${response.status})`);
        }

        const data = await response.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!responseText) {
          throw new Error('Received an empty response from Gemini. Please check your API key.');
        }

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: responseText,
            timestamp: new Date(),
            thinkingSteps: steps,
          },
        ]);
      } catch (err: any) {
        console.error(err);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: `⚠️ **API Execution Error**: ${err.message || 'Failed to contact Gemini API.'}\n\nFalling back to high-fidelity simulated response below:\n\n${generateSimulationResponse(text, text).content}`,
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsThinking(false);
        setActiveStepIndex(-1);
      }
    } else {
      // Simulation mode
      const { content, steps } = generateSimulationResponse(text, text);
      
      // Animate steps
      for (let i = 0; i < steps.length; i++) {
        setThinkingSteps((prev) => [...prev, steps[i]]);
        setActiveStepIndex(i);
        await new Promise((res) => setTimeout(res, 300));
      }

      setIsThinking(false);
      setActiveStepIndex(-1);
      
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content,
          timestamp: new Date(),
          thinkingSteps: steps,
        },
      ]);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 p-4 rounded-full shadow-2xl text-white flex items-center justify-center gap-2 group transition-all duration-300 transform hover:scale-105 z-40",
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100",
          "bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500",
          "after:absolute after:inset-0 after:rounded-full after:bg-blue-400 after:animate-ping after:opacity-10 after:-z-10"
        )}
      >
        <div className="relative">
          <Bot className="w-6 h-6 animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out font-semibold text-sm whitespace-nowrap">
          AI Copilot
        </span>
      </button>

      {/* Glassmorphic Chat Panel */}
      <div
        className={cn(
          "fixed bottom-6 right-6 w-full max-w-md h-[580px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/20 bg-gray-900/95 backdrop-blur-xl transition-all duration-500 ease-in-out z-50 transform origin-bottom-right",
          isOpen ? "scale-100 translate-y-0 opacity-100" : "scale-75 translate-y-12 opacity-0 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-purple-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30 text-blue-400">
              <Sparkles className="w-5 h-5 text-blue-400 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-white text-sm">UFO-AI Analyst</h3>
                <span className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded font-semibold",
                  isSaved ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                )}>
                  {isSaved ? 'Live LLM' : 'Simulation'}
                </span>
              </div>
              <p className="text-xs text-gray-400">Financial Strategic Reasoning Agent</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className={cn(
                "p-2 rounded-lg transition-colors border",
                showConfig 
                  ? "bg-white/10 border-white/20 text-white" 
                  : "hover:bg-white/5 border-transparent text-gray-400 hover:text-white"
              )}
              title="Configure Gemini API Key"
            >
              <Key className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* API Key Config Drawer */}
        {showConfig && (
          <div className="p-4 border-b border-white/10 bg-gray-950/80 text-white text-sm animate-fade-in space-y-3">
            <div className="flex items-start gap-2.5">
              <Info className="w-4.5 h-4.5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-xs text-gray-200">Connect Free-Tier Gemini API</p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Enter your free Gemini API Key to enable raw, live AI intelligence. Get a free API Key in 30 seconds at{' '}
                  <a
                    href="https://aistudio.google.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 underline hover:text-blue-300 font-semibold"
                  >
                    Google AI Studio
                  </a>.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveKey} className="flex gap-2">
              <input
                type="password"
                placeholder="Paste Gemini API Key here..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1 bg-gray-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
              >
                Save
              </button>
              {isSaved && (
                <button
                  type="button"
                  onClick={handleClearKey}
                  className="bg-red-950/50 border border-red-500/20 text-red-400 hover:bg-red-950/80 text-xs px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  Clear
                </button>
              )}
            </form>
          </div>
        )}

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex flex-col max-w-[85%] rounded-xl p-3 text-sm leading-relaxed",
                msg.role === 'user'
                  ? "bg-blue-600 text-white ml-auto rounded-tr-none"
                  : "bg-white/5 border border-white/10 text-gray-200 mr-auto rounded-tl-none"
              )}
            >
              {msg.role !== 'user' && msg.thinkingSteps && msg.thinkingSteps.length > 0 && (
                <details className="mb-2 border-b border-white/10 pb-1.5 text-xs group">
                  <summary className="cursor-pointer text-blue-400 font-semibold flex items-center gap-1 select-none hover:text-blue-300">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>View AI Reasoning Chain</span>
                  </summary>
                  <div className="mt-2 space-y-1.5 font-mono text-gray-400 bg-black/40 p-2 rounded border border-white/5 text-[10px]">
                    {msg.thinkingSteps.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </details>
              )}
              <div className="whitespace-pre-wrap font-sans prose prose-invert prose-sm max-w-none text-xs leading-5">
                {msg.content}
              </div>
              <span className="text-[9px] text-gray-500 mt-1 self-end font-mono">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}

          {/* Thinking Animation */}
          {isThinking && (
            <div className="flex flex-col max-w-[85%] bg-white/5 border border-white/10 rounded-xl rounded-tl-none p-3 text-gray-200 mr-auto space-y-3">
              <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold animate-pulse">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>AI Reasoner Thinking...</span>
              </div>
              
              {thinkingSteps.length > 0 && (
                <div className="space-y-1 font-mono text-gray-400 bg-black/40 p-2 rounded border border-white/5 text-[10px] animate-fade-in">
                  {thinkingSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "flex items-center gap-1.5 transition-opacity duration-300",
                        idx === activeStepIndex ? "opacity-100 text-blue-300" : "opacity-60"
                      )}
                    >
                      {idx === activeStepIndex ? (
                        <span className="w-3 h-3 flex items-center justify-center">
                          <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1 w-1 bg-blue-500"></span>
                        </span>
                      ) : (
                        <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                      )}
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Action Prompts */}
        <div className="px-4 py-2 bg-gray-950/40 border-t border-white/5 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none scroll-smooth">
          <button
            onClick={() => handleSendMessage('risk')}
            disabled={isThinking}
            className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1"
          >
            ⚠️ Risk Assessment
          </button>
          <button
            onClick={() => handleSendMessage('runway')}
            disabled={isThinking}
            className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1"
          >
            📊 Runway Audit
          </button>
          <button
            onClick={() => handleSendMessage('growth')}
            disabled={isThinking}
            className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1"
          >
            💡 Growth Scenario
          </button>
        </div>

        {/* Footer Chat Input */}
        <div className="p-3 border-t border-white/10 bg-gray-950/90 flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={isThinking ? "Analyst is modeling..." : "Ask your financial assistant..."}
            disabled={isThinking}
            className="flex-1 bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isThinking || !inputMessage.trim()}
            className="p-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 text-white rounded-xl transition-all flex items-center justify-center shadow-lg disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}
